/**
 * Products service — async, returns Promises.
 *
 * The hire catalogue is read-only for now, so these functions read the demo
 * data modules directly. When Supabase is connected, swap the body of each
 * function for a query — signatures stay the same, UI unchanged.
 */
import { getInventoryItems } from "~/lib/server/inventory";
import type { Category, CategoryId, Product } from "~/lib/types";
import { demoCategories, demoProducts } from "~/lib/data/products";
import { availableCount } from "~/lib/util";

function toProduct(item: Awaited<ReturnType<typeof getInventoryItems>>[number]): Product {
  const seed = demoProducts.find((product) => product.inventoryItemId === item.id);
  return {
    id: seed?.id ?? `product-${item.id.slice(5)}`,
    inventoryItemId: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    hirePrice: item.basePrice,
    unit: item.pricingUnit,
    quantityAvailable: availableCount(item),
    image: seed?.image,
    featured: seed?.featured,
    isDemo: false,
  };
}

export async function getProducts(): Promise<Product[]> {
  return (await getInventoryItems()).map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  return (await getProducts()).find((product) => product.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  return demoCategories;
}

export async function getProductsByCategory(categoryId: CategoryId): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.category === categoryId);
}
