/**
 * Demo corporate offering — the corporate event types marketed on the
 * Corporate page, plus a couple of seeded corporate leads.
 */
import type { CorporateEventTypeInfo, CorporateLead } from "~/lib/types";
import { isoDaysFromNow } from "~/lib/util";
import { IMG } from "~/lib/images";

export const demoCorporateEventTypes: CorporateEventTypeInfo[] = [
  {
    id: "corporate-function",
    name: "Corporate Functions",
    description: "Elegant décor and full setup for company functions of any size.",
    image: IMG.corporateToast,
    isDemo: true,
  },
  {
    id: "year-end",
    name: "Year-End Events",
    description: "Gala dinners and year-end parties that reward your team in style.",
    image: IMG.corporateGala,
    isDemo: true,
  },
  {
    id: "product-launch",
    name: "Product Launches",
    description: "Stage, backdrop, lighting and styling that make the launch memorable.",
    image: IMG.floralBackdrop,
    isDemo: true,
  },
  {
    id: "staff-function",
    name: "Staff Functions",
    description: "Relaxed, polished setups for staff days and family days.",
    image: IMG.birthdayParty,
    isDemo: true,
  },
  {
    id: "conference",
    name: "Conferences",
    description: "Registration, seating, staging and refreshment areas, end to end.",
    image: IMG.conferenceRoom,
    isDemo: true,
  },
  {
    id: "awards",
    name: "Awards Ceremonies",
    description: "Red-carpet styling, table décor and staging for award evenings.",
    image: IMG.eventHall,
    isDemo: true,
  },
  {
    id: "networking",
    name: "Networking Events",
    description: "Cocktail-style layouts with high tables, glassware and grazing flow.",
    image: IMG.networking,
    isDemo: true,
  },
  {
    id: "brand-activation",
    name: "Brand Activations",
    description: "Pop-up styling and hire equipment for activations and roadshows.",
    image: IMG.confetti,
    isDemo: true,
  },
];

/** Corporate benefits highlighted on the Corporate page. */
export const demoCorporateBenefits: { id: string; title: string; description: string; isDemo: boolean }[] = [
  {
    id: "cb-1",
    title: "Reliability you can plan around",
    description:
      "Deliveries, setups and breakdowns on a signed schedule — your event runs on time because we plan it that way.",
    isDemo: true,
  },
  {
    id: "cb-2",
    title: "Scale for 20 to 2,000 guests",
    description:
      "Warehouse stock of tables, chairs, crockery and linen means large events are never 'sourced' at the last minute.",
    isDemo: true,
  },
  {
    id: "cb-3",
    title: "One supplier, one invoice",
    description:
      "Décor, hire equipment, styling and setup from a single team — fewer vendors, fewer risks, one accountable partner.",
    isDemo: true,
  },
  {
    id: "cb-4",
    title: "Branded, on-brand styling",
    description:
      "Colour schemes and signage-style décor matched to your brand guidelines for launches, conferences and awards.",
    isDemo: true,
  },
];

export const demoCorporateLeads: CorporateLead[] = [
  {
    id: "cl-1001",
    company: "Vertex Holdings",
    contactName: "Lindiwe Nkosi",
    email: "lindiwe.nkosi@vertexholdings.co.za",
    phone: "+27 82 555 0134",
    eventType: "year-end",
    date: isoDaysFromNow(90),
    guests: 250,
    venue: "Emperors Palace",
    message: "Full gala setup for our year-end function — décor, tables and crockery.",
    status: "QUOTE_SENT",
    createdAt: isoDaysFromNow(-12),
    isDemo: true,
  },
  {
    id: "cl-1002",
    company: "Apex Tech",
    contactName: "Michael Okafor",
    email: "m.okafor@apextech.com",
    phone: "+27 83 555 0178",
    eventType: "product-launch",
    date: isoDaysFromNow(75),
    guests: 150,
    venue: "Sandton Convention Centre",
    message: "Backdrop, stage styling and cocktail furniture for our launch.",
    status: "LOST",
    createdAt: isoDaysFromNow(-30),
    isDemo: true,
  },
];
