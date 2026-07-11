import { cn } from "@/lib/utils";
import type { Resource } from "@/types";

// ==========================================================
// GameCover — the library thumbnail for a game mirrors its real
// play screen: a navy HUD bar (instruction + star score + hearts)
// over a sky play area showing the genre's signature visuals, so
// the preview looks like the game page it opens.
// ==========================================================

const NAVY = "#1b2540", SKY0 = "#e8f3ff", SKY1 = "#ffffff";
const TEAL = "#14b8a6", ORANGE = "#f59e0b", ACC = "#ffb420", ACC2 = "#ffdd8a";
const INDIGO = "#6366f1", ROSE = "#f43f5e", GRN = "#22c55e", RED = "#ef4444", W = "#ffffff", LINE = "#cbd5e1", CARD = "#dbe4f0";
const FONT = "var(--font-display), Poppins, system-ui, sans-serif";

function T({ x, y, t, s = 13, fill = W, w = 800, anchor = "middle" as const }: { x: number; y: number; t: string; s?: number; fill?: string; w?: number; anchor?: "start" | "middle" | "end" }) {
  return <text x={x} y={y} fontSize={s} fontWeight={w} fill={fill} textAnchor={anchor} dominantBaseline="central" fontFamily={FONT}>{t}</text>;
}
function Frac({ x, y, n, d, s = 15, fill = W }: { x: number; y: number; n: string | number; d: string | number; s?: number; fill?: string }) {
  const w = Math.max(String(n).length, String(d).length) * s * 0.42 + 3;
  return <g>
    <T x={x} y={y - s * 0.46} t={String(n)} s={s} fill={fill} />
    <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={fill} strokeWidth={Math.max(1.5, s * 0.09)} strokeLinecap="round" />
    <T x={x} y={y + s * 0.52} t={String(d)} s={s} fill={fill} />
  </g>;
}
const star = (x: number, y: number, s: number, fill: string) => <path transform={`translate(${x} ${y}) scale(${s / 9})`} d="M0 -9 L2.6 -2.8 L9 -2.8 L3.9 1.1 L5.6 7.3 L0 3.6 L-5.6 7.3 L-3.9 1.1 L-9 -2.8 L-2.6 -2.8 Z" fill={fill} />;
const heart = (x: number, y: number, s: number, fill: string) => <path transform={`translate(${x} ${y}) scale(${s / 14})`} d="M0 3 C -2 -3 -9 -1 -9 4 C -9 9 -2 12 0 14 C 2 12 9 9 9 4 C 9 -1 2 -3 0 3 Z" fill={fill} />;

// navy HUD strip that every game engine shows across the top
function Hud({ text }: { text: React.ReactNode }) {
  return <g>
    <rect x={0} y={0} width={320} height={30} fill={NAVY} />
    <text x={12} y={16} fontSize={12.5} fontWeight={700} fill={W} fontFamily={FONT} dominantBaseline="central">{text}</text>
    <rect x={226} y={8} width={38} height={15} rx={7.5} fill={W} fillOpacity={0.16} />
    {star(235, 15.5, 5.5, ACC)}
    <T x={251} y={16} t="5" s={11} />
    {[0, 1, 2].map((i) => heart(278 + i * 14, 15, 9, ROSE))}
  </g>;
}

const dots = (n: number, cx: number, cy: number, color = ROSE, r = 3.4) => {
  const cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols), gap = 9;
  const x0 = cx - ((cols - 1) * gap) / 2, y0 = cy - ((rows - 1) * gap) / 2;
  return Array.from({ length: n }).map((_, i) => <circle key={i} cx={x0 + (i % cols) * gap} cy={y0 + Math.floor(i / cols) * gap} r={r} fill={color} />);
};
const basket = (cx: number, y: number, hl: boolean) => <g>
  {hl && <path d={`M${cx - 21} ${y - 3} L${cx + 21} ${y - 3} L${cx + 15} ${y + 19} L${cx - 15} ${y + 19} Z`} fill="none" stroke={ACC2} strokeWidth={4} />}
  <path d={`M${cx - 18} ${y} L${cx + 18} ${y} L${cx + 13} ${y + 17} L${cx - 13} ${y + 17} Z`} fill={hl ? ACC : "#c9d3e6"} stroke={hl ? ORANGE : "#aab6cf"} strokeWidth={1.5} />
  {[-9, 0, 9].map((o) => <line key={o} x1={cx + o * 0.85} y1={y + 1} x2={cx + o * 0.6} y2={y + 16} stroke="#9aa7c2" strokeWidth={1} />)}
</g>;
const block = (x: number, y: number, s: number, fill: string) => <rect x={x} y={y} width={s} height={s} rx={s * 0.16} fill={fill} stroke={W} strokeWidth={1.2} />;
const pill = (x: number, y: number, w: number, h: number, fill: string, t: string, tf = W) => <g><rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} /><T x={x + w / 2} y={y + h / 2 + 0.5} t={t} s={h * 0.5} fill={tf} /></g>;

// ---- per-game play-screen mock (drawn below the HUD, y 30–180) ----
function scene(id: string): React.ReactNode {
  switch (id) {
    // Catcher family — 3 lanes, baskets, middle highlighted
    case "res-counting-objects":
    case "res-compare-quantities":
    case "res-number-hunt": {
      const numeric = id === "res-number-hunt";
      const vals: (number | string)[] = numeric ? [7, 12, 5] : id === "res-compare-quantities" ? [2, 6, 4] : [3, 5, 2];
      const hl = 1;
      const cxs = [53, 160, 267];
      return <g>
        {[107, 213].map((x) => <line key={x} x1={x} y1={30} x2={x} y2={180} stroke={LINE} strokeWidth={1} strokeOpacity={0.7} />)}
        {cxs.map((cx, i) => <g key={i}>
          <rect x={cx - 30} y={48} width={60} height={44} rx={9} fill={W} stroke={CARD} strokeWidth={2} />
          {numeric ? <T x={cx} y={70} t={String(vals[i])} s={24} fill={NAVY} /> : dots(vals[i] as number, cx, 70, i === 1 ? TEAL : ROSE)}
          {basket(cx, 150, i === hl)}
        </g>)}
      </g>;
    }
    // Memory match — grid of cards, some face up
    case "res-number-matching": {
      const cxs = [52, 118, 184, 250];
      const faces: Array<null | { kind: "num" | "dot"; n: number }> = [{ kind: "num", n: 3 }, null, { kind: "dot", n: 4 }, null, null, { kind: "num", n: 4 }, null, { kind: "dot", n: 3 }];
      return <g>
        {faces.map((f, i) => {
          const cx = cxs[i % 4], cy = i < 4 ? 66 : 128;
          const up = !!f;
          return <g key={i}>
            <rect x={cx - 26} y={cy - 24} width={52} height={48} rx={8} fill={up ? W : "#31415f"} stroke={up ? TEAL : NAVY} strokeWidth={2} />
            {up ? (f!.kind === "num" ? <T x={cx} y={cy} t={String(f!.n)} s={22} fill={NAVY} /> : dots(f!.n, cx, cy, TEAL)) : <T x={cx} y={cy} t="?" s={20} fill={W} />}
          </g>;
        })}
      </g>;
    }
    // Shape shooter — scattered shapes, crosshair on a star
    case "res-shape-detective": {
      const sh = [
        <circle key="a" cx={60} cy={70} r={15} fill={TEAL} />,
        <rect key="b" x={116} y={54} width={30} height={30} rx={4} fill={ORANGE} />,
        <path key="c" d="M215 52 L233 84 L197 84 Z" fill={INDIGO} />,
        <circle key="d" cx={270} cy={120} r={14} fill={GRN} />,
        <rect key="e" x={88} y={118} width={26} height={26} rx={4} fill={ROSE} />,
      ];
      return <g>
        {sh}
        {star(165, 128, 17, ACC)}
        <g stroke={RED} strokeWidth={2.2} fill="none"><circle cx={165} cy={128} r={22} /><line x1={165} y1={100} x2={165} y2={110} /><line x1={165} y1={146} x2={165} y2={156} /><line x1={143} y1={128} x2={153} y2={128} /><line x1={177} y1={128} x2={187} y2={128} /></g>
      </g>;
    }
    // Pattern conveyor — belt of blocks then ? then tray
    case "res-pattern-builder": {
      const belt = [TEAL, ORANGE, INDIGO, TEAL, ORANGE, INDIGO];
      return <g>
        <rect x={26} y={54} width={268} height={40} rx={8} fill="#2b3852" />
        {belt.map((c, i) => <g key={i}>{block(38 + i * 34, 62, 24, c)}</g>)}
        <rect x={38 + 6 * 34} y={62} width={24} height={24} rx={4} fill="none" stroke={W} strokeWidth={2} strokeDasharray="4 3" />
        <T x={50 + 6 * 34} y={74} t="?" s={16} />
        <T x={160} y={118} t="Tap the next piece" s={12} fill={NAVY} w={600} />
        {[TEAL, ORANGE, INDIGO].map((c, i) => <g key={i}>{block(118 + i * 32, 134, 28, c)}</g>)}
      </g>;
    }
    // Tug of war — rope + flag + number tokens + total
    case "res-addition-race":
      return <g>
        <rect x={26} y={46} width={268} height={26} rx={13} fill="#c6f7e2" />
        <line x1={160} y1={46} x2={160} y2={72} stroke="#98a8c6" strokeWidth={2} />
        <circle cx={122} cy={59} r={11} fill={NAVY} /><T x={122} y={59} t="⚑" s={11} />
        <circle cx={40} cy={59} r={8} fill={TEAL} /><circle cx={280} cy={59} r={8} fill={RED} />
        <T x={160} y={96} t="7 / 12" s={17} fill={NAVY} />
        {[1, 2, 3, 4, 5, 6].map((v, i) => <g key={v}>{block(70 + i * 30, 118, 24, TEAL)}<T x={82 + i * 30} y={130} t={String(v)} s={13} /></g>)}
      </g>;
    // Number-line hop — frog on a line back to 0
    case "res-subtraction-adventure":
      return <g>
        <line x1={36} y1={92} x2={296} y2={92} stroke="#98a8c6" strokeWidth={2} />
        {Array.from({ length: 11 }).map((_, i) => { const x = 36 + i * 26; return <g key={i}><line x1={x} y1={86} x2={x} y2={98} stroke="#98a8c6" strokeWidth={1.5} />{i % 5 === 0 && <T x={x} y={108} t={String(i * 2)} s={9} fill={NAVY} w={700} />}</g>; })}
        <T x={44} y={78} t="🏠" s={15} />
        <circle cx={192} cy={78} r={11} fill={GRN} stroke={W} strokeWidth={1.5} /><circle cx={188} cy={75} r={2} fill={NAVY} /><circle cx={196} cy={75} r={2} fill={NAVY} />
        {[["−1", 86], ["−2", 128], ["−5", 170], ["−10", 212]].map(([t, x], i) => <g key={i}>{pill(Number(x), 132, 34, 18, GRN, String(t))}</g>)}
      </g>;
    // Place-value stacker — big number + H/T/O columns + rocket
    case "res-place-value-builder": {
      const cols: Array<[string, number, string]> = [["H", 3, NAVY], ["T", 4, TEAL], ["O", 8, ORANGE]];
      return <g>
        <T x={135} y={52} t="348" s={26} fill={NAVY} />
        <T x={210} y={50} t="🚀" s={20} />
        {cols.map(([label, n, c], ci) => { const cx = 96 + ci * 52; return <g key={label}>
          <rect x={cx - 15} y={72} width={30} height={70} rx={5} fill="#eef1f7" />
          {Array.from({ length: n }).map((_, i) => <rect key={i} x={cx - 12} y={136 - i * 9} width={24} height={7} rx={1.5} fill={c} />)}
          <T x={cx} y={155} t={label} s={11} fill={NAVY} w={700} />
        </g>; })}
      </g>;
    }
    // Array defence — invaders grid + your array + fire
    case "res-times-table-challenge":
      return <g>
        <rect x={96} y={40} width={128} height={54} rx={8} fill="#2b3852" />
        {Array.from({ length: 15 }).map((_, i) => <circle key={i} cx={112 + (i % 5) * 24} cy={54 + Math.floor(i / 5) * 18} r={5.5} fill={GRN} />)}
        <T x={160} y={110} t="3 × 5 = 15" s={14} fill={NAVY} />
        <g>{Array.from({ length: 15 }).map((_, i) => <rect key={i} x={120 + (i % 5) * 11} y={122 + Math.floor(i / 5) * 11} width={8} height={8} rx={1.5} fill={TEAL} />)}</g>
        {pill(232, 128, 50, 20, RED, "🔥 Fire")}
      </g>;
    // Pizza fractions — sliced pizza, some slices topped
    case "res-fraction-pizza": {
      const d = 8, filled = 3, cx = 120, cy = 104, r = 50;
      return <g>
        <circle cx={cx} cy={cy} r={r + 4} fill="#f8d99a" />
        {Array.from({ length: d }).map((_, i) => { const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2; const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={i < filled ? "#e8b04b" : "#ffe9c2"} stroke="#c98a2e" strokeWidth={1.5} />; })}
        {Array.from({ length: filled }).map((_, i) => { const a = ((i + 0.5) / d) * 2 * Math.PI - Math.PI / 2; return <circle key={i} cx={cx + 26 * Math.cos(a)} cy={cy + 26 * Math.sin(a)} r={4} fill="#c0392b" />; })}
        <T x={228} y={92} t="Order" s={12} fill={NAVY} w={600} />
        <Frac x={228} y={116} n={3} d={8} s={26} fill={NAVY} />
      </g>;
    }
    // Coin shop — price tag + coins + sell
    case "res-money-shop":
      return <g>
        <rect x={116} y={44} width={88} height={34} rx={8} fill={W} stroke={CARD} strokeWidth={2} />
        <T x={160} y={57} t="Price" s={9} fill="#6a80a9" w={600} /><T x={160} y={69} t="24p" s={17} fill={NAVY} />
        {[["1", 52], ["2", 100], ["5", 148], ["10", 196], ["20", 244]].map(([t, x], i) => <g key={i}><circle cx={Number(x)} cy={112} r={16} fill={ACC} stroke={ORANGE} strokeWidth={2} /><T x={Number(x)} y={112} t={`${t}p`} s={11} fill={NAVY} /></g>)}
        {pill(135, 140, 50, 18, TEAL, "Sell")}
      </g>;
    // Data sort — bar chart of fruit + one on the conveyor
    case "res-data-graph-challenge": {
      const bars: Array<[string, number, string]> = [["🍎", 4, RED], ["🍌", 2, ACC], ["🍇", 3, INDIGO]];
      return <g>
        <T x={252} y={52} t="🍌" s={22} />
        <line x1={40} y1={150} x2={260} y2={150} stroke="#98a8c6" strokeWidth={1.5} />
        {bars.map(([e, n, c], i) => { const cx = 78 + i * 62; return <g key={i}>
          {Array.from({ length: n }).map((_, j) => <rect key={j} x={cx - 18} y={146 - j * 22} width={36} height={19} rx={3} fill={c} stroke={W} strokeWidth={1} />)}
          <T x={cx} y={166} t={e} s={13} />
        </g>; })}
      </g>;
    }
    // Maze quest — grid with player, coins 1-2-3, flag
    case "res-problem-solving-mission": {
      const grid = ["#######", "#P..1.#", "#.#.#.#", "#.2.#3#", "#.###.#", "#....F#", "#######"];
      const cell = 20, ox = 160 - (7 * cell) / 2, oy = 34;
      return <g>
        {grid.flatMap((row, y) => row.split("").map((c, x) => {
          const gx = ox + x * cell, gy = oy + y * cell;
          const wall = c === "#";
          return <g key={`${x}-${y}`}>
            <rect x={gx} y={gy} width={cell - 1.5} height={cell - 1.5} rx={2} fill={wall ? "#3a4e75" : "#eaf4ff"} />
            {c === "P" && <T x={gx + cell / 2} y={gy + cell / 2} t="🧑‍🚀" s={13} />}
            {c === "F" && <T x={gx + cell / 2} y={gy + cell / 2} t="🏁" s={12} />}
            {"123".includes(c) && <g><circle cx={gx + cell / 2 - 0.7} cy={gy + cell / 2} r={7} fill={ACC} /><T x={gx + cell / 2 - 0.7} y={gy + cell / 2} t={c} s={9} fill={NAVY} /></g>}
          </g>;
        }))}
      </g>;
    }
    // ---- multiplayer split-screen covers (2×2 zones + topic icon) ----
    case "res-mp-fill-it-up":
    case "res-mp-stop-length":
    case "res-mp-probability-arena":
    case "res-mp-data-duel":
      return mpScene(id);
    default:
      return <g>{dots(5, 160, 100, TEAL)}</g>;
  }
}

const PCOL = [TEAL, ROSE, ORANGE, INDIGO];
function mpScene(id: string): React.ReactNode {
  const zones = [[6, 34], [162, 34], [6, 108], [162, 108]] as const; // x,y of 4 quadrants
  const zw = 152, zh = 66;
  const icon = (kind: string, cx: number, cy: number, col: string) => {
    if (kind === "cap") return <g><rect x={cx - 9} y={cy - 14} width={18} height={26} rx={3} fill="#eef6ff" stroke={col} strokeWidth={2} /><rect x={cx - 8} y={cy - 2} width={16} height={13} rx={2} fill={col} opacity={0.85} /><line x1={cx - 9} y1={cy} x2={cx - 4} y2={cy} stroke={col} strokeWidth={1.5} /></g>;
    if (kind === "len") return <g><rect x={cx - 26} y={cy + 2} width={52} height={8} rx={2} fill="#fff5e0" stroke={col} strokeWidth={1} />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={cx - 26 + i * 13} y1={cy + 2} x2={cx - 26 + i * 13} y2={cy + 6} stroke={col} strokeWidth={1} />)}<rect x={cx - 26} y={cy - 6} width={30} height={7} rx={2} fill={col} /></g>;
    if (kind === "prob") return <g>{[0, 1, 2, 3].map((i) => { const a0 = (i / 4) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / 4) * 2 * Math.PI - Math.PI / 2, r = 15; return <path key={i} d={`M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`} fill={PCOL[i]} stroke="#fff" strokeWidth={1.5} />; })}<circle cx={cx} cy={cy} r={3} fill={NAVY} /></g>;
    return <g>{[10, 18, 8].map((h, i) => <rect key={i} x={cx - 18 + i * 13} y={cy + 12 - h} width={9} height={h} rx={1.5} fill={col} />)}</g>;
  };
  const kind = id === "res-mp-fill-it-up" ? "cap" : id === "res-mp-stop-length" ? "len" : id === "res-mp-probability-arena" ? "prob" : "data";
  return <g>
    {zones.map(([x, y], i) => <g key={i}>
      <rect x={x} y={y} width={zw} height={zh} rx={8} fill={i % 2 === 0 ? "#f6f9ff" : "#fff"} stroke={PCOL[i]} strokeWidth={2.5} />
      <circle cx={x + 12} cy={y + 12} r={7} fill={PCOL[i]} /><T x={x + 12} y={y + 12} t={`${i + 1}`} s={9} />
      {icon(kind, x + zw / 2 + 6, y + zh / 2 + 2, PCOL[i])}
    </g>)}
  </g>;
}

const PROMPT: Record<string, React.ReactNode> = {
  "res-counting-objects": "Catch exactly 5",
  "res-compare-quantities": "Catch the MOST",
  "res-number-hunt": "Catch the 12",
  "res-number-matching": "Match the pairs",
  "res-shape-detective": "Blast the stars",
  "res-pattern-builder": "What comes next?",
  "res-addition-race": "Make 12 to pull",
  "res-subtraction-adventure": "Hop back to 0",
  "res-place-value-builder": "Build 348",
  "res-times-table-challenge": "Match & fire!",
  "res-fraction-pizza": "Serve the order",
  "res-money-shop": "Pay exactly 24p",
  "res-data-graph-challenge": "Sort the fruit",
  "res-problem-solving-mission": "Reach the flag",
  "res-mp-fill-it-up": "Fill It Up · 2–4 players",
  "res-mp-stop-length": "Ruler Race · 2–4 players",
  "res-mp-probability-arena": "Predict & Spin · 2–4 players",
  "res-mp-data-duel": "Data Duel · 2–4 players",
};

export function GameCover({ resource, className }: { resource: Resource; className?: string }) {
  const id = resource.id;
  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`gcsky-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY0} /><stop offset="1" stopColor={SKY1} />
          </linearGradient>
        </defs>
        <rect x={0} y={30} width={320} height={150} fill={`url(#gcsky-${id})`} />
        {scene(id)}
        <Hud text={PROMPT[id] ?? "Play!"} />
      </svg>
    </div>
  );
}
