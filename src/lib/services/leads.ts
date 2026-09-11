/**
 * Leads service — async, backed by the client store for now.
 * Swap the internals for Supabase queries later; signatures stay the same.
 */
import { useStore } from "~/lib/store";
import { delay, todayISO, uid } from "~/lib/util";
import type { Customer, Lead, LeadSource, LeadStatus } from "~/lib/types";
import type { BudgetRange, EnquiryLine, EventType } from "~/lib/types";

export interface NewLeadInput {
  customer: Customer;
  eventType: EventType;
  eventDate: string;
  guests: number;
  budgetRange: BudgetRange;
  notes?: string;
  source?: LeadSource;
  enquiryId?: string;
  /** Customer's "add to enquiry" cart, captured when the form is submitted. */
  enquiryLines?: EnquiryLine[];
  venue?: string;
  indoorOutdoor?: string;
  location?: string;
  services?: Lead["services"];
  colourScheme?: string;
  theme?: string;
  requirements?: string;
  inspirationFile?: string;
}

export async function createLead(input: NewLeadInput): Promise<Lead> {
  await delay();
  const now = todayISO();
  const lead: Lead = {
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
    timeline: [{ status: "NEW", at: new Date().toISOString(), note: "Enquiry received" }],
    isDemo: false,
  };
  useStore.getState().addLead(lead);
  return lead;
}

export async function getLeads(): Promise<Lead[]> {
  await delay();
  return useStore.getState().leads;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  await delay(200);
  return useStore.getState().leads.find((l) => l.id === id) ?? null;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  await delay(250);
  const state = useStore.getState();
  const lead = state.leads.find((l) => l.id === id);
  if (!lead) throw new Error(`Lead not found: ${id}`);
  const timeline = [
    ...(lead.timeline ?? []),
    { status, at: new Date().toISOString(), note: `Status changed to ${status}` },
  ];
  state.updateLead(id, { status, timeline });
  return { ...lead, status, timeline };
}

/** Generic patch for lead detail fields (next action, notes, etc.). */
export async function updateLead(
  id: string,
  patch: Partial<Pick<Lead, "notes" | "nextAction" | "venue" | "colourScheme">>
): Promise<Lead> {
  await delay(250);
  const state = useStore.getState();
  const lead = state.leads.find((l) => l.id === id);
  if (!lead) throw new Error(`Lead not found: ${id}`);
  state.updateLead(id, patch);
  return { ...lead, ...patch };
}
