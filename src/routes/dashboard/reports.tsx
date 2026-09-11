import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, LoadingState, PageHeader, StatCard } from "~/components/ui";
import { getQuotes } from "~/lib/services/quotes";
import { useStore } from "~/lib/store";
import {
  selectAverageBookingValue,
  selectInventoryUtilisationByCategory,
  selectMonthlyAverageValueSeries,
  selectMonthlyBookingsSeries,
  selectMonthlyLeadsSeries,
  selectMonthlyRevenueSeries,
  selectQuoteConversion,
} from "~/lib/store/selectors";
import type { MonthPoint } from "~/lib/store/selectors";
import { formatZAR } from "~/lib/util";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });

function ReportsPage() {
  const [loaded, setLoaded] = useState(false);

  // Subscribe to the whole store once and derive in useMemo — the derived
  // selectors return fresh arrays/objects each call, which loops forever when
  // passed straight to zustand v5's useStore(selector) (React error #185).
  const state = useStore();
  const revenueSeries = useMemo(() => selectMonthlyRevenueSeries(state), [state]);
  const leadsSeries = useMemo(() => selectMonthlyLeadsSeries(state), [state]);
  const bookingsSeries = useMemo(() => selectMonthlyBookingsSeries(state), [state]);
  const avgSeries = useMemo(() => selectMonthlyAverageValueSeries(state), [state]);
  const conversion = useMemo(() => selectQuoteConversion(state), [state]);
  const avgValue = useMemo(() => selectAverageBookingValue(state), [state]);
  const utilisation = useMemo(() => selectInventoryUtilisationByCategory(state), [state]);

  useEffect(() => {
    let alive = true;
    getQuotes().then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!loaded) {
    return (
      <>
        <PageHeader title="Reports" eyebrow="Dashboard" subtitle="Revenue, pipeline and stock summaries to run the business on." />
        <LoadingState label="Building reports…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Reports"
        eyebrow="Dashboard"
        subtitle="Revenue, pipeline and stock summaries to run the business on — all derived live from bookings, leads and inventory."
      />

      <p className="mb-6 rounded-lg border border-dashed border-ink-300 bg-champagne-100/60 px-4 py-3 text-sm text-ink-600">
        <span className="font-semibold">Demonstration data.</span> All figures below are computed
        from the sample records in the store — not real client information.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Quote conversion"
          value={`${Math.round(conversion.rate * 100)}%`}
          tone="gold"
          hint={`${conversion.converted} of ${conversion.total} quotes became bookings`}
        />
        <StatCard
          label="Average booking value"
          value={formatZAR(avgValue)}
          hint="Across all non-cancelled bookings"
        />
        <StatCard
          label="Revenue (6 months)"
          value={formatZAR(revenueSeries.reduce((s, p) => s + p.value, 0))}
          tone="info"
          hint="Bookings with events in the period"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Monthly revenue" subtitle="Non-cancelled bookings, by event month (last 6 months)" />
          <BarChart
            points={revenueSeries}
            formatValue={(v) => formatZAR(v)}
            barClassName="bg-gold-500"
          />
        </Card>

        <Card>
          <CardHeader title="Enquiries per month" subtitle="Leads created per month (last 6 months)" />
          <BarChart points={leadsSeries} formatValue={(v) => `${v}`} barClassName="bg-sky-500" />
        </Card>

        <Card>
          <CardHeader title="Confirmed bookings per month" subtitle="Bookings by event month (last 6 months)" />
          <BarChart points={bookingsSeries} formatValue={(v) => `${v}`} barClassName="bg-emerald-500" />
        </Card>

        <Card>
          <CardHeader title="Average booking value per month" subtitle="Total ÷ bookings, by event month" />
          <BarChart points={avgSeries} formatValue={(v) => formatZAR(v)} barClassName="bg-gold-400" />
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Quote conversion" subtitle="Quotes → bookings, at a glance" />
        <div className="flex items-center gap-4">
          <p className="font-display text-4xl font-semibold text-ink-950">
            {Math.round(conversion.rate * 100)}%
          </p>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-gold-500 transition-all"
              style={{ width: `${Math.max(2, conversion.rate * 100)}%` }}
              role="img"
              aria-label={`${Math.round(conversion.rate * 100)}% of quotes converted to bookings`}
            />
          </div>
          <p className="text-sm text-ink-500">
            {conversion.converted} converted of {conversion.total} quotes
          </p>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Inventory utilisation by category"
          subtitle="Reserved + out-on-hire as a share of total stock per category"
        />
        {utilisation.length === 0 ? (
          <p className="text-sm text-ink-500">No inventory data.</p>
        ) : (
          <ul className="space-y-3">
            {utilisation.map((u) => (
              <li key={u.category} className="flex items-center gap-4">
                <span className="w-36 shrink-0 text-sm capitalize text-ink-700">{u.category}</span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="flex h-full items-center rounded-full bg-ink-800 pl-2 text-[10px] font-semibold text-white"
                    style={{ width: `${Math.max(u.ratio * 100, 2)}%` }}
                    role="img"
                    aria-label={`${u.category}: ${Math.round(u.ratio * 100)}% utilised`}
                  >
                    {u.ratio > 0.25 && `${Math.round(u.ratio * 100)}%`}
                  </div>
                </div>
                <span className="w-32 shrink-0 text-right text-xs text-ink-500">
                  {u.inUse} of {u.total} units
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// Lightweight hand-rolled bar chart (no chart library)
// ---------------------------------------------------------------------------

function BarChart({
  points,
  formatValue,
  barClassName,
}: {
  points: MonthPoint[];
  formatValue: (v: number) => string;
  barClassName: string;
}) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <div>
      <div className="flex h-40 items-end gap-2">
        {points.map((p) => {
          const h = Math.max((p.value / max) * 100, p.value > 0 ? 4 : 1);
          return (
            <div key={p.key} className="flex flex-1 flex-col items-center gap-1" title={`${p.label}: ${formatValue(p.value)}`}>
              <span className="text-[10px] font-medium text-ink-600">{formatValue(p.value)}</span>
              <div
                className={`w-full rounded-t ${barClassName}`}
                style={{ height: `${h}%` }}
                role="img"
                aria-label={`${p.label}: ${formatValue(p.value)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-2 border-t border-ink-200 pt-1">
        {points.map((p) => (
          <span key={p.key} className="flex-1 text-center text-[10px] text-ink-400">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
