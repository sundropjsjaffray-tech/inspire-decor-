import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import { EmptyState, LoadingState, PageHeader, buttonClasses } from "~/components/ui";
import { ProductCard } from "~/components/customer/ProductCard";
import { getCategories, getProductsByCategory } from "~/lib/services/products";
import type { Category, Product } from "~/lib/types";

export const Route = createFileRoute("/hire/$category")({ component: HireCategoryPage });

function HireCategoryPage() {
  const { category: categoryId } = Route.useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    setProducts(null);
    setNotFound(false);
    Promise.all([getCategories(), getProductsByCategory(categoryId as Product["category"])]).then(
      ([categories, prods]) => {
        if (!alive) return;
        const map = new Map<string, Category>(categories.map((c) => [c.id, c] as const));
        setCategory(map.get(categoryId) ?? null);
        setProducts(prods);
        if (!map.has(categoryId)) setNotFound(true);
      }
    );
    return () => {
      alive = false;
    };
  }, [categoryId]);

  if (notFound) {
    return (
      <CustomerLayout>
        <PageHeader title="Category not found" eyebrow="Hire catalogue" />
        <EmptyState
          title="We couldn't find that category"
          description="The catalogue has 12 categories — head back to browse them."
          action={
            <Link to="/hire" className={buttonClasses("primary")}>
              Browse Hire Catalogue
            </Link>
          }
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Link to="/hire" className="text-sm font-medium text-gold-700 underline-offset-4 hover:underline">
        ← All categories
      </Link>
      {!category || !products ? (
        <div className="mt-6">
          <LoadingState label="Loading products…" />
        </div>
      ) : (
        <>
          <PageHeader
            title={category.name}
            eyebrow="Hire catalogue"
            subtitle={`${category.description} · ${products.length} product${products.length === 1 ? "" : "s"} · daily hire rates, VAT incl. (demo data)`}
          />
          {products.length === 0 ? (
            <EmptyState
              title="No products in this category yet"
              description="Check back soon — or contact us and we'll source it for you."
              action={
                <Link to="/contact" className={buttonClasses("primary")}>
                  Speak to Us
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={category.name}
                  categoryImage={category.image}
                />
              ))}
            </div>
          )}
          <p className="mt-8 text-xs text-ink-400">
            Prices are per day, VAT inclusive, and are demonstration rates. Add items to your enquiry
            list and request a quote — our team will confirm availability for your date.
          </p>
        </>
      )}
    </CustomerLayout>
  );
}
