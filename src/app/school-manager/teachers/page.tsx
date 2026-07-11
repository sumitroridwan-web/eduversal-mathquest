"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { teacherActivity } from "@/data/analytics";
import { useToasts } from "@/stores/ui";
import { UserPlus } from "lucide-react";

interface Row { name: string; assignments: number; feedback: number; active: number }

export default function ManagerTeachers() {
  const notify = useToasts((s) => s.notify);
  const columns: Column<Row>[] = [
    { key: "name", header: "Teacher", render: (t) => (
      <div className="flex items-center gap-2.5"><Avatar name={t.name} size="sm" /><span className="font-semibold text-navy-900">{t.name}</span></div>
    ) },
    { key: "assignments", header: "Assignments", align: "right", render: (t) => t.assignments },
    { key: "feedback", header: "Feedback given", align: "right", render: (t) => t.feedback },
    { key: "active", header: "Engagement", render: (t) => <div className="w-32"><ProgressBar value={t.active} showLabel tone={t.active > 70 ? "teal" : "accent"} /></div> },
    { key: "status", header: "Status", render: (t) => <Badge tone={t.active > 60 ? "green" : "amber"}>{t.active > 60 ? "Active" : "Low activity"}</Badge> },
  ];
  return (
    <div className="space-y-6">
      <PageHeading
        title="Teachers"
        description="Monitor teacher activity and Mathematics programme delivery."
        actions={<Button onClick={() => notify({ variant: "info", title: "Invite teacher", description: "Invitation flow is a prototype placeholder." })}><UserPlus className="h-4 w-4" /> Invite teacher</Button>}
      />
      <DataTable columns={columns} data={teacherActivity} keyField={(t) => t.name} />
    </div>
  );
}
