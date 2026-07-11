import { cn } from "@/lib/utils";
import type { ContentType } from "@/types";

// ==========================================================
// ResourceCover — flat, child-friendly SVG illustrations.
// Each cover pairs a gradient background with a distinct maths
// motif (ten frame, fraction pizza, number line, clock, …) plus
// subtle floating decoration for a professional, layered look.
// Pure SVG + Tailwind → server-safe, no external assets.
// ==========================================================

type Motif =
  | "counters" | "numbercards" | "shapes" | "pattern" | "compare" | "magnifier"
  | "addition" | "subtraction" | "baseten" | "array" | "fraction" | "fractionbars"
  | "coins" | "barchart" | "compass" | "tenframe" | "numberline" | "clock"
  | "symmetry" | "coordinate" | "spinner" | "book";

const covers: Record<string, { from: string; to: string; motif: Motif }> = {
  counters: { from: "from-teal-400", to: "to-teal-600", motif: "counters" },
  cards: { from: "from-navy-400", to: "to-navy-700", motif: "numbercards" },
  shapes: { from: "from-accent-300", to: "to-accent-500", motif: "shapes" },
  pattern: { from: "from-purple-400", to: "to-purple-600", motif: "pattern" },
  compare: { from: "from-teal-400", to: "to-navy-600", motif: "compare" },
  hunt: { from: "from-navy-500", to: "to-teal-600", motif: "magnifier" },
  addition: { from: "from-teal-500", to: "to-emerald-600", motif: "addition" },
  subtraction: { from: "from-amber-400", to: "to-accent-600", motif: "subtraction" },
  placevalue: { from: "from-navy-500", to: "to-navy-800", motif: "baseten" },
  multiply: { from: "from-accent-400", to: "to-amber-600", motif: "array" },
  fraction: { from: "from-rose-400", to: "to-accent-500", motif: "fraction" },
  money: { from: "from-emerald-400", to: "to-teal-600", motif: "coins" },
  graph: { from: "from-teal-500", to: "to-navy-700", motif: "barchart" },
  mission: { from: "from-navy-600", to: "to-purple-700", motif: "compass" },
  tenframe: { from: "from-teal-400", to: "to-teal-700", motif: "tenframe" },
  numberline: { from: "from-navy-400", to: "to-teal-600", motif: "numberline" },
  blocks: { from: "from-accent-400", to: "to-navy-600", motif: "baseten" },
  fractionbar: { from: "from-rose-400", to: "to-purple-600", motif: "fractionbars" },
  equivalent: { from: "from-purple-400", to: "to-navy-600", motif: "fractionbars" },
  clock: { from: "from-navy-400", to: "to-navy-700", motif: "clock" },
  symmetry: { from: "from-teal-400", to: "to-purple-600", motif: "symmetry" },
  shopping: { from: "from-emerald-400", to: "to-navy-600", motif: "coins" },
  coordinate: { from: "from-navy-500", to: "to-teal-700", motif: "coordinate" },
  chartbuilder: { from: "from-accent-400", to: "to-teal-600", motif: "barchart" },
  spinner: { from: "from-purple-400", to: "to-accent-500", motif: "spinner" },
  patternmachine: { from: "from-purple-500", to: "to-navy-700", motif: "pattern" },
  "book-garden": { from: "from-emerald-400", to: "to-teal-600", motif: "book" },
  "book-city": { from: "from-navy-400", to: "to-navy-700", motif: "book" },
  "book-feast": { from: "from-rose-400", to: "to-accent-500", motif: "book" },
  "book-data": { from: "from-teal-500", to: "to-navy-700", motif: "book" },
};

const typeMotif: Record<ContentType, Motif> = {
  game: "counters",
  simulation: "tenframe",
  book: "book",
};

const W = "#ffffff";
const ACC = "#ffc94d";
const ACC_D = "#f59e0b";
const TEAL = "#5eead4";
const TEAL_D = "#14b8a6";
const NAVY = "#1b2540";
const ROSE = "#fda4af";

const numberFont = "var(--font-display), Poppins, system-ui, sans-serif";

/** Small deterministic hue shift so two resources sharing a motif still
 *  render visibly different previews. Whites/greys are unaffected. */
function hueShift(seed?: string): number | undefined {
  if (!seed) return undefined;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return (Math.abs(h) % 5 - 2) * 12; // -24 … 24 degrees
}

export function ResourceCover({
  cover,
  type,
  className,
  size = "md",
  seed,
}: {
  cover: string;
  type: ContentType;
  className?: string;
  /** kept for API compatibility; artwork scales to the container */
  size?: "sm" | "md" | "lg";
  /** resource id — gives each card a distinct hue while keeping the motif */
  seed?: string;
}) {
  void size;
  const c = covers[cover] ?? { from: "from-navy-500", to: "to-teal-600", motif: typeMotif[type] };
  const deg = hueShift(seed);
  return (
    <div
      className={cn("relative overflow-hidden bg-gradient-to-br", c.from, c.to, className)}
      style={deg ? { filter: `hue-rotate(${deg}deg)` } : undefined}
    >
      <svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* soft light + grid */}
        <circle cx="52" cy="-10" r="90" fill="#ffffff" opacity="0.08" />
        <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1">
          <path d="M40 0V180M120 0V180M200 0V180M280 0V180M0 45H320M0 90H320M0 135H320" />
        </g>
        <Decor />
        <Motif motif={c.motif} />
      </svg>
    </div>
  );
}

/* -------- floating decorative maths bits -------- */
function Decor() {
  return (
    <g>
      <circle cx="34" cy="30" r="9" fill={W} opacity="0.16" />
      <circle cx="290" cy="40" r="13" fill={W} opacity="0.12" />
      <circle cx="300" cy="150" r="7" fill={ACC} opacity="0.55" />
      <rect x="20" y="132" width="16" height="16" rx="4" fill={W} opacity="0.12" transform="rotate(18 28 140)" />
      <path d="M52 158 l7 -13 l7 13 z" fill={W} opacity="0.13" />
      <circle cx="150" cy="18" r="3.5" fill={W} opacity="0.35" />
      <circle cx="206" cy="164" r="3" fill={W} opacity="0.3" />
      <text x="266" y="118" fontSize="22" fontWeight="800" fill={W} opacity="0.14" fontFamily={numberFont}>+</text>
      <text x="30" y="96" fontSize="16" fontWeight="800" fill={W} opacity="0.12" fontFamily={numberFont}>÷</text>
    </g>
  );
}

/* -------- number tile helper -------- */
function Tile({ x, y, label, fill = W, text = NAVY, size = 42 }: { x: number; y: number; label: string; fill?: string; text?: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={10} fill={fill} />
      <text x={x + size / 2} y={y + size / 2 + 1} fontSize={size * 0.55} fontWeight="800" fill={text} textAnchor="middle" dominantBaseline="central" fontFamily={numberFont}>
        {label}
      </text>
    </g>
  );
}

function Motif({ motif }: { motif: Motif }) {
  switch (motif) {
    case "tenframe":
    case "counters": {
      const filled = motif === "counters" ? [1, 1, 1, 0, 0, 1, 1, 0, 0, 0] : [1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
      const cw = 24, gap = 5, cols = 5, startX = 160 - (cols * cw + (cols - 1) * gap) / 2, startY = 66;
      return (
        <g>
          {filled.map((f, i) => {
            const col = i % cols, row = Math.floor(i / cols);
            const x = startX + col * (cw + gap), y = startY + row * (cw + gap);
            return (
              <g key={i}>
                <rect x={x} y={y} width={cw} height={cw} rx={5} fill={W} opacity={f ? 1 : 0.22} stroke={W} strokeOpacity="0.5" />
                {f ? <circle cx={x + cw / 2} cy={y + cw / 2} r={7.5} fill={TEAL_D} /> : null}
              </g>
            );
          })}
        </g>
      );
    }
    case "addition":
    case "subtraction": {
      const op = motif === "addition" ? "+" : "−";
      const a = motif === "addition" ? "3" : "7";
      const b = motif === "addition" ? "4" : "2";
      return (
        <g>
          <Tile x={100} y={68} label={a} />
          <text x={160} y={91} fontSize="30" fontWeight="800" fill={ACC} textAnchor="middle" dominantBaseline="central" fontFamily={numberFont}>{op}</text>
          <Tile x={178} y={68} label={b} />
        </g>
      );
    }
    case "numbercards": {
      return (
        <g>
          <g transform="rotate(-8 118 92)"><Tile x={98} y={70} label="1" size={44} /></g>
          <Tile x={148} y={66} label="2" size={48} fill={ACC} text={NAVY} />
          <g transform="rotate(8 208 92)"><Tile x={190} y={70} label="3" size={44} /></g>
        </g>
      );
    }
    case "fraction": {
      // pizza — quarters, three filled
      const cx = 160, cy = 92, r = 46;
      const slice = (a0: number, a1: number, fill: string) => {
        const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
        const [x0, y0] = p(a0), [x1, y1] = p(a1);
        return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`;
      };
      const q = Math.PI / 2;
      return (
        <g>
          <circle cx={cx} cy={cy} r={r + 4} fill={W} opacity="0.25" />
          <path d={slice(-q, 0, ACC)} fill={ACC} stroke={W} strokeWidth="2" />
          <path d={slice(0, q, ACC_D)} fill={ACC_D} stroke={W} strokeWidth="2" />
          <path d={slice(q, Math.PI, ACC)} fill={ACC} stroke={W} strokeWidth="2" />
          <path d={slice(Math.PI, -q + 2 * Math.PI, W)} fill={W} opacity="0.85" stroke={W} strokeWidth="2" />
          <circle cx={cx - 16} cy={cy - 14} r={4} fill={ROSE} />
          <circle cx={cx + 14} cy={cy + 16} r={4} fill={ROSE} />
        </g>
      );
    }
    case "fractionbars": {
      const bar = (y: number, parts: number, filled: number) => {
        const bw = 150, x0 = 160 - bw / 2, pw = bw / parts;
        return (
          <g key={y}>
            {Array.from({ length: parts }).map((_, i) => (
              <rect key={i} x={x0 + i * pw} y={y} width={pw - 2} height={26} rx={4} fill={i < filled ? ACC : W} opacity={i < filled ? 1 : 0.25} stroke={W} strokeOpacity="0.6" />
            ))}
          </g>
        );
      };
      return <g>{bar(60, 2, 1)}{bar(96, 4, 2)}</g>;
    }
    case "shapes": {
      return (
        <g>
          <circle cx="120" cy="92" r="24" fill={TEAL} stroke={W} strokeWidth="2.5" />
          <path d="M162 116 l24 -44 l24 44 z" fill={ACC} stroke={W} strokeWidth="2.5" />
          <rect x="196" y="70" width="42" height="42" rx="6" fill={W} opacity="0.9" stroke={W} strokeWidth="2.5" />
          <path d="M150 52 l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1 z" fill={ACC_D} />
        </g>
      );
    }
    case "pattern": {
      const items = [ACC, TEAL, ACC, TEAL, ACC];
      return (
        <g>
          {items.map((col, i) => {
            const x = 88 + i * 36;
            return i % 2 === 0
              ? <circle key={i} cx={x} cy="92" r="15" fill={col} stroke={W} strokeWidth="2" />
              : <rect key={i} x={x - 14} y="78" width="28" height="28" rx="5" fill={col} stroke={W} strokeWidth="2" />;
          })}
        </g>
      );
    }
    case "compare": {
      const stack = (x: number, n: number) =>
        Array.from({ length: n }).map((_, i) => (
          <rect key={i} x={x} y={120 - i * 20} width="34" height="16" rx="3" fill={i % 2 ? TEAL : W} opacity={i % 2 ? 1 : 0.9} stroke={W} strokeWidth="1.5" />
        ));
      return (
        <g>
          {stack(96, 4)}
          <text x="160" y="98" fontSize="34" fontWeight="800" fill={ACC} textAnchor="middle" dominantBaseline="central" fontFamily={numberFont}>&gt;</text>
          {stack(190, 2)}
        </g>
      );
    }
    case "magnifier": {
      return (
        <g>
          <text x="112" y="80" fontSize="26" fontWeight="800" fill={W} opacity="0.35" fontFamily={numberFont}>5</text>
          <text x="196" y="76" fontSize="22" fontWeight="800" fill={W} opacity="0.3" fontFamily={numberFont}>12</text>
          <text x="120" y="128" fontSize="22" fontWeight="800" fill={W} opacity="0.3" fontFamily={numberFont}>8</text>
          <circle cx="168" cy="94" r="30" fill={W} opacity="0.16" stroke={W} strokeWidth="6" />
          <text x="168" y="96" fontSize="26" fontWeight="800" fill={W} textAnchor="middle" dominantBaseline="central" fontFamily={numberFont}>7</text>
          <rect x="188" y="118" width="30" height="9" rx="4.5" fill={ACC} transform="rotate(45 188 118)" />
        </g>
      );
    }
    case "baseten": {
      return (
        <g>
          {/* hundred square */}
          <g stroke={W} strokeWidth="1.5" strokeOpacity="0.85">
            <rect x="86" y="62" width="52" height="52" rx="4" fill={W} opacity="0.85" />
            {[1, 2, 3, 4].map((i) => <path key={`h${i}`} d={`M${86 + i * 10.4} 62V114`} />)}
            {[1, 2, 3, 4].map((i) => <path key={`v${i}`} d={`M86 ${62 + i * 10.4}H138`} />)}
          </g>
          {/* tens rod */}
          <g stroke={W} strokeWidth="1.5" strokeOpacity="0.85">
            <rect x="152" y="62" width="12" height="52" rx="3" fill={TEAL} />
            {[1, 2, 3, 4].map((i) => <path key={i} d={`M152 ${62 + i * 10.4}H164`} />)}
          </g>
          {/* units */}
          <rect x="176" y="62" width="12" height="12" rx="3" fill={ACC} stroke={W} strokeWidth="1.5" />
          <rect x="176" y="80" width="12" height="12" rx="3" fill={ACC} stroke={W} strokeWidth="1.5" />
          <rect x="176" y="98" width="12" height="12" rx="3" fill={ACC} stroke={W} strokeWidth="1.5" />
        </g>
      );
    }
    case "array": {
      return (
        <g>
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle key={`${r}-${col}`} cx={126 + col * 26} cy={66 + r * 26} r="9" fill={r % 2 === col % 2 ? ACC : W} />
            )),
          )}
          <text x="104" y="94" fontSize="20" fontWeight="800" fill={W} textAnchor="middle" dominantBaseline="central" fontFamily={numberFont}>×</text>
        </g>
      );
    }
    case "coins": {
      const coin = (cx: number, cy: number, label: string) => (
        <g>
          <circle cx={cx} cy={cy} r="22" fill={ACC} stroke={ACC_D} strokeWidth="3" />
          <circle cx={cx} cy={cy} r="15" fill="none" stroke={ACC_D} strokeOpacity="0.5" strokeWidth="1.5" />
          <text x={cx} y={cy + 1} fontSize="15" fontWeight="800" fill={NAVY} textAnchor="middle" dominantBaseline="central" fontFamily={numberFont}>{label}</text>
        </g>
      );
      return <g>{coin(128, 104, "5")}{coin(160, 84, "10")}{coin(196, 106, "2")}</g>;
    }
    case "barchart": {
      const bars = [42, 66, 30, 54];
      return (
        <g>
          <path d="M96 124H228M96 56V124" stroke={W} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          {bars.map((h, i) => (
            <rect key={i} x={106 + i * 30} y={124 - h} width="20" height={h} rx="4" fill={i % 2 ? ACC : TEAL} />
          ))}
        </g>
      );
    }
    case "compass": {
      return (
        <g>
          <circle cx="160" cy="92" r="40" fill={W} opacity="0.16" stroke={W} strokeWidth="3" />
          <path d="M160 62 l12 30 l-12 8 l-12 -8 z" fill={ACC} />
          <path d="M160 122 l12 -22 l-12 -8 l-12 8 z" fill={W} opacity="0.85" />
          <circle cx="160" cy="92" r="4" fill={NAVY} />
          <text x="160" y="52" fontSize="12" fontWeight="800" fill={W} textAnchor="middle" fontFamily={numberFont}>N</text>
        </g>
      );
    }
    case "numberline": {
      return (
        <g>
          <path d="M80 108H240" stroke={W} strokeWidth="3" strokeLinecap="round" />
          <path d="M240 108 l-8 -5 v10 z" fill={W} />
          {[0, 1, 2, 3, 4, 5].map((n) => {
            const x = 88 + n * 30;
            return (
              <g key={n}>
                <path d={`M${x} 102V114`} stroke={W} strokeWidth="2.5" strokeLinecap="round" />
                <text x={x} y="128" fontSize="11" fontWeight="700" fill={W} textAnchor="middle" fontFamily={numberFont}>{n}</text>
              </g>
            );
          })}
          <path d="M118 106 Q148 66 178 106" fill="none" stroke={ACC} strokeWidth="3" strokeLinecap="round" />
          <path d="M178 106 l-2 -9 l8 4 z" fill={ACC} />
          <circle cx="118" cy="108" r="5.5" fill={ACC} stroke={W} strokeWidth="2" />
        </g>
      );
    }
    case "clock": {
      const cx = 160, cy = 92, r = 42;
      return (
        <g>
          <circle cx={cx} cy={cy} r={r + 3} fill={W} opacity="0.2" />
          <circle cx={cx} cy={cy} r={r} fill={W} opacity="0.92" stroke={W} strokeWidth="2" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x1 = cx + (r - 6) * Math.cos(a), y1 = cy + (r - 6) * Math.sin(a);
            const x2 = cx + (r - 2) * Math.cos(a), y2 = cy + (r - 2) * Math.sin(a);
            return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={NAVY} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />;
          })}
          <path d={`M${cx} ${cy}L${cx} ${cy - 24}`} stroke={NAVY} strokeWidth="3.5" strokeLinecap="round" />
          <path d={`M${cx} ${cy}L${cx + 20} ${cy + 8}`} stroke={ACC_D} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="3.5" fill={NAVY} />
        </g>
      );
    }
    case "symmetry": {
      const wing = (dir: number) => (
        <g>
          <ellipse cx={160 + dir * 20} cy="78" rx="18" ry="14" fill={dir < 0 ? ACC : ACC_D} stroke={W} strokeWidth="2" />
          <ellipse cx={160 + dir * 16} cy="104" rx="13" ry="11" fill={dir < 0 ? ACC : ACC_D} stroke={W} strokeWidth="2" />
        </g>
      );
      return (
        <g>
          {wing(-1)}{wing(1)}
          <rect x="158" y="66" width="4" height="52" rx="2" fill={NAVY} opacity="0.7" />
          <path d="M160 60V124" stroke={W} strokeWidth="2" strokeDasharray="5 5" strokeOpacity="0.8" />
          <circle cx="160" cy="62" r="4" fill={NAVY} opacity="0.7" />
        </g>
      );
    }
    case "coordinate": {
      const ox = 108, oy = 130, step = 22;
      const pts = [[1, 1], [2, 3], [4, 2]];
      return (
        <g>
          <g stroke={W} strokeOpacity="0.35" strokeWidth="1">
            {[0, 1, 2, 3, 4, 5].map((i) => <path key={`v${i}`} d={`M${ox + i * step} ${oy}V${oy - 5 * step}`} />)}
            {[0, 1, 2, 3, 4, 5].map((i) => <path key={`h${i}`} d={`M${ox} ${oy - i * step}H${ox + 5 * step}`} />)}
          </g>
          <path d={`M${ox} ${oy - 5 * step}V${oy}H${ox + 5 * step}`} fill="none" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
          <polyline
            points={pts.map(([x, y]) => `${ox + x * step},${oy - y * step}`).join(" ")}
            fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round"
          />
          {pts.map(([x, y], i) => <circle key={i} cx={ox + x * step} cy={oy - y * step} r="5" fill={ACC} stroke={W} strokeWidth="2" />)}
        </g>
      );
    }
    case "spinner": {
      const cx = 160, cy = 94, r = 40;
      const cols = [ACC, TEAL, W, ACC_D, TEAL_D, ROSE];
      const seg = (i: number) => {
        const a0 = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
        const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
        const [x0, y0] = p(a0), [x1, y1] = p(a1);
        return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={cols[i]} opacity={cols[i] === W ? 0.85 : 1} stroke={W} strokeWidth="1.5" />;
      };
      return (
        <g>
          <circle cx={cx} cy={cy} r={r + 4} fill={W} opacity="0.2" />
          {[0, 1, 2, 3, 4, 5].map(seg)}
          <circle cx={cx} cy={cy} r="6" fill={NAVY} />
          <path d={`M${cx} ${cy - r - 8} l7 12 h-14 z`} fill={NAVY} />
        </g>
      );
    }
    case "book":
    default: {
      return (
        <g>
          <rect x="96" y="60" width="128" height="72" rx="6" fill={NAVY} opacity="0.25" />
          <path d="M160 62 C140 54 116 54 100 60 V126 C116 120 140 120 160 128 Z" fill={W} stroke={W} strokeWidth="1.5" />
          <path d="M160 62 C180 54 204 54 220 60 V126 C204 120 180 120 160 128 Z" fill={W} opacity="0.92" stroke={W} strokeWidth="1.5" />
          <path d="M160 62V128" stroke={NAVY} strokeOpacity="0.25" strokeWidth="2" />
          <g stroke={TEAL_D} strokeWidth="2" strokeLinecap="round" opacity="0.7">
            <path d="M112 78H146M112 90H146M112 102H140" />
            <path d="M174 78H208M174 90H208M174 102H202" />
          </g>
          <path d="M150 46 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z" fill={ACC} />
        </g>
      );
    }
  }
}
