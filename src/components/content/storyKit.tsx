import React from "react";

// ==========================================================
// storyKit — a reusable cartoon illustration toolkit for the
// MathQuest storybooks. Expressive characters with consistent
// faces, plus friendly scene props (sun, clouds, trees, food…).
// Everything is hand-drawn SVG so it works offline / under CSP.
// Scenes are authored in a 320×220 viewBox.
//
// Every fill is form-shaded with a light→shadow gradient so the
// art reads as painted (matching the "A Cake to Share" richArt
// look). Gradient ids are DERIVED FROM THE COLOUR, so the same
// character repeated in a scene shares one identical def (safe)
// and different colours get their own def (correct) — no per-
// instance keys, so all books get the richer look for free.
// ==========================================================

export type Expr = "happy" | "excited" | "think" | "surprised" | "sleepy" | "proud" | "worried";

const INK = "#2a2440";

// colour shading helpers
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const darken = (h: string, a = 0.2) => shade(h, -a);
const lighten = (h: string, a = 0.26) => shade(h, a);
const key = (h: string) => h.replace("#", "");

// A vertical form gradient (top-light → bottom-shadow), id keyed by colour.
function VGrad({ p, c, hi = 0.2, lo = 0.16 }: { p: string; c: string; hi?: number; lo?: number }) {
  return <linearGradient id={`${p}-${key(c)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lighten(c, hi)} /><stop offset="1" stopColor={darken(c, lo)} /></linearGradient>;
}
// A radial volume gradient (top-left light → colour), id keyed by colour.
function RGrad({ p, c, hi = 0.34 }: { p: string; c: string; hi?: number }) {
  return <radialGradient id={`${p}-${key(c)}`} cx="40%" cy="32%" r="72%"><stop offset="0" stopColor={lighten(c, hi)} /><stop offset="1" stopColor={c} /></radialGradient>;
}
const url = (p: string, c: string) => `url(#${p}-${key(c)})`;

// Painterly paper overlay (grain + warm top-light + soft vignette). Text-safe
// — no displacement — so it can be laid over any scene without distorting the
// baked math labels. Matches the strength of richArt's Painterly. Draw it LAST.
export function PaperFX({ w = 320, h = 220 }: { w?: number; h?: number }) {
  return <g aria-hidden>
    <defs>
      <filter id="pfx-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0.34 0" />
      </filter>
      <radialGradient id="pfx-hl" cx="50%" cy="13%" r="62%"><stop offset="0%" stopColor="#fff6e6" stopOpacity="0.4" /><stop offset="100%" stopColor="#fff6e6" stopOpacity="0" /></radialGradient>
      <radialGradient id="pfx-vig" cx="50%" cy="42%" r="80%"><stop offset="54%" stopColor="#4a2f22" stopOpacity="0" /><stop offset="100%" stopColor="#4a2f22" stopOpacity="0.16" /></radialGradient>
    </defs>
    <rect x={0} y={0} width={w} height={h} fill="url(#pfx-hl)" style={{ mixBlendMode: "soft-light" }} />
    <rect x={0} y={0} width={w} height={h} filter="url(#pfx-grain)" style={{ mixBlendMode: "multiply" }} opacity={0.4} />
    <rect x={0} y={0} width={w} height={h} fill="url(#pfx-vig)" />
  </g>;
}

// ---- expressive face (drawn around a local origin, head radius ~ r) ----
export function Face({ r = 22, expr = "happy", look = 0 }: { r?: number; expr?: Expr; look?: number }) {
  const eyeY = -r * 0.1, eyeDx = r * 0.42, eyeR = r * 0.18;
  const pupil = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={eyeY} rx={eyeR} ry={expr === "sleepy" ? eyeR * 0.4 : eyeR * 1.05} fill="#fff" stroke={INK} strokeWidth={r * 0.045} />
      {expr !== "sleepy" && <>
        <circle cx={cx + look * eyeR * 0.5} cy={eyeY + eyeR * 0.2} r={eyeR * 0.62} fill="#4a2c1a" />
        <circle cx={cx + look * eyeR * 0.5} cy={eyeY + eyeR * 0.2} r={eyeR * 0.3} fill={INK} />
        <circle cx={cx + look * eyeR * 0.5 - eyeR * 0.24} cy={eyeY - eyeR * 0.12} r={eyeR * 0.22} fill="#fff" />
      </>}
      {expr === "sleepy" && <path d={`M${cx - eyeR} ${eyeY} q${eyeR} ${eyeR * 0.7} ${eyeR * 2} 0`} fill="none" stroke={INK} strokeWidth={r * 0.06} strokeLinecap="round" />}
    </g>
  );
  const brows = () => {
    if (expr === "think" || expr === "worried") return <path d={`M${-eyeDx - eyeR} ${eyeY - eyeR * 1.5} q${eyeR} ${-eyeR * 0.6} ${eyeR * 2} ${eyeR * 0.2}`} fill="none" stroke={INK} strokeWidth={r * 0.07} strokeLinecap="round" />;
    if (expr === "surprised" || expr === "excited") return <>
      <line x1={-eyeDx - eyeR * 0.6} y1={eyeY - eyeR * 1.7} x2={-eyeDx + eyeR * 0.6} y2={eyeY - eyeR * 1.9} stroke={INK} strokeWidth={r * 0.07} strokeLinecap="round" />
      <line x1={eyeDx - eyeR * 0.6} y1={eyeY - eyeR * 1.9} x2={eyeDx + eyeR * 0.6} y2={eyeY - eyeR * 1.7} stroke={INK} strokeWidth={r * 0.07} strokeLinecap="round" />
    </>;
    return null;
  };
  const mouth = () => {
    switch (expr) {
      case "excited": case "surprised": return <g><ellipse cx={0} cy={r * 0.5} rx={r * 0.24} ry={r * 0.3} fill="#8a2b3a" /><path d={`M${-r * 0.18} ${r * 0.4} h${r * 0.36}`} stroke="#fff" strokeWidth={r * 0.1} strokeLinecap="round" /></g>;
      case "proud": case "happy": return <path d={`M${-r * 0.34} ${r * 0.42} q${r * 0.34} ${r * 0.5} ${r * 0.68} 0`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />;
      case "think": return <path d={`M${-r * 0.2} ${r * 0.5} q${r * 0.25} ${-r * 0.2} ${r * 0.45} 0`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />;
      case "worried": return <path d={`M${-r * 0.28} ${r * 0.55} q${r * 0.28} ${-r * 0.35} ${r * 0.56} 0`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />;
      case "sleepy": return <path d={`M${-r * 0.16} ${r * 0.5} q${r * 0.16} ${r * 0.2} ${r * 0.32} 0`} fill="none" stroke={INK} strokeWidth={r * 0.07} strokeLinecap="round" />;
      default: return <path d={`M${-r * 0.3} ${r * 0.45} q${r * 0.3} ${r * 0.4} ${r * 0.6} 0`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />;
    }
  };
  return (
    <g>
      {brows()}
      {pupil(-eyeDx)}{pupil(eyeDx)}
      <circle cx={-eyeDx - eyeR * 1.1} cy={r * 0.3} r={r * 0.17} fill="#ff9aa8" opacity={0.65} />
      <circle cx={eyeDx + eyeR * 1.1} cy={r * 0.3} r={r * 0.17} fill="#ff9aa8" opacity={0.65} />
      {mouth()}
    </g>
  );
}

// ---- a child character, consistent across pages via its colour props ----
export function Kid({ x = 0, y = 0, s = 1, skin = "#f2c19b", hair = "#3a2a1e", shirt = "#ff8a5c", hairStyle = "short", expr = "happy", look = 0, arm = "down" }: {
  x?: number; y?: number; s?: number; skin?: string; hair?: string; shirt?: string; hairStyle?: "short" | "bun" | "curly" | "pony" | "cap"; expr?: Expr; look?: number; arm?: "down" | "up" | "wave";
}) {
  const pants = "#3a4e75";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <VGrad p="k-skin" c={skin} hi={0.16} lo={0.12} />
        <VGrad p="k-shirt" c={shirt} hi={0.2} lo={0.18} />
        <VGrad p="k-hair" c={hair} hi={0.22} lo={0.1} />
        <VGrad p="k-pants" c={pants} hi={0.14} lo={0.16} />
      </defs>
      {/* ground shadow */}
      <ellipse cx={0} cy={57} rx={19} ry={4} fill={INK} opacity={0.13} />
      {/* legs */}
      <rect x={-11} y={34} width={9} height={20} rx={4} fill={url("k-pants", pants)} /><rect x={2} y={34} width={9} height={20} rx={4} fill={url("k-pants", pants)} />
      <ellipse cx={-6} cy={56} rx={7} ry={4} fill={INK} /><ellipse cx={7} cy={56} rx={7} ry={4} fill={INK} />
      {/* body */}
      <path d="M-16 20 Q-18 40 -13 40 L13 40 Q18 40 16 20 Q14 8 0 8 Q-14 8 -16 20 Z" fill={url("k-shirt", shirt)} />
      <path d="M-14 33 Q0 42 14 33 L13 40 Q0 44 -13 40 Z" fill={darken(shirt, 0.16)} opacity={0.45} />
      {/* arms */}
      {arm === "up" || arm === "wave"
        ? <g><rect x={-20} y={8} width={8} height={20} rx={4} fill={url("k-shirt", shirt)} transform="rotate(35 -16 12)" /><rect x={12} y={-6} width={8} height={20} rx={4} fill={url("k-shirt", shirt)} transform="rotate(20 16 6)" /><circle cx={19} cy={-8} r={4.5} fill={url("k-skin", skin)} /></g>
        : <g><rect x={-20} y={14} width={8} height={20} rx={4} fill={url("k-shirt", shirt)} /><rect x={12} y={14} width={8} height={20} rx={4} fill={url("k-shirt", shirt)} /><circle cx={-16} cy={34} r={4.5} fill={url("k-skin", skin)} /><circle cx={16} cy={34} r={4.5} fill={url("k-skin", skin)} /></g>}
      {/* neck + ears + head */}
      <rect x={-4} y={2} width={8} height={9} rx={3} fill={darken(skin, 0.08)} />
      <ellipse cx={-18} cy={-11} rx={3} ry={4.2} fill={url("k-skin", skin)} /><ellipse cx={18} cy={-11} rx={3} ry={4.2} fill={url("k-skin", skin)} />
      <circle cx={0} cy={-12} r={20} fill={url("k-skin", skin)} />
      <ellipse cx={-7} cy={-18} rx={6} ry={8} fill="#ffffff" opacity={0.13} />
      {/* hair */}
      {hairStyle === "short" && <path d="M-20 -14 Q-22 -34 0 -34 Q22 -34 20 -14 Q14 -26 0 -26 Q-14 -26 -20 -14 Z" fill={url("k-hair", hair)} />}
      {hairStyle === "curly" && <g fill={url("k-hair", hair)}><circle cx={-14} cy={-26} r={9} /><circle cx={0} cy={-31} r={10} /><circle cx={14} cy={-26} r={9} /><circle cx={-20} cy={-16} r={7} /><circle cx={20} cy={-16} r={7} /></g>}
      {hairStyle === "bun" && <g fill={url("k-hair", hair)}><circle cx={0} cy={-34} r={8} /><path d="M-20 -12 Q-22 -32 0 -32 Q22 -32 20 -12 Q14 -24 0 -24 Q-14 -24 -20 -12 Z" /></g>}
      {hairStyle === "pony" && <g fill={url("k-hair", hair)}><path d="M-20 -12 Q-22 -32 0 -32 Q22 -32 20 -12 Q14 -24 0 -24 Q-14 -24 -20 -12 Z" /><path d="M18 -18 Q34 -14 30 6 Q26 -6 16 -8 Z" /></g>}
      {hairStyle === "cap" && <g><path d="M-21 -14 Q-21 -33 0 -33 Q21 -33 21 -14 Z" fill={url("k-hair", hair)} /><rect x={-24} y={-16} width={20} height={5} rx={2.5} fill={darken(hair, 0.1)} /></g>}
      <g transform="translate(0 -12)"><Face r={17} expr={expr} look={look} /></g>
    </g>
  );
}

// ---- animals ----
export function Snail({ x = 0, y = 0, s = 1, shell = "#ffb420", expr = "happy" }: { x?: number; y?: number; s?: number; shell?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><RGrad p="sn-shell" c={shell} hi={0.4} /><RGrad p="sn-foot" c="#a7e0c8" hi={0.28} /></defs>
    <ellipse cx={-2} cy={22} rx={30} ry={4} fill={INK} opacity={0.1} />
    <path d="M-30 8 Q-34 18 -18 18 L26 18 Q34 18 30 10 Q26 4 16 6 Z" fill={url("sn-foot", "#a7e0c8")} />
    <circle cx={-2} cy={2} r={17} fill={url("sn-shell", shell)} stroke="#e0930f" strokeWidth={2.5} />
    <ellipse cx={-8} cy={-5} rx={5} ry={4} fill="#ffffff" opacity={0.3} />
    <circle cx={-2} cy={2} r={11} fill="none" stroke="#e0930f" strokeWidth={2.5} />
    <circle cx={-2} cy={2} r={5} fill="none" stroke="#e0930f" strokeWidth={2.5} />
    <path d="M22 12 Q30 12 30 2 Q38 -2 34 6" fill={url("sn-foot", "#a7e0c8")} />
    <g transform="translate(28 4)"><Face r={10} expr={expr} /></g>
    <line x1={30} y1={-4} x2={33} y2={-12} stroke="#7bbfa0" strokeWidth={2} strokeLinecap="round" /><circle cx={33} cy={-13} r={2} fill={INK} />
    <line x1={36} y1={-2} x2={40} y2={-9} stroke="#7bbfa0" strokeWidth={2} strokeLinecap="round" /><circle cx={40} cy={-10} r={2} fill={INK} />
  </g>;
}
export function Bee({ x = 0, y = 0, s = 1, expr = "happy" }: { x?: number; y?: number; s?: number; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><RGrad p="be-body" c="#ffb420" hi={0.36} /></defs>
    <ellipse cx={-2} cy={-12} rx={11} ry={9} fill="#e8f1ff" opacity={0.85} stroke="#cfe0f5" /><ellipse cx={10} cy={-12} rx={11} ry={9} fill="#e8f1ff" opacity={0.85} stroke="#cfe0f5" />
    <ellipse cx={4} cy={4} rx={18} ry={14} fill={url("be-body", "#ffb420")} />
    <ellipse cx={-3} cy={-2} rx={6} ry={4.5} fill="#ffffff" opacity={0.28} />
    <path d="M-6 -4 q6 8 22 3" stroke="#2a2440" strokeWidth={4} fill="none" /><path d="M-9 6 q9 8 27 2" stroke="#2a2440" strokeWidth={4} fill="none" />
    <g transform="translate(4 2)"><Face r={11} expr={expr} /></g>
    <line x1={-4} y1={-14} x2={-8} y2={-22} stroke={INK} strokeWidth={1.5} /><circle cx={-8} cy={-23} r={2} fill={INK} />
    <line x1={8} y1={-14} x2={12} y2={-22} stroke={INK} strokeWidth={1.5} /><circle cx={12} cy={-23} r={2} fill={INK} />
  </g>;
}
export function Duck({ x = 0, y = 0, s = 1, body = "#ffd84d", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><RGrad p="dk-body" c={body} hi={0.34} /></defs>
    <ellipse cx={2} cy={30} rx={19} ry={3.5} fill={INK} opacity={0.1} />
    <ellipse cx={2} cy={16} rx={20} ry={14} fill={url("dk-body", body)} />
    <ellipse cx={-3} cy={9} rx={8} ry={5} fill="#ffffff" opacity={0.28} />
    <path d="M14 20 q14 -2 18 6 q-10 4 -18 -2 Z" fill={darken(body, 0.12)} />
    <circle cx={-12} cy={-2} r={14} fill={url("dk-body", body)} />
    <ellipse cx={-16} cy={-7} rx={4.5} ry={3.5} fill="#ffffff" opacity={0.3} />
    <path d="M-26 -2 q-8 0 -8 4 q0 4 8 3 Z" fill="#f59e0b" />
    <g transform="translate(-12 -2)"><Face r={11} expr={expr} /></g>
  </g>;
}
export function Cat({ x = 0, y = 0, s = 1, body = "#b39ddb", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><RGrad p="ct-body" c={body} hi={0.3} /></defs>
    <ellipse cx={0} cy={33} rx={16} ry={3.5} fill={INK} opacity={0.1} />
    <ellipse cx={0} cy={20} rx={16} ry={14} fill={url("ct-body", body)} />
    <path d="M14 22 q16 4 10 -8 q-2 8 -10 3 Z" fill={darken(body, 0.14)} />
    <circle cx={0} cy={-4} r={18} fill={url("ct-body", body)} />
    <ellipse cx={-6} cy={-10} rx={5.5} ry={7} fill="#ffffff" opacity={0.2} />
    <path d="M-16 -16 l-4 -14 l14 8 Z" fill={url("ct-body", body)} /><path d="M16 -16 l4 -14 l-14 8 Z" fill={url("ct-body", body)} />
    <path d="M-16 -16 l-2 -8 l7 5 Z" fill="#ff9aa8" /><path d="M16 -16 l2 -8 l-7 5 Z" fill="#ff9aa8" />
    <g transform="translate(0 -4)"><Face r={15} expr={expr} /></g>
  </g>;
}
export function Bird({ x = 0, y = 0, s = 1, body = "#4fc3f7", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><RGrad p="bd-body" c={body} hi={0.34} /></defs>
    <ellipse cx={0} cy={27} rx={13} ry={3.2} fill={INK} opacity={0.1} />
    <ellipse cx={0} cy={8} rx={15} ry={17} fill={url("bd-body", body)} />
    <ellipse cx={-14} cy={8} rx={7} ry={11} fill={lighten(body, 0.4)} opacity={0.7} />
    <ellipse cx={-5} cy={-2} rx={5} ry={7} fill="#ffffff" opacity={0.24} />
    <path d="M12 4 l12 -3 l-10 8 Z" fill="#f59e0b" />
    <g transform="translate(0 -6)"><Face r={12} expr={expr} /></g>
    <path d="M-2 24 l-4 8 M4 24 l4 8" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />
  </g>;
}
export function Robot({ x = 0, y = 0, s = 1, body = "#7fd1c9", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><VGrad p="rb-body" c={body} hi={0.26} lo={0.16} /></defs>
    <ellipse cx={0} cy={40} rx={18} ry={3.5} fill={INK} opacity={0.1} />
    <rect x={-14} y={12} width={28} height={26} rx={7} fill={url("rb-body", body)} stroke="#3aa79c" strokeWidth={2} />
    <circle cx={0} cy={24} r={5} fill="#ffb420" />
    <rect x={-16} y={-20} width={32} height={30} rx={10} fill={url("rb-body", body)} stroke="#3aa79c" strokeWidth={2} />
    <rect x={-12} y={-17} width={9} height={24} rx={4} fill="#ffffff" opacity={0.16} />
    <line x1={0} y1={-20} x2={0} y2={-30} stroke="#3aa79c" strokeWidth={2} /><circle cx={0} cy={-32} r={4} fill="#ffb420" />
    <g transform="translate(0 -6)"><Face r={13} expr={expr} /></g>
    <rect x={-22} y={16} width={8} height={16} rx={4} fill={url("rb-body", body)} /><rect x={14} y={16} width={8} height={16} rx={4} fill={url("rb-body", body)} />
  </g>;
}

// ---- scene backdrops & props ----
export function Sky({ from = "#bfe6ff", to = "#eaf7ff" }: { from?: string; to?: string }) {
  return <><defs><linearGradient id={`sky-${key(from)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} /></linearGradient></defs><rect x={0} y={0} width={320} height={220} fill={`url(#sky-${key(from)})`} /></>;
}
export const Sun = ({ x = 44, y = 40, fill = "#ffd84d" }: { x?: number; y?: number; fill?: string }) => <g><defs><radialGradient id={`sun-${key(fill)}`} cx="42%" cy="38%" r="62%"><stop offset="0" stopColor={lighten(fill, 0.4)} /><stop offset="1" stopColor={fill} /></radialGradient></defs>{Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={x + 24 * Math.cos(a)} y1={y + 24 * Math.sin(a)} x2={x + 31 * Math.cos(a)} y2={y + 31 * Math.sin(a)} stroke={fill} strokeWidth={3} strokeLinecap="round" />; })}<circle cx={x} cy={y} r={20} fill={`url(#sun-${key(fill)})`} /></g>;
export const Cloud = ({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) => <g transform={`translate(${x} ${y}) scale(${s})`}><g fill="#fff"><ellipse cx={0} cy={0} rx={22} ry={14} /><ellipse cx={-18} cy={4} rx={14} ry={10} /><ellipse cx={18} cy={4} rx={14} ry={10} /></g><ellipse cx={-4} cy={7} rx={30} ry={6} fill="#cfe6f5" opacity={0.5} /></g>;
export const Hill = ({ y = 170, fill = "#8ed081" }: { y?: number; fill?: string }) => <g><defs><VGrad p="hill" c={fill} hi={0.16} lo={0.14} /></defs><path d={`M0 ${y} Q80 ${y - 40} 160 ${y} T320 ${y} V220 H0 Z`} fill={url("hill", fill)} /></g>;
export const Ground = ({ y = 180, fill = "#a5d977" }: { y?: number; fill?: string }) => <g><defs><VGrad p="grd" c={fill} hi={0.14} lo={0.16} /></defs><rect x={0} y={y} width={320} height={220 - y} fill={url("grd", fill)} /><path d={`M0 ${y} H320`} stroke={darken(fill, 0.14)} strokeWidth={1.5} opacity={0.35} /></g>;
export const Tree = ({ x = 0, y = 180, s = 1, fill = "#4caf76" }: { x?: number; y?: number; s?: number; fill?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><defs><RGrad p="tree" c={fill} hi={0.28} /><VGrad p="trunk" c="#8d6e4e" hi={0.16} lo={0.16} /></defs><rect x={-6} y={-26} width={12} height={30} rx={3} fill={url("trunk", "#8d6e4e")} /><circle cx={-16} cy={-30} r={16} fill={url("tree", fill)} /><circle cx={16} cy={-30} r={16} fill={url("tree", fill)} /><circle cx={0} cy={-40} r={24} fill={url("tree", fill)} /><circle cx={-8} cy={-46} r={7} fill={lighten(fill, 0.22)} opacity={0.5} /></g>;
export const Flower = ({ x = 0, y = 0, s = 1, petal = "#ff6b9d", center = "#ffd84d" }: { x?: number; y?: number; s?: number; petal?: string; center?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><defs><RGrad p="pet" c={petal} hi={0.3} /></defs><line x1={0} y1={0} x2={0} y2={22} stroke="#4caf76" strokeWidth={3} />{Array.from({ length: 6 }).map((_, i) => { const a = (i / 6) * Math.PI * 2; return <ellipse key={i} cx={9 * Math.cos(a)} cy={9 * Math.sin(a)} rx={6} ry={4} fill={url("pet", petal)} transform={`rotate(${(a * 180) / Math.PI} ${9 * Math.cos(a)} ${9 * Math.sin(a)})`} />; })}<circle cx={0} cy={0} r={6} fill={center} /><circle cx={-1.5} cy={-1.5} r={2} fill={lighten(center, 0.4)} /></g>;
export const Star = ({ x = 0, y = 0, s = 1, fill = "#ffd84d" }: { x?: number; y?: number; s?: number; fill?: string }) => <path transform={`translate(${x} ${y}) scale(${s / 9})`} d="M0 -9 L2.6 -2.8 L9 -2.8 L3.9 1.1 L5.6 7.3 L0 3.6 L-5.6 7.3 L-3.9 1.1 L-9 -2.8 L-2.6 -2.8 Z" fill={fill} />;
export const Pizza = ({ x = 0, y = 0, s = 1, slices = 4, eaten = 0 }: { x?: number; y?: number; s?: number; slices?: number; eaten?: number }) => <g transform={`translate(${x} ${y}) scale(${s})`}><defs><RGrad p="pz" c="#e8b04b" hi={0.24} /></defs><circle cx={0} cy={0} r={38} fill="#f8d99a" />{Array.from({ length: slices }).map((_, i) => { const a0 = (i / slices) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / slices) * 2 * Math.PI - Math.PI / 2, r = 34; const p = (a: number) => [r * Math.cos(a), r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return <path key={i} d={`M0 0 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={i < slices - eaten ? url("pz", "#e8b04b") : "#fff"} stroke="#c98a2e" strokeWidth={2} />; })}{Array.from({ length: slices - eaten }).map((_, i) => { const a = ((i + 0.5) / slices) * 2 * Math.PI - Math.PI / 2; return <circle key={i} cx={20 * Math.cos(a)} cy={20 * Math.sin(a)} r={4} fill="#c0392b" />; })}</g>;
export const Coin = ({ x = 0, y = 0, s = 1, label = "" }: { x?: number; y?: number; s?: number; label?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><defs><RGrad p="coin" c="#ffd84d" hi={0.34} /></defs><circle cx={0} cy={0} r={14} fill={url("coin", "#ffd84d")} stroke="#e0930f" strokeWidth={2.5} /><circle cx={0} cy={0} r={9} fill="none" stroke="#e0930f" strokeWidth={1.5} />{label && <text x={0} y={1} fontSize={10} fontWeight={800} fill="#8a5a0f" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display), Poppins, sans-serif">{label}</text>}</g>;
export const Box = ({ x = 0, y = 0, s = 1, fill = "#d9a066" }: { x?: number; y?: number; s?: number; fill?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><defs><VGrad p="box" c={fill} hi={0.16} lo={0.18} /></defs><rect x={-18} y={-14} width={36} height={28} rx={3} fill={url("box", fill)} stroke="#a97a45" strokeWidth={2} /><path d="M-18 -6 H18" stroke="#a97a45" strokeWidth={2} /><path d="M0 -14 V14" stroke="#a97a45" strokeWidth={2} /></g>;
export const Balloon = ({ x = 0, y = 0, s = 1, fill = "#ff6b9d" }: { x?: number; y?: number; s?: number; fill?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><defs><radialGradient id={`bal-${key(fill)}`} cx="35%" cy="28%" r="72%"><stop offset="0" stopColor={lighten(fill, 0.42)} /><stop offset="1" stopColor={fill} /></radialGradient></defs><ellipse cx={0} cy={0} rx={13} ry={16} fill={`url(#bal-${key(fill)})`} /><path d="M0 16 l-3 4 h6 Z" fill={fill} /><line x1={0} y1={20} x2={0} y2={44} stroke="#bbb" strokeWidth={1.2} /></g>;

export const FONT = "var(--font-display), Poppins, system-ui, sans-serif";
export function Speech({ x, y, w = 90, h = 40, text, tail = "left" }: { x: number; y: number; w?: number; h?: number; text: string; tail?: "left" | "right" }) {
  return <g><rect x={x} y={y} width={w} height={h} rx={12} fill="#fff" stroke="#2a2440" strokeWidth={2} /><path d={tail === "left" ? `M${x + 16} ${y + h} l0 12 l14 -12 Z` : `M${x + w - 16} ${y + h} l0 12 l-14 -12 Z`} fill="#fff" stroke="#2a2440" strokeWidth={2} /><text x={x + w / 2} y={y + h / 2} fontSize={14} fontWeight={800} fill="#2a2440" textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{text}</text></g>;
}
