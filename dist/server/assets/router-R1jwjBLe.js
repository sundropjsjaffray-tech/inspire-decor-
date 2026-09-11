import { jsx, jsxs } from "react/jsx-runtime";
import { createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
const appCss = "/assets/app-Dz9vfcIy.css";
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300..800&display=swap";
const Route$h = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "INSPIRE DECOR — Transforming Events Into Experiences" },
      {
        name: "description",
        content: "Event décor, draping, catering, crockery & equipment hire and full event setup in South Africa."
      }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS_URL },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  notFoundComponent: () => /* @__PURE__ */ jsx("div", { children: "Page not found" }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$g = () => import("./services-CHNiX20-.js");
const Route$g = createFileRoute("/services")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./quote-Btkw5ixl.js");
const Route$f = createFileRoute("/quote")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./gallery-DfBimdXH.js");
const Route$e = createFileRoute("/gallery")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./dashboard-DF0YPBLT.js");
const Route$d = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./corporate-CK2Iyn-J.js");
const Route$c = createFileRoute("/corporate")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./contact-D9CZrRLc.js");
const Route$b = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./consultation-DnVwQ0XK.js");
const Route$a = createFileRoute("/consultation")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-DwaaQ8dr.js");
const Route$9 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-CINxaU0P.js");
const Route$8 = createFileRoute("/hire/")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./index-BJtSLCGK.js");
const Route$7 = createFileRoute("/dashboard/")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./_category-BA4yDnvp.js");
const Route$6 = createFileRoute("/hire/$category")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./reports-Dwtd8nj9.js");
const Route$5 = createFileRoute("/dashboard/reports")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./quotes-BlFofVlE.js");
const Route$4 = createFileRoute("/dashboard/quotes")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  validateSearch: (search) => ({
    leadId: typeof search.leadId === "string" ? search.leadId : void 0
  })
});
const $$splitComponentImporter$3 = () => import("./leads-CDVvobnZ.js");
const Route$3 = createFileRoute("/dashboard/leads")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  validateSearch: (search) => ({
    lead: typeof search.lead === "string" ? search.lead : void 0
  })
});
const $$splitComponentImporter$2 = () => import("./inventory-6dXad7My.js");
const Route$2 = createFileRoute("/dashboard/inventory")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./events-DkM4Z-4U.js");
const Route$1 = createFileRoute("/dashboard/events")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./bookings-Vxp7g95P.js");
const Route = createFileRoute("/dashboard/bookings")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ServicesRoute = Route$g.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$h
});
const QuoteRoute = Route$f.update({
  id: "/quote",
  path: "/quote",
  getParentRoute: () => Route$h
});
const GalleryRoute = Route$e.update({
  id: "/gallery",
  path: "/gallery",
  getParentRoute: () => Route$h
});
const DashboardRoute = Route$d.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$h
});
const CorporateRoute = Route$c.update({
  id: "/corporate",
  path: "/corporate",
  getParentRoute: () => Route$h
});
const ContactRoute = Route$b.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$h
});
const ConsultationRoute = Route$a.update({
  id: "/consultation",
  path: "/consultation",
  getParentRoute: () => Route$h
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$h
});
const HireIndexRoute = Route$8.update({
  id: "/hire/",
  path: "/hire/",
  getParentRoute: () => Route$h
});
const DashboardIndexRoute = Route$7.update({
  id: "/",
  path: "/",
  getParentRoute: () => DashboardRoute
});
const HireCategoryRoute = Route$6.update({
  id: "/hire/$category",
  path: "/hire/$category",
  getParentRoute: () => Route$h
});
const DashboardReportsRoute = Route$5.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => DashboardRoute
});
const DashboardQuotesRoute = Route$4.update({
  id: "/quotes",
  path: "/quotes",
  getParentRoute: () => DashboardRoute
});
const DashboardLeadsRoute = Route$3.update({
  id: "/leads",
  path: "/leads",
  getParentRoute: () => DashboardRoute
});
const DashboardInventoryRoute = Route$2.update({
  id: "/inventory",
  path: "/inventory",
  getParentRoute: () => DashboardRoute
});
const DashboardEventsRoute = Route$1.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => DashboardRoute
});
const DashboardBookingsRoute = Route.update({
  id: "/bookings",
  path: "/bookings",
  getParentRoute: () => DashboardRoute
});
const DashboardRouteChildren = {
  DashboardBookingsRoute,
  DashboardEventsRoute,
  DashboardInventoryRoute,
  DashboardLeadsRoute,
  DashboardQuotesRoute,
  DashboardReportsRoute,
  DashboardIndexRoute
};
const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  ConsultationRoute,
  ContactRoute,
  CorporateRoute,
  DashboardRoute: DashboardRouteWithChildren,
  GalleryRoute,
  QuoteRoute,
  ServicesRoute,
  HireCategoryRoute,
  HireIndexRoute
};
const routeTree = Route$h._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: () => /* @__PURE__ */ jsx("p", { children: "Not found" })
  });
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$6 as R,
  Route$4 as a,
  Route$3 as b,
  router as r
};
