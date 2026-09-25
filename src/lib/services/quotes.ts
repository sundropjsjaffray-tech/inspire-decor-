/**
 * Quotes service — async, backed by the client store.
 * `convertQuoteToBooking` is the heart of the demo workflow: a quote becomes a
 * booking, the lead moves to BOOKED and matching hire stock is reserved.
 */
import { useStore } from "~/lib/store";
import { delay, uid } from "~/lib/util";
import type { Booking, Quote, QuoteItem, QuoteService, QuoteStatus } from "~/lib/types";
import { createBooking } from "./bookings";
import { reserveInventory } from "./inventory";
import { demoQuoteServices } from "~/lib/data/quoteServices";
import { quoteTerms } from "~/lib/data/business";
import { demoProducts } from "~/lib/data/products";

export interface QuoteLineInput {
  type: QuoteItem["type"];
  refId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteDraft {
  leadId: string;
  customerId: string;
  items: QuoteLineInput[];
  deliveryFee?: number;
  /** Flat setup fee — shown as its own totals row on the quote. */
  setupFee?: number;
  discount?: number;
  notes?: string;
  validUntil?: string;
  quotationNumber?: string;
  termsAndConditions?: string;
}

function nextQuotationNumber(quotes: Quote[], year = new Date().getFullYear()): string {
  const prefix = `QUO-${year}-`;
  const highest = quotes.reduce((max, quote) => {
    const number = quote.quotationNumber?.startsWith(prefix)
      ? Number(quote.quotationNumber.slice(prefix.length))
      : 0;
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 0);
  return `${prefix}${String(highest + 1).padStart(4, "0")}`;
}

function buildQuote(draft: QuoteDraft, existing?: Quote): Quote {
  const now = new Date().toISOString();
  const items: QuoteItem[] = draft.items.map((line) => ({
    id: existing?.items.find((item) => item.refId === line.refId && item.type === line.type)?.id ?? uid("QI"),
    type: line.type,
    refId: line.refId,
    name: line.name,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    lineTotal: line.quantity * line.unitPrice,
  }));
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = draft.deliveryFee ?? 0;
  const setupFee = draft.setupFee ?? 0;
  const discount = Math.max(0, draft.discount ?? 0);
  return {
    id: existing?.id ?? uid("Q"),
    quotationNumber: existing?.quotationNumber ?? draft.quotationNumber,
    leadId: draft.leadId,
    customerId: draft.customerId,
    items,
    subtotal,
    deliveryFee,
    setupFee,
    discount,
    total: Math.max(0, subtotal + deliveryFee + setupFee - discount),
    status: existing?.status ?? "DRAFT",
    notes: draft.notes,
    termsAndConditions: draft.termsAndConditions ?? existing?.termsAndConditions ?? quoteTerms,
    validUntil: draft.validUntil ?? existing?.validUntil,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    isDemo: existing?.isDemo ?? false,
  };
}

/** Read-only catalogue for the quote builder's services panel. */
export async function getQuoteServices(): Promise<QuoteService[]> {
  await delay(200);
  return demoQuoteServices;
}

export async function createQuote(draft: QuoteDraft): Promise<Quote> {
  await delay();
  const state = useStore.getState();
  const quote = buildQuote({ ...draft, quotationNumber: draft.quotationNumber ?? nextQuotationNumber(state.quotes) });
  useStore.getState().addQuote(quote);
  // ⚠️ RESEND NOTE: when real email is added, sending the quote document to the
  // customer happens HERE via a server-side createServerFn / api route that
  // calls Resend with the recipient address — never from the frontend (it would
  // leak the API key). `quote` is the exact payload to render.
  return quote;
}

export async function updateQuote(quoteId: string, draft: QuoteDraft): Promise<Quote> {
  await delay();
  const state = useStore.getState();
  const existing = state.quotes.find((quote) => quote.id === quoteId);
  if (!existing) throw new Error(`Quote not found: ${quoteId}`);
  const quote = buildQuote(draft, existing);
  state.updateQuote(quoteId, quote);
  return quote;
}

export async function getQuotes(): Promise<Quote[]> {
  await delay();
  return useStore.getState().quotes;
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  await delay(200);
  return useStore.getState().quotes.find((q) => q.id === id) ?? null;
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote> {
  await delay(250);
  const state = useStore.getState();
  const quote = state.quotes.find((q) => q.id === id);
  if (!quote) throw new Error(`Quote not found: ${id}`);
  state.updateQuote(id, { status });
  return { ...quote, status };
}

/**
 * Convert an accepted quote into a booking:
 * 1. build the booking from the quote (deposit captured later by the user),
 * 2. mark the quote ACCEPTED and the lead BOOKED,
 * 3. reserve warehouse stock for every product line on the quote.
 */
export async function convertQuoteToBooking(quoteId: string): Promise<Booking> {
  await delay(400);
  const state = useStore.getState();
  const quote = state.quotes.find((q) => q.id === quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  const lead = state.leads.find((l) => l.id === quote.leadId);

  // Reserve stock for product lines through stable product -> inventory IDs.
  // The name fallback keeps older demo quotes readable during the transition.
  // Items with no warehouse record (e.g. services) are skipped. A line that can't be fully reserved is
  // reported rather than failing the whole conversion — the booking still
  // stands and the business sources more stock.
  const unavailable: string[] = [];
  for (const line of quote.items) {
    if (line.type !== "product") continue;
    const product = demoProducts.find((entry) => entry.id === line.refId);
    const inventoryItem = product
      ? state.inventory.find((entry) => entry.id === product.inventoryItemId)
      : state.inventory.find((entry) => entry.name === line.name);
    if (inventoryItem) {
      try {
        await reserveInventory(inventoryItem.id, line.quantity);
      } catch {
        unavailable.push(
          `${line.name} (needed ${line.quantity}, short on available stock)`
        );
      }
    }
  }
  const reservationNote =
    unavailable.length > 0
      ? `⚠ Could not reserve: ${unavailable.join("; ")}.`
      : undefined;

  const booking = await createBooking({
    quoteId: quote.id,
    leadId: quote.leadId,
    customerId: quote.customerId,
    eventName: lead ? `${lead.customer.name} Event` : "Event",
    eventType: lead?.eventType ?? "other",
    eventDate: lead?.eventDate ?? todayISO(),
    venue: lead?.venue ?? lead?.customer.location ?? "TBC",
    guests: lead?.guests ?? 0,
    totalAmount: quote.total,
    depositPaid: 0,
    balanceDue: quote.total,
    notes: reservationNote
      ? [quote.notes, reservationNote].filter(Boolean).join("\n")
      : quote.notes,
  });

  state.updateQuote(quote.id, { status: "ACCEPTED" });
  if (lead) state.updateLead(lead.id, { status: "BOOKED" });

  return booking;
}
