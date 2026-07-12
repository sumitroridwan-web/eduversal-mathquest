"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ProgressBar } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/States";
import { assignments } from "@/data/school";
import { getResources } from "@/data/resources";
import { formatDate } from "@/lib/utils";
import { Plus, Calendar, Users, Target } from "lucide-react";
import { AssignmentInbox } from "@/components/dashboards/AssignmentInbox";

export default function TeacherAssignments() {
  const [tab, setTab] = useState("active");
  const filtered = assignments.filter((a) => (tab === "all" ? true : a.status === tab));

  return (
    <div className="space-y-6">
      <PageHeading
        title="Assignments"
        description="Track completion, performance and learning evidence across your classes."
        actions={<Button asChildHref="/teacher/assignments/create"><Plus className="h-4 w-4" /> New assignment</Button>}
      />

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-navy-700">Assigned from the library</h2>
        <AssignmentInbox mode="teacher" />
      </section>

      <Tabs
        tabs={[
          { id: "active", label: "Active", count: assignments.filter((a) => a.status === "active").length },
          { id: "scheduled", label: "Scheduled", count: assignments.filter((a) => a.status === "scheduled").length },
          { id: "closed", label: "Closed", count: assignments.filter((a) => a.status === "closed").length },
          { id: "all", label: "All", count: assignments.length },
        ]}
        active={tab}
        onChange={setTab}
        className="w-fit"
      />

      {filtered.length === 0 ? (
        <EmptyState icon="ClipboardList" title="No assignments here" description="Create an assignment to get started." action={<Button asChildHref="/teacher/assignments/create"><Plus className="h-4 w-4" /> New assignment</Button>} />
      ) : (
        <div className="grid gap-4">
          {filtered.map((a) => {
            const res = getResources(a.resourceIds);
            return (
              <div key={a.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-semibold text-navy-900">{a.title}</h3>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-sm text-navy-500">“{a.objective.student}”</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-400">
                      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {a.assignedTo.label}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due {formatDate(a.dueDate)}</span>
                      <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" /> {a.strand}</span>
                      {a.twm && <Badge tone="purple">{a.twm}</Badge>}
                    </div>
                  </div>
                  <div className="sm:w-56">
                    <div className="mb-1 flex justify-between text-xs text-navy-500">
                      <span>Completion</span>
                      <span className="font-semibold text-navy-900">{a.completedStudents}/{a.totalStudents}</span>
                    </div>
                    <ProgressBar value={a.completion} showLabel tone="teal" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-50 pt-3">
                  {res.map((r) => <Badge key={r.id} tone="grey">{r.title}</Badge>)}
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="ghost">View responses</Button>
                    <Button size="sm" variant="outline">Give feedback</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
