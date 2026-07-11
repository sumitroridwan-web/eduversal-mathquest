import type { Resource, ContentType, Difficulty } from "@/types";
import { curriculumConfig } from "@/config/brand";

export const typeLabel: Record<ContentType, string> = {
  game: "Game",
  simulation: "Simulation",
  book: "Book",
};

export const typeIcon: Record<ContentType, string> = {
  game: "Gamepad2",
  simulation: "FlaskConical",
  book: "BookOpen",
};

export function programmeLabel(r: Pick<Resource, "programme">): string {
  return r.programme === "early-years"
    ? curriculumConfig.earlyYearsName
    : curriculumConfig.primaryName;
}

/** Stage (Primary) or age band (Early Years). */
export function stageLabel(r: Pick<Resource, "programme" | "stage" | "band">): string {
  return r.programme === "early-years" ? r.band ?? "Early Years" : r.stage ?? "Primary";
}

export const difficultyTone: Record<Difficulty, "green" | "amber" | "red"> = {
  Foundation: "green",
  Core: "amber",
  Challenge: "red",
};

/** All distinct values for filter dropdowns. */
export function distinct<T, K extends keyof T>(items: T[], key: K): Array<NonNullable<T[K]>> {
  const set = new Set<NonNullable<T[K]>>();
  for (const item of items) {
    const v = item[key];
    if (v != null) set.add(v as NonNullable<T[K]>);
  }
  return Array.from(set);
}
