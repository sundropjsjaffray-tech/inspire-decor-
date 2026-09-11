import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
function LoadingState({ label = "Loading…", className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center justify-center gap-3 py-12 text-ink-500", className), children: [
    /* @__PURE__ */ jsx("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-gold-500" }),
    /* @__PURE__ */ jsx("span", { className: "text-sm", children: label })
  ] });
}
export {
  LoadingState as L
};
