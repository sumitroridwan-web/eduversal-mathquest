import * as React from "react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-navy-100 bg-white p-5 shadow-card", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-navy-900">{title}</h3>
          {description && <p className="mt-0.5 text-sm text-navy-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
