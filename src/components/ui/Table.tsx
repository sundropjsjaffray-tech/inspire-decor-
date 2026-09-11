import type { ReactNode } from "react";
import { cn } from "~/lib/util";

export type SortDirection = "asc" | "desc";

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  /** When true and onSort is provided, the header renders a sort toggle. */
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  keyOf: (row: T) => string;
  emptyMessage?: string;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDir?: SortDirection;
  className?: string;
}

export function Table<T>({
  columns,
  rows,
  keyOf,
  emptyMessage = "No records to show.",
  onSort,
  sortKey,
  sortDir,
  className,
}: TableProps<T>) {
  const alignClass = { left: "text-left", right: "text-right", center: "text-center" };

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-ink-200 bg-white", className)}>
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-ink-200 bg-ink-50 text-left">
            {columns.map((col) => {
              const sortable = Boolean(col.sortable && onSort);
              const active = sortable && sortKey === col.key;
              return (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-500",
                    alignClass[col.align ?? "left"],
                    sortable && "cursor-pointer select-none hover:text-ink-800"
                  )}
                  onClick={sortable ? () => onSort?.(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {sortable && <span aria-hidden>{active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={keyOf(row)} className="border-b border-ink-100 last:border-0 hover:bg-champagne-100/50">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-ink-700", alignClass[col.align ?? "left"])}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
