import { describe, it, expect } from "vitest";
import { resources, games, simulations, books } from "./resources";
import { storybooks, getStorybook } from "./storybooks";
import { MULTIPLAYER_IDS } from "@/components/content/multiplayerEngines";
import { simPreset } from "@/config/simPresets";

describe("resource catalogue integrity", () => {
  it("has unique ids", () => {
    const ids = resources.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("splits cleanly into games, simulations and books", () => {
    expect(games.length + simulations.length + books.length).toBe(resources.length);
    expect(games.every((r) => r.type === "game")).toBe(true);
    expect(simulations.every((r) => r.type === "simulation")).toBe(true);
    expect(books.every((r) => r.type === "book")).toBe(true);
  });

  it("gives every resource a curriculum reference and objective", () => {
    for (const r of resources) {
      expect(r.curriculumRef, `${r.id} curriculumRef`).toBeTruthy();
      expect(r.objective.student, `${r.id} student objective`).toBeTruthy();
    }
  });

  it("only references relatedIds that exist", () => {
    const ids = new Set(resources.map((r) => r.id));
    for (const r of resources) {
      for (const rel of r.relatedIds ?? []) {
        expect(ids.has(rel), `${r.id} → missing related ${rel}`).toBe(true);
      }
    }
  });
});

describe("multiplayer games", () => {
  it("every multiplayer id is a real game resource", () => {
    for (const id of MULTIPLAYER_IDS) {
      const r = resources.find((x) => x.id === id);
      expect(r, `missing multiplayer resource ${id}`).toBeTruthy();
      expect(r!.type).toBe("game");
    }
  });
});

describe("simPreset", () => {
  it("always returns an object (never throws) for any id", () => {
    for (const r of simulations) expect(typeof simPreset(r.id)).toBe("object");
    expect(typeof simPreset("totally-unknown-id")).toBe("object");
  });
});

describe("storybooks", () => {
  it("every storybook has a matching published book resource", () => {
    for (const b of storybooks) {
      const r = resources.find((x) => x.id === b.id);
      expect(r, `storybook ${b.id} has no resource`).toBeTruthy();
      expect(r!.type).toBe("book");
    }
  });

  it("getStorybook resolves by id", () => {
    expect(getStorybook(storybooks[0].id)?.id).toBe(storybooks[0].id);
    expect(getStorybook("nope")).toBeUndefined();
  });

  it("each book is well-formed: pages, cover, characters", () => {
    for (const b of storybooks) {
      expect(b.pages.length, `${b.id} pages`).toBeGreaterThanOrEqual(3);
      expect(b.cover, `${b.id} cover`).toBeTruthy();
      expect(b.characters.length, `${b.id} characters`).toBeGreaterThan(0);
      for (const p of b.pages) expect(p.text.trim().length, `${b.id} page text`).toBeGreaterThan(0);
    }
  });

  it("every quick-check has 3–5 items with a valid answer index", () => {
    for (const b of storybooks) {
      expect(b.check.length, `${b.id} check count`).toBeGreaterThanOrEqual(3);
      expect(b.check.length, `${b.id} check count`).toBeLessThanOrEqual(5);
      for (const item of b.check) {
        expect(item.options.length, `${b.id} option count`).toBeGreaterThanOrEqual(2);
        expect(item.answer, `${b.id} answer lower`).toBeGreaterThanOrEqual(0);
        expect(item.answer, `${b.id} answer upper`).toBeLessThan(item.options.length);
      }
    }
  });

  it("text length grows with grade band (progressive reading load)", () => {
    const avg = (id: string) => {
      const b = getStorybook(id)!;
      return b.pages.reduce((s, p) => s + p.text.split(/\s+/).length, 0) / b.pages.length;
    };
    // nursery is lighter than an upper-primary book
    expect(avg("res-book-big-little-duck")).toBeLessThan(avg("res-book-treasure-coords"));
  });
});
