"use client";

import { StatCard } from "@/components/ui/StatCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { AreaTrend, BarSeries, DonutChart } from "@/components/charts/Charts";
import { DataTable, type Column } from "@/components/ui/DataTable";
import {
  usersByRole, registrationTrend, completionTrend, popularContent, strandCoverage,
} from "@/data/analytics";
import { schools } from "@/data/school";
import { formatNumber } from "@/lib/utils";
import type { School } from "@/types";
import { Download } from "lucide-react";

const schoolColumns: Column<School>[] = [
  { key: "name", header: "School", render: (s) => (
    <div>
      <p className="font-semibold text-navy-900">{s.name}</p>
      <p className="text-xs text-navy-400">{s.location}</p>
    </div>
  ) },
  { key: "students", header: "Students", align: "right", render: (s) => formatNumber(s.students) },
  { key: "activeStudents", header: "Active", align: "right", render: (s) => (
    <span className="font-medium text-teal-700">{Math.round((s.activeStudents / s.students) * 100)}%</span>
  ) },
  { key: "teachers", header: "Teachers", align: "right", render: (s) => s.teachers },
  { key: "status", header: "Status", render: (s) => <Badge tone={s.status === "active" ? "green" : s.status === "onboarding" ? "amber" : "red"}>{s.status}</Badge> },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Platform overview"
        description="Everything happening across Eduversal MathQuest today."
        actions={<Button variant="outline"><Download className="h-4 w-4" /> Export report</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={formatNumber(3032)} icon="Users" tone="navy" delta={{ value: "12%", direction: "up" }} hint="vs last month" />
        <StatCard label="Active this week" value={formatNumber(2418)} icon="Activity" tone="teal" delta={{ value: "8%", direction: "up" }} />
        <StatCard label="Schools" value={schools.length} icon="Building2" tone="accent" hint="3 active · 1 onboarding" />
        <StatCard label="Activities completed" value={formatNumber(48210)} icon="CircleCheck" tone="navy" delta={{ value: "15%", direction: "up" }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="New registrations" description="Students & teachers over time" className="lg:col-span-2">
          <AreaTrend
            data={registrationTrend}
            xKey="month"
            series={[
              { key: "students", label: "Students", color: "teal" },
              { key: "teachers", label: "Teachers", color: "navy" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Users by role" description="Distribution across the platform">
          <DonutChart data={usersByRole} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Completion trend" description="Assigned vs completed activities">
          <AreaTrend
            data={completionTrend}
            xKey="week"
            series={[
              { key: "assigned", label: "Assigned", color: "navyLight" },
              { key: "completed", label: "Completed", color: "teal" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Curriculum coverage" description="Content mapped by strand (%)">
          <BarSeries
            data={strandCoverage}
            xKey="strand"
            layout="vertical"
            bars={[{ key: "coverage", label: "Coverage", color: "accent" }]}
          />
        </ChartCard>
      </div>

      <ChartCard title="Most popular content" description="Top games and simulations by plays">
        <BarSeries
          data={popularContent}
          xKey="title"
          layout="vertical"
          height={280}
          bars={[{ key: "plays", label: "Plays", color: "teal" }]}
        />
      </ChartCard>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-900">Schools</h2>
          <Button variant="ghost" size="sm" asChildHref="/admin/schools">View all</Button>
        </div>
        <DataTable columns={schoolColumns} data={schools} keyField={(s) => s.id} />
      </section>
    </div>
  );
}
