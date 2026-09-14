import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { C as Card, a as CardHeader } from "./Card-Zmhmk8cF.js";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { u as useDashboardStats, s as selectRecentLeads, a as selectUpcomingEventsPreview, b as selectLowStockItems, c as selectFollowUpsList, d as selectMonthlyRevenueSeries, e as selectMonthlyBookingsSeries, S as StatCard } from "./selectors-5nzwJt6R.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { g as getLeads } from "./leads-D6YQVvDy.js";
import { g as getEvents } from "./events-Nowsu8FT.js";
import { u as useStore } from "./index-CtB_iAzP.js";
import { l as leadStatusMeta, e as eventTypeLabels } from "./statusLabels-g8aoxix0.js";
import { f as formatZAR, a as formatDate, c as cn } from "./util-D5Y4JTPp.js";
import "zustand";
import "zustand/middleware";
function DashboardHomePage() {
  const stats = useDashboardStats();
  const [loaded, setLoaded] = useState(false);
  const state = useStore();
  const recentLeads = useMemo(() => selectRecentLeads(state, 5), [state]);
  const upcomingEvents = useMemo(() => selectUpcomingEventsPreview(state, 5), [state]);
  const lowStock = useMemo(() => selectLowStockItems(state), [state]);
  const followUps = useMemo(() => selectFollowUpsList(state), [state]);
  const revenueSeries = useMemo(() => selectMonthlyRevenueSeries(state, 6), [state]);
  const bookingsSeries = useMemo(() => selectMonthlyBookingsSeries(state, 6), [state]);
  useEffect(() => {
    let alive = true;
    Promise.all([getLeads(), getEvents()]).then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  if (!loaded) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Overview", eyebrow: "Dashboard", subtitle: "Revenue, pipeline and alerts at a glance." }),
      /* @__PURE__ */ jsx(LoadingState, { label: "Loading overview…" })
    ] });
  }
  const maxRevenue = Math.max(...revenueSeries.map((p) => p.value), 1);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Overview", eyebrow: "Dashboard", subtitle: "Revenue, pipeline and alerts at a glance. Every number is live from the store." }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "New enquiries", value: stats.newLeads, tone: "info", hint: "Leads in NEW status" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Quotes pending", value: stats.pendingQuotes, hint: "Draft or sent, awaiting decision" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Confirmed bookings", value: stats.confirmedBookings, tone: "gold", hint: "Confirmed, preparing or out on hire" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Revenue this month", value: /* @__PURE__ */ jsx(PriceTag, { amount: stats.revenueThisMonth }), hint: "Bookings with events this month" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Outstanding payments", value: /* @__PURE__ */ jsx(PriceTag, { amount: stats.outstandingPayments }), tone: "warning", hint: "Balance due across active bookings" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Upcoming events", value: stats.upcomingEvents, hint: "Next events on the calendar" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Inventory alerts", value: stats.lowStockCount, tone: "danger", hint: "Items at or below reorder level" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Follow-ups due", value: stats.followUpsDue, hint: "Leads in FOLLOW_UP" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-6", children: [
      /* @__PURE__ */ jsx(CardHeader, { title: "Revenue & bookings trend", subtitle: "Last 6 months — bars show revenue; dots show bookings won" }),
      /* @__PURE__ */ jsx("div", { className: "flex h-32 items-end gap-2", children: revenueSeries.map((p) => {
        const bookings = bookingsSeries.find((b) => b.key === p.key)?.value ?? 0;
        return /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-center gap-1", title: `${p.label}: ${formatZAR(p.value)} · ${bookings} bookings`, children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-ink-500", children: formatZAR(p.value) }),
          /* @__PURE__ */ jsx("div", { className: "relative w-full rounded-t bg-gold-300", style: {
            height: `${Math.max(p.value / maxRevenue * 100, 2)}%`
          }, children: /* @__PURE__ */ jsx("span", { className: "absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-ink-800", title: `${bookings} bookings`, "aria-hidden": true }) })
        ] }, p.key);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 flex gap-2 border-t border-ink-200 pt-1", children: revenueSeries.map((p) => /* @__PURE__ */ jsx("span", { className: "flex-1 text-center text-[10px] text-ink-400", children: p.label }, p.key)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-4 text-xs text-ink-400", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-gold-300" }),
          " Revenue"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-ink-800" }),
          " Bookings"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { padded: false, children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Recent enquiries", subtitle: "Latest leads — open for full detail", className: "px-5 pt-5", action: /* @__PURE__ */ jsx(Link, { to: "/dashboard/leads", search: {
          lead: void 0
        }, className: "text-sm font-medium text-gold-700 hover:underline", children: "View all →" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "divide-y divide-ink-100", children: [
          recentLeads.map((l) => {
            const meta = leadStatusMeta[l.status];
            return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/leads", search: {
              lead: l.id
            }, className: "flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-champagne-100/50", children: [
              /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("span", { className: "block truncate font-medium text-ink-900", children: l.customer.name }),
                /* @__PURE__ */ jsxs("span", { className: "block truncate text-xs text-ink-500", children: [
                  eventTypeLabels[l.eventType],
                  " · ",
                  l.guests,
                  " guests · ",
                  formatDate(l.eventDate)
                ] })
              ] }),
              /* @__PURE__ */ jsx(Badge, { tone: meta.tone, children: meta.label })
            ] }) }, l.id);
          }),
          recentLeads.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-5 py-8 text-center text-sm text-ink-400", children: "No leads yet." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { padded: false, children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Upcoming events", subtitle: "Next five on the calendar", className: "px-5 pt-5", action: /* @__PURE__ */ jsx(Link, { to: "/dashboard/events", className: "text-sm font-medium text-gold-700 hover:underline", children: "View all →" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "divide-y divide-ink-100", children: [
          upcomingEvents.map((e) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 px-5 py-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "block truncate font-medium text-ink-900", children: e.name }),
              /* @__PURE__ */ jsxs("span", { className: "block truncate text-xs text-ink-500", children: [
                e.venue,
                " · ",
                e.guests,
                " guests"
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 text-sm font-semibold text-ink-700", children: formatDate(e.date) })
          ] }, e.id)),
          upcomingEvents.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-5 py-8 text-center text-sm text-ink-400", children: "No upcoming events." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { padded: false, children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Low stock alerts", subtitle: "At or below reorder level", className: "px-5 pt-5", action: /* @__PURE__ */ jsx(Link, { to: "/dashboard/inventory", className: "text-sm font-medium text-gold-700 hover:underline", children: "Inventory →" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "divide-y divide-ink-100", children: [
          lowStock.map((i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between px-5 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-ink-800", children: i.name }),
            /* @__PURE__ */ jsxs("span", { className: "text-ink-500", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-amber-700", children: stockAvail(i) }),
              " available of ",
              i.total
            ] })
          ] }, i.id)),
          lowStock.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-5 py-8 text-center text-sm text-ink-400", children: "All stock levels OK." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { padded: false, children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Follow-ups due", subtitle: "Leads in FOLLOW_UP that need attention", className: "px-5 pt-5", action: /* @__PURE__ */ jsx(Link, { to: "/dashboard/leads", search: {
          lead: void 0
        }, className: "text-sm font-medium text-gold-700 hover:underline", children: "Leads →" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "divide-y divide-ink-100", children: [
          followUps.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/leads", search: {
            lead: l.id
          }, className: "flex items-center justify-between gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-champagne-100/50", children: [
            /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "block truncate font-medium text-ink-800", children: l.customer.name }),
              l.nextAction && /* @__PURE__ */ jsx("span", { className: "block truncate text-xs text-ink-500", children: l.nextAction })
            ] }),
            /* @__PURE__ */ jsx(Badge, { tone: "warning", children: "Follow-up" })
          ] }) }, l.id)),
          followUps.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-5 py-8 text-center text-sm text-ink-400", children: "Nothing due — good work." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: cn("mt-6 text-xs text-ink-400"), children: "All figures are demonstration data from the sample store." })
  ] });
}
function stockAvail(item) {
  return Math.max(0, item.total - item.reserved - item.outOnHire - item.damaged - item.missing);
}
export {
  DashboardHomePage as component
};
