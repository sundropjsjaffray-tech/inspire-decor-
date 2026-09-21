import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import type { InventoryItem, InventoryVariant, StockMovement, StockMovementType } from "~/lib/types";

const asId = (value: unknown): string => {
  if (typeof value !== "string" || value.trim() === "") throw new Error("A stable inventory ID is required.");
  return value;
};

const asObject = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object") throw new Error("A request object is required.");
  return value as Record<string, unknown>;
};

const movementTypes: StockMovementType[] = [
  "INITIAL_STOCK", "STOCK_ADJUSTMENT", "RESERVED", "RELEASED",
  "CHECKED_OUT", "RETURNED", "DAMAGED", "MISSING", "CORRECTION",
];

function mapItem(row: Record<string, unknown>, variants: InventoryVariant[]): InventoryItem {
  return {
    id: String(row.id),
    name: String(row.name),
    category: row.category as InventoryItem["category"],
    description: String(row.description ?? ""),
    basePrice: row.base_price === null ? null : Number(row.base_price),
    pricingUnit: row.pricing_unit as InventoryItem["pricingUnit"],
    total: row.total_stock === null ? null : Number(row.total_stock),
    reserved: Number(row.reserved_stock ?? 0),
    outOnHire: Number(row.out_on_hire_stock ?? 0),
    damaged: Number(row.damaged_stock ?? 0),
    missing: Number(row.missing_stock ?? 0),
    active: Boolean(row.active),
    variants,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    isDemo: false,
  };
}

async function loadItems(filter?: string): Promise<InventoryItem[]> {
  const query = sql();
  const rows = filter
    ? await query`SELECT id, name, category, description, base_price, pricing_unit, total_stock, reserved_stock, out_on_hire_stock, damaged_stock, missing_stock, active, created_at, updated_at FROM inventory_items WHERE id = ${filter}`
    : await query`SELECT id, name, category, description, base_price, pricing_unit, total_stock, reserved_stock, out_on_hire_stock, damaged_stock, missing_stock, active, created_at, updated_at FROM inventory_items ORDER BY name`;
  const variants = filter
    ? await query`SELECT id, inventory_item_id, variant_name, stock_quantity, active FROM inventory_variants WHERE inventory_item_id = ${filter} ORDER BY variant_name`
    : await query`SELECT id, inventory_item_id, variant_name, stock_quantity, active FROM inventory_variants ORDER BY variant_name`;
  const variantsByItem = new Map<string, InventoryVariant[]>();
  for (const row of variants) {
    const itemVariants = variantsByItem.get(String(row.inventory_item_id)) ?? [];
    itemVariants.push({
      id: String(row.id),
      inventoryItemId: String(row.inventory_item_id),
      variantName: String(row.variant_name),
      stockQuantity: row.stock_quantity === null ? null : Number(row.stock_quantity),
      active: Boolean(row.active),
    });
    variantsByItem.set(String(row.inventory_item_id), itemVariants);
  }
  return rows.map((row) => mapItem(row, variantsByItem.get(String(row.id)) ?? []));
}

export const getInventoryItems = createServerFn({ method: "GET" }).handler(async () => loadItems());

export const getInventoryItem = createServerFn({ method: "GET" })
  .inputValidator((value: unknown) => asId(value))
  .handler(async ({ data }) => (await loadItems(data))[0] ?? null);

export const getInventoryVariants = createServerFn({ method: "GET" })
  .inputValidator((value: unknown) => asId(value))
  .handler(async ({ data }) => (await loadItems(data))[0]?.variants ?? []);

export const createInventoryItem = createServerFn({ method: "POST" })
  .inputValidator(asObject)
  .handler(async ({ data }) => {
    const id = asId(data.id);
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const category = typeof data.category === "string" ? data.category : "other";
    if (!name) throw new Error("An inventory item name is required.");
    const query = sql();
    await query`
      INSERT INTO inventory_items (id, name, category, description, base_price, pricing_unit, total_stock, active)
      VALUES (${id}, ${name}, ${category}, ${typeof data.description === "string" ? data.description : ""}, ${data.basePrice === null ? null : typeof data.basePrice === "number" ? data.basePrice : null}, ${typeof data.pricingUnit === "string" ? data.pricingUnit : "each"}, ${data.total === null ? null : typeof data.total === "number" ? data.total : null}, ${typeof data.active === "boolean" ? data.active : true})
    `;
    return (await loadItems(id))[0] ?? null;
  });

export const updateInventoryItem = createServerFn({ method: "POST" })
  .inputValidator(asObject)
  .handler(async ({ data }) => {
    const id = asId(data.id);
    const query = sql();
    const current = await query`SELECT base_price, total_stock FROM inventory_items WHERE id = ${id}`;
    if (current.length === 0) throw new Error(`Inventory item not found: ${id}`);
    const basePrice = data.basePrice === undefined ? current[0].base_price : data.basePrice;
    const total = data.total === undefined ? current[0].total_stock : data.total;
    await query`
      UPDATE inventory_items
      SET name = COALESCE(${typeof data.name === "string" ? data.name : null}, name),
          description = COALESCE(${typeof data.description === "string" ? data.description : null}, description),
          base_price = ${basePrice === null ? null : typeof basePrice === "number" ? basePrice : null},
          total_stock = ${total === null ? null : typeof total === "number" ? total : null},
          active = COALESCE(${typeof data.active === "boolean" ? data.active : null}, active),
          updated_at = now()
      WHERE id = ${id}
    `;
    return (await loadItems(id))[0] ?? null;
  });

export const updateInventoryVariant = createServerFn({ method: "POST" })
  .inputValidator(asObject)
  .handler(async ({ data }) => {
    const id = asId(data.id);
    const stockQuantity = data.stockQuantity === null ? null : typeof data.stockQuantity === "number" ? data.stockQuantity : null;
    const query = sql();
    await query`UPDATE inventory_variants SET stock_quantity = ${stockQuantity}, active = COALESCE(${typeof data.active === "boolean" ? data.active : null}, active), updated_at = now() WHERE id = ${id}`;
    const itemId = asId(data.inventoryItemId);
    return (await loadItems(itemId))[0]?.variants.find((variant) => variant.id === id) ?? null;
  });

export const adjustStock = createServerFn({ method: "POST" })
  .inputValidator(asObject)
  .handler(async ({ data }) => {
    const id = asId(data.id);
    const damaged = typeof data.damaged === "number" ? Math.max(0, data.damaged) : 0;
    const missing = typeof data.missing === "number" ? Math.max(0, data.missing) : 0;
    const notes = typeof data.notes === "string" && data.notes.trim() ? data.notes.trim() : "Manual stock adjustment";
    const query = sql();
    const current = await query`SELECT damaged_stock, missing_stock FROM inventory_items WHERE id = ${id}`;
    if (current.length === 0) throw new Error(`Inventory item not found: ${id}`);
    const previousDamaged = Number(current[0].damaged_stock ?? 0);
    const previousMissing = Number(current[0].missing_stock ?? 0);
    await query`UPDATE inventory_items SET damaged_stock = ${damaged}, missing_stock = ${missing}, updated_at = now() WHERE id = ${id}`;
    if (damaged !== previousDamaged) await writeMovement(query, id, "DAMAGED", Math.abs(damaged - previousDamaged), notes);
    if (missing !== previousMissing) await writeMovement(query, id, "MISSING", Math.abs(missing - previousMissing), notes);
    return (await loadItems(id))[0] ?? null;
  });

async function writeMovement(query: ReturnType<typeof sql>, itemId: string, type: StockMovementType, quantity: number, notes: string): Promise<void> {
  if (!movementTypes.includes(type)) throw new Error(`Unsupported stock movement: ${type}`);
  await query`INSERT INTO stock_movements (id, inventory_item_id, movement_type, quantity, notes) VALUES (${`${type.toLowerCase()}-${itemId}-${Date.now()}`}, ${itemId}, ${type}, ${quantity}, ${notes})`;
}

export const getStockHistory = createServerFn({ method: "GET" })
  .inputValidator((value: unknown) => asId(value))
  .handler(async ({ data }) => {
    const query = sql();
    const rows = await query`SELECT id, inventory_item_id, variant_id, movement_type, quantity, reference_type, reference_id, notes, created_at FROM stock_movements WHERE inventory_item_id = ${data} ORDER BY created_at DESC`;
    return rows.map((row): StockMovement => ({
      id: String(row.id),
      inventoryItemId: String(row.inventory_item_id),
      variantId: row.variant_id ? String(row.variant_id) : undefined,
      movementType: String(row.movement_type) as StockMovementType,
      quantity: Number(row.quantity),
      referenceType: row.reference_type ? String(row.reference_type) : undefined,
      referenceId: row.reference_id ? String(row.reference_id) : undefined,
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: new Date(String(row.created_at)).toISOString(),
    }));
  });
