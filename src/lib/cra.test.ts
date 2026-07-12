import { describe, it, expect } from "vitest";
import { craFor, gradeRank } from "./cra";
import type { Resource } from "@/types";

// minimal resource factory for the fields cra.ts actually reads
function res(partial: Partial<Resource>): Resource {
  return {
    id: "x", title: "x", type: "simulation", status: "published", cover: "count",
    programme: "primary", strand: "Number", subStrand: "s", topic: "t",
    objective: { teacher: "", student: "", parent: "" }, curriculumRef: "x",
    vocabulary: [], learningPurpose: "Introduction", difficulty: "Core", durationMins: 5,
    ...partial,
  } as Resource;
}

describe("craFor", () => {
  it("treats all Early Years as concrete", () => {
    expect(craFor(res({ programme: "early-years", band: "Nursery / Pre-K" }))).toBe("concrete");
    expect(craFor(res({ programme: "early-years", band: "Kindergarten 2" }))).toBe("concrete");
  });
  it("grades primary stages concrete → pictorial → abstract", () => {
    expect(craFor(res({ stage: "Stage 1" }))).toBe("concrete");
    expect(craFor(res({ stage: "Stage 2" }))).toBe("concrete");
    expect(craFor(res({ stage: "Stage 3" }))).toBe("pictorial");
    expect(craFor(res({ stage: "Stage 4" }))).toBe("pictorial");
    expect(craFor(res({ stage: "Stage 5" }))).toBe("abstract");
    expect(craFor(res({ stage: "Stage 6" }))).toBe("abstract");
  });
});

describe("gradeRank", () => {
  it("orders Early Years before Primary", () => {
    const nursery = gradeRank(res({ programme: "early-years", band: "Nursery / Pre-K" }));
    const kg1 = gradeRank(res({ programme: "early-years", band: "Kindergarten 1" }));
    const kg2 = gradeRank(res({ programme: "early-years", band: "Kindergarten 2" }));
    const s1 = gradeRank(res({ stage: "Stage 1" }));
    const s6 = gradeRank(res({ stage: "Stage 6" }));
    expect(nursery).toBe(0);
    expect(nursery).toBeLessThan(kg1);
    expect(kg1).toBeLessThan(kg2);
    expect(kg2).toBeLessThan(s1);
    expect(s1).toBeLessThan(s6);
  });
  it("increases monotonically with stage number", () => {
    const ranks = [1, 2, 3, 4, 5, 6].map((n) => gradeRank(res({ stage: `Stage ${n}` as Resource["stage"] })));
    for (let i = 1; i < ranks.length; i++) expect(ranks[i]).toBeGreaterThan(ranks[i - 1]);
  });
});
