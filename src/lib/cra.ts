import type { Resource } from "@/types";

// Concrete → Pictorial → Abstract. Early Years and lower Primary use
// concrete representations; middle grades pictorial; upper grades abstract.
export type CRA = "concrete" | "pictorial" | "abstract";

function stageNumber(r: Resource): number {
  if (!r.stage) return 0;
  const n = parseInt(r.stage.replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

export function craFor(r: Resource): CRA {
  if (r.programme === "early-years") return "concrete";
  const s = stageNumber(r);
  if (s <= 2) return "concrete";
  if (s <= 4) return "pictorial";
  return "abstract";
}

/** Ordering rank for grade progression: Early Years first, then Stages 1–6. */
export function gradeRank(r: Resource): number {
  if (r.programme === "early-years") {
    const b = r.band ?? "";
    if (b.includes("Nursery")) return 0;
    if (b.includes("Kindergarten 1")) return 1;
    if (b.includes("Kindergarten 2")) return 2;
    return 1;
  }
  return 2 + (stageNumber(r) || 1); // Stage 1 → 3 … Stage 6 → 8
}
