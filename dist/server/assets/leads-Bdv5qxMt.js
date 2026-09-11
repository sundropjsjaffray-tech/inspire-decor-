import { u as useStore } from "./index-DpiVUCS0.js";
import { d as delay, t as todayISO, u as uid } from "./util-D5Y4JTPp.js";
async function createLead(input) {
  await delay();
  const now = todayISO();
  const lead = {
    id: uid("L"),
    enquiryId: input.enquiryId,
    customer: input.customer,
    eventType: input.eventType,
    eventDate: input.eventDate,
    guests: input.guests,
    budgetRange: input.budgetRange,
    notes: input.notes,
    status: "NEW",
    source: input.source ?? "WEBSITE",
    createdAt: now,
    updatedAt: now,
    venue: input.venue,
    indoorOutdoor: input.indoorOutdoor,
    location: input.location,
    services: input.services,
    colourScheme: input.colourScheme,
    theme: input.theme,
    requirements: input.requirements,
    inspirationFile: input.inspirationFile,
    enquiryLines: input.enquiryLines,
    timeline: [{ status: "NEW", at: (/* @__PURE__ */ new Date()).toISOString(), note: "Enquiry received" }],
    isDemo: false
  };
  useStore.getState().addLead(lead);
  return lead;
}
async function getLeads() {
  await delay();
  return useStore.getState().leads;
}
async function updateLeadStatus(id, status) {
  await delay(250);
  const state = useStore.getState();
  const lead = state.leads.find((l) => l.id === id);
  if (!lead) throw new Error(`Lead not found: ${id}`);
  const timeline = [
    ...lead.timeline ?? [],
    { status, at: (/* @__PURE__ */ new Date()).toISOString(), note: `Status changed to ${status}` }
  ];
  state.updateLead(id, { status, timeline });
  return { ...lead, status, timeline };
}
async function updateLead(id, patch) {
  await delay(250);
  const state = useStore.getState();
  const lead = state.leads.find((l) => l.id === id);
  if (!lead) throw new Error(`Lead not found: ${id}`);
  state.updateLead(id, patch);
  return { ...lead, ...patch };
}
export {
  updateLeadStatus as a,
  createLead as c,
  getLeads as g,
  updateLead as u
};
