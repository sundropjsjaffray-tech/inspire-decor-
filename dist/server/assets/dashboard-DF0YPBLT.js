import { jsxs, jsx } from "react/jsx-runtime";
import { useLocation, Link, Outlet } from "@tanstack/react-router";
import { c as cn } from "./util-D5Y4JTPp.js";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { D as DEMO_DATA_NOTICE, a as DEMO_DATA_BADGE } from "./demo-vg2AtRWs.js";
const NAV = [
  { href: "/dashboard", label: "Overview", end: true },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/quotes", label: "Quotes" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/events", label: "Events" },
  { href: "/dashboard/reports", label: "Reports" }
];
function NavItem({ href, label, end = false }) {
  const pathname = useLocation().pathname;
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return /* @__PURE__ */ jsx(
    Link,
    {
      to: href,
      className: cn(
        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-gold-500 text-ink-950" : "text-ink-300 hover:bg-ink-800 hover:text-white"
      ),
      children: label
    }
  );
}
function DashboardLayout({ children }) {
  const pathname = useLocation().pathname;
  const mobileLinkClasses = (href, end = false) => {
    const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return cn(
      "whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium",
      isActive ? "bg-gold-100 text-gold-700" : "text-ink-600"
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-dvh bg-ink-50", children: [
    /* @__PURE__ */ jsxs("aside", { className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-ink-950 text-ink-300 lg:flex", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-5", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "font-display text-lg font-bold text-white", children: [
          "INSPIRE",
          /* @__PURE__ */ jsx("span", { className: "text-gold-400", children: " DECOR" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[11px] uppercase tracking-widest text-ink-500", children: "Admin" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-1 px-3", children: NAV.map((item) => /* @__PURE__ */ jsx(NavItem, { href: item.href, label: item.label, end: item.end }, item.href)) }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-4 text-[11px] leading-relaxed text-ink-500", children: DEMO_DATA_NOTICE })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-4 border-b border-ink-200 bg-white px-4 py-3 sm:px-6", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-ink-500", children: [
          "Admin ",
          /* @__PURE__ */ jsx("span", { className: "mx-1 text-ink-300", children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "text-ink-900", children: "Dashboard" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Badge, { tone: "gold", children: DEMO_DATA_BADGE }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-gold-500 hover:text-gold-700",
              children: "View site"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex gap-2 overflow-x-auto border-b border-ink-200 bg-white px-4 py-2 lg:hidden", children: NAV.map((item) => /* @__PURE__ */ jsx(Link, { to: item.href, className: mobileLinkClasses(item.href, item.end), children: item.label }, item.href)) }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 sm:p-6", children })
    ] })
  ] });
}
function DashboardLayoutRoute() {
  return /* @__PURE__ */ jsx(DashboardLayout, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
export {
  DashboardLayoutRoute as component
};
