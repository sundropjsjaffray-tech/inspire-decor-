import type { ReactNode } from "react";
import { cn } from "~/lib/util";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 bg-champagne-100/50 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-lg text-gold-600">
        ◆
      </div>
      <h3 className="font-display text-xl font-semibold text-ink-900">{title}</h3>
      {description && <p className="max-w-md text-sm text-ink-500">{description}</p>}
      {action}
    </div>
  );
}
