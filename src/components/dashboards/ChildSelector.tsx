"use client";

import { useAuth } from "@/stores/auth";
import { useParent } from "@/stores/parent";
import { getStudent } from "@/data/school";
import { cn } from "@/lib/utils";

export function ChildSelector() {
  const user = useAuth((s) => s.user);
  const { selectedChildId, setChild } = useParent();
  const childIds = user?.childIds ?? ["stu-1", "stu-7"];

  return (
    <div className="flex flex-wrap gap-2">
      {childIds.map((id) => {
        const child = getStudent(id);
        if (!child) return null;
        const active = id === selectedChildId;
        return (
          <button
            key={id}
            onClick={() => setChild(id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors",
              active ? "border-teal-500 bg-teal-50" : "border-navy-100 bg-white hover:border-navy-200",
            )}
            aria-pressed={active}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-xl" aria-hidden>
              {child.avatar}
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-navy-900">{child.firstName}</span>
              <span className="block text-xs text-navy-400">{child.gradeLevel}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
