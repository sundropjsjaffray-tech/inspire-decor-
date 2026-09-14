import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { C as Card, a as CardHeader } from "./Card-Zmhmk8cF.js";
import { d as selectMonthlyRevenueSeries, h as selectMonthlyLeadsSeries, e as selectMonthlyBookingsSeries, i as selectMonthlyAverageValueSeries, j as selectQuoteConversion, k as selectAverageBookingValue, l as selectInventoryUtilisationByCategory, S as StatCard } from "./selectors-5nzwJt6R.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { a as getQuotes } from "./quotes-BvkyA1uv.js";
import { u as useStore } from "./index-CtB_iAzP.js";
import { f as formatZAR } from "./util-D5Y4JTPp.js";
import "./bookings-D7sGTTxt.js";
import "./inventory-eYTHJsOD.js";
import "zustand";
import "zustand/middleware";
function ReportsPage() {
  const [loaded, setLoaded] = useState(false);
  const state = useStore();
  const revenueSeries = useMemo(() => selectMonthlyRevenueSeries(state), [state]);
  const leadsSeries = useMemo(() => selectMonthlyLeadsSeries(state), [state]);
  const bookingsSeries = useMemo(() => selectMonthlyBookingsSeries(state), [state]);
  const avgSeries = useMemo(() => selectMonthlyAverageValueSeries(state), [state]);
  const conversion = useMemo(() => selectQuoteConversion(state), [state]);
  const avgValue = useMemo(() => selectAverageBookingValue(state), [state]);
  const utilisation = useMemo(() => selectInventoryUtilisationByCategory(state), [state]);
  useEffect(() => {
    let alive = true;
    getQuotes().then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  if (!loaded) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Reports", eyebrow: "Dashboard", subtitle: "Revenue, pipeline and stock summaries to run the business on." }),
      /* @__PURE__ */ jsx(LoadingState, { label: "Building reports…" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Reports", eyebrow: "Dashboard", subtitle: "Revenue, pipeline and stock summaries to run the business on — all derived live from bookings, leads and inventory." }),
    /* @__PURE__ */ jsxs("p", { className: "mb-6 rounded-lg border border-dashed border-ink-300 bg-champagne-100/60 px-4 py-3 text-sm text-ink-600", children: [
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Demonstration data." }),
      " All figures below are computed from the sample records in the store — not real client information."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Quote conversion", value: `${Math.round(conversion.rate * 100)}%`, tone: "gold", hint: `${conversion.converted} of ${conversion.total} quotes became bookings` }),
      /* @__PURE__ */ jsx(StatCard, { label: "Average booking value", value: formatZAR(avgValue), hint: "Across all non-cancelled bookings" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Revenue (6 months)", value: formatZAR(revenueSeries.reduce((s, p) => s + p.value, 0)), tone: "info", hint: "Bookings with events in the period" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Monthly revenue", subtitle: "Non-cancelled bookings, by event month (last 6 months)" }),
        /* @__PURE__ */ jsx(BarChart, { points: revenueSeries, formatValue: (v) => formatZAR(v), barClassName: "bg-gold-500" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Enquiries per month", subtitle: "Leads created per month (last 6 months)" }),
        /* @__PURE__ */ jsx(BarChart, { points: leadsSeries, formatValue: (v) => `${v}`, barClassName: "bg-sky-500" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Confirmed bookings per month", subtitle: "Bookings by event month (last 6 months)" }),
        /* @__PURE__ */ jsx(BarChart, { points: bookingsSeries, formatValue: (v) => `${v}`, barClassName: "bg-emerald-500" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { title: "Average booking value per month", subtitle: "Total ÷ bookings, by event month" }),
        /* @__PURE__ */ jsx(BarChart, { points: avgSeries, formatValue: (v) => formatZAR(v), barClassName: "bg-gold-400" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-6", children: [
      /* @__PURE__ */ jsx(CardHeader, { title: "Quote conversion", subtitle: "Quotes → bookings, at a glance" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-display text-4xl font-semibold text-ink-950", children: [
          Math.round(conversion.rate * 100),
          "%"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-3 flex-1 overflow-hidden rounded-full bg-ink-100", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gold-500 transition-all", style: {
          width: `${Math.max(2, conversion.rate * 100)}%`
        }, role: "img", "aria-label": `${Math.round(conversion.rate * 100)}% of quotes converted to bookings` }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-500", children: [
          conversion.converted,
          " converted of ",
          conversion.total,
          " quotes"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-6", children: [
      /* @__PURE__ */ jsx(CardHeader, { title: "Inventory utilisation by category", subtitle: "Reserved + out-on-hire as a share of total stock per category" }),
      utilisation.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-500", children: "No inventory data." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: utilisation.map((u) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "w-36 shrink-0 text-sm capitalize text-ink-700", children: u.category }),
        /* @__PURE__ */ jsx("div", { className: "h-4 flex-1 overflow-hidden rounded-full bg-ink-100", children: /* @__PURE__ */ jsx("div", { className: "flex h-full items-center rounded-full bg-ink-800 pl-2 text-[10px] font-semibold text-white", style: {
          width: `${Math.max(u.ratio * 100, 2)}%`
        }, role: "img", "aria-label": `${u.category}: ${Math.round(u.ratio * 100)}% utilised`, children: u.ratio > 0.25 && `${Math.round(u.ratio * 100)}%` }) }),
        /* @__PURE__ */ jsxs("span", { className: "w-32 shrink-0 text-right text-xs text-ink-500", children: [
          u.inUse,
          " of ",
          u.total,
          " units"
        ] })
      ] }, u.category)) })
    ] })
  ] });
}
function BarChart({
  points,
  formatValue,
  barClassName
}) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-40 items-end gap-2", children: points.map((p) => {
      const h = Math.max(p.value / max * 100, p.value > 0 ? 4 : 1);
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-center gap-1", title: `${p.label}: ${formatValue(p.value)}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-ink-600", children: formatValue(p.value) }),
        /* @__PURE__ */ jsx("div", { className: `w-full rounded-t ${barClassName}`, style: {
          height: `${h}%`
        }, role: "img", "aria-label": `${p.label}: ${formatValue(p.value)}` })
      ] }, p.key);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 flex gap-2 border-t border-ink-200 pt-1", children: points.map((p) => /* @__PURE__ */ jsx("span", { className: "flex-1 text-center text-[10px] text-ink-400", children: p.label }, p.key)) })
  ] });
}
export {
  ReportsPage as component
};
