import React from "react";

// ==========================================================
// richArt — warmer, more detailed picture-book SVG illustration
// (gradient shading, expressive faces, layered scenes). Offline /
// CSP-safe. Authored in a 320×220 viewBox. Each character takes a
// unique `k` so its gradient ids don't collide within one scene.
// ==========================================================

const INK = "#3a2a2a";

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const lighten = (h: string, a = 0.28) => shade(h, a);
const darken = (h: string, a = 0.22) => shade(h, -a);

export type Expr = "happy" | "excited" | "surprised" | "shy" | "sleepy" | "worried";
export type Hair = "afro" | "bun" | "short" | "pony" | "curls" | "wavy";

// ---- expressive face drawn around local origin (head radius r) ----
function Face({ r, expr, k, look = 0 }: { r: number; expr: Expr; k: string; look?: number }) {
  const ey = -r * 0.05, edx = r * 0.4, er = r * 0.2;
  const eye = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={ey} rx={er} ry={expr === "sleepy" ? er * 0.35 : er * 1.05} fill="#fff" />
      {expr !== "sleepy" && <>
        <circle cx={cx + look * er * 0.4} cy={ey + er * 0.2} r={er * 0.62} fill="#4a2c1a" />
        <circle cx={cx + look * er * 0.4} cy={ey + er * 0.2} r={er * 0.28} fill={INK} />
        <circle cx={cx + look * er * 0.4 - er * 0.22} cy={ey - er * 0.15} r={er * 0.22} fill="#fff" />
      </>}
      {expr === "sleepy" && <path d={`M${cx - er} ${ey} q${er} ${er * 0.8} ${er * 2} 0`} fill="none" stroke={INK} strokeWidth={r * 0.06} strokeLinecap="round" />}
      <path d={`M${cx - er * 1.1} ${ey - er * 1.15} q${er} ${expr === "surprised" || expr === "worried" ? -er * 1.1 : -er * 0.5} ${er * 2.2} 0`} fill="none" stroke={darken("#3a2a2a", 0)} strokeWidth={r * 0.07} strokeLinecap="round" />
    </g>
  );
  const mouth = () => {
    switch (expr) {
      case "excited": return <g><path d={`M${-r * 0.32} ${r * 0.42} q${r * 0.32} ${r * 0.5} ${r * 0.64} 0 Z`} fill="#8a2b3a" /><path d={`M${-r * 0.24} ${r * 0.43} h${r * 0.48}`} stroke="#fff" strokeWidth={r * 0.12} strokeLinecap="round" /></g>;
      case "surprised": return <ellipse cx={0} cy={r * 0.5} rx={r * 0.2} ry={r * 0.26} fill="#8a2b3a" />;
      case "shy": return <path d={`M${-r * 0.16} ${r * 0.5} q${r * 0.16} ${r * 0.22} ${r * 0.32} 0`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />;
      case "worried": return <path d={`M${-r * 0.24} ${r * 0.56} q${r * 0.24} ${-r * 0.28} ${r * 0.48} 0`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />;
      case "sleepy": return <path d={`M${-r * 0.14} ${r * 0.5} q${r * 0.14} ${r * 0.18} ${r * 0.28} 0`} fill="none" stroke={INK} strokeWidth={r * 0.07} strokeLinecap="round" />;
      default: return <path d={`M${-r * 0.28} ${r * 0.44} q${r * 0.28} ${r * 0.42} ${r * 0.56} 0`} fill="none" stroke={INK} strokeWidth={r * 0.09} strokeLinecap="round" />;
    }
  };
  return <g>
    {eye(-edx)}{eye(edx)}
    <path d={`M${-r * 0.05} ${r * 0.12} q${r * 0.12} ${r * 0.1} 0 ${r * 0.2}`} fill="none" stroke={INK} strokeWidth={r * 0.05} strokeLinecap="round" opacity={0.5} />
    <circle cx={-edx - er * 0.9} cy={r * 0.34} r={er * 0.95} fill={`url(#blush${k})`} />
    <circle cx={edx + er * 0.9} cy={r * 0.34} r={er * 0.95} fill={`url(#blush${k})`} />
    {mouth()}
  </g>;
}

function hairShape(style: Hair, r: number, hair: string) {
  const hi = lighten(hair, 0.22);
  switch (style) {
    case "afro": return <g><circle cx={0} cy={-r * 0.7} r={r * 1.15} fill={hair} /><circle cx={-r * 0.75} cy={-r * 0.2} r={r * 0.62} fill={hair} /><circle cx={r * 0.75} cy={-r * 0.2} r={r * 0.62} fill={hair} /><circle cx={-r * 0.5} cy={-r * 1.1} r={r * 0.5} fill={hi} opacity={0.5} /><circle cx={r * 0.3} cy={-r * 1.2} r={r * 0.4} fill={hi} opacity={0.4} /></g>;
    case "bun": return <g><circle cx={0} cy={-r * 1.25} r={r * 0.5} fill={hair} /><path d={`M${-r} ${-r * 0.2} Q${-r * 1.05} ${-r * 1.15} 0 ${-r * 1.2} Q${r * 1.05} ${-r * 1.15} ${r} ${-r * 0.2} Q${r * 0.6} ${-r * 0.75} 0 ${-r * 0.72} Q${-r * 0.6} ${-r * 0.75} ${-r} ${-r * 0.2} Z`} fill={hair} /><ellipse cx={-r * 0.3} cy={-r * 1.05} rx={r * 0.35} ry={r * 0.18} fill={hi} opacity={0.5} /></g>;
    case "short": return <g><path d={`M${-r * 1.02} ${-r * 0.1} Q${-r * 1.1} ${-r * 1.15} 0 ${-r * 1.12} Q${r * 1.1} ${-r * 1.15} ${r * 1.02} ${-r * 0.1} Q${r * 0.5} ${-r * 0.6} ${r * 0.1} ${-r * 0.55} Q${-r * 0.5} ${-r * 0.7} ${-r * 1.02} ${-r * 0.1} Z`} fill={hair} /><path d={`M${-r * 0.6} ${-r} q${r * 0.5} ${-r * 0.3} ${r} 0`} stroke={hi} strokeWidth={r * 0.14} fill="none" strokeLinecap="round" opacity={0.5} /></g>;
    case "pony": return <g><path d={`M${r * 0.7} ${-r * 0.5} Q${r * 1.5} ${-r * 0.3} ${r * 1.2} ${r * 0.6} Q${r * 1.05} ${r * 0.1} ${r * 0.6} ${r * 0.1} Z`} fill={hair} /><path d={`M${-r} ${-r * 0.2} Q${-r * 1.05} ${-r * 1.15} 0 ${-r * 1.15} Q${r * 1.05} ${-r * 1.15} ${r} ${-r * 0.2} Q${r * 0.6} ${-r * 0.72} 0 ${-r * 0.7} Q${-r * 0.6} ${-r * 0.72} ${-r} ${-r * 0.2} Z`} fill={hair} /></g>;
    case "curls": return <g>{[-1, -0.5, 0, 0.5, 1].map((o, i) => <circle key={i} cx={o * r * 0.8} cy={-r * 0.95 - Math.abs(o) * r * 0.1} r={r * 0.42} fill={hair} />)}<path d={`M${-r} ${-r * 0.1} Q${-r} ${-r} 0 ${-r} Q${r} ${-r} ${r} ${-r * 0.1}`} fill={hair} /></g>;
    default: return <g><path d={`M${-r * 1.02} ${r * 0.2} Q${-r * 1.1} ${-r * 1.15} 0 ${-r * 1.12} Q${r * 1.1} ${-r * 1.15} ${r * 1.02} ${r * 0.2} Q${r * 0.7} ${-r * 0.3} ${r * 0.55} ${r * 0.1} Q${r * 0.3} ${-r * 0.4} 0 ${-r * 0.55} Q${-r * 0.3} ${-r * 0.4} ${-r * 0.55} ${r * 0.1} Q${-r * 0.7} ${-r * 0.3} ${-r * 1.02} ${r * 0.2} Z`} fill={hair} /></g>;
  }
}

export function RichKid({ x = 0, y = 0, s = 1, k = "0", skin = "#c68642", hair = "#2a1a12", hairStyle = "short", shirt = "#e07aa0", expr = "happy", look = 0, arm = "down", flip = false }: {
  x?: number; y?: number; s?: number; k?: string; skin?: string; hair?: string; hairStyle?: Hair; shirt?: string; expr?: Expr; look?: number; arm?: "down" | "up" | "wave"; flip?: boolean;
}) {
  const hr = 21; // head radius
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (flip ? -1 : 1)}, ${s})`}>
      <defs>
        <radialGradient id={`blush${k}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff7fa0" stopOpacity="0.75" /><stop offset="100%" stopColor="#ff7fa0" stopOpacity="0" /></radialGradient>
        <linearGradient id={`skin${k}`} x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor={lighten(skin, 0.18)} /><stop offset="1" stopColor={darken(skin, 0.12)} /></linearGradient>
        <linearGradient id={`shirt${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lighten(shirt, 0.2)} /><stop offset="1" stopColor={darken(shirt, 0.18)} /></linearGradient>
      </defs>
      {/* soft ground shadow */}
      <ellipse cx={0} cy={56} rx={24} ry={5.5} fill="#3a2a2a" opacity={0.13} />
      {/* legs */}
      <rect x={-11} y={34} width={9.5} height={22} rx={4.5} fill={darken("#5a4a7a", 0)} /><rect x={1.5} y={34} width={9.5} height={22} rx={4.5} fill="#5a4a7a" />
      <ellipse cx={-6.2} cy={57} rx={7} ry={4} fill={INK} /><ellipse cx={6.2} cy={57} rx={7} ry={4} fill={INK} />
      {/* torso */}
      <path d="M-17 20 Q-19 41 -12 41 L12 41 Q19 41 17 20 Q15 7 0 7 Q-15 7 -17 20 Z" fill={`url(#shirt${k})`} />
      <path d="M-6 9 Q0 15 6 9" fill="none" stroke={darken(shirt, 0.25)} strokeWidth={1.4} opacity={0.6} />
      <path d="M-11 34 Q-4 30 3 33" fill="none" stroke={darken(shirt, 0.22)} strokeWidth={1.2} opacity={0.5} />
      {/* arms */}
      {arm === "up" || arm === "wave"
        ? <g><path d="M-14 16 q-10 -6 -13 -16" fill="none" stroke={`url(#shirt${k})`} strokeWidth={8} strokeLinecap="round" /><circle cx={-27} cy={-1} r={4.6} fill={`url(#skin${k})`} /><path d="M14 16 q10 -4 12 -12" fill="none" stroke={`url(#shirt${k})`} strokeWidth={8} strokeLinecap="round" /><circle cx={27} cy={3} r={4.6} fill={`url(#skin${k})`} /></g>
        : <g><path d="M-15 15 q-6 12 -4 20" fill="none" stroke={`url(#shirt${k})`} strokeWidth={8} strokeLinecap="round" /><circle cx={-18} cy={35} r={4.6} fill={`url(#skin${k})`} /><path d="M15 15 q6 12 4 20" fill="none" stroke={`url(#shirt${k})`} strokeWidth={8} strokeLinecap="round" /><circle cx={18} cy={35} r={4.6} fill={`url(#skin${k})`} /></g>}
      {/* neck + head */}
      <rect x={-4} y={2} width={8} height={9} rx={3} fill={darken(skin, 0.08)} />
      <ellipse cx={-hr * 0.9} cy={-hr * 0.05} rx={3.2} ry={4.6} fill={`url(#skin${k})`} /><ellipse cx={hr * 0.9} cy={-hr * 0.05} rx={3.2} ry={4.6} fill={`url(#skin${k})`} />
      <circle cx={0} cy={-12} r={hr} fill={`url(#skin${k})`} />
      <g transform="translate(0 -12)">{hairShape(hairStyle, hr, hair)}<g transform={`scale(${flip ? -1 : 1} 1)`}><Face r={hr * 0.85} expr={expr} k={k} look={look} /></g></g>
    </g>
  );
}

// Painterly wrapper: gentle edge displacement (hand-drawn wobble) on the
// illustration, plus a warm paper-grain texture and a soft vignette on top.
// Keep text labels OUTSIDE this so they stay crisp.
export function Painterly({ children, seed = 1 }: { children: React.ReactNode; seed?: number }) {
  const p = `pt${seed}`, g = `gr${seed}`, v = `vg${seed}`;
  return <g>
    <defs>
      <filter id={p} x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="turbulence" baseFrequency="0.011" numOctaves={2} seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={3} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id={g} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={seed + 7} result="nn" />
        <feColorMatrix in="nn" type="matrix" values="0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0 0.13  0 0 0 0.4 0" />
      </filter>
      <radialGradient id={v} cx="50%" cy="40%" r="78%"><stop offset="52%" stopColor="#5a3a2a" stopOpacity="0" /><stop offset="100%" stopColor="#5a3a2a" stopOpacity="0.17" /></radialGradient>
    </defs>
    <g filter={`url(#${p})`}>{children}</g>
    <rect x={0} y={0} width={320} height={220} filter={`url(#${g})`} style={{ mixBlendMode: "multiply" }} opacity={0.5} />
    <rect x={0} y={0} width={320} height={220} fill={`url(#${v})`} />
  </g>;
}

// ---- warm scene props ----
export function Room({ from = "#ffe9df", to = "#ffd7cf", floor = "#e8b98a", k = "r" }: { from?: string; to?: string; floor?: string; k?: string }) {
  return <g>
    <defs><linearGradient id={`wall${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} /></linearGradient>
      <linearGradient id={`fl${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lighten(floor, 0.12)} /><stop offset="1" stopColor={darken(floor, 0.14)} /></linearGradient></defs>
    <rect x={-10} y={-10} width={340} height={240} fill={`url(#wall${k})`} />
    <rect x={-10} y={162} width={340} height={68} fill={`url(#fl${k})`} />
    {[40, 120, 200, 280].map((x) => <line key={x} x1={x} y1={162} x2={x + 20} y2={220} stroke={darken(floor, 0.18)} strokeWidth={1.5} opacity={0.4} />)}
    <line x1={-10} y1={162} x2={330} y2={162} stroke={darken(floor, 0.2)} strokeWidth={2} opacity={0.4} />
  </g>;
}
export const Window = ({ x = 250, y = 40 }: { x?: number; y?: number }) => <g>
  <rect x={x - 32} y={y} width={64} height={72} rx={6} fill="#bfe3ff" stroke="#e0a878" strokeWidth={5} />
  <path d={`M${x - 30} ${y + 2} L${x + 10} ${y + 70} M${x + 6} ${y + 2} L${x + 30} ${y + 44}`} stroke="#fff" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
  <line x1={x} y1={y} x2={x} y2={y + 72} stroke="#e0a878" strokeWidth={4} /><line x1={x - 32} y1={y + 36} x2={x + 32} y2={y + 36} stroke="#e0a878" strokeWidth={4} />
</g>;
export const Door = ({ x = 120 }: { x?: number }) => <g>
  <rect x={x - 34} y={44} width={68} height={130} rx={6} fill="#c98a5a" stroke="#9a6238" strokeWidth={4} />
  <rect x={x - 26} y={54} width={52} height={50} rx={4} fill="none" stroke="#9a6238" strokeWidth={3} /><rect x={x - 26} y={110} width={52} height={54} rx={4} fill="none" stroke="#9a6238" strokeWidth={3} />
  <circle cx={x + 22} cy={116} r={4} fill="#ffd84d" stroke="#c99a2e" strokeWidth={1.5} />
</g>;
export const Confetti = ({ seed = 0 }: { seed?: number }) => {
  const cols = ["#ff6b9d", "#4fc3f7", "#ffd84d", "#8ed081", "#c77dff", "#ff8a5c"];
  const bits = Array.from({ length: 26 }).map((_, i) => { const a = (i * 47 + seed * 13) % 320, b = ((i * 71 + seed * 29) % 130) + 12; return { x: a, y: b, c: cols[i % cols.length], r: (i % 3) + 3, rot: (i * 40) % 360 }; });
  return <g>{bits.map((p, i) => i % 2 === 0
    ? <rect key={i} x={p.x} y={p.y} width={p.r * 1.6} height={p.r} rx={1} fill={p.c} transform={`rotate(${p.rot} ${p.x} ${p.y})`} opacity={0.9} />
    : <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.8} fill={p.c} opacity={0.9} />)}</g>;
};
export const Plant = ({ x = 40, y = 162 }: { x?: number; y?: number }) => <g>
  <path d={`M${x - 12} ${y} L${x - 9} ${y + 34} L${x + 9} ${y + 34} L${x + 12} ${y} Z`} fill="#d98c4a" stroke="#b06a2e" strokeWidth={1.5} />
  {[[-10, -30, -20], [0, -40, 0], [10, -30, 20]].map(([dx, dy, rot], i) => <ellipse key={i} cx={x + dx} cy={y + dy} rx={7} ry={18} fill={i === 1 ? "#4caf76" : "#5cc088"} transform={`rotate(${rot} ${x + dx} ${y + dy})`} />)}
</g>;
export const Rug = ({ cx = 160, cy = 195, w = 200, fill = "#f6a5c0" }: { cx?: number; cy?: number; w?: number; fill?: string }) => <g>
  <ellipse cx={cx} cy={cy} rx={w / 2} ry={w / 6} fill={fill} opacity={0.55} /><ellipse cx={cx} cy={cy} rx={w / 2.6} ry={w / 7.5} fill="none" stroke="#fff" strokeWidth={2} opacity={0.5} />
</g>;
export const Balloon = ({ x = 40, y = 60, fill = "#ff6b9d", k = "b" }: { x?: number; y?: number; fill?: string; k?: string }) => <g>
  <defs><radialGradient id={`bg${k}`} cx="35%" cy="30%" r="70%"><stop offset="0" stopColor={lighten(fill, 0.4)} /><stop offset="1" stopColor={fill} /></radialGradient></defs>
  <ellipse cx={x} cy={y} rx={14} ry={17} fill={`url(#bg${k})`} /><path d={`M${x} ${y + 17} l-3 4 h6 Z`} fill={fill} /><path d={`M${x} ${y + 21} q6 16 0 34`} fill="none" stroke="#c9a9b5" strokeWidth={1.2} />
</g>;

// A decorated round cake, optionally sliced into `parts`, with candles.
export function Cake({ cx = 160, cy = 120, r = 48, parts = 1, candles = 0, k = "c" }: { cx?: number; cy?: number; r?: number; parts?: number; candles?: number; k?: string }) {
  const sponge = "#ffdca8", cream = "#fff2df", frost = "#f6a5c0";
  const slices = parts > 1 ? Array.from({ length: parts }).map((_, i) => {
    const a0 = (i / parts) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / parts) * 2 * Math.PI - Math.PI / 2;
    const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={sponge} stroke={darken(frost, 0.1)} strokeWidth={2} />;
  }) : null;
  return <g>
    <defs><radialGradient id={`cake${k}`} cx="42%" cy="34%" r="70%"><stop offset="0" stopColor={lighten(frost, 0.35)} /><stop offset="1" stopColor={frost} /></radialGradient></defs>
    <ellipse cx={cx} cy={cy + r * 0.9} rx={r + 8} ry={r * 0.28} fill="#3a2a2a" opacity={0.1} />
    <circle cx={cx} cy={cy} r={r + 6} fill={`url(#cake${k})`} />
    {parts > 1 ? slices : <><circle cx={cx} cy={cy} r={r} fill={sponge} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={cream} strokeWidth={5} /></>}
    {parts <= 1 && Array.from({ length: 10 }).map((_, i) => { const a = (i / 10) * 2 * Math.PI; return <circle key={i} cx={cx + (r + 3) * Math.cos(a)} cy={cy + (r + 3) * Math.sin(a)} r={4} fill="#fff" opacity={0.9} />; })}
    {Array.from({ length: parts > 1 ? parts : 6 }).map((_, i) => { const a = ((i + 0.5) / (parts > 1 ? parts : 6)) * 2 * Math.PI - Math.PI / 2; return <circle key={i} cx={cx + r * 0.55 * Math.cos(a)} cy={cy + r * 0.55 * Math.sin(a)} r={4.5} fill="#e0466f" />; })}
    {Array.from({ length: candles }).map((_, i) => { const x = cx - (candles - 1) * 8 + i * 16; return <g key={i}><rect x={x - 2} y={cy - r - 18} width={4} height={16} rx={1} fill={["#4fc3f7", "#ffd84d", "#8ed081"][i % 3]} /><ellipse cx={x} cy={cy - r - 22} rx={2.5} ry={4} fill="#ffb420" /><circle cx={x} cy={cy - r - 24} r={1.5} fill="#fff3c0" /></g>; })}
  </g>;
}
