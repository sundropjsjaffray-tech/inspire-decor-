import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { C as CustomerLayout, I as Img } from "./CustomerLayout-B_3xXtEn.js";
import { b as buttonClasses } from "./Modal-ce_tYN3H.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { a as getCategories, g as getProducts } from "./products-BpU3TxX9.js";
import "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./EmptyState-BDGSXIRT.js";
import "./PriceTag-XtvFw5qZ.js";
import "./index-DpiVUCS0.js";
import "zustand";
import "zustand/middleware";
import "react-dom";
function HirePage() {
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([getCategories(), getProducts()]).then(([cats, prods]) => {
      if (!alive) return;
      setCategories(cats);
      setProducts(prods);
    });
    return () => {
      alive = false;
    };
  }, []);
  const countFor = (id) => (products ?? []).filter((p) => p.category === id).length;
  return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Hire Catalogue", eyebrow: "Hire", subtitle: "12 categories of décor, crockery, glassware, linen, furniture and more — daily hire rates, VAT inclusive. All catalogue data is demonstration data." }),
    !categories || !products ? /* @__PURE__ */ jsx(LoadingState, { label: "Loading catalogue…" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: categories.map((category) => /* @__PURE__ */ jsxs(Link, { to: "/hire/$category", params: {
        category: category.id
      }, className: "group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md", children: [
        /* @__PURE__ */ jsx(Img, { src: category.image, alt: category.name, fallbackLabel: category.name, className: "aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-1 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-semibold text-ink-900", children: category.name }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-champagne-200 px-2 py-0.5 text-xs font-semibold text-ink-700", children: [
              countFor(category.id),
              " items"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-500", children: category.description }),
          /* @__PURE__ */ jsx("span", { className: buttonClasses("secondary", "sm") + " mt-3 self-start", children: "View products →" })
        ] })
      ] }, category.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-xl border border-dashed border-gold-300 bg-champagne-100/60 p-5 text-sm text-ink-600", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink-800", children: "Pricing note:" }),
        " all hire prices are per day, VAT inclusive, and are ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "demonstration rates" }),
        " for preview only. Final quotes are confirmed on your personalised quote."
      ] })
    ] })
  ] });
}
export {
  HirePage as component
};
