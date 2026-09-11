import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { B as Button, M as Modal } from "./Modal-ce_tYN3H.js";
import { B as Badge } from "./Badge-DW2eMpwP.js";
import { F as Field, I as Input } from "./Field-ii2diUOC.js";
import { k as selectInventoryTotals, l as selectReservationsByItemName, S as StatCard } from "./selectors-OptBZJ2V.js";
import { T as Table } from "./Table-DWkgwed-.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { g as getEvents } from "./events-JaK0ju63.js";
import { g as getInventory, u as updateInventory } from "./inventory-MksNkqWX.js";
import { u as useStore } from "./index-DpiVUCS0.js";
import { a as formatDate, b as availableCount } from "./util-D5Y4JTPp.js";
import "react-dom";
import "zustand";
import "zustand/middleware";
const LOW_STOCK_RATIO = 0.15;
function InventoryPage() {
  const inventory = useStore((s) => s.inventory);
  const [loaded, setLoaded] = useState(false);
  const [adjusting, setAdjusting] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([getInventory(), getEvents()]).then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  const totals = useStore(selectInventoryTotals);
  const reservations = useStore(selectReservationsByItemName);
  const isLow = (item) => availableCount(item) < Math.round(item.total * LOW_STOCK_RATIO);
  const saveAdjust = async (patch) => {
    if (!adjusting) return;
    await updateInventory(adjusting.id, patch);
    setAdjusting(null);
  };
  if (!loaded) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { title: "Inventory", eyebrow: "Dashboard", subtitle: "Live stock positions — reserved, out on hire, damaged and missing." }),
      /* @__PURE__ */ jsx(LoadingState, { label: "Loading inventory…" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Inventory", eyebrow: "Dashboard", subtitle: "Live stock positions — reserved, out on hire, damaged and missing — with low-stock warnings." }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Total units", value: totals.total, hint: "Across all items" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Reserved", value: totals.reserved, tone: "info", hint: "Held for upcoming bookings" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Available", value: totals.available, tone: "gold", hint: "Ready to hire" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Out on hire", value: totals.outOnHire, tone: "warning", hint: "Physically with clients" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Damaged", value: totals.damaged, tone: "warning", hint: "Needs repair" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Missing", value: totals.missing, tone: "danger", hint: "Unaccounted" })
    ] }),
    /* @__PURE__ */ jsx(Table, { columns: [{
      key: "name",
      header: "Item",
      render: (i) => /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink-900", children: i.name })
    }, {
      key: "category",
      header: "Category",
      render: (i) => /* @__PURE__ */ jsx("span", { className: "capitalize text-ink-600", children: i.category })
    }, {
      key: "total",
      header: "Total",
      align: "center",
      render: (i) => i.total
    }, {
      key: "reserved",
      header: "Reserved",
      align: "center",
      render: (i) => {
        const holders = reservations.get(i.name);
        return /* @__PURE__ */ jsxs("span", { className: "relative inline-block", children: [
          i.reserved,
          holders && holders.length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 cursor-help text-xs text-ink-400", title: holders.map((h) => `${h.bookingName} · ${h.quantity} (${formatDate(h.eventDate)})`).join("\n"), "aria-label": `Reserved for ${holders.map((h) => h.bookingName).join(", ")}`, children: "ⓘ" })
        ] });
      }
    }, {
      key: "available",
      header: "Available",
      align: "center",
      render: (i) => /* @__PURE__ */ jsx("span", { className: availableCount(i) <= (i.reorderLevel ?? 0) ? "font-semibold text-amber-700" : "font-semibold text-ink-900", children: availableCount(i) })
    }, {
      key: "outOnHire",
      header: "Out on Hire",
      align: "center",
      render: (i) => i.outOnHire
    }, {
      key: "damaged",
      header: "Damaged",
      align: "center",
      render: (i) => i.damaged
    }, {
      key: "missing",
      header: "Missing",
      align: "center",
      render: (i) => i.missing
    }, {
      key: "status",
      header: "Status",
      align: "center",
      render: (i) => {
        if (isLow(i)) {
          return /* @__PURE__ */ jsx(Badge, { tone: "danger", children: "Low stock" });
        }
        if (availableCount(i) === 0) return /* @__PURE__ */ jsx(Badge, { tone: "warning", children: "Out of stock" });
        return /* @__PURE__ */ jsx(Badge, { tone: "success", children: "OK" });
      }
    }, {
      key: "adjust",
      header: "Adjust",
      align: "right",
      render: (i) => /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => setAdjusting(i), children: "Adjust" })
    }], rows: [...inventory].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)), keyOf: (i) => i.id, emptyMessage: "No inventory items." }),
    /* @__PURE__ */ jsxs("p", { className: "mt-3 text-xs text-ink-400", children: [
      "Available = total − reserved − out on hire − damaged − missing. The Low stock badge triggers below ",
      Math.round(LOW_STOCK_RATIO * 100),
      "% of total available."
    ] }),
    /* @__PURE__ */ jsx(Modal, { open: adjusting !== null, onClose: () => setAdjusting(null), title: adjusting ? `Adjust ${adjusting.name}` : "", children: adjusting && /* @__PURE__ */ jsx(AdjustForm, { item: adjusting, onSave: saveAdjust }, adjusting.id) })
  ] });
}
function AdjustForm({
  item,
  onSave
}) {
  const [damaged, setDamaged] = useState(item.damaged);
  const [missing, setMissing] = useState(item.missing);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "Damaged", htmlFor: "inv-damaged", children: /* @__PURE__ */ jsx(Input, { id: "inv-damaged", type: "number", min: 0, value: damaged, onChange: (e) => setDamaged(Math.max(0, Number(e.target.value) || 0)) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Missing", htmlFor: "inv-missing", children: /* @__PURE__ */ jsx(Input, { id: "inv-missing", type: "number", min: 0, value: missing, onChange: (e) => setMissing(Math.max(0, Number(e.target.value) || 0)) }) })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-500", children: [
      "Current position: ",
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        item.total,
        " total"
      ] }),
      ",",
      " ",
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        availableCount(item),
        " available"
      ] }),
      " (updating damaged / missing changes availability automatically)."
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => onSave({
      damaged,
      missing
    }), children: "Save changes" }) })
  ] });
}
export {
  InventoryPage as component
};
