import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Badge,
  EmptyState,
  LoadingState,
  PageHeader,
  Table,
  type TableColumn,
} from "~/components/ui";
import { getEvents } from "~/lib/services/events";
import { useStore } from "~/lib/store";
import { eventStatusMeta, eventTypeLabels } from "~/lib/statusLabels";
import { cn, formatDate, monthKey } from "~/lib/util";
import type { Event } from "~/lib/types";

export const Route = createFileRoute("/dashboard/events")({ component: EventsPage });

function EventsPage() {
  const events = useStore((s) => s.events);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    getEvents().then(() => {
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const { upcoming, past } = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    return {
      upcoming: sorted.filter((e) => e.date >= today && e.status !== "CANCELLED"),
      past: sorted.filter((e) => e.date < today || e.status === "CANCELLED"),
    };
  }, [events, today]);

  const groups = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of upcoming) {
      const k = monthKey(e.date);
      const list = map.get(k) ?? [];
      list.push(e);
      map.set(k, list);
    }
    return Array.from(map.entries());
  }, [upcoming]);

  const columns: TableColumn<Event>[] = [
    {
      key: "date",
      header: "Event date",
      render: (e: Event) => (
        <span className={cn("font-semibold", e.date === today ? "text-gold-700" : "text-ink-900")}>
          {formatDate(e.date)}
          {e.date === today && <Badge tone="gold" className="ml-2">Today</Badge>}
        </span>
      ),
    },
    { key: "customer", header: "Customer", render: (e: Event) => e.customer.name },
    {
      key: "type",
      header: "Event type",
      render: (e: Event) => eventTypeLabels[e.type],
    },
    { key: "venue", header: "Venue", render: (e: Event) => e.venue },
    { key: "guests", header: "Guests", align: "center", render: (e: Event) => e.guests },
    { key: "setupTime", header: "Setup", align: "center", render: (e: Event) => e.setupTime },
    { key: "eventTime", header: "Event", align: "center", render: (e: Event) => e.eventTime },
    { key: "collectionTime", header: "Collection", align: "center", render: (e: Event) => e.collectionTime },
    {
      key: "status",
      header: "Status",
      render: (e: Event) => {
        const meta = eventStatusMeta[e.status];
        return <Badge tone={meta.tone}>{meta.label}</Badge>;
      },
    },
  ];

  if (!loaded) {
    return (
      <>
        <PageHeader title="Events" eyebrow="Dashboard" subtitle="What happens on the day — dates, venues, guest counts, setup and collection times." />
        <LoadingState label="Loading events…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Events"
        eyebrow="Dashboard"
        subtitle="What happens on the day — dates, venues, guest counts, setup and collection times."
      />

      {upcoming.length === 0 && (
        <div className="mb-6">
          <EmptyState title="No upcoming events" description="Converted bookings appear here as events." />
        </div>
      )}

      {groups.map(([key, list]) => (
        <section key={key} className="mb-8">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-900">
            {monthLabel(key)}
            <span className="ml-2 text-sm font-normal text-ink-400">{list.length} event{list.length > 1 ? "s" : ""}</span>
          </h2>
          <Table<Event> columns={columns} rows={list} keyOf={(e) => e.id} />
        </section>
      ))}

      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-900">
            Past & cancelled
            <span className="ml-2 text-sm font-normal text-ink-400">{past.length}</span>
          </h2>
          <div className="opacity-60">
            <Table<Event> columns={columns} rows={[...past].reverse()} keyOf={(e) => e.id} />
          </div>
        </section>
      )}

      <p className="mt-4 text-xs text-ink-400">
        Events are derived from the events store; bookings feed this list when they reach
        CONFIRMED. Today's events are highlighted in gold.
      </p>
    </>
  );
}

function monthLabel(key: string): string {
  return new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric" }).format(
    new Date(`${key}-01T12:00:00`)
  );
}
