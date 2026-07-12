import React from "react";

// ==========================================================
// coverKit — primitives shared by the library-cover renderers
// (GameCover, SimCover, BookCover). Kept default-free so each
// cover keeps its own palette/sizing via thin local wrappers,
// preserving the exact rendered output.
// ==========================================================

export const FONT = "var(--font-display), Poppins, system-ui, sans-serif";

export function CoverText({ x, y, t, s, fill, w = 800, anchor = "middle" }: {
  x: number; y: number; t: string; s: number; fill: string; w?: number; anchor?: "start" | "middle" | "end";
}) {
  return <text x={x} y={y} fontSize={s} fontWeight={w} fill={fill} textAnchor={anchor} dominantBaseline="central" fontFamily={FONT}>{t}</text>;
}

// five-point star used across covers
export const coverStar = (x: number, y: number, s: number, fill: string) => (
  <path transform={`translate(${x} ${y}) scale(${s / 9})`} d="M0 -9 L2.6 -2.8 L9 -2.8 L3.9 1.1 L5.6 7.3 L0 3.6 L-5.6 7.3 L-3.9 1.1 L-9 -2.8 L-2.6 -2.8 Z" fill={fill} />
);
