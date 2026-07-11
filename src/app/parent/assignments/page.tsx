"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ChildSelector } from "@/components/dashboards/ChildSelector";
import { studentAssignments } from "@/data/school";
import { resources } from "@/data/resources";
import { ResourceCover } from "@/components/content/ResourceCover";
import { formatDate } from "@/lib/utils";

export default function ParentAssignments() {
  return (
    <div className="space-y-6">
      <PageHeading title="Assignments" description="Activities set by your child's teacher. You can view but not change these." />
      <ChildSelector />
      <div className="grid gap-4">
        {studentAssignments.map((a) => {
          const res = resources.find((r) => r.title === a.resourceTitle);
          return (
            <div key={a.assignmentId} className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
              {res && <ResourceCover cover={res.cover} type={res.type} className="h-14 w-14 rounded-xl" size="sm" />}
              <div className="flex-1">
                <p className="font-semibold text-navy-900">{a.resourceTitle}</p>
                <p className="text-sm text-navy-500">{a.title}</p>
                <p className="mt-0.5 text-xs text-navy-400">Due {formatDate(a.dueDate)}</p>
              </div>
              <div className="text-right">
                {a.score != null && <p className="font-display text-lg font-bold text-teal-600">{a.score}%</p>}
                <Badge tone={a.status === "completed" ? "green" : a.status === "in-progress" ? "teal" : a.status === "needs-review" ? "amber" : "grey"}>
                  {a.descriptor ?? a.status.replace("-", " ")}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
