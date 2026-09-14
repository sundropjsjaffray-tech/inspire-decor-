import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { T as Table } from "./Table-DWkgwed-.js";
import { E as EmptyState } from "./EmptyState-BDGSXIRT.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { g as getEvents } from "./events-Nowsu8FT.js";
import { u as useStore } from "./index-CtB_iAzP.js";
import { e as eventTypeLabels, a as eventStatusMeta } from "./statusLabels-g8aoxix0.js";
import { m as monthKey, a as formatDate, c as cn } from "./util-D5Y4JTPp.js";
import "zustand";
import "zustand/middleware";
function EventsPage() {
  const events = useStore((s) => s.events);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    getEvents().then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const {
    upcoming,
    past
  } = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    return {
      upcoming: sorted.filter((e) => e.date >= today && e.status !== "CANCELLED"),
      past: sorted.filter((e) => e.date < today || e.status === "CANCELLED")
    };
  }, [events, today]);
  const groups = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const e of upcoming) {
      const k = monthKey(e.date);
      const list = map.get(k) ?? [];
      list.push(e);
      map.set(k, list);
    }
    return Array.from(map.entries());
  }, [upcoming]);
  const columns = [{
    key: "date",
    header: "Event date",
    render: (e) => /* @__PURE__ */ jsxs("span", { className: cn("font-semibold", e.date === today ? "text-gold-700" : "text-ink-900"), children: [
      formatDate(e.date),
      e.date === today && /* @__PURE__ */ jsx(Badge, { tone: "gold", className: "ml-2", children: "Today" })
    ] })
  }, {
    key: "customer",
    header: "Customer",
    render: (e) => e.customer.name
  }, {
    key: "type",
    header: "Event type",
    render: (e) => eventTypeLabels[e.type]
  }, {
    key: "venue",
    header: "Venue",
    render: (e) => e.venue
  }, {
    key: "guests",
    header: "Guests",
    align: "center",
    render: (e) => e.guests
  }, {
    key: "setupTime",
    header: "Setup",
    align: "center",
    render: (e) => e.setupTime
  }, {
    key: "eventTime",
    header: "Event",
    align: "center",
    render: (e) => e.eventTime
  }, {
    key: "collectionTime",
    header: "Collection",
    align: "center",
    render: (e) => e.collectionTime
  }, {
    key: "status",
    header: "Status",
    render: (e) => {
      const meta = eventStatusMeta[e.status];
      return /* @__PURE__ */ jsx(Badge, { tone: meta.tone, children: meta.label });
    }
  }];
  if (!loaded) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Events", eyebrow: "Dashboard", subtitle: "What happens on the day — dates, venues, guest counts, setup and collection times." }),
      /* @__PURE__ */ jsx(LoadingState, { label: "Loading events…" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Events", eyebrow: "Dashboard", subtitle: "What happens on the day — dates, venues, guest counts, setup and collection times." }),
    upcoming.length === 0 && /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(EmptyState, { title: "No upcoming events", description: "Converted bookings appear here as events." }) }),
    groups.map(([key, list]) => /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "mb-3 font-display text-lg font-semibold text-ink-900", children: [
        monthLabel(key),
        /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm font-normal text-ink-400", children: [
          list.length,
          " event",
          list.length > 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx(Table, { columns, rows: list, keyOf: (e) => e.id })
    ] }, key)),
    past.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsxs("h2", { className: "mb-3 font-display text-lg font-semibold text-ink-900", children: [
        "Past & cancelled",
        /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm font-normal text-ink-400", children: past.length })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "opacity-60", children: /* @__PURE__ */ jsx(Table, { columns, rows: [...past].reverse(), keyOf: (e) => e.id }) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs text-ink-400", children: "Events are derived from the events store; bookings feed this list when they reach CONFIRMED. Today's events are highlighted in gold." })
  ] });
}
function monthLabel(key) {
  return new Intl.DateTimeFormat("en-ZA", {
    month: "long",
    year: "numeric"
  }).format(/* @__PURE__ */ new Date(`${key}-01T12:00:00`));
}
export {
  EventsPage as component
};
