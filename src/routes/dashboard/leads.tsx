import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Badge,
  Button,
  Field,
  Input,
  LoadingState,
  Modal,
  PageHeader,
  PriceTag,
  Select,
  Table,
  Tabs,
  type SortDirection,
} from "~/components/ui";
import { getLeads, updateLead, updateLeadStatus } from "~/lib/services/leads";
import { getProducts } from "~/lib/services/products";
import { useStore } from "~/lib/store";
import {
  budgetRangeLabels,
  eventTypeLabels,
  leadStatusMeta,
  serviceOptionLabels,
} from "~/lib/statusLabels";
import { formatDate, formatDateTime } from "~/lib/util";
import type { Lead, LeadStatus, Product } from "~/lib/types";

export const Route = createFileRoute("/dashboard/leads")({
  component: LeadsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    lead: typeof search.lead === "string" ? search.lead : undefined,
  }),
});

const STATUSES: LeadStatus[] = ["NEW", "QUALIFIED", "QUOTE_SENT", "FOLLOW_UP", "BOOKED", "LOST"];

function LeadsPage() {
  const { lead: openLeadId } = Route.useSearch();
  const navigate = useNavigate();
  const leads = useStore((s) => s.leads);
  const quotes = useStore((s) => s.quotes);

  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [selectedId, setSelectedId] = useState<string | null>(openLeadId ?? null);

  useEffect(() => {
    let alive = true;
    Promise.all([getLeads(), getProducts()]).then(([, p]) => {
      if (!alive) return;
      setProducts(p);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Auto-open the detail modal when arriving with ?lead=…
  useEffect(() => {
    if (openLeadId) setSelectedId(openLeadId);
  }, [openLeadId]);

  const onSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const quoteTotalFor = (leadId: string): number => {
    const q = quotes.find((x) => x.leadId === leadId);
    return q?.total ?? 0;
  };

  const visible = useMemo(() => {
    let rows = leads;
    if (statusFilter !== "all") rows = rows.filter((l) => l.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (l) =>
          l.customer.name.toLowerCase().includes(q) ||
          l.eventType.toLowerCase().includes(q) ||
          (l.venue ?? "").toLowerCase().includes(q)
      );
    }
    const sorted = [...rows].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case "customer":
          av = a.customer.name;
          bv = b.customer.name;
          break;
        case "eventDate":
          av = a.eventDate;
          bv = b.eventDate;
          break;
        case "guests":
          av = a.guests;
          bv = b.guests;
          break;
        case "status":
          av = a.status;
          bv = b.status;
          break;
        case "value": {
          av = quoteTotalFor(a.id);
          bv = quoteTotalFor(b.id);
          break;
        }
        default:
          av = a.createdAt;
          bv = b.createdAt;
      }
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, statusFilter, query, sortKey, sortDir, quotes]);

  const selected = selectedId ? leads.find((l) => l.id === selectedId) : null;
  const selectedQuote = selected ? quotes.find((q) => q.leadId === selected.id) : null;

  const changeStatus = async (status: LeadStatus) => {
    if (!selected) return;
    await updateLeadStatus(selected.id, status);
  };

  const saveNextAction = async (value: string) => {
    if (!selected) return;
    await updateLead(selected.id, { nextAction: value });
  };

  const createQuoteFor = () => {
    if (!selected) return;
    setSelectedId(null);
    navigate({ to: "/dashboard/quotes", search: { leadId: selected.id } });
  };

  const tabs = useMemo(
    () => [
      { id: "all", label: `All (${leads.length})` },
      ...STATUSES.map((s) => ({ id: s, label: `${leadStatusMeta[s].label} (${leads.filter((l) => l.status === s).length})` })),
    ],
    [leads]
  );

  if (!loaded) {
    return (
      <>
        <PageHeader title="Leads" eyebrow="Dashboard" subtitle="Every enquiry from the site, qualified and tracked through the pipeline." />
        <LoadingState label="Loading leads…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Leads"
        eyebrow="Dashboard"
        subtitle="Every enquiry from the site, qualified and tracked through the pipeline."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={tabs} value={statusFilter} onChange={setStatusFilter} />
        <div className="w-full max-w-xs">
          <Field label="Search leads" htmlFor="leads-search">
            <Input
              id="leads-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Customer, event type, venue…"
            />
          </Field>
        </div>
      </div>

      <Table<Lead>
        columns={[
          {
            key: "customer",
            header: "Customer",
            sortable: true,
            render: (l) => (
              <button
                type="button"
                onClick={() => setSelectedId(l.id)}
                className="text-left font-semibold text-ink-900 hover:text-gold-700 hover:underline"
              >
                {l.customer.name}
              </button>
            ),
          },
          {
            key: "event",
            header: "Event",
            render: (l) => (
              <span>
                {eventTypeLabels[l.eventType]}
                {l.venue && <span className="block text-xs text-ink-400">{l.venue}</span>}
              </span>
            ),
          },
          { key: "eventDate", header: "Event Date", sortable: true, render: (l) => formatDate(l.eventDate) },
          { key: "guests", header: "Guests", align: "center", sortable: true, render: (l) => l.guests },
          {
            key: "value",
            header: "Est. Value",
            align: "right",
            sortable: true,
            render: (l) =>
              quoteTotalFor(l.id) > 0 ? (
                <PriceTag amount={quoteTotalFor(l.id)} prefix="quoted" />
              ) : (
                <span className="text-ink-500">{budgetRangeLabels[l.budgetRange]}</span>
              ),
          },
          {
            key: "status",
            header: "Status",
            sortable: true,
            render: (l) => {
              const meta = leadStatusMeta[l.status];
              return <Badge tone={meta.tone}>{meta.label}</Badge>;
            },
          },
          {
            key: "nextAction",
            header: "Next Action",
            render: (l) => (
              <span className={l.nextAction ? "text-ink-700" : "text-ink-300"}>
                {l.nextAction ?? "—"}
              </span>
            ),
          },
        ]}
        rows={visible}
        keyOf={(l) => l.id}
        onSort={onSort}
        sortKey={sortKey}
        sortDir={sortDir}
        emptyMessage={
          statusFilter === "all" && !query
            ? "No leads yet."
            : "No leads match the current filter."
        }
      />

      {/* ---- Detail modal ---- */}
      <Modal
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        size="lg"
        title={selected ? selected.customer.name : ""}
        footer={
          selected ? (
            <>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Close
              </Button>
              {selected.status !== "BOOKED" && selected.status !== "LOST" && (
                <Button onClick={createQuoteFor}>Create Quote</Button>
              )}
            </>
          ) : null
        }
      >
        {selected && (
          <LeadDetail
            lead={selected}
            quoteId={selectedQuote?.id}
            products={products}
            onStatusChange={(s) => changeStatus(s)}
            onNextAction={(v) => saveNextAction(v)}
          />
        )}
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------------------
// Detail panel
// ---------------------------------------------------------------------------

function LeadDetail({
  lead,
  quoteId,
  products,
  onStatusChange,
  onNextAction,
}: {
  lead: Lead;
  quoteId?: string;
  products: Product[];
  onStatusChange: (s: LeadStatus) => void;
  onNextAction: (v: string) => void;
}) {
  const [nextAction, setNextAction] = useState(lead.nextAction ?? "");
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const enquiryTotal = (lead.enquiryLines ?? []).reduce((sum, line) => {
    const p = products.find((pr) => pr.id === line.productId);
    return sum + (p?.hirePrice ? p.hirePrice * line.quantity : 0);
  }, 0);

  const statusMeta = leadStatusMeta[lead.status];

  const save = async () => {
    setSaving(true);
    try {
      await onNextAction(nextAction);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-800">{children || "—"}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
          <span className="ml-2 text-xs text-ink-400">
            {lead.id} · {lead.source} · created {formatDateTime(lead.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="lead-status" className="text-sm font-medium text-ink-600">
            Status
          </label>
          <Select
            id="lead-status"
            className="w-44"
            value={lead.status}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {leadStatusMeta[s].label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {quoteId && (
        <p className="rounded-lg bg-champagne-100 px-3 py-2 text-sm text-ink-700">
          Linked quote: <span className="font-semibold">{quoteId}</span> — manage it under
          Quotes.
        </p>
      )}

      <section>
        <h3 className="mb-2 font-display text-base font-semibold text-ink-900">Customer</h3>
        <dl className="grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2">
          <DetailRow label="Name">{lead.customer.name}</DetailRow>
          <DetailRow label="Company">{lead.customer.company}</DetailRow>
          <DetailRow label="Email">
            <a href={`mailto:${lead.customer.email}`} className="text-gold-700 hover:underline">
              {lead.customer.email}
            </a>
          </DetailRow>
          <DetailRow label="Phone">{lead.customer.phone}</DetailRow>
        </dl>
      </section>

      <section>
        <h3 className="mb-2 font-display text-base font-semibold text-ink-900">Event</h3>
        <dl className="grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow label="Type">{eventTypeLabels[lead.eventType]}</DetailRow>
          <DetailRow label="Date">{formatDate(lead.eventDate)}</DetailRow>
          <DetailRow label="Venue">{lead.venue}</DetailRow>
          <DetailRow label="Guests">{lead.guests}</DetailRow>
          <DetailRow label="Indoor / outdoor">{lead.indoorOutdoor}</DetailRow>
          <DetailRow label="Location">{lead.location ?? lead.customer.location}</DetailRow>
        </dl>
      </section>

      {lead.services && lead.services.length > 0 && (
        <section>
          <h3 className="mb-2 font-display text-base font-semibold text-ink-900">Services required</h3>
          <div className="flex flex-wrap gap-2">
            {lead.services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-gold-300 bg-gold-50 px-3 py-1 text-xs font-medium text-gold-800"
              >
                {serviceOptionLabels[s]}
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-2 font-display text-base font-semibold text-ink-900">Enquiry summary</h3>
        <dl className="grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2">
          <DetailRow label="Budget">{budgetRangeLabels[lead.budgetRange]}</DetailRow>
          <DetailRow label="Colour scheme">{lead.colourScheme}</DetailRow>
          <DetailRow label="Theme">{lead.theme}</DetailRow>
          <DetailRow label="Inspiration file">{lead.inspirationFile}</DetailRow>
        </dl>
        {lead.requirements && (
          <p className="mt-2 rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-700">
            <span className="font-semibold">Requirements: </span>
            {lead.requirements}
          </p>
        )}
        {lead.notes && (
          <p className="mt-2 rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-700">
            <span className="font-semibold">Enquiry note: </span>
            {lead.notes}
          </p>
        )}
      </section>

      {(lead.enquiryLines ?? []).length > 0 && (
        <section>
          <h3 className="mb-2 font-display text-base font-semibold text-ink-900">
            Enquiry-list items
          </h3>
          <div className="overflow-hidden rounded-lg border border-ink-200">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 text-right font-semibold">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold">Est. hire</th>
                </tr>
              </thead>
              <tbody>
                {(lead.enquiryLines ?? []).map((line) => {
                  const p = products.find((pr) => pr.id === line.productId);
                  return (
                    <tr key={line.productId} className="border-t border-ink-100">
                      <td className="px-3 py-2 text-ink-800">{p?.name ?? line.productId}</td>
                      <td className="px-3 py-2 text-right text-ink-700">{line.quantity}</td>
                      <td className="px-3 py-2 text-right font-medium text-ink-900">
                        {p?.hirePrice ? `R ${p.hirePrice * line.quantity}` : "TBC"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {enquiryTotal > 0 && (
            <p className="mt-2 text-sm text-ink-600">
              Estimated hire total from enquiry list:{" "}
              <span className="font-semibold text-ink-900">
                <PriceTag amount={enquiryTotal} />
              </span>
            </p>
          )}
        </section>
      )}

      <section className="rounded-lg border border-ink-200 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Field label="Next action" htmlFor="lead-next-action">
              <Input
                id="lead-next-action"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g. Call client on Friday to confirm quote"
              />
            </Field>
          </div>
          <Button variant="secondary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
        {savedFlash && <p className="mt-2 text-xs font-medium text-emerald-600">Saved ✓</p>}
      </section>

      {(lead.timeline ?? []).length > 0 && (
        <section>
          <h3 className="mb-2 font-display text-base font-semibold text-ink-900">Status timeline</h3>
          <ol className="space-y-2">
            {[...(lead.timeline ?? [])].reverse().map((entry, i) => {
              const m = leadStatusMeta[entry.status];
              return (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-500" aria-hidden />
                  <div>
                    <Badge tone={m.tone}>{m.label}</Badge>
                    <span className="ml-2 text-xs text-ink-400">{formatDateTime(entry.at)}</span>
                    {entry.note && <p className="text-ink-600">{entry.note}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {lead.isDemo && (
        <p className="text-xs text-ink-400">Demonstration record — sample data for preview.</p>
      )}
    </div>
  );
}
