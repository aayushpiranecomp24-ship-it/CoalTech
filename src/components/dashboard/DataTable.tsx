import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = "No records available",
  className,
}: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-sm text-[var(--color-text-muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-card", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="transition-colors hover:bg-[var(--color-bg-elevated)]"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-5 py-3.5", col.className)}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Status chip for tables */
export function TableStatusChip({ status, label }: { status: string; label: string }) {
  const map: Record<string, string> = {
    active: "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25",
    available: "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25",
    completed: "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25",
    success: "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25",
    compliant: "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25",
    in_transit: "bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/25",
    dispatched: "bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/25",
    on_trip: "bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/25",
    in_progress: "bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/25",
    pending: "bg-[#6b7280]/10 text-[#9ca3af] border border-[#6b7280]/25",
    draft: "bg-[#6b7280]/10 text-[#9ca3af] border border-[#6b7280]/25",
    cancelled: "bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/25",
    overdue: "bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/25",
    suspended: "bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/25",
    violation: "bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/25",
    critical: "bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/25",
    scheduled: "bg-[#06b6d4]/10 text-[#22d3ee] border border-[#06b6d4]/25",
    maintenance: "bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/25",
    on_leave: "bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/25",
    on_duty: "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25",
    off_duty: "bg-[#6b7280]/10 text-[#9ca3af] border border-[#6b7280]/25",
    idle: "bg-[#6b7280]/10 text-[#9ca3af] border border-[#6b7280]/25",
  };
  const cls = map[status.toLowerCase()] || "bg-[#6b7280]/10 text-[#9ca3af] border border-[#6b7280]/25";
  return (
    <span className={cn("inline-flex rounded-lg px-2.5 py-0.5 text-xs font-semibold", cls)}>
      {label}
    </span>
  );
}
