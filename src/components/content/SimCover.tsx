import { cn } from "@/lib/utils";
import type { Resource } from "@/types";
import { themeFor } from "./ResourceCover";

// ==========================================================
// SimCover — the library thumbnail for a simulation mirrors its
// real engine page: a white card with the teal "Interactive
// simulation" badge and Options / Hint / Reset controls, over a
// soft panel showing that engine's signature visual. themeFor()
// resolves each sim's preset (halves / percent / decimal / steps…)
// so no two look the same.
// ==========================================================

const TEAL = "#27ab83", TEALD = "#199473", TEALL = "#8eedc7", ACC = "#f59e0b", ACC2 = "#ffb420", PURPLE = "#7c3aed", NAVY = "#1b2540";
const SOFT = "#f6f8fb", LINE = "#e2e8f0", CARD = "#dbe4f0", INK = "#31415f", W = "#ffffff";
const FONT = "var(--font-display), Poppins, system-ui, sans-serif";

function T({ x, y, t, s = 12, fill = NAVY, w = 800, anchor = "middle" as const }: { x: number; y: number; t: string; s?: number; fill?: string; w?: number; anchor?: "start" | "middle" | "end" }) {
  return <text x={x} y={y} fontSize={s} fontWeight={w} fill={fill} textAnchor={anchor} dominantBaseline="central" fontFamily={FONT}>{t}</text>;
}
function Frac({ x, y, n, d, s = 16, fill = NAVY }: { x: number; y: number; n: string | number; d: string | number; s?: number; fill?: string }) {
  const w = Math.max(String(n).length, String(d).length) * s * 0.42 + 4;
  return <g>
    <T x={x} y={y - s * 0.46} t={String(n)} s={s} fill={fill} />
    <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={fill} strokeWidth={Math.max(1.5, s * 0.09)} strokeLinecap="round" />
    <T x={x} y={y + s * 0.52} t={String(d)} s={s} fill={fill} />
  </g>;
}
function pieSlices(cx: number, cy: number, r: number, d: number, filled: number, fill = TEAL) {
  return Array.from({ length: d }).map((_, i) => {
    const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
    const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1); const large = a1 - a0 > Math.PI ? 1 : 0;
    return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={i < filled ? fill : W} stroke={fill} strokeWidth={1.5} />;
  });
}
const stepBox = (x: number, y: number, sign: string) => <g><rect x={x} y={y} width={14} height={14} rx={4} fill={W} stroke={CARD} strokeWidth={1.3} /><T x={x + 7} y={y + 7.5} t={sign} s={11} fill={INK} /></g>;

// page chrome: badge + control chips + instruction placeholder
function Chrome() {
  return <g>
    <rect x={10} y={9} width={116} height={17} rx={8.5} fill="#effcf6" stroke="#c6f7e2" strokeWidth={1} />
    <circle cx={21} cy={17.5} r={3} fill={TEAL} />
    <T x={28} y={18} t="Interactive simulation" s={8.5} fill={TEALD} w={700} anchor="start" />
    {[["Options", 214, 40], ["Hint", 258, 26], ["Reset", 288, 28]].map(([t, x, w], i) => (
      <g key={i}><rect x={Number(x)} y={9} width={Number(w)} height={17} rx={8.5} fill={W} stroke={CARD} strokeWidth={1} /><T x={Number(x) + Number(w) / 2} y={18} t={String(t)} s={7.5} fill={INK} w={600} /></g>
    ))}
    <rect x={12} y={33} width={150} height={5} rx={2.5} fill="#e7ecf3" />
  </g>;
}

function scene(theme: string, r: Resource): React.ReactNode {
  const seed = r.id.length + r.id.charCodeAt(r.id.length - 1);
  switch (theme) {
    case "count": case "bond": case "addition": {
      const total = 10, filled = 2 + (seed % 4);
      const cw = 22, gap = 4, cols = 5, sx = 160 - (cols * cw + (cols - 1) * gap) / 2, sy = 66;
      return <g>
        {Array.from({ length: total }).map((_, i) => { const col = i % 5, row = Math.floor(i / 5); const x = sx + col * (cw + gap), y = sy + row * (cw + gap); return <g key={i}><rect x={x} y={y} width={cw} height={cw} rx={5} fill={W} stroke={i < filled ? TEAL : LINE} strokeWidth={1.5} />{i < filled && <circle cx={x + cw / 2} cy={y + cw / 2} r={cw * 0.34} fill={TEAL} />}</g>; })}
        <T x={160} y={150} t={String(filled)} s={26} fill={NAVY} />
      </g>;
    }
    case "numberline": case "onemore": case "order": case "steps": {
      const n = 10, x0 = 40, x1 = 280, y = 100, at = 2 + (seed % 6);
      return <g>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#98a8c6" strokeWidth={2} />
        {Array.from({ length: n + 1 }).map((_, i) => { const x = x0 + (i / n) * (x1 - x0); return <g key={i}><line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#98a8c6" strokeWidth={1.5} /><T x={x} y={y + 16} t={String(i * 2)} s={8} fill={INK} w={700} /></g>; })}
        <circle cx={x0 + (at / n) * (x1 - x0)} cy={y} r={7} fill={ACC2} stroke={W} strokeWidth={1.5} />
        <T x={x0 + (at / n) * (x1 - x0)} y={74} t="0" s={13} fill={ACC} />
      </g>;
    }
    case "placevalue": case "decimal": {
      const dec = theme === "decimal";
      const rows: Array<[string, number]> = dec ? [["Ones", 3], ["Tenths", 4], ["Hundredths", 8]] : [["Hundreds", 2], ["Tens", 4], ["Ones", 6]];
      return <g>
        {rows.map(([label, val], i) => { const y = 62 + i * 30; return <g key={i}>
          <rect x={40} y={y} width={240} height={24} rx={7} fill={SOFT} />
          <T x={54} y={y + 12} t={label} s={10} fill={INK} anchor="start" w={600} />
          {stepBox(200, y + 5, "−")}<T x={228} y={y + 12} t={String(val)} s={13} fill={NAVY} />{stepBox(248, y + 5, "+")}
        </g>; })}
      </g>;
    }
    case "array": case "doubles": {
      const rows = 3, cols = 4;
      return <g>
        <rect x={96} y={56} width={128} height={70} rx={10} fill={SOFT} />
        {Array.from({ length: rows * cols }).map((_, i) => <circle key={i} cx={116 + (i % cols) * 24} cy={72 + Math.floor(i / cols) * 22} r={7} fill={TEAL} />)}
        <T x={160} y={148} t={`${rows} × ${cols} = ${rows * cols}`} s={17} fill={NAVY} />
      </g>;
    }
    case "fraction": case "halves": case "percent": {
      const d = theme === "halves" ? 2 : theme === "percent" ? 4 : 4, filled = theme === "halves" ? 1 : theme === "percent" ? 1 : 1;
      return <g>
        {pieSlices(120, 104, 42, d, filled)}
        <Frac x={210} y={100} n={filled} d={d} s={30} fill={NAVY} />
        {theme === "percent" && <T x={210} y={132} t="= 25%" s={12} fill={TEALD} w={700} />}
      </g>;
    }
    case "equivalent": {
      return <g>
        <rect x={30} y={54} width={104} height={92} rx={12} fill="#effcf6" stroke={TEALL} strokeWidth={1.5} />
        <circle cx={55} cy={70} r={9} fill={TEAL} /><T x={55} y={70} t="A" s={11} fill={W} />
        {pieSlices(72, 104, 24, 2, 1)}<Frac x={112} y={104} n={1} d={2} s={16} />
        <T x={160} y={100} t="<" s={20} fill={NAVY} />
        <rect x={186} y={54} width={104} height={92} rx={12} fill="#fff8ec" stroke="#ffdd8a" strokeWidth={1.5} />
        <circle cx={211} cy={70} r={9} fill={ACC} /><T x={211} y={70} t="B" s={11} fill={W} />
        {pieSlices(228, 104, 24, 3, 2, ACC)}<Frac x={268} y={104} n={2} d={3} s={16} />
      </g>;
    }
    case "ratio": {
      return <g>
        <rect x={40} y={82} width={240} height={40} rx={12} fill={SOFT} />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={66 + i * 22} cy={102} r={8} fill={TEAL} />)}
        <T x={160} y={102} t=":" s={20} fill={NAVY} />
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={176 + i * 17} cy={102} r={7} fill={ACC} />)}
        <T x={160} y={140} t="4 : 6 = 2 : 3" s={15} fill={NAVY} />
      </g>;
    }
    case "money": {
      return <g>
        <rect x={70} y={54} width={180} height={34} rx={9} fill={SOFT} />
        <T x={160} y={66} t="Make this amount" s={9} fill={INK} w={600} /><T x={160} y={79} t="47p" s={16} fill={NAVY} />
        {[["1", 62], ["2", 106], ["5", 150], ["10", 194], ["20", 238]].map(([t, x], i) => <g key={i}><circle cx={Number(x)} cy={120} r={16} fill={ACC2} stroke={ACC} strokeWidth={2} /><T x={Number(x)} y={120} t={`${t}p`} s={10} fill={NAVY} /></g>)}
      </g>;
    }
    case "clock": {
      const cx = 108, cy = 104, r = 44;
      return <g>
        <circle cx={cx} cy={cy} r={r} fill={W} stroke={NAVY} strokeWidth={2.5} />
        {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * 2 * Math.PI; return <circle key={i} cx={cx + (r - 6) * Math.sin(a)} cy={cy - (r - 6) * Math.cos(a)} r={1.5} fill={NAVY} />; })}
        <line x1={cx} y1={cy} x2={cx} y2={cy - 26} stroke={NAVY} strokeWidth={3} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={cx + 30} y2={cy} stroke={ACC} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={3} fill={NAVY} />
        <T x={228} y={96} t="3:00" s={26} fill={NAVY} />
        <T x={228} y={122} t="Three O'Clock" s={11} fill={TEALD} w={600} />
      </g>;
    }
    case "coordinate": {
      const gx = 66, gy = 60, cell = 17, n = 5;
      return <g>
        <rect x={gx - 6} y={gy - 6} width={n * cell + 12} height={n * cell + 12} rx={8} fill={SOFT} />
        {Array.from({ length: n + 1 }).map((_, i) => <g key={i}><line x1={gx + i * cell} y1={gy} x2={gx + i * cell} y2={gy + n * cell} stroke={LINE} strokeWidth={1} /><line x1={gx} y1={gy + i * cell} x2={gx + n * cell} y2={gy + i * cell} stroke={LINE} strokeWidth={1} /></g>)}
        <line x1={gx} y1={gy + n * cell} x2={gx + n * cell} y2={gy + n * cell} stroke={NAVY} strokeWidth={2} />
        <line x1={gx} y1={gy} x2={gx} y2={gy + n * cell} stroke={NAVY} strokeWidth={2} />
        <circle cx={gx + 3 * cell} cy={gy + n * cell - 2 * cell} r={5} fill={ACC} stroke={W} strokeWidth={1.5} />
        <T x={228} y={96} t="Plot points" s={12} fill={NAVY} w={700} />
        <T x={228} y={116} t="(3, 2)" s={15} fill={TEALD} />
      </g>;
    }
    case "spinner": {
      const cx = 118, cy = 104, r = 46, cols = [TEAL, ACC, PURPLE, "#ef4444"];
      return <g>
        {Array.from({ length: 4 }).map((_, i) => { const a0 = (i / 4) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / 4) * 2 * Math.PI - Math.PI / 2; const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={cols[i]} stroke={W} strokeWidth={2} />; })}
        <line x1={cx} y1={cy} x2={cx + 30} y2={cy - 20} stroke={NAVY} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill={NAVY} />
        <T x={230} y={96} t="Spin!" s={15} fill={NAVY} />
        <T x={230} y={118} t="Chance" s={11} fill={TEALD} w={600} />
      </g>;
    }
    case "symmetry": {
      const gx = 96, gy = 58, cell = 15, n = 6; const on = [[0, 1], [1, 0], [1, 2], [2, 1], [3, 0], [4, 2]];
      return <g>
        {Array.from({ length: n }).map((_, ry) => Array.from({ length: 3 }).map((_, cxi) => { const filled = on.some(([a, b]) => a === ry && b === cxi); return <rect key={`${ry}-${cxi}`} x={gx + cxi * cell} y={gy + ry * cell} width={cell - 1.5} height={cell - 1.5} rx={2} fill={filled ? TEAL : W} stroke={LINE} strokeWidth={1} />; }))}
        <line x1={gx + 3 * cell + 4} y1={gy - 4} x2={gx + 3 * cell + 4} y2={gy + n * cell + 2} stroke={ACC} strokeWidth={2.5} />
        {Array.from({ length: n }).map((_, ry) => Array.from({ length: 3 }).map((_, cxi) => <rect key={`r-${ry}-${cxi}`} x={gx + 3 * cell + 9 + cxi * cell} y={gy + ry * cell} width={cell - 1.5} height={cell - 1.5} rx={2} fill={W} stroke={LINE} strokeWidth={1} strokeDasharray="2 2" />))}
      </g>;
    }
    case "shape": {
      const names = [["Circle", 78, 62], ["Square", 158, 62], ["Triangle", 244, 62], ["Oval", 88, 100], ["Pentagon", 172, 100], ["Rectangle", 258, 100]];
      return <g>
        {names.map(([t, x, y], i) => { const w = String(t).length * 6.4 + 18; return <g key={i}><rect x={Number(x) - w / 2} y={Number(y) - 12} width={w} height={24} rx={12} fill="#f5f0ff" stroke="#ddd0f7" strokeWidth={1.3} /><T x={Number(x)} y={Number(y)} t={String(t)} s={10} fill={PURPLE} w={700} /></g>; })}
        <T x={160} y={140} t="Sort by curved · straight" s={10} fill={INK} w={600} />
      </g>;
    }
    case "pattern": {
      const machine = r.cover === "patternmachine";
      const shape = (x: number, y: number, kind: number) => machine
        ? (kind === 0 ? <circle cx={x} cy={y} r={13} fill={[TEAL, ACC, PURPLE][0]} /> : kind === 1 ? <rect x={x - 12} y={y - 12} width={24} height={24} rx={4} fill={TEAL} /> : <path d={`M${x} ${y - 13} L${x + 13} ${y + 11} L${x - 13} ${y + 11} Z`} fill={TEAL} />)
        : <circle cx={x} cy={y} r={13} fill={[TEAL, ACC][kind % 2]} />;
      const seq = machine ? [0, 1, 2, 0, 1, 2] : [0, 1, 0, 1];
      return <g>
        <rect x={26} y={80} width={268} height={48} rx={10} fill={SOFT} />
        {seq.map((k, i) => <g key={i} transform={`translate(${52 + i * 34} ${104})`}>{shape(0, 0, k)}</g>)}
        {[0, 1].map((i) => <rect key={i} x={52 + (seq.length + i) * 34 - 13} y={91} width={26} height={26} rx={5} fill="none" stroke="#98a8c6" strokeWidth={1.5} strokeDasharray="4 3" />)}
      </g>;
    }
    case "bar": case "pictogram": case "stats": {
      const bars = [3, 5, 2, 6], cols = ["A", "B", "C", "D"];
      return <g>
        <line x1={54} y1={150} x2={266} y2={150} stroke="#98a8c6" strokeWidth={1.5} />
        {bars.map((v, i) => { const cx = 80 + i * 54; return <g key={i}>
          {Array.from({ length: v }).map((_, j) => <rect key={j} x={cx - 16} y={146 - j * 15} width={32} height={13} rx={2.5} fill={TEAL} stroke={W} strokeWidth={1} />)}
          <T x={cx} y={162} t={cols[i]} s={10} fill={INK} w={700} />
        </g>; })}
      </g>;
    }
    case "angle": {
      const ox = 150, oy = 118, len = 80;
      const ax = ox - Math.cos(Math.PI / 3.4) * len, ay = oy - Math.sin(Math.PI / 3.4) * len;
      return <g>
        <line x1={ox - 110} y1={oy} x2={ox + 110} y2={oy} stroke={NAVY} strokeWidth={2.5} />
        <line x1={ox} y1={oy} x2={ax} y2={ay} stroke={ACC} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={ax} cy={ay} r={5} fill={ACC} />
        <path d={`M${ox - 26} ${oy} A26 26 0 0 1 ${ox - 26 * Math.cos(Math.PI / 3.4)} ${oy - 26 * Math.sin(Math.PI / 3.4)}`} fill="none" stroke={TEAL} strokeWidth={2} />
        <T x={ox - 40} y={oy - 12} t="120°" s={11} fill={TEALD} w={700} />
        <T x={ox + 34} y={oy - 12} t="60°" s={11} fill={TEALD} w={700} />
        <T x={160} y={152} t="120° + 60° = 180°" s={13} fill={NAVY} />
      </g>;
    }
    case "orderops": {
      const opts = ["2 + 3 × 4", "(2 + 3) × 4", "2 + (3 × 4)"];
      return <g>
        {opts.map((t, i) => { const x = 30 + i * 90; return <rect key={`b${i}`} x={x} y={58} width={82} height={26} rx={8} fill={i === 0 ? "#effcf6" : W} stroke={i === 0 ? TEAL : CARD} strokeWidth={1.5} />; })}
        {opts.map((t, i) => <T key={`t${i}`} x={71 + i * 90} y={71} t={t} s={10} fill={NAVY} />)}
        <rect x={40} y={98} width={240} height={44} rx={10} fill={SOFT} />
        <T x={160} y={121} t="2 + 3 × 4 = 14" s={19} fill={NAVY} />
      </g>;
    }
    case "hundredsquare": {
      const gx = 100, gy = 46, cell = 12, n = 10;
      return <g>
        {Array.from({ length: n * n }).map((_, i) => { const c = i % n, row = Math.floor(i / n); const val = i + 1; const hl = val % 5 === 0; return <rect key={i} x={gx + c * cell} y={gy + row * cell} width={cell - 1} height={cell - 1} rx={1.5} fill={hl ? TEAL : W} stroke={LINE} strokeWidth={0.8} />; })}
        <T x={160} y={172} t="Multiples of 5" s={11} fill={TEALD} w={600} />
      </g>;
    }
    default: {
      const cw = 22, gap = 4, cols = 5, sx = 160 - (cols * cw + (cols - 1) * gap) / 2, sy = 72;
      return <g>{Array.from({ length: 10 }).map((_, i) => { const col = i % 5, row = Math.floor(i / 5); const x = sx + col * (cw + gap), y = sy + row * (cw + gap); return <rect key={i} x={x} y={y} width={cw} height={cw} rx={5} fill={W} stroke={LINE} strokeWidth={1.5} />; })}</g>;
    }
  }
}

export function SimCover({ resource, className }: { resource: Resource; className?: string }) {
  const theme = themeFor(resource);
  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect x={0} y={0} width={320} height={180} fill={W} />
        <rect x={4} y={4} width={312} height={172} rx={12} fill="none" stroke={LINE} strokeWidth={1} />
        <Chrome />
        {scene(theme, resource)}
      </svg>
    </div>
  );
}
