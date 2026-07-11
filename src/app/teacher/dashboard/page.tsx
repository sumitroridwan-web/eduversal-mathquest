"use client";

import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { BarSeries, MasteryRadar } from "@/components/charts/Charts";
import { ProgressBar } from "@/components/ui/Progress";
import { topicMastery, strandMasteryRadar } from "@/data/analytics";
import { classes, assignments, students } from "@/data/school";
import { resources } from "@/data/resources";
import { ResourceCover } from "@/components/content/ResourceCover";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { Plus, ArrowRight } from "lucide-react";

export default function TeacherDashboard() {
  const user = useAuth((s) => s.user);
  const myClasses = classes.filter((c) => c.teacherId === "u-teacher");
  const recommended = resources.filter((r) => ["res-fraction-pizza", "res-numberline", "res-times-table-challenge"].includes(r.id));

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Good day, ${user?.firstName ?? "Teacher"}`}
        description="Here's what's happening across your classes."
        actions={<Button asChildHref="/teacher/assignments/create"><Plus className="h-4 w-4" /> New assignment</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My classes" value={myClasses.length} icon="Users" tone="navy" />
        <StatCard label="Students" value={myClasses.reduce((a, c) => a + c.studentIds.length, 0)} icon="Baby" tone="teal" />
        <StatCard label="Active assignments" value={assignments.length} icon="ClipboardList" tone="accent" />
        <StatCard label="Avg completion" value="63%" icon="TrendingUp" tone="navy" delta={{ value: "5%", direction: "up" }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Topic mastery" description="Across your classes" className="lg:col-span-2">
          <BarSeries data={topicMastery} xKey="topic" bars={[{ key: "mastery", label: "Mastery %", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="Strand balance" description="Where your class is strong">
          <MasteryRadar data={strandMasteryRadar} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-navy-900">My classes</h3>
            <Button variant="ghost" size="sm" asChildHref="/teacher/classes">View all <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-3">
            {myClasses.map((c) => (
              <Link key={c.id} href="/teacher/classes" className="block rounded-xl border border-navy-100 p-3 hover:border-teal-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-navy-900">{c.name}</p>
                    <p className="text-xs text-navy-400">{c.gradeLevel} · {c.studentIds.length} students · {c.stage}</p>
                  </div>
                  <span className="text-sm font-semibold text-navy-900">{c.avgProgress}%</span>
                </div>
                <ProgressBar value={c.avgProgress} className="mt-2" tone="teal" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-navy-900">Upcoming & recent</h3>
            <Button variant="ghost" size="sm" asChildHref="/teacher/assignments">All assignments <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <ul className="space-y-3">
            {assignments.map((a) => (
              <li key={a.id} className="rounded-xl border border-navy-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">{a.title}</p>
                  <Badge tone="teal">{a.assignedTo.label}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-navy-400">
                  <span>Due {formatDate(a.dueDate)}</span>
                  <span>{a.completedStudents}/{a.totalStudents} done</span>
                </div>
                <ProgressBar value={a.completion} className="mt-1.5" size="sm" tone="accent" />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-navy-900">Recommended for your classes</h3>
          <Button variant="ghost" size="sm" asChildHref="/teacher/library">Browse library <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {recommended.map((r) => (
            <Link key={r.id} href={`/teacher/library/${r.id}`} className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              <ResourceCover cover={r.cover} type={r.type} className="h-24 w-full" size="sm" />
              <div className="p-4">
                <p className="font-semibold text-navy-900 group-hover:text-teal-700">{r.title}</p>
                <p className="mt-1 text-xs text-navy-400">{r.strand} · {r.difficulty}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
