import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Field, Input, LoadingState, Modal, PageHeader, Select, StatCard } from "~/components/ui";
import { adjustInventory, getStockHistory, getInventory, updateInventory } from "~/lib/services/inventory";
import { availableCount, formatDateTime } from "~/lib/util";
import { demoCategories } from "~/lib/data/products";
import type { InventoryItem, StockMovement } from "~/lib/types";

export const Route = createFileRoute("/dashboard/inventory")({ component: InventoryPage });

const stockLabel = (value: number | null): string => value === null ? "TBC" : String(value);
const categoryName = new Map(demoCategories.map((category) => [category.id, category.name]));

function needsInformation(item: InventoryItem): boolean {
  return item.basePrice === null || item.total === null || item.variants.some((variant) => variant.stockQuantity === null);
}

function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [modal, setModal] = useState<"edit" | "adjust" | "history" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshInventory = async () => {
    const items = await getInventory();
    setInventory(items);
  };

  useEffect(() => {
    getInventory()
      .then((items) => {
        setInventory(items);
        setLoaded(true);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Inventory database is unavailable.");
        setLoaded(true);
      });
  }, []);

  const totals = useMemo(() => inventory.reduce((result, item) => ({
    total: result.total + (item.total ?? 0),
    available: result.available + (item.total === null ? 0 : Math.max(0, item.total - item.reserved - item.outOnHire - item.damaged - item.missing)),
    reserved: result.reserved + item.reserved,
    outOnHire: result.outOnHire + item.outOnHire,
  }), { total: 0, available: 0, reserved: 0, outOnHire: 0 }), [inventory]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return inventory
      .filter((item) => category === "all" || item.category === category)
      .filter((item) => {
        if (status === "active") return item.active;
        if (status === "inactive") return !item.active;
        if (status === "needs-info") return needsInformation(item);
        if (status === "low") {
          const available = availableCount(item);
          return available !== null && available <= (item.reorderLevel ?? 0);
        }
        return true;
      })
      .filter((item) => !query || `${item.name} ${item.description} ${categoryName.get(item.category)}`.toLowerCase().includes(query))
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [category, inventory, search, status]);

  const open = (item: InventoryItem, nextModal: "edit" | "adjust" | "history") => {
    setSelected(item);
    setModal(nextModal);
  };

  const closeAfterRefresh = () => {
    setModal(null);
    void refreshInventory().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not refresh inventory."));
  };

  if (!loaded) return <LoadingState label="Loading inventory…" />;
  if (error) return <DatabaseError message={error} />;

  return (
    <>
      <PageHeader title="Inventory" eyebrow="Dashboard" subtitle="Real hire stock, pricing and variant information." />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Items" value={inventory.length} hint="Active and inactive" />
        <StatCard label="Total units" value={totals.total} hint="Known stock only" />
        <StatCard label="Available" value={totals.available} tone="gold" hint="Known stock only" />
        <StatCard label="Reserved" value={totals.reserved} tone="info" hint="Upcoming bookings" />
        <StatCard label="Out on hire" value={totals.outOnHire} tone="warning" hint="With clients" />
        <StatCard label="Needs info" value={inventory.filter(needsInformation).length} tone="danger" hint="Price, stock or variants" />
      </div>

      <div className="sticky top-0 z-10 -mx-4 mb-5 border-y border-ink-200 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:rounded-xl sm:border sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <Field label="Search inventory" htmlFor="inventory-search">
            <Input id="inventory-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products…" />
          </Field>
          <Field label="Category" htmlFor="inventory-category">
            <Select id="inventory-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {demoCategories.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
            </Select>
          </Field>
          <Field label="Filter" htmlFor="inventory-status">
            <Select id="inventory-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All items</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="needs-info">Needs Information</option>
              <option value="low">Low stock</option>
            </Select>
          </Field>
        </div>
        <p className="mt-3 text-xs text-ink-500">{filtered.length} of {inventory.length} products shown. TBC means the client has not confirmed the value.</p>
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-ink-200 bg-white md:block">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-ink-200 bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
            <tr>{["Product", "Category", "Price", "Total", "Available", "Reserved", "Out on hire", "Damaged", "Status", "Actions"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr>
          </thead>
          <tbody>{filtered.map((item) => <InventoryRow key={item.id} item={item} onEdit={() => open(item, "edit")} onAdjust={() => open(item, "adjust")} onHistory={() => open(item, "history")} />)}</tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((item) => <InventoryCard key={item.id} item={item} onEdit={() => open(item, "edit")} onAdjust={() => open(item, "adjust")} onHistory={() => open(item, "history")} />)}
      </div>
      {filtered.length === 0 && <p className="rounded-xl border border-dashed border-ink-300 px-5 py-10 text-center text-sm text-ink-500">No inventory matches these filters.</p>}

      <Modal open={modal === "edit"} onClose={() => setModal(null)} title={selected ? `Edit ${selected.name}` : "Edit inventory"} size="lg">
        {selected && <EditForm item={selected} onClose={closeAfterRefresh} />}
      </Modal>
      <Modal open={modal === "adjust"} onClose={() => setModal(null)} title={selected ? `Adjust ${selected.name}` : "Adjust stock"}>
        {selected && <AdjustForm item={selected} onClose={closeAfterRefresh} />}
      </Modal>
      <Modal open={modal === "history"} onClose={() => setModal(null)} title={selected ? `${selected.name} history` : "Stock history"}>
        {selected && <History item={selected} />}
      </Modal>
    </>
  );
}

function Status({ item }: { item: InventoryItem }) {
  if (!item.active) return <Badge tone="neutral">Inactive</Badge>;
  if (needsInformation(item)) return <Badge tone="danger">Needs info</Badge>;
  const available = availableCount(item);
  if (available === 0) return <Badge tone="warning">Out of stock</Badge>;
  if (available !== null && available <= (item.reorderLevel ?? 0)) return <Badge tone="warning">Low stock</Badge>;
  return <Badge tone="success">Ready</Badge>;
}

function InventoryRow({ item, onEdit, onAdjust, onHistory }: { item: InventoryItem; onEdit: () => void; onAdjust: () => void; onHistory: () => void }) {
  const available = availableCount(item);
  return <tr className="border-b border-ink-100 last:border-0 hover:bg-champagne-100/50">
    <td className="px-4 py-3"><p className="font-semibold text-ink-900">{item.name}</p>{item.variants.length > 0 && <p className="text-xs text-ink-500">{item.variants.length} variants</p>}</td>
    <td className="px-4 py-3 text-ink-600">{categoryName.get(item.category)}</td>
    <td className="px-4 py-3 font-medium">{item.basePrice === null ? "TBC" : `R${item.basePrice}`} <span className="text-xs text-ink-400">{item.pricingUnit}</span></td>
    <td className="px-4 py-3">{stockLabel(item.total)}</td><td className="px-4 py-3 font-semibold">{stockLabel(available)}</td><td className="px-4 py-3">{item.reserved}</td><td className="px-4 py-3">{item.outOnHire}</td><td className="px-4 py-3">{item.damaged}</td><td className="px-4 py-3"><Status item={item} /></td>
    <td className="px-4 py-3"><div className="flex gap-2"><Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button><Button variant="secondary" size="sm" onClick={onAdjust}>Adjust</Button><Button variant="ghost" size="sm" onClick={onHistory}>History</Button></div></td>
  </tr>;
}

function InventoryCard({ item, onEdit, onAdjust, onHistory }: { item: InventoryItem; onEdit: () => void; onAdjust: () => void; onHistory: () => void }) {
  const available = availableCount(item);
  return <article className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-ink-900">{item.name}</p><p className="text-xs text-ink-500">{categoryName.get(item.category)}</p></div><Status item={item} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-ink-500">Price</p><p className="font-semibold">{item.basePrice === null ? "TBC" : `R${item.basePrice}`} <span className="text-xs font-normal text-ink-400">{item.pricingUnit}</span></p></div><div><p className="text-xs text-ink-500">Total / available</p><p className="font-semibold">{stockLabel(item.total)} / {stockLabel(available)}</p></div><div><p className="text-xs text-ink-500">Reserved</p><p>{item.reserved}</p></div><div><p className="text-xs text-ink-500">Out on hire / damaged</p><p>{item.outOnHire} / {item.damaged}</p></div></div>{item.variants.length > 0 && <p className="mt-3 text-xs text-ink-500">Variants: {item.variants.map((variant) => `${variant.variantName} (${stockLabel(variant.stockQuantity)})`).join(", ")}</p>}<div className="mt-4 grid grid-cols-3 gap-2"><Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button><Button variant="secondary" size="sm" onClick={onAdjust}>Adjust</Button><Button variant="ghost" size="sm" onClick={onHistory}>History</Button></div></article>;
}

function EditForm({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const [price, setPrice] = useState(item.basePrice === null ? "" : String(item.basePrice));
  const [total, setTotal] = useState(item.total === null ? "" : String(item.total));
  const [description, setDescription] = useState(item.description);
  const [active, setActive] = useState(item.active);
  const save = async () => { await updateInventory(item.id, { basePrice: price === "" ? null : Math.max(0, Number(price)), total: total === "" ? null : Math.max(0, Number(total)), description, active }); onClose(); };
  return <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Hire price (ZAR)" htmlFor="edit-price"><Input id="edit-price" type="number" min={0} value={price} onChange={(event) => setPrice(event.target.value)} placeholder="TBC" /></Field><Field label="Total stock" htmlFor="edit-total"><Input id="edit-total" type="number" min={0} value={total} onChange={(event) => setTotal(event.target.value)} placeholder="TBC" /></Field></div><Field label="Description" htmlFor="edit-description"><Input id="edit-description" value={description} onChange={(event) => setDescription(event.target.value)} /></Field><label className="flex min-h-11 items-center gap-3 text-sm font-medium text-ink-700"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active for hire</label><div className="flex justify-end gap-3"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save}>Save item</Button></div></div>;
}

function AdjustForm({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const [damaged, setDamaged] = useState(String(item.damaged));
  const [missing, setMissing] = useState(String(item.missing));
  const [notes, setNotes] = useState("");
  const save = async () => { await adjustInventory(item.id, Math.max(0, Number(damaged) || 0), Math.max(0, Number(missing) || 0), notes.trim() || "Manual stock adjustment"); onClose(); };
  return <div className="space-y-4"><p className="text-sm text-ink-600">Set the current damaged and missing counts. Available stock is derived from the total and these positions.</p><div className="grid grid-cols-2 gap-4"><Field label="Damaged" htmlFor="adjust-damaged"><Input id="adjust-damaged" type="number" min={0} value={damaged} onChange={(event) => setDamaged(event.target.value)} /></Field><Field label="Missing" htmlFor="adjust-missing"><Input id="adjust-missing" type="number" min={0} value={missing} onChange={(event) => setMissing(event.target.value)} /></Field></div><Field label="Notes" htmlFor="adjust-notes"><Input id="adjust-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Why was this adjusted?" /></Field><div className="flex justify-end gap-3"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save}>Save adjustment</Button></div></div>;
}

function DatabaseError({ message }: { message: string }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-900"><h2 className="font-display text-lg font-semibold">Inventory database unavailable</h2><p className="mt-2 text-sm">Connect the Neon database and run the inventory migration before editing stock. No browser-only fallback was used.</p><p className="mt-3 break-words text-xs text-red-700">{message}</p></div>;
}

function History({ item }: { item: InventoryItem }) {
  const [history, setHistory] = useState<StockMovement[] | null>(null);
  useEffect(() => { getStockHistory(item.id).then(setHistory); }, [item.id]);
  if (!history) return <LoadingState label="Loading history…" />;
  return history.length === 0 ? <p className="text-sm text-ink-500">No stock movements recorded yet.</p> : <ul className="divide-y divide-ink-100">{history.map((movement) => <li key={movement.id} className="py-3 text-sm"><div className="flex justify-between gap-3"><span className="font-medium capitalize text-ink-800">{movement.movementType.replaceAll("-", " ")}</span><span className="text-ink-500">{movement.quantity}</span></div><p className="text-xs text-ink-500">{formatDateTime(movement.createdAt)}{movement.notes ? ` · ${movement.notes}` : ""}</p></li>)}</ul>;
}
