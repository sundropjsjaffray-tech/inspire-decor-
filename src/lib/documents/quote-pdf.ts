import { jsPDF } from "jspdf";
import { businessProfile, quoteTerms, type BusinessProfile } from "~/lib/data/business";
import { eventTypeLabels } from "~/lib/statusLabels";
import { formatZAR } from "~/lib/util";
import type { ContactDetails } from "~/lib/data/site";
import type { Lead, Quote } from "~/lib/types";

interface QuotePdfOptions {
  quote: Quote;
  lead?: Lead;
  contact?: ContactDetails;
  profile?: BusinessProfile;
}

const PAGE_WIDTH = 210;
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function lineItems(quote: Quote): string[][] {
  return quote.items.map((item, index) => [
    String(index + 1),
    item.name,
    String(item.quantity),
    formatZAR(item.unitPrice),
    formatZAR(item.lineTotal),
  ]);
}

function drawHeader(document: jsPDF, quote: Quote, profile: BusinessProfile): number {
  document.setFillColor(16, 18, 22);
  document.rect(0, 0, PAGE_WIDTH, 34, "F");
  document.setTextColor(255, 255, 255);
  document.setFontSize(18);
  document.setFont("helvetica", "bold");
  document.text(profile.name.toUpperCase(), MARGIN, 15);
  document.setFontSize(8);
  document.setFont("helvetica", "normal");
  document.text("EVENT DECOR | DRAPING | CATERING | EQUIPMENT HIRE", MARGIN, 22);
  document.setTextColor(201, 167, 92);
  document.setFontSize(9);
  document.text("QUOTATION", PAGE_WIDTH - MARGIN, 12, { align: "right" });
  document.setTextColor(255, 255, 255);
  document.setFontSize(15);
  document.setFont("helvetica", "bold");
  document.text(quote.quotationNumber ?? quote.id, PAGE_WIDTH - MARGIN, 20, { align: "right" });
  document.setFontSize(8);
  document.setFont("helvetica", "normal");
  document.text(`Status: ${quote.status}`, PAGE_WIDTH - MARGIN, 27, { align: "right" });
  return 45;
}

function drawFooter(document: jsPDF, page: number, totalPages: number, profile: BusinessProfile): void {
  const height = document.internal.pageSize.getHeight();
  document.setDrawColor(210, 214, 222);
  document.line(MARGIN, height - 16, PAGE_WIDTH - MARGIN, height - 16);
  document.setFontSize(8);
  document.setTextColor(124, 132, 148);
  document.text(`${profile.phone} | ${profile.email} | ${profile.website}`, MARGIN, height - 10);
  document.text(`Page ${page} of ${totalPages}`, PAGE_WIDTH - MARGIN, height - 10, { align: "right" });
}

export function createQuotePdf({ quote, lead, contact, profile = businessProfile }: QuotePdfOptions): jsPDF {
  const document = new jsPDF({ unit: "mm", format: "a4" });
  const actualProfile = contact
    ? { ...profile, phone: contact.phone, email: contact.email, address: contact.area }
    : profile;
  let y = drawHeader(document, quote, actualProfile);
  document.setTextColor(46, 51, 61);
  document.setFontSize(9);
  document.setFont("helvetica", "normal");
  document.text(`Issue date: ${quote.createdAt.slice(0, 10)}`, MARGIN, y);
  document.text(`Valid until: ${quote.validUntil ?? "—"}`, MARGIN, y + 5);
  document.text(`Updated: ${quote.updatedAt?.slice(0, 10) ?? quote.createdAt.slice(0, 10)}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
  y += 17;

  document.setFont("helvetica", "bold");
  document.text("Prepared for", MARGIN, y);
  document.text("Event details", PAGE_WIDTH / 2, y);
  document.setFont("helvetica", "normal");
  document.text(lead?.customer.name ?? `Customer ${quote.customerId}`, MARGIN, y + 6);
  document.text(lead?.customer.email ?? "", MARGIN, y + 11);
  document.text(lead?.customer.phone ?? "", MARGIN, y + 16);
  document.text(eventTypeLabels[lead?.eventType ?? "other"], PAGE_WIDTH / 2, y + 6);
  document.text(lead?.eventDate ? `Date: ${lead.eventDate}` : "", PAGE_WIDTH / 2, y + 11);
  document.text(lead?.venue ? `Venue: ${lead.venue}` : "", PAGE_WIDTH / 2, y + 16);
  document.text(lead ? `Guests: ${lead.guests}` : "", PAGE_WIDTH / 2, y + 21);
  y += 34;

  document.setFillColor(246, 247, 249);
  document.rect(MARGIN, y - 5, CONTENT_WIDTH, 9, "F");
  document.setTextColor(85, 93, 107);
  document.setFontSize(8);
  document.setFont("helvetica", "bold");
  document.text("#", MARGIN + 2, y);
  document.text("ITEM", MARGIN + 12, y);
  document.text("QTY", 132, y, { align: "right" });
  document.text("UNIT", 161, y, { align: "right" });
  document.text("TOTAL", PAGE_WIDTH - MARGIN - 2, y, { align: "right" });
  y += 8;
  document.setFont("helvetica", "normal");
  document.setTextColor(46, 51, 61);
  for (const row of lineItems(quote)) {
    if (y > 260) {
      document.addPage();
      y = drawHeader(document, quote, actualProfile) + 8;
      document.setFillColor(246, 247, 249);
      document.rect(MARGIN, y - 5, CONTENT_WIDTH, 9, "F");
      document.setTextColor(85, 93, 107);
      document.setFont("helvetica", "bold");
      document.text("#", MARGIN + 2, y);
      document.text("ITEM", MARGIN + 12, y);
      document.text("QTY", 132, y, { align: "right" });
      document.text("UNIT", 161, y, { align: "right" });
      document.text("TOTAL", PAGE_WIDTH - MARGIN - 2, y, { align: "right" });
      y += 8;
      document.setFont("helvetica", "normal");
      document.setTextColor(46, 51, 61);
    }
    document.text(row[0], MARGIN + 2, y);
    document.text(document.splitTextToSize(row[1], 92)[0], MARGIN + 12, y);
    document.text(row[2], 132, y, { align: "right" });
    document.text(row[3], 161, y, { align: "right" });
    document.text(row[4], PAGE_WIDTH - MARGIN - 2, y, { align: "right" });
    y += 7;
  }

  if (y > 235) {
    document.addPage();
    y = drawHeader(document, quote, actualProfile) + 8;
  }
  y += 4;
  const totals = [
    ["Subtotal", formatZAR(quote.subtotal)],
    ...(quote.deliveryFee > 0 ? [["Delivery", formatZAR(quote.deliveryFee)]] : []),
    ...((quote.setupFee ?? 0) > 0 ? [["Setup", formatZAR(quote.setupFee ?? 0)]] : []),
    ...(quote.discount > 0 ? [["Discount", `- ${formatZAR(quote.discount)}`]] : []),
    ["TOTAL (VAT INCLUSIVE)", formatZAR(quote.total)],
  ];
  document.setFontSize(9);
  for (const [label, value] of totals) {
    if (label.startsWith("TOTAL")) {
      document.setDrawColor(184, 149, 74);
      document.line(122, y - 4, PAGE_WIDTH - MARGIN, y - 4);
      document.setFont("helvetica", "bold");
    }
    document.text(label, 122, y);
    document.text(value, PAGE_WIDTH - MARGIN - 2, y, { align: "right" });
    y += 6;
    document.setFont("helvetica", "normal");
  }
  y += 5;
  if (quote.notes) {
    document.setFont("helvetica", "bold");
    document.text("Notes", MARGIN, y);
    document.setFont("helvetica", "normal");
    y += 5;
    document.text(document.splitTextToSize(quote.notes, CONTENT_WIDTH), MARGIN, y);
    y += 12;
  }
  document.setFont("helvetica", "bold");
  document.text("Terms and conditions", MARGIN, y);
  document.setFont("helvetica", "normal");
  y += 5;
  document.text(document.splitTextToSize(quote.termsAndConditions ?? quoteTerms, CONTENT_WIDTH), MARGIN, y);

  const totalPages = document.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    document.setPage(page);
    drawFooter(document, page, totalPages, actualProfile);
  }
  return document;
}

export function quotePdfFilename(quote: Quote): string {
  return `Inspire-Decor-Quotation-${quote.quotationNumber ?? quote.id}.pdf`;
}

export function downloadQuotePdf(options: QuotePdfOptions): void {
  const document = createQuotePdf(options);
  document.save(quotePdfFilename(options.quote));
}

export function printQuote(options: QuotePdfOptions): void {
  const document = createQuotePdf(options);
  const blobUrl = URL.createObjectURL(document.output("blob"));
  const printWindow = window.open(blobUrl, "_blank", "noopener,noreferrer");
  if (!printWindow) throw new Error("Allow pop-ups to print the quotation.");
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

export async function shareQuotePdf(options: QuotePdfOptions): Promise<boolean> {
  if (!navigator.share) return false;
  const blob = options && createQuotePdf(options).output("blob");
  const file = new File([blob], quotePdfFilename(options.quote), { type: "application/pdf" });
  if (navigator.canShare && !navigator.canShare({ files: [file] })) return false;
  await navigator.share({ title: options.quote.quotationNumber ?? options.quote.id, files: [file] });
  return true;
}