import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Badge,
  Button,
  LoadingState,
  Modal,
  PageHeader,
  PriceTag,
  Select,
  Table,
} from "~/components/ui";
import { getBookings, updateBookingStatus } from "~/lib/services/bookings";
import { useStore } from "~/lib/store";
import { bookingStatusMeta, eventTypeLabels } from "~/lib/statusLabels";
import { formatDate, formatZAR } from "~/lib/util";
import type { Booking, BookingStatus, InventoryItem } from "~/lib/types";

export const Route = createFileRoute("/dashboard/bookings")({ component: BookingsPage });

const STATUSES: BookingStatus[] = [
  "QUOTE",
  "AWAITING_DEPOSIT",
  "CONFIRMED",
  "PREPARING",
  "OUT_ON_HIRE",
  "COMPLETED",
  "CANCELLED",
];

function BookingsPage() {
  const bookings = useStore((s) => s.bookings);
  const quotes = useStore((s) => s.quotes);
  const leads = useStore((s) => s.leads);
  const inventory = useStore((s) => s.inventory);

  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getBookings().then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const changeStatus = async (id: string, status: BookingStatus) => {
    setSavingId(id);
    try {
      await updateBookingStatus(id, status);
    } finally {
      setSavingId(null);
    }
  };

  const selected = selectedId ? bookings.find((b) => b.id === selectedId) : null;
  const customerName = (b: Booking) =>
    leads.find((l) => l.id === b.leadId)?.customer.name ?? b.customerId;

  const rows = [...bookings].sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  if (!loaded) {
    return (
      <>
        <PageHeader title="Bookings" eyebrow="Dashboard" subtitle="Confirmed work, deposits and balances — from quote to completion." />
        <LoadingState label="Loading bookings…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        eyebrow="Dashboard"
        subtitle="Confirmed work, deposits and balances — from quote to completion."
      />

      <Table<Booking>
        columns={[
          {
            key: "customer",
            header: "Customer",
            render: (b) => (
              <button
                type="button"
                onClick={() => setSelectedId(b.id)}
                className="text-left font-semibold text-ink-900 hover:text-gold-700 hover:underline"
              >
                {customerName(b)}
              </button>
            ),
          },
          {
            key: "eventName",
            header: "Event",
            render: (b) => (
              <span>
                {b.eventName}
                <span className="block text-xs text-ink-400">{eventTypeLabels[b.eventType]}</span>
              </span>
            ),
          },
          { key: "eventDate", header: "Event Date", render: (b) => formatDate(b.eventDate) },
          { key: "venue", header: "Venue", render: (b) => b.venue || "—" },
          { key: "guests", header: "Guests", align: "center", render: (b) => b.guests },
          {
            key: "totalAmount",
            header: "Quote Value",
            align: "right",
            render: (b) => <PriceTag amount={b.totalAmount} />,
          },
          {
            key: "depositPaid",
            header: "Deposit",
            align: "right",
            render: (b) => <PriceTag amount={b.depositPaid} />,
          },
          {
            key: "balanceDue",
            header: "Balance",
            align: "right",
            render: (b) => (
              <span className={b.balanceDue > 0 ? "font-semibold text-ink-900" : "text-ink-400"}>
                {formatZAR(b.balanceDue)}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (b) => {
              const meta = bookingStatusMeta[b.status];
              return <Badge tone={meta.tone}>{meta.label}</Badge>;
            },
          },
          {
            key: "controls",
            header: "Change status",
            render: (b) => (
              <Select
                aria-label={`Change status for ${b.eventName}`}
                className="w-44"
                value={b.status}
                disabled={savingId === b.id}
                onChange={(e) => changeStatus(b.id, e.target.value as BookingStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {bookingStatusMeta[s].label}
                  </option>
                ))}
              </Select>
            ),
          },
        ]}
        rows={rows}
        keyOf={(b) => b.id}
        emptyMessage="No bookings yet — convert a quote to create one."
      />

      <Modal
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        size="lg"
        title={selected?.eventName ?? ""}
        footer={
          <Button variant="secondary" onClick={() => setSelectedId(null)}>
            Close
          </Button>
        }
      >
        {selected && (
          <BookingDetail
            booking={selected}
            customerName={customerName(selected)}
            quote={quotes.find((q) => q.id === selected.quoteId)}
            inventory={inventory}
          />
        )}
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------------------

function BookingDetail({
  booking,
  customerName,
  quote,
  inventory,
}: {
  booking: Booking;
  customerName: string;
  quote?: { id: string; items: { name: string; quantity: number; type: string }[] };
  inventory: InventoryItem[];
}) {
  const meta = bookingStatusMeta[booking.status];
  const reservations = (quote?.items ?? [])
    .filter((i) => i.type === "product")
    .map((i) => ({ ...i, stock: inventory.find((inv) => inv.name === i.name) }));

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-800">{children ?? "—"}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={meta.tone}>{meta.label}</Badge>
        <span className="text-xs text-ink-400">
          {booking.id}
          {booking.quoteId ? ` · from quote ${booking.quoteId}` : " · no linked quote"}
        </span>
      </div>

      <section>
        <h3 className="mb-2 font-display text-base font-semibold text-ink-900">Details</h3>
        <dl className="grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-2">
          <Row label="Customer">{customerName}</Row>
          <Row label="Event type">{eventTypeLabels[booking.eventType]}</Row>
          <Row label="Event date">{formatDate(booking.eventDate)}</Row>
          <Row label="Venue">{booking.venue}</Row>
          <Row label="Guests">{booking.guests}</Row>
          <Row label="Created">{formatDate(booking.createdAt)}</Row>
          <Row label="Setup time">{booking.setupTime}</Row>
          <Row label="Event time">{booking.eventTime}</Row>
          <Row label="Collection time">{booking.collectionTime}</Row>
        </dl>
      </section>

      <section>
        <h3 className="mb-2 font-display text-base font-semibold text-ink-900">Payment</h3>
        <dl className="grid gap-3 rounded-lg border border-ink-200 bg-ink-50/50 p-4 sm:grid-cols-3">
          <Row label="Quote value">
            <PriceTag amount={booking.totalAmount} />
          </Row>
          <Row label="Deposit paid">
            <PriceTag amount={booking.depositPaid} />
          </Row>
          <Row label="Balance due">
            <PriceTag amount={booking.balanceDue} />
          </Row>
        </dl>
        {booking.notes && (
          <p className="mt-2 rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-700">
            {booking.notes}
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-2 font-display text-base font-semibold text-ink-900">
          Reserved inventory
        </h3>
        {reservations.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink-300 p-4 text-sm text-ink-500">
            No hire products on the linked quote — this booking holds no stock reservations.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-ink-200">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 text-right font-semibold">Reserved qty</th>
                  <th className="px-3 py-2 text-right font-semibold">Stock position</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.name} className="border-t border-ink-100">
                    <td className="px-3 py-2 font-medium text-ink-900">{r.name}</td>
                    <td className="px-3 py-2 text-right text-ink-800">{r.quantity}</td>
                    <td className="px-3 py-2 text-right text-ink-500">
                      {r.stock ? `${r.stock.reserved} reserved / ${r.stock.total} total` : "no stock record"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-xs text-ink-400">
          Reservations are created automatically when a quote is converted to a booking and are
          reflected live on the Inventory page.
        </p>
      </section>

      {booking.isDemo && (
        <p className="text-xs text-ink-400">Demonstration record — sample data for preview.</p>
      )}
    </div>
  );
}
