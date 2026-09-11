import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, actions }: PageHeaderProps) {
  return (
    <header className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-ink-500 sm:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
