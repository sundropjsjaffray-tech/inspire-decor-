import { jsx, jsxs } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
function Table({
  columns,
  rows,
  keyOf,
  emptyMessage = "No records to show.",
  onSort,
  sortKey,
  sortDir,
  className
}) {
  const alignClass = { left: "text-left", right: "text-right", center: "text-center" };
  return /* @__PURE__ */ jsx("div", { className: cn("overflow-x-auto rounded-xl border border-ink-200 bg-white", className), children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-max text-sm", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-ink-200 bg-ink-50 text-left", children: columns.map((col) => {
      const sortable = Boolean(col.sortable && onSort);
      const active = sortable && sortKey === col.key;
      return /* @__PURE__ */ jsx(
        "th",
        {
          className: cn(
            "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-500",
            alignClass[col.align ?? "left"],
            sortable && "cursor-pointer select-none hover:text-ink-800"
          ),
          onClick: sortable ? () => onSort?.(col.key) : void 0,
          children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            col.header,
            sortable && /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: active ? sortDir === "asc" ? "▲" : "▼" : "↕" })
          ] })
        },
        col.key
      );
    }) }) }),
    /* @__PURE__ */ jsx("tbody", { children: rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "px-4 py-10 text-center text-ink-400", children: emptyMessage }) }) : rows.map((row) => /* @__PURE__ */ jsx("tr", { className: "border-b border-ink-100 last:border-0 hover:bg-champagne-100/50", children: columns.map((col) => /* @__PURE__ */ jsx("td", { className: cn("px-4 py-3 text-ink-700", alignClass[col.align ?? "left"]), children: col.render ? col.render(row) : String(row[col.key] ?? "") }, col.key)) }, keyOf(row))) })
  ] }) });
}
export {
  Table as T
};
