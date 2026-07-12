// ==========================================================
// Forgiving answer matching for free-text checkpoints, so a
// child isn't marked wrong for formatting: "1/2" == "one half",
// "£2.20" == "2.2", "the tallest bar" == "tallest bar", etc.
// ==========================================================

const NUM_WORDS: Record<string, string> = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6",
  seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
  thirteen: "13", fourteen: "14", fifteen: "15", twenty: "20", thirty: "30", hundred: "100",
};
const FRACTION_WORDS: Record<string, string> = {
  half: "1/2", "one half": "1/2", quarter: "1/4", "one quarter": "1/4",
  third: "1/3", "one third": "1/3", "two quarters": "1/2", "three quarters": "3/4",
};

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[£$€]/g, "")
    .replace(/[.,](?=\s|$)/g, "") // trailing punctuation
    .replace(/\b(a|an|the)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function asNumber(s: string): number | null {
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  return null;
}

/** Canonicalise number/fraction words and currency to a comparable form. */
function canon(s: string): string {
  let x = normalizeAnswer(s);
  if (FRACTION_WORDS[x]) return FRACTION_WORDS[x];
  x = x.split(" ").map((w) => NUM_WORDS[w] ?? w).join(" ");
  return x;
}

export function answersMatch(given: string, expected: string): boolean {
  const g = canon(given);
  const e = canon(expected);
  if (g === e) return true;
  const ng = asNumber(g);
  const ne = asNumber(e);
  if (ng != null && ne != null) return Math.abs(ng - ne) < 1e-9;
  return false;
}
