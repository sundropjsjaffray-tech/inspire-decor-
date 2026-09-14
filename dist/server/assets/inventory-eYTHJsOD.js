import { u as useStore } from "./index-CtB_iAzP.js";
import { d as delay, b as availableCount } from "./util-D5Y4JTPp.js";
async function getInventory() {
  await delay();
  return useStore.getState().inventory;
}
async function reserveInventory(itemId, quantity) {
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
async function updateInventory(itemId, patch) {
  await delay(250);
  const state = useStore.getState();
  const item = state.inventory.find((i) => i.id === itemId);
  if (!item) throw new Error(`Inventory item not found: ${itemId}`);
  state.updateInventoryItem(itemId, patch);
  return { ...item, ...patch };
}
export {
  getInventory as g,
  reserveInventory as r,
  updateInventory as u
};
