"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { ChildSelector } from "@/components/dashboards/ChildSelector";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { BarSeries, MasteryRadar, AreaTrend } from "@/components/charts/Charts";
import { ProgressBar } from "@/components/ui/Progress";
import { useParent } from "@/stores/parent";
import { getStudent } from "@/data/school";
import { topicMastery, weeklyLearningTime } from "@/data/analytics";

const growth = [
  { month: "Mar", mastery: 40 },
  { month: "Apr", mastery: 49 },
  { month: "May", mastery: 58 },
  { month: "Jun", mastery: 66 },
  { month: "Jul", mastery: 74 },
];

export default function ParentProgress() {
  const childId = useParent((s) => s.selectedChildId);
  const child = getStudent(childId);
  if (!child) return null;

  return (
    <div className="space-y-6">
      <PageHeading title="Progress" description="A detailed view of your child's Mathematics learning." />
      <ChildSelector />

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title={`${child.firstName}'s growth`} description="Overall mastery over time" className="lg:col-span-2">
          <AreaTrend data={growth} xKey="month" series={[{ key: "mastery", label: "Mastery %", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="Strand balance"><MasteryRadar data={child.strandMastery.map((s) => ({ strand: s.strand === "Early Mathematical Experiences" ? "Early Maths" : s.strand, mastery: s.mastery }))} /></ChartCard>
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
        <ChartCard title="Learning time this week">
          <BarSeries data={weeklyLearningTime} xKey="day" bars={[{ key: "minutes", label: "Minutes", color: "accent" }]} />
        </ChartCard>
      </div>
    </div>
  );
}
