/**
 * Demo gallery images (isDemo: true). Images are Unsplash sample photos —
 * the `Img` component falls back to a styled placeholder when a URL fails or
 * is absent, so the gallery renders gracefully offline.
 */
import type { GalleryItem } from "~/lib/types";
import { IMG } from "~/lib/images";

export const demoGallery: GalleryItem[] = [
  {
    id: "g-1001",
    image: IMG.gardenTable,
    caption: "Garden wedding table setting",
    category: "Weddings",
    isDemo: true,
  },
  {
    id: "g-1002",
    image: IMG.champagne,
    caption: "Champagne glassware ready for the toast",
    category: "Weddings",
    isDemo: true,
  },
  {
    id: "g-1003",
    image: IMG.galaChairs,
    caption: "White and gold chair covers at a gala",
    category: "Corporate",
    isDemo: true,
  },
  {
    id: "g-1004",
    image: IMG.drapedCeiling,
    caption: "Draped ceiling with warm uplighting",
    category: "Draping",
    isDemo: true,
  },
  {
    id: "g-1005",
    image: IMG.floralBackdrop,
    caption: "Floral backdrop for the photo moment",
    category: "Backdrops",
    isDemo: true,
  },
  {
    id: "g-1006",
    image: IMG.corporateGala,
    caption: "Corporate gala tables in full style",
    category: "Corporate",
    isDemo: true,
  },
  {
    id: "g-1007",
    image: IMG.centrepiece,
    caption: "Centrepiece arrangement for a 60th",
    category: "Birthdays",
    isDemo: true,
  },
  {
    id: "g-1008",
    image: IMG.matricStage,
    caption: "Matric farewell stage setup",
    category: "Matric Farewells",
    isDemo: true,
  },
  {
    id: "g-1009",
    image: IMG.weddingTable,
    caption: "Full table styling for a winter wedding",
    category: "Weddings",
    isDemo: true,
  },
  {
    id: "g-1010",
    image: IMG.weddingFlorals,
    caption: "Floral runners and taper candles",
    category: "Styling",
    isDemo: true,
  },
  {
    id: "g-1011",
    image: IMG.banquetTables,
    caption: "Banquet layout for a conference dinner",
    category: "Corporate",
    isDemo: true,
  },
  {
    id: "g-1012",
    image: IMG.birthdayParty,
    caption: "Birthday celebration styled in gold",
    category: "Birthdays",
    isDemo: true,
  },
  {
    id: "g-1013",
    image: IMG.candleTable,
    caption: "Candle-lit intimate dinner styling",
    category: "Styling",
    isDemo: true,
  },
  {
    id: "g-1014",
    image: IMG.weddingReception,
    caption: "Reception room with Tiffany chairs",
    category: "Weddings",
    isDemo: true,
  },
  {
    id: "g-1015",
    image: IMG.conferenceRoom,
    caption: "Boardroom-style corporate setup",
    category: "Corporate",
    isDemo: true,
  },
  {
    id: "g-1016",
    image: IMG.fineDining,
    caption: "Place settings with wine glassware",
    category: "Styling",
    isDemo: true,
  },
];
