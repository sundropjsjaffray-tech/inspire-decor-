import { demoContactDetails, type ContactDetails } from "./site";

export interface BusinessProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
}

export const businessProfile: BusinessProfile = {
  name: "Inspire Decor",
  phone: demoContactDetails.phone,
  email: demoContactDetails.email,
  address: demoContactDetails.area,
  website: "inspiredecor.co.za",
};

export const quoteTerms = [
  "This quotation is valid until the date shown and is subject to availability.",
  "A 50% deposit secures the event date; the balance is due 14 days before the event.",
  "The client is responsible for loss or damage to hired items while in their care.",
  "All hired items must be ready for collection or return at the agreed time.",
].join("\n");

export function businessProfileFromContact(contact?: ContactDetails): BusinessProfile {
  return {
    ...businessProfile,
    phone: contact?.phone ?? businessProfile.phone,
    email: contact?.email ?? businessProfile.email,
    address: contact?.area ?? businessProfile.address,
  };
}