import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { C as CustomerLayout } from "./CustomerLayout-Dmbsnk0W.js";
import { b as buttonClasses, B as Button } from "./Modal-ce_tYN3H.js";
import { C as Card } from "./Card-Zmhmk8cF.js";
import { F as Field, I as Input, S as Select, T as Textarea } from "./Field-ii2diUOC.js";
import { P as PageHeader } from "./PageHeader-BPmJ3BUE.js";
import { c as createLead } from "./leads-D6YQVvDy.js";
import { s as sendNewLeadNotification } from "./notifications-DDqnCVsC.js";
import { q as quoteEventTypeOptions } from "./forms-BpwFRfCh.js";
import { t as todayISO, u as uid } from "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./EmptyState-BDGSXIRT.js";
import "./PriceTag-XtvFw5qZ.js";
import "./index-CtB_iAzP.js";
import "zustand";
import "zustand/middleware";
import "./products-BbopjXnd.js";
import "react-dom";
const EMPTY = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  preferredDate: "",
  preferredTime: "",
  venue: "",
  guests: "",
  notes: ""
};
function ConsultationPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
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
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Enter a valid phone number.";
    if (!form.eventType) next.eventType = "Choose an event type.";
    if (form.preferredDate && form.preferredDate < todayISO()) next.preferredDate = "The date must be today or in the future.";
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
      const eventLabel = quoteEventTypeOptions.find((o) => o.value === form.eventType)?.label ?? form.eventType;
      const lead = await createLead({
        customer: {
          id: uid("C"),
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          location: "Port Elizabeth, Eastern Cape",
          createdAt: todayISO()
        },
        eventType: "consultation",
        eventDate: form.preferredDate || todayISO(),
        guests: form.guests ? Number(form.guests) : 1,
        budgetRange: "not-sure",
        notes: [`Consultation request — planning for: ${eventLabel}`, form.preferredDate ? `Preferred date: ${form.preferredDate}` : null, form.preferredTime ? `Preferred time: ${form.preferredTime}` : null, form.venue ? `Venue: ${form.venue}` : null, form.notes ? `Notes: ${form.notes}` : null].filter((line) => Boolean(line)).join("\n")
      });
      await sendNewLeadNotification(lead);
      setSubmittedLead(lead);
      setForm(EMPTY);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(CustomerLayout, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Free Consultation", eyebrow: "Book a call", subtitle: "Not sure where to start? Book a free 30-minute planning session with our events team — in person or on a call. We'll help you shape your event, suggest a budget and recommend what to hire." }),
    submittedLead ? /* @__PURE__ */ jsxs(Card, { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-xl text-gold-600", children: "✓" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-xl font-semibold text-ink-900", children: "Consultation request received" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-ink-500", children: [
        "Thank you — we'll be in touch shortly to schedule your free consultation. Your reference is ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink-800", children: submittedLead.id }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: buttonClasses("primary"), children: "Back to Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/services", className: buttonClasses("secondary"), children: "Browse Services" })
      ] })
    ] }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Field, { label: "Full name *", htmlFor: "c-name", children: [
        /* @__PURE__ */ jsx(Input, { id: "c-name", value: form.name, onChange: (e) => set("name")(e.target.value), "aria-invalid": Boolean(errors.name), "aria-describedby": errors.name ? "c-name-error" : void 0, autoComplete: "name", placeholder: "Thandeka Mokoena" }),
        errors.name && /* @__PURE__ */ jsx("p", { id: "c-name-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs(Field, { label: "Email address *", htmlFor: "c-email", children: [
        /* @__PURE__ */ jsx(Input, { id: "c-email", type: "email", value: form.email, onChange: (e) => set("email")(e.target.value), "aria-invalid": Boolean(errors.email), "aria-describedby": errors.email ? "c-email-error" : void 0, autoComplete: "email", placeholder: "you@example.com" }),
        errors.email && /* @__PURE__ */ jsx("p", { id: "c-email-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.email })
      ] }),
      /* @__PURE__ */ jsxs(Field, { label: "Phone / WhatsApp *", htmlFor: "c-phone", children: [
        /* @__PURE__ */ jsx(Input, { id: "c-phone", type: "tel", value: form.phone, onChange: (e) => set("phone")(e.target.value), "aria-invalid": Boolean(errors.phone), "aria-describedby": errors.phone ? "c-phone-error" : void 0, autoComplete: "tel", placeholder: "+27 82 555 0100" }),
        errors.phone && /* @__PURE__ */ jsx("p", { id: "c-phone-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.phone })
      ] }),
      /* @__PURE__ */ jsxs(Field, { label: "Event type *", htmlFor: "c-event-type", children: [
        /* @__PURE__ */ jsxs(Select, { id: "c-event-type", value: form.eventType, onChange: (e) => set("eventType")(e.target.value), "aria-invalid": Boolean(errors.eventType), "aria-describedby": errors.eventType ? "c-event-type-error" : void 0, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select an event type…" }),
          quoteEventTypeOptions.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
        ] }),
        errors.eventType && /* @__PURE__ */ jsx("p", { id: "c-event-type-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.eventType })
      ] }),
      /* @__PURE__ */ jsxs(Field, { label: "Preferred date (optional)", htmlFor: "c-date", children: [
        /* @__PURE__ */ jsx(Input, { id: "c-date", type: "date", min: todayISO(), value: form.preferredDate, onChange: (e) => set("preferredDate")(e.target.value), "aria-invalid": Boolean(errors.preferredDate), "aria-describedby": errors.preferredDate ? "c-date-error" : void 0 }),
        errors.preferredDate && /* @__PURE__ */ jsx("p", { id: "c-date-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.preferredDate })
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Preferred time (optional)", htmlFor: "c-time", children: /* @__PURE__ */ jsx(Input, { id: "c-time", type: "time", value: form.preferredTime, onChange: (e) => set("preferredTime")(e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Venue (optional)", htmlFor: "c-venue", children: /* @__PURE__ */ jsx(Input, { id: "c-venue", value: form.venue, onChange: (e) => set("venue")(e.target.value), placeholder: "e.g. The Ridge, Muldersdrift" }) }),
      /* @__PURE__ */ jsxs(Field, { label: "Approx. guests (optional)", htmlFor: "c-guests", hint: "Leave blank if undecided.", children: [
        /* @__PURE__ */ jsx(Input, { id: "c-guests", type: "number", min: 1, value: form.guests, onChange: (e) => set("guests")(e.target.value), "aria-invalid": Boolean(errors.guests), "aria-describedby": errors.guests ? "c-guests-error" : void 0, placeholder: "e.g. 80" }),
        errors.guests && /* @__PURE__ */ jsx("p", { id: "c-guests-error", role: "alert", className: "mt-1 text-xs text-red-600", children: errors.guests })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Anything you'd like to talk through? (optional)", htmlFor: "c-notes", children: /* @__PURE__ */ jsx(Textarea, { id: "c-notes", value: form.notes, onChange: (e) => set("notes")(e.target.value), placeholder: "Your ideas, questions, or the event you're dreaming of…" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", className: "w-full", disabled: submitting, children: submitting ? "Sending…" : "Request My Consultation" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-xs text-ink-400", children: "Demonstration form — requests create a demo lead in the admin dashboard." })
      ] })
    ] }) })
  ] }) });
}
export {
  ConsultationPage as component
};
