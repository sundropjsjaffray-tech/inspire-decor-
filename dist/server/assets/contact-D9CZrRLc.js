import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { C as CustomerLayout } from "./CustomerLayout-B_3xXtEn.js";
import { b as buttonClasses, B as Button } from "./Modal-ce_tYN3H.js";
import { C as Card } from "./Card-Zmhmk8cF.js";
import { F as Field, I as Input, T as Textarea } from "./Field-ii2diUOC.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { d as getContactDetails } from "./content-DhpWJKdC.js";
import { a as sendContactMessageNotification } from "./notifications-HxuQMcwM.js";
import "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./EmptyState-BDGSXIRT.js";
import "./PriceTag-XtvFw5qZ.js";
import "./index-DpiVUCS0.js";
import "zustand";
import "zustand/middleware";
import "./products-BpU3TxX9.js";
import "react-dom";
import "./site-c9x3VlSs.js";
const EMPTY = {
  name: "",
  email: "",
  message: ""
};
function ContactPage() {
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    let alive = true;
    getContactDetails().then((d) => {
      if (alive) setDetails(d);
    });
    return () => {
      alive = false;
    };
  }, []);
  const set = (key) => (value) => {
    setForm((f) => ({
      ...f,
      [key]: value
    }));
    setErrors((e) => ({
      ...e,
      [key]: void 0
    }));
  };
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.message.trim()) next.message = "Please write a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await sendContactMessageNotification({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim()
      });
      setSent(true);
      setForm(EMPTY);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Contact Us", eyebrow: "Say hello", subtitle: "Call, WhatsApp or email us — we reply fast, the way a small business should. All contact details are demonstration placeholders." }),
    !details ? /* @__PURE__ */ jsx(LoadingState, { label: "Loading contact details…" }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 font-display text-lg font-semibold text-ink-900", children: "Get in touch" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-ink-400", children: "Phone" }),
              /* @__PURE__ */ jsx("a", { href: `tel:${details.phone.replace(/\s/g, "")}`, className: "font-medium text-ink-800 hover:text-gold-700", children: details.phone })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-ink-400", children: "WhatsApp" }),
              /* @__PURE__ */ jsxs("a", { href: `https://wa.me/${details.whatsapp.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "font-medium text-ink-800 hover:text-gold-700", children: [
                details.whatsapp,
                " →"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-ink-400", children: "Demo link — no real WhatsApp account." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-ink-400", children: "Email" }),
              /* @__PURE__ */ jsx("a", { href: `mailto:${details.email}`, className: "font-medium text-ink-800 hover:text-gold-700", children: details.email })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-ink-400", children: "Based in" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium text-ink-800", children: details.area }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-ink-400", children: details.serviceRegion })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 font-display text-lg font-semibold text-ink-900", children: "Opening hours" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm", children: details.hours.map((h) => /* @__PURE__ */ jsxs("li", { className: "flex items-baseline justify-between gap-3 border-b border-ink-100 pb-2 last:border-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink-600", children: h.days }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink-900", children: h.time })
          ] }, h.days)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { role: "img", "aria-label": "Service area map placeholder — Gauteng, South Africa", className: "flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gold-300 bg-gradient-to-br from-champagne-200 via-champagne-100 to-gold-200 p-6 text-center", children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl text-gold-600", children: "📍" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 font-display text-lg font-semibold text-ink-900", children: "Gauteng, South Africa" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-ink-500", children: "Map coming soon — we currently deliver across Johannesburg, Pretoria, Midrand, Centurion and the East Rand." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsx(Card, { children: sent ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-xl text-gold-600", children: "✓" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-xl font-semibold text-ink-900", children: "Message received" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-ink-500", children: "Thank you — we've logged your message and will get back to you soon." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-center gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", className: buttonClasses("primary"), children: "Back to Home" }),
          /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("secondary"), children: "Plan My Event" })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-1 font-display text-lg font-semibold text-ink-900", children: "Send us a message" }),
        /* @__PURE__ */ jsxs("p", { className: "mb-4 text-xs text-ink-400", children: [
          "For detailed event planning, the",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/quote", className: "font-medium text-gold-700 underline-offset-2 hover:underline", children: "Plan My Event form" }),
          " ",
          "is faster — this form is for general questions."
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(Field, { label: "Full name *", htmlFor: "ct-name", children: [
            /* @__PURE__ */ jsx(Input, { id: "ct-name", value: form.name, onChange: (e) => set("name")(e.target.value), "aria-invalid": Boolean(errors.name), "aria-describedby": errors.name ? "ct-name-error" : void 0, autoComplete: "name", placeholder: "Thandeka Mokoena" }),
            errors.name && /* @__PURE__ */ jsx("p", { id: "ct-name-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Email address *", htmlFor: "ct-email", children: [
            /* @__PURE__ */ jsx(Input, { id: "ct-email", type: "email", value: form.email, onChange: (e) => set("email")(e.target.value), "aria-invalid": Boolean(errors.email), "aria-describedby": errors.email ? "ct-email-error" : void 0, autoComplete: "email", placeholder: "you@example.com" }),
            errors.email && /* @__PURE__ */ jsx("p", { id: "ct-email-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Message *", htmlFor: "ct-message", children: [
            /* @__PURE__ */ jsx(Textarea, { id: "ct-message", value: form.message, onChange: (e) => set("message")(e.target.value), "aria-invalid": Boolean(errors.message), "aria-describedby": errors.message ? "ct-message-error" : void 0, placeholder: "How can we help?" }),
            errors.message && /* @__PURE__ */ jsx("p", { id: "ct-message-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.message })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", className: "w-full", disabled: submitting, children: submitting ? "Sending…" : "Send Message" }),
          /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-ink-400", children: "Demonstration form — messages appear as notifications in the admin dashboard." })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  ContactPage as component
};
