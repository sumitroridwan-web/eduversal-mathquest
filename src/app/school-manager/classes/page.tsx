"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { classes } from "@/data/school";
import type { ClassRoom } from "@/types";

export default function ManagerClasses() {
  const columns: Column<ClassRoom>[] = [
    { key: "name", header: "Class", render: (c) => <span className="font-semibold text-navy-900">{c.name}</span> },
    { key: "grade", header: "Grade / Stage", render: (c) => <span className="text-sm text-navy-600">{c.gradeLevel} · {c.stage}</span> },
    { key: "teacher", header: "Teacher", render: (c) => c.teacherName },
    { key: "students", header: "Students", align: "right", render: (c) => <Badge tone="grey">{c.studentIds.length}</Badge> },
    { key: "progress", header: "Avg progress", render: (c) => <div className="w-36"><ProgressBar value={c.avgProgress} showLabel tone={c.avgProgress > 60 ? "teal" : "accent"} /></div> },
  ];
  return (
    <div className="space-y-6">
      <PageHeading title="Classes" description="All classes across your school and their progress." />
      <DataTable columns={columns} data={classes} keyField={(c) => c.id} />
    </div>
  );
}
