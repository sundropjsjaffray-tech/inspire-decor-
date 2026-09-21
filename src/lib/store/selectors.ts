/**
 * Derived selectors + dashboard stats hook.
 *
 * Pure functions over the store state (safe to call anywhere), plus a hook
 * that subscribes to the individual primitive values so re-renders stay tight.
 * Every dashboard number flows through here — nothing is hard-coded in routes.
 */
import {
  availableCount,
  isWithinCurrentMonth,
  monthKey,
} from "~/lib/util";
import type { AppState } from "./index";
import { useStore } from "./index";
import type {
  Booking,
  Event,
  InventoryItem,
  Lead,
  Quote,
} from "~/lib/types";
import { demoProducts } from "~/lib/data/products";

// ---------------------------------------------------------------------------
// Headline stats
// ---------------------------------------------------------------------------

export const selectRevenueThisMonth = (s: AppState): number =>
  s.bookings
    .filter((b) => b.status !== "CANCELLED" && isWithinCurrentMonth(b.eventDate))
    .reduce((sum, b) => sum + b.totalAmount, 0);

export const selectPendingQuotes = (s: AppState): number =>
  s.quotes.filter((q) => q.status === "DRAFT" || q.status === "SENT").length;

export const selectNewLeads = (s: AppState): Lead[] =>
  s.leads.filter((l) => l.status === "NEW");

export const selectLeadsByStatus = (s: AppState, status: Lead["status"]): Lead[] =>
  s.leads.filter((l) => l.status === status);

/** Confirmed work: bookings past the quote stage, excluding cancelled/completed. */
export const selectConfirmedBookings = (s: AppState): Booking[] =>
  s.bookings.filter((b) =>
    ["CONFIRMED", "PREPARING", "OUT_ON_HIRE"].includes(b.status)
  );

export const selectUpcomingEventsList = (s: AppState): Event[] =>
  s.events
    .filter((e) => e.status !== "CANCELLED" && new Date(`${e.date}T23:59:59`).getTime() >= Date.now())
    .sort((a, b) => a.date.localeCompare(b.date));

export const selectUpcomingEvents = (s: AppState): number => selectUpcomingEventsList(s).length;

export const selectLowStockItems = (s: AppState): InventoryItem[] =>
  s.inventory.filter((i) => {
    const available = availableCount(i);
    return available !== null && available <= (i.reorderLevel ?? 0);
  });

export const selectOutstandingPayments = (s: AppState): number =>
  s.bookings
    .filter((b) => b.status !== "CANCELLED" && b.status !== "COMPLETED")
    .reduce((sum, b) => sum + b.balanceDue, 0);

export const selectFollowUpsDue = (s: AppState): number =>
  s.leads.filter((l) => l.status === "FOLLOW_UP").length;

export const selectFollowUpsList = (s: AppState): Lead[] =>
  s.leads
    .filter((l) => l.status === "FOLLOW_UP")
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

export const selectBookingsByStatus = (s: AppState, status: Booking["status"]): Booking[] =>
  s.bookings.filter((b) => b.status === status);

export const selectUnreadNotifications = (s: AppState): number =>
  s.notifications.filter((n) => !n.read).length;

/** Latest `count` leads by created date — the "recent enquiries" list. */
export const selectRecentLeads = (s: AppState, count = 5): Lead[] =>
  [...s.leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, count);

/** Next `count` upcoming events. */
export const selectUpcomingEventsPreview = (s: AppState, count = 5): Event[] =>
  selectUpcomingEventsList(s).slice(0, count);

/** Booking that already exists for a quote (prevents double conversion). */
export const selectBookingByQuoteId = (s: AppState, quoteId: string): Booking | undefined =>
  s.bookings.find((b) => b.quoteId === quoteId);

// ---------------------------------------------------------------------------
// Monthly series (last `months` months, keyed on the business event date)
// ---------------------------------------------------------------------------

export interface MonthPoint {
  key: string; // "yyyy-mm"
  label: string; // "Oct 2026"
  value: number;
}

/** Last `months` month keys, oldest → newest. */
function lastMonthKeys(months: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

function toSeries(
  keys: string[],
  counts: Map<string, number>
): MonthPoint[] {
  return keys.map((k) => ({
    key: k,
    label: new Intl.DateTimeFormat("en-ZA", { month: "short", year: "numeric" }).format(
      new Date(`${k}-01T12:00:00`)
    ),
    value: counts.get(k) ?? 0,
  }));
}

/** Revenue per month from non-cancelled bookings, by event date. */
export const selectMonthlyRevenueSeries = (s: AppState, months = 6): MonthPoint[] => {
  const counts = new Map<string, number>();
  for (const b of s.bookings) {
    if (b.status === "CANCELLED") continue;
    const k = monthKey(b.eventDate);
    counts.set(k, (counts.get(k) ?? 0) + b.totalAmount);
  }
  return toSeries(lastMonthKeys(months), counts);
};

/** Non-cancelled bookings won per month (by event date). */
export const selectMonthlyBookingsSeries = (s: AppState, months = 6): MonthPoint[] => {
  const counts = new Map<string, number>();
  for (const b of s.bookings) {
    if (b.status === "CANCELLED") continue;
    const k = monthKey(b.eventDate);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return toSeries(lastMonthKeys(months), counts);
};

/** Leads created per month (by createdAt). */
export const selectMonthlyLeadsSeries = (s: AppState, months = 6): MonthPoint[] => {
  const counts = new Map<string, number>();
  for (const l of s.leads) {
    const k = monthKey(l.createdAt);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return toSeries(lastMonthKeys(months), counts);
};

// ---------------------------------------------------------------------------
// Conversion & value
// ---------------------------------------------------------------------------

/** Quote → booking conversion: bookings linked to a quote ÷ total quotes. */
export const selectQuoteConversion = (s: AppState): { converted: number; total: number; rate: number } => {
  const total = s.quotes.length;
  const converted = s.bookings.filter((b) => b.quoteId).length;
  return { converted, total, rate: total === 0 ? 0 : converted / total };
};

/** Average value of non-cancelled bookings. */
export const selectAverageBookingValue = (s: AppState): number => {
  const active = s.bookings.filter((b) => b.status !== "CANCELLED");
  if (active.length === 0) return 0;
  return active.reduce((sum, b) => sum + b.totalAmount, 0) / active.length;
};

/** Average value per month (trend for reports), by event date. */
export const selectMonthlyAverageValueSeries = (s: AppState, months = 6): MonthPoint[] => {
  const totals = new Map<string, { sum: number; n: number }>();
  for (const b of s.bookings) {
    if (b.status === "CANCELLED") continue;
    const k = monthKey(b.eventDate);
    const cur = totals.get(k) ?? { sum: 0, n: 0 };
    totals.set(k, { sum: cur.sum + b.totalAmount, n: cur.n + 1 });
  }
  return lastMonthKeys(months).map((k) => {
    const cur = totals.get(k);
    return {
      key: k,
      label: new Intl.DateTimeFormat("en-ZA", { month: "short", year: "numeric" }).format(
        new Date(`${k}-01T12:00:00`)
      ),
      value: cur && cur.n > 0 ? Math.round(cur.sum / cur.n) : 0,
    };
  });
};

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export const selectInventoryTotals = (s: AppState) => {
  const totals = { total: 0, reserved: 0, available: 0, outOnHire: 0, damaged: 0, missing: 0 };
  for (const i of s.inventory) {
    totals.total += i.total ?? 0;
    totals.reserved += i.reserved;
    totals.outOnHire += i.outOnHire;
    totals.damaged += i.damaged;
    totals.missing += i.missing;
    totals.available += availableCount(i) ?? 0;
  }
  return totals;
};

/**
 * Which bookings hold reservations for each inventory item.
 * Derived from bookings → quotes → product lines matched by name.
 */
export interface ReservationSource {
  bookingId: string;
  bookingName: string;
  eventDate: string;
  quantity: number;
}

export const selectReservationsByItemName = (
  s: AppState
): Map<string, ReservationSource[]> => {
  const byItem = new Map<string, ReservationSource[]>();
  for (const booking of s.bookings) {
    if (booking.status === "CANCELLED" || booking.status === "COMPLETED") continue;
    if (!booking.quoteId) continue;
    const quote = s.quotes.find((q) => q.id === booking.quoteId);
    if (!quote) continue;
    for (const line of quote.items) {
      if (line.type !== "product") continue;
      const product = demoProducts.find((entry) => entry.id === line.refId);
      const inventoryItem = product
        ? s.inventory.find((entry) => entry.id === product.inventoryItemId)
        : s.inventory.find((entry) => entry.name === line.name);
      const key = inventoryItem?.name ?? line.name;
      const existing = byItem.get(key) ?? [];
      existing.push({
        bookingId: booking.id,
        bookingName: booking.eventName,
        eventDate: booking.eventDate,
        quantity: line.quantity,
      });
      byItem.set(key, existing);
    }
  }
  return byItem;
};

/** Reserved + out-on-hire ratio per category (utilisation). */
export const selectInventoryUtilisationByCategory = (s: AppState) => {
  const per = new Map<string, { total: number; inUse: number }>();
  for (const i of s.inventory) {
    const cur = per.get(i.category) ?? { total: 0, inUse: 0 };
    cur.total += i.total ?? 0;
    cur.inUse += i.reserved + i.outOnHire;
    per.set(i.category, cur);
  }
  return Array.from(per.entries()).map(([category, v]) => ({
    category,
    total: v.total,
    inUse: v.inUse,
    ratio: v.total === 0 ? 0 : v.inUse / v.total,
  }));
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface DashboardStats {
  revenueThisMonth: number;
  pendingQuotes: number;
  upcomingEvents: number;
  lowStockCount: number;
  outstandingPayments: number;
  followUpsDue: number;
  newLeads: number;
  confirmedBookings: number;
}

/** Subscribe to all dashboard headline numbers with primitive selectors. */
export function useDashboardStats(): DashboardStats {
  const revenueThisMonth = useStore(selectRevenueThisMonth);
  const pendingQuotes = useStore(selectPendingQuotes);
  const upcomingEvents = useStore(selectUpcomingEvents);
  const lowStockCount = useStore((s) => selectLowStockItems(s).length);
  const outstandingPayments = useStore(selectOutstandingPayments);
  const followUpsDue = useStore(selectFollowUpsDue);
  const newLeads = useStore((s) => selectNewLeads(s).length);
  const confirmedBookings = useStore((s) => selectConfirmedBookings(s).length);
  return {
    revenueThisMonth,
    pendingQuotes,
    upcomingEvents,
    lowStockCount,
    outstandingPayments,
    followUpsDue,
    newLeads,
    confirmedBookings,
  };
}

/** Convenience: read the whole store's derived quote summary for one quote. */
export const selectQuoteById = (s: AppState, id: string): Quote | undefined =>
  s.quotes.find((q) => q.id === id);
