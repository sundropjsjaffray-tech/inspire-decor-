import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import {
  Button,
  Card,
  Field,
  Input,
  LoadingState,
  PageHeader,
  Textarea,
  buttonClasses,
} from "~/components/ui";
import { getContactDetails } from "~/lib/services/content";
import { sendContactMessageNotification } from "~/lib/services/notifications";
import type { ContactDetails } from "~/lib/data/site";

export const Route = createFileRoute("/contact")({ component: ContactPage });

interface FormState {
  name: string;
  email: string;
  message: string;
}

const EMPTY: FormState = { name: "", email: "", message: "" };
type Errors = Partial<Record<keyof FormState, string>>;

function ContactPage() {
  const [details, setDetails] = useState<ContactDetails | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
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

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.message.trim()) next.message = "Please write a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await sendContactMessageNotification({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSent(true);
      setForm(EMPTY);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <PageHeader
        title="Contact Us"
        eyebrow="Say hello"
        subtitle="Call, WhatsApp or email us — we reply fast, the way a small business should. All contact details are demonstration placeholders."
      />

      {!details ? (
        <LoadingState label="Loading contact details…" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* ---------- Contact details ---------- */}
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Get in touch</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Phone</p>
                  <a href={`tel:${details.phone.replace(/\s/g, "")}`} className="font-medium text-ink-800 hover:text-gold-700">
                    {details.phone}
                  </a>
                </li>
                <li>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">WhatsApp</p>
                  <a
                    href={`https://wa.me/${details.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-ink-800 hover:text-gold-700"
                  >
                    {details.whatsapp} →
                  </a>
                  <p className="mt-0.5 text-xs text-ink-400">Demo link — no real WhatsApp account.</p>
                </li>
                <li>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Email</p>
                  <a href={`mailto:${details.email}`} className="font-medium text-ink-800 hover:text-gold-700">
                    {details.email}
                  </a>
                </li>
                <li>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Based in</p>
                  <p className="font-medium text-ink-800">{details.area}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{details.serviceRegion}</p>
                </li>
              </ul>
            </Card>

            <Card>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Opening hours</h2>
              <ul className="space-y-2 text-sm">
                {details.hours.map((h) => (
                  <li key={h.days} className="flex items-baseline justify-between gap-3 border-b border-ink-100 pb-2 last:border-0">
                    <span className="text-ink-600">{h.days}</span>
                    <span className="text-sm font-medium text-ink-900">{h.time}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Map placeholder */}
            <div
              role="img"
              aria-label="Service area map placeholder — Port Elizabeth, Eastern Cape"
              className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gold-300 bg-gradient-to-br from-champagne-200 via-champagne-100 to-gold-200 p-6 text-center"
            >
              <span aria-hidden="true" className="text-2xl text-gold-600">📍</span>
              <p className="mt-2 font-display text-lg font-semibold text-ink-900">Port Elizabeth, Eastern Cape</p>
              <p className="mt-1 text-xs text-ink-500">
                Map coming soon — we currently deliver across Port Elizabeth, Eastern Cape.
              </p>
            </div>
          </div>

          {/* ---------- Contact form ---------- */}
          <div className="lg:col-span-3">
            <Card>
              {sent ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-xl text-gold-600">
                    ✓
                  </div>
                  <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
                    Message received
                  </h2>
                  <p className="mt-2 text-sm text-ink-500">
                    Thank you — we've logged your message and will get back to you soon.
                  </p>
                  <div className="mt-5 flex justify-center gap-3">
                    <Link to="/" className={buttonClasses("primary")}>
                      Back to Home
                    </Link>
                    <Link to="/quote" className={buttonClasses("secondary")}>
                      Plan My Event
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="mb-1 font-display text-lg font-semibold text-ink-900">
                    Send us a message
                  </h2>
                  <p className="mb-4 text-xs text-ink-400">
                    For detailed event planning, the{" "}
                    <Link to="/quote" className="font-medium text-gold-700 underline-offset-2 hover:underline">
                      Plan My Event form
                    </Link>{" "}
                    is faster — this form is for general questions.
                  </p>
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <Field label="Full name *" htmlFor="ct-name">
                      <Input
                        id="ct-name"
                        value={form.name}
                        onChange={(e) => set("name")(e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "ct-name-error" : undefined}
                        autoComplete="name"
                        placeholder="Thandeka Mokoena"
                      />
                      {errors.name && (
                        <p id="ct-name-error" role="alert" className="mt-1 text-xs text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </Field>
                    <Field label="Email address *" htmlFor="ct-email">
                      <Input
                        id="ct-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email")(e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "ct-email-error" : undefined}
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p id="ct-email-error" role="alert" className="mt-1 text-xs text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </Field>
                    <Field label="Message *" htmlFor="ct-message">
                      <Textarea
                        id="ct-message"
                        value={form.message}
                        onChange={(e) => set("message")(e.target.value)}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "ct-message-error" : undefined}
                        placeholder="How can we help?"
                      />
                      {errors.message && (
                        <p id="ct-message-error" role="alert" className="mt-1 text-xs text-red-600">
                          {errors.message}
                        </p>
                      )}
                    </Field>
                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                      {submitting ? "Sending…" : "Send Message"}
                    </Button>
                    <p className="text-center text-xs text-ink-400">
                      Demonstration form — messages appear as notifications in the admin dashboard.
                    </p>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
