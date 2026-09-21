import { realInventory } from "~/lib/data/inventory";
import { sql } from "~/db";

const query = sql();

for (const item of realInventory) {
  await query`
    INSERT INTO inventory_items
      (id, name, category, description, base_price, pricing_unit, total_stock, active, created_at, updated_at)
    VALUES
      (${item.id}, ${item.name}, ${item.category}, ${item.description}, ${item.basePrice}, ${item.pricingUnit}, ${item.total}, ${item.active}, ${item.createdAt}, ${item.updatedAt})
    ON CONFLICT (id) DO NOTHING
  `;

  for (const variant of item.variants) {
    await query`
      INSERT INTO inventory_variants
        (id, inventory_item_id, variant_name, stock_quantity, active, created_at, updated_at)
      VALUES
        (${variant.id}, ${variant.inventoryItemId}, ${variant.variantName}, ${variant.stockQuantity}, ${variant.active}, ${item.createdAt}, ${item.updatedAt})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  if (item.total !== null) {
    await query`
      INSERT INTO stock_movements
        (id, inventory_item_id, movement_type, quantity, notes, created_at)
      VALUES
        (${`initial-${item.id}`}, ${item.id}, 'INITIAL_STOCK', ${item.total}, ${item.name === "Chafing Dish" ? "Current stock take is 2; original price list said 3." : "Imported from the real client stock take."}, ${item.createdAt})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  for (const variant of item.variants) {
    if (variant.stockQuantity === null) continue;
    await query`
      INSERT INTO stock_movements
        (id, inventory_item_id, variant_id, movement_type, quantity, notes, created_at)
      VALUES
        (${`initial-${variant.id}`}, ${item.id}, ${variant.id}, 'INITIAL_STOCK', ${variant.stockQuantity}, 'Imported from the real client stock take.', ${item.createdAt})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

console.log(`Seeded ${realInventory.length} inventory items and ${realInventory.reduce((count, item) => count + item.variants.length, 0)} variants.`);
