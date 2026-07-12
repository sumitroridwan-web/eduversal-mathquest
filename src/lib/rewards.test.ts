import { describe, it, expect } from "vitest";
import { computeXp, levelForXp, computeStreak, earnedBadges } from "./rewards";
import type { ProgressByResource } from "@/stores/progress";
import type { Resource } from "@/types";

const p = (o: Partial<ProgressByResource[string]>): ProgressByResource[string] => ({ attempts: 1, bestScore: 0, stars: 0, completed: false, updatedAt: "", ...o });

describe("computeXp", () => {
  it("rewards completion, stars and attempts", () => {
    expect(computeXp({ a: p({ completed: true, stars: 3, attempts: 2 }) })).toBe(30 + 30 + 6);
    expect(computeXp({})).toBe(0);
  });
  it("caps attempt bonus", () => {
    expect(computeXp({ a: p({ attempts: 99 }) })).toBe(9);
  });
});

describe("levelForXp", () => {
  it("starts at level 1 and climbs every 100 XP", () => {
    expect(levelForXp(0).level).toBe(1);
    expect(levelForXp(250).level).toBe(3);
    expect(levelForXp(250).xpInto).toBe(50);
  });
});

describe("computeStreak", () => {
  it("counts consecutive days ending today", () => {
    expect(computeStreak(["2026-07-10", "2026-07-11", "2026-07-12"], "2026-07-12")).toBe(3);
  });
  it("stays alive if yesterday was the last active day", () => {
    expect(computeStreak(["2026-07-10", "2026-07-11"], "2026-07-12")).toBe(2);
  });
  it("breaks after a gap", () => {
    expect(computeStreak(["2026-07-01"], "2026-07-12")).toBe(0);
    expect(computeStreak([], "2026-07-12")).toBe(0);
  });
});

describe("earnedBadges", () => {
  const res: Resource[] = [
    { id: "g1", type: "game" } as Resource,
    { id: "b1", type: "book" } as Resource,
    { id: "s1", type: "simulation" } as Resource,
  ];
  it("awards first-step and streak badges appropriately", () => {
    const badges = earnedBadges({ g1: p({ completed: true }) }, res, 3);
    expect(badges.find((b) => b.id === "first-step")!.earned).toBe(true);
    expect(badges.find((b) => b.id === "streak-3")!.earned).toBe(true);
    expect(badges.find((b) => b.id === "streak-7")!.earned).toBe(false);
  });
  it("awards all-rounder only when all three types are engaged", () => {
    const none = earnedBadges({ g1: p({ completed: true }) }, res, 0);
    expect(none.find((b) => b.id === "all-rounder")!.earned).toBe(false);
    const all = earnedBadges({ g1: p({ completed: true }), b1: p({ completed: true }), s1: p({ attempts: 1 }) }, res, 0);
    expect(all.find((b) => b.id === "all-rounder")!.earned).toBe(true);
  });
});
