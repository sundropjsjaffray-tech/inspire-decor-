import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { M as Modal, B as Button } from "./Modal-ce_tYN3H.js";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { S as Select } from "./Field-ii2diUOC.js";
import { T as Table } from "./Table-DWkgwed-.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { g as getBookings, u as updateBookingStatus } from "./bookings-HbI5VwzQ.js";
import { u as useStore } from "./index-DpiVUCS0.js";
import { e as eventTypeLabels, c as bookingStatusMeta } from "./statusLabels-C7N4cRsF.js";
import { a as formatDate, f as formatZAR } from "./util-D5Y4JTPp.js";
import "react-dom";
import "zustand";
import "zustand/middleware";
const STATUSES = ["QUOTE", "AWAITING_DEPOSIT", "CONFIRMED", "PREPARING", "OUT_ON_HIRE", "COMPLETED", "CANCELLED"];
function BookingsPage() {
  const bookings = useStore((s) => s.bookings);
  const quotes = useStore((s) => s.quotes);
  const leads = useStore((s) => s.leads);
  const inventory = useStore((s) => s.inventory);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  useEffect(() => {
    let alive = true;
    getBookings().then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  const changeStatus = async (id, status) => {
    setSavingId(id);
    try {
      await updateBookingStatus(id, status);
    } finally {
      setSavingId(null);
    }
  };
  const selected = selectedId ? bookings.find((b) => b.id === selectedId) : null;
  const customerName = (b) => leads.find((l) => l.id === b.leadId)?.customer.name ?? b.customerId;
  const rows = [...bookings].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  if (!loaded) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Bookings", eyebrow: "Dashboard", subtitle: "Confirmed work, deposits and balances — from quote to completion." }),
      /* @__PURE__ */ jsx(LoadingState, { label: "Loading bookings…" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Bookings", eyebrow: "Dashboard", subtitle: "Confirmed work, deposits and balances — from quote to completion." }),
    /* @__PURE__ */ jsx(Table, { columns: [{
      key: "customer",
      header: "Customer",
      render: (b) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSelectedId(b.id), className: "text-left font-semibold text-ink-900 hover:text-gold-700 hover:underline", children: customerName(b) })
    }, {
      key: "eventName",
      header: "Event",
      render: (b) => /* @__PURE__ */ jsxs("span", { children: [
        b.eventName,
        /* @__PURE__ */ jsx("span", { className: "block text-xs text-ink-400", children: eventTypeLabels[b.eventType] })
      ] })
    }, {
      key: "eventDate",
      header: "Event Date",
      render: (b) => formatDate(b.eventDate)
    }, {
      key: "venue",
      header: "Venue",
      render: (b) => b.venue || "—"
    }, {
      key: "guests",
      header: "Guests",
      align: "center",
      render: (b) => b.guests
    }, {
      key: "totalAmount",
      header: "Quote Value",
      align: "right",
      render: (b) => /* @__PURE__ */ jsx(PriceTag, { amount: b.totalAmount })
    }, {
      key: "depositPaid",
      header: "Deposit",
      align: "right",
      render: (b) => /* @__PURE__ */ jsx(PriceTag, { amount: b.depositPaid })
    }, {
      key: "balanceDue",
      header: "Balance",
      align: "right",
      render: (b) => /* @__PURE__ */ jsx("span", { className: b.balanceDue > 0 ? "font-semibold text-ink-900" : "text-ink-400", children: formatZAR(b.balanceDue) })
    }, {
      key: "status",
      header: "Status",
      render: (b) => {
        const meta = bookingStatusMeta[b.status];
        return /* @__PURE__ */ jsx(Badge, { tone: meta.tone, children: meta.label });
      }
    }, {
      key: "controls",
      header: "Change status",
      render: (b) => /* @__PURE__ */ jsx(Select, { "aria-label": `Change status for ${b.eventName}`, className: "w-44", value: b.status, disabled: savingId === b.id, onChange: (e) => changeStatus(b.id, e.target.value), children: STATUSES.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: bookingStatusMeta[s].label }, s)) })
    }], rows, keyOf: (b) => b.id, emptyMessage: "No bookings yet — convert a quote to create one." }),
    /* @__PURE__ */ jsx(Modal, { open: selected !== null, onClose: () => setSelectedId(null), size: "lg", title: selected?.eventName ?? "", footer: /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setSelectedId(null), children: "Close" }), children: selected && /* @__PURE__ */ jsx(BookingDetail, { booking: selected, customerName: customerName(selected), quote: quotes.find((q) => q.id === selected.quoteId), inventory }) })
  ] });
}
function BookingDetail({
  booking,
  customerName,
  quote,
  inventory
}) {
  const meta = bookingStatusMeta[booking.status];
  const reservations = (quote?.items ?? []).filter((i) => i.type === "product").map((i) => ({
    ...i,
    stock: inventory.find((inv) => inv.name === i.name)
  }));
  const Row = ({
    label,
    children
  }) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("dt", { className: "text-xs font-semibold uppercase tracking-wider text-ink-400", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-0.5 text-sm text-ink-800", children: children ?? "—" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsx(Badge, { tone: meta.tone, children: meta.label }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-ink-400", children: [
        booking.id,
        booking.quoteId ? ` · from quote ${booking.quoteId}` : " · no linked quote"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Details" }),
      /* @__PURE__ */ jsxs("dl", { className: "grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Row, { label: "Customer", children: customerName }),
        /* @__PURE__ */ jsx(Row, { label: "Event type", children: eventTypeLabels[booking.eventType] }),
        /* @__PURE__ */ jsx(Row, { label: "Event date", children: formatDate(booking.eventDate) }),
        /* @__PURE__ */ jsx(Row, { label: "Venue", children: booking.venue }),
        /* @__PURE__ */ jsx(Row, { label: "Guests", children: booking.guests }),
        /* @__PURE__ */ jsx(Row, { label: "Created", children: formatDate(booking.createdAt) }),
        /* @__PURE__ */ jsx(Row, { label: "Setup time", children: booking.setupTime }),
        /* @__PURE__ */ jsx(Row, { label: "Event time", children: booking.eventTime }),
        /* @__PURE__ */ jsx(Row, { label: "Collection time", children: booking.collectionTime })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Payment" }),
      /* @__PURE__ */ jsxs("dl", { className: "grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsx(Row, { label: "Quote value", children: /* @__PURE__ */ jsx(PriceTag, { amount: booking.totalAmount }) }),
        /* @__PURE__ */ jsx(Row, { label: "Deposit paid", children: /* @__PURE__ */ jsx(PriceTag, { amount: booking.depositPaid }) }),
        /* @__PURE__ */ jsx(Row, { label: "Balance due", children: /* @__PURE__ */ jsx(PriceTag, { amount: booking.balanceDue }) })
      ] }),
      booking.notes && /* @__PURE__ */ jsx("p", { className: "mt-2 rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-700", children: booking.notes })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-base font-semibold text-ink-900", children: "Reserved inventory" }),
      reservations.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-dashed border-ink-300 p-4 text-sm text-ink-500", children: "No hire products on the linked quote — this booking holds no stock reservations." }) : /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-ink-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-semibold", children: "Item" }),
          /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Reserved qty" }),
          /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Stock position" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: reservations.map((r) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-ink-100", children: [
          /* @__PURE__ */ jsx("td", { className: "px-3 py-2 font-medium text-ink-900", children: r.name }),
          /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right text-ink-800", children: r.quantity }),
          /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right text-ink-500", children: r.stock ? `${r.stock.reserved} reserved / ${r.stock.total} total` : "no stock record" })
        ] }, r.name)) })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-ink-400", children: "Reservations are created automatically when a quote is converted to a booking and are reflected live on the Inventory page." })
    ] }),
    booking.isDemo && /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-400", children: "Demonstration record — sample data for preview." })
  ] });
}
export {
  BookingsPage as component
};
