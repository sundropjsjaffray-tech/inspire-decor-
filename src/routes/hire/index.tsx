import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import { Img, LoadingState, PageHeader, buttonClasses } from "~/components/ui";
import { getCategories, getProducts } from "~/lib/services/products";
import type { Category, Product } from "~/lib/types";

export const Route = createFileRoute("/hire/")({ component: HirePage });

function HirePage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getCategories(), getProducts()]).then(([cats, prods]) => {
      if (!alive) return;
      setCategories(cats);
      setProducts(prods);
    });
    return () => {
      alive = false;
    };
  }, []);

  const countFor = (id: string) => (products ?? []).filter((p) => p.category === id).length;

  return (
    <CustomerLayout>
      <PageHeader
        title="Hire Catalogue"
        eyebrow="Hire"
        subtitle="12 categories of décor, crockery, glassware, linen, furniture and more — daily hire rates, VAT inclusive. All catalogue data is demonstration data."
      />
      {!categories || !products ? (
        <LoadingState label="Loading catalogue…" />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/hire/$category"
                params={{ category: category.id }}
                className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <Img
                  src={category.image}
                  alt={category.name}
                  fallbackLabel={category.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold text-ink-900">{category.name}</h2>
                    <span className="rounded-full bg-champagne-200 px-2 py-0.5 text-xs font-semibold text-ink-700">
                      {countFor(category.id)} items
                    </span>
                  </div>
                  <p className="text-sm text-ink-500">{category.description}</p>
                  <span className={buttonClasses("secondary", "sm") + " mt-3 self-start"}>
                    View products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-dashed border-gold-300 bg-champagne-100/60 p-5 text-sm text-ink-600">
            <span className="font-semibold text-ink-800">Pricing note:</span> all hire prices are per
            day, VAT inclusive, and are <span className="font-semibold">demonstration rates</span> for
            preview only. Final quotes are confirmed on your personalised quote.
          </div>
        </>
      )}
    </CustomerLayout>
  );
}
