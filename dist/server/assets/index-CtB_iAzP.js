import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { i as isoDaysFromNow } from "./util-D5Y4JTPp.js";
const demoBookings = [
  {
    id: "B-1001",
    quoteId: "Q-1001",
    leadId: "L-1005",
    customerId: "C-1005",
    eventName: "Riverside Matric Farewell",
    eventType: "matricFarewell",
    eventDate: isoDaysFromNow(60),
    venue: "Riverside Lodge, Centurion",
    guests: 180,
    status: "AWAITING_DEPOSIT",
    totalAmount: 26400,
    depositPaid: 5e3,
    balanceDue: 21400,
    setupTime: "08:00",
    eventTime: "18:00",
    collectionTime: "23:30",
    notes: "Deposit received — balance due 14 days before the event.",
    createdAt: isoDaysFromNow(-6),
    isDemo: true
  },
  {
    id: "B-1002",
    quoteId: "Q-1003",
    leadId: "L-1002",
    customerId: "C-1002",
    eventName: "Sarah & James Wedding",
    eventType: "wedding",
    eventDate: isoDaysFromNow(45),
    venue: "The Ridge, Muldersdrift",
    guests: 120,
    status: "CONFIRMED",
    totalAmount: 38500,
    depositPaid: 19250,
    balanceDue: 19250,
    setupTime: "07:00",
    eventTime: "15:00",
    collectionTime: "23:00",
    notes: "White-and-blush palette, gold chair covers.",
    createdAt: isoDaysFromNow(-8),
    isDemo: true
  },
  {
    id: "B-1003",
    leadId: "L-1003",
    customerId: "C-1003",
    eventName: "Mama Dlamini 60th Birthday",
    eventType: "birthday",
    eventDate: isoDaysFromNow(20),
    venue: "Home garden, Port Elizabeth, Eastern Cape",
    guests: 50,
    status: "PREPARING",
    totalAmount: 12800,
    depositPaid: 12800,
    balanceDue: 0,
    setupTime: "10:00",
    eventTime: "14:00",
    collectionTime: "20:00",
    notes: "Paid in full — pastel garden theme.",
    createdAt: isoDaysFromNow(-9),
    isDemo: true
  },
  {
    id: "B-1004",
    leadId: "L-1004",
    customerId: "C-1004",
    eventName: "Vertex Holdings Year-End",
    eventType: "corporate",
    eventDate: isoDaysFromNow(-3),
    venue: "Emperors Palace",
    guests: 250,
    status: "OUT_ON_HIRE",
    totalAmount: 52e3,
    depositPaid: 4e4,
    balanceDue: 12e3,
    setupTime: "06:00",
    eventTime: "18:00",
    collectionTime: "02:00",
    notes: "Gear on hire this week; collection crew scheduled.",
    createdAt: isoDaysFromNow(-21),
    isDemo: true
  },
  {
    id: "B-1005",
    leadId: "L-1002",
    customerId: "C-1009",
    eventName: "St Michael's Christening",
    eventType: "christening",
    eventDate: isoDaysFromNow(-2),
    venue: "St Michael's Hall, Kempton Park",
    guests: 60,
    status: "COMPLETED",
    totalAmount: 18200,
    depositPaid: 18200,
    balanceDue: 0,
    setupTime: "08:00",
    eventTime: "11:00",
    collectionTime: "17:00",
    notes: "Completed — all stock returned and checked.",
    createdAt: isoDaysFromNow(-18),
    isDemo: true
  },
  {
    id: "B-1006",
    leadId: "L-1004",
    customerId: "C-1008",
    eventName: "Apex Product Launch",
    eventType: "productLaunch",
    eventDate: isoDaysFromNow(75),
    venue: "Sandton Convention Centre",
    guests: 150,
    status: "CONFIRMED",
    totalAmount: 44e3,
    depositPaid: 22e3,
    balanceDue: 22e3,
    setupTime: "05:00",
    eventTime: "17:00",
    collectionTime: "23:00",
    notes: "Backdrop and stage styling confirmed.",
    createdAt: isoDaysFromNow(-15),
    isDemo: true
  },
  {
    id: "B-1007",
    leadId: "L-1006",
    customerId: "C-1006",
    eventName: "Priya & Aiden Engagement",
    eventType: "engagement",
    eventDate: isoDaysFromNow(30),
    venue: "La Vie en Rose, Port Elizabeth, Eastern Cape",
    guests: 80,
    status: "QUOTE",
    totalAmount: 16400,
    depositPaid: 0,
    balanceDue: 16400,
    setupTime: "09:00",
    eventTime: "16:00",
    collectionTime: "22:00",
    notes: "Awaiting client decision on quote.",
    createdAt: isoDaysFromNow(-5),
    isDemo: true
  },
  {
    id: "B-1008",
    leadId: "L-1007",
    customerId: "C-1010",
    eventName: "Winter Gala (cancelled)",
    eventType: "corporate",
    eventDate: isoDaysFromNow(-20),
    venue: "Hyatt Regency, Rosebank",
    guests: 200,
    status: "CANCELLED",
    totalAmount: 21e3,
    depositPaid: 0,
    balanceDue: 0,
    setupTime: "07:00",
    eventTime: "18:00",
    collectionTime: "23:00",
    notes: "Cancelled by client — deposit waived as goodwill.",
    createdAt: isoDaysFromNow(-35),
    isDemo: true
  },
  // ---- Historical completed bookings (populate the 6-month revenue series) ----
  {
    id: "B-1009",
    leadId: "L-1009",
    customerId: "C-1011",
    eventName: "Zanele & Thabo Wedding",
    eventType: "wedding",
    eventDate: isoDaysFromNow(-135),
    venue: "Tzaneen Country Lodge",
    guests: 150,
    status: "COMPLETED",
    totalAmount: 32400,
    depositPaid: 32400,
    balanceDue: 0,
    setupTime: "08:00",
    eventTime: "14:00",
    collectionTime: "23:00",
    notes: "Completed — gold and ivory theme.",
    createdAt: isoDaysFromNow(-150),
    isDemo: true
  },
  {
    id: "B-1010",
    leadId: "L-1010",
    customerId: "C-1012",
    eventName: "Marvin Logistics Staff Function",
    eventType: "corporate",
    eventDate: isoDaysFromNow(-105),
    venue: "Birchwood Hotel",
    guests: 120,
    status: "COMPLETED",
    totalAmount: 21500,
    depositPaid: 21500,
    balanceDue: 0,
    setupTime: "09:00",
    eventTime: "17:00",
    collectionTime: "23:00",
    notes: "Completed — networking setup.",
    createdAt: isoDaysFromNow(-120),
    isDemo: true
  },
  {
    id: "B-1011",
    leadId: "L-1011",
    customerId: "C-1013",
    eventName: "Lebo's Bridal Shower",
    eventType: "bridalShower",
    eventDate: isoDaysFromNow(-80),
    venue: "Rosebank rooftop venue",
    guests: 40,
    status: "COMPLETED",
    totalAmount: 9800,
    depositPaid: 9800,
    balanceDue: 0,
    setupTime: "10:00",
    eventTime: "13:00",
    collectionTime: "18:00",
    notes: "Completed — blush florals.",
    createdAt: isoDaysFromNow(-95),
    isDemo: true
  },
  {
    id: "B-1012",
    leadId: "L-1012",
    customerId: "C-1014",
    eventName: "SA Health Conference",
    eventType: "conference",
    eventDate: isoDaysFromNow(-50),
    venue: "Sandton Convention Centre",
    guests: 300,
    status: "COMPLETED",
    totalAmount: 47e3,
    depositPaid: 47e3,
    balanceDue: 0,
    setupTime: "05:00",
    eventTime: "08:00",
    collectionTime: "18:00",
    notes: "Completed — full conference build.",
    createdAt: isoDaysFromNow(-65),
    isDemo: true
  }
];
const customer$1 = (id, name, email, phone, extra) => ({
  id,
  name,
  email,
  phone,
  location: "Port Elizabeth, Eastern Cape",
  createdAt: isoDaysFromNow(-14),
  ...extra
});
const demoEvents = [
  {
    id: "EV-1001",
    name: "Sarah & James Wedding",
    customer: customer$1("C-1002", "Sarah & James van der Merwe", "sarah.vdm@gmail.com", "+27 84 555 0144"),
    date: isoDaysFromNow(45),
    type: "wedding",
    venue: "The Ridge, Muldersdrift",
    guests: 120,
    setupTime: "07:00",
    eventTime: "15:00",
    collectionTime: "23:00",
    status: "CONFIRMED",
    notes: "Full setup — white-and-blush palette.",
    isDemo: true
  },
  {
    id: "EV-1002",
    name: "Riverside Matric Farewell",
    customer: customer$1("C-1005", "Ayanda Khumalo", "ayanda.khumalo@gmail.com", "+27 81 555 0177"),
    date: isoDaysFromNow(60),
    type: "matricFarewell",
    venue: "Riverside Lodge, Centurion",
    guests: 180,
    setupTime: "08:00",
    eventTime: "18:00",
    collectionTime: "23:30",
    status: "CONFIRMED",
    notes: "Champagne and dessert colour scheme.",
    isDemo: true
  },
  {
    id: "EV-1003",
    name: "Mama Dlamini 60th Birthday",
    customer: customer$1("C-1003", "Naledi Dlamini", "naledi.dlamini@gmail.com", "+27 83 555 0155"),
    date: isoDaysFromNow(20),
    type: "birthday",
    venue: "Home garden, Port Elizabeth, Eastern Cape",
    guests: 50,
    setupTime: "10:00",
    eventTime: "14:00",
    collectionTime: "20:00",
    status: "PREPARING",
    notes: "Pastel garden theme.",
    isDemo: true
  },
  {
    id: "EV-1004",
    name: "Vertex Holdings Year-End",
    customer: customer$1(
      "C-1004",
      "Lindiwe Nkosi",
      "lindiwe.nkosi@vertexholdings.co.za",
      "+27 82 555 0134",
      { company: "Vertex Holdings" }
    ),
    date: isoDaysFromNow(-3),
    type: "corporate",
    venue: "Emperors Palace",
    guests: 250,
    setupTime: "06:00",
    eventTime: "18:00",
    collectionTime: "02:00",
    status: "IN_PROGRESS",
    notes: "Gala setup — gear currently out on hire.",
    isDemo: true
  },
  {
    id: "EV-1005",
    name: "St Michael's Christening",
    customer: customer$1("C-1009", "Nomsa Dube", "nomsa.dube@gmail.com", "+27 78 555 0110"),
    date: isoDaysFromNow(-2),
    type: "christening",
    venue: "St Michael's Hall, Kempton Park",
    guests: 60,
    setupTime: "08:00",
    eventTime: "11:00",
    collectionTime: "17:00",
    status: "COMPLETED",
    notes: "All stock returned and checked.",
    isDemo: true
  },
  {
    id: "EV-1006",
    name: "Apex Product Launch",
    customer: customer$1("C-1008", "Michael Okafor", "m.okafor@apextech.com", "+27 83 555 0178", {
      company: "Apex Tech"
    }),
    date: isoDaysFromNow(75),
    type: "productLaunch",
    venue: "Sandton Convention Centre",
    guests: 150,
    setupTime: "05:00",
    eventTime: "17:00",
    collectionTime: "23:00",
    status: "CONFIRMED",
    notes: "Backdrop and stage styling.",
    isDemo: true
  }
];
const demoInventory = [
  // ---- Crockery ----
  { id: "inv-dinner-plate", name: "Dinner Plate", category: "crockery", total: 300, reserved: 45, outOnHire: 100, damaged: 3, missing: 2, reorderLevel: 40, isDemo: true },
  { id: "inv-side-plate", name: "Side Plate", category: "crockery", total: 250, reserved: 40, outOnHire: 90, damaged: 3, missing: 1, reorderLevel: 30, isDemo: true },
  { id: "inv-charger-plate", name: "Charger Plate", category: "crockery", total: 150, reserved: 30, outOnHire: 60, damaged: 2, missing: 1, reorderLevel: 20, isDemo: true },
  { id: "inv-soup-bowl", name: "Soup Bowl", category: "crockery", total: 120, reserved: 20, outOnHire: 45, damaged: 1, missing: 0, reorderLevel: 15, isDemo: true },
  // ---- Cutlery ----
  { id: "inv-fork", name: "Fork", category: "cutlery", total: 400, reserved: 80, outOnHire: 160, damaged: 6, missing: 3, reorderLevel: 50, isDemo: true },
  { id: "inv-knife", name: "Knife", category: "cutlery", total: 400, reserved: 80, outOnHire: 160, damaged: 5, missing: 2, reorderLevel: 50, isDemo: true },
  { id: "inv-spoon", name: "Spoon", category: "cutlery", total: 400, reserved: 80, outOnHire: 150, damaged: 4, missing: 2, reorderLevel: 50, isDemo: true },
  // ---- Glassware ----
  { id: "inv-wine-glass", name: "Wine Glass", category: "glassware", total: 240, reserved: 50, outOnHire: 100, damaged: 8, missing: 4, reorderLevel: 30, isDemo: true },
  { id: "inv-champagne-glass", name: "Champagne Glass", category: "glassware", total: 240, reserved: 40, outOnHire: 80, damaged: 5, missing: 2, reorderLevel: 25, isDemo: true },
  { id: "inv-tumbler", name: "Tumbler", category: "glassware", total: 200, reserved: 30, outOnHire: 60, damaged: 3, missing: 1, reorderLevel: 20, isDemo: true },
  // ---- Tables ----
  { id: "inv-banquet-table", name: "Banquet Table", category: "tables", total: 60, reserved: 10, outOnHire: 20, damaged: 1, missing: 0, reorderLevel: 8, isDemo: true },
  { id: "inv-round-table", name: "Round Table", category: "tables", total: 40, reserved: 8, outOnHire: 12, damaged: 0, missing: 0, reorderLevel: 6, isDemo: true },
  { id: "inv-cocktail-table", name: "Cocktail Table", category: "tables", total: 50, reserved: 6, outOnHire: 12, damaged: 0, missing: 0, reorderLevel: 5, isDemo: true },
  // ---- Chairs ----
  { id: "inv-banquet-chair", name: "Banquet Chair", category: "chairs", total: 300, reserved: 60, outOnHire: 120, damaged: 5, missing: 2, reorderLevel: 30, isDemo: true },
  { id: "inv-tiffany-chair", name: "Tiffany Chair", category: "chairs", total: 150, reserved: 30, outOnHire: 45, damaged: 2, missing: 0, reorderLevel: 15, isDemo: true },
  { id: "inv-folding-chair", name: "Folding Chair", category: "chairs", total: 200, reserved: 25, outOnHire: 40, damaged: 3, missing: 1, reorderLevel: 20, isDemo: true },
  // ---- Linen ----
  { id: "inv-tablecloth", name: "Tablecloth", category: "linen", total: 80, reserved: 15, outOnHire: 30, damaged: 2, missing: 1, reorderLevel: 10, isDemo: true },
  { id: "inv-runner", name: "Runner", category: "linen", total: 100, reserved: 15, outOnHire: 30, damaged: 1, missing: 0, reorderLevel: 10, isDemo: true },
  { id: "inv-napkin", name: "Napkin", category: "linen", total: 300, reserved: 60, outOnHire: 120, damaged: 0, missing: 0, reorderLevel: 30, isDemo: true },
  // ---- Chair covers ----
  { id: "inv-chair-cover", name: "Chair Cover", category: "chair-covers", total: 200, reserved: 40, outOnHire: 80, damaged: 3, missing: 2, reorderLevel: 20, isDemo: true },
  { id: "inv-sash", name: "Sash", category: "chair-covers", total: 150, reserved: 25, outOnHire: 50, damaged: 1, missing: 0, reorderLevel: 15, isDemo: true },
  // ---- Décor ----
  { id: "inv-led-candle", name: "LED Candle", category: "decor", total: 100, reserved: 25, outOnHire: 40, damaged: 2, missing: 0, reorderLevel: 10, isDemo: true },
  { id: "inv-vase", name: "Vase", category: "decor", total: 60, reserved: 10, outOnHire: 20, damaged: 1, missing: 0, reorderLevel: 6, isDemo: true },
  { id: "inv-table-number", name: "Table Number", category: "decor", total: 80, reserved: 12, outOnHire: 20, damaged: 2, missing: 0, reorderLevel: 8, isDemo: true },
  // ---- Backdrops ----
  { id: "inv-fabric-backdrop", name: "Fabric Backdrop", category: "backdrops", total: 10, reserved: 2, outOnHire: 4, damaged: 0, missing: 0, reorderLevel: 5, isDemo: true },
  { id: "inv-floral-wall-panel", name: "Floral Wall Panel", category: "backdrops", total: 15, reserved: 3, outOnHire: 5, damaged: 0, missing: 0, reorderLevel: 8, isDemo: true },
  // ---- Draping ----
  { id: "inv-drape-fabric", name: "Drape Fabric", category: "draping", total: 400, reserved: 80, outOnHire: 150, damaged: 0, missing: 0, reorderLevel: 50, isDemo: true },
  // ---- Centrepieces ----
  { id: "inv-floral-centrepiece", name: "Floral Centrepiece", category: "centrepieces", total: 40, reserved: 10, outOnHire: 15, damaged: 0, missing: 1, reorderLevel: 4, isDemo: true },
  { id: "inv-candle-centrepiece", name: "Candle Centrepiece", category: "centrepieces", total: 50, reserved: 8, outOnHire: 15, damaged: 1, missing: 0, reorderLevel: 5, isDemo: true },
  // ---- Serving equipment ----
  { id: "inv-serving-platter", name: "Serving Platter", category: "serving-equipment", total: 40, reserved: 8, outOnHire: 12, damaged: 1, missing: 0, reorderLevel: 4, isDemo: true },
  { id: "inv-chafing-dish", name: "Chafing Dish", category: "serving-equipment", total: 25, reserved: 5, outOnHire: 8, damaged: 0, missing: 0, reorderLevel: 3, isDemo: true }
];
const customer = (id, name, email, phone, extra) => ({
  id,
  name,
  email,
  phone,
  location: "Port Elizabeth, Eastern Cape",
  createdAt: isoDaysFromNow(-14),
  ...extra
});
const timeline = (statuses) => statuses.map((s) => ({
  status: s.status,
  at: new Date(Date.now() - s.daysAgo * 864e5).toISOString(),
  note: s.note
}));
const demoLeads = [
  {
    id: "L-1001",
    enquiryId: "E-1001",
    customer: customer("C-1001", "Thandeka Mokoena", "thandeka.mokoena@gmail.com", "+27 82 555 0123"),
    eventType: "matricFarewell",
    eventDate: isoDaysFromNow(67),
    guests: 120,
    budgetRange: "30k-60k",
    venue: "Silver Lakes Country Club",
    location: "Port Elizabeth, Eastern Cape",
    indoorOutdoor: "Indoor",
    services: ["full-setup", "draping", "crockery", "linen", "backdrop"],
    colourScheme: "Champagne & blush with gold accents",
    theme: "Elegant matric ball",
    requirements: "Full décor, draping, crockery and chair covers for 120 learners.",
    notes: "Enquiry: 'We are hosting a matric farewell for 120 learners in October and need full décor, draping, crockery and chair covers. Please send us a quote.'",
    nextAction: "Call Thandeka to confirm date and send quote.",
    status: "NEW",
    source: "WEBSITE",
    createdAt: isoDaysFromNow(-1),
    updatedAt: isoDaysFromNow(-1),
    enquiryLines: [
      { productId: "p-dinner-plate", quantity: 120 },
      { productId: "p-side-plate", quantity: 120 },
      { productId: "p-wine-glass", quantity: 120 },
      { productId: "p-fork", quantity: 120 },
      { productId: "p-knife", quantity: 120 },
      { productId: "p-spoon", quantity: 120 },
      { productId: "p-chair-cover", quantity: 120 },
      { productId: "p-napkin", quantity: 120 },
      { productId: "p-tablecloth", quantity: 15 }
    ],
    timeline: timeline([{ status: "NEW", daysAgo: 1, note: "Enquiry received via website" }]),
    isDemo: true
  },
  {
    id: "L-1002",
    enquiryId: "E-1002",
    customer: customer("C-1002", "Sarah van der Merwe", "sarah.vdm@gmail.com", "+27 84 555 0144"),
    eventType: "wedding",
    eventDate: isoDaysFromNow(45),
    guests: 120,
    budgetRange: "60k-100k",
    venue: "The Ridge, Muldersdrift",
    indoorOutdoor: "Indoor & outdoor",
    services: ["full-setup", "floral", "crockery", "linen"],
    colourScheme: "White-and-blush palette",
    theme: "Romantic classic",
    requirements: "Gold chair covers requested; full setup including florals.",
    notes: "Loves white-and-blush palette; gold chair covers requested.",
    nextAction: "Confirm final florals with Sarah by Friday.",
    status: "QUALIFIED",
    source: "WEBSITE",
    createdAt: isoDaysFromNow(-14),
    updatedAt: isoDaysFromNow(-8),
    timeline: timeline([
      { status: "NEW", daysAgo: 14, note: "Enquiry received via website" },
      { status: "QUALIFIED", daysAgo: 8, note: "Qualified — budget confirmed 60k–100k" }
    ]),
    isDemo: true
  },
  {
    id: "L-1003",
    customer: customer("C-1003", "Naledi Dlamini", "naledi.dlamini@gmail.com", "+27 83 555 0155"),
    eventType: "birthday",
    eventDate: isoDaysFromNow(20),
    guests: 50,
    budgetRange: "15k-30k",
    venue: "Home garden, Port Elizabeth, Eastern Cape",
    indoorOutdoor: "Outdoor",
    services: ["intimate", "crockery", "delivery"],
    colourScheme: "Pastels",
    theme: "Garden tea party",
    notes: "Mum's 60th — garden setup, pastel colours.",
    nextAction: "Follow up — client deciding between two setup options.",
    status: "FOLLOW_UP",
    source: "WHATSAPP",
    createdAt: isoDaysFromNow(-9),
    updatedAt: isoDaysFromNow(-2),
    timeline: timeline([
      { status: "NEW", daysAgo: 9, note: "Enquiry via WhatsApp" },
      { status: "QUALIFIED", daysAgo: 6, note: "Budget 15k–30k confirmed" },
      { status: "FOLLOW_UP", daysAgo: 2, note: "Awaiting decision on setup options" }
    ]),
    isDemo: true
  },
  {
    id: "L-1004",
    enquiryId: "E-1003",
    customer: customer(
      "C-1004",
      "Lindiwe Nkosi",
      "lindiwe.nkosi@vertexholdings.co.za",
      "+27 82 555 0134",
      { company: "Vertex Holdings" }
    ),
    eventType: "corporate",
    eventDate: isoDaysFromNow(90),
    guests: 250,
    budgetRange: "100k-plus",
    venue: "Emperors Palace",
    indoorOutdoor: "Indoor",
    services: ["corporate", "backdrops", "draping"],
    colourScheme: "Corporate navy & gold",
    theme: "Gala awards",
    requirements: "Stage backdrop + ceiling draping for 250 guests.",
    notes: "Year-end gala at Emperors Palace; stage backdrop + ceiling draping.",
    nextAction: "Chase decision on quote Q-1002.",
    status: "QUOTE_SENT",
    source: "WEBSITE",
    createdAt: isoDaysFromNow(-12),
    updatedAt: isoDaysFromNow(-3),
    timeline: timeline([
      { status: "NEW", daysAgo: 12, note: "Corporate enquiry via website" },
      { status: "QUALIFIED", daysAgo: 10, note: "Approved as vendor" },
      { status: "QUOTE_SENT", daysAgo: 3, note: "Quote Q-1002 sent" }
    ]),
    isDemo: true
  },
  {
    id: "L-1005",
    customer: customer("C-1005", "Ayanda Khumalo", "ayanda.khumalo@gmail.com", "+27 81 555 0177"),
    eventType: "matricFarewell",
    eventDate: isoDaysFromNow(60),
    guests: 180,
    budgetRange: "30k-60k",
    venue: "Riverside Lodge, Centurion",
    services: ["full-setup", "draping", "crockery", "linen"],
    colourScheme: "Champagne & dessert tones",
    notes: "Booked — deposit paid, awaiting balance.",
    status: "BOOKED",
    source: "REFERRAL",
    createdAt: isoDaysFromNow(-21),
    updatedAt: isoDaysFromNow(-6),
    timeline: timeline([
      { status: "NEW", daysAgo: 21, note: "Referral from previous client" },
      { status: "QUOTE_SENT", daysAgo: 12, note: "Quote Q-1001 sent" },
      { status: "BOOKED", daysAgo: 6, note: "Accepted — booking B-1001 created" }
    ]),
    isDemo: true
  },
  {
    id: "L-1006",
    customer: customer("C-1006", "Priya Naidoo", "priya.naidoo@gmail.com", "+27 76 555 0188"),
    eventType: "engagement",
    eventDate: isoDaysFromNow(30),
    guests: 80,
    budgetRange: "30k-60k",
    venue: "La Vie en Rose, Port Elizabeth, Eastern Cape",
    indoorOutdoor: "Indoor",
    services: ["draping", "floral", "crockery"],
    colourScheme: "Rose gold & ivory",
    notes: "Engagement party — needs a follow-up call this week.",
    nextAction: "Call Priya this week re: quote decision.",
    status: "FOLLOW_UP",
    source: "PHONE",
    createdAt: isoDaysFromNow(-5),
    updatedAt: isoDaysFromNow(-1),
    timeline: timeline([
      { status: "NEW", daysAgo: 5, note: "Phone enquiry" },
      { status: "FOLLOW_UP", daysAgo: 1, note: "Quote sent — awaiting decision" }
    ]),
    isDemo: true
  },
  {
    id: "L-1007",
    customer: customer("C-1007", "Riaan & Elsie van Wyk", "elsie.vanwyk@gmail.com", "+27 72 555 0199"),
    eventType: "wedding",
    eventDate: isoDaysFromNow(14),
    guests: 200,
    budgetRange: "100k-plus",
    notes: "Large wedding — qualification call scheduled.",
    nextAction: "Qualification call scheduled.",
    status: "NEW",
    source: "WHATSAPP",
    createdAt: isoDaysFromNow(-1),
    updatedAt: isoDaysFromNow(-1),
    timeline: timeline([{ status: "NEW", daysAgo: 1, note: "Enquiry via WhatsApp" }]),
    isDemo: true
  },
  {
    id: "L-1008",
    enquiryId: "E-1002",
    customer: customer("C-1008", "Michael Okafor", "m.okafor@apextech.com", "+27 83 555 0178", {
      company: "Apex Tech"
    }),
    eventType: "productLaunch",
    eventDate: isoDaysFromNow(75),
    guests: 150,
    budgetRange: "60k-100k",
    venue: "Sandton Convention Centre",
    services: ["backdrops", "draping", "corporate"],
    notes: "Went with another supplier — keep on mailing list.",
    status: "LOST",
    source: "WEBSITE",
    createdAt: isoDaysFromNow(-30),
    updatedAt: isoDaysFromNow(-20),
    timeline: timeline([
      { status: "NEW", daysAgo: 30, note: "Enquiry via website" },
      { status: "QUOTE_SENT", daysAgo: 22, note: "Quote Q-1004 sent" },
      { status: "LOST", daysAgo: 20, note: "Chose another supplier" }
    ]),
    isDemo: true
  },
  // ---- Historical leads (feed the monthly enquiry series + bookings) ----
  {
    id: "L-1009",
    customer: customer("C-1011", "Zanele Mthembu", "zanele.mthembu@gmail.com", "+27 82 555 0211"),
    eventType: "wedding",
    eventDate: isoDaysFromNow(-135),
    guests: 150,
    budgetRange: "30k-60k",
    venue: "Tzaneen Country Lodge",
    services: ["full-setup", "floral", "linen"],
    notes: "Completed wedding — gold and ivory theme.",
    status: "BOOKED",
    source: "REFERRAL",
    createdAt: isoDaysFromNow(-150),
    updatedAt: isoDaysFromNow(-135),
    isDemo: true
  },
  {
    id: "L-1010",
    customer: customer("C-1012", "Kagiso Marlin", "kagiso@marvinlogistics.co.za", "+27 83 555 0222", {
      company: "Marvin Logistics"
    }),
    eventType: "corporate",
    eventDate: isoDaysFromNow(-105),
    guests: 120,
    budgetRange: "15k-30k",
    venue: "Birchwood Hotel",
    services: ["corporate", "draping"],
    notes: "Completed staff function.",
    status: "BOOKED",
    source: "WEBSITE",
    createdAt: isoDaysFromNow(-120),
    updatedAt: isoDaysFromNow(-105),
    isDemo: true
  },
  {
    id: "L-1011",
    customer: customer("C-1013", "Lebo Mokoena", "lebo.mokoena@gmail.com", "+27 84 555 0233"),
    eventType: "bridalShower",
    eventDate: isoDaysFromNow(-80),
    guests: 40,
    budgetRange: "5k-10k",
    venue: "Rosebank rooftop venue",
    services: ["intimate", "floral", "crockery"],
    notes: "Completed bridal shower — blush florals.",
    status: "BOOKED",
    source: "WHATSAPP",
    createdAt: isoDaysFromNow(-95),
    updatedAt: isoDaysFromNow(-80),
    isDemo: true
  },
  {
    id: "L-1012",
    customer: customer("C-1014", "Dr Nomsa Ndlovu", "nomsa.ndlovu@sahc.org.za", "+27 82 555 0244", {
      company: "SA Health Council"
    }),
    eventType: "conference",
    eventDate: isoDaysFromNow(-50),
    guests: 300,
    budgetRange: "60k-100k",
    venue: "Sandton Convention Centre",
    services: ["corporate", "backdrops", "draping"],
    notes: "Completed conference build.",
    status: "BOOKED",
    source: "WEBSITE",
    createdAt: isoDaysFromNow(-65),
    updatedAt: isoDaysFromNow(-50),
    isDemo: true
  }
];
const demoNotifications = [
  {
    id: "N-1001",
    type: "lead",
    title: "New enquiry received",
    message: "Thandeka Mokoena — Matric Farewell, 120 guests, October.",
    read: false,
    createdAt: isoDaysFromNow(0),
    isDemo: true
  },
  {
    id: "N-1002",
    type: "inventory",
    title: "Low stock alert",
    message: "Fabric Backdrop and Floral Wall Panel are at or below reorder level.",
    read: false,
    createdAt: isoDaysFromNow(-1),
    isDemo: true
  },
  {
    id: "N-1003",
    type: "booking",
    title: "Deposit outstanding",
    message: "B-1001 Riverside Matric Farewell — R21 400 balance due.",
    read: false,
    createdAt: isoDaysFromNow(-2),
    isDemo: true
  }
];
const item = (id, type, refId, name, quantity, unitPrice) => ({ id, type, refId, name, quantity, unitPrice, lineTotal: quantity * unitPrice });
const demoQuotes = [
  {
    id: "Q-1001",
    leadId: "L-1005",
    customerId: "C-1005",
    items: [
      item("QI-101", "product", "p-dinner-plate", "Dinner Plate", 180, 28),
      item("QI-102", "product", "p-wine-glass", "Wine Glass", 180, 18),
      item("QI-103", "product", "p-fork", "Fork", 180, 8),
      item("QI-104", "product", "p-knife", "Knife", 180, 8),
      item("QI-105", "product", "p-spoon", "Spoon", 180, 8),
      item("QI-106", "product", "p-chair-cover", "Chair Cover", 180, 22),
      item("QI-107", "product", "p-napkin", "Napkin", 180, 12),
      item("QI-108", "product", "p-tablecloth", "Tablecloth", 30, 150),
      item("QI-109", "service", "table-styling", "Table Styling", 1, 1500)
    ],
    subtotal: 24720,
    deliveryFee: 1680,
    discount: 0,
    total: 26400,
    status: "SENT",
    notes: "Matric farewell package — champagne and dessert colours.",
    validUntil: isoDaysFromNow(14),
    createdAt: isoDaysFromNow(-6),
    isDemo: true
  },
  {
    id: "Q-1002",
    leadId: "L-1004",
    customerId: "C-1004",
    items: [
      item("QI-201", "product", "p-banquet-table", "Banquet Table", 40, 150),
      item("QI-202", "product", "p-round-table", "Round Table", 20, 250),
      item("QI-203", "product", "p-banquet-chair", "Banquet Chair", 250, 45),
      item("QI-204", "product", "p-tablecloth", "Tablecloth", 40, 150),
      item("QI-205", "product", "p-drape-fabric", "Drape Fabric", 300, 45),
      item("QI-206", "product", "p-fabric-backdrop", "Fabric Backdrop", 2, 650),
      item("QI-207", "service", "corporate", "Corporate Events", 1, 1e4)
    ],
    subtotal: 53050,
    deliveryFee: 2500,
    discount: 0,
    total: 55550,
    status: "DRAFT",
    notes: "Draft — awaiting client confirmation on colour scheme.",
    validUntil: isoDaysFromNow(21),
    createdAt: isoDaysFromNow(-3),
    isDemo: true
  },
  {
    id: "Q-1003",
    leadId: "L-1002",
    customerId: "C-1002",
    items: [
      item("QI-301", "product", "p-dinner-plate", "Dinner Plate", 120, 28),
      item("QI-302", "product", "p-side-plate", "Side Plate", 120, 18),
      item("QI-303", "product", "p-wine-glass", "Wine Glass", 120, 18),
      item("QI-304", "product", "p-champagne-glass", "Champagne Glass", 60, 20),
      item("QI-305", "product", "p-fork", "Fork", 120, 8),
      item("QI-306", "product", "p-knife", "Knife", 120, 8),
      item("QI-307", "product", "p-spoon", "Spoon", 120, 8),
      item("QI-308", "product", "p-chair-cover", "Chair Cover", 120, 22),
      item("QI-309", "product", "p-tablecloth", "Tablecloth", 24, 150),
      item("QI-310", "product", "p-napkin", "Napkin", 120, 12),
      item("QI-311", "product", "p-floral-centrepiece", "Floral Centrepiece", 12, 180),
      item("QI-312", "service", "full-setup", "Full Event Setup", 1, 15e3)
    ],
    subtotal: 36600,
    deliveryFee: 1900,
    discount: 0,
    total: 38500,
    status: "SENT",
    notes: "White-and-blush wedding package at The Ridge.",
    validUntil: isoDaysFromNow(14),
    createdAt: isoDaysFromNow(-8),
    isDemo: true
  },
  {
    id: "Q-1004",
    leadId: "L-1008",
    customerId: "C-1008",
    items: [
      item("QI-401", "product", "p-floral-wall-panel", "Floral Wall Panel", 8, 450),
      item("QI-402", "product", "p-fabric-backdrop", "Fabric Backdrop", 2, 650),
      item("QI-403", "product", "p-led-candle", "LED Candle", 50, 35),
      item("QI-404", "product", "p-cocktail-table", "Cocktail Table", 15, 120),
      item("QI-405", "product", "p-folding-chair", "Folding Chair", 100, 25),
      item("QI-406", "product", "p-chafing-dish", "Chafing Dish", 10, 120),
      item("QI-407", "product", "p-tablecloth", "Tablecloth", 20, 150)
    ],
    subtotal: 15150,
    deliveryFee: 1800,
    discount: 0,
    total: 16950,
    status: "DECLINED",
    notes: "Client chose another supplier.",
    createdAt: isoDaysFromNow(-20),
    isDemo: true
  }
];
const initialData = {
  leads: demoLeads,
  quotes: demoQuotes,
  bookings: demoBookings,
  inventory: demoInventory,
  events: demoEvents,
  enquiryList: [],
  notifications: demoNotifications
};
const useStore = create()(
  persist(
    (set) => ({
      ...initialData,
      addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
      updateLead: (id, patch) => set((s) => ({
        leads: s.leads.map(
          (l) => l.id === id ? { ...l, ...patch, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : l
        )
      })),
      addQuote: (quote) => set((s) => ({ quotes: [quote, ...s.quotes] })),
      updateQuote: (id, patch) => set((s) => ({ quotes: s.quotes.map((q) => q.id === id ? { ...q, ...patch } : q) })),
      addBooking: (booking) => set((s) => ({ bookings: [booking, ...s.bookings] })),
      updateBooking: (id, patch) => set((s) => ({
        bookings: s.bookings.map((b) => b.id === id ? { ...b, ...patch } : b)
      })),
      updateInventoryItem: (id, patch) => set((s) => ({
        inventory: s.inventory.map((i) => i.id === id ? { ...i, ...patch } : i)
      })),
      addToEnquiry: (productId, quantity) => set((s) => {
        const existing = s.enquiryList.find((l) => l.productId === productId);
        if (existing) {
          return {
            enquiryList: s.enquiryList.map(
              (l) => l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l
            )
          };
        }
        return { enquiryList: [...s.enquiryList, { productId, quantity }] };
      }),
      updateEnquiryLine: (productId, quantity) => set((s) => ({
        enquiryList: s.enquiryList.map(
          (l) => l.productId === productId ? { ...l, quantity } : l
        )
      })),
      removeFromEnquiry: (productId) => set((s) => ({ enquiryList: s.enquiryList.filter((l) => l.productId !== productId) })),
      clearEnquiry: () => set({ enquiryList: [] }),
      addNotification: (notification) => set((s) => ({ notifications: [notification, ...s.notifications] })),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      resetDemoData: () => set({
        leads: demoLeads.map((l) => ({ ...l })),
        quotes: demoQuotes.map((q) => ({ ...q })),
        bookings: demoBookings.map((b) => ({ ...b })),
        inventory: demoInventory.map((i) => ({ ...i })),
        events: demoEvents.map((e) => ({ ...e })),
        enquiryList: [],
        notifications: demoNotifications.map((n) => ({ ...n }))
      })
    }),
    {
      name: "inspire-decor-store",
      // v2: seed data changed (matric-farewell lead + structured lead fields) —
      // discard any v1 localStorage so returning visitors get the new seed.
      version: 2,
      // localStorage is unavailable during SSR — zustand falls back to a no-op
      // storage on the server, so this is safe in the TanStack Start pipeline.
      storage: createJSONStorage(() => localStorage),
      // Persist data only (functions are excluded automatically, but be explicit).
      partialize: (s) => ({
        leads: s.leads,
        quotes: s.quotes,
        bookings: s.bookings,
        inventory: s.inventory,
        events: s.events,
        enquiryList: s.enquiryList,
        notifications: s.notifications
      })
    }
  )
);
export {
  demoInventory as d,
  useStore as u
};
