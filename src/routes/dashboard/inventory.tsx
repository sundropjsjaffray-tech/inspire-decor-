import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Badge,
  Button,
  Field,
  Input,
  LoadingState,
  Modal,
  PageHeader,
  StatCard,
  Table,
} from "~/components/ui";
import { getEvents } from "~/lib/services/events";
import { getInventory, updateInventory } from "~/lib/services/inventory";
import { useStore } from "~/lib/store";
import {
  selectInventoryTotals,
  selectReservationsByItemName,
} from "~/lib/store/selectors";
import { availableCount, formatDate } from "~/lib/util";
import type { InventoryItem } from "~/lib/types";

export const Route = createFileRoute("/dashboard/inventory")({ component: InventoryPage });

/** Low-stock threshold: available below this % of total triggers the badge. */
const LOW_STOCK_RATIO = 0.15;

function InventoryPage() {
  const inventory = useStore((s) => s.inventory);

  const [loaded, setLoaded] = useState(false);
  const [adjusting, setAdjusting] = useState<InventoryItem | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getInventory(), getEvents()]).then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const totals = useStore(selectInventoryTotals);
  const reservations = useStore(selectReservationsByItemName);

  const isLow = (item: InventoryItem) =>
    availableCount(item) < Math.round(item.total * LOW_STOCK_RATIO);

  const saveAdjust = async (patch: { damaged: number; missing: number }) => {
    if (!adjusting) return;
    await updateInventory(adjusting.id, patch);
    setAdjusting(null);
  };

  if (!loaded) {
    return (
      <>
        <PageHeader title="Inventory" eyebrow="Dashboard" subtitle="Live stock positions — reserved, out on hire, damaged and missing." />
        <LoadingState label="Loading inventory…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Inventory"
        eyebrow="Dashboard"
        subtitle="Live stock positions — reserved, out on hire, damaged and missing — with low-stock warnings."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total units" value={totals.total} hint="Across all items" />
        <StatCard label="Reserved" value={totals.reserved} tone="info" hint="Held for upcoming bookings" />
        <StatCard label="Available" value={totals.available} tone="gold" hint="Ready to hire" />
        <StatCard label="Out on hire" value={totals.outOnHire} tone="warning" hint="Physically with clients" />
        <StatCard label="Damaged" value={totals.damaged} tone="warning" hint="Needs repair" />
        <StatCard label="Missing" value={totals.missing} tone="danger" hint="Unaccounted" />
      </div>

      <Table<InventoryItem>
        columns={[
          { key: "name", header: "Item", render: (i) => <span className="font-semibold text-ink-900">{i.name}</span> },
          { key: "category", header: "Category", render: (i) => <span className="capitalize text-ink-600">{i.category}</span> },
          { key: "total", header: "Total", align: "center", render: (i) => i.total },
          {
            key: "reserved",
            header: "Reserved",
            align: "center",
            render: (i) => {
              const holders = reservations.get(i.name);
              return (
                <span className="relative inline-block">
                  {i.reserved}
                  {holders && holders.length > 0 && (
                    <span className="ml-1 cursor-help text-xs text-ink-400" title={holders.map((h) => `${h.bookingName} · ${h.quantity} (${formatDate(h.eventDate)})`).join("\n")} aria-label={`Reserved for ${holders.map((h) => h.bookingName).join(", ")}`}>
                      ⓘ
                    </span>
                  )}
                </span>
              );
            },
          },
          {
            key: "available",
            header: "Available",
            align: "center",
            render: (i) => (
              <span className={availableCount(i) <= (i.reorderLevel ?? 0) ? "font-semibold text-amber-700" : "font-semibold text-ink-900"}>
                {availableCount(i)}
              </span>
            ),
          },
          { key: "outOnHire", header: "Out on Hire", align: "center", render: (i) => i.outOnHire },
          { key: "damaged", header: "Damaged", align: "center", render: (i) => i.damaged },
          { key: "missing", header: "Missing", align: "center", render: (i) => i.missing },
          {
            key: "status",
            header: "Status",
            align: "center",
            render: (i) => {
              if (isLow(i)) {
                return <Badge tone="danger">Low stock</Badge>;
              }
              if (availableCount(i) === 0) return <Badge tone="warning">Out of stock</Badge>;
              return <Badge tone="success">OK</Badge>;
            },
          },
          {
            key: "adjust",
            header: "Adjust",
            align: "right",
            render: (i) => (
              <Button variant="secondary" size="sm" onClick={() => setAdjusting(i)}>
                Adjust
              </Button>
            ),
          },
        ]}
        rows={[...inventory].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))}
        keyOf={(i) => i.id}
        emptyMessage="No inventory items."
      />
      <p className="mt-3 text-xs text-ink-400">
        Available = total − reserved − out on hire − damaged − missing. The Low stock badge
        triggers below {Math.round(LOW_STOCK_RATIO * 100)}% of total available.
      </p>

      <Modal
        open={adjusting !== null}
        onClose={() => setAdjusting(null)}
        title={adjusting ? `Adjust ${adjusting.name}` : ""}
      >
        {adjusting && (
          <AdjustForm key={adjusting.id} item={adjusting} onSave={saveAdjust} />
        )}
      </Modal>
    </>
  );
}

function AdjustForm({
  item,
  onSave,
}: {
  item: InventoryItem;
  onSave: (patch: { damaged: number; missing: number }) => void;
}) {
  const [damaged, setDamaged] = useState(item.damaged);
  const [missing, setMissing] = useState(item.missing);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Damaged" htmlFor="inv-damaged">
          <Input
            id="inv-damaged"
            type="number"
            min={0}
            value={damaged}
            onChange={(e) => setDamaged(Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>
        <Field label="Missing" htmlFor="inv-missing">
          <Input
            id="inv-missing"
            type="number"
            min={0}
            value={missing}
            onChange={(e) => setMissing(Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>
      </div>
      <p className="text-sm text-ink-500">
        Current position: <span className="font-medium">{item.total} total</span>,{" "}
        <span className="font-medium">{availableCount(item)} available</span> (updating damaged /
        missing changes availability automatically).
      </p>
      <div className="flex justify-end">
        <Button onClick={() => onSave({ damaged, missing })}>Save changes</Button>
      </div>
    </div>
  );
}
