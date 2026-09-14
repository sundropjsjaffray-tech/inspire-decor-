import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, useLocation } from "@tanstack/react-router";
import { c as cn, d as delay, f as formatZAR } from "./util-D5Y4JTPp.js";
import { D as DEMO_DATA_NOTICE } from "./demo-vg2AtRWs.js";
import { useState, useEffect } from "react";
import { M as Modal, b as buttonClasses, B as Button } from "./Modal-ce_tYN3H.js";
import { E as EmptyState } from "./EmptyState-BDGSXIRT.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { u as useStore } from "./index-CtB_iAzP.js";
import { g as getProducts } from "./products-BbopjXnd.js";
function Img({ alt, fallbackLabel, className, onError, ...props }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = failed || !props.src;
  if (showPlaceholder) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        role: "img",
        "aria-label": alt,
        className: cn(
          "flex items-center justify-center bg-gradient-to-br from-champagne-200 via-champagne-100 to-gold-200 text-ink-400",
          className
        ),
        children: /* @__PURE__ */ jsx("span", { className: "font-display text-3xl font-semibold text-gold-600", children: (fallbackLabel ?? alt).trim().charAt(0).toUpperCase() })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      alt,
      loading: "lazy",
      className,
      onError: (e) => {
        setFailed(true);
        onError?.(e);
      },
      ...props
    }
  );
}
async function addProductToEnquiry(productId, quantity) {
  await delay(150);
  useStore.getState().addToEnquiry(productId, quantity);
}
async function updateEnquiryLineQuantity(productId, quantity) {
  await delay(100);
  if (quantity <= 0) {
    useStore.getState().removeFromEnquiry(productId);
    return;
  }
  useStore.getState().updateEnquiryLine(productId, quantity);
}
async function removeFromEnquiryList(productId) {
  await delay(100);
  useStore.getState().removeFromEnquiry(productId);
}
async function clearEnquiryList() {
  await delay(100);
  useStore.getState().clearEnquiry();
}
function EnquiryWidget() {
  const enquiryList = useStore((s) => s.enquiryList);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let alive = true;
    getProducts().then((list) => {
      if (alive) setProducts(list);
    });
    return () => {
      alive = false;
    };
  }, []);
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = enquiryList.map((line) => {
    const product = byId.get(line.productId);
    if (!product) return null;
    return { product, quantity: line.quantity, lineTotal: product.hirePrice * line.quantity };
  }).filter((l) => l !== null);
  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        "aria-label": `Open enquiry list, ${count} item${count === 1 ? "" : "s"}`,
        className: "fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-xl text-ink-950 shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
        children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "◆" }),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-950 px-1 text-xs font-bold text-gold-200", children: count })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Modal, { open, onClose: () => setOpen(false), title: "Your Enquiry List", size: "md", children: lines.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "No items yet",
        description: "Browse the hire catalogue and add tables, chairs, crockery and more to your enquiry.",
        action: /* @__PURE__ */ jsx(Link, { to: "/hire", className: buttonClasses("primary"), onClick: () => setOpen(false), children: "Browse Hire Catalogue" })
      }
    ) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("ul", { className: "divide-y divide-ink-100", children: lines.map(({ product, quantity, lineTotal }) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 py-3", children: [
        /* @__PURE__ */ jsx(
          Img,
          {
            src: product.image,
            alt: product.name,
            fallbackLabel: product.name,
            className: "h-12 w-12 shrink-0 rounded-lg object-cover"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-ink-900", children: product.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-400", children: [
            formatZAR(product.hirePrice),
            " · ",
            product.unit
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": `Decrease quantity of ${product.name}`,
                onClick: () => updateEnquiryLineQuantity(product.id, quantity - 1),
                className: "rounded border border-ink-300 px-1.5 text-sm leading-5 text-ink-600 hover:bg-ink-100",
                children: "−"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "min-w-6 text-center text-sm font-medium", children: quantity }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": `Increase quantity of ${product.name}`,
                onClick: () => updateEnquiryLineQuantity(product.id, quantity + 1),
                className: "rounded border border-ink-300 px-1.5 text-sm leading-5 text-ink-600 hover:bg-ink-100",
                children: "+"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-ink-900", children: formatZAR(lineTotal) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeFromEnquiryList(product.id),
              className: "text-xs text-ink-400 underline-offset-2 hover:text-red-600 hover:underline",
              children: "Remove"
            }
          )
        ] })
      ] }, product.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-ink-200 pt-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink-600", children: "Estimated hire total" }),
        /* @__PURE__ */ jsx(PriceTag, { amount: total, className: "text-lg" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-400", children: "Daily hire rates, VAT inclusive. Demonstration pricing for preview." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1", children: [
        /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("primary"), onClick: () => setOpen(false), children: "Request Quote" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => clearEnquiryList(), children: "Clear list" })
      ] })
    ] }) })
  ] });
}
const NAV = [
  { href: "/", label: "Home", end: true },
  { href: "/services", label: "Services" },
  { href: "/hire", label: "Hire" },
  { href: "/gallery", label: "Gallery" },
  { href: "/corporate", label: "Corporate" },
  { href: "/consultation", label: "Consultation" },
  { href: "/contact", label: "Contact" }
];
function NavItem({ href, label, end = false }) {
  const pathname = useLocation().pathname;
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return /* @__PURE__ */ jsx(
    Link,
    {
      to: href,
      className: cn(
        "text-sm font-medium transition-colors",
        isActive ? "text-gold-700" : "text-ink-600 hover:text-ink-950"
      ),
      children: label
    }
  );
}
function CustomerLayout({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-dvh flex-col bg-champagne-100/40", children: [
    /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 border-b border-ink-200/70 bg-white/90 backdrop-blur", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "font-display text-xl font-bold tracking-wide text-ink-950", children: [
          "INSPIRE",
          /* @__PURE__ */ jsx("span", { className: "text-gold-600", children: " DECOR" })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "hidden items-center gap-6 md:flex", children: NAV.map((item) => /* @__PURE__ */ jsx(NavItem, { href: item.href, label: item.label, end: item.end }, item.href)) }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/quote",
            className: "inline-flex items-center justify-center rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-ink-950 shadow-sm transition-colors hover:bg-gold-400",
            children: "Get a Quote"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex gap-4 overflow-x-auto border-t border-ink-100 px-4 py-2 md:hidden", children: NAV.map((item) => /* @__PURE__ */ jsx(NavItem, { href: item.href, label: item.label, end: item.end }, item.href)) })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10", children }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-ink-200 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl px-4 py-8", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-display text-lg font-bold text-ink-950", children: [
        "INSPIRE",
        /* @__PURE__ */ jsx("span", { className: "text-gold-600", children: " DECOR" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-ink-400", children: DEMO_DATA_NOTICE }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs text-ink-400", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " INSPIRE DECOR · Transforming Events Into Experiences"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(EnquiryWidget, {})
  ] });
}
export {
  CustomerLayout as C,
  Img as I,
  addProductToEnquiry as a,
  clearEnquiryList as c,
  removeFromEnquiryList as r
};
