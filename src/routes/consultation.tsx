import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
  buttonClasses,
} from "~/components/ui";
import { createLead } from "~/lib/services/leads";
import { sendNewLeadNotification } from "~/lib/services/notifications";
import { quoteEventTypeOptions } from "~/lib/data/forms";
import { todayISO, uid } from "~/lib/util";
import type { Lead } from "~/lib/types";

export const Route = createFileRoute("/consultation")({ component: ConsultationPage });

interface FormState {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  preferredDate: string;
  preferredTime: string;
  venue: string;
  guests: string;
  notes: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  preferredDate: "",
  preferredTime: "",
  venue: "",
  guests: "",
  notes: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function ConsultationPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Enter a valid phone number.";
    if (!form.eventType) next.eventType = "Choose an event type.";
    if (form.preferredDate && form.preferredDate < todayISO())
      next.preferredDate = "The date must be today or in the future.";
    const guests = Number(form.guests);
    if (form.guests && (!Number.isInteger(guests) || guests < 1)) next.guests = "Guests must be at least 1.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
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
          location: "Gauteng",
          createdAt: todayISO(),
        },
        eventType: "consultation",
        eventDate: form.preferredDate || todayISO(),
        guests: form.guests ? Number(form.guests) : 1,
        budgetRange: "not-sure",
        notes: [
          `Consultation request — planning for: ${eventLabel}`,
          form.preferredDate ? `Preferred date: ${form.preferredDate}` : null,
          form.preferredTime ? `Preferred time: ${form.preferredTime}` : null,
          form.venue ? `Venue: ${form.venue}` : null,
          form.notes ? `Notes: ${form.notes}` : null,
        ]
          .filter((line): line is string => Boolean(line))
          .join("\n"),
      });
      await sendNewLeadNotification(lead);
      setSubmittedLead(lead);
      setForm(EMPTY);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Free Consultation"
          eyebrow="Book a call"
          subtitle="Not sure where to start? Book a free 30-minute planning session with our events team — in person or on a call. We'll help you shape your event, suggest a budget and recommend what to hire."
        />

        {submittedLead ? (
          <Card className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-xl text-gold-600">
              ✓
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
              Consultation request received
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Thank you — we'll be in touch shortly to schedule your free consultation. Your reference
              is <span className="font-semibold text-ink-800">{submittedLead.id}</span>.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/" className={buttonClasses("primary")}>
                Back to Home
              </Link>
              <Link to="/services" className={buttonClasses("secondary")}>
                Browse Services
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" htmlFor="c-name">
                <Input
                  id="c-name"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "c-name-error" : undefined}
                  autoComplete="name"
                  placeholder="Thandeka Mokoena"
                />
                {errors.name && (
                  <p id="c-name-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.name}
                  </p>
                )}
              </Field>
              <Field label="Email address *" htmlFor="c-email">
                <Input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "c-email-error" : undefined}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p id="c-email-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </Field>
              <Field label="Phone / WhatsApp *" htmlFor="c-phone">
                <Input
                  id="c-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "c-phone-error" : undefined}
                  autoComplete="tel"
                  placeholder="+27 82 555 0100"
                />
                {errors.phone && (
                  <p id="c-phone-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.phone}
                  </p>
                )}
              </Field>
              <Field label="Event type *" htmlFor="c-event-type">
                <Select
                  id="c-event-type"
                  value={form.eventType}
                  onChange={(e) => set("eventType")(e.target.value)}
                  aria-invalid={Boolean(errors.eventType)}
                  aria-describedby={errors.eventType ? "c-event-type-error" : undefined}
                >
                  <option value="">Select an event type…</option>
                  {quoteEventTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                {errors.eventType && (
                  <p id="c-event-type-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.eventType}
                  </p>
                )}
              </Field>
              <Field label="Preferred date (optional)" htmlFor="c-date">
                <Input
                  id="c-date"
                  type="date"
                  min={todayISO()}
                  value={form.preferredDate}
                  onChange={(e) => set("preferredDate")(e.target.value)}
                  aria-invalid={Boolean(errors.preferredDate)}
                  aria-describedby={errors.preferredDate ? "c-date-error" : undefined}
                />
                {errors.preferredDate && (
                  <p id="c-date-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.preferredDate}
                  </p>
                )}
              </Field>
              <Field label="Preferred time (optional)" htmlFor="c-time">
                <Input
                  id="c-time"
                  type="time"
                  value={form.preferredTime}
                  onChange={(e) => set("preferredTime")(e.target.value)}
                />
              </Field>
              <Field label="Venue (optional)" htmlFor="c-venue">
                <Input
                  id="c-venue"
                  value={form.venue}
                  onChange={(e) => set("venue")(e.target.value)}
                  placeholder="e.g. The Ridge, Muldersdrift"
                />
              </Field>
              <Field label="Approx. guests (optional)" htmlFor="c-guests" hint="Leave blank if undecided.">
                <Input
                  id="c-guests"
                  type="number"
                  min={1}
                  value={form.guests}
                  onChange={(e) => set("guests")(e.target.value)}
                  aria-invalid={Boolean(errors.guests)}
                  aria-describedby={errors.guests ? "c-guests-error" : undefined}
                  placeholder="e.g. 80"
                />
                {errors.guests && (
                  <p id="c-guests-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.guests}
                  </p>
                )}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Anything you'd like to talk through? (optional)" htmlFor="c-notes">
                  <Textarea
                    id="c-notes"
                    value={form.notes}
                    onChange={(e) => set("notes")(e.target.value)}
                    placeholder="Your ideas, questions, or the event you're dreaming of…"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : "Request My Consultation"}
                </Button>
                <p className="mt-2 text-center text-xs text-ink-400">
                  Demonstration form — requests create a demo lead in the admin dashboard.
                </p>
              </div>
            </form>
          </Card>
        )}
      </div>
    </CustomerLayout>
  );
}
