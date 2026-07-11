import { Icon } from "./Icon";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  tone?: "navy" | "teal" | "accent";
  delta?: { value: string; direction: "up" | "down" };
  hint?: string;
}

const toneStyles = {
  navy: "bg-navy-50 text-navy-700",
  teal: "bg-teal-50 text-teal-600",
  accent: "bg-accent-50 text-accent-600",
};

export function StatCard({ label, value, icon, tone = "navy", delta, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneStyles[tone])}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              delta.direction === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-navy-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-navy-500">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-navy-400">{hint}</p>}
    </div>
  );
}
