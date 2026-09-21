import { useEffect, useRef, useState } from "react";
import { Button, Img, PriceTag } from "~/components/ui";
import type { Product } from "~/lib/types";
import { addProductToEnquiry } from "~/lib/services/enquiry";

export interface ProductCardProps {
  product: Product;
  /** Category name shown as a small label (fetched via the products service). */
  categoryName?: string;
  /** Category-level image fallback when the product has none. */
  categoryImage?: string;
}

/**
 * Hire product card with a quantity stepper and "Add to Enquiry" action.
 * Feedback is inline ("Added ✓") — the floating enquiry widget also updates.
 */
export function ProductCard({ product, categoryName, categoryImage }: ProductCardProps) {
  const available = product.quantityAvailable;
  const outOfStock = available === null || available <= 0 || product.hirePrice === null;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleAdd = async () => {
    await addProductToEnquiry(product.id, qty);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <Img
          src={product.image || categoryImage}
          alt={product.name}
          fallbackLabel={product.name}
          className="aspect-[4/3] w-full object-cover"
        />
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Unavailable
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold text-ink-900">{product.name}</h3>
            {categoryName && <p className="text-xs uppercase tracking-wide text-ink-400">{categoryName}</p>}
          </div>
          <PriceTag amount={product.hirePrice} />
        </div>
        <p className="text-sm text-ink-500">{product.description}</p>
        <p className="text-xs text-ink-400">
          {product.unit} · per day · VAT incl. ·{" "}
          <span className={outOfStock ? "font-semibold text-red-600" : available <= 5 ? "font-semibold text-amber-600" : "text-ink-500"}>
            {available === null ? "stock TBC" : outOfStock ? "unavailable" : `${available} available`}
          </span>
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <div className="flex items-center rounded-lg border border-ink-300">
            <button
              type="button"
              aria-label={`Decrease quantity of ${product.name}`}
              disabled={qty <= 1 || outOfStock}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2.5 py-1.5 text-sm text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-40"
            >
              −
            </button>
            <span aria-live="polite" className="min-w-7 text-center text-sm font-medium text-ink-900">
              {qty}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${product.name}`}
              disabled={qty >= (available ?? 0) || outOfStock}
              onClick={() => setQty((q) => Math.min(available ?? 0, q + 1))}
              className="px-2.5 py-1.5 text-sm text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-40"
            >
              +
            </button>
          </div>
          <Button
            size="sm"
            variant={added ? "secondary" : "primary"}
            className="flex-1"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={outOfStock ? `${product.name} is currently unavailable` : `Add ${qty} × ${product.name} to enquiry`}
          >
            {outOfStock ? "Unavailable" : added ? "✓ Added" : "Add to Enquiry"}
          </Button>
        </div>
      </div>
    </div>
  );
}
