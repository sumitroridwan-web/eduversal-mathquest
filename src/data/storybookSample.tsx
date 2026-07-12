import React from "react";
import * as R from "@/components/content/richArt";
import { Star } from "@/components/content/storyKit";
import type { StoryBook, CheckOption } from "./storybooks";

// ==========================================================
// SAMPLE — "clean" reader style with the richer picture-book
// illustration kit (richArt). Original math story: sharing a
// cake into equal parts (halves & quarters).
// ==========================================================

const num = (n: number): CheckOption => ({ num: String(n) });
const FONT = "var(--font-display), Poppins, system-ui, sans-serif";
const T = (x: number, y: number, t: string, s: number, fill: string) => <text x={x} y={y} fontSize={s} fontWeight={800} fill={fill} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{t}</text>;

// consistent cast
const MIA = { skin: "#8a5a2f", hair: "#201410", hairStyle: "afro" as const, shirt: "#e07aa0" };
const TOMO = { skin: "#d99a66", hair: "#7a3f1e", hairStyle: "short" as const, shirt: "#8ed081" };
const TARA = { skin: "#f2c19b", hair: "#3a2a1e", hairStyle: "bun" as const, shirt: "#4fc3f7" };

// small cake icon for the quick-check options
const miniCake = (line: "half" | "off") => <g>
  <circle r={16} fill="#ffdca8" stroke="#f6a5c0" strokeWidth={3} />
  <circle r={16} fill="none" stroke="#fff2df" strokeWidth={3} />
  {line === "half" ? <line x1={0} y1={-16} x2={0} y2={16} stroke="#e07aa0" strokeWidth={2} /> : <line x1={-8} y1={-14} x2={-8} y2={14} stroke="#e07aa0" strokeWidth={2} />}
  <circle r={3} fill="#e0466f" />
</g>;

export const sampleBook: StoryBook = {
  id: "res-book-cake-to-share",
  title: "A Cake to Share",
  subtitle: "Sharing fairly into equal parts",
  author: "Eduversal MathQuest",
  level: "G1", audio: true, readerStyle: "clean",
  accent: "#e07aa0", coverFrom: "#ffe6d8", coverTo: "#ffd0c6", titleColor: "#a11a52",
  characters: [{ name: "Mia", role: "who has just moved in" }, { name: "Tomo & Tara", role: "the kind neighbours" }],
  cover: <R.Painterly seed={1}>
    <R.Room from="#fff1e6" to="#ffd7cc" floor="#e8b98a" k="cov" /><R.Confetti seed={2} />
    <R.Cake cx={160} cy={116} r={42} candles={3} k="covc" />
    <R.RichKid x={90} y={170} s={1.15} k="covm" {...MIA} expr="excited" arm="up" />
    <R.RichKid x={232} y={170} s={1.15} k="covt" {...TARA} expr="happy" arm="up" flip />
  </R.Painterly>,
  pages: [
    {
      text: "Mia moves into a new home. Knock, knock! Who is at the door?",
      narration: "Mia moves into a new home. Knock, knock! Who is at the door?",
      scene: <R.Painterly seed={2}><R.Room from="#fdeede" to="#f7d6c2" floor="#e0ac7a" k="p1" /><R.Window x={258} y={40} /><R.Plant x={44} y={162} /><R.Door x={116} />
        <R.RichKid x={200} y={168} s={1.3} k="p1m" {...MIA} expr="surprised" look={-0.6} /></R.Painterly>,
    },
    {
      text: "It is Tomo and Tara! \"Welcome!\" they cheer, holding out a big round cake.",
      narration: "It is Tomo and Tara! Welcome, they cheer, holding out a big round cake.",
      scene: <R.Painterly seed={3}><R.Room from="#fff0e0" to="#ffd7cc" floor="#e8b98a" k="p2" /><R.Confetti seed={5} /><R.Balloon x={40} y={54} fill="#ff6b9d" k="p2a" /><R.Balloon x={288} y={62} fill="#4fc3f7" k="p2b" />
        <R.RichKid x={92} y={172} s={1.2} k="p2t" {...TOMO} expr="excited" arm="up" />
        <R.Cake cx={160} cy={104} r={30} candles={2} k="p2c" />
        <R.RichKid x={228} y={172} s={1.2} k="p2r" {...TARA} expr="excited" arm="up" flip /></R.Painterly>,
    },
    {
      text: "Two friends want to share. Mia cuts the cake into 2 equal parts. Each half is exactly the same size.",
      scene: <g><R.Painterly seed={4}><R.Room from="#fdeede" to="#f7d9c8" floor="#e0ac7a" k="p3" /><R.Rug />
        <R.Cake cx={132} cy={112} r={46} parts={2} k="p3c" />
        <R.RichKid x={288} y={186} s={0.95} k="p3m" {...MIA} expr="happy" /></R.Painterly>
        {T(244, 96, "2 halves", 22, "#a11a52")}{T(244, 124, "equal parts", 13, "#199473")}</g>,
    },
    {
      text: "Then one more friend arrives! Now they cut the cake into 4 equal parts — four fair quarters.",
      scene: <g><R.Painterly seed={5}><R.Room from="#fff0e0" to="#ffd7cc" floor="#e8b98a" k="p4" /><R.Rug fill="#c7e59a" />
        <R.Cake cx={132} cy={112} r={46} parts={4} k="p4c" />
        <R.RichKid x={288} y={186} s={0.95} k="p4t" {...TOMO} expr="excited" /></R.Painterly>
        {T(244, 96, "4 quarters", 22, "#a11a52")}{T(244, 124, "all the same", 13, "#199473")}</g>,
    },
    {
      text: "Everyone gets a fair, equal slice. \"Sharing is sweet!\" they all laugh together.",
      narration: "Everyone gets a fair, equal slice. Sharing is sweet, they all laugh together.",
      scene: <R.Painterly seed={6}><R.Room from="#fff4e0" to="#ffe0c8" floor="#e8b98a" k="p5" /><R.Confetti seed={9} />
        {[[70, MIA, false], [160, TOMO, false], [250, TARA, true]].map(([cx, c, fl], i) => <g key={i}>
          <path d={`M${Number(cx)} 96 l16 -24 l16 24 Z`} fill="#ffdca8" stroke="#f6a5c0" strokeWidth={2} />
          <circle cx={Number(cx) + 16} cy={84} r={3} fill="#e0466f" />
          <R.RichKid x={Number(cx) + 16} y={178} s={1} k={`p5${i}`} {...(c as typeof MIA)} expr="excited" flip={fl as boolean} />
        </g>)}
        <Star x={38} y={52} s={2.4} fill="#ffd84d" /><Star x={286} y={56} s={2.4} fill="#ffd84d" /></R.Painterly>,
    },
  ],
  check: [
    { prompt: "Mia shares with 1 friend. Into how many equal parts?", narration: "Into how many equal parts for two friends?", options: [num(2), num(3), num(4)], answer: 0 },
    { prompt: "Which cake is cut into FAIR, equal halves?", options: [{ svg: miniCake("half") }, { svg: miniCake("off") }], answer: 0 },
    { prompt: "4 friends share. How many equal parts?", narration: "Four friends share. How many equal parts?", options: [num(2), num(4), num(6)], answer: 1 },
    { prompt: "Two equal parts of a whole are called…", options: [{ text: "halves" }, { text: "quarters" }], answer: 0 },
  ],
};
