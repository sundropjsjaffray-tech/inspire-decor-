import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { M as Modal, B as Button } from "./Modal-ce_tYN3H.js";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { F as Field, I as Input, S as Select } from "./Field-ii2diUOC.js";
import { T as Table } from "./Table-DWkgwed-.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { T as Tabs } from "./Tabs-CPOLYykp.js";
import { g as getLeads, u as updateLead, a as updateLeadStatus } from "./leads-D6YQVvDy.js";
import { g as getProducts } from "./products-BbopjXnd.js";
import { u as useStore } from "./index-CtB_iAzP.js";
import { l as leadStatusMeta, e as eventTypeLabels, c as budgetRangeLabels, s as serviceOptionLabels } from "./statusLabels-g8aoxix0.js";
import { a as formatDate, e as formatDateTime } from "./util-D5Y4JTPp.js";
import { R as Route } from "./router-DLHoU_Fm.js";
import "react-dom";
import "zustand";
import "zustand/middleware";
const STATUSES = ["NEW", "QUALIFIED", "QUOTE_SENT", "FOLLOW_UP", "BOOKED", "LOST"];
function LeadsPage() {
  const {
    lead: openLeadId
  } = Route.useSearch();
  const navigate = useNavigate();
  const leads = useStore((s) => s.leads);
  const quotes = useStore((s) => s.quotes);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedId, setSelectedId] = useState(openLeadId ?? null);
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
  useEffect(() => {
    if (openLeadId) setSelectedId(openLeadId);
  }, [openLeadId]);
  const onSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const quoteTotalFor = (leadId) => {
    const q = quotes.find((x) => x.leadId === leadId);
    return q?.total ?? 0;
  };
  const visible = useMemo(() => {
    let rows = leads;
    if (statusFilter !== "all") rows = rows.filter((l) => l.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((l) => l.customer.name.toLowerCase().includes(q) || l.eventType.toLowerCase().includes(q) || (l.venue ?? "").toLowerCase().includes(q));
    }
    const sorted = [...rows].sort((a, b) => {
      let av;
      let bv;
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
  }, [leads, statusFilter, query, sortKey, sortDir, quotes]);
  const selected = selectedId ? leads.find((l) => l.id === selectedId) : null;
  const selectedQuote = selected ? quotes.find((q) => q.leadId === selected.id) : null;
  const changeStatus = async (status) => {
    if (!selected) return;
    await updateLeadStatus(selected.id, status);
  };
  const saveNextAction = async (value) => {
    if (!selected) return;
    await updateLead(selected.id, {
      nextAction: value
    });
  };
  const createQuoteFor = () => {
    if (!selected) return;
    setSelectedId(null);
    navigate({
      to: "/dashboard/quotes",
      search: {
        leadId: selected.id
      }
    });
  };
  const tabs = useMemo(() => [{
    id: "all",
    label: `All (${leads.length})`
  }, ...STATUSES.map((s) => ({
    id: s,
    label: `${leadStatusMeta[s].label} (${leads.filter((l) => l.status === s).length})`
  }))], [leads]);
  if (!loaded) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Leads", eyebrow: "Dashboard", subtitle: "Every enquiry from the site, qualified and tracked through the pipeline." }),
      /* @__PURE__ */ jsx(LoadingState, { label: "Loading leads…" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Leads", eyebrow: "Dashboard", subtitle: "Every enquiry from the site, qualified and tracked through the pipeline." }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx(Tabs, { tabs, value: statusFilter, onChange: setStatusFilter }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ jsx(Field, { label: "Search leads", htmlFor: "leads-search", children: /* @__PURE__ */ jsx(Input, { id: "leads-search", type: "search", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Customer, event type, venue…" }) }) })
    ] }),
    /* @__PURE__ */ jsx(Table, { columns: [{
      key: "customer",
      header: "Customer",
      sortable: true,
      render: (l) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSelectedId(l.id), className: "text-left font-semibold text-ink-900 hover:text-gold-700 hover:underline", children: l.customer.name })
    }, {
      key: "event",
      header: "Event",
      render: (l) => /* @__PURE__ */ jsxs("span", { children: [
        eventTypeLabels[l.eventType],
        l.venue && /* @__PURE__ */ jsx("span", { className: "block text-xs text-ink-400", children: l.venue })
      ] })
    }, {
      key: "eventDate",
      header: "Event Date",
      sortable: true,
      render: (l) => formatDate(l.eventDate)
    }, {
      key: "guests",
      header: "Guests",
      align: "center",
      sortable: true,
      render: (l) => l.guests
    }, {
      key: "value",
      header: "Est. Value",
      align: "right",
      sortable: true,
      render: (l) => quoteTotalFor(l.id) > 0 ? /* @__PURE__ */ jsx(PriceTag, { amount: quoteTotalFor(l.id), prefix: "quoted" }) : /* @__PURE__ */ jsx("span", { className: "text-ink-500", children: budgetRangeLabels[l.budgetRange] })
    }, {
      key: "status",
      header: "Status",
      sortable: true,
      render: (l) => {
        const meta = leadStatusMeta[l.status];
        return /* @__PURE__ */ jsx(Badge, { tone: meta.tone, children: meta.label });
      }
    }, {
      key: "nextAction",
      header: "Next Action",
      render: (l) => /* @__PURE__ */ jsx("span", { className: l.nextAction ? "text-ink-700" : "text-ink-300", children: l.nextAction ?? "—" })
    }], rows: visible, keyOf: (l) => l.id, onSort, sortKey, sortDir, emptyMessage: statusFilter === "all" && !query ? "No leads yet." : "No leads match the current filter." }),
    /* @__PURE__ */ jsx(Modal, { open: selected !== null, onClose: () => setSelectedId(null), size: "lg", title: selected ? selected.customer.name : "", footer: selected ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setSelectedId(null), children: "Close" }),
      selected.status !== "BOOKED" && selected.status !== "LOST" && /* @__PURE__ */ jsx(Button, { onClick: createQuoteFor, children: "Create Quote" })
    ] }) : null, children: selected && /* @__PURE__ */ jsx(LeadDetail, { lead: selected, quoteId: selectedQuote?.id, products, onStatusChange: (s) => changeStatus(s), onNextAction: (v) => saveNextAction(v) }) })
  ] });
}
function LeadDetail({
  lead,
  quoteId,
  products,
  onStatusChange,
  onNextAction
}) {
  const [nextAction, setNextAction] = useState(lead.nextAction ?? "");
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const enquiryTotal = (lead.enquiryLines ?? []).reduce((sum, line) => {
    const p = products.find((pr) => pr.id === line.productId);
    return sum + (p ? p.hirePrice * line.quantity : 0);
  }, 0);
  const statusMeta = leadStatusMeta[lead.status];
  const save = async () => {
    setSaving(true);
    try {
      await onNextAction(nextAction);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2e3);
    } finally {
      setSaving(false);
    }
  };
  const DetailRow = ({
    label,
    children
  }) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("dt", { className: "text-xs font-semibold uppercase tracking-wider text-ink-400", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-0.5 text-sm text-ink-800", children: children || "—" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Badge, { tone: statusMeta.tone, children: statusMeta.label }),
        /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-ink-400", children: [
          lead.id,
          " · ",
          lead.source,
          " · created ",
          formatDateTime(lead.createdAt)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "lead-status", className: "text-sm font-medium text-ink-600", children: "Status" }),
        /* @__PURE__ */ jsx(Select, { id: "lead-status", className: "w-44", value: lead.status, onChange: (e) => onStatusChange(e.target.value), children: STATUSES.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: leadStatusMeta[s].label }, s)) })
      ] })
    ] }),
    quoteId && /* @__PURE__ */ jsxs("p", { className: "rounded-lg bg-champagne-100 px-3 py-2 text-sm text-ink-700", children: [
      "Linked quote: ",
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: quoteId }),
      " — manage it under Quotes."
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Customer" }),
      /* @__PURE__ */ jsxs("dl", { className: "grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(DetailRow, { label: "Name", children: lead.customer.name }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Company", children: lead.customer.company }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Email", children: /* @__PURE__ */ jsx("a", { href: `mailto:${lead.customer.email}`, className: "text-gold-700 hover:underline", children: lead.customer.email }) }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Phone", children: lead.customer.phone })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Event" }),
      /* @__PURE__ */ jsxs("dl", { className: "grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx(DetailRow, { label: "Type", children: eventTypeLabels[lead.eventType] }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Date", children: formatDate(lead.eventDate) }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Venue", children: lead.venue }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Guests", children: lead.guests }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Indoor / outdoor", children: lead.indoorOutdoor }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Location", children: lead.location ?? lead.customer.location })
      ] })
    ] }),
    lead.services && lead.services.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Services required" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: lead.services.map((s) => /* @__PURE__ */ jsx("span", { className: "rounded-full border border-gold-300 bg-gold-50 px-3 py-1 text-xs font-medium text-gold-800", children: serviceOptionLabels[s] }, s)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Enquiry summary" }),
      /* @__PURE__ */ jsxs("dl", { className: "grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(DetailRow, { label: "Budget", children: budgetRangeLabels[lead.budgetRange] }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Colour scheme", children: lead.colourScheme }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Theme", children: lead.theme }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Inspiration file", children: lead.inspirationFile })
      ] }),
      lead.requirements && /* @__PURE__ */ jsxs("p", { className: "mt-2 rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-700", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Requirements: " }),
        lead.requirements
      ] }),
      lead.notes && /* @__PURE__ */ jsxs("p", { className: "mt-2 rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-700", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Enquiry note: " }),
        lead.notes
      ] })
    ] }),
    (lead.enquiryLines ?? []).length > 0 && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Enquiry-list items" }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-ink-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-semibold", children: "Item" }),
          /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Qty" }),
          /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Est. hire" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: (lead.enquiryLines ?? []).map((line) => {
          const p = products.find((pr) => pr.id === line.productId);
          return /* @__PURE__ */ jsxs("tr", { className: "border-t border-ink-100", children: [
            /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-ink-800", children: p?.name ?? line.productId }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right text-ink-700", children: line.quantity }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right font-medium text-ink-900", children: p ? `R ${p.hirePrice * line.quantity}` : "—" })
          ] }, line.productId);
        }) })
      ] }) }),
      enquiryTotal > 0 && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-ink-600", children: [
        "Estimated hire total from enquiry list:",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink-900", children: /* @__PURE__ */ jsx(PriceTag, { amount: enquiryTotal }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-ink-200 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx(Field, { label: "Next action", htmlFor: "lead-next-action", children: /* @__PURE__ */ jsx(Input, { id: "lead-next-action", value: nextAction, onChange: (e) => setNextAction(e.target.value), placeholder: "e.g. Call client on Friday to confirm quote" }) }) }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: save, disabled: saving, children: saving ? "Saving…" : "Save" })
      ] }),
      savedFlash && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-medium text-emerald-600", children: "Saved ✓" })
    ] }),
    (lead.timeline ?? []).length > 0 && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Status timeline" }),
      /* @__PURE__ */ jsx("ol", { className: "space-y-2", children: [...lead.timeline ?? []].reverse().map((entry, i) => {
        const m = leadStatusMeta[entry.status];
        return /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-500", "aria-hidden": true }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Badge, { tone: m.tone, children: m.label }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-ink-400", children: formatDateTime(entry.at) }),
            entry.note && /* @__PURE__ */ jsx("p", { className: "text-ink-600", children: entry.note })
          ] })
        ] }, i);
      }) })
    ] }),
    lead.isDemo && /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-400", children: "Demonstration record — sample data for preview." })
  ] });
}
export {
  LeadsPage as component
};
