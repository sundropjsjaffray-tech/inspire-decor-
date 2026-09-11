import { jsx, jsxs } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
function Card({ children, className, padded = true, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("rounded-xl border border-ink-200 bg-white shadow-sm", padded && "p-5", className),
      ...props,
      children
    }
  );
}
function CardHeader({ title, subtitle, action, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("mb-4 flex items-start justify-between gap-4", className), children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-ink-900", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-ink-500", children: subtitle })
    ] }),
    action
  ] });
}
export {
  Card as C,
  CardHeader as a
};
