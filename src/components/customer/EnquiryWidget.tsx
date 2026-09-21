import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button, EmptyState, Img, Modal, PriceTag, buttonClasses } from "~/components/ui";
import { useStore } from "~/lib/store";
import { getProducts } from "~/lib/services/products";
import {
  clearEnquiryList,
  removeFromEnquiryList,
  updateEnquiryLineQuantity,
} from "~/lib/services/enquiry";
import type { Product } from "~/lib/types";
import { formatZAR } from "~/lib/util";

interface Line {
  product: Product;
  quantity: number;
  lineTotal: number;
}

/**
 * Floating "enquiry list" widget — fixed button (bottom-right) with a live
 * item count that opens a modal drawer of the customer's hire selection with a
 * running total and a "Request Quote" CTA. Mounted in CustomerLayout so it is
 * present on every customer-facing page.
 */
export function EnquiryWidget() {
  const enquiryList = useStore((s) => s.enquiryList);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    getProducts().then((list) => {
      if (alive) setProducts(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const byId = new Map(products.map((p) => [p.id, p]));
  const lines: Line[] = enquiryList
    .map((line) => {
      const product = byId.get(line.productId);
      if (!product) return null;
      return { product, quantity: line.quantity, lineTotal: product.hirePrice === null ? null : product.hirePrice * line.quantity };
    })
    .filter((l): l is Line => l !== null);

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open enquiry list, ${count} item${count === 1 ? "" : "s"}`}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-xl text-ink-950 shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
      >
        <span aria-hidden="true">◆</span>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-950 px-1 text-xs font-bold text-gold-200">
            {count}
          </span>
        )}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Your Enquiry List" size="md">
        {lines.length === 0 ? (
          <EmptyState
            title="No items yet"
            description="Browse the hire catalogue and add tables, chairs, crockery and more to your enquiry."
            action={
              <Link to="/hire" className={buttonClasses("primary")} onClick={() => setOpen(false)}>
                Browse Hire Catalogue
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            <ul className="divide-y divide-ink-100">
              {lines.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <Img
                    src={product.image}
                    alt={product.name}
                    fallbackLabel={product.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-400">
                      {formatZAR(product.hirePrice)} · {product.unit}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() => updateEnquiryLineQuantity(product.id, quantity - 1)}
                        className="rounded border border-ink-300 px-1.5 text-sm leading-5 text-ink-600 hover:bg-ink-100"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm font-medium">{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        onClick={() => updateEnquiryLineQuantity(product.id, quantity + 1)}
                        className="rounded border border-ink-300 px-1.5 text-sm leading-5 text-ink-600 hover:bg-ink-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-ink-900">{formatZAR(lineTotal)}</span>
                    <button
                      type="button"
                      onClick={() => removeFromEnquiryList(product.id)}
                      className="text-xs text-ink-400 underline-offset-2 hover:text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-ink-200 pt-3">
              <span className="text-sm font-medium text-ink-600">Estimated hire total</span>
              <PriceTag amount={total} className="text-lg" />
            </div>
            <p className="text-xs text-ink-400">
              Daily hire rates, VAT inclusive. Demonstration pricing for preview.
            </p>
            <div className="flex gap-3 pt-1">
              <Link to="/quote" className={buttonClasses("primary")} onClick={() => setOpen(false)}>
                Request Quote
              </Link>
              <Button variant="ghost" onClick={() => clearEnquiryList()}>
                Clear list
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
