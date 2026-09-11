import { i as isoDaysFromNow, d as delay } from "./util-D5Y4JTPp.js";
import { I as IMG } from "./products-BpU3TxX9.js";
import { d as demoContactDetails, a as demoDifferentiators } from "./site-c9x3VlSs.js";
const demoGallery = [
  {
    id: "g-1001",
    image: IMG.gardenTable,
    caption: "Garden wedding table setting",
    category: "Weddings",
    isDemo: true
  },
  {
    id: "g-1002",
    image: IMG.champagne,
    caption: "Champagne glassware ready for the toast",
    category: "Weddings",
    isDemo: true
  },
  {
    id: "g-1003",
    image: IMG.galaChairs,
    caption: "White and gold chair covers at a gala",
    category: "Corporate",
    isDemo: true
  },
  {
    id: "g-1004",
    image: IMG.drapedCeiling,
    caption: "Draped ceiling with warm uplighting",
    category: "Draping",
    isDemo: true
  },
  {
    id: "g-1005",
    image: IMG.floralBackdrop,
    caption: "Floral backdrop for the photo moment",
    category: "Backdrops",
    isDemo: true
  },
  {
    id: "g-1006",
    image: IMG.corporateGala,
    caption: "Corporate gala tables in full style",
    category: "Corporate",
    isDemo: true
  },
  {
    id: "g-1007",
    image: IMG.centrepiece,
    caption: "Centrepiece arrangement for a 60th",
    category: "Birthdays",
    isDemo: true
  },
  {
    id: "g-1008",
    image: IMG.matricStage,
    caption: "Matric farewell stage setup",
    category: "Matric Farewells",
    isDemo: true
  },
  {
    id: "g-1009",
    image: IMG.weddingTable,
    caption: "Full table styling for a winter wedding",
    category: "Weddings",
    isDemo: true
  },
  {
    id: "g-1010",
    image: IMG.weddingFlorals,
    caption: "Floral runners and taper candles",
    category: "Styling",
    isDemo: true
  },
  {
    id: "g-1011",
    image: IMG.banquetTables,
    caption: "Banquet layout for a conference dinner",
    category: "Corporate",
    isDemo: true
  },
  {
    id: "g-1012",
    image: IMG.birthdayParty,
    caption: "Birthday celebration styled in gold",
    category: "Birthdays",
    isDemo: true
  },
  {
    id: "g-1013",
    image: IMG.candleTable,
    caption: "Candle-lit intimate dinner styling",
    category: "Styling",
    isDemo: true
  },
  {
    id: "g-1014",
    image: IMG.weddingReception,
    caption: "Reception room with Tiffany chairs",
    category: "Weddings",
    isDemo: true
  },
  {
    id: "g-1015",
    image: IMG.conferenceRoom,
    caption: "Boardroom-style corporate setup",
    category: "Corporate",
    isDemo: true
  },
  {
    id: "g-1016",
    image: IMG.fineDining,
    caption: "Place settings with wine glassware",
    category: "Styling",
    isDemo: true
  }
];
const demoServices = [
  {
    id: "full-setup",
    name: "Full Event Setup",
    description: "End-to-end event design, décor, styling and on-site management — one team from load-in to breakdown.",
    startingPrice: null,
    priceLabel: "Custom Quote",
    image: IMG.weddingTable,
    featured: true,
    isDemo: true
  },
  {
    id: "draping",
    name: "Draping",
    description: "Soft ceiling and wall draping that transforms any venue into a warm, elegant space.",
    startingPrice: 45,
    priceLabel: "from R45 per metre",
    image: IMG.drapedCeiling,
    featured: true,
    isDemo: true
  },
  {
    id: "table-styling",
    name: "Table Styling",
    description: "Linen, crockery, glassware and centrepieces styled to your theme and colour palette.",
    startingPrice: 120,
    priceLabel: "from R120 per table",
    image: IMG.banquetTables,
    isDemo: true
  },
  {
    id: "floral",
    name: "Floral Décor",
    description: "Fresh and artificial floral arrangements for tables, arches, stages and backdrops.",
    startingPrice: null,
    priceLabel: "Custom Quote",
    image: IMG.weddingFlorals,
    isDemo: true
  },
  {
    id: "backdrops",
    name: "Backdrops",
    description: "Fabric, floral and custom backdrops for stages, head tables and photo moments.",
    startingPrice: 650,
    priceLabel: "from R650 per backdrop",
    image: IMG.floralBackdrop,
    isDemo: true
  },
  {
    id: "crockery",
    name: "Crockery & Glassware",
    description: "Complete crockery, cutlery and glassware hire — plated, set and polished per guest setting.",
    startingPrice: 45,
    priceLabel: "from R45 per guest setting",
    image: IMG.whitePlates,
    isDemo: true
  },
  {
    id: "linen",
    name: "Linen & Chair Décor",
    description: "Tablecloths, runners, napkins, chair covers and sashes in a full colour range.",
    startingPrice: 150,
    priceLabel: "from R150 per tablecloth",
    image: IMG.restaurantTable,
    isDemo: true
  },
  {
    id: "corporate",
    name: "Corporate Events",
    description: "Conferences, year-end functions, product launches and staff events — planned and delivered.",
    startingPrice: null,
    priceLabel: "Custom Quote",
    image: IMG.corporateGala,
    featured: true,
    isDemo: true
  },
  {
    id: "intimate",
    name: "Intimate Events",
    description: "Small gatherings of 30 guests or fewer, styled with the same care as a grand wedding.",
    startingPrice: 1500,
    priceLabel: "from R1 500",
    image: IMG.dinnerCandles,
    isDemo: true
  },
  {
    id: "delivery",
    name: "Delivery & Setup",
    description: "Delivery, setup, styling and breakdown across Gauteng — you relax, we handle the rest.",
    startingPrice: 750,
    priceLabel: "from R750",
    image: IMG.weddingVenue,
    isDemo: true
  }
];
const demoTestimonials = [
  {
    id: "t-1001",
    clientName: "Thandi M.",
    eventType: "Matric Farewell",
    quote: "The venue looked absolutely stunning — the draping and table styling blew everyone away. Parents couldn't stop taking photos.",
    rating: 5,
    eventDate: "2025-10-18",
    isDemo: true
  },
  {
    id: "t-1002",
    clientName: "Sarah & James V.",
    eventType: "Wedding",
    quote: "From the first quote to the last plate collected, everything was seamless. Our 120-guest wedding ran like clockwork.",
    rating: 5,
    eventDate: "2026-03-07",
    isDemo: true
  },
  {
    id: "t-1003",
    clientName: "Lindiwe N. — Vertex Holdings",
    eventType: "Year-End Function",
    quote: "250 guests, a full gala setup, and zero stress on our side. INSPIRE DECOR delivered exactly what they promised.",
    rating: 5,
    eventDate: "2025-12-05",
    isDemo: true
  },
  {
    id: "t-1004",
    clientName: "Kagiso M.",
    eventType: "40th Birthday",
    quote: "Beautiful, affordable and on time. The crockery and glassware hire made the party feel five-star.",
    rating: 4.5,
    eventDate: "2026-06-20",
    isDemo: true
  }
];
const demoCorporateEventTypes = [
  {
    id: "corporate-function",
    name: "Corporate Functions",
    description: "Elegant décor and full setup for company functions of any size.",
    image: IMG.corporateToast,
    isDemo: true
  },
  {
    id: "year-end",
    name: "Year-End Events",
    description: "Gala dinners and year-end parties that reward your team in style.",
    image: IMG.corporateGala,
    isDemo: true
  },
  {
    id: "product-launch",
    name: "Product Launches",
    description: "Stage, backdrop, lighting and styling that make the launch memorable.",
    image: IMG.floralBackdrop,
    isDemo: true
  },
  {
    id: "staff-function",
    name: "Staff Functions",
    description: "Relaxed, polished setups for staff days and family days.",
    image: IMG.birthdayParty,
    isDemo: true
  },
  {
    id: "conference",
    name: "Conferences",
    description: "Registration, seating, staging and refreshment areas, end to end.",
    image: IMG.conferenceRoom,
    isDemo: true
  },
  {
    id: "awards",
    name: "Awards Ceremonies",
    description: "Red-carpet styling, table décor and staging for award evenings.",
    image: IMG.eventHall,
    isDemo: true
  },
  {
    id: "networking",
    name: "Networking Events",
    description: "Cocktail-style layouts with high tables, glassware and grazing flow.",
    image: IMG.networking,
    isDemo: true
  },
  {
    id: "brand-activation",
    name: "Brand Activations",
    description: "Pop-up styling and hire equipment for activations and roadshows.",
    image: IMG.confetti,
    isDemo: true
  }
];
const demoCorporateBenefits = [
  {
    id: "cb-1",
    title: "Reliability you can plan around",
    description: "Deliveries, setups and breakdowns on a signed schedule — your event runs on time because we plan it that way.",
    isDemo: true
  },
  {
    id: "cb-2",
    title: "Scale for 20 to 2,000 guests",
    description: "Warehouse stock of tables, chairs, crockery and linen means large events are never 'sourced' at the last minute.",
    isDemo: true
  },
  {
    id: "cb-3",
    title: "One supplier, one invoice",
    description: "Décor, hire equipment, styling and setup from a single team — fewer vendors, fewer risks, one accountable partner.",
    isDemo: true
  },
  {
    id: "cb-4",
    title: "Branded, on-brand styling",
    description: "Colour schemes and signage-style décor matched to your brand guidelines for launches, conferences and awards.",
    isDemo: true
  }
];
[
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
    isDemo: true
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
    isDemo: true
  }
];
async function getServices() {
  await delay(200);
  return demoServices;
}
async function getGallery() {
  await delay(200);
  return demoGallery;
}
async function getTestimonials() {
  await delay(200);
  return demoTestimonials;
}
async function getCorporateEventTypes() {
  await delay(200);
  return demoCorporateEventTypes;
}
async function getCorporateBenefits() {
  await delay(200);
  return demoCorporateBenefits;
}
async function getContactDetails() {
  await delay(200);
  return demoContactDetails;
}
async function getDifferentiators() {
  await delay(200);
  return demoDifferentiators;
}
export {
  getGallery as a,
  getCorporateEventTypes as b,
  getCorporateBenefits as c,
  getContactDetails as d,
  getTestimonials as e,
  getDifferentiators as f,
  getServices as g
};
