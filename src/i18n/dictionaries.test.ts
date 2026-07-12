import { describe, it, expect } from "vitest";
import { dictionaries, LOCALES } from "./dictionaries";

describe("i18n dictionaries", () => {
  it("every locale defines exactly the same keys as English", () => {
    const enKeys = Object.keys(dictionaries.en).sort();
    for (const { code } of LOCALES) {
      expect(Object.keys(dictionaries[code]).sort(), `${code} keys`).toEqual(enKeys);
    }
  });
  it("has no empty translations", () => {
    for (const { code } of LOCALES) {
      for (const [k, v] of Object.entries(dictionaries[code])) {
        expect(v.trim().length, `${code}.${k}`).toBeGreaterThan(0);
      }
    }
  });
  it("actually translates (id differs from en for nav)", () => {
    expect(dictionaries.id["nav.explore"]).toBe("Jelajahi");
    expect(dictionaries.id["nav.explore"]).not.toBe(dictionaries.en["nav.explore"]);
  });
});
