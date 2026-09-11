import { u as useStore } from "./index-DpiVUCS0.js";
import { d as delay, t as todayISO, u as uid } from "./util-D5Y4JTPp.js";
function recordNotification(type, title, message) {
  const notification = {
    id: uid("N"),
    type,
    title,
    message,
    read: false,
    createdAt: todayISO(),
    isDemo: false
  };
  useStore.getState().addNotification(notification);
}
async function sendNewLeadNotification(lead) {
  await delay(250);
  recordNotification(
    "lead",
    "New lead received",
    `${lead.customer.name} — ${lead.eventType}, ${lead.guests} guests (${lead.budgetRange})`
  );
}
async function sendContactMessageNotification(input) {
  await delay(250);
  recordNotification(
    "lead",
    "New contact message",
    `${input.name} (${input.email}) — ${input.message.slice(0, 120)}`
  );
}
export {
  sendContactMessageNotification as a,
  sendNewLeadNotification as s
};
