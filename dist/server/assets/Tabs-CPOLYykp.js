import { jsx } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
function Tabs({ tabs, value, onChange, className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "inline-flex flex-wrap gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1",
        className
      ),
      role: "tablist",
      children: tabs.map((tab) => /* @__PURE__ */ jsx(
        "button",
        {
          role: "tab",
          "aria-selected": value === tab.id,
          onClick: () => onChange(tab.id),
          className: cn(
            "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === tab.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"
          ),
          children: tab.label
        },
        tab.id
      ))
    }
  );
}
export {
  Tabs as T
};
