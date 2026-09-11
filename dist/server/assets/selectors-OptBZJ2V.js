import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn, b as availableCount, m as monthKey, g as isWithinCurrentMonth } from "./util-D5Y4JTPp.js";
import { u as useStore } from "./index-DpiVUCS0.js";
const accentClasses = {
  default: "border-ink-200",
  gold: "border-gold-400",
  warning: "border-amber-400",
  info: "border-sky-400",
  danger: "border-red-400"
};
function StatCard({ label, value, hint, tone = "default", className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "rounded-xl border-l-4 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        accentClasses[tone],
        className
      ),
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-ink-500", children: label }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 font-display text-2xl font-semibold text-ink-950 sm:text-3xl", children: value }),
        hint && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-ink-400", children: hint })
      ]
    }
  );
}
const selectRevenueThisMonth = (s) => s.bookings.filter((b) => b.status !== "CANCELLED" && isWithinCurrentMonth(b.eventDate)).reduce((sum, b) => sum + b.totalAmount, 0);
const selectPendingQuotes = (s) => s.quotes.filter((q) => q.status === "DRAFT" || q.status === "SENT").length;
const selectNewLeads = (s) => s.leads.filter((l) => l.status === "NEW");
const selectConfirmedBookings = (s) => s.bookings.filter(
  (b) => ["CONFIRMED", "PREPARING", "OUT_ON_HIRE"].includes(b.status)
);
const selectUpcomingEventsList = (s) => s.events.filter((e) => e.status !== "CANCELLED" && (/* @__PURE__ */ new Date(`${e.date}T23:59:59`)).getTime() >= Date.now()).sort((a, b) => a.date.localeCompare(b.date));
const selectUpcomingEvents = (s) => selectUpcomingEventsList(s).length;
const selectLowStockItems = (s) => s.inventory.filter((i) => availableCount(i) <= (i.reorderLevel ?? 0));
const selectOutstandingPayments = (s) => s.bookings.filter((b) => b.status !== "CANCELLED" && b.status !== "COMPLETED").reduce((sum, b) => sum + b.balanceDue, 0);
const selectFollowUpsDue = (s) => s.leads.filter((l) => l.status === "FOLLOW_UP").length;
const selectFollowUpsList = (s) => s.leads.filter((l) => l.status === "FOLLOW_UP").sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
const selectRecentLeads = (s, count = 5) => [...s.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, count);
const selectUpcomingEventsPreview = (s, count = 5) => selectUpcomingEventsList(s).slice(0, count);
function lastMonthKeys(months) {
  const keys = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}
function toSeries(keys, counts) {
  return keys.map((k) => ({
    key: k,
    label: new Intl.DateTimeFormat("en-ZA", { month: "short", year: "numeric" }).format(
      /* @__PURE__ */ new Date(`${k}-01T12:00:00`)
    ),
    value: counts.get(k) ?? 0
  }));
}
const selectMonthlyRevenueSeries = (s, months = 6) => {
  const counts = /* @__PURE__ */ new Map();
  for (const b of s.bookings) {
    if (b.status === "CANCELLED") continue;
    const k = monthKey(b.eventDate);
    counts.set(k, (counts.get(k) ?? 0) + b.totalAmount);
  }
  return toSeries(lastMonthKeys(months), counts);
};
const selectMonthlyBookingsSeries = (s, months = 6) => {
  const counts = /* @__PURE__ */ new Map();
  for (const b of s.bookings) {
    if (b.status === "CANCELLED") continue;
    const k = monthKey(b.eventDate);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return toSeries(lastMonthKeys(months), counts);
};
const selectMonthlyLeadsSeries = (s, months = 6) => {
  const counts = /* @__PURE__ */ new Map();
  for (const l of s.leads) {
    const k = monthKey(l.createdAt);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return toSeries(lastMonthKeys(months), counts);
};
const selectQuoteConversion = (s) => {
  const total = s.quotes.length;
  const converted = s.bookings.filter((b) => b.quoteId).length;
  return { converted, total, rate: total === 0 ? 0 : converted / total };
};
const selectAverageBookingValue = (s) => {
  const active = s.bookings.filter((b) => b.status !== "CANCELLED");
  if (active.length === 0) return 0;
  return active.reduce((sum, b) => sum + b.totalAmount, 0) / active.length;
};
const selectMonthlyAverageValueSeries = (s, months = 6) => {
  const totals = /* @__PURE__ */ new Map();
  for (const b of s.bookings) {
    if (b.status === "CANCELLED") continue;
    const k = monthKey(b.eventDate);
    const cur = totals.get(k) ?? { sum: 0, n: 0 };
    totals.set(k, { sum: cur.sum + b.totalAmount, n: cur.n + 1 });
  }
  return lastMonthKeys(months).map((k) => {
    const cur = totals.get(k);
    return {
      key: k,
      label: new Intl.DateTimeFormat("en-ZA", { month: "short", year: "numeric" }).format(
        /* @__PURE__ */ new Date(`${k}-01T12:00:00`)
      ),
      value: cur && cur.n > 0 ? Math.round(cur.sum / cur.n) : 0
    };
  });
};
const selectInventoryTotals = (s) => {
  const totals = { total: 0, reserved: 0, available: 0, outOnHire: 0, damaged: 0, missing: 0 };
  for (const i of s.inventory) {
    totals.total += i.total;
    totals.reserved += i.reserved;
    totals.outOnHire += i.outOnHire;
    totals.damaged += i.damaged;
    totals.missing += i.missing;
    totals.available += availableCount(i);
  }
  return totals;
};
const selectReservationsByItemName = (s) => {
  const byItem = /* @__PURE__ */ new Map();
  for (const booking of s.bookings) {
    if (booking.status === "CANCELLED" || booking.status === "COMPLETED") continue;
    if (!booking.quoteId) continue;
    const quote = s.quotes.find((q) => q.id === booking.quoteId);
    if (!quote) continue;
    for (const line of quote.items) {
      if (line.type !== "product") continue;
      const existing = byItem.get(line.name) ?? [];
      existing.push({
        bookingId: booking.id,
        bookingName: booking.eventName,
        eventDate: booking.eventDate,
        quantity: line.quantity
      });
      byItem.set(line.name, existing);
    }
  }
  return byItem;
};
const selectInventoryUtilisationByCategory = (s) => {
  const per = /* @__PURE__ */ new Map();
  for (const i of s.inventory) {
    const cur = per.get(i.category) ?? { total: 0, inUse: 0 };
    cur.total += i.total;
    cur.inUse += i.reserved + i.outOnHire;
    per.set(i.category, cur);
  }
  return Array.from(per.entries()).map(([category, v]) => ({
    category,
    total: v.total,
    inUse: v.inUse,
    ratio: v.total === 0 ? 0 : v.inUse / v.total
  }));
};
function useDashboardStats() {
  const revenueThisMonth = useStore(selectRevenueThisMonth);
  const pendingQuotes = useStore(selectPendingQuotes);
  const upcomingEvents = useStore(selectUpcomingEvents);
  const lowStockCount = useStore((s) => selectLowStockItems(s).length);
  const outstandingPayments = useStore(selectOutstandingPayments);
  const followUpsDue = useStore(selectFollowUpsDue);
  const newLeads = useStore((s) => selectNewLeads(s).length);
  const confirmedBookings = useStore((s) => selectConfirmedBookings(s).length);
  return {
    revenueThisMonth,
    pendingQuotes,
    upcomingEvents,
    lowStockCount,
    outstandingPayments,
    followUpsDue,
    newLeads,
    confirmedBookings
  };
}
export {
  StatCard as S,
  selectUpcomingEventsPreview as a,
  selectLowStockItems as b,
  selectFollowUpsList as c,
  selectMonthlyRevenueSeries as d,
  selectMonthlyBookingsSeries as e,
  selectMonthlyLeadsSeries as f,
  selectMonthlyAverageValueSeries as g,
  selectQuoteConversion as h,
  selectAverageBookingValue as i,
  selectInventoryUtilisationByCategory as j,
  selectInventoryTotals as k,
  selectReservationsByItemName as l,
  selectRecentLeads as s,
  useDashboardStats as u
};
