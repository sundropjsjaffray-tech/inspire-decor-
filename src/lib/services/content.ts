/**
 * Content service — read-only customer-facing content.
 *
 * Backs onto the demo data modules for now; swap each function body for a
 * Supabase query later without changing the UI. Every function is async so the
 * loading states the pages render stay meaningful when real queries land.
 */
import { delay } from "~/lib/util";
import type { GalleryItem, Service, Testimonial } from "~/lib/types";
import type { CorporateEventTypeInfo } from "~/lib/types";
import type { ContactDetails, Differentiator } from "~/lib/data/site";
import { demoGallery } from "~/lib/data/gallery";
import { demoServices } from "~/lib/data/services";
import { demoTestimonials } from "~/lib/data/testimonials";
import { demoCorporateBenefits, demoCorporateEventTypes } from "~/lib/data/corporate";
import { demoContactDetails, demoDifferentiators } from "~/lib/data/site";

export async function getServices(): Promise<Service[]> {
  await delay(200);
  return demoServices;
}

export async function getGallery(): Promise<GalleryItem[]> {
  await delay(200);
  return demoGallery;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay(200);
  return demoTestimonials;
}

export async function getCorporateEventTypes(): Promise<CorporateEventTypeInfo[]> {
  await delay(200);
  return demoCorporateEventTypes;
}

export async function getCorporateBenefits(): Promise<
  { id: string; title: string; description: string; isDemo: boolean }[]
> {
  await delay(200);
  return demoCorporateBenefits;
}

export async function getContactDetails(): Promise<ContactDetails> {
  await delay(200);
  return demoContactDetails;
}

export async function getDifferentiators(): Promise<Differentiator[]> {
  await delay(200);
  return demoDifferentiators;
}
