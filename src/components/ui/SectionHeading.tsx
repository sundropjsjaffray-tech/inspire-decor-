import { cn } from "~/lib/util";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{eyebrow}</p>
      )}
      <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">{title}</h2>
      {description && (
        <p className={cn("mt-2 max-w-2xl text-sm text-ink-500 sm:text-base", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
