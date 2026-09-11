import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { I as Img, a as addProductToEnquiry, C as CustomerLayout } from "./CustomerLayout-B_3xXtEn.js";
import { B as Button, b as buttonClasses } from "./Modal-ce_tYN3H.js";
import { E as EmptyState } from "./EmptyState-BDGSXIRT.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { a as getCategories, b as getProductsByCategory } from "./products-BpU3TxX9.js";
import { R as Route } from "./router-R1jwjBLe.js";
import "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./index-DpiVUCS0.js";
import "zustand";
import "zustand/middleware";
import "react-dom";
function ProductCard({ product, categoryName, categoryImage }) {
  const available = product.quantityAvailable;
  const outOfStock = available <= 0;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const handleAdd = async () => {
    await addProductToEnquiry(product.id, qty);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        Img,
        {
          src: product.image || categoryImage,
          alt: product.name,
          fallbackLabel: product.name,
          className: "aspect-[4/3] w-full object-cover"
        }
      ),
      outOfStock && /* @__PURE__ */ jsx("span", { className: "absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white", children: "Unavailable" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold text-ink-900", children: product.name }),
          categoryName && /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-ink-400", children: categoryName })
        ] }),
        /* @__PURE__ */ jsx(PriceTag, { amount: product.hirePrice })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-500", children: product.description }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-400", children: [
        product.unit,
        " · per day · VAT incl. ·",
        " ",
        /* @__PURE__ */ jsx("span", { className: outOfStock ? "font-semibold text-red-600" : available <= 5 ? "font-semibold text-amber-600" : "text-ink-500", children: outOfStock ? "no stock" : `${available} available` })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center gap-2 pt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-lg border border-ink-300", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": `Decrease quantity of ${product.name}`,
              disabled: qty <= 1 || outOfStock,
              onClick: () => setQty((q) => Math.max(1, q - 1)),
              className: "px-2.5 py-1.5 text-sm text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-40",
              children: "−"
            }
          ),
          /* @__PURE__ */ jsx("span", { "aria-live": "polite", className: "min-w-7 text-center text-sm font-medium text-ink-900", children: qty }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": `Increase quantity of ${product.name}`,
              disabled: qty >= available || outOfStock,
              onClick: () => setQty((q) => Math.min(available, q + 1)),
              className: "px-2.5 py-1.5 text-sm text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-40",
              children: "+"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: added ? "secondary" : "primary",
            className: "flex-1",
            onClick: handleAdd,
            disabled: outOfStock,
            "aria-label": outOfStock ? `${product.name} is currently unavailable` : `Add ${qty} × ${product.name} to enquiry`,
            children: outOfStock ? "Unavailable" : added ? "✓ Added" : "Add to Enquiry"
          }
        )
      ] })
    ] })
  ] });
}
function HireCategoryPage() {
  const {
    category: categoryId
  } = Route.useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    let alive = true;
    setProducts(null);
    setNotFound(false);
    Promise.all([getCategories(), getProductsByCategory(categoryId)]).then(([categories, prods]) => {
      if (!alive) return;
      const map = new Map(categories.map((c) => [c.id, c]));
      setCategory(map.get(categoryId) ?? null);
      setProducts(prods);
      if (!map.has(categoryId)) setNotFound(true);
    });
    return () => {
      alive = false;
    };
  }, [categoryId]);
  if (notFound) {
    return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Category not found", eyebrow: "Hire catalogue" }),
      /* @__PURE__ */ jsx(EmptyState, { title: "We couldn't find that category", description: "The catalogue has 12 categories — head back to browse them.", action: /* @__PURE__ */ jsx(Link, { to: "/hire", className: buttonClasses("primary"), children: "Browse Hire Catalogue" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
    /* @__PURE__ */ jsx(Link, { to: "/hire", className: "text-sm font-medium text-gold-700 underline-offset-4 hover:underline", children: "← All categories" }),
    !category || !products ? /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(LoadingState, { label: "Loading products…" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: category.name, eyebrow: "Hire catalogue", subtitle: `${category.description} · ${products.length} product${products.length === 1 ? "" : "s"} · daily hire rates, VAT incl. (demo data)` }),
      products.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { title: "No products in this category yet", description: "Check back soon — or contact us and we'll source it for you.", action: /* @__PURE__ */ jsx(Link, { to: "/contact", className: buttonClasses("primary"), children: "Speak to Us" }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: products.map((product) => /* @__PURE__ */ jsx(ProductCard, { product, categoryName: category.name, categoryImage: category.image }, product.id)) }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 text-xs text-ink-400", children: "Prices are per day, VAT inclusive, and are demonstration rates. Add items to your enquiry list and request a quote — our team will confirm availability for your date." })
    ] })
  ] });
}
export {
  HireCategoryPage as component
};
