import type { HTMLAttributes } from "react";
import { cn } from "~/lib/util";

export type BadgeTone = "gold" | "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<BadgeTone, string> = {
  gold: "border-gold-300 bg-gold-100 text-gold-700",
  neutral: "border-ink-200 bg-ink-100 text-ink-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
