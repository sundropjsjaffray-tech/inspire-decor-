import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { C as CustomerLayout, I as Img } from "./CustomerLayout-Dmbsnk0W.js";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { M as Modal } from "./Modal-ce_tYN3H.js";
import { E as EmptyState } from "./EmptyState-BDGSXIRT.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { T as Tabs } from "./Tabs-CPOLYykp.js";
import { a as getGallery } from "./content-L4BOmwm4.js";
import "@tanstack/react-router";
import "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./PriceTag-XtvFw5qZ.js";
import "./index-CtB_iAzP.js";
import "zustand";
import "zustand/middleware";
import "./products-BbopjXnd.js";
import "react-dom";
import "./site-Csrvuq7G.js";
function GalleryPage() {
  const [items, setItems] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    let alive = true;
    getGallery().then((list) => {
      if (alive) setItems(list);
    });
    return () => {
      alive = false;
    };
  }, []);
  const tabs = useMemo(() => {
    if (!items) return [];
    const categories = Array.from(new Set(items.map((i) => i.category)));
    return [{
      id: "all",
      label: "All"
    }, ...categories.map((c) => ({
      id: c,
      label: c
    }))];
  }, [items]);
  const visible = items ? activeTab === "all" ? items : items.filter((i) => i.category === activeTab) : [];
  return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Event Gallery", eyebrow: "Our work", subtitle: "Weddings, matric farewells, corporate galas and private celebrations — a look at the events we've styled. Sample demonstration photos." }),
    !items ? /* @__PURE__ */ jsx(LoadingState, { label: "Loading gallery…" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(Tabs, { tabs, value: activeTab, onChange: setActiveTab }) }),
      visible.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { title: "No photos in this category yet", description: "Check back soon — new events are added regularly." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: visible.map((item) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setSelected(item), className: "group relative block overflow-hidden rounded-xl border border-ink-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500", "aria-label": `View photo: ${item.caption}`, children: [
        /* @__PURE__ */ jsx(Img, { src: item.image, alt: item.caption, fallbackLabel: "Event", className: "aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 to-transparent px-3 pb-2 pt-8", children: /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-medium text-white", children: item.caption }) })
      ] }, item.id)) }),
      /* @__PURE__ */ jsx(Modal, { open: selected !== null, onClose: () => setSelected(null), title: selected?.caption, size: "lg", children: selected && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Img, { src: selected.image?.replace("w=900", "w=1400"), alt: selected.caption, fallbackLabel: "Event", className: "aspect-[4/3] w-full rounded-lg object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-500", children: selected.caption }),
          /* @__PURE__ */ jsx(Badge, { tone: "gold", children: selected.category })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  GalleryPage as component
};
