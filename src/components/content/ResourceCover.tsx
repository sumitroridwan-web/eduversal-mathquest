import { cn } from "@/lib/utils";
import type { Resource } from "@/types";
import { craFor, type CRA } from "@/lib/cra";
import { simPreset } from "@/config/simPresets";

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

// ---- scene renderer ----
function Scene({ theme, cra, seed }: { theme: string; cra: CRA; seed: number }) {
  const cx = 160, cy = 94;
  switch (theme) {
    case "count": {
      const n = 3 + (seed % 4);
      if (cra === "abstract") return <Num x={cx} y={cy} t={`${n}`} s={64} />;
      if (cra === "pictorial") return <g>{tenFrame(n, cx, cy)}</g>;
      return <g>{units("apple", n, cx, cy, 30, 11, cra)}</g>;
    }
    case "bond": {
      if (cra === "abstract") return <Num x={cx} y={cy} t="6 + 4 = 10" s={30} />;
      return <g>{tenFrame(6, cx, cy - 8)}<Num x={cx} y={cy + 34} t="? + ? = 10" s={16} /></g>;
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
      const line = <line x1={70} y1={cy + 20} x2={250} y2={cy + 20} stroke={W} strokeWidth={2.5} strokeLinecap="round" />;
      const dots = [0, 1, 2, 3, 4].map((k) => <circle key={k} cx={78 + k * 40} cy={cy + 20} r={5} fill={ACC} stroke={W} strokeWidth={1.5} />);
      const arcs = [0, 1, 2].map((k) => <path key={k} d={`M${78 + k * 40} ${cy + 16} Q${98 + k * 40} ${cy - 18} ${118 + k * 40} ${cy + 16}`} fill="none" stroke={W} strokeWidth={2} />);
      return <g>{line}{dots}{arcs}</g>;
    }
    case "numberline": {
      const line = <line x1={70} y1={cy} x2={250} y2={cy} stroke={W} strokeWidth={2.5} strokeLinecap="round" />;
      const ticks = [0, 1, 2, 3, 4, 5].map((k) => <g key={k}><line x1={78 + k * 34} y1={cy - 6} x2={78 + k * 34} y2={cy + 6} stroke={W} strokeWidth={2} />{cra !== "concrete" && <text x={78 + k * 34} y={cy + 20} fontSize={11} textAnchor="middle" fill={W} fontWeight={700}>{k}</text>}</g>);
      return <g>{line}{ticks}<circle cx={78 + 3 * 34} cy={cy} r={7} fill={ACC} stroke={W} strokeWidth={2} /></g>;
    }
    case "placevalue": {
      if (cra === "abstract") return <g><Num x={cx} y={cy - 8} t="342" s={40} /><Num x={cx} y={cy + 26} t="300 + 40 + 2" s={15} /></g>;
      return <g>
        <g stroke={W} strokeWidth={1} strokeOpacity={0.85}><rect x={cx - 74} y={cy - 26} width={52} height={52} rx={4} fill={W} opacity={0.85} />{[1, 2, 3, 4].map((i) => <path key={`h${i}`} d={`M${cx - 74 + i * 10.4} ${cy - 26} v52`} />)}{[1, 2, 3, 4].map((i) => <path key={`v${i}`} d={`M${cx - 74} ${cy - 26 + i * 10.4} h52`} />)}</g>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={cx - 8 + i * 8} y={cy - 26} width={6} height={52} rx={2} fill={TEAL} stroke={W} />)}
        {[0, 1].map((i) => <rect key={i} x={cx + 40} y={cy - 26 + i * 16} width={12} height={12} rx={2} fill={ACC} stroke={W} />)}
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
      const d = 4, f = 3;
      if (cra === "abstract") return <Num x={cx} y={cy} t={`${f}/${d}`} s={46} />;
      return <g><circle cx={cx} cy={cy} r={40} fill={W} opacity={0.25} />{pie(cx, cy, 38, d, f)}</g>;
    }
    case "halves":
      if (cra === "abstract") return <Num x={cx} y={cy} t="1/2" s={46} />;
      return <g><circle cx={cx} cy={cy} r={40} fill={W} opacity={0.25} />{pie(cx, cy, 38, 2, 1, TEAL)}</g>;
    case "equivalent":
      if (cra === "abstract") return <Num x={cx} y={cy} t="1/2 = 2/4" s={30} />;
      return <g>
        <g transform={`translate(${cx - 66} ${cy - 12})`}><rect x={0} y={0} width={52} height={22} rx={4} fill={W} opacity={0.3} /><rect x={0} y={0} width={26} height={22} rx={4} fill={TEAL} /></g>
        <Num x={cx} y={cy} t="=" s={22} />
        <g transform={`translate(${cx + 14} ${cy - 12})`}>{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 13} y={0} width={12} height={22} rx={3} fill={i < 2 ? ACC : W} opacity={i < 2 ? 1 : 0.3} />)}</g>
      </g>;
    case "percent":
      return <g><g>{Array.from({ length: 100 }).map((_, i) => { const col = i % 10, row = Math.floor(i / 10); return <rect key={i} x={cx - 70 + col * 8} y={cy - 40 + row * 8} width={7} height={7} fill={i % 10 < 5 ? TEAL : W} opacity={i % 10 < 5 ? 1 : 0.55} />; })}</g><Num x={cx + 44} y={cy} t="50%" s={24} /></g>;
    case "money":
      if (cra === "abstract") return <Num x={cx} y={cy} t="£1.20" s={38} />;
      return <g><Obj k="coin" x={cx - 26} y={cy} s={18} /><Obj k="coin" x={cx} y={cy - 6} s={18} /><Obj k="coin" x={cx + 26} y={cy} s={18} /></g>;
    case "clock": {
      const r = 42;
      if (cra === "abstract") return <g><rect x={cx - 46} y={cy - 22} width={92} height={44} rx={8} fill={NAVY} opacity={0.35} /><Num x={cx} y={cy} t="3:00" s={30} /></g>;
      return <g><circle cx={cx} cy={cy} r={r} fill={W} opacity={0.92} stroke={W} strokeWidth={2} />{[0, 3, 6, 9].map((i) => { const a = (i / 12) * 2 * Math.PI - Math.PI / 2; return <circle key={i} cx={cx + (r - 8) * Math.cos(a)} cy={cy + (r - 8) * Math.sin(a)} r={2} fill={NAVY} />; })}<line x1={cx} y1={cy} x2={cx} y2={cy - 24} stroke={NAVY} strokeWidth={3.5} strokeLinecap="round" /><line x1={cx} y1={cy} x2={cx + 20} y2={cy + 8} stroke={ACCD} strokeWidth={3.5} strokeLinecap="round" /><circle cx={cx} cy={cy} r={3.5} fill={NAVY} /></g>;
    }
    case "coordinate": {
      const o = cx - 46, b = cy + 40, st = 18;
      return <g><g stroke={W} strokeOpacity={0.35} strokeWidth={1}>{[0, 1, 2, 3, 4, 5].map((i) => <path key={`v${i}`} d={`M${o + i * st} ${b} v${-5 * st}`} />)}{[0, 1, 2, 3, 4, 5].map((i) => <path key={`h${i}`} d={`M${o} ${b - i * st} h${5 * st}`} />)}</g><path d={`M${o} ${b - 5 * st} v${5 * st} h${5 * st}`} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" /><polyline points={`${o + st},${b - st} ${o + 3 * st},${b - 3 * st} ${o + 4 * st},${b - 2 * st}`} fill="none" stroke={ACC} strokeWidth={2.5} />{[[1, 1], [3, 3], [4, 2]].map(([x, y], i) => <circle key={i} cx={o + x * st} cy={b - y * st} r={4.5} fill={ACC} stroke={W} strokeWidth={1.5} />)}</g>;
    }
    case "spinner": {
      const r = 40, cols = [ACC, TEAL, "#6366f1", "#f43f5e"];
      return <g>{cols.map((col, i) => { const a0 = (i / 4) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / 4) * 2 * Math.PI - Math.PI / 2; const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={col} stroke={W} strokeWidth={1.5} />; })}<circle cx={cx} cy={cy} r={6} fill={NAVY} /><path d={`M${cx} ${cy - r - 8} l6 12 h-12 z`} fill={NAVY} /></g>;
    }
    case "symmetry":
      return <g><g><ellipse cx={cx - 18} cy={cy - 8} rx={16} ry={12} fill={ACC} stroke={W} strokeWidth={2} /><ellipse cx={cx - 14} cy={cy + 14} rx={11} ry={9} fill={ACC} stroke={W} strokeWidth={2} /></g><g><ellipse cx={cx + 18} cy={cy - 8} rx={16} ry={12} fill={ACCD} stroke={W} strokeWidth={2} /><ellipse cx={cx + 14} cy={cy + 14} rx={11} ry={9} fill={ACCD} stroke={W} strokeWidth={2} /></g><path d={`M${cx} ${cy - 30} v60`} stroke={W} strokeWidth={2} strokeDasharray="5 5" /></g>;
    case "shape":
      return <g><circle cx={cx - 40} cy={cy} r={20} fill={TEAL} stroke={W} strokeWidth={2.5} /><path d={`M${cx} ${cy + 20} l20 -38 l20 38 z`} fill={ACC} stroke={W} strokeWidth={2.5} /><rect x={cx - 18} y={cy - 18} width={36} height={36} rx={4} fill={W} opacity={0.9} stroke={W} strokeWidth={2.5} /></g>;
    case "sort":
      return <g><ellipse cx={cx - 42} cy={cy} rx={40} ry={30} fill="none" stroke={W} strokeWidth={2} strokeOpacity={0.6} /><ellipse cx={cx + 42} cy={cy} rx={40} ry={30} fill="none" stroke={W} strokeWidth={2} strokeOpacity={0.6} /><circle cx={cx - 50} cy={cy} r={12} fill={TEAL} stroke={W} strokeWidth={2} /><circle cx={cx - 30} cy={cy + 8} r={10} fill={TEAL} stroke={W} strokeWidth={2} /><rect x={cx + 30} y={cy - 12} width={22} height={22} rx={3} fill={ACC} stroke={W} strokeWidth={2} /><path d={`M${cx + 44} ${cy + 14} l12 -22 l12 22 z`} fill={ACC} stroke={W} strokeWidth={2} transform={`translate(-18 0)`} /></g>;
    case "pattern": {
      const seq = cra === "abstract" ? ["A", "B", "A", "B", "A"] : null;
      const cols = [ACC, TEAL, ACC, TEAL, ACC];
      if (seq) return <g>{seq.map((t, i) => <Num key={i} x={cx - 64 + i * 32} y={cy} t={t} s={26} />)}</g>;
      return <g>{cols.map((col, i) => i % 2 === 0 ? <circle key={i} cx={cx - 64 + i * 32} cy={cy} r={13} fill={col} stroke={W} strokeWidth={2} /> : <rect key={i} x={cx - 76 + i * 32} y={cy - 12} width={24} height={24} rx={4} fill={col} stroke={W} strokeWidth={2} />)}</g>;
    }
    case "bar": {
      const bars = [42, 66, 30, 54];
      if (cra === "concrete") return <g><path d={`M${cx - 60} ${cy + 30} h120`} stroke={W} strokeWidth={2.5} strokeLinecap="round" />{bars.map((h, i) => Array.from({ length: Math.round(h / 14) }).map((_, j) => <rect key={`${i}-${j}`} x={cx - 54 + i * 30} y={cy + 24 - j * 14} width={20} height={12} rx={2} fill={j % 2 ? ACC : TEAL} stroke={W} />))}</g>;
      return <g><path d={`M${cx - 60} ${cy - 34} v64 h120`} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" />{bars.map((h, i) => <rect key={i} x={cx - 52 + i * 28} y={cy + 30 - h} width={18} height={h} rx={3} fill={i % 2 ? ACC : TEAL} />)}</g>;
    }
    case "pictogram":
      return <g>{[3, 5, 2, 4].map((v, i) => Array.from({ length: v }).map((_, j) => <rect key={`${i}-${j}`} x={cx - 54 + i * 30} y={cy + 30 - j * 16} width={20} height={13} rx={2} fill={TEAL} stroke={W} strokeWidth={1} />))}</g>;
    case "stats": {
      const bars = [30, 46, 66, 40, 24];
      return <g><path d={`M${cx - 60} ${cy - 34} v64 h120`} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" />{bars.map((h, i) => <rect key={i} x={cx - 54 + i * 24} y={cy + 30 - h} width={16} height={h} rx={3} fill={i === 2 ? ACC : TEAL} />)}<Num x={cx} y={cy + 46} t="median" s={12} /></g>;
    }
    case "angle":
      return <g><line x1={cx - 50} y1={cy + 18} x2={cx + 50} y2={cy + 18} stroke={W} strokeWidth={3} strokeLinecap="round" /><line x1={cx} y1={cy + 18} x2={cx + 44} y2={cy - 26} stroke={ACC} strokeWidth={3} strokeLinecap="round" /><path d={`M${cx + 24} ${cy + 18} A24 24 0 0 0 ${cx + 15} ${cy - 1}`} fill="none" stroke={W} strokeWidth={2} /><Num x={cx + 4} y={cy - 26} t="180°" s={16} /></g>;
    case "orderops":
      return <g><Num x={cx} y={cy} t="2 + 3 × 4" s={30} /><rect x={cx - 46} y={cy - 20} width={44} height={40} rx={6} fill="none" stroke={ACC} strokeWidth={2.5} /></g>;
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
        <Scene theme={theme} cra={cra} seed={s} />
      </svg>
    </div>
  );
}
