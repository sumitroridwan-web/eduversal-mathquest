"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { useAuth } from "@/stores/auth";
import { getStudent } from "@/data/school";
import { useToasts } from "@/stores/ui";
import { Plus } from "lucide-react";

export default function ParentChildren() {
  const user = useAuth((s) => s.user);
  const notify = useToasts((s) => s.notify);
  const childIds = user?.childIds ?? ["stu-1", "stu-7"];

  return (
    <div className="space-y-6">
      <PageHeading
        title="My children"
        description="The children officially linked to your account."
        actions={<Button variant="outline" onClick={() => notify({ variant: "info", title: "Link a child", description: "Ask your school for a link code to add a child." })}><Plus className="h-4 w-4" /> Link a child</Button>}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {childIds.map((id) => {
          const child = getStudent(id);
          if (!child) return null;
          return (
            <div key={id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-accent-100 text-4xl" aria-hidden>{child.avatar}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-900">{child.name}</h3>
                  <p className="text-sm text-navy-400">{child.gradeLevel} · {child.className}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge tone="accent">⭐ {child.points}</Badge>
                    <Badge tone="teal">🏅 {child.badges}</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm"><span className="text-navy-600">Overall progress</span><span className="font-semibold text-navy-900">{child.progress}%</span></div>
                <ProgressBar value={child.progress} tone="teal" />
              </div>
              <div className="mt-4 flex justify-end border-t border-navy-50 pt-3">
                <Button size="sm" variant="ghost" asChildHref="/parent/progress">View progress</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
