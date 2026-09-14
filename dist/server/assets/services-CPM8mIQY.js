import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { C as CustomerLayout, I as Img } from "./CustomerLayout-Dmbsnk0W.js";
import { b as buttonClasses } from "./Modal-ce_tYN3H.js";
import { C as Card } from "./Card-Zmhmk8cF.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { g as getServices } from "./content-L4BOmwm4.js";
import "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./EmptyState-BDGSXIRT.js";
import "./index-CtB_iAzP.js";
import "zustand";
import "zustand/middleware";
import "./products-BbopjXnd.js";
import "react-dom";
import "./site-Csrvuq7G.js";
function ServicesPage() {
  const [services, setServices] = useState(null);
  useEffect(() => {
    let alive = true;
    getServices().then((list) => {
      if (alive) setServices(list);
    });
    return () => {
      alive = false;
    };
  }, []);
  return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Our Services", eyebrow: "What we do", subtitle: "Ten ways we carry your event — hire one service or let us plan the whole thing. All prices are demo rates, VAT inclusive." }),
    !services ? /* @__PURE__ */ jsx(LoadingState, { label: "Loading services…" }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: services.map((service) => /* @__PURE__ */ jsxs(Card, { padded: false, className: "flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx(Img, { src: service.image, alt: service.name, fallbackLabel: service.name, className: "aspect-[4/3] w-full object-cover" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2 p-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-semibold text-ink-900", children: service.name }),
        /* @__PURE__ */ jsx("p", { className: "flex-1 text-sm leading-relaxed text-ink-500", children: service.description }),
        /* @__PURE__ */ jsx("div", { className: "flex items-baseline justify-between gap-2 border-t border-ink-100 pt-3", children: service.startingPrice !== null ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(PriceTag, { amount: service.startingPrice, prefix: "From" }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-ink-400", children: service.priceLabel })
        ] }) : /* @__PURE__ */ jsx(PriceTag, { amount: 0, custom: true }) }),
        /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("primary", "sm") + " mt-2 w-full", "aria-label": `Enquire about ${service.name}`, children: "Enquire" })
      ] })
    ] }, service.id)) }),
    /* @__PURE__ */ jsxs("p", { className: "mt-8 text-center text-xs text-ink-400", children: [
      "Not sure what you need?",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/consultation", className: "font-medium text-gold-700 underline-offset-4 hover:underline", children: "Book a free consultation" }),
      " ",
      "and we'll help you shape it."
    ] })
  ] });
}
export {
  ServicesPage as component
};
