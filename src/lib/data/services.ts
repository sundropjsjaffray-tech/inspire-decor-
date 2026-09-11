/**
 * Demo service offerings — the 10 services advertised on the Services page.
 * `startingPrice: null` means the price is quoted per event ("Custom Quote").
 * Images are Unsplash sample photos (graceful placeholder fallback).
 */
import type { Service } from "~/lib/types";
import { IMG } from "~/lib/images";

export const demoServices: Service[] = [
  {
    id: "full-setup",
    name: "Full Event Setup",
    description:
      "End-to-end event design, décor, styling and on-site management — one team from load-in to breakdown.",
    startingPrice: null,
    priceLabel: "Custom Quote",
    image: IMG.weddingTable,
    featured: true,
    isDemo: true,
  },
  {
    id: "draping",
    name: "Draping",
    description:
      "Soft ceiling and wall draping that transforms any venue into a warm, elegant space.",
    startingPrice: 45,
    priceLabel: "from R45 per metre",
    image: IMG.drapedCeiling,
    featured: true,
    isDemo: true,
  },
  {
    id: "table-styling",
    name: "Table Styling",
    description:
      "Linen, crockery, glassware and centrepieces styled to your theme and colour palette.",
    startingPrice: 120,
    priceLabel: "from R120 per table",
    image: IMG.banquetTables,
    isDemo: true,
  },
  {
    id: "floral",
    name: "Floral Décor",
    description:
      "Fresh and artificial floral arrangements for tables, arches, stages and backdrops.",
    startingPrice: null,
    priceLabel: "Custom Quote",
    image: IMG.weddingFlorals,
    isDemo: true,
  },
  {
    id: "backdrops",
    name: "Backdrops",
    description:
      "Fabric, floral and custom backdrops for stages, head tables and photo moments.",
    startingPrice: 650,
    priceLabel: "from R650 per backdrop",
    image: IMG.floralBackdrop,
    isDemo: true,
  },
  {
    id: "crockery",
    name: "Crockery & Glassware",
    description:
      "Complete crockery, cutlery and glassware hire — plated, set and polished per guest setting.",
    startingPrice: 45,
    priceLabel: "from R45 per guest setting",
    image: IMG.whitePlates,
    isDemo: true,
  },
  {
    id: "linen",
    name: "Linen & Chair Décor",
    description:
      "Tablecloths, runners, napkins, chair covers and sashes in a full colour range.",
    startingPrice: 150,
    priceLabel: "from R150 per tablecloth",
    image: IMG.restaurantTable,
    isDemo: true,
  },
  {
    id: "corporate",
    name: "Corporate Events",
    description:
      "Conferences, year-end functions, product launches and staff events — planned and delivered.",
    startingPrice: null,
    priceLabel: "Custom Quote",
    image: IMG.corporateGala,
    featured: true,
    isDemo: true,
  },
  {
    id: "intimate",
    name: "Intimate Events",
    description:
      "Small gatherings of 30 guests or fewer, styled with the same care as a grand wedding.",
    startingPrice: 1500,
    priceLabel: "from R1 500",
    image: IMG.dinnerCandles,
    isDemo: true,
  },
  {
    id: "delivery",
    name: "Delivery & Setup",
    description:
      "Delivery, setup, styling and breakdown across Gauteng — you relax, we handle the rest.",
    startingPrice: 750,
    priceLabel: "from R750",
    image: IMG.weddingVenue,
    isDemo: true,
  },
];
