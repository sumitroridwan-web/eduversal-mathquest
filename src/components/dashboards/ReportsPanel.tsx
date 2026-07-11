"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChartCard } from "./ChartCard";
import { BarSeries, AreaTrend } from "@/components/charts/Charts";
import { topicMastery, completionTrend, classProgress } from "@/data/analytics";
import { useToasts } from "@/stores/ui";
import { Download, FileText } from "lucide-react";

const reportTypes = [
  { title: "Student progress by objective", desc: "Mastery per learning objective and strand.", icon: "🎯" },
  { title: "Class progress by strand", desc: "How each class is progressing across strands.", icon: "📊" },
  { title: "Curriculum coverage", desc: "Which objectives have been taught and assessed.", icon: "🗺️" },
  { title: "Assignment completion", desc: "Completion rates by class and assignment.", icon: "✅" },
  { title: "Students needing support", desc: "Learners below expected progress.", icon: "🤝" },
  { title: "Students ready for extension", desc: "Learners ready for greater challenge.", icon: "🚀" },
];

export function ReportsPanel({ title = "Reports", description }: { title?: string; description?: string }) {
  const notify = useToasts((s) => s.notify);
  const download = (name: string) =>
    notify({ variant: "success", title: "Report generated", description: `${name} exported as PDF (demo).` });

  return (
    <div className="space-y-6">
      <PageHeading
        title={title}
        description={description ?? "Curriculum-aligned reports on progress, coverage and completion."}
        actions={<Button variant="outline" onClick={() => download("Full summary")}><Download className="h-4 w-4" /> Export all</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Class progress" description="Average mastery by class">
          <BarSeries data={classProgress} xKey="name" layout="vertical" bars={[{ key: "progress", label: "Progress", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="Completion over time" description="Assigned vs completed">
          <AreaTrend data={completionTrend} xKey="week" series={[
            { key: "assigned", label: "Assigned", color: "navyLight" },
            { key: "completed", label: "Completed", color: "teal" },
          ]} />
        </ChartCard>
      </div>

      <ChartCard title="Topic mastery" description="Across all reporting groups">
        <BarSeries data={topicMastery} xKey="topic" bars={[{ key: "mastery", label: "Mastery %", color: "accent" }]} />
      </ChartCard>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Generate a report</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((r) => (
            <div key={r.title} className="flex flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <span className="text-3xl" aria-hidden>{r.icon}</span>
              <h3 className="mt-3 font-semibold text-navy-900">{r.title}</h3>
              <p className="mt-1 flex-1 text-sm text-navy-500">{r.desc}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => download(r.title)}><FileText className="h-4 w-4" /> PDF</Button>
                <Button size="sm" variant="ghost" onClick={() => download(r.title + " (CSV)")}>CSV</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
