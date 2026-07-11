"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { SearchField, Select } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { students as allStudents } from "@/data/school";
import { formatDate } from "@/lib/utils";
import type { StudentRecord } from "@/types";

export function StudentsTable({ classIds }: { classIds?: string[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const source = classIds ? allStudents.filter((s) => classIds.includes(s.classId)) : allStudents;
  const data = useMemo(
    () =>
      source.filter((s) => {
        const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
          filter === "all" ||
          (filter === "support" && s.needsSupport) ||
          (filter === "extension" && s.readyForExtension);
        return matchesQuery && matchesFilter;
      }),
    [source, query, filter],
  );

  const columns: Column<StudentRecord>[] = [
    { key: "name", header: "Student", render: (s) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-lg" aria-hidden>{s.avatar}</span>
        <div>
          <p className="font-semibold text-navy-900">{s.name}</p>
          <p className="text-xs text-navy-400">{s.className}</p>
        </div>
      </div>
    ) },
    { key: "progress", header: "Progress", render: (s) => (
      <div className="w-32"><ProgressBar value={s.progress} showLabel tone={s.progress > 65 ? "teal" : "accent"} /></div>
    ) },
    { key: "points", header: "Points", align: "right", render: (s) => s.points },
    { key: "badges", header: "Badges", align: "right", render: (s) => s.badges },
    { key: "streak", header: "Streak", align: "right", render: (s) => `${s.streak}🔥` },
    { key: "flag", header: "Status", render: (s) =>
      s.needsSupport ? <Badge tone="amber">Needs support</Badge> :
      s.readyForExtension ? <Badge tone="green">Extension</Badge> :
      <Badge tone="grey">On track</Badge> },
    { key: "lastActive", header: "Last active", render: (s) => <span className="text-xs text-navy-400">{formatDate(s.lastActive)}</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchField placeholder="Search students…" value={query} onChange={(e) => setQuery(e.target.value)} wrapperClassName="flex-1" />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-52">
          <option value="all">All students</option>
          <option value="support">Needs support</option>
          <option value="extension">Ready for extension</option>
        </Select>
      </div>
      <DataTable columns={columns} data={data} keyField={(s) => s.id} empty={{ title: "No students found", icon: "Users" }} />
    </div>
  );
}
