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
import { convertQuoteToBooking, getQuotes, updateQuoteStatus } from "~/lib/services/quotes";
import { useStore } from "~/lib/store";
import { quoteStatusMeta } from "~/lib/statusLabels";
import { formatDate } from "~/lib/util";
import type { ContactDetails } from "~/lib/data/site";
import { businessProfileFromContact } from "~/lib/data/business";
import { downloadQuotePdf, printQuote, shareQuotePdf } from "~/lib/documents/quote-pdf";
import type { Quote, QuoteStatus } from "~/lib/types";

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
  const [editing, setEditing] = useState<Quote | null>(null);
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

  const changeStatus = async (quote: Quote, status: QuoteStatus) => {
    try {
      const updated = await updateQuoteStatus(quote.id, status);
      if (viewing?.id === quote.id) setViewing(updated);
      setBanner(`${updated.quotationNumber ?? updated.id} marked ${quoteStatusMeta[status].label}.`);
    } catch {
      setBanner("Could not update the quote status.");
    }
  };

  const documentOptions = (quote: Quote) => ({
    quote,
    lead: leads.find((lead) => lead.id === quote.leadId),
    contact: contact ?? undefined,
    profile: businessProfileFromContact(contact ?? undefined),
  });

  const download = (quote: Quote) => {
    try {
      downloadQuotePdf(documentOptions(quote));
    } catch {
      setBanner("Could not generate the PDF. Please try again.");
    }
  };

  const print = (quote: Quote) => {
    try {
      printQuote(documentOptions(quote));
    } catch {
      setBanner("Could not open the print view. Allow pop-ups and try again.");
    }
  };

  const share = async (quote: Quote) => {
    try {
      const shared = await shareQuotePdf(documentOptions(quote));
      if (!shared) {
        download(quote);
        setBanner("Direct sharing is unavailable here, so the PDF download has started.");
      }
    } catch {
      setBanner("Sharing was cancelled or unavailable.");
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
          initialQuote={editing ?? undefined}
          contact={contact ?? undefined}
          onBack={() => { setEditing(null); setMode("list"); }}
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

      <div className="hidden md:block">
      <Table<Quote>
        className="hidden md:block"
        columns={[
          {
            key: "id",
            header: "Quote",
            render: (q) => <span className="font-semibold text-ink-900">{q.quotationNumber ?? q.id}</span>,
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
          { key: "createdAt", header: "Date", render: (q) => <span>{formatDate(q.createdAt)}<span className="block text-xs text-ink-400">Updated {formatDate(q.updatedAt ?? q.createdAt)}</span></span> },
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
                <div className="flex flex-wrap justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setViewing(q)}>
                    View
                  </Button>
                  {!q.isDemo && <Button variant="secondary" size="sm" onClick={() => { setEditing(q); setMode("builder"); }}>
                    Edit
                  </Button>}
                  <Button variant="ghost" size="sm" onClick={() => download(q)}>PDF</Button>
                  <Button variant="ghost" size="sm" onClick={() => print(q)}>Print</Button>
                  <StatusControl quote={q} onChange={(status) => void changeStatus(q, status)} />
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
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((quote) => {
          const lead = leads.find((entry) => entry.id === quote.leadId);
          const linked = bookings.find((booking) => booking.quoteId === quote.id);
          return (
            <article key={quote.id} className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900">{quote.quotationNumber ?? quote.id}</p>
                  <p className="truncate text-sm text-ink-600">{lead?.customer.name ?? quote.customerId}</p>
                  <p className="text-xs text-ink-500">{lead?.eventDate ?? "No event date"} · {formatDate(quote.createdAt)}</p>
                </div>
                <Badge tone={quoteStatusMeta[quote.status].tone}>{quoteStatusMeta[quote.status].label}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
                <PriceTag amount={quote.total} />
                <StatusControl quote={quote} onChange={(status) => void changeStatus(quote, status)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setViewing(quote)}>View</Button>
                {!quote.isDemo && <Button variant="secondary" size="sm" onClick={() => { setEditing(quote); setMode("builder"); }}>Edit</Button>}
                <Button variant="ghost" size="sm" onClick={() => download(quote)}>PDF</Button>
                <Button variant="ghost" size="sm" onClick={() => print(quote)}>Print</Button>
                <Button variant="ghost" size="sm" onClick={() => void share(quote)}>Share</Button>
                {linked && <Badge tone="success">Booked</Badge>}
              </div>
            </article>
          );
        })}
        {rows.length === 0 && <p className="rounded-xl border border-dashed border-ink-300 px-5 py-10 text-center text-sm text-ink-500">No quotes yet — create your first from the builder.</p>}
      </div>

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={`Quote ${viewing?.id ?? ""}`}
        size="lg"
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            {viewing && <Button variant="ghost" onClick={() => download(viewing)}>Download PDF</Button>}
            {viewing && <Button variant="ghost" onClick={() => print(viewing)}>Print</Button>}
            {viewing && <Button variant="ghost" onClick={() => void share(viewing)}>Share</Button>}
            <Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>
          </div>
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

function StatusControl({ quote, onChange }: { quote: Quote; onChange: (status: QuoteStatus) => void }) {
  return (
    <Select
      aria-label={`Status for ${quote.quotationNumber ?? quote.id}`}
      value={quote.status}
      onChange={(event) => onChange(event.target.value as QuoteStatus)}
      className="w-auto min-w-28"
    >
      {(Object.keys(quoteStatusMeta) as QuoteStatus[]).map((status) => (
        <option key={status} value={status}>{quoteStatusMeta[status].label}</option>
      ))}
    </Select>
  );
}
