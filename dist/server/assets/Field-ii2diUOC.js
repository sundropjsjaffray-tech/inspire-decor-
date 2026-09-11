import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
const fieldBase = "w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200 disabled:cursor-not-allowed disabled:bg-ink-100";
function Input({ className, ...props }) {
  return /* @__PURE__ */ jsx("input", { className: cn(fieldBase, className), ...props });
}
function Select({ className, children, ...props }) {
  return /* @__PURE__ */ jsx("select", { className: cn(fieldBase, "pr-8", className), ...props, children });
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx("textarea", { className: cn(fieldBase, "min-h-24", className), ...props });
}
function Field({ label, htmlFor, hint, children }) {
  return /* @__PURE__ */ jsxs("label", { htmlFor, className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-sm font-medium text-ink-700", children: label }),
    children,
    hint && /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-ink-400", children: hint })
  ] });
}
export {
  Field as F,
  Input as I,
  Select as S,
  Textarea as T
};
