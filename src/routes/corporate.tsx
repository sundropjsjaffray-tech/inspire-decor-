import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import {
  Button,
  Card,
  Field,
  Img,
  Input,
  LoadingState,
  SectionHeading,
  Select,
  Textarea,
  buttonClasses,
} from "~/components/ui";
import { getCorporateBenefits, getCorporateEventTypes } from "~/lib/services/content";
import { createLead } from "~/lib/services/leads";
import { sendNewLeadNotification } from "~/lib/services/notifications";
import { unsplash } from "~/lib/images";
import { todayISO, uid } from "~/lib/util";
import type { CorporateEventTypeInfo, Lead } from "~/lib/types";

export const Route = createFileRoute("/corporate")({ component: CorporatePage });

const HERO_IMAGE = unsplash("1511795409834-ef04bbd61622", 1600);

interface FormState {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guests: string;
  message: string;
}

const EMPTY: FormState = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  guests: "",
  message: "",
};

function CorporatePage() {
  const [eventTypes, setEventTypes] = useState<CorporateEventTypeInfo[] | null>(null);
  const [benefits, setBenefits] = useState<{ id: string; title: string; description: string; isDemo: boolean }[] | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

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

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
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

  const handleSubmit = async (e: FormEvent) => {
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
          location: "Port Elizabeth, Eastern Cape",
          createdAt: todayISO(),
        },
        eventType: "corporate",
        eventDate: form.date || todayISO(),
        guests: form.guests ? Number(form.guests) : 1,
        budgetRange: "not-sure",
        notes: `Corporate catalogue request — event type: ${form.eventType}${form.date ? `, date: ${form.date}` : ""}. ${form.message.trim()}`,
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
      {/* ---------- Hero ---------- */}
      <section
        aria-label="Corporate events introduction"
        className="-mx-4 -mt-10 flex min-h-[52dvh] items-center bg-ink-950 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(16,18,22,0.66), rgba(16,18,22,0.8)), url(${HERO_IMAGE})` }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">
            Corporate events
          </p>
          <h1 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Corporate events, delivered with polish
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-champagne-100/85 sm:text-base">
            From 20-guest boardroom functions to 2,000-guest galas — décor, hire equipment and full
            setup from a single supplier, planned around your brand and delivered on a schedule you
            can plan around.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#catalogue-request" className={buttonClasses("primary", "lg")}>
              Request Corporate Event Catalogue
            </a>
            <Link
              to="/contact"
              className={buttonClasses("secondary", "lg") + " border-white/40 bg-white/10 text-white hover:border-gold-300 hover:text-gold-200"}
            >
              Speak to Us About Your Event
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- What we deliver ---------- */}
      <section aria-labelledby="corporate-events-list" className="py-14">
        <SectionHeading
          eyebrow="What we deliver"
          title="Every corporate occasion, styled"
          description="Pick the type of event — we'll handle the décor, hire equipment, setup and styling end to end."
          className="mb-8"
        />
        {!eventTypes ? (
          <LoadingState label="Loading corporate events…" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {eventTypes.map((type) => (
              <Card key={type.id} padded={false} className="group overflow-hidden">
                <Img
                  src={type.image}
                  alt={type.name}
                  fallbackLabel={type.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-ink-900">{type.name}</h3>
                  <p className="mt-1 text-sm text-ink-500">{type.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Benefits ---------- */}
      <section aria-labelledby="corporate-benefits" className="py-10">
        <SectionHeading
          eyebrow="Why companies choose us"
          title="A partner, not just a supplier"
          align="center"
          className="mb-8"
        />
        {!benefits ? (
          <LoadingState label="Loading benefits…" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <Card key={b.id} className="flex gap-4">
                <span aria-hidden="true" className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm text-gold-600">
                  ◆
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-900">{b.title}</h3>
                  <p className="mt-1 text-sm text-ink-500">{b.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Catalogue request ---------- */}
      <section id="catalogue-request" aria-labelledby="catalogue-form" className="py-14">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Corporate catalogue"
            title="Request our Corporate Event Catalogue"
            description="Tell us who you are and what you're planning — we'll email you our corporate brochure with décor ranges, hire rates and case studies."
            align="center"
            className="mb-8"
          />
          {submittedLead ? (
            <Card className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-xl text-gold-600">
                ✓
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">Request received</h3>
              <p className="mt-2 text-sm text-ink-500">
                Thank you — your corporate catalogue request has been logged (reference{" "}
                <span className="font-semibold text-ink-800">{submittedLead.id}</span>). Our corporate
                team will email the catalogue and follow up with you.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Link to="/quote" className={buttonClasses("primary")}>
                  Plan Another Event
                </Link>
                <Link to="/" className={buttonClasses("secondary")}>
                  Back to Home
                </Link>
              </div>
            </Card>
          ) : (
            <Card>
              <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name" htmlFor="corp-company">
                  <Input
                    id="corp-company"
                    value={form.company}
                    onChange={(e) => set("company")(e.target.value)}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? "corp-company-error" : undefined}
                    placeholder="Vertex Holdings"
                  />
                  {errors.company && (
                    <p id="corp-company-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.company}
                    </p>
                  )}
                </Field>
                <Field label="Your name" htmlFor="corp-name">
                  <Input
                    id="corp-name"
                    value={form.contactName}
                    onChange={(e) => set("contactName")(e.target.value)}
                    aria-invalid={Boolean(errors.contactName)}
                    aria-describedby={errors.contactName ? "corp-name-error" : undefined}
                    placeholder="Lindiwe Nkosi"
                  />
                  {errors.contactName && (
                    <p id="corp-name-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.contactName}
                    </p>
                  )}
                </Field>
                <Field label="Work email" htmlFor="corp-email">
                  <Input
                    id="corp-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "corp-email-error" : undefined}
                    placeholder="you@company.co.za"
                  />
                  {errors.email && (
                    <p id="corp-email-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </Field>
                <Field label="Phone" htmlFor="corp-phone">
                  <Input
                    id="corp-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "corp-phone-error" : undefined}
                    placeholder="+27 82 555 0100"
                  />
                  {errors.phone && (
                    <p id="corp-phone-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </Field>
                <Field label="Event type" htmlFor="corp-type">
                  <Select
                    id="corp-type"
                    value={form.eventType}
                    onChange={(e) => set("eventType")(e.target.value)}
                    aria-invalid={Boolean(errors.eventType)}
                    aria-describedby={errors.eventType ? "corp-type-error" : undefined}
                  >
                    <option value="">Select an event type…</option>
                    {eventTypes?.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                  {errors.eventType && (
                    <p id="corp-type-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.eventType}
                    </p>
                  )}
                </Field>
                <Field label="Approx. date (optional)" htmlFor="corp-date">
                  <Input
                    id="corp-date"
                    type="date"
                    min={todayISO()}
                    value={form.date}
                    onChange={(e) => set("date")(e.target.value)}
                  />
                </Field>
                <Field label="Approx. guests (optional)" htmlFor="corp-guests" hint="Leave blank if undecided.">
                  <Input
                    id="corp-guests"
                    type="number"
                    min={1}
                    value={form.guests}
                    onChange={(e) => set("guests")(e.target.value)}
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby={errors.guests ? "corp-guests-error" : undefined}
                    placeholder="e.g. 150"
                  />
                  {errors.guests && (
                    <p id="corp-guests-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.guests}
                    </p>
                  )}
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Anything we should know? (optional)" htmlFor="corp-message">
                    <Textarea
                      id="corp-message"
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      placeholder="Venue, theme, what you're imagining…"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Sending…" : "Request Corporate Catalogue"}
                  </Button>
                  <p className="mt-2 text-center text-xs text-ink-400">
                    Demonstration form — submissions create a demo lead visible in the admin dashboard.
                  </p>
                </div>
              </form>
            </Card>
          )}
          <div className="mt-8 text-center">
            <p className="text-sm text-ink-500">
              Prefer to talk it through?{" "}
              <Link to="/contact" className="font-medium text-gold-700 underline-offset-4 hover:underline">
                Speak to us about your event
              </Link>{" "}
              or{" "}
              <Link to="/consultation" className="font-medium text-gold-700 underline-offset-4 hover:underline">
                book a free consultation
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
