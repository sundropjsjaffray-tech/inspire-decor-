/**
 * INSPIRE DECOR — domain types.
 *
 * Single source of truth for every business entity in the system. Components
 * never define these shapes inline; they consume them via the services layer
 * (`~/lib/services`), which currently backs onto the in-memory store and can be
 * swapped for Supabase later without touching the UI.
 *
 * All monetary values are in South African Rand (ZAR).
 */

// ---------------------------------------------------------------------------
// Enums / string unions
// ---------------------------------------------------------------------------

export type EventType =
  | "wedding"
  | "matricFarewell"
  | "birthday"
  | "babyShower"
  | "bridalShower"
  | "privateCelebration"
  | "funeral"
  | "corporate"
  | "engagement"
  | "christening"
  | "productLaunch"
  | "awards"
  | "conference"
  | "networking"
  | "intimate"
  | "consultation"
  | "other";

export type BudgetRange =
  | "under-2k"
  | "2k-5k"
  | "5k-10k"
  | "10k-20k"
  | "20k-plus"
  | "under-15k"
  | "15k-30k"
  | "30k-60k"
  | "60k-100k"
  | "100k-plus"
  | "not-sure";

export type LeadStatus = "NEW" | "QUALIFIED" | "QUOTE_SENT" | "FOLLOW_UP" | "BOOKED" | "LOST";

export type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export type BookingStatus =
  | "QUOTE"
  | "AWAITING_DEPOSIT"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_ON_HIRE"
  | "COMPLETED"
  | "CANCELLED";

export type EventStatus =
  | "ENQUIRY"
  | "QUOTED"
  | "CONFIRMED"
  | "PREPARING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type LeadSource = "WEBSITE" | "WHATSAPP" | "REFERRAL" | "PHONE" | "OTHER";

export type EnquiryStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";

export type NotificationType =
  | "lead"
  | "quote"
  | "booking"
  | "follow-up"
  | "inventory"
  | "system";

/** The service options a customer can tick on the Plan My Event form. */
export type ServiceOption =
  | "full-setup"
  | "draping"
  | "table-styling"
  | "floral"
  | "backdrops"
  | "crockery"
  | "linen"
  | "corporate"
  | "intimate"
  | "delivery"
  | "equipment-hire"
  | "cutlery"
  | "glassware"
  | "tables"
  | "chairs"
  | "backdrop"
  | "centrepieces"
  | "flowers"
  | "collection";

/** Extensible hire catalogue categories used by inventory and products. */
export type CategoryId =
  | "crockery"
  | "cutlery"
  | "glassware"
  | "linen"
  | "catering-platters"
  | "catering-stands"
  | "food-warmers"
  | "chairs"
  | "tables"
  | "furniture-decor"
  | "backdrops"
  | "centrepieces"
  | "tents"
  | "lighting"
  | "other";

/** Corporate enquiry / lead event types. */
export type CorporateEventType =
  | "corporate-function"
  | "year-end"
  | "product-launch"
  | "staff-function"
  | "conference"
  | "awards"
  | "networking"
  | "brand-activation"
  | "other";

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location?: string;
  createdAt: string; // ISO date
}

/** Raw website form submission — the entry point of the demo workflow. */
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: EventType;
  eventDate: string; // ISO date (or empty when undecided)
  guests: number;
  venue?: string;
  budgetRange: BudgetRange;
  services: ServiceOption[];
  message: string;
  status: EnquiryStatus;
  submittedAt: string; // ISO datetime
  isDemo: boolean;
}

/** One entry in a lead's status timeline (created / status changes). */
export interface LeadTimelineEntry {
  status: LeadStatus;
  at: string; // ISO datetime
  note?: string;
}

/**
 * A qualified opportunity worked by the business. Created from an Enquiry.
 *
 * The optional style/venue fields mirror the customer Plan My Event form, so
 * the lead detail view can show the full enquiry without parsing free text.
 */
export interface Lead {
  id: string;
  enquiryId?: string;
  customer: Customer;
  eventType: EventType;
  eventDate: string; // ISO date
  guests: number;
  budgetRange: BudgetRange;
  notes?: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  isDemo: boolean;
  // ---- structured detail (from the customer form, where provided) ----
  venue?: string;
  indoorOutdoor?: string; // "Indoor" | "Outdoor" | "Indoor & outdoor" | "Not sure yet"
  location?: string; // town / area
  services?: ServiceOption[];
  colourScheme?: string;
  theme?: string;
  requirements?: string;
  inspirationFile?: string; // file name only — uploads come later
  /** Customer's "add to enquiry" hire cart captured at submission time. */
  enquiryLines?: EnquiryLine[];
  /** Next action the business has committed to (date/description). */
  nextAction?: string;
  /** Status history for the detail timeline (created + every status change). */
  timeline?: LeadTimelineEntry[];
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image?: string;
}

export type PricingUnit = "each" | "per set" | "per metre" | "per event";

export interface InventoryVariant {
  id: string;
  inventoryItemId: string;
  variantName: string;
  stockQuantity: number | null;
  active: boolean;
}

export type StockMovementType =
  | "INITIAL_STOCK"
  | "STOCK_ADJUSTMENT"
  | "RESERVED"
  | "RELEASED"
  | "CHECKED_OUT"
  | "RETURNED"
  | "DAMAGED"
  | "MISSING"
  | "CORRECTION";

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  variantId?: string;
  movementType: StockMovementType;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  createdAt: string;
}

/** A hire product in the public catalogue. */
export interface Product {
  id: string;
  inventoryItemId: string;
  name: string;
  category: CategoryId;
  description: string;
  /** Rand per unit, per event. */
  hirePrice: number | null;
  /** Human unit, e.g. "per plate", "per metre". */
  unit: string;
  /** Currently hireable stock. */
  quantityAvailable: number | null;
  image?: string;
  featured?: boolean;
  isDemo: boolean;
}

/** A single line on a Quote — either a hire product or a service. */
export interface QuoteItem {
  id: string;
  type: "product" | "service";
  refId: string; // product or service id
  name: string; // snapshot of the name at quote time
  quantity: number;
  unitPrice: number; // rand per unit
  lineTotal: number; // quantity * unitPrice (computed by the service layer)
}

export interface Quote {
  id: string;
  quotationNumber?: string;
  leadId: string;
  customerId: string;
  items: QuoteItem[];
  subtotal: number; // sum of lineTotals
  deliveryFee: number;
  /** Optional flat setup fee (builder shows it as its own totals row). */
  setupFee?: number;
  discount: number;
  total: number; // subtotal + deliveryFee + setupFee - discount
  status: QuoteStatus;
  notes?: string;
  termsAndConditions?: string;
  validUntil?: string; // ISO date
  createdAt: string; // ISO datetime
  updatedAt?: string; // ISO datetime
  isDemo: boolean;
}

/** A priced service the quote builder can add (draping, setup, delivery…). */
export interface QuoteService {
  id: string;
  name: string;
  description?: string;
  /** "per event" | "per metre" | "per unit" — shown on the builder line. */
  unit: string;
  /** Rand per unit. */
  unitPrice: number;
  isDemo: boolean;
}

export interface Booking {
  id: string;
  quoteId?: string;
  leadId: string;
  customerId: string;
  eventName: string;
  eventType: EventType;
  eventDate: string; // ISO date
  venue: string;
  guests: number;
  status: BookingStatus;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  setupTime?: string; // "HH:mm"
  eventTime?: string; // "HH:mm"
  collectionTime?: string; // "HH:mm"
  notes?: string;
  createdAt: string; // ISO datetime
  isDemo: boolean;
}

/**
 * A single stock line in the warehouse. `available` is derived:
 * total - reserved - outOnHire - damaged - missing.
 */
export interface InventoryItem {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  basePrice: number | null;
  pricingUnit: PricingUnit;
  total: number | null;
  reserved: number; // booked for upcoming events
  outOnHire: number; // physically with a client right now
  damaged: number;
  missing: number;
  active: boolean;
  variants: InventoryVariant[];
  createdAt: string;
  updatedAt: string;
  /** Below this available count the item is flagged as low stock. */
  reorderLevel?: number;
  isDemo: boolean;
}

/** Client-facing event record (what happens on the day). */
export interface Event {
  id: string;
  name: string;
  customer: Customer;
  date: string; // ISO date
  type: EventType;
  venue: string;
  guests: number;
  setupTime: string; // "HH:mm"
  eventTime: string; // "HH:mm"
  collectionTime: string; // "HH:mm"
  status: EventStatus;
  notes?: string;
  isDemo: boolean;
}

/** Corporate enquiry — company-level lead. */
export interface CorporateLead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  eventType: CorporateEventType;
  date?: string; // ISO date
  guests?: number;
  venue?: string;
  message: string;
  status: LeadStatus;
  createdAt: string; // ISO datetime
  isDemo: boolean;
}

/** In-app notification (see lib/services/notifications.ts). */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO datetime
  isDemo: boolean;
}

/** A service offering advertised on the Services page. */
export interface Service {
  id: string;
  name: string;
  description: string;
  /** Starting price in Rand, or null for "Custom Quote". */
  startingPrice: number | null;
  /** Human price label, e.g. "from R45 per metre" or "Custom Quote". */
  priceLabel: string;
  image?: string;
  /** Featured on the homepage services preview. */
  featured?: boolean;
  isDemo: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  eventType: string;
  quote: string;
  rating: number; // 0–5
  eventDate?: string;
  isDemo: boolean;
}

export interface GalleryItem {
  id: string;
  image?: string;
  caption: string;
  category: string; // free-form, e.g. "Weddings", "Corporate"
  isDemo: boolean;
}

/** A corporate event type marketed on the Corporate page. */
export interface CorporateEventTypeInfo {
  id: CorporateEventType;
  name: string;
  description: string;
  image?: string;
  isDemo: boolean;
}

/** One line of the customer's "add to enquiry" hire selection. */
export interface EnquiryLine {
  productId: string;
  quantity: number;
}
