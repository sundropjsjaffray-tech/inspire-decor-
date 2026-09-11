function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function isoDaysFromNow(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function isWithinCurrentMonth(isoDate) {
  const date = new Date(isoDate);
  const now = /* @__PURE__ */ new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
function availableCount(item) {
  return Math.max(0, item.total - item.reserved - item.outOnHire - item.damaged - item.missing);
}
function formatZAR(amount) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
const dateFmt = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Johannesburg"
});
const dateTimeFmt = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Johannesburg"
});
function formatDate(isoDate) {
  const d = /* @__PURE__ */ new Date(`${isoDate.slice(0, 10)}T12:00:00`);
  return Number.isNaN(d.getTime()) ? isoDate : dateFmt.format(d);
}
function formatDateTime(isoDateTime) {
  const d = new Date(isoDateTime);
  return Number.isNaN(d.getTime()) ? isoDateTime : dateTimeFmt.format(d);
}
function monthKey(iso) {
  return iso.slice(0, 7);
}
export {
  formatDate as a,
  availableCount as b,
  cn as c,
  delay as d,
  formatDateTime as e,
  formatZAR as f,
  isWithinCurrentMonth as g,
  isoDaysFromNow as i,
  monthKey as m,
  todayISO as t,
  uid as u
};
