"use client";

import { StatCard } from "@/components/ui/StatCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { BarSeries, AreaTrend } from "@/components/charts/Charts";
import { ProgressBar } from "@/components/ui/Progress";
import { classProgress, completionTrend, teacherActivity, strandCoverage } from "@/data/analytics";
import { students } from "@/data/school";
import { Download, TriangleAlert, Sparkles } from "lucide-react";
import { useAuth } from "@/stores/auth";

export default function SchoolManagerDashboard() {
  const user = useAuth((s) => s.user);
  const support = students.filter((s) => s.needsSupport);
  const extension = students.filter((s) => s.readyForExtension);

  return (
    <div className="space-y-6">
      <PageHeading
        title={user?.schoolName ?? "School overview"}
        description="Mathematics programme implementation across your school."
        actions={<Button variant="outline"><Download className="h-4 w-4" /> School report</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Teachers active" value="22 / 24" icon="GraduationCap" tone="navy" hint="92% this week" />
        <StatCard label="Students engaged" value="431 / 486" icon="Baby" tone="teal" delta={{ value: "6%", direction: "up" }} />
        <StatCard label="Assignment completion" value="78%" icon="ClipboardCheck" tone="accent" delta={{ value: "4%", direction: "up" }} />
        <StatCard label="Curriculum coverage" value="74%" icon="Map" tone="navy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Progress by class" description="Average mastery across classes">
          <BarSeries data={classProgress} xKey="name" layout="vertical" bars={[{ key: "progress", label: "Progress", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="Assignment completion" description="Assigned vs completed">
          <AreaTrend data={completionTrend} xKey="week" series={[
            { key: "assigned", label: "Assigned", color: "navyLight" },
            { key: "completed", label: "Completed", color: "teal" },
          ]} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Teacher activity" description="Assignments set & feedback given" className="lg:col-span-2">
          <BarSeries data={teacherActivity} xKey="name" bars={[
            { key: "assignments", label: "Assignments", color: "navy" },
            { key: "feedback", label: "Feedback", color: "accent" },
          ]} />
        </ChartCard>
        <ChartCard title="Coverage by strand">
          <div className="space-y-4 pt-2">
            {strandCoverage.map((s) => (
              <div key={s.strand}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-navy-700">{s.strand}</span>
                  <span className="font-semibold text-navy-900">{s.coverage}%</span>
                </div>
                <ProgressBar value={s.coverage} tone="teal" />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-amber-600" />
            <h3 className="font-display font-semibold text-navy-900">Students needing support</h3>
            <Badge tone="amber" className="ml-auto">{support.length}</Badge>
          </div>
          <ul className="space-y-2">
            {support.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm">
                <span className="flex items-center gap-2">
                  <span aria-hidden>{s.avatar}</span>
                  <span className="font-medium text-navy-900">{s.name}</span>
                  <span className="text-navy-400">· {s.className}</span>
                </span>
                <span className="font-semibold text-amber-700">{s.progress}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <h3 className="font-display font-semibold text-navy-900">Ready for extension</h3>
            <Badge tone="green" className="ml-auto">{extension.length}</Badge>
          </div>
          <ul className="space-y-2">
            {extension.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm">
                <span className="flex items-center gap-2">
                  <span aria-hidden>{s.avatar}</span>
                  <span className="font-medium text-navy-900">{s.name}</span>
                  <span className="text-navy-400">· {s.className}</span>
                </span>
                <span className="font-semibold text-teal-700">{s.progress}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
