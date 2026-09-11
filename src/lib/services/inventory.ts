/**
 * Inventory service — async, backed by the client store.
 * Reserve/release mutate `reserved`; available stock is always derived
 * (see availableCount in ~/lib/util).
 */
import { useStore } from "~/lib/store";
import { availableCount, delay } from "~/lib/util";
import type { InventoryItem } from "~/lib/types";

export async function getInventory(): Promise<InventoryItem[]> {
  await delay();
  return useStore.getState().inventory;
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  await delay(250);
  const state = useStore.getState();
  return state.inventory.filter((i) => availableCount(i) <= (i.reorderLevel ?? 0));
}

export async function reserveInventory(itemId: string, quantity: number): Promise<InventoryItem> {
  await delay(250);
  const state = useStore.getState();
  const item = state.inventory.find((i) => i.id === itemId);
  if (!item) throw new Error(`Inventory item not found: ${itemId}`);
  const available = availableCount(item);
  if (quantity > available) {
    throw new Error(
      `Insufficient stock for ${item.name}: requested ${quantity}, available ${available}`
    );
  }
  state.updateInventoryItem(itemId, { reserved: item.reserved + quantity });
  return { ...item, reserved: item.reserved + quantity };
}

export async function releaseInventory(itemId: string, quantity: number): Promise<InventoryItem> {
  await delay(250);
  const state = useStore.getState();
  const item = state.inventory.find((i) => i.id === itemId);
  if (!item) throw new Error(`Inventory item not found: ${itemId}`);
  state.updateInventoryItem(itemId, {
    reserved: Math.max(0, item.reserved - quantity),
  });
  return { ...item, reserved: Math.max(0, item.reserved - quantity) };
}

export async function updateInventory(
  itemId: string,
  patch: Partial<Pick<InventoryItem, "total" | "reserved" | "outOnHire" | "damaged" | "missing" | "reorderLevel">>
): Promise<InventoryItem> {
  await delay(250);
  const state = useStore.getState();
  const item = state.inventory.find((i) => i.id === itemId);
  if (!item) throw new Error(`Inventory item not found: ${itemId}`);
  state.updateInventoryItem(itemId, patch);
  return { ...item, ...patch };
}
