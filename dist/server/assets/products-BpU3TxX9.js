import { b as availableCount, d as delay } from "./util-D5Y4JTPp.js";
import { d as demoInventory } from "./index-DpiVUCS0.js";
function unsplash(id, w = 900) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
}
const IMG = {
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
  networking: unsplash("1529156069898-49953e39b3ac"),
  // Celebrations
  birthdayParty: unsplash("1511578314322-379afb476865"),
  confetti: unsplash("1496337589254-7e19d01cec44"),
  matricStage: unsplash("1519671482749-fd09be7ccebf"),
  kitchenPrep: unsplash("1556911220-bff31c812dba")
};
const stockByName = new Map(demoInventory.map((item) => [item.name, item]));
function qty(name) {
  const item = stockByName.get(name);
  return item ? availableCount(item) : 0;
}
const demoCategories = [
  { id: "crockery", name: "Crockery", description: "Plates, bowls and saucers in classic white porcelain.", image: IMG.whitePlates },
  { id: "cutlery", name: "Cutlery", description: "Fork, knife and spoon sets for every table setting.", image: IMG.fineDining },
  { id: "glassware", name: "Glassware", description: "Wine, champagne and tumbler glasses for any occasion.", image: IMG.champagne },
  { id: "tables", name: "Tables", description: "Banquet, round and cocktail tables for every layout.", image: IMG.banquetTables },
  { id: "chairs", name: "Chairs", description: "Banquet, Tiffany and folding chairs, stackable and elegant.", image: IMG.galaChairs },
  { id: "linen", name: "Linen", description: "Tablecloths, runners and napkins in a range of colours.", image: IMG.restaurantTable },
  { id: "chair-covers", name: "Chair Covers", description: "Spandex chair covers and sashes for a polished look.", image: IMG.eventHall },
  { id: "decor", name: "Décor", description: "Candles, vases and table numbers to style each table.", image: IMG.candleTable },
  { id: "backdrops", name: "Backdrops", description: "Fabric and floral backdrops for stages and photo moments.", image: IMG.floralBackdrop },
  { id: "draping", name: "Draping", description: "Soft ceiling and wall drape fabric, by the metre.", image: IMG.drapedCeiling },
  { id: "centrepieces", name: "Centrepieces", description: "Floral and candle centrepieces, ready to place.", image: IMG.centrepiece },
  { id: "serving-equipment", name: "Serving Equipment", description: "Platters, chafing dishes and stands for catering service.", image: IMG.platedFood }
];
const demoProducts = [
  // ---- Crockery ----
  { id: "p-dinner-plate", name: "Dinner Plate", category: "crockery", description: "Classic white porcelain dinner plate, 26 cm.", hirePrice: 28, unit: "per plate", quantityAvailable: qty("Dinner Plate"), image: IMG.whitePlates, featured: true, isDemo: true },
  { id: "p-side-plate", name: "Side Plate", category: "crockery", description: "White porcelain side plate, 19 cm.", hirePrice: 18, unit: "per plate", quantityAvailable: qty("Side Plate"), image: IMG.whitePlates, isDemo: true },
  { id: "p-charger-plate", name: "Charger Plate", category: "crockery", description: "Gold-rimmed charger plate for formal settings.", hirePrice: 35, unit: "per plate", quantityAvailable: qty("Charger Plate"), image: IMG.fineDining, featured: true, isDemo: true },
  { id: "p-soup-bowl", name: "Soup Bowl", category: "crockery", description: "White porcelain soup bowl, 14 cm.", hirePrice: 22, unit: "per bowl", quantityAvailable: qty("Soup Bowl"), image: IMG.foodPlate, isDemo: true },
  // ---- Cutlery ----
  { id: "p-fork", name: "Fork", category: "cutlery", description: "Stainless steel dinner fork.", hirePrice: 8, unit: "per fork", quantityAvailable: qty("Fork"), image: IMG.fineDining, isDemo: true },
  { id: "p-knife", name: "Knife", category: "cutlery", description: "Stainless steel dinner knife.", hirePrice: 8, unit: "per knife", quantityAvailable: qty("Knife"), image: IMG.fineDining, isDemo: true },
  { id: "p-spoon", name: "Spoon", category: "cutlery", description: "Stainless steel table spoon.", hirePrice: 8, unit: "per spoon", quantityAvailable: qty("Spoon"), image: IMG.fineDining, isDemo: true },
  // ---- Glassware ----
  { id: "p-wine-glass", name: "Wine Glass", category: "glassware", description: "Classic clear wine glass, 250 ml.", hirePrice: 18, unit: "per glass", quantityAvailable: qty("Wine Glass"), image: IMG.champagne, featured: true, isDemo: true },
  { id: "p-champagne-glass", name: "Champagne Glass", category: "glassware", description: "Elegant champagne flute, 200 ml.", hirePrice: 20, unit: "per glass", quantityAvailable: qty("Champagne Glass"), image: IMG.champagne, featured: true, isDemo: true },
  { id: "p-tumbler", name: "Tumbler", category: "glassware", description: "Sturdy clear tumbler, 300 ml.", hirePrice: 15, unit: "per glass", quantityAvailable: qty("Tumbler"), image: IMG.restaurantTable, isDemo: true },
  // ---- Tables ----
  { id: "p-banquet-table", name: "Banquet Table", category: "tables", description: "Banquet table, 1800 × 750 mm, seats up to 8.", hirePrice: 150, unit: "per table", quantityAvailable: qty("Banquet Table"), image: IMG.banquetTables, isDemo: true },
  { id: "p-round-table", name: "Round Table", category: "tables", description: "Round table, 1500 mm, seats up to 10.", hirePrice: 250, unit: "per table", quantityAvailable: qty("Round Table"), image: IMG.weddingTable, isDemo: true },
  { id: "p-cocktail-table", name: "Cocktail Table", category: "tables", description: "High cocktail table with cover, 700 mm.", hirePrice: 120, unit: "per table", quantityAvailable: qty("Cocktail Table"), image: IMG.networking, isDemo: true },
  // ---- Chairs ----
  { id: "p-banquet-chair", name: "Banquet Chair", category: "chairs", description: "Stackable banquet chair with padded seat.", hirePrice: 45, unit: "per chair", quantityAvailable: qty("Banquet Chair"), image: IMG.galaChairs, isDemo: true },
  { id: "p-tiffany-chair", name: "Tiffany Chair", category: "chairs", description: "Classic Tiffany chair, gold or silver frame.", hirePrice: 65, unit: "per chair", quantityAvailable: qty("Tiffany Chair"), image: IMG.weddingReception, featured: true, isDemo: true },
  { id: "p-folding-chair", name: "Folding Chair", category: "chairs", description: "Lightweight white folding chair.", hirePrice: 25, unit: "per chair", quantityAvailable: qty("Folding Chair"), image: IMG.eventHall, isDemo: true },
  // ---- Linen ----
  { id: "p-tablecloth", name: "Tablecloth", category: "linen", description: "Floor-length tablecloth, 1800 mm table, any colour.", hirePrice: 150, unit: "per cloth", quantityAvailable: qty("Tablecloth"), image: IMG.restaurantTable, featured: true, isDemo: true },
  { id: "p-runner", name: "Runner", category: "linen", description: "Decorative table runner, 3 m.", hirePrice: 45, unit: "per runner", quantityAvailable: qty("Runner"), image: IMG.dinnerCandles, isDemo: true },
  { id: "p-napkin", name: "Napkin", category: "linen", description: "Pressed fabric napkin, 45 × 45 cm.", hirePrice: 12, unit: "per napkin", quantityAvailable: qty("Napkin"), image: IMG.fineDining, isDemo: true },
  // ---- Chair covers ----
  { id: "p-chair-cover", name: "Chair Cover", category: "chair-covers", description: "Spandex chair cover — white, ivory, black or gold.", hirePrice: 22, unit: "per cover", quantityAvailable: qty("Chair Cover"), image: IMG.galaChairs, featured: true, isDemo: true },
  { id: "p-sash", name: "Sash", category: "chair-covers", description: "Satin sash to finish a chair cover, any colour.", hirePrice: 18, unit: "per sash", quantityAvailable: qty("Sash"), image: IMG.eventHall, isDemo: true },
  // ---- Décor ----
  { id: "p-led-candle", name: "LED Candle", category: "decor", description: "Flicker LED candle with timer, 20 cm.", hirePrice: 35, unit: "per candle", quantityAvailable: qty("LED Candle"), image: IMG.candleTable, isDemo: true },
  { id: "p-vase", name: "Vase", category: "decor", description: "Glass vase, set of three heights.", hirePrice: 60, unit: "per set", quantityAvailable: qty("Vase"), image: IMG.weddingFlorals, isDemo: true },
  { id: "p-table-number", name: "Table Number", category: "decor", description: "Acrylic table number stand.", hirePrice: 15, unit: "per stand", quantityAvailable: qty("Table Number"), image: IMG.dinnerCandles, isDemo: true },
  // ---- Backdrops ----
  { id: "p-fabric-backdrop", name: "Fabric Backdrop", category: "backdrops", description: "Fabric backdrop panel, 3 × 2.4 m, with stand.", hirePrice: 650, unit: "per backdrop", quantityAvailable: qty("Fabric Backdrop"), image: IMG.floralBackdrop, isDemo: true },
  { id: "p-floral-wall-panel", name: "Floral Wall Panel", category: "backdrops", description: "Artificial floral wall panel, 1 × 1 m.", hirePrice: 450, unit: "per panel", quantityAvailable: qty("Floral Wall Panel"), image: IMG.weddingFlorals, isDemo: true },
  // ---- Draping ----
  { id: "p-drape-fabric", name: "Drape Fabric", category: "draping", description: "Soft drape fabric, 1.5 m wide, per metre.", hirePrice: 45, unit: "per metre", quantityAvailable: qty("Drape Fabric"), image: IMG.drapedCeiling, isDemo: true },
  // ---- Centrepieces ----
  { id: "p-floral-centrepiece", name: "Floral Centrepiece", category: "centrepieces", description: "Fresh-look floral centrepiece arrangement.", hirePrice: 180, unit: "per centrepiece", quantityAvailable: qty("Floral Centrepiece"), image: IMG.centrepiece, isDemo: true },
  { id: "p-candle-centrepiece", name: "Candle Centrepiece", category: "centrepieces", description: "Candle centrepiece on mirror tile.", hirePrice: 95, unit: "per centrepiece", quantityAvailable: qty("Candle Centrepiece"), image: IMG.candleTable, isDemo: true },
  // ---- Serving equipment ----
  { id: "p-serving-platter", name: "Serving Platter", category: "serving-equipment", description: "Large ceramic serving platter.", hirePrice: 55, unit: "per platter", quantityAvailable: qty("Serving Platter"), image: IMG.platedFood, isDemo: true },
  { id: "p-chafing-dish", name: "Chafing Dish", category: "serving-equipment", description: "Stainless chafing dish with stand, 6 L.", hirePrice: 120, unit: "per dish", quantityAvailable: qty("Chafing Dish"), image: IMG.kitchenPrep, isDemo: true }
];
async function getProducts() {
  await delay();
  return demoProducts;
}
async function getCategories() {
  await delay(200);
  return demoCategories;
}
async function getProductsByCategory(categoryId) {
  await delay(200);
  return demoProducts.filter((p) => p.category === categoryId);
}
export {
  IMG as I,
  getCategories as a,
  getProductsByCategory as b,
  getProducts as g,
  unsplash as u
};
