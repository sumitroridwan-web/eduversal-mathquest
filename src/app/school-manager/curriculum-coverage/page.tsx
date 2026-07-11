"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { CoverageMatrix } from "@/components/dashboards/CoverageMatrix";
import { BarSeries } from "@/components/charts/Charts";
import { ProgressBar } from "@/components/ui/Progress";
import { strandCoverage } from "@/data/analytics";
import { useToasts } from "@/stores/ui";
import { Download } from "lucide-react";

export default function CurriculumCoverage() {
  const notify = useToasts((s) => s.notify);
  return (
    <div className="space-y-6">
      <PageHeading
        title="Curriculum coverage"
        description="Coverage by stage and strand across your school's Mathematics programme."
        actions={<Button variant="outline" onClick={() => notify({ variant: "success", title: "Coverage report exported (demo)" })}><Download className="h-4 w-4" /> Export</Button>}
      />
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Resources mapped by stage &amp; strand</h2>
        <CoverageMatrix />
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Coverage by strand" description="Percentage of objectives with mapped content">
          <BarSeries data={strandCoverage} xKey="strand" layout="vertical" bars={[{ key: "coverage", label: "Coverage", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="Coverage detail">
          <div className="space-y-4 pt-2">
            {strandCoverage.map((s) => (
              <div key={s.strand}>
                <div className="mb-1 flex justify-between text-sm"><span className="text-navy-700">{s.strand}</span><span className="font-semibold text-navy-900">{s.coverage}%</span></div>
                <ProgressBar value={s.coverage} tone={s.coverage > 70 ? "teal" : "accent"} />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
