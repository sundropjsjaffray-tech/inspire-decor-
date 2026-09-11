import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { C as CustomerLayout, I as Img, r as removeFromEnquiryList, c as clearEnquiryList } from "./CustomerLayout-B_3xXtEn.js";
import { b as buttonClasses, B as Button } from "./Modal-ce_tYN3H.js";
import { C as Card } from "./Card-Zmhmk8cF.js";
import { F as Field, I as Input, S as Select, T as Textarea } from "./Field-ii2diUOC.js";
import { c as cn, f as formatZAR, t as todayISO, u as uid } from "./util-D5Y4JTPp.js";
import { P as PriceTag } from "./PriceTag-XtvFw5qZ.js";
import { g as getProducts } from "./products-BpU3TxX9.js";
import { c as createLead } from "./leads-Bdv5qxMt.js";
import { s as sendNewLeadNotification } from "./notifications-HxuQMcwM.js";
import { u as useStore } from "./index-DpiVUCS0.js";
import { c as categoryToServiceOptions } from "./site-c9x3VlSs.js";
import { q as quoteEventTypeOptions, v as venueTypeOptions, a as quoteServiceOptions, b as quoteBudgetOptions } from "./forms-BpwFRfCh.js";
import "./demo-vg2AtRWs.js";
import "./EmptyState-BDGSXIRT.js";
import "react-dom";
import "zustand";
import "zustand/middleware";
function Checkbox({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type: "checkbox",
      className: cn("h-4 w-4 rounded border-ink-300 accent-gold-500", className),
      ...props
    }
  );
}
function CheckboxField({
  label,
  description,
  ...props
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-start gap-3", children: [
    /* @__PURE__ */ jsx(Checkbox, { className: "mt-0.5", ...props }),
    /* @__PURE__ */ jsxs("span", { children: [
      /* @__PURE__ */ jsx("span", { className: "block text-sm font-medium text-ink-800", children: label }),
      description && /* @__PURE__ */ jsx("span", { className: "block text-xs text-ink-500", children: description })
    ] })
  ] });
}
function RadioGroup({ name, options, value, onChange, className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("space-y-2", className), role: "radiogroup", children: options.map((option) => /* @__PURE__ */ jsxs(
    "label",
    {
      className: cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        value === option.value ? "border-gold-500 bg-gold-50" : "border-ink-200 bg-white hover:border-ink-300"
      ),
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name,
            value: option.value,
            checked: value === option.value,
            onChange: () => onChange(option.value),
            className: "mt-0.5 h-4 w-4 accent-gold-500"
          }
        ),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-sm font-medium text-ink-800", children: option.label }),
          option.description && /* @__PURE__ */ jsx("span", { className: "block text-xs text-ink-500", children: option.description })
        ] })
      ]
    },
    option.value
  )) });
}
const EMPTY = {
  name: "",
  email: "",
  phone: "",
  company: "",
  eventType: "",
  eventDate: "",
  venue: "",
  guests: "",
  venueType: "",
  location: "",
  services: [],
  budget: "",
  colourScheme: "",
  theme: "",
  requirements: "",
  inspirationFile: "",
  consent: false
};
function QuotePage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedLead, setSubmittedLead] = useState(null);
  const enquiryList = useStore((s) => s.enquiryList);
  const [products, setProducts] = useState(null);
  const preTicked = useRef(false);
  useEffect(() => {
    let alive = true;
    getProducts().then((list) => {
      if (alive) setProducts(list);
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!products || preTicked.current || enquiryList.length === 0) return;
    preTicked.current = true;
    const byId2 = new Map(products.map((p) => [p.id, p]));
    const matched = /* @__PURE__ */ new Set();
    enquiryList.forEach((line) => {
      const product = byId2.get(line.productId);
      if (!product) return;
      categoryToServiceOptions[product.category]?.forEach((s) => matched.add(s));
    });
    if (matched.size > 0) setForm((f) => ({
      ...f,
      services: Array.from(matched)
    }));
  }, [products, enquiryList]);
  const byId = useMemo(() => new Map((products ?? []).map((p) => [p.id, p])), [products]);
  const enquiryLines = enquiryList.map((line) => {
    const product = byId.get(line.productId);
    if (!product) return null;
    return {
      product,
      quantity: line.quantity,
      lineTotal: product.hirePrice * line.quantity
    };
  }).filter((l) => l !== null);
  const enquiryTotal = enquiryLines.reduce((sum, l) => sum + l.lineTotal, 0);
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
  const toggleService = (value) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(value) ? f.services.filter((s) => s !== value) : [...f.services, value]
    }));
  };
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Enter a valid phone number.";
    if (!form.eventType) next.eventType = "Choose an event type.";
    if (!form.eventDate) next.eventDate = "Pick a date for your event.";
    else if (form.eventDate < todayISO()) next.eventDate = "The date must be today or in the future.";
    const guests = Number(form.guests);
    if (!form.guests || !Number.isInteger(guests) || guests < 1) next.guests = "Enter the number of guests (at least 1).";
    else if (guests > 1e4) next.guests = "That's a big event — please contact us directly.";
    if (!form.consent) next.consent = "Please agree to be contacted about your enquiry.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setSubmitError("Please fix the highlighted fields below.");
      return false;
    }
    setSubmitError(null);
    return true;
  };
  const buildNotes = () => {
    const parts = [];
    if (form.venue) parts.push(`Venue: ${form.venue}`);
    if (form.venueType) {
      const label = venueTypeOptions.find((o) => o.value === form.venueType)?.label ?? form.venueType;
      parts.push(`Indoor/outdoor: ${label}`);
    }
    if (form.location) parts.push(`Event location: ${form.location}`);
    if (form.services.length > 0) {
      const labels = quoteServiceOptions.filter((o) => form.services.includes(o.value)).map((o) => o.label);
      parts.push(`Services required: ${labels.join(", ")}`);
    }
    if (form.colourScheme) parts.push(`Colour scheme: ${form.colourScheme}`);
    if (form.theme) parts.push(`Theme: ${form.theme}`);
    if (form.inspirationFile) parts.push(`Inspiration image: ${form.inspirationFile} (file name only — uploads coming soon)`);
    if (form.requirements) parts.push(`Additional requirements: ${form.requirements}`);
    if (enquiryLines.length > 0) {
      parts.push(`Hire items from enquiry list: ${enquiryLines.map((l) => `${l.product.name} × ${l.quantity}`).join(", ")} (est. ${formatZAR(enquiryTotal)})`);
    }
    return parts.join("\n");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const lead = await createLead({
        customer: {
          id: uid("C"),
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim() || void 0,
          location: form.location.trim() || "Gauteng",
          createdAt: todayISO()
        },
        eventType: form.eventType,
        eventDate: form.eventDate,
        guests: Number(form.guests),
        budgetRange: form.budget || "not-sure",
        notes: buildNotes(),
        venue: form.venue.trim() || void 0,
        indoorOutdoor: form.venueType ? venueTypeOptions.find((o) => o.value === form.venueType)?.label : void 0,
        location: form.location.trim() || void 0,
        services: form.services,
        colourScheme: form.colourScheme.trim() || void 0,
        theme: form.theme.trim() || void 0,
        requirements: form.requirements.trim() || void 0,
        inspirationFile: form.inspirationFile.trim() || void 0,
        enquiryLines: enquiryList
      });
      await sendNewLeadNotification(lead);
      await clearEnquiryList();
      setSubmittedLead(lead);
    } catch {
      setSubmitError("Something went wrong sending your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (submittedLead) {
    return /* @__PURE__ */ jsx(CustomerLayout, { children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-xl py-10", children: /* @__PURE__ */ jsxs(Card, { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-2xl text-gold-600", children: "✓" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-5 font-display text-2xl font-semibold text-ink-950 sm:text-3xl", children: "Thank you. Your event enquiry has been received." }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-ink-500 sm:text-base", children: "Our team will review your requirements and contact you — usually within one working day." }),
      /* @__PURE__ */ jsxs("p", { className: "mt-5 inline-block rounded-lg bg-champagne-100 px-4 py-2 text-sm text-ink-700", children: [
        "Your reference: ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink-900", children: submittedLead.id })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-col justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: buttonClasses("primary"), children: "Back to Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/hire", className: buttonClasses("secondary"), children: "Browse Hire Catalogue" })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(CustomerLayout, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600", children: "Plan My Event" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-semibold text-ink-950 sm:text-4xl", children: "Request a Quote" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm text-ink-500 sm:text-base", children: "Tell us about your event and we'll build a tailored quote within one working day. Fields marked * are required." })
    ] }),
    submitError && /* @__PURE__ */ jsx("div", { role: "alert", className: "mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: submitError }),
    enquiryLines.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "mb-8 border-gold-300 bg-champagne-100/60", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-semibold text-ink-900", children: "Items in your enquiry list" }),
        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-bold text-ink-950", children: enquiryLines.length })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "divide-y divide-ink-200/70", children: enquiryLines.map(({
        product,
        quantity,
        lineTotal
      }) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 py-2.5", children: [
        /* @__PURE__ */ jsx(Img, { src: product.image, alt: product.name, fallbackLabel: product.name, className: "h-10 w-10 shrink-0 rounded-lg object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("p", { className: "truncate text-sm font-medium text-ink-900", children: [
            product.name,
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-ink-400", children: [
              "× ",
              quantity
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-400", children: [
            formatZAR(product.hirePrice),
            " · ",
            product.unit
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-ink-900", children: formatZAR(lineTotal) }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeFromEnquiryList(product.id), className: "text-xs text-ink-400 underline-offset-2 hover:text-red-600 hover:underline", "aria-label": `Remove ${product.name} from enquiry list`, children: "Remove" })
      ] }, product.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between border-t border-ink-200/70 pt-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink-600", children: "Estimated hire total" }),
        /* @__PURE__ */ jsx(PriceTag, { amount: enquiryTotal })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-ink-400", children: "Matching services below are pre-ticked based on your selection. You can adjust them." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "sec-customer", className: "rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsx("h2", { id: "sec-customer", className: "mb-4 font-display text-lg font-semibold text-ink-900", children: "1 · Your details" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs(Field, { label: "Full name *", htmlFor: "q-name", children: [
            /* @__PURE__ */ jsx(Input, { id: "q-name", value: form.name, onChange: (e) => set("name")(e.target.value), "aria-invalid": Boolean(errors.name), "aria-describedby": errors.name ? "q-name-error" : void 0, autoComplete: "name", placeholder: "Thandeka Mokoena" }),
            errors.name && /* @__PURE__ */ jsx("p", { id: "q-name-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Email address *", htmlFor: "q-email", children: [
            /* @__PURE__ */ jsx(Input, { id: "q-email", type: "email", value: form.email, onChange: (e) => set("email")(e.target.value), "aria-invalid": Boolean(errors.email), "aria-describedby": errors.email ? "q-email-error" : void 0, autoComplete: "email", placeholder: "you@example.com" }),
            errors.email && /* @__PURE__ */ jsx("p", { id: "q-email-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Phone / WhatsApp *", htmlFor: "q-phone", children: [
            /* @__PURE__ */ jsx(Input, { id: "q-phone", type: "tel", value: form.phone, onChange: (e) => set("phone")(e.target.value), "aria-invalid": Boolean(errors.phone), "aria-describedby": errors.phone ? "q-phone-error" : void 0, autoComplete: "tel", placeholder: "+27 82 555 0100" }),
            errors.phone && /* @__PURE__ */ jsx("p", { id: "q-phone-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.phone })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Company (optional)", htmlFor: "q-company", children: /* @__PURE__ */ jsx(Input, { id: "q-company", value: form.company, onChange: (e) => set("company")(e.target.value), placeholder: "e.g. Vertex Holdings" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "sec-event", className: "rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsx("h2", { id: "sec-event", className: "mb-4 font-display text-lg font-semibold text-ink-900", children: "2 · About your event" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs(Field, { label: "Event type *", htmlFor: "q-event-type", children: [
            /* @__PURE__ */ jsxs(Select, { id: "q-event-type", value: form.eventType, onChange: (e) => set("eventType")(e.target.value), "aria-invalid": Boolean(errors.eventType), "aria-describedby": errors.eventType ? "q-event-type-error" : void 0, children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select an event type…" }),
              quoteEventTypeOptions.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
            ] }),
            errors.eventType && /* @__PURE__ */ jsx("p", { id: "q-event-type-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.eventType })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Event date *", htmlFor: "q-event-date", children: [
            /* @__PURE__ */ jsx(Input, { id: "q-event-date", type: "date", min: todayISO(), value: form.eventDate, onChange: (e) => set("eventDate")(e.target.value), "aria-invalid": Boolean(errors.eventDate), "aria-describedby": errors.eventDate ? "q-event-date-error" : void 0 }),
            errors.eventDate && /* @__PURE__ */ jsx("p", { id: "q-event-date-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.eventDate })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Venue (optional)", htmlFor: "q-venue", children: /* @__PURE__ */ jsx(Input, { id: "q-venue", value: form.venue, onChange: (e) => set("venue")(e.target.value), placeholder: "e.g. Silver Lakes Country Club" }) }),
          /* @__PURE__ */ jsxs(Field, { label: "Number of guests *", htmlFor: "q-guests", children: [
            /* @__PURE__ */ jsx(Input, { id: "q-guests", type: "number", min: 1, inputMode: "numeric", value: form.guests, onChange: (e) => set("guests")(e.target.value), "aria-invalid": Boolean(errors.guests), "aria-describedby": errors.guests ? "q-guests-error" : void 0, placeholder: "e.g. 120" }),
            errors.guests && /* @__PURE__ */ jsx("p", { id: "q-guests-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.guests })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Indoor / outdoor", htmlFor: "q-venue-type", children: /* @__PURE__ */ jsxs(Select, { id: "q-venue-type", value: form.venueType, onChange: (e) => set("venueType")(e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select…" }),
            venueTypeOptions.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Event location (optional)", htmlFor: "q-location", children: /* @__PURE__ */ jsx(Input, { id: "q-location", value: form.location, onChange: (e) => set("location")(e.target.value), placeholder: "e.g. Pretoria East" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "sec-services", className: "rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsx("h2", { id: "sec-services", className: "mb-1 font-display text-lg font-semibold text-ink-900", children: "3 · Services required" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-xs text-ink-400", children: "Tick everything you think you'll need." }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-2.5 sm:grid-cols-2", children: quoteServiceOptions.map((o) => /* @__PURE__ */ jsx(CheckboxField, { label: o.label, checked: form.services.includes(o.value), onChange: () => toggleService(o.value) }, o.value)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "sec-budget", className: "rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsx("h2", { id: "sec-budget", className: "mb-4 font-display text-lg font-semibold text-ink-900", children: "4 · Budget range" }),
        /* @__PURE__ */ jsx(RadioGroup, { name: "q-budget", options: quoteBudgetOptions.map((o) => ({
          value: o.value,
          label: o.label
        })), value: form.budget, onChange: (value) => set("budget")(value) })
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "sec-style", className: "rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsx("h2", { id: "sec-style", className: "mb-4 font-display text-lg font-semibold text-ink-900", children: "5 · Style & inspiration" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx(Field, { label: "Colour scheme (optional)", htmlFor: "q-colour", children: /* @__PURE__ */ jsx(Input, { id: "q-colour", value: form.colourScheme, onChange: (e) => set("colourScheme")(e.target.value), placeholder: "e.g. White, gold and blush" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Theme (optional)", htmlFor: "q-theme", children: /* @__PURE__ */ jsx(Input, { id: "q-theme", value: form.theme, onChange: (e) => set("theme")(e.target.value), placeholder: "e.g. Elegant garden, old Hollywood" }) }),
          /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Additional requirements (optional)", htmlFor: "q-requirements", children: /* @__PURE__ */ jsx(Textarea, { id: "q-requirements", value: form.requirements, onChange: (e) => set("requirements")(e.target.value), placeholder: "Anything else we should know — special requests, timelines, access notes…" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Inspiration image (optional)", htmlFor: "q-upload", hint: "Feature coming soon — for now we only note the file name on your enquiry. No upload happens in this prototype.", children: /* @__PURE__ */ jsx(Input, { id: "q-upload", type: "file", accept: "image/*", onChange: (e) => set("inspirationFile")(e.target.files?.[0]?.name ?? "") }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "sec-submit", className: "rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsx(CheckboxField, { label: "I agree to be contacted about my enquiry *", description: "INSPIRE DECOR will use your details to respond to this quote request only — no spam, ever.", checked: form.consent, onChange: (e) => set("consent")(e.target.checked), "aria-invalid": Boolean(errors.consent), "aria-describedby": errors.consent ? "q-consent-error" : void 0 }),
        errors.consent && /* @__PURE__ */ jsx("p", { id: "q-consent-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.consent }),
        /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", className: "mt-5 w-full", disabled: submitting, children: submitting ? "Sending your enquiry…" : "Request My Quote" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-xs text-ink-400", children: "Demonstration form — your enquiry creates a demo lead in the admin dashboard." })
      ] })
    ] })
  ] }) });
}
export {
  QuotePage as component
};
