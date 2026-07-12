import React from "react";
import * as K from "@/components/content/storyKit";
import type { StoryBook, CheckOption } from "./storybooks";

// ==========================================================
// SAMPLE — a single book in the new "clean" reader style
// (Let's-Read-inspired): portrait cover, centred image + text,
// slider + N/total. Original story, math embedded (sharing into
// equal parts). Set readerStyle "clean" so the reader adapts.
// ==========================================================

const num = (n: number): CheckOption => ({ num: String(n) });
const FONT = K.FONT;

function cake(cx: number, cy: number, r: number, parts: number) {
  const slices = Array.from({ length: parts }).map((_, i) => {
    const a0 = (i / parts) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / parts) * 2 * Math.PI - Math.PI / 2;
    const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill="#ffe0b0" stroke="#d98c4a" strokeWidth={2} />;
  });
  return <g><circle cx={cx} cy={cy} r={r + 4} fill="#f6a5c0" /><circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#e07aa0" strokeWidth={2} />{slices}<circle cx={cx} cy={cy} r={5} fill="#e0466f" /></g>;
}
const door = (x: number) => <g><rect x={x - 26} y={70} width={52} height={110} rx={4} fill="#7fb2e8" stroke="#4a7bb5" strokeWidth={3} /><circle cx={x + 16} cy={128} r={4} fill="#ffd84d" /></g>;

export const sampleBook: StoryBook = {
  id: "res-book-cake-to-share",
  title: "A Cake to Share",
  subtitle: "Sharing fairly into equal parts",
  author: "Eduversal MathQuest",
  level: "G1", audio: true, readerStyle: "clean",
  accent: "#e07aa0", coverFrom: "#ffe1ee", coverTo: "#fff5f9", titleColor: "#a11a52",
  characters: [{ name: "Mia", role: "who has just moved in" }, { name: "Tomo & Tara", role: "the kind twins next door" }],
  cover: <g><K.Sky from="#ffe1ee" to="#fff5f9" /><K.Ground y={180} fill="#a5d977" />{cake(160, 120, 46, 4)}<K.Kid x={70} y={172} s={1.05} skin="#8d5524" hair="#1a1a1a" hairStyle="curly" shirt="#e07aa0" expr="excited" /><K.Kid x={252} y={172} s={1.05} skin="#f2c19b" hairStyle="bun" hair="#3a2a1e" shirt="#4fc3f7" expr="happy" /></g>,
  pages: [
    { text: "Mia moves into a new home. Knock, knock! Who is at the door?", narration: "Mia moves into a new home. Knock, knock! Who is at the door?",
      scene: <g><K.Sky from="#ffe1ee" to="#fff5f9" /><K.Ground y={182} fill="#a5d977" />{door(120)}<K.Kid x={210} y={172} s={1.2} skin="#8d5524" hair="#1a1a1a" hairStyle="curly" shirt="#e07aa0" expr="surprised" /></g> },
    { text: "It is Tomo and Tara! \"Welcome!\" they cheer. They carry a big round cake.", narration: "It is Tomo and Tara! Welcome, they cheer. They carry a big round cake.",
      scene: <g><K.Sky from="#ffe1ee" to="#fff5f9" /><K.Ground y={182} fill="#a5d977" />{cake(160, 96, 34, 1)}<K.Kid x={90} y={174} s={1.1} skin="#f2c19b" hairStyle="bun" hair="#3a2a1e" shirt="#4fc3f7" expr="excited" arm="up" /><K.Kid x={230} y={174} s={1.1} skin="#ffdbb0" hairStyle="short" hair="#c65d2e" shirt="#8ed081" expr="excited" arm="up" /></g> },
    { text: "Two friends want to share. Mia cuts the cake into 2 equal parts. Each half is exactly the same size.", narration: "Two friends want to share. Mia cuts the cake into two equal parts. Each half is exactly the same size.",
      scene: <g><K.Sky from="#ffe1ee" to="#fff5f9" /><K.Ground y={182} fill="#a5d977" />{cake(150, 110, 46, 2)}<text x={250} y={100} fontSize={22} fontWeight={800} fill="#a11a52" textAnchor="middle" fontFamily={FONT}>2 halves</text><text x={250} y={130} fontSize={14} fontWeight={700} fill="#199473" textAnchor="middle" fontFamily={FONT}>equal parts</text></g> },
    { text: "Then one more friend arrives! Now they cut the cake into 4 equal parts — four fair quarters.", narration: "Then one more friend arrives! Now they cut the cake into four equal parts. Four fair quarters.",
      scene: <g><K.Sky from="#ffe1ee" to="#fff5f9" /><K.Ground y={182} fill="#a5d977" />{cake(150, 110, 46, 4)}<text x={250} y={100} fontSize={22} fontWeight={800} fill="#a11a52" textAnchor="middle" fontFamily={FONT}>4 quarters</text><text x={250} y={130} fontSize={14} fontWeight={700} fill="#199473" textAnchor="middle" fontFamily={FONT}>all the same</text></g> },
    { text: "Everyone gets a fair, equal slice. \"Sharing is sweet!\" they all laugh together.", narration: "Everyone gets a fair, equal slice. Sharing is sweet, they all laugh together.",
      scene: <g><K.Sky from="#fff3d6" to="#fffaf0" /><K.Ground y={182} fill="#a5d977" />{[70, 130, 190, 250].map((x, i) => <g key={i}><path d={`M${x} ${100} l16 -22 l16 22 Z`} fill="#ffe0b0" stroke="#d98c4a" strokeWidth={1.5} /><K.Kid x={x + 16} y={172} s={0.85} shirt={["#e07aa0", "#4fc3f7", "#8ed081", "#ffb420"][i]} hairStyle={["curly", "bun", "short", "pony"][i] as "curly"} expr="excited" /></g>)}<K.Star x={40} y={54} s={2.2} /><K.Star x={284} y={58} s={2.2} /></g> },
  ],
  check: [
    { prompt: "Mia shares with 1 friend. Into how many equal parts?", narration: "Into how many equal parts for two friends?", options: [num(2), num(3), num(4)], answer: 0 },
    { prompt: "Which cake is cut into FAIR, equal halves?", options: [
      { svg: <g><circle r={16} fill="#ffe0b0" stroke="#d98c4a" strokeWidth={2} /><line x1={0} y1={-16} x2={0} y2={16} stroke="#d98c4a" strokeWidth={2} /></g> },
      { svg: <g><circle r={16} fill="#ffe0b0" stroke="#d98c4a" strokeWidth={2} /><line x1={-9} y1={-13} x2={-9} y2={13} stroke="#d98c4a" strokeWidth={2} /></g> },
    ], answer: 0 },
    { prompt: "4 friends share. How many equal parts?", narration: "Four friends share. How many equal parts?", options: [num(2), num(4), num(6)], answer: 1 },
    { prompt: "Two equal parts of a whole are called…", options: [{ text: "halves" }, { text: "quarters" }], answer: 0 },
  ],
};
