import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/util";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  padded?: boolean;
}

export function Card({ children, className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-xl border border-ink-200 bg-white shadow-sm", padded && "p-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
