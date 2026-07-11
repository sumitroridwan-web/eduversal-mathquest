import * as React from "react";
import { Loader2 } from "lucide-react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon = "SearchX", title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-surface-soft px-6 py-14 text-center",
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-100 text-navy-400">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-navy-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-navy-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-400">
      <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
        <Icon name="TriangleAlert" className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-navy-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-navy-100", className)} />;
}
