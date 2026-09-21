/**
 * Small shared utilities. Pure functions only — no business data lives here.
 */
import type { InventoryItem } from "./types";

/** Join truthy class names (tiny clsx replacement). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Generate a reasonably-unique id with a readable prefix. */
export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Simulated network latency so loading states are demonstrable. */
export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Today as an ISO date string (yyyy-mm-dd, local time). */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** ISO date string `days` days from today (negative = past). */
export function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** True when the given ISO date falls in the current calendar month. */
export function isWithinCurrentMonth(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  );
}

/** Available hire stock: total - reserved - outOnHire - damaged - missing. */
export function availableCount(
  item: Pick<InventoryItem, "total" | "reserved" | "outOnHire" | "damaged" | "missing">
): number | null {
  if (item.total === null) return null;
  return Math.max(0, item.total - item.reserved - item.outOnHire - item.damaged - item.missing);
}

/** Format a number as ZAR ("R 1 250") using Intl. */
export function formatZAR(amount: number | null): string {
  if (amount === null) return "TBC";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const dateFmt = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Johannesburg",
});
const dateTimeFmt = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Johannesburg",
});
const monthFmt = new Intl.DateTimeFormat("en-ZA", {
  month: "short",
  year: "numeric",
  timeZone: "Africa/Johannesburg",
});

/** ISO date (yyyy-mm-dd) → "12 Oct 2026". */
export function formatDate(isoDate: string): string {
  const d = new Date(`${isoDate.slice(0, 10)}T12:00:00`);
  return Number.isNaN(d.getTime()) ? isoDate : dateFmt.format(d);
}

/** ISO datetime → "12 Oct 2026, 09:24". */
export function formatDateTime(isoDateTime: string): string {
  const d = new Date(isoDateTime);
  return Number.isNaN(d.getTime()) ? isoDateTime : dateTimeFmt.format(d);
}

/** ISO date/datetime → "Oct 2026" (month key for series). */
export function formatMonth(iso: string): string {
  const d = new Date(iso.slice(0, 10));
  return Number.isNaN(d.getTime()) ? iso : monthFmt.format(d);
}

/** "yyyy-mm" key for a date, used to group series. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}
