import { IMG } from "~/lib/images";
import type { Category, Product } from "~/lib/types";
import { realInventory } from "./inventory";

export const demoCategories: Category[] = [
  ["crockery", "Crockery", "Plates, bowls, cups and underplates.", IMG.whitePlates],
  ["cutlery", "Cutlery", "Knives, forks and spoons.", IMG.fineDining],
  ["glassware", "Glassware", "Glasses and jugs for event service.", IMG.champagne],
  ["linen", "Linen", "Table cloths, covers, ties, runners and draping.", IMG.restaurantTable],
  ["catering-platters", "Catering Platters", "Platters and sauce holders.", IMG.platedFood],
  ["catering-stands", "Catering Stands", "Wooden boards and stands.", IMG.kitchenPrep],
  ["food-warmers", "Food Warmers", "Chafing dishes and urns.", IMG.kitchenPrep],
  ["chairs", "Chairs", "Event seating and statement chairs.", IMG.galaChairs],
  ["tables", "Tables", "Trestle, round, children's and cake tables.", IMG.banquetTables],
  ["furniture-decor", "Furniture & Décor", "Carpets and decorative hire pieces.", IMG.eventHall],
  ["backdrops", "Backdrops", "Backdrop frames, boards and arches.", IMG.floralBackdrop],
  ["centrepieces", "Centrepieces", "Candle holders, vases, lanterns and flowers.", IMG.centrepiece],
  ["tents", "Tents", "Stretch and PVC tents. Transport excluded.", IMG.eventHall],
  ["lighting", "Lighting", "Joinable cool white string lights.", IMG.drapedCeiling],
  ["other", "Other", "Easels and gift boxes.", IMG.eventHall],
].map(([id, name, description, image]) => ({ id, name, description, image })) as Category[];

const imageByCategory: Record<string, string | undefined> = {
  crockery: IMG.whitePlates,
  cutlery: IMG.fineDining,
  glassware: IMG.champagne,
  linen: IMG.restaurantTable,
  "catering-platters": IMG.platedFood,
  "catering-stands": IMG.kitchenPrep,
  "food-warmers": IMG.kitchenPrep,
  chairs: IMG.galaChairs,
  tables: IMG.banquetTables,
  "furniture-decor": IMG.eventHall,
  backdrops: IMG.floralBackdrop,
  centrepieces: IMG.centrepiece,
  tents: IMG.eventHall,
  lighting: IMG.drapedCeiling,
  other: IMG.eventHall,
};

export const demoProducts: Product[] = realInventory.map((inventoryItem) => ({
  id: `product-${inventoryItem.id.slice(5)}`,
  inventoryItemId: inventoryItem.id,
  name: inventoryItem.name,
  category: inventoryItem.category,
  description: inventoryItem.description,
  hirePrice: inventoryItem.basePrice,
  unit: inventoryItem.pricingUnit,
  quantityAvailable: inventoryItem.total,
  image: imageByCategory[inventoryItem.category],
  featured: ["Dinner Plate", "Champagne Glass", "White Plastic Trestle Table", "Steel Round Gold Backdrop"].includes(inventoryItem.name),
  isDemo: false,
}));
