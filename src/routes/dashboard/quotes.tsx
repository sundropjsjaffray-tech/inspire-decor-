import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QuoteBuilder } from "~/components/dashboard/QuoteBuilder";
import { QuoteDocument } from "~/components/dashboard/QuoteDocument";
import {
  Badge,
  Button,
  LoadingState,
  Modal,
  PageHeader,
  PriceTag,
  Table,
} from "~/components/ui";
import { getContactDetails } from "~/lib/services/content";
import { convertQuoteToBooking, getQuotes } from "~/lib/services/quotes";
import { useStore } from "~/lib/store";
import { quoteStatusMeta } from "~/lib/statusLabels";
import { formatDate } from "~/lib/util";
import type { ContactDetails } from "~/lib/data/site";
import type { Quote } from "~/lib/types";

export const Route = createFileRoute("/dashboard/quotes")({
  component: QuotesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    leadId: typeof search.leadId === "string" ? search.leadId : undefined,
  }),
});

function QuotesPage() {
  const { leadId } = Route.useSearch();
  const [mode, setMode] = useState<"list" | "builder">(leadId ? "builder" : "list");
  const [loaded, setLoaded] = useState(false);
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [viewing, setViewing] = useState<Quote | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const quotes = useStore((s) => s.quotes);
  const leads = useStore((s) => s.leads);
  const bookings = useStore((s) => s.bookings);

  useEffect(() => {
    let alive = true;
    Promise.all([getQuotes(), getContactDetails()]).then(([, c]) => {
      if (!alive) return;
      setContact(c);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const convert = async (quote: Quote) => {
    setConvertingId(quote.id);
    setBanner(null);
    try {
      const booking = await convertQuoteToBooking(quote.id);
      setBanner(
        `Booking ${booking.id} created for ${booking.eventName} — lead marked BOOKED and stock reserved.`
      );
    } catch (err) {
      setBanner(`Conversion failed: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setConvertingId(null);
    }
  };

  if (!loaded) {
    return (
      <>
        <PageHeader title="Quotes" eyebrow="Dashboard" subtitle="Build quotes from products and services, send them, and convert to bookings." />
        <LoadingState label="Loading quotes…" />
      </>
    );
  }

  if (mode === "builder") {
    return (
      <>
        <PageHeader
          title="Quote builder"
          eyebrow="Dashboard"
          subtitle="Compose products and services, review the live totals, then generate a client-ready document."
        />
        <QuoteBuilder
          key={leadId ?? "new"}
          initialLeadId={leadId}
          contact={contact ?? undefined}
          onBack={() => setMode("list")}
        />
      </>
    );
  }

  const rows = [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <PageHeader
        title="Quotes"
        eyebrow="Dashboard"
        subtitle="Build quotes from products and services, send them, and convert to bookings."
        actions={
          <Button onClick={() => setMode("builder")}>+ New Quote</Button>
        }
      />

      {banner && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-800"
        >
          {banner}
        </div>
      )}

      <Table<Quote>
        columns={[
          {
            key: "id",
            header: "Quote",
            render: (q) => <span className="font-semibold text-ink-900">{q.id}</span>,
          },
          {
            key: "customer",
            header: "Customer",
            render: (q) => {
              const lead = leads.find((l) => l.id === q.leadId);
              return lead ? lead.customer.name : q.customerId;
            },
          },
          {
            key: "event",
            header: "Event",
            render: (q) => {
              const lead = leads.find((l) => l.id === q.leadId);
              return lead ? (
                <span>
                  {lead.eventType}
                  <span className="block text-xs text-ink-400">{lead.guests} guests</span>
                </span>
              ) : (
                "—"
              );
            },
          },
          { key: "createdAt", header: "Date", render: (q) => formatDate(q.createdAt) },
          { key: "items", header: "Items", align: "center", render: (q) => q.items.length },
          {
            key: "total",
            header: "Total",
            align: "right",
            render: (q) => <PriceTag amount={q.total} />,
          },
          {
            key: "status",
            header: "Status",
            render: (q) => {
              const meta = quoteStatusMeta[q.status];
              return <Badge tone={meta.tone}>{meta.label}</Badge>;
            },
          },
          {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (q) => {
              const linked = bookings.find((b) => b.quoteId === q.id);
              const ready = q.status === "SENT" || q.status === "ACCEPTED";
              return (
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setViewing(q)}>
                    View
                  </Button>
                  {linked ? (
                    <Badge tone="success">Booked ({linked.id})</Badge>
                  ) : (
                    <Button
                      size="sm"
                      disabled={!ready || convertingId === q.id}
                      onClick={() => convert(q)}
                    >
                      {convertingId === q.id ? "Converting…" : "Convert to Booking"}
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]}
        rows={rows}
        keyOf={(q) => q.id}
        emptyMessage="No quotes yet — create your first from the builder."
      />

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={`Quote ${viewing?.id ?? ""}`}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing && (
          <QuoteDocument
            quote={viewing}
            lead={leads.find((l) => l.id === viewing.leadId)}
            contact={contact ?? undefined}
          />
        )}
      </Modal>
    </>
  );
}
