// ==========================================================
// Per-simulation presets.
// Each simulation drives its shared engine into a distinct mode /
// configuration / framing so no two simulations behave the same —
// they map to different topics and objectives.
// ==========================================================

export interface SimPreset {
  intro?: string;
  // ten frame
  tfMode?: "count" | "bond" | "combine";
  tfTarget?: number;
  // number line
  nlMode?: "explore" | "onemore" | "steps" | "order";
  nlRange?: string;
  nlStep?: number;
  // fraction
  frMode?: "compare" | "halves" | "equivalent" | "percent";
  frModel?: "bars" | "circles";
  // bar chart
  bcMode?: "bar" | "pictogram" | "stats";
  bcCats?: number;
  // array
  arDoubles?: boolean;
  // place value
  pvPlaces?: "to" | "hto" | "thhto" | "decimal";
  // coordinate
  coQuad?: 1 | 4;
  coGrid?: number;
  // clock
  clPrecision?: number;
  // symmetry
  syAxis?: "vertical" | "horizontal";
  // spinner
  spSectors?: number;
  // shape sort
  ssRule?: "sides" | "count";
  // pattern
  ptUnit?: string;
  ptMode?: string;
  // order of operations
  ooLevel?: "easy" | "medium" | "hard";
  // compare
  cmMaxN?: number;
  // ratio
  raParts?: number;
  raScale?: number;
  // hundred square
  hsMax?: number;
  hsStep?: number;
}

const SIM_PRESETS: Record<string, SimPreset> = {
  // ---- ten frame ----
  "res-tenframe": { tfMode: "bond", tfTarget: 10, intro: "Fill the frame and work out how many more make ten." },
  "res-sim-s1-tenframe": { tfMode: "count", tfTarget: 10, intro: "Tap counters onto the frame and say how many there are." },
  "res-sim-ey1-count5": { tfMode: "count", tfTarget: 5, intro: "Count the friends one by one, up to five." },
  "res-sim-ey2-combine": { tfMode: "combine", intro: "Put the two groups together and count them all." },
  "res-sim-ey3-pairs10": { tfMode: "bond", tfTarget: 10, intro: "Find two numbers that make ten." },

  // ---- number line ----
  "res-numberline": { nlMode: "explore", nlRange: "0-20", nlStep: 2 },
  "res-sim-s1-numbertrack": { nlMode: "explore", nlRange: "0-20", nlStep: 1, intro: "Jump forwards and backwards along the track to 20." },
  "res-sim-s3-number-line-steps": { nlMode: "steps", nlRange: "0-100", nlStep: 5, intro: "Count on in equal steps — what do you notice about where you land?" },
  "res-sim-s4-negative-line": { nlMode: "explore", nlRange: "-10-10", nlStep: 1, intro: "Count through zero into the negative numbers." },
  "res-sim-ey2-track10": { nlMode: "order", intro: "Tap the numbers in order to build the track to ten." },
  "res-sim-ey2-onemore": { nlMode: "onemore", nlRange: "0-10", intro: "Find one more and one fewer than the marked number." },
  "res-sim-ey3-count20": { nlMode: "steps", nlRange: "0-20", nlStep: 2, intro: "Count on in twos and spot the odd and even numbers." },

  // ---- fraction ----
  "res-fraction-bars": { frMode: "compare", frModel: "bars" },
  "res-equivalent-fractions": { frMode: "equivalent", frModel: "bars", intro: "Make two fractions that are worth the same." },
  "res-sim-s1-halves": { frMode: "halves", frModel: "circles", intro: "Shade one half of the shape." },
  "res-sim-s2-fraction-wall": { frMode: "compare", frModel: "bars", intro: "Compare halves and quarters on the fraction wall." },
  "res-sim-s4-percent-grid": { frMode: "percent", intro: "Shade the hundred grid to show a percentage." },
  "res-sim-s5-fdp-match": { frMode: "compare", frModel: "bars", intro: "Compare fractions, decimals and percentages." },
  "res-sim-s6-fractions-diff-denom": { frMode: "compare", frModel: "bars", intro: "Compare fractions with different denominators." },
  "res-sim-ey2-halves": { frMode: "halves", frModel: "circles", intro: "Share the shape fairly into two halves." },
  "res-sim-ey3-half": { frMode: "halves", frModel: "circles", intro: "Find one half of the whole." },

  // ---- bar chart ----
  "res-chart-builder": { bcMode: "bar" },
  "res-sim-s3-bar-chart": { bcMode: "pictogram", bcCats: 4, intro: "Build a pictogram — one symbol for each item." },
  "res-sim-s5-mode-median": { bcMode: "stats", intro: "Change the data and watch the mode and median." },
  "res-sim-s6-averages": { bcMode: "stats", intro: "Explore how the mean, median, mode and range change." },
  "res-sim-ey2-data": { bcMode: "pictogram", bcCats: 3, intro: "Build an object graph of favourites." },
  "res-sim-ey3-blockgraph": { bcMode: "bar", bcCats: 4, intro: "Build a block graph and read which has the most." },

  // ---- array ----
  "res-sim-s2-arrays": { intro: "Build an array of equal rows to see multiplication." },
  "res-sim-s3-times-array": { intro: "Split the array to make times-table facts easier." },
  "res-sim-s4-factors-multiples": { intro: "Arrange counters into arrays to find factors." },
  "res-sim-ey2-doubles": { arDoubles: true, intro: "Make a double with two equal groups." },

  // ---- place value ----
  "res-place-value-blocks": { pvPlaces: "hto" },
  "res-sim-s2-tens-ones": { pvPlaces: "to", intro: "Build two-digit numbers from tens and ones." },
  "res-sim-s3-place-value-1000": { pvPlaces: "hto", intro: "Build three-digit numbers with hundreds, tens and ones." },
  "res-sim-s4-place-value-100000": { pvPlaces: "thhto", intro: "Build large numbers and see the value of each digit." },
  "res-sim-s5-decimal-pv": { pvPlaces: "decimal", intro: "Build decimals with tenths and hundredths." },

  // ---- coordinate ----
  "res-coordinate-grid": { coQuad: 1, coGrid: 6 },
  "res-sim-s4-coordinates-q1": { coQuad: 1, coGrid: 6, intro: "Plot points in the first quadrant." },
  "res-sim-s5-coordinate-shapes": { coQuad: 1, coGrid: 6, intro: "Plot points to make a shape." },
  "res-sim-s6-four-quadrant": { coQuad: 4, coGrid: 5, intro: "Plot points in all four quadrants." },

  // ---- clock ----
  "res-interactive-clock": { clPrecision: 15, intro: "Show and read times to the quarter hour." },
  "res-sim-s1-clock": { clPrecision: 30, intro: "Show o'clock and half past times." },
  "res-sim-ey3-clock": { clPrecision: 30, intro: "Read o'clock times and link them to your day." },

  // ---- symmetry ----
  "res-shape-builder": { syAxis: "vertical", intro: "Complete the shape across its line of symmetry." },
  "res-sim-s2-symmetry": { syAxis: "vertical", intro: "Complete the pattern across the vertical mirror line." },
  "res-sim-ey2-mirror": { syAxis: "horizontal", intro: "Make both sides of the picture match." },

  // ---- spinner ----
  "res-probability-spinner": { spSectors: 4 },

  // ---- shape sort ----
  "res-sim-s1-shape-sort": { ssRule: "sides" },
  "res-sim-ey1-sort": { ssRule: "sides", intro: "Put the things that go together in the same group." },
  "res-sim-ey1-shapes": { ssRule: "sides", intro: "Find shapes that match and sort them." },
  "res-sim-ey3-sort": { ssRule: "count", intro: "Sort the shapes by their number of sides." },

  // ---- pattern ----
  "res-pattern-machine": { ptUnit: "ABC", ptMode: "colours", intro: "Build and extend a repeating pattern." },
  "res-sim-ey1-pattern": { ptUnit: "AB", ptMode: "colours", intro: "Carry on the colour pattern." },
  "res-sim-ey2-patterns": { ptUnit: "ABC", ptMode: "shapes", intro: "Copy and continue the repeating pattern." },

  // ---- order of operations ----
  "res-sim-s6-order-operations": { ooLevel: "easy" },

  // ---- compare ----
  "res-sim-ey1-compare": { cmMaxN: 5, intro: "Line up two groups and say which has more." },

  // ---- ratio ----
  "res-sim-s6-ratio-proportion": { raParts: 6, raScale: 4 },

  // ---- hundred square ----
  "res-sim-s2-hundred-square": { hsStep: 5, hsMax: 100, intro: "Colour the counting patterns and find odd and even." },
};

export function simPreset(id: string): SimPreset {
  return SIM_PRESETS[id] ?? {};
}
