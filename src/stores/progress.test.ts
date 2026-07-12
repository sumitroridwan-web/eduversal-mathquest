import { describe, it, expect } from "vitest";
import { mergeResult } from "./progress";

const at = "2026-01-01T00:00:00.000Z";

describe("mergeResult", () => {
  it("starts a fresh record on first attempt", () => {
    const r = mergeResult(undefined, { score: 80, stars: 2, completed: true, at });
    expect(r.attempts).toBe(1);
    expect(r.bestScore).toBe(80);
    expect(r.stars).toBe(2);
    expect(r.completed).toBe(true);
  });

  it("keeps the best score and stars across attempts", () => {
    const a = mergeResult(undefined, { score: 60, stars: 1, at });
    const b = mergeResult(a, { score: 90, stars: 3, at });
    const c = mergeResult(b, { score: 50, stars: 2, at });
    expect(c.attempts).toBe(3);
    expect(c.bestScore).toBe(90);
    expect(c.stars).toBe(3);
  });

  it("latches completed to true once achieved", () => {
    const a = mergeResult(undefined, { completed: true, at });
    const b = mergeResult(a, { completed: false, at });
    expect(b.completed).toBe(true);
  });

  it("preserves lastPage across result records", () => {
    const withPage = { ...mergeResult(undefined, { at }), lastPage: 4 };
    const next = mergeResult(withPage, { score: 100, at });
    expect(next.lastPage).toBe(4);
  });
});
