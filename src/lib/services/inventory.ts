/**
 * Inventory service — async, backed by the client store.
 * Reserve/release mutate `reserved`; available stock is always derived
 * (see availableCount in ~/lib/util).
 */
import { getInventoryItems, getInventoryItem, getInventoryVariants, updateInventoryItem as updateInventoryItemOnServer, updateInventoryVariant as updateInventoryVariantOnServer, adjustStock as adjustStockOnServer, getStockHistory as getStockHistoryOnServer } from "~/lib/server/inventory";
import type { InventoryItem, InventoryVariant, StockMovement } from "~/lib/types";

export async function getInventory(): Promise<InventoryItem[]> {
  return getInventoryItems();
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  const inventory = await getInventoryItems();
  return inventory.filter((item) => item.total !== null && item.total - item.reserved - item.outOnHire - item.damaged - item.missing <= (item.reorderLevel ?? 0));
}

export async function reserveInventory(itemId: string, quantity: number): Promise<InventoryItem> {
  void itemId;
  void quantity;
  throw new Error("Inventory reservations are not enabled yet. A quote does not reserve stock.");
}

export async function releaseInventory(itemId: string, quantity: number): Promise<InventoryItem> {
  void itemId;
  void quantity;
  throw new Error("Inventory reservations are not enabled yet.");
}

export async function updateInventory(
  itemId: string,
  patch: Partial<Pick<InventoryItem, "total" | "reserved" | "outOnHire" | "damaged" | "missing" | "reorderLevel" | "basePrice" | "active" | "description" | "name" | "category" | "pricingUnit" | "variants">>
): Promise<InventoryItem> {
  return updateInventoryItemOnServer({ data: { id: itemId, ...patch } });
}

export async function getInventoryById(itemId: string): Promise<InventoryItem | null> {
  return getInventoryItem({ data: itemId });
}

export async function getVariants(itemId: string): Promise<InventoryVariant[]> {
  return getInventoryVariants({ data: itemId });
}

export async function updateVariant(variant: InventoryVariant): Promise<InventoryVariant | null> {
  return updateInventoryVariantOnServer({ data: variant });
}

export async function adjustInventory(itemId: string, damaged: number, missing: number, notes?: string): Promise<InventoryItem | null> {
  return adjustStockOnServer({ data: { id: itemId, damaged, missing, notes } });
}

export async function getStockHistory(itemId: string): Promise<StockMovement[]> {
  return getStockHistoryOnServer({ data: itemId });
}
