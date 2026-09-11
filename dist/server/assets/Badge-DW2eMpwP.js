import { jsx } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
const toneClasses = {
  gold: "border-gold-300 bg-gold-100 text-gold-700",
  neutral: "border-ink-200 bg-ink-100 text-ink-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-sky-200 bg-sky-50 text-sky-700"
};
function Badge({ tone = "neutral", className, children, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className
      ),
      ...props,
      children
    }
  );
}
export {
  Badge as B
};
