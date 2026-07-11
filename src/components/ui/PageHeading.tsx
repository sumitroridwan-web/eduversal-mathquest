import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeading({ title, description, actions, className }: PageHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2>
      {action}
    </div>
  );
}
