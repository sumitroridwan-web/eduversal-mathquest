import React from "react";

// ==========================================================
// storyKit — a reusable cartoon illustration toolkit for the
// MathQuest storybooks. Expressive characters with consistent
// faces, plus friendly scene props (sun, clouds, trees, food…).
// Everything is hand-drawn SVG so it works offline / under CSP.
// Scenes are authored in a 320×220 viewBox.
// ==========================================================

export type Expr = "happy" | "excited" | "think" | "surprised" | "sleepy" | "proud" | "worried";

const INK = "#2a2440";

// ---- expressive face (drawn around a local origin, head radius ~ r) ----
export function Face({ r = 22, expr = "happy", look = 0 }: { r?: number; expr?: Expr; look?: number }) {
  const eyeY = -r * 0.1, eyeDx = r * 0.42, eyeR = r * 0.17;
  const pupil = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={eyeY} rx={eyeR} ry={expr === "sleepy" ? eyeR * 0.4 : eyeR} fill="#fff" stroke={INK} strokeWidth={r * 0.05} />
      {expr !== "sleepy" && <circle cx={cx + look * eyeR * 0.5} cy={eyeY + eyeR * 0.25} r={eyeR * 0.55} fill={INK} />}
      {expr !== "sleepy" && <circle cx={cx + look * eyeR * 0.5 - eyeR * 0.2} cy={eyeY + eyeR * 0.02} r={eyeR * 0.2} fill="#fff" />}
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
      case "excited": case "surprised": return <ellipse cx={0} cy={r * 0.5} rx={r * 0.26} ry={r * 0.32} fill="#c0392b" />;
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
      <circle cx={-eyeDx - eyeR * 1.1} cy={r * 0.28} r={r * 0.16} fill="#ff9aa8" opacity={0.7} />
      <circle cx={eyeDx + eyeR * 1.1} cy={r * 0.28} r={r * 0.16} fill="#ff9aa8" opacity={0.7} />
      {mouth()}
    </g>
  );
}

// ---- a child character, consistent across pages via its colour props ----
export function Kid({ x = 0, y = 0, s = 1, skin = "#f2c19b", hair = "#3a2a1e", shirt = "#ff8a5c", hairStyle = "short", expr = "happy", look = 0, arm = "down" }: {
  x?: number; y?: number; s?: number; skin?: string; hair?: string; shirt?: string; hairStyle?: "short" | "bun" | "curly" | "pony" | "cap"; expr?: Expr; look?: number; arm?: "down" | "up" | "wave";
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* legs */}
      <rect x={-11} y={34} width={9} height={20} rx={4} fill="#3a4e75" /><rect x={2} y={34} width={9} height={20} rx={4} fill="#3a4e75" />
      <ellipse cx={-6} cy={56} rx={7} ry={4} fill={INK} /><ellipse cx={7} cy={56} rx={7} ry={4} fill={INK} />
      {/* body */}
      <path d="M-16 20 Q-18 40 -13 40 L13 40 Q18 40 16 20 Q14 8 0 8 Q-14 8 -16 20 Z" fill={shirt} />
      {/* arms */}
      {arm === "up" || arm === "wave"
        ? <g><rect x={-20} y={8} width={8} height={20} rx={4} fill={shirt} transform="rotate(35 -16 12)" /><rect x={12} y={-6} width={8} height={20} rx={4} fill={shirt} transform="rotate(20 16 6)" /><circle cx={19} cy={-8} r={4.5} fill={skin} /></g>
        : <g><rect x={-20} y={14} width={8} height={20} rx={4} fill={shirt} /><rect x={12} y={14} width={8} height={20} rx={4} fill={shirt} /><circle cx={-16} cy={34} r={4.5} fill={skin} /><circle cx={16} cy={34} r={4.5} fill={skin} /></g>}
      {/* head */}
      <circle cx={0} cy={-12} r={20} fill={skin} />
      {/* hair */}
      {hairStyle === "short" && <path d="M-20 -14 Q-22 -34 0 -34 Q22 -34 20 -14 Q14 -26 0 -26 Q-14 -26 -20 -14 Z" fill={hair} />}
      {hairStyle === "curly" && <g fill={hair}><circle cx={-14} cy={-26} r={9} /><circle cx={0} cy={-31} r={10} /><circle cx={14} cy={-26} r={9} /><circle cx={-20} cy={-16} r={7} /><circle cx={20} cy={-16} r={7} /></g>}
      {hairStyle === "bun" && <g fill={hair}><circle cx={0} cy={-34} r={8} /><path d="M-20 -12 Q-22 -32 0 -32 Q22 -32 20 -12 Q14 -24 0 -24 Q-14 -24 -20 -12 Z" /></g>}
      {hairStyle === "pony" && <g fill={hair}><path d="M-20 -12 Q-22 -32 0 -32 Q22 -32 20 -12 Q14 -24 0 -24 Q-14 -24 -20 -12 Z" /><path d="M18 -18 Q34 -14 30 6 Q26 -6 16 -8 Z" /></g>}
      {hairStyle === "cap" && <g><path d="M-21 -14 Q-21 -33 0 -33 Q21 -33 21 -14 Z" fill={hair} /><rect x={-24} y={-16} width={20} height={5} rx={2.5} fill={hair} /></g>}
      <g transform="translate(0 -12)"><Face r={17} expr={expr} look={look} /></g>
    </g>
  );
}

// ---- animals ----
export function Snail({ x = 0, y = 0, s = 1, shell = "#ffb420", expr = "happy" }: { x?: number; y?: number; s?: number; shell?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 8 Q-34 18 -18 18 L26 18 Q34 18 30 10 Q26 4 16 6 Z" fill="#a7e0c8" />
    <circle cx={-2} cy={2} r={17} fill={shell} stroke="#e0930f" strokeWidth={2.5} />
    <circle cx={-2} cy={2} r={11} fill="none" stroke="#e0930f" strokeWidth={2.5} />
    <circle cx={-2} cy={2} r={5} fill="none" stroke="#e0930f" strokeWidth={2.5} />
    <path d="M22 12 Q30 12 30 2 Q38 -2 34 6" fill="#a7e0c8" />
    <g transform="translate(28 4)"><Face r={10} expr={expr} /></g>
    <line x1={30} y1={-4} x2={33} y2={-12} stroke="#7bbfa0" strokeWidth={2} strokeLinecap="round" /><circle cx={33} cy={-13} r={2} fill={INK} />
    <line x1={36} y1={-2} x2={40} y2={-9} stroke="#7bbfa0" strokeWidth={2} strokeLinecap="round" /><circle cx={40} cy={-10} r={2} fill={INK} />
  </g>;
}
export function Bee({ x = 0, y = 0, s = 1, expr = "happy" }: { x?: number; y?: number; s?: number; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={-2} cy={-12} rx={11} ry={9} fill="#e8f1ff" opacity={0.85} stroke="#cfe0f5" /><ellipse cx={10} cy={-12} rx={11} ry={9} fill="#e8f1ff" opacity={0.85} stroke="#cfe0f5" />
    <ellipse cx={4} cy={4} rx={18} ry={14} fill="#ffb420" />
    <path d="M-6 -4 q6 8 22 3" stroke="#2a2440" strokeWidth={4} fill="none" /><path d="M-9 6 q9 8 27 2" stroke="#2a2440" strokeWidth={4} fill="none" />
    <g transform="translate(4 2)"><Face r={11} expr={expr} /></g>
    <line x1={-4} y1={-14} x2={-8} y2={-22} stroke={INK} strokeWidth={1.5} /><circle cx={-8} cy={-23} r={2} fill={INK} />
    <line x1={8} y1={-14} x2={12} y2={-22} stroke={INK} strokeWidth={1.5} /><circle cx={12} cy={-23} r={2} fill={INK} />
  </g>;
}
export function Duck({ x = 0, y = 0, s = 1, body = "#ffd84d", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={2} cy={16} rx={20} ry={14} fill={body} />
    <path d="M14 20 q14 -2 18 6 q-10 4 -18 -2 Z" fill={body} />
    <circle cx={-12} cy={-2} r={14} fill={body} />
    <path d="M-26 -2 q-8 0 -8 4 q0 4 8 3 Z" fill="#f59e0b" />
    <g transform="translate(-12 -2)"><Face r={11} expr={expr} /></g>
  </g>;
}
export function Cat({ x = 0, y = 0, s = 1, body = "#b39ddb", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={20} rx={16} ry={14} fill={body} />
    <path d="M14 22 q16 4 10 -8 q-2 8 -10 3 Z" fill={body} />
    <circle cx={0} cy={-4} r={18} fill={body} />
    <path d="M-16 -16 l-4 -14 l14 8 Z" fill={body} /><path d="M16 -16 l4 -14 l-14 8 Z" fill={body} />
    <path d="M-16 -16 l-2 -8 l7 5 Z" fill="#ff9aa8" /><path d="M16 -16 l2 -8 l-7 5 Z" fill="#ff9aa8" />
    <g transform="translate(0 -4)"><Face r={15} expr={expr} /></g>
  </g>;
}
export function Bird({ x = 0, y = 0, s = 1, body = "#4fc3f7", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={15} ry={17} fill={body} />
    <ellipse cx={-14} cy={8} rx={7} ry={11} fill="#fff" opacity={0.5} />
    <path d="M12 4 l12 -3 l-10 8 Z" fill="#f59e0b" />
    <g transform="translate(0 -6)"><Face r={12} expr={expr} /></g>
    <path d="M-2 24 l-4 8 M4 24 l4 8" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />
  </g>;
}
export function Robot({ x = 0, y = 0, s = 1, body = "#7fd1c9", expr = "happy" }: { x?: number; y?: number; s?: number; body?: string; expr?: Expr }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-14} y={12} width={28} height={26} rx={7} fill={body} stroke="#3aa79c" strokeWidth={2} />
    <circle cx={0} cy={24} r={5} fill="#ffb420" />
    <rect x={-16} y={-20} width={32} height={30} rx={10} fill={body} stroke="#3aa79c" strokeWidth={2} />
    <line x1={0} y1={-20} x2={0} y2={-30} stroke="#3aa79c" strokeWidth={2} /><circle cx={0} cy={-32} r={4} fill="#ffb420" />
    <g transform="translate(0 -6)"><Face r={13} expr={expr} /></g>
    <rect x={-22} y={16} width={8} height={16} rx={4} fill={body} /><rect x={14} y={16} width={8} height={16} rx={4} fill={body} />
  </g>;
}

// ---- scene backdrops & props ----
export function Sky({ from = "#bfe6ff", to = "#eaf7ff" }: { from?: string; to?: string }) {
  return <><defs><linearGradient id={`sky-${from.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} /></linearGradient></defs><rect x={0} y={0} width={320} height={220} fill={`url(#sky-${from.replace("#", "")})`} /></>;
}
export const Sun = ({ x = 44, y = 40, fill = "#ffd84d" }: { x?: number; y?: number; fill?: string }) => <g><circle cx={x} cy={y} r={20} fill={fill} />{Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={x + 24 * Math.cos(a)} y1={y + 24 * Math.sin(a)} x2={x + 31 * Math.cos(a)} y2={y + 31 * Math.sin(a)} stroke={fill} strokeWidth={3} strokeLinecap="round" />; })}</g>;
export const Cloud = ({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) => <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff"><ellipse cx={0} cy={0} rx={22} ry={14} /><ellipse cx={-18} cy={4} rx={14} ry={10} /><ellipse cx={18} cy={4} rx={14} ry={10} /></g>;
export const Hill = ({ y = 170, fill = "#8ed081" }: { y?: number; fill?: string }) => <path d={`M0 ${y} Q80 ${y - 40} 160 ${y} T320 ${y} V220 H0 Z`} fill={fill} />;
export const Ground = ({ y = 180, fill = "#a5d977" }: { y?: number; fill?: string }) => <rect x={0} y={y} width={320} height={220 - y} fill={fill} />;
export const Tree = ({ x = 0, y = 180, s = 1, fill = "#4caf76" }: { x?: number; y?: number; s?: number; fill?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-6} y={-26} width={12} height={30} rx={3} fill="#8d6e4e" /><circle cx={0} cy={-40} r={24} fill={fill} /><circle cx={-16} cy={-30} r={16} fill={fill} /><circle cx={16} cy={-30} r={16} fill={fill} /></g>;
export const Flower = ({ x = 0, y = 0, s = 1, petal = "#ff6b9d", center = "#ffd84d" }: { x?: number; y?: number; s?: number; petal?: string; center?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><line x1={0} y1={0} x2={0} y2={22} stroke="#4caf76" strokeWidth={3} />{Array.from({ length: 6 }).map((_, i) => { const a = (i / 6) * Math.PI * 2; return <ellipse key={i} cx={9 * Math.cos(a)} cy={9 * Math.sin(a)} rx={6} ry={4} fill={petal} transform={`rotate(${(a * 180) / Math.PI} ${9 * Math.cos(a)} ${9 * Math.sin(a)})`} />; })}<circle cx={0} cy={0} r={6} fill={center} /></g>;
export const Star = ({ x = 0, y = 0, s = 1, fill = "#ffd84d" }: { x?: number; y?: number; s?: number; fill?: string }) => <path transform={`translate(${x} ${y}) scale(${s / 9})`} d="M0 -9 L2.6 -2.8 L9 -2.8 L3.9 1.1 L5.6 7.3 L0 3.6 L-5.6 7.3 L-3.9 1.1 L-9 -2.8 L-2.6 -2.8 Z" fill={fill} />;
export const Pizza = ({ x = 0, y = 0, s = 1, slices = 4, eaten = 0 }: { x?: number; y?: number; s?: number; slices?: number; eaten?: number }) => <g transform={`translate(${x} ${y}) scale(${s})`}><circle cx={0} cy={0} r={38} fill="#f8d99a" />{Array.from({ length: slices }).map((_, i) => { const a0 = (i / slices) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / slices) * 2 * Math.PI - Math.PI / 2, r = 34; const p = (a: number) => [r * Math.cos(a), r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return <path key={i} d={`M0 0 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={i < slices - eaten ? "#e8b04b" : "#fff"} stroke="#c98a2e" strokeWidth={2} />; })}{Array.from({ length: slices - eaten }).map((_, i) => { const a = ((i + 0.5) / slices) * 2 * Math.PI - Math.PI / 2; return <circle key={i} cx={20 * Math.cos(a)} cy={20 * Math.sin(a)} r={4} fill="#c0392b" />; })}</g>;
export const Coin = ({ x = 0, y = 0, s = 1, label = "" }: { x?: number; y?: number; s?: number; label?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><circle cx={0} cy={0} r={14} fill="#ffd84d" stroke="#e0930f" strokeWidth={2.5} /><circle cx={0} cy={0} r={9} fill="none" stroke="#e0930f" strokeWidth={1.5} />{label && <text x={0} y={1} fontSize={10} fontWeight={800} fill="#8a5a0f" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display), Poppins, sans-serif">{label}</text>}</g>;
export const Box = ({ x = 0, y = 0, s = 1, fill = "#d9a066" }: { x?: number; y?: number; s?: number; fill?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-18} y={-14} width={36} height={28} rx={3} fill={fill} stroke="#a97a45" strokeWidth={2} /><path d="M-18 -6 H18" stroke="#a97a45" strokeWidth={2} /><path d="M0 -14 V14" stroke="#a97a45" strokeWidth={2} /></g>;
export const Balloon = ({ x = 0, y = 0, s = 1, fill = "#ff6b9d" }: { x?: number; y?: number; s?: number; fill?: string }) => <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx={0} cy={0} rx={13} ry={16} fill={fill} /><path d="M0 16 l-3 4 h6 Z" fill={fill} /><line x1={0} y1={20} x2={0} y2={44} stroke="#bbb" strokeWidth={1.2} /></g>;

export const FONT = "var(--font-display), Poppins, system-ui, sans-serif";
export function Speech({ x, y, w = 90, h = 40, text, tail = "left" }: { x: number; y: number; w?: number; h?: number; text: string; tail?: "left" | "right" }) {
  return <g><rect x={x} y={y} width={w} height={h} rx={12} fill="#fff" stroke="#2a2440" strokeWidth={2} /><path d={tail === "left" ? `M${x + 16} ${y + h} l0 12 l14 -12 Z` : `M${x + w - 16} ${y + h} l0 12 l-14 -12 Z`} fill="#fff" stroke="#2a2440" strokeWidth={2} /><text x={x + w / 2} y={y + h / 2} fontSize={14} fontWeight={800} fill="#2a2440" textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{text}</text></g>;
}
