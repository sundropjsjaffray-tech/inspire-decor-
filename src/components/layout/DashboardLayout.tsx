import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "~/lib/util";
import { Badge } from "~/components/ui";
import { DEMO_DATA_BADGE, DEMO_DATA_NOTICE } from "~/lib/demo";

const NAV = [
  { href: "/dashboard", label: "Overview", end: true },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/quotes", label: "Quotes" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/events", label: "Events" },
  { href: "/dashboard/reports", label: "Reports" },
];

/** Active-aware nav link for the dashboard sidebar. */
function NavItem({ href, label, end = false }: { href: string; label: string; end?: boolean }) {
  const pathname = useLocation().pathname;
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      to={href}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-gold-500 text-ink-950" : "text-ink-300 hover:bg-ink-800 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = useLocation().pathname;

  /** Mobile nav link — pathname is resolved once per render, no hook in loops. */
  const mobileLinkClasses = (href: string, end = false) => {
    const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return cn(
      "whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium",
      isActive ? "bg-gold-100 text-gold-700" : "text-ink-600"
    );
  };

  return (
    <div className="flex min-h-dvh bg-ink-50">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-ink-950 text-ink-300 lg:flex">
        <div className="px-5 py-5">
          <Link to="/dashboard" className="font-display text-lg font-bold text-white">
            INSPIRE<span className="text-gold-400"> DECOR</span>
          </Link>
          <p className="mt-0.5 text-[11px] uppercase tracking-widest text-ink-500">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} end={item.end} />
          ))}
        </nav>
        <div className="px-5 py-4 text-[11px] leading-relaxed text-ink-500">{DEMO_DATA_NOTICE}</div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-ink-200 bg-white px-4 py-3 sm:px-6">
          <p className="text-sm font-medium text-ink-500">
            Admin <span className="mx-1 text-ink-300">/</span>
            <span className="text-ink-900">Dashboard</span>
          </p>
          <div className="flex items-center gap-3">
            <Badge tone="gold">{DEMO_DATA_BADGE}</Badge>
            <Link
              to="/"
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-gold-500 hover:text-gold-700"
            >
              View site
            </Link>
          </div>
        </header>

        {/* Mobile nav row */}
        <nav className="flex gap-2 overflow-x-auto border-b border-ink-200 bg-white px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link key={item.href} to={item.href} className={mobileLinkClasses(item.href, item.end)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
