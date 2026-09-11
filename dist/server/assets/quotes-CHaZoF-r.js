import { u as useStore } from "./index-DpiVUCS0.js";
import { d as delay, t as todayISO, u as uid } from "./util-D5Y4JTPp.js";
import { c as createBooking } from "./bookings-HbI5VwzQ.js";
import { r as reserveInventory } from "./inventory-MksNkqWX.js";
const demoQuoteServices = [
  {
    id: "setup",
    name: "Setup",
    description: "On-site setup, styling and load-in by our crew.",
    unit: "per event",
    unitPrice: 7500,
    isDemo: true
  },
  {
    id: "delivery",
    name: "Delivery",
    description: "Delivery and collection of all hired items (Gauteng).",
    unit: "per event",
    unitPrice: 1500,
    isDemo: true
  },
  {
    id: "draping",
    name: "Draping",
    description: "Soft ceiling and wall draping, installed.",
    unit: "per metre",
    unitPrice: 45,
    isDemo: true
  },
  {
    id: "backdrop",
    name: "Backdrop",
    description: "Fabric or floral backdrop built for the event.",
    unit: "per backdrop",
    unitPrice: 650,
    isDemo: true
  },
  {
    id: "centrepieces",
    name: "Centrepieces",
    description: "Styled floral/candle centrepieces for each table.",
    unit: "per centrepiece",
    unitPrice: 180,
    isDemo: true
  },
  {
    id: "floral",
    name: "Floral Décor",
    description: "Fresh-look floral arrangements and accents.",
    unit: "per arrangement",
    unitPrice: 350,
    isDemo: true
  },
  {
    id: "collection",
    name: "Collection",
    description: "After-event breakdown and collection of hired items.",
    unit: "per event",
    unitPrice: 800,
    isDemo: true
  }
];
const quoteDefaults = {
  /** Deposit required as a fraction of the total (0.5 = 50%). */
  depositRate: 0.5,
  /** Validity window for new quotes, in days. */
  validDays: 14,
  /** Payment terms line shown on the quote document. */
  paymentTerms: "50% deposit secures your date. The balance is due 14 days before the event. All prices include VAT."
};
async function getQuoteServices() {
  await delay(200);
  return demoQuoteServices;
}
async function createQuote(draft) {
  await delay();
  const items = draft.items.map((line) => ({
    id: uid("QI"),
    type: line.type,
    refId: line.refId,
    name: line.name,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    lineTotal: line.quantity * line.unitPrice
  }));
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const deliveryFee = draft.deliveryFee ?? 0;
  const setupFee = draft.setupFee ?? 0;
  const discount = draft.discount ?? 0;
  const quote = {
    id: uid("Q"),
    leadId: draft.leadId,
    customerId: draft.customerId,
    items,
    subtotal,
    deliveryFee,
    setupFee,
    discount,
    total: subtotal + deliveryFee + setupFee - discount,
    status: "DRAFT",
    notes: draft.notes,
    validUntil: draft.validUntil,
    createdAt: todayISO(),
    isDemo: false
  };
  useStore.getState().addQuote(quote);
  return quote;
}
async function getQuotes() {
  await delay();
  return useStore.getState().quotes;
}
async function updateQuoteStatus(id, status) {
  await delay(250);
  const state = useStore.getState();
  const quote = state.quotes.find((q) => q.id === id);
  if (!quote) throw new Error(`Quote not found: ${id}`);
  state.updateQuote(id, { status });
  return { ...quote, status };
}
async function convertQuoteToBooking(quoteId) {
  await delay(400);
  const state = useStore.getState();
  const quote = state.quotes.find((q) => q.id === quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);
  const lead = state.leads.find((l) => l.id === quote.leadId);
  const unavailable = [];
  for (const line of quote.items) {
    if (line.type !== "product") continue;
    const inventoryItem = state.inventory.find((i) => i.name === line.name);
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
  const reservationNote = unavailable.length > 0 ? `⚠ Could not reserve: ${unavailable.join("; ")}.` : void 0;
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
    notes: reservationNote ? [quote.notes, reservationNote].filter(Boolean).join("\n") : quote.notes
  });
  state.updateQuote(quote.id, { status: "ACCEPTED" });
  if (lead) state.updateLead(lead.id, { status: "BOOKED" });
  return booking;
}
export {
  getQuoteServices as a,
  convertQuoteToBooking as b,
  createQuote as c,
  getQuotes as g,
  quoteDefaults as q,
  updateQuoteStatus as u
};
