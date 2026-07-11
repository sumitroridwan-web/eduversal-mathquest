import { cn } from "@/lib/utils";
import type { Resource } from "@/types";
import { craFor, type CRA } from "@/lib/cra";
import { simPreset } from "@/config/simPresets";
import { GameCover } from "./GameCover";

// ==========================================================
// ResourceCover — CRA-graded, per-topic scene illustrations.
// Concrete real-object art for Early Years & lower grades,
// pictorial (dots / bars / frames) for middle grades, and
// abstract (numerals / symbols / graphs) for upper grades.
// Each simulation's activity mode selects a distinct scene.
// ==========================================================

const gradients: Record<string, [string, string]> = {
  count: ["from-teal-400", "to-teal-600"], bond: ["from-teal-400", "to-teal-700"],
  addition: ["from-teal-500", "to-emerald-600"], subtraction: ["from-amber-400", "to-accent-600"],
  compare: ["from-teal-400", "to-navy-600"], numbercards: ["from-navy-400", "to-navy-700"],
  numberline: ["from-navy-400", "to-teal-600"], onemore: ["from-navy-400", "to-teal-700"],
  steps: ["from-navy-500", "to-teal-700"], order: ["from-navy-400", "to-navy-700"],
  placevalue: ["from-navy-500", "to-navy-800"], decimal: ["from-navy-600", "to-teal-800"],
  array: ["from-accent-400", "to-amber-600"], doubles: ["from-accent-400", "to-navy-600"],
  fraction: ["from-rose-400", "to-accent-500"], halves: ["from-rose-400", "to-teal-600"],
  equivalent: ["from-purple-400", "to-navy-600"], percent: ["from-rose-400", "to-purple-600"],
  ratio: ["from-teal-500", "to-purple-600"], money: ["from-emerald-400", "to-teal-600"],
  clock: ["from-navy-400", "to-navy-700"], coordinate: ["from-navy-500", "to-teal-700"],
  spinner: ["from-purple-400", "to-accent-500"], symmetry: ["from-teal-400", "to-purple-600"],
  shape: ["from-accent-300", "to-accent-500"], sort: ["from-teal-400", "to-navy-600"],
  pattern: ["from-purple-400", "to-purple-600"], bar: ["from-teal-500", "to-navy-700"],
  pictogram: ["from-accent-400", "to-teal-600"], stats: ["from-teal-500", "to-navy-800"],
  angle: ["from-navy-500", "to-teal-700"], orderops: ["from-navy-600", "to-purple-700"],
  mission: ["from-navy-600", "to-purple-700"], magnifier: ["from-navy-500", "to-teal-600"],
  hundredsquare: ["from-navy-500", "to-teal-700"], book: ["from-teal-500", "to-navy-700"],
};

function themeFor(r: Resource): string {
  const p = simPreset(r.id);
  const c = r.cover;
  if (/hundred-square/.test(r.id)) return "hundredsquare";
  if (/angle/i.test(r.id)) return "angle";
  if (c === "tenframe" || c === "counters") return p.tfMode === "combine" ? "addition" : p.tfMode === "bond" ? "bond" : "count";
  if (c === "numberline") return p.nlMode === "order" ? "order" : p.nlMode === "onemore" ? "onemore" : p.nlMode === "steps" ? "steps" : "numberline";
  if (c === "placevalue" || c === "blocks") return p.pvPlaces === "decimal" ? "decimal" : "placevalue";
  if (c === "multiply") return p.arDoubles ? "doubles" : "array";
  if (c === "fraction" || c === "fractionbar" || c === "equivalent") return p.frMode === "halves" ? "halves" : p.frMode === "percent" ? "percent" : p.frMode === "equivalent" ? "equivalent" : "fraction";
  if (c === "chartbuilder" || c === "graph") return p.bcMode === "pictogram" ? "pictogram" : p.bcMode === "stats" ? "stats" : "bar";
  if (c === "clock") return "clock";
  if (c === "coordinate") return "coordinate";
  if (c === "spinner") return "spinner";
  if (c === "shopping" || c === "money") return "money";
  if (c === "symmetry") return "symmetry";
  if (c === "compare") return r.programme === "early-years" ? "compare" : "ratio";
  if (c === "addition") return p.ooLevel || /order-op/.test(r.id) ? "orderops" : "addition";
  if (c === "subtraction") return "subtraction";
  if (c === "shapes") return "shape";
  if (c === "pattern" || c === "patternmachine") return "pattern";
  if (c === "hunt") return "magnifier";
  if (c === "cards") return "numbercards";
  if (c === "mission") return "mission";
  if (c && c.startsWith("book")) return "book";
  return "count";
}

function seedNum(id: string): number { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return Math.abs(h); }

const FONT = "var(--font-display), Poppins, system-ui, sans-serif";
const W = "#ffffff", TEAL = "#14b8a6", ACC = "#ffc94d", ACCD = "#f59e0b", NAVY = "#1b2540", RED = "#ef4444", GRN = "#22c55e", ROSE = "#fda4af";

// ---- concrete object glyphs ----
function Obj({ k, x, y, s }: { k: string; x: number; y: number; s: number }) {
  switch (k) {
    case "apple": return <g><circle cx={x} cy={y} r={s} fill={RED} stroke={W} strokeWidth={1.5} /><path d={`M${x} ${y - s} q1 -4 5 -4`} stroke="#166534" strokeWidth={2} fill="none" strokeLinecap="round" /><ellipse cx={x + 5} cy={y - s - 2} rx={3.5} ry={2} fill={GRN} /></g>;
    case "star": return <path transform={`translate(${x} ${y}) scale(${s / 9})`} d="M0 -9 L2.6 -2.8 L9 -2.8 L3.9 1.1 L5.6 7.3 L0 3.6 L-5.6 7.3 L-3.9 1.1 L-9 -2.8 L-2.6 -2.8 Z" fill={ACC} stroke={W} strokeWidth={0.8} />;
    case "ball": return <g><circle cx={x} cy={y} r={s} fill={TEAL} stroke={W} strokeWidth={1.5} /><circle cx={x - s * 0.35} cy={y - s * 0.35} r={s * 0.28} fill={W} opacity={0.7} /></g>;
    case "block": return <rect x={x - s} y={y - s} width={s * 2} height={s * 2} rx={2.5} fill={ACC} stroke={W} strokeWidth={1.5} />;
    case "coin": return <g><circle cx={x} cy={y} r={s} fill={ACC} stroke={ACCD} strokeWidth={2} /><circle cx={x} cy={y} r={s * 0.6} fill="none" stroke={ACCD} strokeOpacity={0.5} /></g>;
    default: return <circle cx={x} cy={y} r={s * 0.75} fill={W} />;
  }
}
function units(kind: string, n: number, cx: number, y: number, gap: number, s: number, cra: CRA) {
  const x0 = cx - ((n - 1) * gap) / 2;
  return Array.from({ length: n }).map((_, i) => <Obj key={i} k={cra === "concrete" ? kind : "dot"} x={x0 + i * gap} y={y} s={s} />);
}
function Num({ x, y, t, s = 40, fill = W }: { x: number; y: number; t: string; s?: number; fill?: string }) {
  return <text x={x} y={y} fontSize={s} fontWeight={800} fill={fill} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{t}</text>;
}
function tenFrame(count: number, cx: number, cy: number) {
  const cw = 19, gap = 3, cols = 5, sx = cx - (cols * cw + (cols - 1) * gap) / 2, sy = cy - cw - gap / 2;
  return Array.from({ length: 10 }).map((_, i) => { const col = i % 5, row = Math.floor(i / 5); const x = sx + col * (cw + gap), yy = sy + row * (cw + gap); return <g key={i}><rect x={x} y={yy} width={cw} height={cw} rx={3} fill={W} opacity={i < count ? 1 : 0.25} stroke={W} strokeOpacity={0.5} />{i < count && <circle cx={x + cw / 2} cy={yy + cw / 2} r={6} fill={TEAL} />}</g>; });
}
function pie(cx: number, cy: number, r: number, d: number, filled: number, fill = ACC) {
  return Array.from({ length: d }).map((_, i) => { const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2; const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); const large = a1 - a0 > Math.PI ? 1 : 0; return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={i < filled ? fill : W} opacity={i < filled ? 1 : 0.85} stroke={W} strokeWidth={2} />; });
}

// stacked fraction for SVG (numerator over bar over denominator)
function FracSVG({ x, y, n, d, s = 30, fill = W }: { x: number; y: number; n: number | string; d: number | string; s?: number; fill?: string }) {
  const w = Math.max(String(n).length, String(d).length) * s * 0.4 + 4;
  return (
    <g>
      <text x={x} y={y - s * 0.42} fontSize={s} fontWeight={800} fill={fill} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{n}</text>
      <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={fill} strokeWidth={Math.max(2, s * 0.08)} strokeLinecap="round" />
      <text x={x} y={y + s * 0.5} fontSize={s} fontWeight={800} fill={fill} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{d}</text>
    </g>
  );
}

// ---- scene renderer ----
function Scene({ theme, cra, seed, pid }: { theme: string; cra: CRA; seed: number; pid: string }) {
  const cx = 160, cy = 94;
  switch (theme) {
    case "count": {
      const n = 3 + (seed % 4);
      if (cra === "abstract") return <Num x={cx} y={cy} t={`${n}`} s={64} />;
      if (cra === "pictorial") return <g>{tenFrame(n, cx, cy)}</g>;
      return <g>{units("apple", n, cx, cy, 30, 11, cra)}</g>;
    }
    case "bond": {
      const filled = 4 + (seed % 5);
      if (cra === "abstract") return <Num x={cx} y={cy} t={`${filled} + ${10 - filled} = 10`} s={28} />;
      return <g>{tenFrame(filled, cx, cy - 8)}<Num x={cx} y={cy + 34} t={`${filled} + ? = 10`} s={16} /></g>;
    }
    case "addition": {
      const a = 2 + (seed % 3), b = 2 + ((seed >> 2) % 3);
      if (cra === "abstract") return <Num x={cx} y={cy} t={`${a} + ${b}`} s={44} />;
      return <g>{units("apple", a, cx - 55, cy, 22, 10, cra)}<Num x={cx} y={cy} t="+" s={30} fill={ACC} />{units("apple", b, cx + 55, cy, 22, 10, cra)}</g>;
    }
    case "subtraction": {
      if (cra === "abstract") return <Num x={cx} y={cy} t="5 − 2" s={44} />;
      return <g>{Array.from({ length: 5 }).map((_, i) => <g key={i}><Obj k={cra === "concrete" ? "apple" : "dot"} x={cx - 44 + i * 22} y={cy} s={10} />{i >= 3 && <path d={`M${cx - 50 + i * 22} ${cy - 8} l12 16`} stroke={NAVY} strokeWidth={2.5} strokeLinecap="round" />}</g>)}</g>;
    }
    case "compare": {
      const a = 4, b = 2;
      if (cra === "abstract") return <Num x={cx} y={cy} t="5 > 3" s={44} />;
      return <g>{units("apple", a, cx - 58, cy, 20, 9, cra)}<Num x={cx} y={cy} t=">" s={30} fill={ACC} />{units("apple", b, cx + 58, cy, 20, 9, cra)}</g>;
    }
    case "ratio":
      return <g>{units("ball", 2, cx - 55, cy, 22, 10, "concrete")}<Num x={cx} y={cy} t=":" s={34} />{units("star", 3, cx + 45, cy, 22, 10, "concrete")}<Num x={cx} y={cy + 40} t="2 : 3" s={18} /></g>;
    case "doubles": {
      const n = 2 + (seed % 3);
      if (cra === "abstract") return <Num x={cx} y={cy} t={`double ${n} = ${2 * n}`} s={24} />;
      return <g>{units("star", n, cx - 50, cy, 22, 10, "concrete")}<Num x={cx} y={cy} t="=" s={26} />{units("star", n, cx + 50, cy, 22, 10, "concrete")}</g>;
    }
    case "order":
    case "numbercards":
      return <g>{[1, 2, 3, 4].map((v, i) => <g key={v} transform={`rotate(${(i - 1.5) * 5} ${cx - 66 + i * 44} ${cy})`}><rect x={cx - 82 + i * 44} y={cy - 20} width={32} height={40} rx={5} fill={W} /><Num x={cx - 66 + i * 44} y={cy} t={`${v}`} s={22} fill={NAVY} /></g>)}</g>;
    case "onemore":
      return <g>{units("apple", 4, cx, cy, 24, 10, cra)}<path d={`M${cx + 62} ${cy} h18`} stroke={ACC} strokeWidth={3} strokeLinecap="round" /><path d={`M${cx + 80} ${cy} l-6 -5 v10 z`} fill={ACC} /><Num x={cx + 92} y={cy} t="+1" s={16} /></g>;
    case "steps": {
      const n = 4 + (seed % 2), step = [2, 5, 10][seed % 3], gap = 170 / n;
      const line = <line x1={70} y1={cy + 18} x2={70 + gap * n + 8} y2={cy + 18} stroke={W} strokeWidth={2.5} strokeLinecap="round" />;
      const dots = Array.from({ length: n + 1 }).map((_, k) => <g key={k}><circle cx={78 + k * gap} cy={cy + 18} r={5} fill={ACC} stroke={W} strokeWidth={1.5} /><text x={78 + k * gap} y={cy + 34} fontSize={9} textAnchor="middle" fill={W} fontWeight={700}>{k * step}</text></g>);
      const arcs = Array.from({ length: n }).map((_, k) => <path key={k} d={`M${78 + k * gap} ${cy + 14} Q${78 + (k + 0.5) * gap} ${cy - 16} ${78 + (k + 1) * gap} ${cy + 14}`} fill="none" stroke={W} strokeWidth={2} />);
      return <g>{line}{dots}{arcs}</g>;
    }
    case "numberline": {
      const mk = 1 + (seed % 5);
      const line = <line x1={70} y1={cy} x2={250} y2={cy} stroke={W} strokeWidth={2.5} strokeLinecap="round" />;
      const ticks = [0, 1, 2, 3, 4, 5].map((k) => <g key={k}><line x1={78 + k * 34} y1={cy - 6} x2={78 + k * 34} y2={cy + 6} stroke={W} strokeWidth={2} />{cra !== "concrete" && <text x={78 + k * 34} y={cy + 20} fontSize={11} textAnchor="middle" fill={W} fontWeight={700}>{k}</text>}</g>);
      return <g>{line}{ticks}<circle cx={78 + mk * 34} cy={cy} r={7} fill={ACC} stroke={W} strokeWidth={2} /><text x={78 + mk * 34} y={cy - 14} fontSize={13} textAnchor="middle" fill={W} fontWeight={800} fontFamily={FONT}>{mk}</text></g>;
    }
    case "placevalue": {
      const tn = 1 + (seed % 5), on = 1 + ((seed >> 3) % 6), num = 100 + tn * 10 + on;
      if (cra === "abstract") return <g><Num x={cx} y={cy - 8} t={`${num}`} s={40} /><Num x={cx} y={cy + 26} t={`100 + ${tn * 10} + ${on}`} s={15} /></g>;
      return <g>
        <g stroke={W} strokeWidth={1} strokeOpacity={0.85}><rect x={cx - 82} y={cy - 26} width={52} height={52} rx={4} fill={W} opacity={0.85} />{[1, 2, 3, 4].map((i) => <path key={`h${i}`} d={`M${cx - 82 + i * 10.4} ${cy - 26} v52`} />)}{[1, 2, 3, 4].map((i) => <path key={`v${i}`} d={`M${cx - 82} ${cy - 26 + i * 10.4} h52`} />)}</g>
        {Array.from({ length: tn }).map((_, i) => <rect key={i} x={cx - 18 + i * 8} y={cy - 26} width={6} height={52} rx={2} fill={TEAL} stroke={W} />)}
        {Array.from({ length: on }).map((_, i) => <rect key={i} x={cx + 40 + (i % 2) * 16} y={cy - 26 + Math.floor(i / 2) * 16} width={12} height={12} rx={2} fill={ACC} stroke={W} />)}
      </g>;
    }
    case "decimal":
      return <g><g className="opacity-95">{Array.from({ length: 100 }).map((_, i) => { const col = i % 10, row = Math.floor(i / 10); return <rect key={i} x={cx - 66 + col * 8} y={cy - 40 + row * 8} width={7} height={7} fill={i < 40 ? TEAL : W} opacity={i < 40 ? 1 : 0.6} />; })}</g><Num x={cx + 40} y={cy} t="0.4" s={30} /></g>;
    case "array": {
      const rows = 2 + (seed % 2), cols = 3 + (seed % 3);
      if (cra === "abstract") return <Num x={cx} y={cy} t={`${rows} × ${cols}`} s={40} />;
      return <g>{Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((_, c) => <Obj key={`${r}-${c}`} k={cra === "concrete" ? "apple" : "dot"} x={cx - (cols - 1) * 11 + c * 22} y={cy - (rows - 1) * 11 + r * 22} s={8} />))}</g>;
    }
    case "fraction": {
      const d = [3, 4, 5, 6, 8][seed % 5];
      const fn = 1 + ((seed >> 3) % (d - 1));
      if (cra === "abstract") return <FracSVG x={cx} y={cy} n={fn} d={d} s={46} />;
      if (cra === "pictorial") return <g>{Array.from({ length: d }).map((_, i) => <rect key={i} x={cx - 70 + i * (140 / d)} y={cy - 15} width={140 / d - 4} height={30} rx={4} fill={i < fn ? ACC : W} opacity={i < fn ? 1 : 0.3} stroke={W} strokeWidth={1.5} />)}</g>;
      return <g><circle cx={cx} cy={cy} r={40} fill={W} opacity={0.25} />{pie(cx, cy, 38, d, fn)}</g>;
    }
    case "halves": {
      const m3 = seed % 3, col = seed % 2 ? TEAL : ACC;
      if (cra === "abstract") return <FracSVG x={cx} y={cy} n={1} d={2} s={48} />;
      if (m3 === 1) return <g>{[0, 1].map((i) => <rect key={i} x={cx - 42 + i * 42} y={cy - 22} width={40} height={44} rx={5} fill={i < 1 ? col : W} opacity={i < 1 ? 1 : 0.3} stroke={W} strokeWidth={2} />)}</g>;
      if (m3 === 2) return <g><circle cx={cx} cy={cy} r={40} fill={W} opacity={0.25} />{pie(cx, cy, 38, 4, 2, col)}</g>;
      return <g><circle cx={cx} cy={cy} r={40} fill={W} opacity={0.25} />{pie(cx, cy, 38, 2, 1, col)}</g>;
    }
    case "equivalent": {
      const eq = [[1, 2, 2, 4], [1, 3, 2, 6], [2, 3, 4, 6], [1, 4, 2, 8], [3, 4, 6, 8]][seed % 5];
      const [a1, b1, a2, b2] = eq;
      if (cra === "abstract") return <g><FracSVG x={cx - 46} y={cy} n={a1} d={b1} s={30} /><Num x={cx} y={cy} t="=" s={24} /><FracSVG x={cx + 46} y={cy} n={a2} d={b2} s={30} /></g>;
      return <g>
        <g transform={`translate(${cx - 66} ${cy - 12})`}>{Array.from({ length: b1 }).map((_, i) => <rect key={i} x={i * (52 / b1)} y={0} width={52 / b1 - 2} height={22} rx={3} fill={i < a1 ? TEAL : W} opacity={i < a1 ? 1 : 0.3} />)}</g>
        <Num x={cx} y={cy} t="=" s={22} />
        <g transform={`translate(${cx + 14} ${cy - 12})`}>{Array.from({ length: b2 }).map((_, i) => <rect key={i} x={i * (52 / b2)} y={0} width={52 / b2 - 2} height={22} rx={3} fill={i < a2 ? ACC : W} opacity={i < a2 ? 1 : 0.3} />)}</g>
      </g>;
    }
    case "percent":
      return <g><g>{Array.from({ length: 100 }).map((_, i) => { const col = i % 10, row = Math.floor(i / 10); return <rect key={i} x={cx - 70 + col * 8} y={cy - 40 + row * 8} width={7} height={7} fill={i % 10 < 5 ? TEAL : W} opacity={i % 10 < 5 ? 1 : 0.55} />; })}</g><Num x={cx + 44} y={cy} t="50%" s={24} /></g>;
    case "money": {
      const sets = [[10, 5, 2], [20, 10], [5, 5, 2], [50, 20, 10], [10, 10, 5], [20, 5, 2]][seed % 6];
      const amt = sets.reduce((a, b) => a + b, 0);
      if (cra === "abstract") return <Num x={cx} y={cy} t={amt >= 100 ? `£${(amt / 100).toFixed(2)}` : `${amt}p`} s={34} />;
      return <g>{sets.map((v, i) => <Obj key={i} k="coin" x={cx - (sets.length - 1) * 14 + i * 28} y={cy - (i % 2) * 6} s={17} />)}</g>;
    }
    case "clock": {
      const r = 42, hr = 1 + (seed % 12), mn = [0, 15, 30, 45][seed % 4];
      const ha = ((hr % 12) * 30 + mn * 0.5 - 90) * Math.PI / 180, ma = (mn * 6 - 90) * Math.PI / 180;
      if (cra === "abstract") return <g><rect x={cx - 46} y={cy - 22} width={92} height={44} rx={8} fill={NAVY} opacity={0.35} /><Num x={cx} y={cy} t={`${hr}:${String(mn).padStart(2, "0")}`} s={28} /></g>;
      return <g><circle cx={cx} cy={cy} r={r} fill={W} opacity={0.92} stroke={W} strokeWidth={2} />{[0, 3, 6, 9].map((i) => { const a = (i / 12) * 2 * Math.PI - Math.PI / 2; return <circle key={i} cx={cx + (r - 8) * Math.cos(a)} cy={cy + (r - 8) * Math.sin(a)} r={2} fill={NAVY} />; })}<line x1={cx} y1={cy} x2={cx + (r - 24) * Math.cos(ha)} y2={cy + (r - 24) * Math.sin(ha)} stroke={NAVY} strokeWidth={3.5} strokeLinecap="round" /><line x1={cx} y1={cy} x2={cx + (r - 12) * Math.cos(ma)} y2={cy + (r - 12) * Math.sin(ma)} stroke={ACCD} strokeWidth={3} strokeLinecap="round" /><circle cx={cx} cy={cy} r={3.5} fill={NAVY} /></g>;
    }
    case "coordinate": {
      const o = cx - 46, b = cy + 40, st = 18;
      const pts = [[1 + seed % 2, 1 + seed % 3], [2 + seed % 2, 3 + (seed >> 2) % 2], [4, 2 + seed % 3]];
      return <g><g stroke={W} strokeOpacity={0.35} strokeWidth={1}>{[0, 1, 2, 3, 4, 5].map((i) => <path key={`v${i}`} d={`M${o + i * st} ${b} v${-5 * st}`} />)}{[0, 1, 2, 3, 4, 5].map((i) => <path key={`h${i}`} d={`M${o} ${b - i * st} h${5 * st}`} />)}</g><path d={`M${o} ${b - 5 * st} v${5 * st} h${5 * st}`} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" /><polyline points={pts.map(([x, y]) => `${o + x * st},${b - y * st}`).join(" ")} fill="none" stroke={ACC} strokeWidth={2.5} />{pts.map(([x, y], i) => <circle key={i} cx={o + x * st} cy={b - y * st} r={4.5} fill={ACC} stroke={W} strokeWidth={1.5} />)}</g>;
    }
    case "spinner": {
      const r = 40, cols = [ACC, TEAL, "#6366f1", "#f43f5e"];
      return <g>{cols.map((col, i) => { const a0 = (i / 4) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / 4) * 2 * Math.PI - Math.PI / 2; const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={col} stroke={W} strokeWidth={1.5} />; })}<circle cx={cx} cy={cy} r={6} fill={NAVY} /><path d={`M${cx} ${cy - r - 8} l6 12 h-12 z`} fill={NAVY} /></g>;
    }
    case "symmetry": {
      const wl = [ACC, TEAL, ROSE][seed % 3], wr = [ACCD, "#0d9488", "#f43f5e"][(seed >> 2) % 3];
      return <g><g><ellipse cx={cx - 18} cy={cy - 8} rx={16} ry={12} fill={wl} stroke={W} strokeWidth={2} /><ellipse cx={cx - 14} cy={cy + 14} rx={11} ry={9} fill={wl} stroke={W} strokeWidth={2} /></g><g><ellipse cx={cx + 18} cy={cy - 8} rx={16} ry={12} fill={wr} stroke={W} strokeWidth={2} /><ellipse cx={cx + 14} cy={cy + 14} rx={11} ry={9} fill={wr} stroke={W} strokeWidth={2} /></g><path d={`M${cx} ${cy - 30} v60`} stroke={W} strokeWidth={2} strokeDasharray="5 5" /></g>;
    }
    case "shape": {
      const c1 = [TEAL, ROSE, "#6366f1"][seed % 3], c2 = [ACC, TEAL, ACCD][(seed >> 2) % 3];
      const kinds = seed % 2 ? ["circle", "square", "triangle", "star"] : ["circle", "square", "triangle"];
      const n = kinds.length, gap = 48, sx = cx - ((n - 1) * gap) / 2;
      const draw = (k: string, x: number) => {
        if (k === "circle") return <circle cx={x} cy={cy} r={18} fill={c1} stroke={W} strokeWidth={2.5} />;
        if (k === "square") return <rect x={x - 16} y={cy - 16} width={32} height={32} rx={4} fill={c2} stroke={W} strokeWidth={2.5} />;
        if (k === "triangle") return <path d={`M${x} ${cy - 18} l17 34 h-34 z`} fill={W} opacity={0.92} stroke={W} strokeWidth={2.5} />;
        return <path transform={`translate(${x} ${cy}) scale(2)`} d="M0 -9 L2.6 -2.8 L9 -2.8 L3.9 1.1 L5.6 7.3 L0 3.6 L-5.6 7.3 L-3.9 1.1 L-9 -2.8 L-2.6 -2.8 Z" fill={ACC} stroke={W} strokeWidth={0.8} />;
      };
      return <g>{kinds.map((k, i) => <g key={i}>{draw(k, sx + i * gap)}</g>)}</g>;
    }
    case "sort":
      return <g><ellipse cx={cx - 42} cy={cy} rx={40} ry={30} fill="none" stroke={W} strokeWidth={2} strokeOpacity={0.6} /><ellipse cx={cx + 42} cy={cy} rx={40} ry={30} fill="none" stroke={W} strokeWidth={2} strokeOpacity={0.6} /><circle cx={cx - 50} cy={cy} r={12} fill={TEAL} stroke={W} strokeWidth={2} /><circle cx={cx - 30} cy={cy + 8} r={10} fill={TEAL} stroke={W} strokeWidth={2} /><rect x={cx + 30} y={cy - 12} width={22} height={22} rx={3} fill={ACC} stroke={W} strokeWidth={2} /><path d={`M${cx + 44} ${cy + 14} l12 -22 l12 22 z`} fill={ACC} stroke={W} strokeWidth={2} transform={`translate(-18 0)`} /></g>;
    case "pattern": {
      const pr = simPreset(pid);
      const unit = pr.ptUnit ? (pr.ptUnit === "AB" ? 2 : 3) : 2 + ((seed >> 2) % 2);
      const shapes = pr.ptMode === "shapes";
      const pal = [[ACC, TEAL], [ROSE, "#6366f1"], [TEAL, ACCD], ["#a855f7", ACC]][seed % 4];
      const off = (seed >> 4) % unit;
      const kinds = Array.from({ length: 5 }, (_, i) => (i + off) % unit);
      const X = (i: number) => cx - 64 + i * 32;
      if (cra === "abstract") return <g>{kinds.map((k, i) => <Num key={i} x={X(i)} y={cy} t={String.fromCharCode(65 + k)} s={26} />)}</g>;
      if (shapes) return <g>{kinds.map((k, i) => k === 0
        ? <circle key={i} cx={X(i)} cy={cy} r={13} fill={TEAL} stroke={W} strokeWidth={2} />
        : k === 1
          ? <rect key={i} x={X(i) - 12} y={cy - 12} width={24} height={24} rx={4} fill={TEAL} stroke={W} strokeWidth={2} />
          : <path key={i} d={`M${X(i)} ${cy - 13} l13 26 h-26 z`} fill={TEAL} stroke={W} strokeWidth={2} />)}</g>;
      return <g>{kinds.map((k, i) => k % 2 === 0
        ? <circle key={i} cx={X(i)} cy={cy} r={13} fill={pal[0]} stroke={W} strokeWidth={2} />
        : <rect key={i} x={X(i) - 12} y={cy - 12} width={24} height={24} rx={4} fill={pal[1]} stroke={W} strokeWidth={2} />)}</g>;
    }
    case "bar": {
      const bars = [0, 1, 2, 3].map((i) => 28 + ((seed >> (i * 2)) % 5) * 10);
      if (cra === "concrete") return <g><path d={`M${cx - 60} ${cy + 30} h120`} stroke={W} strokeWidth={2.5} strokeLinecap="round" />{bars.map((h, i) => Array.from({ length: Math.round(h / 14) }).map((_, j) => <rect key={`${i}-${j}`} x={cx - 54 + i * 30} y={cy + 24 - j * 14} width={20} height={12} rx={2} fill={j % 2 ? ACC : TEAL} stroke={W} />))}</g>;
      return <g><path d={`M${cx - 60} ${cy - 34} v64 h120`} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" />{bars.map((h, i) => <rect key={i} x={cx - 52 + i * 28} y={cy + 30 - h} width={18} height={h} rx={3} fill={i % 2 ? ACC : TEAL} />)}</g>;
    }
    case "pictogram": {
      const vals = [0, 1, 2, 3].map((i) => 2 + ((seed >> (i * 2)) % 5));
      return <g>{vals.map((v, i) => Array.from({ length: v }).map((_, j) => <rect key={`${i}-${j}`} x={cx - 54 + i * 30} y={cy + 30 - j * 16} width={20} height={13} rx={2} fill={TEAL} stroke={W} strokeWidth={1} />))}</g>;
    }
    case "stats": {
      const bars = [0, 1, 2, 3, 4].map((i) => 24 + ((seed >> (i * 2)) % 5) * 10);
      return <g><path d={`M${cx - 60} ${cy - 34} v64 h120`} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" />{bars.map((h, i) => <rect key={i} x={cx - 54 + i * 24} y={cy + 30 - h} width={16} height={h} rx={3} fill={i === 2 ? ACC : TEAL} />)}<Num x={cx} y={cy + 46} t="median" s={12} /></g>;
    }
    case "angle": {
      const ang = 40 + (seed % 5) * 25, rad = (ang * Math.PI) / 180, len = 56, by = cy + 18;
      const ax = cx + len * Math.cos(Math.PI - rad), ay = by - len * Math.sin(Math.PI - rad);
      return <g><line x1={cx - 52} y1={by} x2={cx + 52} y2={by} stroke={W} strokeWidth={3} strokeLinecap="round" /><line x1={cx} y1={by} x2={ax} y2={ay} stroke={ACC} strokeWidth={3} strokeLinecap="round" /><path d={`M${cx + 24} ${by} A24 24 0 0 0 ${cx + 24 * Math.cos(rad)} ${by - 24 * Math.sin(rad)}`} fill="none" stroke={W} strokeWidth={2} /><Num x={cx + 8} y={cy - 26} t={`${ang}°`} s={15} /></g>;
    }
    case "orderops": {
      const xs = [cx - 64, cx - 32, cx, cx + 32, cx + 64], toks = ["2", "+", "3", "×", "4"];
      return <g><rect x={cx - 84} y={cy - 22} width={100} height={44} rx={9} fill={ACC} fillOpacity={0.18} stroke={ACC} strokeWidth={2.5} />{toks.map((t, i) => <Num key={i} x={xs[i]} y={cy} t={t} s={28} />)}</g>;
    }
    case "mission":
      return <g><circle cx={cx} cy={cy} r={38} fill={W} opacity={0.16} stroke={W} strokeWidth={3} /><path d={`M${cx} ${cy - 28} l11 28 l-11 7 l-11 -7 z`} fill={ACC} /><path d={`M${cx} ${cy + 28} l11 -21 l-11 -7 l-11 7 z`} fill={W} opacity={0.85} /><circle cx={cx} cy={cy} r={4} fill={NAVY} /></g>;
    case "magnifier":
      return <g><text x={cx - 34} y={cy - 8} fontSize={22} fontWeight={800} fill={W} opacity={0.35} fontFamily={FONT}>12</text><text x={cx + 30} y={cy + 22} fontSize={18} fontWeight={800} fill={W} opacity={0.3} fontFamily={FONT}>7</text><circle cx={cx + 6} cy={cy} r={26} fill={W} opacity={0.16} stroke={W} strokeWidth={5} /><Num x={cx + 6} y={cy} t="5" s={22} /><rect x={cx + 24} y={cy + 20} width={26} height={8} rx={4} fill={ACC} transform={`rotate(45 ${cx + 24} ${cy + 20})`} /></g>;
    case "hundredsquare":
      return <g>{Array.from({ length: 100 }).map((_, i) => { const col = i % 10, row = Math.floor(i / 10); const mult = (i + 1) % 5 === 0; return <rect key={i} x={cx - 60 + col * 12} y={cy - 44 + row * 8} width={11} height={7} rx={1} fill={mult ? TEAL : W} opacity={mult ? 1 : 0.5} />; })}</g>;
    case "book":
      return <g><path d={`M${cx} ${cy - 32} C${cx - 20} ${cy - 40} ${cx - 44} ${cy - 40} ${cx - 60} ${cy - 34} V${cy + 30} C${cx - 44} ${cy + 24} ${cx - 20} ${cy + 24} ${cx} ${cy + 32} Z`} fill={W} stroke={W} strokeWidth={1.5} /><path d={`M${cx} ${cy - 32} C${cx + 20} ${cy - 40} ${cx + 44} ${cy - 40} ${cx + 60} ${cy - 34} V${cy + 30} C${cx + 44} ${cy + 24} ${cx + 20} ${cy + 24} ${cx} ${cy + 32} Z`} fill={W} opacity={0.92} stroke={W} strokeWidth={1.5} /><g stroke={TEAL} strokeWidth={2} strokeLinecap="round" opacity={0.7}><path d={`M${cx - 48} ${cy - 18} h30 M${cx - 48} ${cy - 6} h30 M${cx - 48} ${cy + 6} h24 M${cx + 18} ${cy - 18} h30 M${cx + 18} ${cy - 6} h30 M${cx + 18} ${cy + 6} h24`} /></g><path d={`M${cx - 8} ${cy - 44} l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z`} fill={ACC} /></g>;
    default:
      return <Num x={cx} y={cy} t="123" s={44} />;
  }
}

function Decor() {
  return <g>
    <circle cx="34" cy="30" r="9" fill={W} opacity="0.14" />
    <circle cx="290" cy="40" r="12" fill={W} opacity="0.1" />
    <circle cx="300" cy="150" r="6" fill={ACC} opacity="0.5" />
    <path d="M20 150 l7 -12 l7 12 z" fill={W} opacity="0.12" />
    <text x="266" y="30" fontSize="18" fontWeight="800" fill={W} opacity="0.13" fontFamily={FONT}>+</text>
    <text x="30" y="150" fontSize="15" fontWeight="800" fill={W} opacity="0.12" fontFamily={FONT}>=</text>
  </g>;
}

export function ResourceCover({
  resource, cover, type, className, size = "md", seed,
}: {
  /** Preferred: pass the full resource for CRA-graded, mode-aware art */
  resource?: Resource;
  cover?: string;
  type?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  seed?: string;
}) {
  void size; void cover; void type; void seed;
  // Games get a mini-mockup of their real play screen so the thumbnail
  // matches the page it opens.
  if (resource?.type === "game") return <GameCover resource={resource} className={className} />;
  const theme = resource ? themeFor(resource) : "count";
  const cra: CRA = resource ? craFor(resource) : "pictorial";
  const s = resource ? seedNum(resource.id) : 0;
  const [from, to] = gradients[theme] ?? gradients.count;
  const deg = resource ? (s % 5 - 2) * 10 : 0;
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", from, to, className)} style={deg ? { filter: `hue-rotate(${deg}deg)` } : undefined}>
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="52" cy="-10" r="90" fill={W} opacity="0.07" />
        <g stroke={W} strokeOpacity="0.06" strokeWidth="1"><path d="M40 0V180M120 0V180M200 0V180M280 0V180M0 45H320M0 90H320M0 135H320" /></g>
        <Decor />
        <Scene theme={theme} cra={cra} seed={s} pid={resource ? resource.id : ""} />
      </svg>
    </div>
  );
}
