/**
 * Form option lists for the customer-facing forms (Plan My Event, consultation).
 *
 * Options are business data, not component literals — the labels below are what
 * the customer sees; the values are the domain types stored on leads/enquiries.
 */
import type { BudgetRange, EventType, ServiceOption } from "~/lib/types";

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

/** Event types offered on the Plan My Event + consultation forms. */
export const quoteEventTypeOptions: Option<EventType>[] = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "matricFarewell", label: "Matric Farewell" },
  { value: "babyShower", label: "Baby Shower" },
  { value: "bridalShower", label: "Bridal Shower" },
  { value: "corporate", label: "Corporate Event" },
  { value: "conference", label: "Conference" },
  { value: "privateCelebration", label: "Private Celebration" },
  { value: "funeral", label: "Funeral" },
  { value: "other", label: "Other" },
];

/** Budget bands on the Plan My Event form (real Rand, VAT-inclusive). */
export const quoteBudgetOptions: Option<BudgetRange>[] = [
  { value: "under-2k", label: "Under R2,000" },
  { value: "2k-5k", label: "R2,000 – R5,000" },
  { value: "5k-10k", label: "R5,000 – R10,000" },
  { value: "10k-20k", label: "R10,000 – R20,000" },
  { value: "20k-plus", label: "R20,000+" },
];

/** Service checkboxes on the Plan My Event form. */
export const quoteServiceOptions: Option<ServiceOption>[] = [
  { value: "equipment-hire", label: "Equipment Hire" },
  { value: "crockery", label: "Crockery" },
  { value: "cutlery", label: "Cutlery" },
  { value: "glassware", label: "Glassware" },
  { value: "tables", label: "Tables" },
  { value: "chairs", label: "Chairs" },
  { value: "linen", label: "Linen" },
  { value: "draping", label: "Draping" },
  { value: "backdrop", label: "Backdrop" },
  { value: "centrepieces", label: "Centrepieces" },
  { value: "flowers", label: "Flowers" },
  { value: "full-setup", label: "Full Event Setup" },
  { value: "delivery", label: "Delivery" },
  { value: "collection", label: "Collection" },
];

/** Indoor/outdoor choice on the Plan My Event form. */
export const venueTypeOptions: Option[] = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "both", label: "Indoor & outdoor" },
  { value: "undecided", label: "Not sure yet" },
];
