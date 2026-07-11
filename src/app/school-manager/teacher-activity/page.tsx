"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { BarSeries } from "@/components/charts/Charts";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { teacherActivity } from "@/data/analytics";
import { formatDate } from "@/lib/utils";

interface Row { name: string; assignments: number; feedback: number; active: number }

export default function TeacherActivityPage() {
  const columns: Column<Row>[] = [
    { key: "name", header: "Teacher", render: (t) => <div className="flex items-center gap-2.5"><Avatar name={t.name} size="sm" /><span className="font-semibold text-navy-900">{t.name}</span></div> },
    { key: "assignments", header: "Assignments set", align: "right", render: (t) => t.assignments },
    { key: "feedback", header: "Feedback given", align: "right", render: (t) => t.feedback },
    { key: "active", header: "Engagement", align: "right", render: (t) => `${t.active}%` },
    { key: "last", header: "Last active", render: () => <span className="text-xs text-navy-400">{formatDate("2026-07-11")}</span> },
    { key: "status", header: "Status", render: (t) => <Badge tone={t.active > 60 ? "green" : "amber"}>{t.active > 60 ? "Active" : "Needs a nudge"}</Badge> },
  ];
  return (
    <div className="space-y-6">
      <PageHeading title="Teacher activity" description="Monitor engagement, assignments set and feedback given." />
      <ChartCard title="Activity overview" description="Assignments set & feedback given per teacher">
        <BarSeries data={teacherActivity} xKey="name" bars={[
          { key: "assignments", label: "Assignments", color: "navy" },
          { key: "feedback", label: "Feedback", color: "accent" },
        ]} />
      </ChartCard>
      <DataTable columns={columns} data={teacherActivity} keyField={(t) => t.name} />
    </div>
  );
}
