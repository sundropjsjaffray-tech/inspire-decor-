import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import { Badge, EmptyState, Img, LoadingState, Modal, PageHeader, Tabs } from "~/components/ui";
import { getGallery } from "~/lib/services/content";
import type { GalleryItem } from "~/lib/types";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let alive = true;
    getGallery().then((list) => {
      if (alive) setItems(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Tabs derived from the data — never hard-coded categories.
  const tabs = useMemo(() => {
    if (!items) return [];
    const categories = Array.from(new Set(items.map((i) => i.category)));
    return [{ id: "all", label: "All" }, ...categories.map((c) => ({ id: c, label: c }))];
  }, [items]);

  const visible = items
    ? activeTab === "all"
      ? items
      : items.filter((i) => i.category === activeTab)
    : [];

  return (
    <CustomerLayout>
      <PageHeader
        title="Event Gallery"
        eyebrow="Our work"
        subtitle="Weddings, matric farewells, corporate galas and private celebrations — a look at the events we've styled. Sample demonstration photos."
      />
      {!items ? (
        <LoadingState label="Loading gallery…" />
      ) : (
        <>
          <div className="mb-6">
            <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
          </div>
          {visible.length === 0 ? (
            <EmptyState
              title="No photos in this category yet"
              description="Check back soon — new events are added regularly."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="group relative block overflow-hidden rounded-xl border border-ink-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                  aria-label={`View photo: ${item.caption}`}
                >
                  <Img
                    src={item.image}
                    alt={item.caption}
                    fallbackLabel="Event"
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 to-transparent px-3 pb-2 pt-8">
                    <p className="truncate text-xs font-medium text-white">{item.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.caption} size="lg">
            {selected && (
              <div>
                <Img
                  src={selected.image?.replace("w=900", "w=1400")}
                  alt={selected.caption}
                  fallbackLabel="Event"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-ink-500">{selected.caption}</p>
                  <Badge tone="gold">{selected.category}</Badge>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </CustomerLayout>
  );
}
