/**
 * QuoteBuilder — the dashboard's quote-building workbench.
 *
 * - picks a lead (or is preselected via ?leadId=)
 * - adds hire products with quantity steppers (capped at live available stock)
 * - adds priced services (setup/delivery map to the quote's fee rows)
 * - live totals: subtotal + delivery + setup − discount = total,
 *   deposit = depositRate × total, balance = total − deposit
 * - "Generate Quote" creates the quote in the store and shows the printable
 *   document preview (QuoteDocument), with the Resend email seam commented.
 *
 * All business data comes from services/data modules — nothing hard-coded.
 */
import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Input,
  LoadingState,
  Modal,
  PriceTag,
  Select,
} from "~/components/ui";
import { quoteDefaults } from "~/lib/data/quoteServices";
import { QuoteDocument } from "./QuoteDocument";
import { getProducts } from "~/lib/services/products";
import { getQuoteServices, createQuote, updateQuoteStatus } from "~/lib/services/quotes";
import { useStore } from "~/lib/store";
import { cn, formatZAR } from "~/lib/util";
import type { ContactDetails } from "~/lib/data/site";
import type { Product, Quote, QuoteService } from "~/lib/types";

export interface QuoteBuilderProps {
  initialLeadId?: string;
  contact?: ContactDetails;
  onBack: () => void;
}

interface DiscountState {
  type: "rand" | "pct";
  value: number;
}

const SERVICE_FEE_IDS = new Set(["setup", "delivery"]);

export function QuoteBuilder({ initialLeadId, contact, onBack }: QuoteBuilderProps) {
  const leads = useStore((s) => s.leads);

  const [products, setProducts] = useState<Product[] | null>(null);
  const [services, setServices] = useState<QuoteService[] | null>(null);
  const [leadId, setLeadId] = useState<string>(initialLeadId ?? "");
  const [productQtys, setProductQtys] = useState<Record<string, number>>({});
  const [serviceQtys, setServiceQtys] = useState<Record<string, number>>({});
  const [servicePrices, setServicePrices] = useState<Record<string, number>>({});
  const [discount, setDiscount] = useState<DiscountState>({ type: "rand", value: 0 });
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Quote | null>(null);

  // Load catalogues once.
  useEffect(() => {
    let alive = true;
    Promise.all([getProducts(), getQuoteServices()]).then(([p, sv]) => {
      if (!alive) return;
      setProducts(p);
      setServices(sv);
      // Seed default prices for delivery/setup from the catalogue.
      const prices: Record<string, number> = {};
      for (const s of sv) prices[s.id] = s.unitPrice;
      setServicePrices(prices);
    });
    return () => {
      alive = false;
    };
  }, []);

  const lead = useMemo(() => leads.find((l) => l.id === leadId), [leads, leadId]);

  // Prefill from the lead (enquiry cart + a sensible setup/delivery default).
  const selectLead = (id: string) => {
    setLeadId(id);
    setError(null);
    const l = leads.find((x) => x.id === id);
    if (!l || !products) return;
    const qtys: Record<string, number> = {};
    for (const line of l.enquiryLines ?? []) {
      const p = products.find((pr) => pr.id === line.productId);
      if (!p) continue;
      const max = p.quantityAvailable ?? 0;
      qtys[p.id] = Math.min(line.quantity, max || line.quantity);
    }
    setProductQtys(qtys);
    const sv: Record<string, number> = { delivery: 1, setup: 1 };
    if (l.services?.includes("draping") && l.guests > 0) {
      sv["draping"] = Math.min(Math.max(l.guests, 50), 300);
    }
    setServiceQtys((prev) => ({ ...prev, ...sv }));
  };

  // Handle preselection once catalogues are loaded.
  const preselected = useMemo(() => initialLeadId, [initialLeadId]);
  useEffect(() => {
    if (preselected && products && leadId !== preselected) {
      selectLead(preselected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselected, products]);

  const setQty = (
    setter: (fn: (prev: Record<string, number>) => Record<string, number>) => void,
    key: string,
    value: number
  ) => setter((prev) => ({ ...prev, [key]: Math.max(0, value) }));

  // ---- live math -----------------------------------------------------------
  const productLines = useMemo(
    () =>
      (products ?? [])
        .filter((p) => p.hirePrice !== null && (productQtys[p.id] ?? 0) > 0)
        .map((p) => {
          const quantity = productQtys[p.id] ?? 0;
          return {
            type: "product" as const,
            refId: p.id,
            name: p.name,
            quantity,
            unitPrice: p.hirePrice as number,
            lineTotal: quantity * (p.hirePrice as number),
          };
        }),
    [products, productQtys]
  );

  const serviceLines = useMemo(
    () =>
      (services ?? [])
        .filter((s) => !SERVICE_FEE_IDS.has(s.id) && (serviceQtys[s.id] ?? 0) > 0)
        .map((s) => {
          const quantity = serviceQtys[s.id] ?? 0;
          const unitPrice = servicePrices[s.id] ?? s.unitPrice;
          return {
            type: "service" as const,
            refId: s.id,
            name: s.name,
            quantity,
            unitPrice,
            lineTotal: quantity * unitPrice,
          };
        }),
    [services, serviceQtys, servicePrices]
  );

  const subtotal = useMemo(
    () => productLines.reduce((sum, l) => sum + l.lineTotal, 0) +
      serviceLines.reduce((sum, l) => sum + l.lineTotal, 0),
    [productLines, serviceLines]
  );

  const deliveryFee = (serviceQtys["delivery"] ?? 0) > 0 ? (servicePrices["delivery"] ?? 0) : 0;
  const setupFee = (serviceQtys["setup"] ?? 0) > 0 ? (servicePrices["setup"] ?? 0) : 0;

  const discountAmount =
    discount.type === "pct" ? Math.round((subtotal * discount.value) / 100) : discount.value;

  const total = Math.max(0, subtotal + deliveryFee + setupFee - discountAmount);
  const deposit = Math.round(total * quoteDefaults.depositRate);
  const balance = total - deposit;

  const discountText =
    discountAmount > 0
      ? discount.type === "pct"
        ? `${discount.value}% (−${formatZAR(discountAmount)})`
        : `−${formatZAR(discountAmount)}`
      : "—";

  const hasItems = productLines.length + serviceLines.length > 0;

  const generate = async () => {
    if (!lead || !hasItems) return;
    setGenerating(true);
    setError(null);
    try {
      const quote = await createQuote({
        leadId: lead.id,
        customerId: lead.customer.id,
        items: [...productLines, ...serviceLines],
        deliveryFee,
        setupFee,
        discount: discountAmount,
        notes: notes.trim() || undefined,
        validUntil: new Date(Date.now() + quoteDefaults.validDays * 86_400_000)
          .toISOString()
          .slice(0, 10),
      });
      // Generating the quote document is the send step in this prototype (the
      // Resend email seam comes later), so it leaves the builder already SENT —
      // which is what enables "Convert to Booking" in the quotes list.
      const sent = await updateQuoteStatus(quote.id, "SENT");
      setPreview(sent);
    } catch {
      setError("Could not create the quote. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (!products || !services) {
    return <LoadingState label="Loading quote builder…" />;
  }

  return (
    <div className="space-y-6">
      {/* Lead selector */}
      <Card>
        <CardHeader
          title="1 · Lead"
          subtitle="Who is this quote for? Selecting a lead pulls in their event and enquiry details."
        />
        <div className="max-w-md">
          <Field label="Lead" htmlFor="qb-lead">
            <Select
              id="qb-lead"
              value={leadId}
              onChange={(e) => selectLead(e.target.value)}
            >
              <option value="">Select a lead…</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.customer.name} — {l.eventType} · {l.guests} guests
                </option>
              ))}
            </Select>
          </Field>
        </div>
        {lead && (
          <div className="mt-4 grid gap-2 rounded-lg bg-champagne-100/70 p-4 text-sm text-ink-700 sm:grid-cols-2 lg:grid-cols-4">
            <p><span className="font-semibold">Customer:</span> {lead.customer.name}</p>
            <p><span className="font-semibold">Event:</span> {lead.eventType}</p>
            <p><span className="font-semibold">Date:</span> {lead.eventDate}</p>
            <p><span className="font-semibold">Guests:</span> {lead.guests}</p>
            {lead.venue && <p><span className="font-semibold">Venue:</span> {lead.venue}</p>}
            {lead.enquiryLines && lead.enquiryLines.length > 0 && (
              <p className="sm:col-span-2">
                <span className="font-semibold">Enquiry cart:</span>{" "}
                {lead.enquiryLines.length} item type(s) pre-filled — adjust below.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Products */}
      <Card>
        <CardHeader
          title="2 · Hire products"
          subtitle="Search and pick catalogue items. Quantities are capped at stock available for the event."
        />
        <ProductPicker
          products={products}
          qtys={productQtys}
          availableFor={(product) => product.quantityAvailable ?? 0}
          onChange={(id, qty) => setQty(setProductQtys, id, qty)}
        />
      </Card>

      {/* Services */}
      <Card>
        <CardHeader
          title="3 · Services"
          subtitle="Priced add-ons. Delivery and Setup map to their own totals rows; the rest are line items."
        />
        <div className="space-y-2">
          {services.map((s) => {
            const qty = serviceQtys[s.id] ?? 0;
            const isFee = SERVICE_FEE_IDS.has(s.id);
            const price = servicePrices[s.id] ?? s.unitPrice;
            const max = isFee ? 1 : 999;
            return (
              <div
                key={s.id}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-200 px-4 py-3",
                  qty > 0 && "border-gold-400 bg-gold-50/40"
                )}
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink-900">
                    {s.name}
                    {isFee && (
                      <Badge tone="gold" className="ml-2">Fee row</Badge>
                    )}
                  </p>
                  {s.description && <p className="text-xs text-ink-500">{s.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-sm text-ink-600">
                    R
                    <Input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) =>
                        setServicePrices((prev) => ({
                          ...prev,
                          [s.id]: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-24"
                      aria-label={`${s.name} price`}
                    />
                    <span className="text-xs text-ink-400">{s.unit}</span>
                  </label>
                  <QtyStepper
                    label={`${s.name} quantity`}
                    value={qty}
                    max={max}
                    onChange={(v) => setQty(setServiceQtys, s.id, v)}
                  />
                  <span className="w-24 text-right font-semibold text-ink-900">
                    {formatZAR(qty * price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader
          title="4 · Totals"
          subtitle="Subtotal + delivery + setup − discount = total. Deposit configurable in data (50%)."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Discount type" htmlFor="qb-disc-type">
                <Select
                  id="qb-disc-type"
                  value={discount.type}
                  onChange={(e) => setDiscount((d) => ({ ...d, type: e.target.value as "rand" | "pct" }))}
                >
                  <option value="rand">Rand (R)</option>
                  <option value="pct">Percent (%)</option>
                </Select>
              </Field>
              <Field label="Discount value" htmlFor="qb-disc-value">
                <Input
                  id="qb-disc-value"
                  type="number"
                  min={0}
                  value={discount.value}
                  onChange={(e) =>
                    setDiscount((d) => ({ ...d, value: Math.max(0, Number(e.target.value) || 0) }))
                  }
                />
              </Field>
            </div>
            <Field label="Quote notes (shown on the document)" htmlFor="qb-notes">
              <Input
                id="qb-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Champagne & blush package"
              />
            </Field>
            <div className="flex flex-wrap gap-3">
              <Button onClick={generate} disabled={!lead || !hasItems || generating}>
                {generating ? "Generating…" : "Generate Quote"}
              </Button>
              <Button variant="secondary" onClick={onBack}>
                Back to quotes
              </Button>
            </div>
            {!lead && <p className="text-sm text-amber-700">Select a lead to generate a quote.</p>}
            {lead && !hasItems && (
              <p className="text-sm text-amber-700">Add at least one product or service.</p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="rounded-lg border border-ink-200 bg-ink-50/60 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
              Live calculation
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-600">Subtotal ({productLines.length + serviceLines.length} lines)</dt><dd className="font-medium text-ink-900">{formatZAR(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Delivery</dt><dd className="font-medium text-ink-900">{formatZAR(deliveryFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Setup</dt><dd className="font-medium text-ink-900">{formatZAR(setupFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Discount</dt><dd className="font-medium text-ink-900">{discountText}</dd></div>
              <div className="flex justify-between border-t border-ink-200 pt-2 text-base font-bold text-ink-950"><dt>Total</dt><dd><PriceTag amount={total} /></dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Deposit required ({Math.round(quoteDefaults.depositRate * 100)}%)</dt><dd className="font-semibold text-gold-700">{formatZAR(deposit)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Balance due</dt><dd className="font-medium text-ink-900">{formatZAR(balance)}</dd></div>
            </dl>
          </div>
        </div>
      </Card>

      {/* Preview modal */}
      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={`Quote ${preview?.id ?? ""} — ready to send`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPreview(null)}>
              Close
            </Button>
            <Button onClick={() => { setPreview(null); onBack(); }}>
              Done — view in list
            </Button>
          </>
        }
      >
        {preview && (
          <div className="space-y-4">
            <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-800">
              This is the document the client receives.{" "}
              <span className="font-semibold">Email note:</span> when Resend is connected,
              the send happens server-side (createServerFn / api route) — never in the
              browser — using exactly this rendered document.
            </p>
            <QuoteDocument quote={preview} lead={lead} contact={contact} />
          </div>
        )}
      </Modal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function QtyStepper({
  label,
  value,
  max,
  min = 0,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
      >
        −
      </Button>
      <span className="w-12 text-center text-sm font-semibold text-ink-900" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        +
      </Button>
    </div>
  );
}

function ProductPicker({
  products,
  qtys,
  availableFor,
  onChange,
}: {
  products: Product[];
  qtys: Record<string, number>;
  availableFor: (product: Product) => number;
  onChange: (id: string, qty: number) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? products.filter((p) =>
        `${p.name} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : products;

  if (filtered.length === 0) {
    return <EmptyState title="No products match" description={`Nothing found for “${query}”.`} />;
  }

  return (
    <div>
      <div className="mb-3 max-w-sm">
        <Field label="Search products" htmlFor="qb-search">
          <Input
            id="qb-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Dinner Plate, Chair Cover…"
          />
        </Field>
      </div>
      <ul className="max-h-96 divide-y divide-ink-100 overflow-y-auto rounded-lg border border-ink-200">
        {filtered.map((p) => {
          const available = p.hirePrice === null ? 0 : availableFor(p);
          const qty = qtys[p.id] ?? 0;
          const shortage = qty > available;
          return (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
              <div className="min-w-0">
                <p className="font-medium text-ink-900">
                  {p.name}
                  <span className="ml-2 text-xs font-normal text-ink-400">{p.category}</span>
                </p>
                <p className="text-xs text-ink-500">
                  {formatZAR(p.hirePrice)} {p.unit}
                  <span className="mx-1 text-ink-300">·</span>
                  {available} available
                </p>
                {shortage && (
                  <p className="text-xs font-medium text-amber-700">
                    Only {available} available for this event — quantity capped.
                  </p>
                )}
              </div>
              <QtyStepper
                label={`${p.name} quantity`}
                value={Math.min(qty, available)}
                max={available}
                min={1}
                onChange={(v) => onChange(p.id, v)}
              />
              {qty > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(p.id, 0)}
                >
                  Remove
                </Button>
              )}
              <span className="w-24 text-right font-semibold text-ink-900">
                {formatZAR(p.hirePrice === null ? null : Math.min(qty, available) * p.hirePrice)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
