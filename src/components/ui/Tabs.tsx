"use client";

import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-1 rounded-xl bg-surface-muted p-1", className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-500 hover:text-navy-800",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  isActive ? "bg-teal-100 text-teal-700" : "bg-navy-100 text-navy-500",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
