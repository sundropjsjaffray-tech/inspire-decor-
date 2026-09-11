import { cn } from "~/lib/util";

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-12 text-ink-500", className)}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-gold-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
