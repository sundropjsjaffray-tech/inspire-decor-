/**
 * Notifications service — the mail seam.
 *
 * These functions are intentionally STUBS: instead of sending email they
 * record an in-app notification in the store, so the demo shows the full
 * workflow without a mail provider.
 *
 * ⚠️ RESEND NOTE: when real email is added, these become server-side functions
 * (createServerFn handlers or an /api route) that call Resend with the
 * recipient address — NEVER call Resend from the frontend, it would leak the
 * API key. The signatures below are the contract to keep.
 */
import { useStore } from "~/lib/store";
import { delay, todayISO, uid } from "~/lib/util";
import type { Booking, Lead, Notification, NotificationType, Quote } from "~/lib/types";

function recordNotification(type: NotificationType, title: string, message: string): void {
  const notification: Notification = {
    id: uid("N"),
    type,
    title,
    message,
    read: false,
    createdAt: todayISO(),
    isDemo: false,
  };
  useStore.getState().addNotification(notification);
}

export async function sendNewLeadNotification(lead: Lead): Promise<void> {
  await delay(250);
  recordNotification(
    "lead",
    "New lead received",
    `${lead.customer.name} — ${lead.eventType}, ${lead.guests} guests (${lead.budgetRange})`
  );
}

/** Contact-form message (name, email, message) → in-app notification. */
export async function sendContactMessageNotification(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await delay(250);
  recordNotification(
    "lead",
    "New contact message",
    `${input.name} (${input.email}) — ${input.message.slice(0, 120)}`
  );
}

export async function sendQuoteEmail(quote: Quote, to: string): Promise<void> {
  await delay(250);
  recordNotification("quote", "Quote email sent", `Quote ${quote.id} (${quote.total} ZAR) sent to ${to}`);
}

export async function sendBookingConfirmation(booking: Booking, to: string): Promise<void> {
  await delay(250);
  recordNotification(
    "booking",
    "Booking confirmation sent",
    `${booking.eventName} (${booking.eventDate}) confirmed with ${to}`
  );
}

export async function sendFollowUpEmail(lead: Lead): Promise<void> {
  await delay(250);
  recordNotification(
    "follow-up",
    "Follow-up email sent",
    `Follow-up sent to ${lead.customer.name} — ${lead.eventType}, ${lead.guests} guests`
  );
}
