/**
 * Demo warehouse stock. Every item is `isDemo: true` (see `~/lib/demo.ts`).
 *
 * `available` is always derived — never stored — via `availableCount()` in
 * `~/lib/util` (total - reserved - outOnHire - damaged - missing). Totals below
 * match the hire catalogue in `products.ts` (same item names), so catalogue
 * "quantityAvailable" and warehouse stock never drift apart.
 */
import type { InventoryItem } from "~/lib/types";

export const demoInventory: InventoryItem[] = [
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
  { id: "inv-chafing-dish", name: "Chafing Dish", category: "serving-equipment", total: 25, reserved: 5, outOnHire: 8, damaged: 0, missing: 0, reorderLevel: 3, isDemo: true },
];
