/**
 * Client store (zustand + persist).
 *
 * Holds the demo workflow state and UI cache. Inventory is read and mutated
 * through server functions; it is intentionally not persisted to localStorage.
 *
 * Components must NOT write to this store directly for business operations —
 * they go through `~/lib/services`, which is the seam that Supabase will
 * replace later with zero UI changes.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { demoBookings } from "~/lib/data/bookings";
import { demoEvents } from "~/lib/data/events";
import { demoInventory } from "~/lib/data/inventory";
import { demoLeads } from "~/lib/data/leads";
import { demoNotifications } from "~/lib/data/notifications";
import { demoQuotes } from "~/lib/data/quotes";
import type {
  Booking,
  EnquiryLine,
  Event,
  InventoryItem,
  StockMovement,
  Lead,
  Notification,
  Quote,
} from "~/lib/types";

export interface AppState {
  // ---- data ----
  leads: Lead[];
  quotes: Quote[];
  bookings: Booking[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  events: Event[];
  /** The customer's "add to enquiry" hire selection. */
  enquiryList: EnquiryLine[];
  notifications: Notification[];

  // ---- actions ----
  addLead: (lead: Lead) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, patch: Partial<Quote>) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => void;
  addStockMovement: (movement: StockMovement) => void;
  addToEnquiry: (productId: string, quantity: number) => void;
  updateEnquiryLine: (productId: string, quantity: number) => void;
  removeFromEnquiry: (productId: string) => void;
  clearEnquiry: () => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const initialData = {
  leads: demoLeads,
  quotes: demoQuotes,
  bookings: demoBookings,
  inventory: demoInventory,
  stockMovements: [],
  events: demoEvents,
  enquiryList: [] as EnquiryLine[],
  notifications: demoNotifications,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialData,

      addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
      updateLead: (id, patch) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l
          ),
        })),

      addQuote: (quote) => set((s) => ({ quotes: [quote, ...s.quotes] })),
      updateQuote: (id, patch) =>
        set((s) => ({ quotes: s.quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),

      addBooking: (booking) => set((s) => ({ bookings: [booking, ...s.bookings] })),
      updateBooking: (id, patch) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),

      updateInventoryItem: (id, patch) =>
        set((s) => ({
          inventory: s.inventory.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i)),
        })),
      addStockMovement: (movement) =>
        set((s) => ({ stockMovements: [movement, ...s.stockMovements] })),

      addToEnquiry: (productId, quantity) =>
        set((s) => {
          const existing = s.enquiryList.find((l) => l.productId === productId);
          if (existing) {
            return {
              enquiryList: s.enquiryList.map((l) =>
                l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l
              ),
            };
          }
          return { enquiryList: [...s.enquiryList, { productId, quantity }] };
        }),
      updateEnquiryLine: (productId, quantity) =>
        set((s) => ({
          enquiryList: s.enquiryList.map((l) =>
            l.productId === productId ? { ...l, quantity } : l
          ),
        })),
      removeFromEnquiry: (productId) =>
        set((s) => ({ enquiryList: s.enquiryList.filter((l) => l.productId !== productId) })),
      clearEnquiry: () => set({ enquiryList: [] }),

      addNotification: (notification) =>
        set((s) => ({ notifications: [notification, ...s.notifications] })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      resetDemoData: () =>
        set({
          leads: demoLeads.map((l) => ({ ...l })),
          quotes: demoQuotes.map((q) => ({ ...q })),
          bookings: demoBookings.map((b) => ({ ...b })),
          inventory: demoInventory.map((i) => ({ ...i })),
          stockMovements: [],
          events: demoEvents.map((e) => ({ ...e })),
          enquiryList: [],
          notifications: demoNotifications.map((n) => ({ ...n })),
        }),
    }),
    {
      name: "inspire-decor-store",
      // v3: replace demo inventory with the real client catalogue —
      // discard any v1 localStorage so returning visitors get the new seed.
      version: 3,
      // localStorage is unavailable during SSR — zustand falls back to a no-op
      // storage on the server, so this is safe in the TanStack Start pipeline.
      storage: createJSONStorage(() => localStorage),
      // Persist data only (functions are excluded automatically, but be explicit).
      partialize: (s) => ({
        leads: s.leads,
        quotes: s.quotes,
        bookings: s.bookings,
        events: s.events,
        enquiryList: s.enquiryList,
        notifications: s.notifications,
      }),
    }
  )
);
