import type { ReactNode } from "react";
import { cn } from "~/lib/util";

export interface TabItem {
  id: string;
  label: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === tab.id
              ? "bg-white text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-800"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
