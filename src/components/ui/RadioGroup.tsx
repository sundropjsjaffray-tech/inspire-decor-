import { cn } from "~/lib/util";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({ name, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={cn("space-y-2", className)} role="radiogroup">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
            value === option.value
              ? "border-gold-500 bg-gold-50"
              : "border-ink-200 bg-white hover:border-ink-300"
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-0.5 h-4 w-4 accent-gold-500"
          />
          <span>
            <span className="block text-sm font-medium text-ink-800">{option.label}</span>
            {option.description && (
              <span className="block text-xs text-ink-500">{option.description}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
