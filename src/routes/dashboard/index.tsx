import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Badge,
  Card,
  CardHeader,
  LoadingState,
  PageHeader,
  PriceTag,
  StatCard,
} from "~/components/ui";
import { getLeads } from "~/lib/services/leads";
import { getEvents } from "~/lib/services/events";
import { useStore } from "~/lib/store";
import {
  selectFollowUpsList,
  selectLowStockItems,
  selectMonthlyBookingsSeries,
  selectMonthlyRevenueSeries,
  selectRecentLeads,
  selectUpcomingEventsPreview,
  useDashboardStats,
} from "~/lib/store/selectors";
import { eventTypeLabels, leadStatusMeta } from "~/lib/statusLabels";
import { cn, formatDate, formatZAR } from "~/lib/util";

export const Route = createFileRoute("/dashboard/")({ component: DashboardHomePage });

function DashboardHomePage() {
  const stats = useDashboardStats();
  const [loaded, setLoaded] = useState(false);

  // Subscribe to the whole store once and derive in useMemo: the derived
  // selectors return fresh arrays/objects each call, and passing them straight
  // to zustand v5's useStore(selector) causes an infinite re-render loop
  // (React error #185). The store reference only changes on real mutations.
  const state = useStore();
  const recentLeads = useMemo(() => selectRecentLeads(state, 5), [state]);
  const upcomingEvents = useMemo(() => selectUpcomingEventsPreview(state, 5), [state]);
  const lowStock = useMemo(() => selectLowStockItems(state), [state]);
  const followUps = useMemo(() => selectFollowUpsList(state), [state]);
  const revenueSeries = useMemo(() => selectMonthlyRevenueSeries(state, 6), [state]);
  const bookingsSeries = useMemo(() => selectMonthlyBookingsSeries(state, 6), [state]);

  useEffect(() => {
    let alive = true;
    Promise.all([getLeads(), getEvents()]).then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!loaded) {
    return (
      <>
        <PageHeader title="Overview" eyebrow="Dashboard" subtitle="Revenue, pipeline and alerts at a glance." />
        <LoadingState label="Loading overview…" />
      </>
    );
  }

  const maxRevenue = Math.max(...revenueSeries.map((p) => p.value), 1);

  return (
    <>
      <PageHeader
        title="Overview"
        eyebrow="Dashboard"
        subtitle="Revenue, pipeline and alerts at a glance. Every number is live from the store."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New enquiries" value={stats.newLeads} tone="info" hint="Leads in NEW status" />
        <StatCard label="Quotes pending" value={stats.pendingQuotes} hint="Draft or sent, awaiting decision" />
        <StatCard label="Confirmed bookings" value={stats.confirmedBookings} tone="gold" hint="Confirmed, preparing or out on hire" />
        <StatCard label="Revenue this month" value={<PriceTag amount={stats.revenueThisMonth} />} hint="Bookings with events this month" />
        <StatCard label="Outstanding payments" value={<PriceTag amount={stats.outstandingPayments} />} tone="warning" hint="Balance due across active bookings" />
        <StatCard label="Upcoming events" value={stats.upcomingEvents} hint="Next events on the calendar" />
        <StatCard label="Inventory alerts" value={stats.lowStockCount} tone="danger" hint="Items at or below reorder level" />
        <StatCard label="Follow-ups due" value={stats.followUpsDue} hint="Leads in FOLLOW_UP" />
      </div>

      {/* Trend strip */}
      <Card className="mt-6">
        <CardHeader
          title="Revenue & bookings trend"
          subtitle="Last 6 months — bars show revenue; dots show bookings won"
        />
        <div className="flex h-32 items-end gap-2">
          {revenueSeries.map((p) => {
            const bookings = bookingsSeries.find((b) => b.key === p.key)?.value ?? 0;
            return (
              <div key={p.key} className="flex flex-1 flex-col items-center gap-1" title={`${p.label}: ${formatZAR(p.value)} · ${bookings} bookings`}>
                <span className="text-[10px] text-ink-500">{formatZAR(p.value)}</span>
                <div className="relative w-full rounded-t bg-gold-300" style={{ height: `${Math.max((p.value / maxRevenue) * 100, 2)}%` }}>
                  <span
                    className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-ink-800"
                    title={`${bookings} bookings`}
                    aria-hidden
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex gap-2 border-t border-ink-200 pt-1">
          {revenueSeries.map((p) => (
            <span key={p.key} className="flex-1 text-center text-[10px] text-ink-400">{p.label}</span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-gold-300" /> Revenue</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-ink-800" /> Bookings</span>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent enquiries */}
        <Card padded={false}>
          <CardHeader
            title="Recent enquiries"
            subtitle="Latest leads — open for full detail"
            className="px-5 pt-5"
            action={
              <Link to="/dashboard/leads" search={{ lead: undefined }} className="text-sm font-medium text-gold-700 hover:underline">
                View all →
              </Link>
            }
          />
          <ul className="divide-y divide-ink-100">
            {recentLeads.map((l) => {
              const meta = leadStatusMeta[l.status];
              return (
                <li key={l.id}>
                  <Link
                    to="/dashboard/leads"
                    search={{ lead: l.id }}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-champagne-100/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-900">{l.customer.name}</span>
                      <span className="block truncate text-xs text-ink-500">
                        {eventTypeLabels[l.eventType]} · {l.guests} guests · {formatDate(l.eventDate)}
                      </span>
                    </span>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </Link>
                </li>
              );
            })}
            {recentLeads.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-400">No leads yet.</li>
            )}
          </ul>
        </Card>

        {/* Upcoming events */}
        <Card padded={false}>
          <CardHeader
            title="Upcoming events"
            subtitle="Next five on the calendar"
            className="px-5 pt-5"
            action={
              <Link to="/dashboard/events" className="text-sm font-medium text-gold-700 hover:underline">
                View all →
              </Link>
            }
          />
          <ul className="divide-y divide-ink-100">
            {upcomingEvents.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink-900">{e.name}</span>
                  <span className="block truncate text-xs text-ink-500">
                    {e.venue} · {e.guests} guests
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-ink-700">{formatDate(e.date)}</span>
              </li>
            ))}
            {upcomingEvents.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-400">No upcoming events.</li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Low stock alerts */}
        <Card padded={false}>
          <CardHeader
            title="Low stock alerts"
            subtitle="At or below reorder level"
            className="px-5 pt-5"
            action={
              <Link to="/dashboard/inventory" className="text-sm font-medium text-gold-700 hover:underline">
                Inventory →
              </Link>
            }
          />
          <ul className="divide-y divide-ink-100">
            {lowStock.map((i) => (
              <li key={i.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                <span className="font-medium text-ink-800">{i.name}</span>
                <span className="text-ink-500">
                  <span className="font-semibold text-amber-700">{stockAvail(i)}</span> available of {i.total}
                </span>
              </li>
            ))}
            {lowStock.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-400">All stock levels OK.</li>
            )}
          </ul>
        </Card>

        {/* Follow-ups */}
        <Card padded={false}>
          <CardHeader
            title="Follow-ups due"
            subtitle="Leads in FOLLOW_UP that need attention"
            className="px-5 pt-5"
            action={
              <Link to="/dashboard/leads" search={{ lead: undefined }} className="text-sm font-medium text-gold-700 hover:underline">
                Leads →
              </Link>
            }
          />
          <ul className="divide-y divide-ink-100">
            {followUps.map((l) => (
              <li key={l.id}>
                <Link
                  to="/dashboard/leads"
                  search={{ lead: l.id }}
                  className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-champagne-100/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink-800">{l.customer.name}</span>
                    {l.nextAction && (
                      <span className="block truncate text-xs text-ink-500">{l.nextAction}</span>
                    )}
                  </span>
                  <Badge tone="warning">Follow-up</Badge>
                </Link>
              </li>
            ))}
            {followUps.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-400">Nothing due — good work.</li>
            )}
          </ul>
        </Card>
      </div>

      <p className={cn("mt-6 text-xs text-ink-400")}>
        All figures are demonstration data from the sample store.
      </p>
    </>
  );
}

function stockAvail(item: { total: number | null; reserved: number; outOnHire: number; damaged: number; missing: number }): number | null {
  if (item.total === null) return null;
  return Math.max(0, item.total - item.reserved - item.outOnHire - item.damaged - item.missing);
}
