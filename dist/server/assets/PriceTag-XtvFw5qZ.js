import { jsx, jsxs } from "react/jsx-runtime";
import { c as cn, f as formatZAR } from "./util-D5Y4JTPp.js";
function PriceTag({ amount, className, prefix, custom = false }) {
  if (custom) {
    return /* @__PURE__ */ jsx("span", { className: cn("font-semibold text-ink-600", className), children: "Custom Quote" });
  }
  return /* @__PURE__ */ jsxs("span", { className: cn("font-semibold text-ink-900", className), children: [
    prefix && /* @__PURE__ */ jsx("span", { className: "mr-1 text-xs font-medium text-ink-400", children: prefix }),
    /* @__PURE__ */ jsx("span", { className: "text-gold-700", children: formatZAR(amount) })
  ] });
}
export {
  PriceTag as P
};
