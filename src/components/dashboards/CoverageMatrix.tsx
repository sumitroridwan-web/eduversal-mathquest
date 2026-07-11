import { resources } from "@/data/resources";
import { cn } from "@/lib/utils";
import type { Strand } from "@/types";

const stages = ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5", "Stage 6"];
const strands: Strand[] = ["Number", "Geometry and Measure", "Statistics and Probability", "Algebra"];

function count(stage: string, strand: Strand) {
  return resources.filter((r) => r.stage === stage && r.strand === strand).length;
}

function cellTone(n: number) {
  if (n === 0) return "bg-surface-muted text-navy-300";
  if (n === 1) return "bg-teal-100 text-teal-800";
  if (n === 2) return "bg-teal-300 text-teal-900";
  return "bg-teal-500 text-white";
}

export function CoverageMatrix() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-xs font-semibold uppercase text-navy-400">Strand \ Stage</th>
            {stages.map((s) => (
              <th key={s} className="p-2 text-center text-xs font-semibold text-navy-500">{s.replace("Stage ", "S")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {strands.map((strand) => (
            <tr key={strand}>
              <td className="p-2 text-sm font-medium text-navy-700">{strand === "Geometry and Measure" ? "Geometry & Measure" : strand === "Statistics and Probability" ? "Statistics & Prob." : strand}</td>
              {stages.map((stage) => {
                const n = count(stage, strand);
                return (
                  <td key={stage} className="p-1.5">
                    <div className={cn("flex h-11 items-center justify-center rounded-lg text-sm font-bold", cellTone(n))} title={`${n} resource${n === 1 ? "" : "s"}`}>
                      {n}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-center gap-3 text-xs text-navy-400">
        <span>Fewer</span>
        <span className="h-3 w-3 rounded bg-surface-muted" />
        <span className="h-3 w-3 rounded bg-teal-100" />
        <span className="h-3 w-3 rounded bg-teal-300" />
        <span className="h-3 w-3 rounded bg-teal-500" />
        <span>More resources</span>
      </div>
    </div>
  );
}
