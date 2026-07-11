"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { BarSeries, MasteryRadar, AreaTrend } from "@/components/charts/Charts";
import { StudentsTable } from "@/components/dashboards/StudentsTable";
import { topicMastery, strandMasteryRadar, completionTrend } from "@/data/analytics";

export default function TeacherProgress() {
  return (
    <div className="space-y-6">
      <PageHeading title="Progress tracking" description="Monitor mastery, learning gaps and completion across your classes." />
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Topic mastery" description="Identify strengths and gaps" className="lg:col-span-2">
          <BarSeries data={topicMastery} xKey="topic" bars={[{ key: "mastery", label: "Mastery %", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="Strand balance"><MasteryRadar data={strandMasteryRadar} /></ChartCard>
      </div>
      <ChartCard title="Completion trend" description="Assigned vs completed activities">
        <AreaTrend data={completionTrend} xKey="week" series={[
          { key: "assigned", label: "Assigned", color: "navyLight" },
          { key: "completed", label: "Completed", color: "teal" },
        ]} />
      </ChartCard>
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Individual progress</h2>
        <StudentsTable classIds={["cls-2a", "cls-3b"]} />
      </section>
    </div>
  );
}
