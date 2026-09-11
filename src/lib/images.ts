/**
 * Unsplash image URL helper.
 *
 * Presentation-only: used by data modules (product/category/service/gallery
 * images) and page banners. The `Img` component falls back to a styled
 * placeholder if a URL fails, so a dead photo never breaks a page.
 */
export function unsplash(id: string, w = 900): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
}

/**
 * Curated, category-level photography. IDs are stable Unsplash photos; a small
 * set is reused across products within a category (a realistic catalogue look).
 */
export const IMG = {
  // Weddings / tables / styling
  gardenTable: unsplash("1464366400600-7168b8af9bc3"),
  weddingTable: unsplash("1519741497674-611481863552"),
  weddingFlorals: unsplash("1510076857177-7470076d4098"),
  banquetTables: unsplash("1469371670807-013ccf25f16a"),
  weddingVenue: unsplash("1507504031003-b417219a0fde"),
  weddingReception: unsplash("1523580494863-6f3031224c94"),
  galaChairs: unsplash("1519167758481-83f550bb49b3"),
  eventHall: unsplash("1564013799919-ab600027ffc6"),
  // Glassware / dining
  champagne: unsplash("1519225421980-715cb0215aed"),
  fineDining: unsplash("1470337458703-46ad1756a187"),
  restaurantTable: unsplash("1414235077428-338989a2e8c0"),
  platedFood: unsplash("1555244162-803834f70033"),
  foodPlate: unsplash("1504674900247-0877df9cc836"),
  whitePlates: unsplash("1543002588-bfa74002ed7e"),
  dinnerCandles: unsplash("1518780664697-55e3ad937233"),
  // Décor / draping / backdrops
  drapedCeiling: unsplash("1478146896981-b80fe463b330"),
  floralBackdrop: unsplash("1530103862676-de8c9debad1d"),
  centrepiece: unsplash("1492684223066-81342ee5ff30"),
  candleTable: unsplash("1533090481720-856c6e3c1fdc"),
  // Corporate
  corporateGala: unsplash("1511795409834-ef04bbd61622"),
  corporateToast: unsplash("1511285560929-80b456fea0bc"),
  conferenceRoom: unsplash("1517245386807-bb43f82c33c4"),
  conferenceAudience: unsplash("1540575467063-178a50c2df87"),
  conferenceStage: unsplash("1505373877841-8d25f7d46678"),
  conferenceCrowd: unsplash("1475721027785-f74eccf877e2"),
  networking: unsplash("1529156069898-49953e39b3ac"),
  // Celebrations
  birthdayParty: unsplash("1511578314322-379afb476865"),
  confetti: unsplash("1496337589254-7e19d01cec44"),
  matricStage: unsplash("1519671482749-fd09be7ccebf"),
  kitchenPrep: unsplash("1556911220-bff31c812dba"),
} as const;
