import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/util";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-500 text-ink-950 hover:bg-gold-400 focus-visible:outline-gold-500 shadow-sm",
  secondary:
    "border border-ink-300 bg-white text-ink-800 hover:border-gold-500 hover:text-gold-700 focus-visible:outline-gold-500",
  ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-ink-400",
  danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

/** Shared class builder so Link/NavLink can be styled exactly like buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonClasses(variant, size), className)} {...props}>
      {children}
    </button>
  );
}
