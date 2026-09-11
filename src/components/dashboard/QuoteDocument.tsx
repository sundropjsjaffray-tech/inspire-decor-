/**
 * QuoteDocument — the polished, printable quote document shown after
 * "Generate Quote" and reusable for the future Resend email (server-side).
 *
 * Pure presentational component: it renders whatever Quote/Lead/contact it is
 * given. All business data comes in via props (from the services/data layer).
 */
import { Card } from "~/components/ui";
import { quoteDefaults } from "~/lib/data/quoteServices";
import { eventTypeLabels } from "~/lib/statusLabels";
import { formatDate, formatZAR } from "~/lib/util";
import type { Lead, Quote, QuoteItem } from "~/lib/types";
import type { ContactDetails } from "~/lib/data/site";

export interface QuoteDocumentProps {
  quote: Quote;
  lead?: Lead;
  contact?: ContactDetails;
}

function LineRow({ item, index }: { item: QuoteItem; index: number }) {
  return (
    <tr className="border-b border-ink-100 last:border-0">
      <td className="px-3 py-2 text-ink-400">{index + 1}</td>
      <td className="px-3 py-2">
        <span className="font-medium text-ink-900">{item.name}</span>
        {item.type === "service" && (
          <span className="ml-2 rounded bg-champagne-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-700">
            Service
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-right text-ink-700">{item.quantity}</td>
      <td className="px-3 py-2 text-right text-ink-700">{formatZAR(item.unitPrice)}</td>
      <td className="px-3 py-2 text-right font-semibold text-ink-900">
        {formatZAR(item.lineTotal)}
      </td>
    </tr>
  );
}

export function QuoteDocument({ quote, lead, contact }: QuoteDocumentProps) {
  const deposit = Math.round(quote.total * quoteDefaults.depositRate);
  const balance = quote.total - deposit;
  return (
    <Card padded={false} className="overflow-hidden">
      {/* Document header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-gold-500 bg-ink-950 px-6 py-5 text-white">
        <div>
          <p className="font-display text-xl font-bold">
            INSPIRE<span className="text-gold-400"> DECOR</span>
          </p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-ink-400">
            Event Décor · Draping · Catering · Equipment Hire
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gold-400">Quote</p>
          <p className="font-display text-2xl font-semibold">{quote.id}</p>
          <p className="mt-1 text-xs text-ink-400">
            {formatDate(quote.createdAt)}
            {quote.validUntil && <> · Valid until {formatDate(quote.validUntil)}</>}
          </p>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-5 sm:grid-cols-2">
        {/* Bill to */}
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
            Prepared for
          </p>
          {lead ? (
            <>
              <p className="font-semibold text-ink-900">{lead.customer.name}</p>
              {lead.customer.company && <p className="text-sm text-ink-600">{lead.customer.company}</p>}
              <p className="text-sm text-ink-600">{lead.customer.email}</p>
              <p className="text-sm text-ink-600">{lead.customer.phone}</p>
            </>
          ) : (
            <p className="text-sm text-ink-600">Customer # {quote.customerId}</p>
          )}
        </div>
        {/* Event details */}
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
            Event details
          </p>
          <p className="text-sm text-ink-700">
            {eventTypeLabels[lead?.eventType ?? "other"]}
            {lead?.eventDate ? ` · ${formatDate(lead.eventDate)}` : ""}
          </p>
          {lead?.venue && <p className="text-sm text-ink-700">Venue: {lead.venue}</p>}
          {lead && <p className="text-sm text-ink-700">Guests: {lead.guests}</p>}
          {quote.notes && (
            <p className="mt-2 rounded bg-champagne-100 px-2.5 py-1.5 text-xs italic text-ink-600">
              {quote.notes}
            </p>
          )}
        </div>
      </div>

      {/* Line items */}
      <div className="px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-ink-200 bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 text-right font-semibold">Qty</th>
              <th className="px-3 py-2 text-right font-semibold">Unit</th>
              <th className="px-3 py-2 text-right font-semibold">Line total</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-ink-400">
                  No line items on this quote.
                </td>
              </tr>
            )}
            {quote.items.map((item, i) => (
              <LineRow key={item.id} item={item} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end gap-1 px-6 py-5 sm:flex-row sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-ink-400">
          {quoteDefaults.paymentTerms}
        </p>
        <div className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between text-ink-600">
            <span>Subtotal</span>
            <span>{formatZAR(quote.subtotal)}</span>
          </div>
          {(quote.deliveryFee > 0 || true) && (
            <div className="flex justify-between text-ink-600">
              <span>Delivery</span>
              <span>{formatZAR(quote.deliveryFee)}</span>
            </div>
          )}
          {(quote.setupFee ?? 0) > 0 && (
            <div className="flex justify-between text-ink-600">
              <span>Setup</span>
              <span>{formatZAR(quote.setupFee ?? 0)}</span>
            </div>
          )}
          {quote.discount > 0 && (
            <div className="flex justify-between text-ink-600">
              <span>Discount</span>
              <span>− {formatZAR(quote.discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-ink-200 pt-2 text-base font-bold text-ink-950">
            <span>Total (incl. VAT)</span>
            <span>{formatZAR(quote.total)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gold-700">
            <span>Deposit required ({Math.round(quoteDefaults.depositRate * 100)}%)</span>
            <span>{formatZAR(deposit)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-600">
            <span>Balance due</span>
            <span>{formatZAR(balance)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-ink-200 bg-champagne-100/60 px-6 py-4 text-center text-xs text-ink-500">
        <p className="font-semibold uppercase tracking-widest text-ink-700">Prepared by INSPIRE DECOR</p>
        <p className="mt-1">
          {contact?.phone ?? ""}
          {contact?.email ? ` · ${contact.email}` : ""}
          {contact?.area ? ` · ${contact.area}` : ""}
        </p>
      </div>
    </Card>
  );
}
