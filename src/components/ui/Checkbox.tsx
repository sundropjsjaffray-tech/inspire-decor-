import type { ComponentProps } from "react";
import { cn } from "~/lib/util";

export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("h-4 w-4 rounded border-ink-300 accent-gold-500", className)}
      {...props}
    />
  );
}

export function CheckboxField({
  label,
  description,
  ...props
}: ComponentProps<"input"> & { label: string; description?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <Checkbox className="mt-0.5" {...props} />
      <span>
        <span className="block text-sm font-medium text-ink-800">{label}</span>
        {description && <span className="block text-xs text-ink-500">{description}</span>}
      </span>
    </label>
  );
}
