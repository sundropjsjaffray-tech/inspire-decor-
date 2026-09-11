/**
 * Quote-builder services catalogue (isDemo: true).
 *
 * The dashboard quote builder offers priced add-on services on top of hire
 * products. `setup` and `delivery` are special: they map to the quote's
 * dedicated setupFee / deliveryFee rows; every other service becomes a normal
 * quote line item. Amounts are real Rand, VAT-inclusive.
 */
import type { QuoteService } from "~/lib/types";

export const demoQuoteServices: QuoteService[] = [
  {
    id: "setup",
    name: "Setup",
    description: "On-site setup, styling and load-in by our crew.",
    unit: "per event",
    unitPrice: 7500,
    isDemo: true,
  },
  {
    id: "delivery",
    name: "Delivery",
    description: "Delivery and collection of all hired items (Port Elizabeth, Eastern Cape).",
    unit: "per event",
    unitPrice: 1500,
    isDemo: true,
  },
  {
    id: "draping",
    name: "Draping",
    description: "Soft ceiling and wall draping, installed.",
    unit: "per metre",
    unitPrice: 45,
    isDemo: true,
  },
  {
    id: "backdrop",
    name: "Backdrop",
    description: "Fabric or floral backdrop built for the event.",
    unit: "per backdrop",
    unitPrice: 650,
    isDemo: true,
  },
  {
    id: "centrepieces",
    name: "Centrepieces",
    description: "Styled floral/candle centrepieces for each table.",
    unit: "per centrepiece",
    unitPrice: 180,
    isDemo: true,
  },
  {
    id: "floral",
    name: "Floral Décor",
    description: "Fresh-look floral arrangements and accents.",
    unit: "per arrangement",
    unitPrice: 350,
    isDemo: true,
  },
  {
    id: "collection",
    name: "Collection",
    description: "After-event breakdown and collection of hired items.",
    unit: "per event",
    unitPrice: 800,
    isDemo: true,
  },
];

/**
 * Quote document defaults. All demo values; swap for business settings later.
 */
export const quoteDefaults = {
  /** Deposit required as a fraction of the total (0.5 = 50%). */
  depositRate: 0.5,
  /** Validity window for new quotes, in days. */
  validDays: 14,
  /** Payment terms line shown on the quote document. */
  paymentTerms:
    "50% deposit secures your date. The balance is due 14 days before the event. All prices include VAT.",
} as const;
