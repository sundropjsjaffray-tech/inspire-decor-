import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "~/lib/util";
import { DEMO_DATA_NOTICE } from "~/lib/demo";
import { EnquiryWidget } from "~/components/customer/EnquiryWidget";

const NAV = [
  { href: "/", label: "Home", end: true },
  { href: "/services", label: "Services" },
  { href: "/hire", label: "Hire" },
  { href: "/gallery", label: "Gallery" },
  { href: "/corporate", label: "Corporate" },
  { href: "/consultation", label: "Consultation" },
  { href: "/contact", label: "Contact" },
];

/** Active-aware nav link (this router version ships no NavLink). */
function NavItem({ href, label, end = false }: { href: string; label: string; end?: boolean }) {
  const pathname = useLocation().pathname;
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      to={href}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive ? "text-gold-700" : "text-ink-600 hover:text-ink-950"
      )}
    >
      {label}
    </Link>
  );
}

export function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-champagne-100/40">
      <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="font-display text-xl font-bold tracking-wide text-ink-950">
            INSPIRE<span className="text-gold-600"> DECOR</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} end={item.end} />
            ))}
          </nav>
          <Link
            to="/quote"
            className="inline-flex items-center justify-center rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-ink-950 shadow-sm transition-colors hover:bg-gold-400"
          >
            Get a Quote
          </Link>
        </div>
        {/* Mobile nav row */}
        <nav className="flex gap-4 overflow-x-auto border-t border-ink-100 px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} end={item.end} />
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>

      <footer className="border-t border-ink-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <p className="font-display text-lg font-bold text-ink-950">
            INSPIRE<span className="text-gold-600"> DECOR</span>
          </p>
          <p className="mt-1 text-xs text-ink-400">{DEMO_DATA_NOTICE}</p>
          <p className="mt-4 text-xs text-ink-400">
            © {new Date().getFullYear()} INSPIRE DECOR · Transforming Events Into Experiences
          </p>
        </div>
      </footer>

      <EnquiryWidget />
    </div>
  );
}
