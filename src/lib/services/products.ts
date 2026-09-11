/**
 * Products service — async, returns Promises.
 *
 * The hire catalogue is read-only for now, so these functions read the demo
 * data modules directly. When Supabase is connected, swap the body of each
 * function for a query — signatures stay the same, UI unchanged.
 */
import { delay } from "~/lib/util";
import type { Category, CategoryId, Product } from "~/lib/types";
import { demoCategories, demoProducts } from "~/lib/data/products";

export async function getProducts(): Promise<Product[]> {
  await delay();
  return demoProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  return demoProducts.find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  await delay(200);
  return demoCategories;
}

export async function getProductsByCategory(categoryId: CategoryId): Promise<Product[]> {
  await delay(200);
  return demoProducts.filter((p) => p.category === categoryId);
}
