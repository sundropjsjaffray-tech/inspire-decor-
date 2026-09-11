import type { ReactNode } from "react";
import { cn } from "~/lib/util";

export type StatTone = "default" | "gold" | "warning" | "info" | "danger";

const accentClasses: Record<StatTone, string> = {
  default: "border-ink-200",
  gold: "border-gold-400",
  warning: "border-amber-400",
  info: "border-sky-400",
  danger: "border-red-400",
};

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: StatTone;
  className?: string;
}

export function StatCard({ label, value, hint, tone = "default", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-l-4 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        accentClasses[tone],
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold text-ink-950 sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
