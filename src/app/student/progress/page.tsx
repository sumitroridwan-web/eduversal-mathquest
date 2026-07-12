"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { ProgressOverview } from "@/components/dashboards/ProgressOverview";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { BarSeries, MasteryRadar, AreaTrend } from "@/components/charts/Charts";
import { ProgressBar } from "@/components/ui/Progress";
import { topicMastery, strandMasteryRadar, weeklyLearningTime } from "@/data/analytics";
import { getStudent } from "@/data/school";

const growth = [
  { month: "Mar", mastery: 42 },
  { month: "Apr", mastery: 51 },
  { month: "May", mastery: 60 },
  { month: "Jun", mastery: 69 },
  { month: "Jul", mastery: 78 },
];

export default function StudentProgress() {
  const student = getStudent("stu-1");
  return (
    <div className="space-y-6">
      <PageHeading title="My progress" description="See how much you've grown as a mathematician!" />

      <ProgressOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="My growth" description="Overall mastery over time" className="lg:col-span-2">
          <AreaTrend data={growth} xKey="month" series={[{ key: "mastery", label: "Mastery %", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="My strands"><MasteryRadar data={strandMasteryRadar} /></ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Progress by topic">
          <div className="space-y-3 pt-1">
            {topicMastery.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex justify-between text-sm"><span className="text-navy-700">{t.topic}</span><span className="font-semibold text-navy-900">{t.mastery}%</span></div>
                <ProgressBar value={t.mastery} tone={t.mastery > 70 ? "teal" : "accent"} />
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Time spent this week" description={`Great effort, ${student?.firstName}!`}>
          <BarSeries data={weeklyLearningTime} xKey="day" bars={[{ key: "minutes", label: "Minutes", color: "accent" }]} />
        </ChartCard>
      </div>
    </div>
  );
}
