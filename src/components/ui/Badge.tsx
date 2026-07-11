import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "teal" | "accent" | "grey" | "green" | "amber" | "red" | "purple";

const tones: Record<Tone, string> = {
  navy: "bg-navy-50 text-navy-700 ring-navy-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
  accent: "bg-accent-50 text-accent-700 ring-accent-200",
  grey: "bg-surface-muted text-navy-600 ring-navy-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  purple: "bg-purple-50 text-purple-700 ring-purple-200",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "grey", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

const statusTone: Record<string, Tone> = {
  published: "green",
  active: "green",
  draft: "grey",
  review: "amber",
  scheduled: "amber",
  archived: "red",
  closed: "grey",
  onboarding: "amber",
  suspended: "red",
  completed: "green",
  "in-progress": "teal",
  "not-started": "grey",
  "needs-review": "amber",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone[status] ?? "grey";
  const label = status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return <Badge tone={tone}>{label}</Badge>;
}
