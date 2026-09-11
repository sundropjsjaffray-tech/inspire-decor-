import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
function SectionHeading({ eyebrow, title, description, align = "left", className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn(align === "center" && "text-center", className), children: [
    eyebrow && /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600", children: eyebrow }),
    /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl font-semibold text-ink-950 sm:text-3xl", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: cn("mt-2 max-w-2xl text-sm text-ink-500 sm:text-base", align === "center" && "mx-auto"), children: description })
  ] });
}
export {
  SectionHeading as S
};
