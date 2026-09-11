/**
 * Bookings service — async, backed by the client store.
 */
import { useStore } from "~/lib/store";
import { delay, todayISO, uid } from "~/lib/util";
import type { Booking, BookingStatus, EventType } from "~/lib/types";

export interface NewBookingInput {
  quoteId?: string;
  leadId: string;
  customerId: string;
  eventName: string;
  eventType: EventType;
  eventDate: string;
  venue: string;
  guests: number;
  totalAmount: number;
  depositPaid?: number;
  balanceDue?: number;
  setupTime?: string;
  eventTime?: string;
  collectionTime?: string;
  notes?: string;
}

export async function createBooking(input: NewBookingInput): Promise<Booking> {
  await delay();
  const booking: Booking = {
    id: uid("B"),
    quoteId: input.quoteId,
    leadId: input.leadId,
    customerId: input.customerId,
    eventName: input.eventName,
    eventType: input.eventType,
    eventDate: input.eventDate,
    venue: input.venue,
    guests: input.guests,
    status: "AWAITING_DEPOSIT",
    totalAmount: input.totalAmount,
    depositPaid: input.depositPaid ?? 0,
    balanceDue: input.balanceDue ?? input.totalAmount,
    setupTime: input.setupTime,
    eventTime: input.eventTime,
    collectionTime: input.collectionTime,
    notes: input.notes,
    createdAt: todayISO(),
    isDemo: false,
  };
  useStore.getState().addBooking(booking);
  return booking;
}

export async function getBookings(): Promise<Booking[]> {
  await delay();
  return useStore.getState().bookings;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  await delay(200);
  return useStore.getState().bookings.find((b) => b.id === id) ?? null;
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  await delay(250);
  const state = useStore.getState();
  const booking = state.bookings.find((b) => b.id === id);
  if (!booking) throw new Error(`Booking not found: ${id}`);
  state.updateBooking(id, { status });
  return { ...booking, status };
}
