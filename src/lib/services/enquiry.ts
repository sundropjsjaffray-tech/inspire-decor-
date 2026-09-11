/**
 * Enquiry-list service — the customer's "add to enquiry" hire selection.
 *
 * Thin async wrapper over the store's enquiryList actions so components route
 * every state change through the services layer (the same seam Supabase will
 * replace later). Reading the list directly with `useStore` in components is
 * fine for subscriptions; mutations go through the functions below.
 */
import { useStore } from "~/lib/store";
import { delay } from "~/lib/util";
import type { EnquiryLine } from "~/lib/types";

export async function getEnquiryList(): Promise<EnquiryLine[]> {
  await delay(100);
  return useStore.getState().enquiryList;
}

export async function addProductToEnquiry(productId: string, quantity: number): Promise<void> {
  await delay(150);
  useStore.getState().addToEnquiry(productId, quantity);
}

export async function updateEnquiryLineQuantity(productId: string, quantity: number): Promise<void> {
  await delay(100);
  if (quantity <= 0) {
    useStore.getState().removeFromEnquiry(productId);
    return;
  }
  useStore.getState().updateEnquiryLine(productId, quantity);
}

export async function removeFromEnquiryList(productId: string): Promise<void> {
  await delay(100);
  useStore.getState().removeFromEnquiry(productId);
}

export async function clearEnquiryList(): Promise<void> {
  await delay(100);
  useStore.getState().clearEnquiry();
}
