import { describe, it, expect } from "vitest";
import { answersMatch, normalizeAnswer } from "./answers";

describe("answersMatch", () => {
  it("matches exact answers", () => {
    expect(answersMatch("6", "6")).toBe(true);
    expect(answersMatch("mode", "mode")).toBe(true);
  });
  it("ignores case, spacing and articles", () => {
    expect(answersMatch("The Tallest Bar", "tallest bar")).toBe(true);
    expect(answersMatch("  the mode ", "mode")).toBe(true);
  });
  it("treats number words and digits as equal", () => {
    expect(answersMatch("ten", "10")).toBe(true);
    expect(answersMatch("Two", "2")).toBe(true);
  });
  it("treats fraction words and notation as equal", () => {
    expect(answersMatch("one half", "1/2")).toBe(true);
    expect(answersMatch("1/2", "0.5")).toBe(true);
    expect(answersMatch("quarter", "1/4")).toBe(true);
  });
  it("ignores currency symbols and trailing zeros", () => {
    expect(answersMatch("£2.20", "2.2")).toBe(true);
    expect(answersMatch("$5", "5")).toBe(true);
  });
  it("rejects genuinely different answers", () => {
    expect(answersMatch("6", "7")).toBe(false);
    expect(answersMatch("mode", "mean")).toBe(false);
    expect(answersMatch("1/2", "1/3")).toBe(false);
  });
});

describe("normalizeAnswer", () => {
  it("strips articles, currency and punctuation", () => {
    expect(normalizeAnswer("The £2.")).toBe("2");
  });
});
