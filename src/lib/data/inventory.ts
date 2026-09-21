/** Real client stock foundation. Unknown values are intentionally null. */
import type { CategoryId, InventoryItem, InventoryVariant, PricingUnit } from "~/lib/types";

const createdAt = "2026-09-14T00:00:00.000Z";

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function item(
  id: string,
  name: string,
  category: CategoryId,
  basePrice: number | null,
  total: number | null,
  description: string,
  variants: string[] = [],
  pricingUnit: PricingUnit = "each"
): InventoryItem {
  const variantRecords: InventoryVariant[] = variants.map((variantName) => ({
    id: `${id}-${slug(variantName)}`,
    inventoryItemId: id,
    variantName,
    stockQuantity: null,
    active: true,
  }));
  return {
    id,
    name,
    category,
    description,
    basePrice,
    pricingUnit,
    total,
    reserved: 0,
    outOnHire: 0,
    damaged: 0,
    missing: 0,
    active: true,
    variants: variantRecords,
    createdAt,
    updatedAt: createdAt,
    isDemo: false,
  };
}

function withVariantStock(inventoryItem: InventoryItem, stocks: Array<number | null>): InventoryItem {
  return {
    ...inventoryItem,
    variants: inventoryItem.variants.map((variant, index) => ({
      ...variant,
      stockQuantity: stocks[index] ?? null,
    })),
  };
}

const trestleCloth = withVariantStock(
  item("inv-trestle-table-cloth", "Trestle Table Cloth", "linen", 30, 49, "Trestle table cloth, priced per cloth.", ["White", "Baby Blue", "Light Grey", "Bright Yellow", "Cream Embossed", "Champagne", "Black"]),
  [25, 10, 10, 1, 2, 1, null]
);
const damaskRoundCloth = withVariantStock(
  item("inv-round-table-cloth-damask", "Round Table Cloth - Damask", "linen", 40, 31, "Damask round table cloth, priced per cloth.", ["White", "Lilac", "Purple", "Black"]),
  [null, 15, 15, 1]
);
const chairCovers = withVariantStock(item("inv-chair-covers", "Chair Covers", "linen", 5, null, "Chair covers, priced per cover.", ["White", "Black"]), [null, null]);
const chairTies = withVariantStock(item("inv-chair-ties", "Chair Ties", "linen", 4, null, "Chair ties, priced per tie.", ["Royal Blue", "Baby Blue", "Various colours"]), [null, null, null]);
const runners = withVariantStock(item("inv-runners", "Runners", "linen", 15, null, "Decorative table runners, priced per runner.", ["Various colours"]), [null]);
const draping = withVariantStock(item("inv-draping-pieces", "Draping Piece", "linen", 20, null, "Draping pieces, priced per piece.", ["White", "Gold", "Purple", "Yellow", "Lime", "Lilac", "Black", "Red", "Turquoise", "Olive Green"]), Array(10).fill(null));

export const realInventory: InventoryItem[] = [
  item("inv-dinner-plate", "Dinner Plate", "crockery", 2, 138, "Dinner plate."),
  item("inv-side-plate", "Side Plate", "crockery", 2, 178, "Side plate."),
  item("inv-pudding-dessert-bowl", "Pudding / Dessert Bowl", "crockery", 2, 173, "Pudding or dessert bowl."),
  item("inv-cups-saucers", "Cups & Saucers", "crockery", 2, null, "Cups and saucers."),
  item("inv-gold-leaf-underplate", "Gold Leaf Underplate", "crockery", 5, 99, "Gold leaf underplate."),
  item("inv-plain-gold-underplate", "Plain Gold Underplate", "crockery", null, 12, "Plain gold underplate."),
  item("inv-silver-underplate", "Silver Underplate", "crockery", null, 9, "Silver underplate."),
  item("inv-large-round-mirror", "Large Round Mirror", "crockery", null, 10, "Large round mirror."),
  item("inv-knife", "Knife", "cutlery", 1, 188, "Hire knife."),
  item("inv-fork", "Fork", "cutlery", 1, 136, "Hire fork."),
  item("inv-dessert-spoon", "Dessert Spoon", "cutlery", 1, 176, "Dessert spoon."),
  item("inv-teaspoon", "Teaspoon", "cutlery", 1, 144, "Teaspoon."),
  item("inv-champagne-glass", "Champagne Glass", "glassware", 2, 132, "Champagne glass."),
  item("inv-wine-glass", "Wine Glass", "glassware", 2, 83, "Wine glass."),
  item("inv-juice-glass", "Juice Glass", "glassware", 2, 39, "Juice glass."),
  item("inv-shot-glass", "Shot Glass", "glassware", 1, null, "Shot glass."),
  item("inv-glass-juice-jug", "Glass Juice Jug", "glassware", 12, 26, "Glass juice jug."),
  trestleCloth,
  damaskRoundCloth,
  item("inv-plain-taffeta-round-cloth", "Plain Taffeta Round Table Cloth", "linen", null, 12, "Plain taffeta round table cloth."),
  chairCovers,
  chairTies,
  runners,
  draping,
  item("inv-plastic-5-division-platter", "Plastic 5-Division Platter", "catering-platters", 10, 2, "Plastic platter with five divisions."),
  item("inv-porcelain-2-division-snack-platter", "White Porcelain 2-Division Snack Platter", "catering-platters", 10, 2, "White porcelain snack platter with two divisions."),
  item("inv-porcelain-3-division-sauce-holder", "Porcelain 3-Division Sauce Holder", "catering-platters", 8, 2, "Porcelain sauce holder with three divisions."),
  item("inv-wood-cheese-board", "Wood Cheese Board", "catering-stands", 10, 8, "Wood cheese board."),
  item("inv-wooden-cupcake-stand", "Wooden Cupcake Stand", "catering-stands", 50, 2, "Wooden cupcake stand."),
  item("inv-wooden-2-tier-stand", "Wooden 2-Tier Stand", "catering-stands", 50, 1, "Wooden two-tier stand."),
  item("inv-wooden-a-frame-stand", "Wooden A-Frame Stand", "catering-stands", 90, 1, "Wooden A-frame stand."),
  item("inv-chafing-dish", "Chafing Dish", "food-warmers", 60, 2, "Chafing dish. Current stock take is 2; the original list said 3."),
  item("inv-urn-10l", "Urn 10L", "food-warmers", 90, 1, "10 litre urn."),
  item("inv-red-carpet-5m", "Red Carpet 5m", "furniture-decor", 250, 2, "Five metre red carpet."),
  item("inv-white-fluffy-carpet", "White Fluffy Carpet", "furniture-decor", 80, 3, "White fluffy carpet."),
  item("inv-black-fluffy-carpet", "Black Fluffy Carpet", "furniture-decor", 80, 1, "Black fluffy carpet."),
  item("inv-queen-chair", "Queen Chair", "chairs", 200, null, "Queen chair."),
  item("inv-his-hers-leather-chairs", "His & Hers Leather Chairs", "chairs", 250, null, "His and hers leather chairs."),
  item("inv-white-diamond-back-chair", "White Plastic Diamond-Back Chair", "chairs", 100, 1, "White plastic diamond-back chair."),
  item("inv-emerald-green-tub-chair", "Emerald Green Velvet Tub Chair", "chairs", 150, 1, "Emerald green velvet tub chair."),
  item("inv-dusty-pink-tub-chair", "Dusty Pink Velvet Tub Chair", "chairs", 150, 1, "Dusty pink velvet tub chair."),
  item("inv-white-throne-chair", "White Throne Chair with Gold Frame", "chairs", null, 1, "White throne chair with gold frame."),
  item("inv-heavy-duty-plastic-chair", "Heavy-Duty Plastic Chair", "chairs", null, 19, "Heavy-duty plastic chair."),
  item("inv-light-duty-plastic-chair", "Light-Duty Plastic Chair", "chairs", null, null, "Light-duty plastic chair."),
  item("inv-black-plastic-chair", "Black Plastic Chair", "chairs", 5, null, "Black plastic chair."),
  item("inv-white-plastic-trestle-table", "White Plastic Trestle Table", "tables", 30, 18, "White plastic trestle table."),
  item("inv-round-10-seater-wooden-table", "Round 10-Seater Wooden Table", "tables", 40, null, "Round ten-seater wooden table."),
  item("inv-wooden-kiddies-table", "Wooden Kiddies Table - 8 Seater", "tables", 30, 3, "Wooden eight-seater children's table."),
  item("inv-wooden-kiddies-bench", "Wooden Kiddies Bench - 4 Seater", "tables", 20, 6, "Wooden four-seater children's bench."),
  item("inv-mirror-gold-cake-table", "Steel-Frame Mirror/Gold Cake Table", "tables", 70, 2, "Steel-frame mirror and gold cake table."),
  item("inv-welcome-easel", "Welcome Easel / Stand", "other", 100, 1, "Welcome easel or stand."),
  item("inv-white-steel-easel", "White Steel Easel", "other", null, 1, "White steel easel."),
  item("inv-wooden-easel", "Wooden Easel", "other", null, 1, "Wooden easel. Price requires confirmation."),
  item("inv-wooden-square-gift-box", "Wooden Square Gift Box", "other", 100, null, "Wooden square gift box."),
  item("inv-steel-round-gold-backdrop", "Steel Round Gold Backdrop", "backdrops", 200, 1, "Steel round gold backdrop."),
  item("inv-wooden-arch-frame", "Wooden Arch Frame", "backdrops", 200, 1, "Wooden arch frame."),
  item("inv-round-pallet-backdrop", "Round Pallet Backdrop", "backdrops", 200, 1, "Round pallet backdrop."),
  item("inv-square-pallet-backdrop", "Square Pallet Backdrop", "backdrops", 200, 1, "Square pallet backdrop."),
  item("inv-steel-arch-gold-window-frame", "Steel Arch Gold Window Frame", "backdrops", 200, 1, "Steel arch gold window frame."),
  item("inv-round-board-backdrop", "Round Board Backdrop", "backdrops", 250, 1, "Round board backdrop."),
  item("inv-white-wood-board-3-set-arches", "White Wood Board - 3-Set Arches", "backdrops", 200, 1, "Three-set white wood board arches.", [], "per set"),
  item("inv-gold-tall-candle-holder", "Gold Tall Candle Holder", "centrepieces", 25, 15, "Gold tall candle holder."),
  item("inv-silver-tall-candle-holder", "Silver Tall Candle Holder", "centrepieces", 25, 3, "Silver tall candle holder."),
  item("inv-vase-with-hole", "Vase With Hole", "centrepieces", 20, 8, "Vase with hole."),
  item("inv-clear-glass-flute-vase", "Clear Glass Flute Vase", "centrepieces", 20, 15, "Clear glass flute vase."),
  item("inv-wood-disc-block", "Wood Disc / Block for Centrepieces", "centrepieces", 10, 8, "Wood disc or block for centrepieces."),
  item("inv-large-cream-steel-lantern", "Large Cream Steel Lantern", "centrepieces", 30, 2, "Large cream steel lantern."),
  item("inv-large-white-steel-bird-cage", "Large White Steel Bird Cage", "centrepieces", 30, 1, "Large white steel bird cage."),
  item("inv-various-colour-flowers", "Various Colour Flowers", "centrepieces", null, null, "Various colour flowers."),
  item("inv-5x5-white-stretch-tent", "5m x 5m White Stretch Tent", "tents", 450, null, "Five by five metre white stretch tent. Transport excluded."),
  item("inv-10x5-white-stretch-tent", "10m x 5m White Stretch Tent", "tents", 750, null, "Ten by five metre white stretch tent. Transport excluded."),
  item("inv-5x5-pvc-red-white-tent", "5m x 5m PVC Tent - Red & White", "tents", 1050, null, "Five by five metre red and white PVC tent. Transport excluded."),
  item("inv-fairy-lights", "Fairy Lights", "lighting", 70, 6, "12m joinable cool white string lights."),
];

export const demoInventory = realInventory;
