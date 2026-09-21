import { formatZAR } from "~/lib/util";
import { cn } from "~/lib/util";

export interface PriceTagProps {
  amount: number | null;
  className?: string;
  /** Small prefix text before the price, e.g. "from". */
  prefix?: string;
  /** Renders "Custom Quote" instead of a number. */
  custom?: boolean;
}

export function PriceTag({ amount, className, prefix, custom = false }: PriceTagProps) {
  if (custom || amount === null) {
    return <span className={cn("font-semibold text-ink-600", className)}>Custom Quote</span>;
  }
  return (
    <span className={cn("font-semibold text-ink-900", className)}>
      {prefix && <span className="mr-1 text-xs font-medium text-ink-400">{prefix}</span>}
      <span className="text-gold-700">{formatZAR(amount)}</span>
    </span>
  );
}
