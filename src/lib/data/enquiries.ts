/**
 * Demo website enquiries (isDemo: true).
 *
 * E-1001 is the star of the core demo workflow: a 120-guest matric farewell
 * submitted on the site. It starts as a NEW enquiry with no linked lead, so the
 * demo can run enquiry → lead → quote → booking → inventory reservation live.
 */
import type { Enquiry } from "~/lib/types";
import { isoDaysFromNow, todayISO } from "~/lib/util";

export const demoEnquiries: Enquiry[] = [
  {
    id: "E-1001",
    name: "Thandeka Mokoena",
    email: "thandeka.mokoena@gmail.com",
    phone: "+27 82 555 0123",
    eventType: "matricFarewell",
    eventDate: isoDaysFromNow(67),
    guests: 120,
    venue: "Silver Lakes Country Club",
    budgetRange: "30k-60k",
    services: ["full-setup", "draping", "crockery", "linen"],
    message:
      "We are hosting a matric farewell for 120 learners in October and need full décor, draping, crockery and chair covers. Please send us a quote.",
    status: "NEW",
    submittedAt: `${todayISO()}T09:24:00.000Z`,
    isDemo: true,
  },
  {
    id: "E-1002",
    name: "Sarah van der Merwe",
    email: "sarah.vdm@gmail.com",
    phone: "+27 84 555 0144",
    eventType: "wedding",
    eventDate: isoDaysFromNow(45),
    guests: 120,
    venue: "The Ridge, Muldersdrift",
    budgetRange: "60k-100k",
    services: ["full-setup", "floral", "crockery", "linen"],
    message:
      "Our wedding is at The Ridge — we'd love a full setup including florals, gold chair covers and a white-and-blush palette.",
    status: "CONVERTED",
    submittedAt: `${isoDaysFromNow(-14)}T14:02:00.000Z`,
    isDemo: true,
  },
  {
    id: "E-1003",
    name: "Lindiwe Nkosi",
    email: "lindiwe.nkosi@vertexholdings.co.za",
    phone: "+27 82 555 0134",
    eventType: "corporate",
    eventDate: isoDaysFromNow(90),
    guests: 250,
    venue: "Emperors Palace",
    budgetRange: "100k-plus",
    services: ["corporate", "backdrops", "draping"],
    message:
      "Vertex Holdings year-end function — 250 guests, full gala setup with a stage backdrop and ceiling draping.",
    status: "CONTACTED",
    submittedAt: `${isoDaysFromNow(-12)}T10:15:00.000Z`,
    isDemo: true,
  },
  {
    id: "E-1004",
    name: "Sipho Mahlangu",
    email: "sipho.mahlangu@outlook.com",
    phone: "+27 79 555 0166",
    eventType: "birthday",
    eventDate: isoDaysFromNow(20),
    guests: 50,
    venue: "Home garden, Midrand",
    budgetRange: "15k-30k",
    services: ["intimate", "crockery", "delivery"],
    message:
      "Mum's 60th birthday in the garden — 50 guests, crockery and glassware hire, plus delivery and setup.",
    status: "CLOSED",
    submittedAt: `${isoDaysFromNow(-25)}T17:41:00.000Z`,
    isDemo: true,
  },
];
