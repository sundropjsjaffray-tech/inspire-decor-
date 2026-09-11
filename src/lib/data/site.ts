/**
 * Demo business details for the customer site: contact channels, service area,
 * opening hours and homepage differentiators. All demonstration data — the
 * owner replaces these with real details when the business goes live.
 */
import type { ServiceOption } from "~/lib/types";

export interface ContactDetails {
  phone: string;
  whatsapp: string;
  email: string;
  area: string;
  serviceRegion: string;
  hours: { days: string; time: string }[];
  isDemo: boolean;
}

export const demoContactDetails: ContactDetails = {
  phone: "+27 82 555 0100",
  whatsapp: "+27 82 555 0100",
  email: "hello@inspiredecor.co.za",
  area: "Port Elizabeth, Eastern Cape",
  serviceRegion: "Serving Port Elizabeth, Eastern Cape.",
  hours: [
    { days: "Monday – Friday", time: "08:00 – 17:00" },
    { days: "Saturday", time: "08:00 – 14:00" },
    { days: "Sunday & Public Holidays", time: "Closed (events by arrangement)" },
  ],
  isDemo: true,
};

export interface Differentiator {
  id: string;
  title: string;
  description: string;
  isDemo: boolean;
}

export const demoDifferentiators: Differentiator[] = [
  {
    id: "d-1",
    title: "One team, full setup",
    description:
      "Décor, draping, crockery, glassware, linen and styling — one crew loads in, sets up and breaks down. You deal with a single invoice and a single point of contact.",
    isDemo: true,
  },
  {
    id: "d-2",
    title: "Premium look, honest pricing",
    description:
      "Real Rand hire rates quoted upfront, VAT included. No hidden charges — what we quote is what you pay.",
    isDemo: true,
  },
  {
    id: "d-3",
    title: "Warehouse stock, on time",
    description:
      "Our own stock of tables, chairs, crockery and décor is checked, counted and reserved for your date, delivered when we say we will.",
    isDemo: true,
  },
  {
    id: "d-4",
    title: "Styled to your theme",
    description:
      "Colour palettes, chair covers, floral and backdrops styled around your vision — from intimate dinners to 500-guest galas.",
    isDemo: true,
  },
  {
    id: "d-5",
    title: "Corporate-ready",
    description:
      "Conferences, launches and year-end functions handled with the reliability and scale a business event demands.",
    isDemo: true,
  },
  {
    id: "d-6",
    title: "Fast, human communication",
    description:
      "A real person answers your enquiry within one working day — the way a small business should.",
    isDemo: true,
  },
];

/**
 * Maps a hire-catalogue category to the service-option checkbox(es) it best
 * matches on the Plan My Event form, so items added to the enquiry list
 * pre-tick the relevant services.
 */
export const categoryToServiceOptions: Record<string, ServiceOption[]> = {
  crockery: ["crockery"],
  cutlery: ["cutlery"],
  glassware: ["glassware"],
  tables: ["tables"],
  chairs: ["chairs"],
  linen: ["linen"],
  "chair-covers": ["linen"],
  decor: ["centrepieces"],
  backdrops: ["backdrop"],
  draping: ["draping"],
  centrepieces: ["centrepieces"],
  "serving-equipment": ["equipment-hire"],
};
