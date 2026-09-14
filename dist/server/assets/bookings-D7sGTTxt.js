import { u as useStore } from "./index-CtB_iAzP.js";
import { d as delay, t as todayISO, u as uid } from "./util-D5Y4JTPp.js";
async function createBooking(input) {
  await delay();
  const booking = {
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
    isDemo: false
  };
  useStore.getState().addBooking(booking);
  return booking;
}
async function getBookings() {
  await delay();
  return useStore.getState().bookings;
}
async function updateBookingStatus(id, status) {
  await delay(250);
  const state = useStore.getState();
  const booking = state.bookings.find((b) => b.id === id);
  if (!booking) throw new Error(`Booking not found: ${id}`);
  state.updateBooking(id, { status });
  return { ...booking, status };
}
export {
  createBooking as c,
  getBookings as g,
  updateBookingStatus as u
};
