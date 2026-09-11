import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { B as Button, M as Modal } from "./Modal-ce_tYN3H.js";
import { C as Card, a as CardHeader } from "./Card-Zmhmk8cF.js";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { F as Field, S as Select, I as Input } from "./Field-ii2diUOC.js";
import { E as EmptyState } from "./EmptyState-BDGSXIRT.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { q as quoteDefaults, a as getQuoteServices, c as createQuote, u as updateQuoteStatus, g as getQuotes, b as convertQuoteToBooking } from "./quotes-CHaZoF-r.js";
import { e as eventTypeLabels, q as quoteStatusMeta } from "./statusLabels-C7N4cRsF.js";
import { a as formatDate, f as formatZAR, c as cn, b as availableCount } from "./util-D5Y4JTPp.js";
import { g as getProducts } from "./products-BpU3TxX9.js";
import { u as useStore } from "./index-DpiVUCS0.js";
import { T as Table } from "./Table-DWkgwed-.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { d as getContactDetails } from "./content-DhpWJKdC.js";
import { a as Route } from "./router-R1jwjBLe.js";
import "react-dom";
import "./bookings-HbI5VwzQ.js";
import "./inventory-MksNkqWX.js";
import "zustand";
import "zustand/middleware";
import "./site-c9x3VlSs.js";
import "@tanstack/react-router";
function LineRow({ item, index }) {
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-ink-100 last:border-0", children: [
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-ink-400", children: index + 1 }),
    /* @__PURE__ */ jsxs("td", { className: "px-3 py-2", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink-900", children: item.name }),
      item.type === "service" && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded bg-champagne-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-700", children: "Service" })
    ] }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right text-ink-700", children: item.quantity }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right text-ink-700", children: formatZAR(item.unitPrice) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right font-semibold text-ink-900", children: formatZAR(item.lineTotal) })
  ] });
}
function QuoteDocument({ quote, lead, contact }) {
  const deposit = Math.round(quote.total * quoteDefaults.depositRate);
  const balance = quote.total - deposit;
  return /* @__PURE__ */ jsxs(Card, { padded: false, className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4 border-b-4 border-gold-500 bg-ink-950 px-6 py-5 text-white", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-display text-xl font-bold", children: [
          "INSPIRE",
          /* @__PURE__ */ jsx("span", { className: "text-gold-400", children: " DECOR" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.25em] text-ink-400", children: "Event Décor · Draping · Catering · Equipment Hire" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-gold-400", children: "Quote" }),
        /* @__PURE__ */ jsx("p", { className: "font-display text-2xl font-semibold", children: quote.id }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-ink-400", children: [
          formatDate(quote.createdAt),
          quote.validUntil && /* @__PURE__ */ jsxs(Fragment, { children: [
            " · Valid until ",
            formatDate(quote.validUntil)
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 px-6 py-5 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400", children: "Prepared for" }),
        lead ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-ink-900", children: lead.customer.name }),
          lead.customer.company && /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-600", children: lead.customer.company }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-600", children: lead.customer.email }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-600", children: lead.customer.phone })
        ] }) : /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-600", children: [
          "Customer # ",
          quote.customerId
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400", children: "Event details" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-700", children: [
          eventTypeLabels[lead?.eventType ?? "other"],
          lead?.eventDate ? ` · ${formatDate(lead.eventDate)}` : ""
        ] }),
        lead?.venue && /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-700", children: [
          "Venue: ",
          lead.venue
        ] }),
        lead && /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-700", children: [
          "Guests: ",
          lead.guests
        ] }),
        quote.notes && /* @__PURE__ */ jsx("p", { className: "mt-2 rounded bg-champagne-100 px-2.5 py-1.5 text-xs italic text-ink-600", children: quote.notes })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-y border-ink-200 bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500", children: [
        /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-semibold", children: "#" }),
        /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-semibold", children: "Item" }),
        /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Qty" }),
        /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Unit" }),
        /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Line total" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        quote.items.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-3 py-6 text-center text-ink-400", children: "No line items on this quote." }) }),
        quote.items.map((item, i) => /* @__PURE__ */ jsx(LineRow, { item, index: i }, item.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1 px-6 py-5 sm:flex-row sm:justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "max-w-xs text-xs leading-relaxed text-ink-400", children: quoteDefaults.paymentTerms }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xs space-y-1 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-ink-600", children: [
          /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { children: formatZAR(quote.subtotal) })
        ] }),
        (quote.deliveryFee > 0 || true) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-ink-600", children: [
          /* @__PURE__ */ jsx("span", { children: "Delivery" }),
          /* @__PURE__ */ jsx("span", { children: formatZAR(quote.deliveryFee) })
        ] }),
        (quote.setupFee ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-ink-600", children: [
          /* @__PURE__ */ jsx("span", { children: "Setup" }),
          /* @__PURE__ */ jsx("span", { children: formatZAR(quote.setupFee ?? 0) })
        ] }),
        quote.discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-ink-600", children: [
          /* @__PURE__ */ jsx("span", { children: "Discount" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "− ",
            formatZAR(quote.discount)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-ink-200 pt-2 text-base font-bold text-ink-950", children: [
          /* @__PURE__ */ jsx("span", { children: "Total (incl. VAT)" }),
          /* @__PURE__ */ jsx("span", { children: formatZAR(quote.total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-semibold text-gold-700", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Deposit required (",
            Math.round(quoteDefaults.depositRate * 100),
            "%)"
          ] }),
          /* @__PURE__ */ jsx("span", { children: formatZAR(deposit) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-ink-600", children: [
          /* @__PURE__ */ jsx("span", { children: "Balance due" }),
          /* @__PURE__ */ jsx("span", { children: formatZAR(balance) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-ink-200 bg-champagne-100/60 px-6 py-4 text-center text-xs text-ink-500", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold uppercase tracking-widest text-ink-700", children: "Prepared by INSPIRE DECOR" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-1", children: [
        contact?.phone ?? "",
        contact?.email ? ` · ${contact.email}` : "",
        contact?.area ? ` · ${contact.area}` : ""
      ] })
    ] })
  ] });
}
const SERVICE_FEE_IDS = /* @__PURE__ */ new Set(["setup", "delivery"]);
function QuoteBuilder({ initialLeadId, contact, onBack }) {
  const leads = useStore((s) => s.leads);
  const inventory = useStore((s) => s.inventory);
  const [products, setProducts] = useState(null);
  const [services, setServices] = useState(null);
  const [leadId, setLeadId] = useState(initialLeadId ?? "");
  const [productQtys, setProductQtys] = useState({});
  const [serviceQtys, setServiceQtys] = useState({});
  const [servicePrices, setServicePrices] = useState({});
  const [discount, setDiscount] = useState({ type: "rand", value: 0 });
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([getProducts(), getQuoteServices()]).then(([p, sv]) => {
      if (!alive) return;
      setProducts(p);
      setServices(sv);
      const prices = {};
      for (const s of sv) prices[s.id] = s.unitPrice;
      setServicePrices(prices);
    });
    return () => {
      alive = false;
    };
  }, []);
  const lead = useMemo(() => leads.find((l) => l.id === leadId), [leads, leadId]);
  const availableFor = (name) => {
    const item = inventory.find((i) => i.name === name);
    if (!item) return 0;
    return availableCount(item);
  };
  const selectLead = (id) => {
    setLeadId(id);
    setError(null);
    const l = leads.find((x) => x.id === id);
    if (!l || !products) return;
    const qtys = {};
    for (const line of l.enquiryLines ?? []) {
      const p = products.find((pr) => pr.id === line.productId);
      if (!p) continue;
      const max = availableFor(p.name);
      qtys[p.id] = Math.min(line.quantity, max || line.quantity);
    }
    setProductQtys(qtys);
    const sv = { delivery: 1, setup: 1 };
    if (l.services?.includes("draping") && l.guests > 0) {
      sv["draping"] = Math.min(Math.max(l.guests, 50), 300);
    }
    setServiceQtys((prev) => ({ ...prev, ...sv }));
  };
  const preselected = useMemo(() => initialLeadId, [initialLeadId]);
  useEffect(() => {
    if (preselected && products && leadId !== preselected) {
      selectLead(preselected);
    }
  }, [preselected, products]);
  const setQty = (setter, key, value) => setter((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  const productLines = useMemo(
    () => (products ?? []).filter((p) => (productQtys[p.id] ?? 0) > 0).map((p) => {
      const quantity = productQtys[p.id] ?? 0;
      return {
        type: "product",
        refId: p.id,
        name: p.name,
        quantity,
        unitPrice: p.hirePrice,
        lineTotal: quantity * p.hirePrice
      };
    }),
    [products, productQtys]
  );
  const serviceLines = useMemo(
    () => (services ?? []).filter((s) => !SERVICE_FEE_IDS.has(s.id) && (serviceQtys[s.id] ?? 0) > 0).map((s) => {
      const quantity = serviceQtys[s.id] ?? 0;
      const unitPrice = servicePrices[s.id] ?? s.unitPrice;
      return {
        type: "service",
        refId: s.id,
        name: s.name,
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice
      };
    }),
    [services, serviceQtys, servicePrices]
  );
  const subtotal = useMemo(
    () => productLines.reduce((sum, l) => sum + l.lineTotal, 0) + serviceLines.reduce((sum, l) => sum + l.lineTotal, 0),
    [productLines, serviceLines]
  );
  const deliveryFee = (serviceQtys["delivery"] ?? 0) > 0 ? servicePrices["delivery"] ?? 0 : 0;
  const setupFee = (serviceQtys["setup"] ?? 0) > 0 ? servicePrices["setup"] ?? 0 : 0;
  const discountAmount = discount.type === "pct" ? Math.round(subtotal * discount.value / 100) : discount.value;
  const total = Math.max(0, subtotal + deliveryFee + setupFee - discountAmount);
  const deposit = Math.round(total * quoteDefaults.depositRate);
  const balance = total - deposit;
  const discountText = discountAmount > 0 ? discount.type === "pct" ? `${discount.value}% (−${formatZAR(discountAmount)})` : `−${formatZAR(discountAmount)}` : "—";
  const hasItems = productLines.length + serviceLines.length > 0;
  const generate = async () => {
    if (!lead || !hasItems) return;
    setGenerating(true);
    setError(null);
    try {
      const quote = await createQuote({
        leadId: lead.id,
        customerId: lead.customer.id,
        items: [...productLines, ...serviceLines],
        deliveryFee,
        setupFee,
        discount: discountAmount,
        notes: notes.trim() || void 0,
        validUntil: new Date(Date.now() + quoteDefaults.validDays * 864e5).toISOString().slice(0, 10)
      });
      const sent = await updateQuoteStatus(quote.id, "SENT");
      setPreview(sent);
    } catch {
      setError("Could not create the quote. Please try again.");
    } finally {
      setGenerating(false);
    }
  };
  if (!products || !services) {
    return /* @__PURE__ */ jsx(LoadingState, { label: "Loading quote builder…" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(
        CardHeader,
        {
          title: "1 · Lead",
          subtitle: "Who is this quote for? Selecting a lead pulls in their event and enquiry details."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "max-w-md", children: /* @__PURE__ */ jsx(Field, { label: "Lead", htmlFor: "qb-lead", children: /* @__PURE__ */ jsxs(
        Select,
        {
          id: "qb-lead",
          value: leadId,
          onChange: (e) => selectLead(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select a lead…" }),
            leads.map((l) => /* @__PURE__ */ jsxs("option", { value: l.id, children: [
              l.customer.name,
              " — ",
              l.eventType,
              " · ",
              l.guests,
              " guests"
            ] }, l.id))
          ]
        }
      ) }) }),
      lead && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-2 rounded-lg bg-champagne-100/70 p-4 text-sm text-ink-700 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Customer:" }),
          " ",
          lead.customer.name
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Event:" }),
          " ",
          lead.eventType
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Date:" }),
          " ",
          lead.eventDate
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Guests:" }),
          " ",
          lead.guests
        ] }),
        lead.venue && /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Venue:" }),
          " ",
          lead.venue
        ] }),
        lead.enquiryLines && lead.enquiryLines.length > 0 && /* @__PURE__ */ jsxs("p", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Enquiry cart:" }),
          " ",
          lead.enquiryLines.length,
          " item type(s) pre-filled — adjust below."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(
        CardHeader,
        {
          title: "2 · Hire products",
          subtitle: "Search and pick catalogue items. Quantities are capped at stock available for the event."
        }
      ),
      /* @__PURE__ */ jsx(
        ProductPicker,
        {
          products,
          qtys: productQtys,
          availableFor,
          onChange: (id, qty) => setQty(setProductQtys, id, qty)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(
        CardHeader,
        {
          title: "3 · Services",
          subtitle: "Priced add-ons. Delivery and Setup map to their own totals rows; the rest are line items."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: services.map((s) => {
        const qty = serviceQtys[s.id] ?? 0;
        const isFee = SERVICE_FEE_IDS.has(s.id);
        const price = servicePrices[s.id] ?? s.unitPrice;
        const max = isFee ? 1 : 999;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-200 px-4 py-3",
              qty > 0 && "border-gold-400 bg-gold-50/40"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("p", { className: "font-medium text-ink-900", children: [
                  s.name,
                  isFee && /* @__PURE__ */ jsx(Badge, { tone: "gold", className: "ml-2", children: "Fee row" })
                ] }),
                s.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-500", children: s.description })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1 text-sm text-ink-600", children: [
                  "R",
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      value: price,
                      onChange: (e) => setServicePrices((prev) => ({
                        ...prev,
                        [s.id]: Math.max(0, Number(e.target.value) || 0)
                      })),
                      className: "w-24",
                      "aria-label": `${s.name} price`
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-ink-400", children: s.unit })
                ] }),
                /* @__PURE__ */ jsx(
                  QtyStepper,
                  {
                    label: `${s.name} quantity`,
                    value: qty,
                    max,
                    onChange: (v) => setQty(setServiceQtys, s.id, v)
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "w-24 text-right font-semibold text-ink-900", children: formatZAR(qty * price) })
              ] })
            ]
          },
          s.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(
        CardHeader,
        {
          title: "4 · Totals",
          subtitle: "Subtotal + delivery + setup − discount = total. Deposit configurable in data (50%)."
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Discount type", htmlFor: "qb-disc-type", children: /* @__PURE__ */ jsxs(
              Select,
              {
                id: "qb-disc-type",
                value: discount.type,
                onChange: (e) => setDiscount((d) => ({ ...d, type: e.target.value })),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "rand", children: "Rand (R)" }),
                  /* @__PURE__ */ jsx("option", { value: "pct", children: "Percent (%)" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Discount value", htmlFor: "qb-disc-value", children: /* @__PURE__ */ jsx(
              Input,
              {
                id: "qb-disc-value",
                type: "number",
                min: 0,
                value: discount.value,
                onChange: (e) => setDiscount((d) => ({ ...d, value: Math.max(0, Number(e.target.value) || 0) }))
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Quote notes (shown on the document)", htmlFor: "qb-notes", children: /* @__PURE__ */ jsx(
            Input,
            {
              id: "qb-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "e.g. Champagne & blush package"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx(Button, { onClick: generate, disabled: !lead || !hasItems || generating, children: generating ? "Generating…" : "Generate Quote" }),
            /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onBack, children: "Back to quotes" })
          ] }),
          !lead && /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-700", children: "Select a lead to generate a quote." }),
          lead && !hasItems && /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-700", children: "Add at least one product or service." }),
          error && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: error })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-ink-200 bg-ink-50/60 p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500", children: "Live calculation" }),
          /* @__PURE__ */ jsxs("dl", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("dt", { className: "text-ink-600", children: [
                "Subtotal (",
                productLines.length + serviceLines.length,
                " lines)"
              ] }),
              /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink-900", children: formatZAR(subtotal) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-ink-600", children: "Delivery" }),
              /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink-900", children: formatZAR(deliveryFee) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-ink-600", children: "Setup" }),
              /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink-900", children: formatZAR(setupFee) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-ink-600", children: "Discount" }),
              /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink-900", children: discountText })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-ink-200 pt-2 text-base font-bold text-ink-950", children: [
              /* @__PURE__ */ jsx("dt", { children: "Total" }),
              /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(PriceTag, { amount: total }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("dt", { className: "text-ink-600", children: [
                "Deposit required (",
                Math.round(quoteDefaults.depositRate * 100),
                "%)"
              ] }),
              /* @__PURE__ */ jsx("dd", { className: "font-semibold text-gold-700", children: formatZAR(deposit) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-ink-600", children: "Balance due" }),
              /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink-900", children: formatZAR(balance) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: preview !== null,
        onClose: () => setPreview(null),
        title: `Quote ${preview?.id ?? ""} — ready to send`,
        size: "lg",
        footer: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setPreview(null), children: "Close" }),
          /* @__PURE__ */ jsx(Button, { onClick: () => {
            setPreview(null);
            onBack();
          }, children: "Done — view in list" })
        ] }),
        children: preview && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-800", children: [
            "This is the document the client receives.",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Email note:" }),
            " when Resend is connected, the send happens server-side (createServerFn / api route) — never in the browser — using exactly this rendered document."
          ] }),
          /* @__PURE__ */ jsx(QuoteDocument, { quote: preview, lead, contact })
        ] })
      }
    )
  ] });
}
function QtyStepper({
  label,
  value,
  max,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", role: "group", "aria-label": label, children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "secondary",
        size: "sm",
        "aria-label": `Decrease ${label}`,
        onClick: () => onChange(value - 1),
        disabled: value <= 0,
        children: "−"
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "w-12 text-center text-sm font-semibold text-ink-900", "aria-live": "polite", children: value }),
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "secondary",
        size: "sm",
        "aria-label": `Increase ${label}`,
        onClick: () => onChange(Math.min(max, value + 1)),
        disabled: value >= max,
        children: "+"
      }
    )
  ] });
}
function ProductPicker({
  products,
  qtys,
  availableFor,
  onChange
}) {
  const [query, setQuery] = useState("");
  const filtered = query.trim() ? products.filter(
    (p) => `${p.name} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase())
  ) : products;
  if (filtered.length === 0) {
    return /* @__PURE__ */ jsx(EmptyState, { title: "No products match", description: `Nothing found for “${query}”.` });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-3 max-w-sm", children: /* @__PURE__ */ jsx(Field, { label: "Search products", htmlFor: "qb-search", children: /* @__PURE__ */ jsx(
      Input,
      {
        id: "qb-search",
        type: "search",
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: "e.g. Dinner Plate, Chair Cover…"
      }
    ) }) }),
    /* @__PURE__ */ jsx("ul", { className: "max-h-96 divide-y divide-ink-100 overflow-y-auto rounded-lg border border-ink-200", children: filtered.map((p) => {
      const available = availableFor(p.name);
      const qty = qtys[p.id] ?? 0;
      const shortage = qty > available;
      return /* @__PURE__ */ jsxs("li", { className: "flex flex-wrap items-center justify-between gap-3 px-4 py-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-medium text-ink-900", children: [
            p.name,
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs font-normal text-ink-400", children: p.category })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-500", children: [
            formatZAR(p.hirePrice),
            " ",
            p.unit,
            /* @__PURE__ */ jsx("span", { className: "mx-1 text-ink-300", children: "·" }),
            available,
            " available"
          ] }),
          shortage && /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-amber-700", children: [
            "Only ",
            available,
            " available for this event — quantity capped."
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          QtyStepper,
          {
            label: `${p.name} quantity`,
            value: Math.min(qty, available),
            max: available,
            onChange: (v) => onChange(p.id, v)
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "w-24 text-right font-semibold text-ink-900", children: formatZAR(Math.min(qty, available) * p.hirePrice) })
      ] }, p.id);
    }) })
  ] });
}
function QuotesPage() {
  const {
    leadId
  } = Route.useSearch();
  const [mode, setMode] = useState(leadId ? "builder" : "list");
  const [loaded, setLoaded] = useState(false);
  const [contact, setContact] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [convertingId, setConvertingId] = useState(null);
  const [banner, setBanner] = useState(null);
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
  const convert = async (quote) => {
    setConvertingId(quote.id);
    setBanner(null);
    try {
      const booking = await convertQuoteToBooking(quote.id);
      setBanner(`Booking ${booking.id} created for ${booking.eventName} — lead marked BOOKED and stock reserved.`);
    } catch (err) {
      setBanner(`Conversion failed: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setConvertingId(null);
    }
  };
  if (!loaded) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Quotes", eyebrow: "Dashboard", subtitle: "Build quotes from products and services, send them, and convert to bookings." }),
      /* @__PURE__ */ jsx(LoadingState, { label: "Loading quotes…" })
    ] });
  }
  if (mode === "builder") {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Quote builder", eyebrow: "Dashboard", subtitle: "Compose products and services, review the live totals, then generate a client-ready document." }),
      /* @__PURE__ */ jsx(QuoteBuilder, { initialLeadId: leadId, contact: contact ?? void 0, onBack: () => setMode("list") }, leadId ?? "new")
    ] });
  }
  const rows = [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Quotes", eyebrow: "Dashboard", subtitle: "Build quotes from products and services, send them, and convert to bookings.", actions: /* @__PURE__ */ jsx(Button, { onClick: () => setMode("builder"), children: "+ New Quote" }) }),
    banner && /* @__PURE__ */ jsx("div", { role: "status", className: "mb-6 rounded-lg border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-800", children: banner }),
    /* @__PURE__ */ jsx(Table, { columns: [{
      key: "id",
      header: "Quote",
      render: (q) => /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink-900", children: q.id })
    }, {
      key: "customer",
      header: "Customer",
      render: (q) => {
        const lead = leads.find((l) => l.id === q.leadId);
        return lead ? lead.customer.name : q.customerId;
      }
    }, {
      key: "event",
      header: "Event",
      render: (q) => {
        const lead = leads.find((l) => l.id === q.leadId);
        return lead ? /* @__PURE__ */ jsxs("span", { children: [
          lead.eventType,
          /* @__PURE__ */ jsxs("span", { className: "block text-xs text-ink-400", children: [
            lead.guests,
            " guests"
          ] })
        ] }) : "—";
      }
    }, {
      key: "createdAt",
      header: "Date",
      render: (q) => formatDate(q.createdAt)
    }, {
      key: "items",
      header: "Items",
      align: "center",
      render: (q) => q.items.length
    }, {
      key: "total",
      header: "Total",
      align: "right",
      render: (q) => /* @__PURE__ */ jsx(PriceTag, { amount: q.total })
    }, {
      key: "status",
      header: "Status",
      render: (q) => {
        const meta = quoteStatusMeta[q.status];
        return /* @__PURE__ */ jsx(Badge, { tone: meta.tone, children: meta.label });
      }
    }, {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (q) => {
        const linked = bookings.find((b) => b.quoteId === q.id);
        const ready = q.status === "SENT" || q.status === "ACCEPTED";
        return /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => setViewing(q), children: "View" }),
          linked ? /* @__PURE__ */ jsxs(Badge, { tone: "success", children: [
            "Booked (",
            linked.id,
            ")"
          ] }) : /* @__PURE__ */ jsx(Button, { size: "sm", disabled: !ready || convertingId === q.id, onClick: () => convert(q), children: convertingId === q.id ? "Converting…" : "Convert to Booking" })
        ] });
      }
    }], rows, keyOf: (q) => q.id, emptyMessage: "No quotes yet — create your first from the builder." }),
    /* @__PURE__ */ jsx(Modal, { open: viewing !== null, onClose: () => setViewing(null), title: `Quote ${viewing?.id ?? ""}`, size: "lg", footer: /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setViewing(null), children: "Close" }), children: viewing && /* @__PURE__ */ jsx(QuoteDocument, { quote: viewing, lead: leads.find((l) => l.id === viewing.leadId), contact: contact ?? void 0 }) })
  ] });
}
export {
  QuotesPage as component
};
