import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { C as CustomerLayout, I as Img } from "./CustomerLayout-B_3xXtEn.js";
import { b as buttonClasses, B as Button } from "./Modal-ce_tYN3H.js";
import { C as Card } from "./Card-Zmhmk8cF.js";
import { F as Field, I as Input, S as Select, T as Textarea } from "./Field-ii2diUOC.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { S as SectionHeading } from "./SectionHeading-BSrzX34P.js";
import { b as getCorporateEventTypes, c as getCorporateBenefits } from "./content-DhpWJKdC.js";
import { c as createLead } from "./leads-Bdv5qxMt.js";
import { s as sendNewLeadNotification } from "./notifications-HxuQMcwM.js";
import { u as unsplash } from "./products-BpU3TxX9.js";
import { t as todayISO, u as uid } from "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./EmptyState-BDGSXIRT.js";
import "./PriceTag-XtvFw5qZ.js";
import "./index-DpiVUCS0.js";
import "zustand";
import "zustand/middleware";
import "react-dom";
import "./site-c9x3VlSs.js";
const HERO_IMAGE = unsplash("1511795409834-ef04bbd61622", 1600);
const EMPTY = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  guests: "",
  message: ""
};
function CorporatePage() {
  const [eventTypes, setEventTypes] = useState(null);
  const [benefits, setBenefits] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([getCorporateEventTypes(), getCorporateBenefits()]).then(([types, benefitsList]) => {
      if (!alive) return;
      setEventTypes(types);
      setBenefits(benefitsList);
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
    if (!form.company.trim()) next.company = "Company name is required.";
    if (!form.contactName.trim()) next.contactName = "Your name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Enter a valid phone number.";
    if (!form.eventType) next.eventType = "Choose an event type.";
    const guests = Number(form.guests);
    if (form.guests && (!Number.isInteger(guests) || guests < 1)) next.guests = "Guests must be at least 1.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const lead = await createLead({
        customer: {
          id: uid("C"),
          name: form.contactName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          location: "Gauteng",
          createdAt: todayISO()
        },
        eventType: "corporate",
        eventDate: form.date || todayISO(),
        guests: form.guests ? Number(form.guests) : 1,
        budgetRange: "not-sure",
        notes: `Corporate catalogue request — event type: ${form.eventType}${form.date ? `, date: ${form.date}` : ""}. ${form.message.trim()}`
      });
      await sendNewLeadNotification(lead);
      setSubmittedLead(lead);
      setForm(EMPTY);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
    /* @__PURE__ */ jsx("section", { "aria-label": "Corporate events introduction", className: "-mx-4 -mt-10 flex min-h-[52dvh] items-center bg-ink-950 bg-cover bg-center", style: {
      backgroundImage: `linear-gradient(rgba(16,18,22,0.66), rgba(16,18,22,0.8)), url(${HERO_IMAGE})`
    }, children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl px-6 py-14", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold-300", children: "Corporate events" }),
      /* @__PURE__ */ jsx("h1", { className: "max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl", children: "Corporate events, delivered with polish" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-sm leading-relaxed text-champagne-100/85 sm:text-base", children: "From 20-guest boardroom functions to 2,000-guest galas — décor, hire equipment and full setup from a single supplier, planned around your brand and delivered on a schedule you can plan around." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx("a", { href: "#catalogue-request", className: buttonClasses("primary", "lg"), children: "Request Corporate Event Catalogue" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: buttonClasses("secondary", "lg") + " border-white/40 bg-white/10 text-white hover:border-gold-300 hover:text-gold-200", children: "Speak to Us About Your Event" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "corporate-events-list", className: "py-14", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "What we deliver", title: "Every corporate occasion, styled", description: "Pick the type of event — we'll handle the décor, hire equipment, setup and styling end to end.", className: "mb-8" }),
      !eventTypes ? /* @__PURE__ */ jsx(LoadingState, { label: "Loading corporate events…" }) : /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: eventTypes.map((type) => /* @__PURE__ */ jsxs(Card, { padded: false, className: "group overflow-hidden", children: [
        /* @__PURE__ */ jsx(Img, { src: type.image, alt: type.name, fallbackLabel: type.name, className: "aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold text-ink-900", children: type.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-ink-500", children: type.description })
        ] })
      ] }, type.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "corporate-benefits", className: "py-10", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Why companies choose us", title: "A partner, not just a supplier", align: "center", className: "mb-8" }),
      !benefits ? /* @__PURE__ */ jsx(LoadingState, { label: "Loading benefits…" }) : /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: benefits.map((b) => /* @__PURE__ */ jsxs(Card, { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm text-gold-600", children: "◆" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold text-ink-900", children: b.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-ink-500", children: b.description })
        ] })
      ] }, b.id)) })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "catalogue-request", "aria-labelledby": "catalogue-form", className: "py-14", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Corporate catalogue", title: "Request our Corporate Event Catalogue", description: "Tell us who you are and what you're planning — we'll email you our corporate brochure with décor ranges, hire rates and case studies.", align: "center", className: "mb-8" }),
      submittedLead ? /* @__PURE__ */ jsxs(Card, { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-xl text-gold-600", children: "✓" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display text-xl font-semibold text-ink-900", children: "Request received" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-ink-500", children: [
          "Thank you — your corporate catalogue request has been logged (reference",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink-800", children: submittedLead.id }),
          "). Our corporate team will email the catalogue and follow up with you."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-center gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("primary"), children: "Plan Another Event" }),
          /* @__PURE__ */ jsx(Link, { to: "/", className: buttonClasses("secondary"), children: "Back to Home" })
        ] })
      ] }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs(Field, { label: "Company name", htmlFor: "corp-company", children: [
          /* @__PURE__ */ jsx(Input, { id: "corp-company", value: form.company, onChange: (e) => set("company")(e.target.value), "aria-invalid": Boolean(errors.company), "aria-describedby": errors.company ? "corp-company-error" : void 0, placeholder: "Vertex Holdings" }),
          errors.company && /* @__PURE__ */ jsx("p", { id: "corp-company-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.company })
        ] }),
        /* @__PURE__ */ jsxs(Field, { label: "Your name", htmlFor: "corp-name", children: [
          /* @__PURE__ */ jsx(Input, { id: "corp-name", value: form.contactName, onChange: (e) => set("contactName")(e.target.value), "aria-invalid": Boolean(errors.contactName), "aria-describedby": errors.contactName ? "corp-name-error" : void 0, placeholder: "Lindiwe Nkosi" }),
          errors.contactName && /* @__PURE__ */ jsx("p", { id: "corp-name-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.contactName })
        ] }),
        /* @__PURE__ */ jsxs(Field, { label: "Work email", htmlFor: "corp-email", children: [
          /* @__PURE__ */ jsx(Input, { id: "corp-email", type: "email", value: form.email, onChange: (e) => set("email")(e.target.value), "aria-invalid": Boolean(errors.email), "aria-describedby": errors.email ? "corp-email-error" : void 0, placeholder: "you@company.co.za" }),
          errors.email && /* @__PURE__ */ jsx("p", { id: "corp-email-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxs(Field, { label: "Phone", htmlFor: "corp-phone", children: [
          /* @__PURE__ */ jsx(Input, { id: "corp-phone", type: "tel", value: form.phone, onChange: (e) => set("phone")(e.target.value), "aria-invalid": Boolean(errors.phone), "aria-describedby": errors.phone ? "corp-phone-error" : void 0, placeholder: "+27 82 555 0100" }),
          errors.phone && /* @__PURE__ */ jsx("p", { id: "corp-phone-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.phone })
        ] }),
        /* @__PURE__ */ jsxs(Field, { label: "Event type", htmlFor: "corp-type", children: [
          /* @__PURE__ */ jsxs(Select, { id: "corp-type", value: form.eventType, onChange: (e) => set("eventType")(e.target.value), "aria-invalid": Boolean(errors.eventType), "aria-describedby": errors.eventType ? "corp-type-error" : void 0, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select an event type…" }),
            eventTypes?.map((t) => /* @__PURE__ */ jsx("option", { value: t.name, children: t.name }, t.id))
          ] }),
          errors.eventType && /* @__PURE__ */ jsx("p", { id: "corp-type-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.eventType })
        ] }),
        /* @__PURE__ */ jsx(Field, { label: "Approx. date (optional)", htmlFor: "corp-date", children: /* @__PURE__ */ jsx(Input, { id: "corp-date", type: "date", min: todayISO(), value: form.date, onChange: (e) => set("date")(e.target.value) }) }),
        /* @__PURE__ */ jsxs(Field, { label: "Approx. guests (optional)", htmlFor: "corp-guests", hint: "Leave blank if undecided.", children: [
          /* @__PURE__ */ jsx(Input, { id: "corp-guests", type: "number", min: 1, value: form.guests, onChange: (e) => set("guests")(e.target.value), "aria-invalid": Boolean(errors.guests), "aria-describedby": errors.guests ? "corp-guests-error" : void 0, placeholder: "e.g. 150" }),
          errors.guests && /* @__PURE__ */ jsx("p", { id: "corp-guests-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.guests })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Anything we should know? (optional)", htmlFor: "corp-message", children: /* @__PURE__ */ jsx(Textarea, { id: "corp-message", value: form.message, onChange: (e) => set("message")(e.target.value), placeholder: "Venue, theme, what you're imagining…" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", className: "w-full", disabled: submitting, children: submitting ? "Sending…" : "Request Corporate Catalogue" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-xs text-ink-400", children: "Demonstration form — submissions create a demo lead visible in the admin dashboard." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-500", children: [
        "Prefer to talk it through?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "font-medium text-gold-700 underline-offset-4 hover:underline", children: "Speak to us about your event" }),
        " ",
        "or",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/consultation", className: "font-medium text-gold-700 underline-offset-4 hover:underline", children: "book a free consultation" }),
        "."
      ] }) })
    ] }) })
  ] });
}
export {
  CorporatePage as component
};
