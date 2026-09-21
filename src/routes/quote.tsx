import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import {
  Button,
  Card,
  CheckboxField,
  Field,
  Img,
  Input,
  PriceTag,
  RadioGroup,
  Select,
  Textarea,
  buttonClasses,
} from "~/components/ui";
import { getProducts } from "~/lib/services/products";
import { createLead } from "~/lib/services/leads";
import { sendNewLeadNotification } from "~/lib/services/notifications";
import { clearEnquiryList, removeFromEnquiryList } from "~/lib/services/enquiry";
import { useStore } from "~/lib/store";
import { categoryToServiceOptions } from "~/lib/data/site";
import {
  quoteBudgetOptions,
  quoteEventTypeOptions,
  quoteServiceOptions,
  venueTypeOptions,
} from "~/lib/data/forms";
import { formatZAR, todayISO, uid } from "~/lib/util";
import type { BudgetRange, Lead, Product, ServiceOption } from "~/lib/types";

export const Route = createFileRoute("/quote")({ component: QuotePage });

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guests: string;
  venueType: string;
  location: string;
  services: ServiceOption[];
  budget: BudgetRange | "";
  colourScheme: string;
  theme: string;
  requirements: string;
  inspirationFile: string;
  consent: boolean;
}

const EMPTY: FormState = {
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
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function QuotePage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  const enquiryList = useStore((s) => s.enquiryList);
  const [products, setProducts] = useState<Product[] | null>(null);
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

  // Pre-tick services that match items in the enquiry list (once).
  useEffect(() => {
    if (!products || preTicked.current || enquiryList.length === 0) return;
    preTicked.current = true;
    const byId = new Map(products.map((p) => [p.id, p]));
    const matched = new Set<ServiceOption>();
    enquiryList.forEach((line) => {
      const product = byId.get(line.productId);
      if (!product) return;
      categoryToServiceOptions[product.category]?.forEach((s) => matched.add(s));
    });
    if (matched.size > 0) setForm((f) => ({ ...f, services: Array.from(matched) }));
  }, [products, enquiryList]);

  const byId = useMemo(() => new Map((products ?? []).map((p) => [p.id, p])), [products]);
  const enquiryLines = enquiryList
    .map((line) => {
      const product = byId.get(line.productId);
      if (!product) return null;
      return { product, quantity: line.quantity, lineTotal: product.hirePrice === null ? null : product.hirePrice * line.quantity };
    })
    .filter((l): l is { product: Product; quantity: number; lineTotal: number } => l !== null);
  const enquiryTotal = enquiryLines.reduce((sum, l) => sum + l.lineTotal, 0);

  const set = (key: keyof FormState) => (value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleService = (value: ServiceOption) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(value)
        ? f.services.filter((s) => s !== value)
        : [...f.services, value],
    }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Enter a valid phone number.";
    if (!form.eventType) next.eventType = "Choose an event type.";
    if (!form.eventDate) next.eventDate = "Pick a date for your event.";
    else if (form.eventDate < todayISO()) next.eventDate = "The date must be today or in the future.";
    const guests = Number(form.guests);
    if (!form.guests || !Number.isInteger(guests) || guests < 1)
      next.guests = "Enter the number of guests (at least 1).";
    else if (guests > 10000) next.guests = "That's a big event — please contact us directly.";
    if (!form.consent) next.consent = "Please agree to be contacted about your enquiry.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setSubmitError("Please fix the highlighted fields below.");
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const buildNotes = (): string => {
    const parts: string[] = [];
    if (form.venue) parts.push(`Venue: ${form.venue}`);
    if (form.venueType) {
      const label = venueTypeOptions.find((o) => o.value === form.venueType)?.label ?? form.venueType;
      parts.push(`Indoor/outdoor: ${label}`);
    }
    if (form.location) parts.push(`Event location: ${form.location}`);
    if (form.services.length > 0) {
      const labels = quoteServiceOptions
        .filter((o) => form.services.includes(o.value))
        .map((o) => o.label);
      parts.push(`Services required: ${labels.join(", ")}`);
    }
    if (form.colourScheme) parts.push(`Colour scheme: ${form.colourScheme}`);
    if (form.theme) parts.push(`Theme: ${form.theme}`);
    if (form.inspirationFile) parts.push(`Inspiration image: ${form.inspirationFile} (file name only — uploads coming soon)`);
    if (form.requirements) parts.push(`Additional requirements: ${form.requirements}`);
    if (enquiryLines.length > 0) {
      parts.push(
        `Hire items from enquiry list: ${enquiryLines
          .map((l) => `${l.product.name} × ${l.quantity}`)
          .join(", ")} (est. ${formatZAR(enquiryTotal)})`
      );
    }
    return parts.join("\n");
  };

  const handleSubmit = async (e: FormEvent) => {
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
          company: form.company.trim() || undefined,
          location: form.location.trim() || "Port Elizabeth, Eastern Cape",
          createdAt: todayISO(),
        },
        eventType: form.eventType as Lead["eventType"],
        eventDate: form.eventDate,
        guests: Number(form.guests),
        budgetRange: form.budget || "not-sure",
        notes: buildNotes(),
        venue: form.venue.trim() || undefined,
        indoorOutdoor: form.venueType
          ? venueTypeOptions.find((o) => o.value === form.venueType)?.label
          : undefined,
        location: form.location.trim() || undefined,
        services: form.services,
        colourScheme: form.colourScheme.trim() || undefined,
        theme: form.theme.trim() || undefined,
        requirements: form.requirements.trim() || undefined,
        inspirationFile: form.inspirationFile.trim() || undefined,
        enquiryLines: enquiryList,
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

  /* ---------- Success screen ---------- */
  if (submittedLead) {
    return (
      <CustomerLayout>
        <div className="mx-auto max-w-xl py-10">
          <Card className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-2xl text-gold-600">
              ✓
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
              Thank you. Your event enquiry has been received.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
              Our team will review your requirements and contact you — usually within one working day.
            </p>
            <p className="mt-5 inline-block rounded-lg bg-champagne-100 px-4 py-2 text-sm text-ink-700">
              Your reference: <span className="font-semibold text-ink-900">{submittedLead.id}</span>
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/" className={buttonClasses("primary")}>
                Back to Home
              </Link>
              <Link to="/hire" className={buttonClasses("secondary")}>
                Browse Hire Catalogue
              </Link>
            </div>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
            Plan My Event
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">Request a Quote</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-500 sm:text-base">
            Tell us about your event and we'll build a tailored quote within one working day. Fields
            marked * are required.
          </p>
        </header>

        {submitError && (
          <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* ---------- Enquiry list summary ---------- */}
        {enquiryLines.length > 0 && (
          <Card className="mb-8 border-gold-300 bg-champagne-100/60">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Items in your enquiry list
              </h2>
              <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-bold text-ink-950">
                {enquiryLines.length}
              </span>
            </div>
            <ul className="divide-y divide-ink-200/70">
              {enquiryLines.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex items-center gap-3 py-2.5">
                  <Img
                    src={product.image}
                    alt={product.name}
                    fallbackLabel={product.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {product.name} <span className="text-ink-400">× {quantity}</span>
                    </p>
                    <p className="text-xs text-ink-400">
                      {formatZAR(product.hirePrice)} · {product.unit}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-ink-900">{formatZAR(lineTotal)}</span>
                  <button
                    type="button"
                    onClick={() => removeFromEnquiryList(product.id)}
                    className="text-xs text-ink-400 underline-offset-2 hover:text-red-600 hover:underline"
                    aria-label={`Remove ${product.name} from enquiry list`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-ink-200/70 pt-3">
              <span className="text-sm font-medium text-ink-600">Estimated hire total</span>
              <PriceTag amount={enquiryTotal} />
            </div>
            <p className="mt-2 text-xs text-ink-400">
              Matching services below are pre-ticked based on your selection. You can adjust them.
            </p>
          </Card>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* ---------- 1. Customer information ---------- */}
          <section aria-labelledby="sec-customer" className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="sec-customer" className="mb-4 font-display text-lg font-semibold text-ink-900">
              1 · Your details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" htmlFor="q-name">
                <Input
                  id="q-name"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "q-name-error" : undefined}
                  autoComplete="name"
                  placeholder="Thandeka Mokoena"
                />
                {errors.name && (
                  <p id="q-name-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.name}
                  </p>
                )}
              </Field>
              <Field label="Email address *" htmlFor="q-email">
                <Input
                  id="q-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "q-email-error" : undefined}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p id="q-email-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </Field>
              <Field label="Phone / WhatsApp *" htmlFor="q-phone">
                <Input
                  id="q-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "q-phone-error" : undefined}
                  autoComplete="tel"
                  placeholder="+27 82 555 0100"
                />
                {errors.phone && (
                  <p id="q-phone-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.phone}
                  </p>
                )}
              </Field>
              <Field label="Company (optional)" htmlFor="q-company">
                <Input
                  id="q-company"
                  value={form.company}
                  onChange={(e) => set("company")(e.target.value)}
                  placeholder="e.g. Vertex Holdings"
                />
              </Field>
            </div>
          </section>

          {/* ---------- 2. Event information ---------- */}
          <section aria-labelledby="sec-event" className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="sec-event" className="mb-4 font-display text-lg font-semibold text-ink-900">
              2 · About your event
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event type *" htmlFor="q-event-type">
                <Select
                  id="q-event-type"
                  value={form.eventType}
                  onChange={(e) => set("eventType")(e.target.value)}
                  aria-invalid={Boolean(errors.eventType)}
                  aria-describedby={errors.eventType ? "q-event-type-error" : undefined}
                >
                  <option value="">Select an event type…</option>
                  {quoteEventTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                {errors.eventType && (
                  <p id="q-event-type-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.eventType}
                  </p>
                )}
              </Field>
              <Field label="Event date *" htmlFor="q-event-date">
                <Input
                  id="q-event-date"
                  type="date"
                  min={todayISO()}
                  value={form.eventDate}
                  onChange={(e) => set("eventDate")(e.target.value)}
                  aria-invalid={Boolean(errors.eventDate)}
                  aria-describedby={errors.eventDate ? "q-event-date-error" : undefined}
                />
                {errors.eventDate && (
                  <p id="q-event-date-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.eventDate}
                  </p>
                )}
              </Field>
              <Field label="Venue (optional)" htmlFor="q-venue">
                <Input
                  id="q-venue"
                  value={form.venue}
                  onChange={(e) => set("venue")(e.target.value)}
                  placeholder="e.g. Silver Lakes Country Club"
                />
              </Field>
              <Field label="Number of guests *" htmlFor="q-guests">
                <Input
                  id="q-guests"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={form.guests}
                  onChange={(e) => set("guests")(e.target.value)}
                  aria-invalid={Boolean(errors.guests)}
                  aria-describedby={errors.guests ? "q-guests-error" : undefined}
                  placeholder="e.g. 120"
                />
                {errors.guests && (
                  <p id="q-guests-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.guests}
                  </p>
                )}
              </Field>
              <Field label="Indoor / outdoor" htmlFor="q-venue-type">
                <Select
                  id="q-venue-type"
                  value={form.venueType}
                  onChange={(e) => set("venueType")(e.target.value)}
                >
                  <option value="">Select…</option>
                  {venueTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Event location (optional)" htmlFor="q-location">
                <Input
                  id="q-location"
                  value={form.location}
                  onChange={(e) => set("location")(e.target.value)}
                  placeholder="e.g. Port Elizabeth, Eastern Cape"
                />
              </Field>
            </div>
          </section>

          {/* ---------- 3. Services required ---------- */}
          <section aria-labelledby="sec-services" className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="sec-services" className="mb-1 font-display text-lg font-semibold text-ink-900">
              3 · Services required
            </h2>
            <p className="mb-4 text-xs text-ink-400">Tick everything you think you'll need.</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {quoteServiceOptions.map((o) => (
                <CheckboxField
                  key={o.value}
                  label={o.label}
                  checked={form.services.includes(o.value)}
                  onChange={() => toggleService(o.value)}
                />
              ))}
            </div>
          </section>

          {/* ---------- 4. Budget ---------- */}
          <section aria-labelledby="sec-budget" className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="sec-budget" className="mb-4 font-display text-lg font-semibold text-ink-900">
              4 · Budget range
            </h2>
            <RadioGroup
              name="q-budget"
              options={quoteBudgetOptions.map((o) => ({ value: o.value, label: o.label }))}
              value={form.budget}
              onChange={(value) => set("budget")(value as BudgetRange)}
            />
          </section>

          {/* ---------- 5. Style ---------- */}
          <section aria-labelledby="sec-style" className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="sec-style" className="mb-4 font-display text-lg font-semibold text-ink-900">
              5 · Style & inspiration
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Colour scheme (optional)" htmlFor="q-colour">
                <Input
                  id="q-colour"
                  value={form.colourScheme}
                  onChange={(e) => set("colourScheme")(e.target.value)}
                  placeholder="e.g. White, gold and blush"
                />
              </Field>
              <Field label="Theme (optional)" htmlFor="q-theme">
                <Input
                  id="q-theme"
                  value={form.theme}
                  onChange={(e) => set("theme")(e.target.value)}
                  placeholder="e.g. Elegant garden, old Hollywood"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Additional requirements (optional)" htmlFor="q-requirements">
                  <Textarea
                    id="q-requirements"
                    value={form.requirements}
                    onChange={(e) => set("requirements")(e.target.value)}
                    placeholder="Anything else we should know — special requests, timelines, access notes…"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Inspiration image (optional)"
                  htmlFor="q-upload"
                  hint="Feature coming soon — for now we only note the file name on your enquiry. No upload happens in this prototype."
                >
                  <Input
                    id="q-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => set("inspirationFile")(e.target.files?.[0]?.name ?? "")}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* ---------- 6. Consent + submit ---------- */}
          <section aria-labelledby="sec-submit" className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
            <CheckboxField
              label="I agree to be contacted about my enquiry *"
              description="INSPIRE DECOR will use your details to respond to this quote request only — no spam, ever."
              checked={form.consent}
              onChange={(e) => set("consent")(e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "q-consent-error" : undefined}
            />
            {errors.consent && (
              <p id="q-consent-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.consent}
              </p>
            )}
            <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
              {submitting ? "Sending your enquiry…" : "Request My Quote"}
            </Button>
            <p className="mt-3 text-center text-xs text-ink-400">
              Demonstration form — your enquiry creates a demo lead in the admin dashboard.
            </p>
          </section>
        </form>
      </div>
    </CustomerLayout>
  );
}
