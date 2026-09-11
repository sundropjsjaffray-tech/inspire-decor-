import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
function EmptyState({ title, description, action, className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 bg-champagne-100/50 px-6 py-16 text-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-lg text-gold-600", children: "◆" }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-semibold text-ink-900", children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm text-ink-500", children: description }),
        action
      ]
    }
  );
}
export {
  EmptyState as E
};
