import { jsxs, jsx } from "react/jsx-runtime";
function PageHeader({ title, subtitle, eyebrow, actions }) {
  return /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
    eyebrow && /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600", children: eyebrow }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-semibold text-ink-950 sm:text-4xl", children: title }),
        subtitle && /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm text-ink-500 sm:text-base", children: subtitle })
      ] }),
      actions && /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-3", children: actions })
    ] })
  ] });
}
export {
  PageHeader as P
};
