import * as React from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./States";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: { title: string; description?: string; icon?: string };
  caption?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  empty,
  caption,
}: DataTableProps<T>) {
  if (data.length === 0 && empty) {
    return <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />;
  }
  const alignClass = { left: "text-left", right: "text-right", center: "text-center" };
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-navy-100 bg-surface-soft">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-navy-400",
                  alignClass[c.align ?? "left"],
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-50">
          {data.map((row) => (
            <tr
              key={keyField(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "transition-colors",
                onRowClick && "cursor-pointer hover:bg-surface-soft",
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn("px-4 py-3 text-navy-700", alignClass[c.align ?? "left"], c.className)}
                >
                  {c.render ? c.render(row) : (row as Record<string, React.ReactNode>)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
