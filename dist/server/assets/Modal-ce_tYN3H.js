import { jsx, jsxs } from "react/jsx-runtime";
import { c as cn } from "./util-D5Y4JTPp.js";
import { useEffect } from "react";
import { createPortal } from "react-dom";
const variantClasses = {
  primary: "bg-gold-500 text-ink-950 hover:bg-gold-400 focus-visible:outline-gold-500 shadow-sm",
  secondary: "border border-ink-300 bg-white text-ink-800 hover:border-gold-500 hover:text-gold-700 focus-visible:outline-gold-500",
  ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-ink-400",
  danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600"
};
const sizeClasses$1 = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
};
const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";
function buttonClasses(variant = "primary", size = "md") {
  return cn(baseClasses, variantClasses[variant], sizeClasses$1[size]);
}
function Button({ variant = "primary", size = "md", className, children, ...props }) {
  return /* @__PURE__ */ jsx("button", { className: cn(buttonClasses(variant, size), className), ...props, children });
}
const sizeClasses = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": "Close modal",
          className: "absolute inset-0 cursor-default bg-ink-950/60 backdrop-blur-sm",
          onClick: onClose
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "relative w-full rounded-xl bg-white shadow-xl",
            sizeClasses[size],
            "max-h-[85dvh] overflow-y-auto"
          ),
          children: [
            title && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-ink-200 px-5 py-4", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-semibold text-ink-900", children: title }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700",
                  "aria-label": "Close",
                  children: "✕"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-4", children }),
            footer && /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-3 border-t border-ink-200 px-5 py-4", children: footer })
          ]
        }
      )
    ] }),
    document.body
  );
}
export {
  Button as B,
  Modal as M,
  buttonClasses as b
};
