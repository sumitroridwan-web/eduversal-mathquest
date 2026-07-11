import React from "react";
import * as K from "@/components/content/storyKit";

// ==========================================================
// MathQuest Storybooks — data-driven interactive e-books.
// Each book: leveled text + narration + cartoon SVG scenes +
// a matching cover + a short friendly end-of-book check.
// Add a new title by pushing another StoryBook object.
// ==========================================================

export type Level = "EY" | "KG" | "G1" | "G2" | "G3" | "G4" | "G5";

export interface CheckOption { emoji?: string; num?: string; text?: string; svg?: React.ReactNode }
export interface CheckItem { prompt: string; narration?: string; options: CheckOption[]; answer: number }
export interface StoryPage { text: string; narration?: string; scene: React.ReactNode }

export interface StoryBook {
  id: string;
  title: string;
  subtitle: string;
  level: Level;
  audio: boolean;
  accent: string; coverFrom: string; coverTo: string; titleColor?: string;
  characters: { name: string; role: string }[];
  cover: React.ReactNode; // illustration only; BookCover overlays the title
  pages: StoryPage[];
  check: CheckItem[];
}

const num = (n: number): CheckOption => ({ num: String(n) });

// helper: a row of identical things to count
function row(n: number, gap: number, y: number, cx: number, make: (x: number, i: number) => React.ReactNode) {
  const x0 = cx - ((n - 1) * gap) / 2;
  return Array.from({ length: n }).map((_, i) => <React.Fragment key={i}>{make(x0 + i * gap, i)}</React.Fragment>);
}

// ==========================================================
// 1. NURSERY — Counting to 3 — "Quack, Quack, Splash!"
// ==========================================================
const nurseryDucks: StoryBook = {
  id: "res-book-nursery-ducks",
  title: "Quack, Quack, Splash!",
  subtitle: "A counting-to-three story",
  level: "EY", audio: true,
  accent: "#f59e0b", coverFrom: "#bfe6ff", coverTo: "#eaf7ff", titleColor: "#1b2540",
  characters: [{ name: "Dot", role: "a happy little duckling" }, { name: "Mama Duck", role: "Dot's kind mama" }],
  cover: <g><K.Sky /><K.Hill y={165} fill="#8ed081" /><K.Ground y={175} fill="#7ec8ff" /><K.Sun x={54} y={44} /><K.Cloud x={250} y={50} />
    <K.Duck x={120} y={150} s={1.5} expr="excited" /><K.Duck x={200} y={158} s={1} body="#ffe27a" expr="happy" /></g>,
  pages: [
    { text: "One little duckling. Quack!", narration: "One little duckling. Quack!",
      scene: <g><K.Sky /><K.Ground y={165} fill="#7ec8ff" /><K.Sun /><K.Cloud x={250} y={45} /><K.Duck x={160} y={150} s={1.8} expr="happy" /><K.Star x={210} y={70} s={2} /></g> },
    { text: "Two little ducklings. Quack, quack!", narration: "Two little ducklings. Quack, quack!",
      scene: <g><K.Sky /><K.Ground y={165} fill="#7ec8ff" /><K.Sun /><K.Cloud x={60} y={50} />{row(2, 90, 152, 160, (x) => <K.Duck x={x} y={152} s={1.4} expr="happy" />)}</g> },
    { text: "Three little ducklings. Splash, splash, splash!", narration: "Three little ducklings. Splash, splash, splash!",
      scene: <g><K.Sky /><K.Ground y={162} fill="#7ec8ff" /><K.Sun />{row(3, 78, 150, 160, (x, i) => <K.Duck x={x} y={150} s={1.2} expr={i === 1 ? "excited" : "happy"} />)}</g> },
    { text: "Mama Duck counts them: one, two, three!", narration: "Mama Duck counts them. One, two, three!",
      scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={162} fill="#7ec8ff" /><K.Duck x={70} y={140} s={1.7} body="#ffcf3f" expr="proud" />{row(3, 56, 158, 205, () => <K.Duck x={0} y={0} s={0.85} expr="happy" />)}<K.Speech x={92} y={40} w={110} text="One, two, three!" /></g> },
    { text: "All together now. Three happy ducks! Hooray!", narration: "All together now. Three happy ducks! Hooray!",
      scene: <g><K.Sky /><K.Hill y={160} /><K.Ground y={170} fill="#7ec8ff" /><K.Sun />{row(3, 74, 150, 160, () => <K.Duck x={0} y={0} s={1.2} expr="excited" />)}<K.Star x={40} y={60} s={2.4} /><K.Star x={280} y={70} s={2.4} /></g> },
  ],
  check: [
    { prompt: "Tap how many ducks you see 🦆", narration: "Tap how many ducks you see.", options: [num(2), num(3), num(1)], answer: 1 },
    { prompt: "How many splashes? 💦💦", narration: "How many splashes?", options: [num(1), num(2), num(3)], answer: 1 },
    { prompt: "Which pond has THREE ducks?", options: [{ emoji: "🦆🦆" }, { emoji: "🦆🦆🦆" }, { emoji: "🦆" }], answer: 1 },
  ],
};

// ==========================================================
// 2. KG — Counting 1–5 in nature — "The Counting Garden"
// ==========================================================
const countingGarden: StoryBook = {
  id: "res-book-counting-garden",
  title: "The Counting Garden",
  subtitle: "Count from one to five",
  level: "KG", audio: true,
  accent: "#4caf76", coverFrom: "#d7f2c7", coverTo: "#f2fbe9", titleColor: "#1b2540",
  characters: [{ name: "Pip", role: "a slow, sleepy snail guide" }, { name: "Bea & Boo", role: "two busy bees" }],
  cover: <g><K.Sky from="#d7f2c7" to="#f2fbe9" /><K.Hill /><K.Ground /><K.Sun x={52} y={42} /><K.Tree x={40} /><K.Tree x={288} s={0.85} />
    <K.Flower x={130} y={178} /><K.Flower x={190} y={182} petal="#ffd84d" center="#ff6b9d" /><K.Snail x={160} y={192} s={1.4} expr="happy" /><K.Bee x={230} y={90} s={1} expr="excited" /></g>,
  pages: [
    { text: "One sleepy snail slides along a leaf. Count: one!", narration: "One sleepy snail slides along a leaf. Count. One!",
      scene: <g><K.Sky from="#d7f2c7" to="#f2fbe9" /><K.Hill /><K.Ground /><K.Sun /><K.Tree x={280} s={0.8} /><K.Snail x={150} y={175} s={1.7} expr="sleepy" /></g> },
    { text: "Two busy bees buzz by. Count: one, two!", narration: "Two busy bees buzz by. Count. One, two!",
      scene: <g><K.Sky from="#d7f2c7" to="#f2fbe9" /><K.Ground /><K.Sun /><K.Flower x={60} y={178} />{row(2, 96, 95, 165, () => <K.Bee x={0} y={0} s={1.2} expr="happy" />)}<K.Snail x={280} y={188} s={0.9} /></g> },
    { text: "Three little birds sing in the tree. One, two, three!", narration: "Three little birds sing in the tree. One, two, three!",
      scene: <g><K.Sky from="#d7f2c7" to="#f2fbe9" /><K.Hill /><K.Ground /><K.Tree x={160} y={200} s={1.6} />{row(3, 44, 120, 160, () => <K.Bird x={0} y={0} s={0.8} expr="happy" />)}<K.Snail x={60} y={190} s={0.9} /></g> },
    { text: "Four bright flowers open in the sun. Count to four!", narration: "Four bright flowers open in the sun. Count to four!",
      scene: <g><K.Sky from="#d7f2c7" to="#f2fbe9" /><K.Ground /><K.Sun />{row(4, 56, 168, 160, (x, i) => <K.Flower x={x} y={0} s={1.3} petal={["#ff6b9d", "#ffd84d", "#c77dff", "#4fc3f7"][i]} />)}<K.Snail x={280} y={196} s={0.85} expr="happy" /></g> },
    { text: "Five red apples on the tree. Let's count all five!", narration: "Five red apples on the tree. Let's count all five!",
      scene: <g><K.Sky from="#d7f2c7" to="#f2fbe9" /><K.Ground /><K.Tree x={160} y={210} s={2.1} fill="#4caf76" />{row(5, 34, 120, 160, () => <circle cx={0} cy={0} r={9} fill="#ef4444" stroke="#fff" strokeWidth={1.5} />)}<K.Snail x={60} y={198} s={0.9} expr="proud" /></g> },
  ],
  check: [
    { prompt: "How many bees? 🐝", narration: "How many bees?", options: [num(2), num(3), num(4)], answer: 0 },
    { prompt: "Tap the group of FOUR flowers 🌸", narration: "Tap the group of four flowers.", options: [{ emoji: "🌸🌸🌸" }, { emoji: "🌸🌸🌸🌸" }, { emoji: "🌸🌸" }], answer: 1 },
    { prompt: "How many apples did Pip count?", narration: "How many apples did Pip count?", options: [num(3), num(5), num(4)], answer: 1 },
  ],
};

// ==========================================================
// 3. GRADE 1 — 2D/3D shapes — "Adventures in Shape City"
// ==========================================================
function building(x: number, w: number, h: number, fill: string, roof?: "flat" | "tri" | "dome") {
  return <g><rect x={x} y={190 - h} width={w} height={h} rx={4} fill={fill} />{roof === "tri" && <path d={`M${x - 4} ${190 - h} L${x + w / 2} ${190 - h - 22} L${x + w + 4} ${190 - h} Z`} fill="#c65d2e" />}{roof === "dome" && <path d={`M${x} ${190 - h} q${w / 2} -${w / 2} ${w} 0 Z`} fill="#4fc3f7" />}<rect x={x + w / 2 - 6} y={190 - 22} width={12} height={22} fill="#6b4f2a" /></g>;
}
const shapeCity: StoryBook = {
  id: "res-book-shape-city",
  title: "Adventures in Shape City",
  subtitle: "A shape-hunt adventure",
  level: "G1", audio: true,
  accent: "#4fc3f7", coverFrom: "#cfe6ff", coverTo: "#eef6ff", titleColor: "#1b2540",
  characters: [{ name: "Remy", role: "a curious little robot" }, { name: "Mia", role: "Remy's clever friend" }],
  cover: <g><K.Sky from="#cfe6ff" to="#eef6ff" /><K.Ground y={190} fill="#9cc27a" />{building(30, 46, 78, "#ffb4a2", "tri")}{building(84, 54, 108, "#a2d2ff", "dome")}{building(150, 44, 70, "#ffd6a5")}
    <K.Robot x={228} y={170} s={1.5} expr="excited" /><K.Kid x={280} y={172} s={1.1} shirt="#c77dff" hairStyle="pony" expr="happy" /><K.Sun x={40} y={40} /></g>,
  pages: [
    { text: "Remy the robot rolls into Shape City. \"Let's find shapes!\" beeps Remy.", narration: "Remy the robot rolls into Shape City. Let's find shapes, beeps Remy.",
      scene: <g><K.Sky from="#cfe6ff" to="#eef6ff" /><K.Ground y={186} fill="#9cc27a" />{building(24, 50, 90, "#ffb4a2", "tri")}{building(84, 46, 70, "#a2d2ff")}{building(140, 40, 100, "#ffd6a5", "dome")}<K.Robot x={230} y={168} s={1.6} expr="excited" /><K.Sun x={44} y={38} /></g> },
    { text: "The bakery has round windows. A circle is round with no corners.", narration: "The bakery has round windows. A circle is round, with no corners!",
      scene: <g><K.Sky from="#cfe6ff" to="#eef6ff" /><K.Ground y={186} fill="#9cc27a" /><rect x={96} y={70} width={128} height={116} rx={8} fill="#ffd6a5" />{row(2, 44, 108, 160, () => <g><circle cx={0} cy={0} r={17} fill="#bfe6ff" stroke="#4fc3f7" strokeWidth={4} /></g>)}<rect x={148} y={150} width={24} height={36} fill="#c65d2e" /><K.Robot x={250} y={168} s={1.2} expr="happy" /></g> },
    { text: "Mia points at the roofs. \"Triangles!\" she smiles. A triangle has three sides.", narration: "Mia points at the roofs. Triangles, she smiles. A triangle has three sides!",
      scene: <g><K.Sky from="#cfe6ff" to="#eef6ff" /><K.Ground y={186} fill="#9cc27a" />{row(3, 62, 96, 130, () => <path d="M-22 20 L0 -20 L22 20 Z" fill="#ff8a5c" stroke="#c65d2e" strokeWidth={3} />)}<K.Kid x={250} y={168} s={1.2} shirt="#c77dff" hairStyle="pony" expr="excited" arm="up" /></g> },
    { text: "The builders stack cubes into a tower. A cube has six flat faces.", narration: "The builders stack cubes into a tower. A cube has six flat faces!",
      scene: <g><K.Sky from="#cfe6ff" to="#eef6ff" /><K.Ground y={186} fill="#9cc27a" />{[0, 1, 2].map((i) => <g key={i} transform={`translate(150 ${160 - i * 40})`}><rect x={-20} y={-20} width={40} height={40} fill="#a2d2ff" stroke="#4a7bb5" strokeWidth={2} /><path d="M-20 -20 l10 -10 h40 l-10 10 Z" fill="#c9e4ff" stroke="#4a7bb5" strokeWidth={2} /><path d="M20 -20 l10 -10 v40 l-10 10 Z" fill="#7fb2e8" stroke="#4a7bb5" strokeWidth={2} /></g>)}<K.Robot x={240} y={168} s={1.2} expr="proud" /></g> },
    { text: "\"Circles roll and cubes stack!\" cheer Remy and Mia. What a shape adventure!", narration: "Circles roll and cubes stack, cheer Remy and Mia. What a shape adventure!",
      scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#9cc27a" /><K.Sun /><K.Robot x={120} y={170} s={1.5} expr="excited" /><K.Kid x={200} y={172} s={1.3} shirt="#c77dff" hairStyle="pony" expr="excited" arm="wave" /><K.Star x={60} y={60} s={2.4} /><K.Star x={270} y={70} s={2.4} /></g> },
  ],
  check: [
    { prompt: "Which shape has NO corners?", narration: "Which shape has no corners?", options: [{ svg: <rect x={-14} y={-14} width={28} height={28} rx={3} fill="#ff8a5c" /> }, { svg: <circle cx={0} cy={0} r={15} fill="#4fc3f7" /> }, { svg: <path d="M-15 13 L0 -15 L15 13 Z" fill="#8ed081" /> }], answer: 1 },
    { prompt: "How many sides does a triangle have?", narration: "How many sides does a triangle have?", options: [num(4), num(3), num(6)], answer: 1 },
    { prompt: "How many faces does a cube have?", narration: "How many faces does a cube have?", options: [num(6), num(3), num(4)], answer: 0 },
    { prompt: "Which shape can you STACK to build a tower?", options: [{ emoji: "⚽" }, { emoji: "🧊" }, { emoji: "🔺" }], answer: 1 },
  ],
};

// ==========================================================
// 4. GRADE 2 — Money / adding to make amounts — "Market Day"
// ==========================================================
function stall(x: number, fill: string) {
  return <g><rect x={x} y={110} width={90} height={70} fill="#fff3df" stroke="#d9a066" strokeWidth={2} />{row(3, 26, 96, x + 45, () => <path d="M-14 0 q14 -20 28 0 Z" fill={fill} />)}<rect x={x} y={96} width={90} height={10} fill={fill} /><rect x={x - 4} y={96} width={98} height={6} fill="#c65d2e" /></g>;
}
const marketDay: StoryBook = {
  id: "res-book-market-day",
  title: "Market Day with Nana Ama",
  subtitle: "Counting coins to buy a treat",
  level: "G2", audio: true,
  accent: "#f59e0b", coverFrom: "#ffe6c2", coverTo: "#fff6e9", titleColor: "#7a3d00",
  characters: [{ name: "Kofi", role: "a boy with a coin purse" }, { name: "Nana Ama", role: "the kind market seller" }],
  cover: <g><K.Sky from="#ffe6c2" to="#fff6e9" /><K.Ground y={182} fill="#e8c88a" />{stall(24, "#ff8a5c")}{stall(206, "#8ed081")}
    <K.Kid x={150} y={168} s={1.4} skin="#8d5524" hair="#1a1a1a" hairStyle="short" shirt="#4fc3f7" expr="excited" /><K.Coin x={150} y={70} s={1.3} label="10p" /><K.Sun x={44} y={40} /></g>,
  pages: [
    { text: "It is market day! Kofi has a purse of shiny coins to spend.", narration: "It is market day! Kofi has a purse of shiny coins to spend.",
      scene: <g><K.Sky from="#ffe6c2" to="#fff6e9" /><K.Ground y={184} fill="#e8c88a" />{stall(180, "#8ed081")}<K.Kid x={90} y={168} s={1.5} skin="#8d5524" hair="#1a1a1a" shirt="#4fc3f7" expr="excited" arm="up" /><K.Coin x={60} y={100} s={1} label="5p" /><K.Coin x={92} y={104} s={1} label="2p" /><K.Coin x={124} y={100} s={1} label="1p" /></g> },
    { text: "\"A mango costs 10p,\" smiles Nana Ama. \"Can you make ten?\"", narration: "A mango costs ten pence, smiles Nana Ama. Can you make ten?",
      scene: <g><K.Sky from="#ffe6c2" to="#fff6e9" /><K.Ground y={184} fill="#e8c88a" />{stall(30, "#ffb420")}<K.Kid x={230} y={168} s={1.4} skin="#f2c19b" hairStyle="bun" hair="#6b4f2a" shirt="#ff6b9d" expr="happy" /><K.Speech x={150} y={40} w={120} text="Make 10p!" tail="right" /><circle cx={75} cy={130} r={13} fill="#ffb420" /></g> },
    { text: "Kofi puts down 5p and 5p. Five plus five makes ten!", narration: "Kofi puts down five pence and five pence. Five plus five makes ten!",
      scene: <g><K.Sky from="#ffe6c2" to="#fff6e9" /><K.Ground y={184} fill="#e8c88a" /><K.Coin x={90} y={110} s={1.7} label="5p" /><text x={160} y={112} fontSize={30} fontWeight={800} fill="#7a3d00" textAnchor="middle" fontFamily={K.FONT}>+</text><K.Coin x={230} y={110} s={1.7} label="5p" /><text x={160} y={170} fontSize={22} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={K.FONT}>5 + 5 = 10</text></g> },
    { text: "Now a banana costs 7p. Kofi uses 5p and 2p. Five plus two is seven!", narration: "Now a banana costs seven pence. Kofi uses five pence and two pence. Five plus two is seven!",
      scene: <g><K.Sky from="#ffe6c2" to="#fff6e9" /><K.Ground y={184} fill="#e8c88a" /><K.Coin x={95} y={108} s={1.6} label="5p" /><text x={160} y={110} fontSize={28} fontWeight={800} fill="#7a3d00" textAnchor="middle" fontFamily={K.FONT}>+</text><K.Coin x={225} y={108} s={1.6} label="2p" /><text x={160} y={168} fontSize={22} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={K.FONT}>5 + 2 = 7</text></g> },
    { text: "With a mango and a banana, Kofi skips home happy. Great counting, Kofi!", narration: "With a mango and a banana, Kofi skips home happy. Great counting, Kofi!",
      scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={184} fill="#e8c88a" /><K.Sun /><K.Kid x={150} y={170} s={1.5} skin="#8d5524" hair="#1a1a1a" shirt="#4fc3f7" expr="excited" arm="wave" /><circle cx={120} cy={120} r={12} fill="#ffb420" /><path d="M188 118 q10 -18 20 0 Z" fill="#ffd84d" /><K.Star x={60} y={60} s={2.4} /><K.Star x={260} y={70} s={2.4} /></g> },
  ],
  check: [
    { prompt: "Which coins make 10p?", narration: "Which coins make ten pence?", options: [{ text: "5p + 2p" }, { text: "5p + 5p" }, { text: "2p + 1p" }], answer: 1 },
    { prompt: "5 + 2 = ?", narration: "Five plus two equals?", options: [num(6), num(7), num(8)], answer: 1 },
    { prompt: "The mango is 10p. Kofi pays 5p. How many more pence?", narration: "The mango is ten pence. Kofi pays five pence. How many more pence?", options: [num(5), num(2), num(10)], answer: 0 },
  ],
};

// ==========================================================
// 5. GRADE 3 — Multiplication as arrays — "The Robo-Bakery"
// ==========================================================
function tray(x: number, y: number, rows: number, cols: number, s = 1) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-cols * 11 - 6} y={-rows * 11 - 6} width={cols * 22 + 12} height={rows * 22 + 12} rx={6} fill="#e8c88a" stroke="#c99a54" strokeWidth={2} />{Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((_, c) => <circle key={`${r}-${c}`} cx={-cols * 11 + c * 22 + 11} cy={-rows * 11 + r * 22 + 11} r={8} fill="#d98c4a" stroke="#b06a2e" strokeWidth={1} />))}</g>;
}
const roboBakery: StoryBook = {
  id: "res-book-robo-bakery",
  title: "The Robo-Bakery",
  subtitle: "Baking buns in neat rows",
  level: "G3", audio: false,
  accent: "#7fd1c9", coverFrom: "#d3f3ef", coverTo: "#eefbf9", titleColor: "#0c6b58",
  characters: [{ name: "Biscuit", role: "a cheerful baker-bot" }, { name: "Ada", role: "the baker's apprentice" }],
  cover: <g><K.Sky from="#d3f3ef" to="#eefbf9" /><K.Ground y={184} fill="#cbb089" />{tray(96, 120, 3, 4, 1.05)}<K.Robot x={230} y={168} s={1.5} body="#7fd1c9" expr="happy" /><K.Kid x={54} y={172} s={1.1} shirt="#ffb420" hairStyle="curly" hair="#3a2a1e" expr="excited" /><rect x={0} y={40} width={320} height={4} fill="#f59e0b" opacity={0.3} /></g>,
  pages: [
    { text: "Beep-boop! Biscuit the baker-bot is filling the trays for the morning rush.", narration: "Beep boop! Biscuit the baker bot is filling the trays for the morning rush.",
      scene: <g><K.Sky from="#d3f3ef" to="#eefbf9" /><K.Ground y={184} fill="#cbb089" /><K.Robot x={110} y={168} s={1.7} body="#7fd1c9" expr="excited" />{tray(230, 130, 2, 3, 1)}</g> },
    { text: "Ada asks, \"How many buns on this tray?\" Biscuit lays them in 3 rows of 4.", narration: "Ada asks, how many buns on this tray? Biscuit lays them in three rows of four.",
      scene: <g><K.Sky from="#d3f3ef" to="#eefbf9" /><K.Ground y={188} fill="#cbb089" />{tray(150, 110, 3, 4, 1.15)}<K.Kid x={54} y={170} s={1.1} shirt="#ffb420" hairStyle="curly" expr="think" /></g> },
    { text: "\"Count in fours!\" says Ada. 4, 8, 12. Three rows of four make twelve buns.", narration: "Count in fours, says Ada. Four, eight, twelve. Three rows of four make twelve buns.",
      scene: <g><K.Sky from="#d3f3ef" to="#eefbf9" /><K.Ground y={188} fill="#cbb089" />{tray(120, 100, 3, 4, 1.05)}<text x={120} y={162} fontSize={20} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={K.FONT}>3 × 4 = 12</text><K.Robot x={250} y={168} s={1.2} body="#7fd1c9" expr="proud" /></g> },
    { text: "A big party needs more! Biscuit bakes 5 rows of 5. That is 25 cookies.", narration: "A big party needs more! Biscuit bakes five rows of five. That is twenty five cookies.",
      scene: <g><K.Sky from="#d3f3ef" to="#eefbf9" /><K.Ground y={188} fill="#cbb089" />{tray(130, 108, 5, 5, 0.82)}<text x={130} y={170} fontSize={18} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={K.FONT}>5 × 5 = 25</text><K.Kid x={264} y={172} s={1} shirt="#ffb420" hairStyle="curly" expr="surprised" /></g> },
    { text: "The trays are full and the shop smells sweet. Rows and columns save the day!", narration: "The trays are full and the shop smells sweet. Rows and columns save the day!",
      scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={188} fill="#cbb089" />{tray(80, 120, 2, 3, 0.8)}{tray(200, 120, 3, 3, 0.8)}<K.Robot x={140} y={172} s={1.2} body="#7fd1c9" expr="excited" /><K.Star x={40} y={54} s={2.2} /><K.Star x={280} y={60} s={2.2} /></g> },
  ],
  check: [
    { prompt: "3 rows of 4 buns = ?", narration: "Three rows of four buns equals?", options: [num(7), num(12), num(9)], answer: 1 },
    { prompt: "Which array shows 2 × 3?", options: [{ svg: <g>{[0, 1].map((r) => [0, 1, 2].map((c) => <circle key={`${r}-${c}`} cx={-11 + c * 11} cy={-5 + r * 11} r={4} fill="#d98c4a" />))}</g> }, { svg: <g>{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}-${c}`} cx={-11 + c * 11} cy={-11 + r * 11} r={4} fill="#d98c4a" />))}</g> }], answer: 0 },
    { prompt: "5 rows of 5 cookies = ?", narration: "Five rows of five cookies equals?", options: [num(10), num(20), num(25)], answer: 2 },
    { prompt: "Counting in fours: 4, 8, __ ?", narration: "Counting in fours. Four, eight, what comes next?", options: [num(10), num(12), num(16)], answer: 1 },
  ],
};

// ==========================================================
// 6. GRADE 4 — Fractions of a whole — "The Great Fraction Feast"
// ==========================================================
const fractionFeast: StoryBook = {
  id: "res-book-fraction-feast",
  title: "The Great Fraction Feast",
  subtitle: "Sharing food in equal parts",
  level: "G4", audio: false,
  accent: "#ef6b8a", coverFrom: "#ffd9e2", coverTo: "#fff1f4", titleColor: "#8a1c3b",
  characters: [{ name: "Chef Nari", role: "a warm-hearted cook" }, { name: "The Four Friends", role: "hungry guests" }],
  cover: <g><K.Sky from="#ffd9e2" to="#fff1f4" /><K.Ground y={186} fill="#e8c88a" /><K.Pizza x={160} y={120} s={1.7} slices={4} eaten={0} />
    <K.Kid x={54} y={172} s={1.05} shirt="#4fc3f7" hairStyle="bun" hair="#1a1a1a" expr="happy" /><K.Kid x={268} y={172} s={1.05} shirt="#8ed081" hairStyle="curly" expr="excited" /><K.Sun x={44} y={40} /></g>,
  pages: [
    { text: "Chef Nari sets the table for a feast. Four friends arrive, all very hungry!", narration: "Chef Nari sets the table for a feast. Four friends arrive, all very hungry!",
      scene: <g><K.Sky from="#ffd9e2" to="#fff1f4" /><K.Ground y={186} fill="#e8c88a" />{row(4, 62, 168, 160, (x, i) => <K.Kid x={x} y={0} s={1} shirt={["#4fc3f7", "#8ed081", "#ffb420", "#c77dff"][i]} hairStyle={["bun", "curly", "short", "pony"][i] as "bun"} expr="happy" />)}</g> },
    { text: "\"One pizza, four friends,\" says Nari. \"Everyone gets an equal share.\"", narration: "One pizza, four friends, says Nari. Everyone gets an equal share.",
      scene: <g><K.Sky from="#ffd9e2" to="#fff1f4" /><K.Ground y={186} fill="#e8c88a" /><K.Pizza x={130} y={110} s={2} slices={4} /><K.Kid x={264} y={168} s={1.2} shirt="#4fc3f7" hairStyle="bun" expr="think" /></g> },
    { text: "The pizza is cut into 4 equal parts. Each friend gets one quarter — one fourth.",
      scene: <g><K.Sky from="#ffd9e2" to="#fff1f4" /><K.Ground y={186} fill="#e8c88a" /><K.Pizza x={110} y={110} s={1.9} slices={4} eaten={3} /><g transform="translate(230 110)"><text x={0} y={-14} fontSize={30} fontWeight={800} fill="#8a1c3b" textAnchor="middle" fontFamily={K.FONT}>1</text><line x1={-16} y1={0} x2={16} y2={0} stroke="#8a1c3b" strokeWidth={3} /><text x={0} y={20} fontSize={30} fontWeight={800} fill="#8a1c3b" textAnchor="middle" fontFamily={K.FONT}>4</text></g></g> },
    { text: "Then comes the cake, cut in 2 equal halves. Two quarters together make one half!",
      scene: <g><K.Sky from="#ffd9e2" to="#fff1f4" /><K.Ground y={186} fill="#e8c88a" /><g transform="translate(120 116)"><circle cx={0} cy={0} r={44} fill="#ffe0b0" stroke="#d9a066" strokeWidth={3} /><path d="M0 0 L0 -44 A44 44 0 0 1 0 44 Z" fill="#ffb4c8" stroke="#d9a066" strokeWidth={2} /></g><text x={235} y={116} fontSize={22} fontWeight={800} fill="#8a1c3b" textAnchor="middle" fontFamily={K.FONT}>2 quarters</text><text x={235} y={144} fontSize={20} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={K.FONT}>= 1 half</text></g> },
    { text: "Every plate is fair and equal. \"A perfect feast!\" everyone cheers together.", narration: "Every plate is fair and equal. A perfect feast, everyone cheers together.",
      scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#e8c88a" /><K.Pizza x={160} y={100} s={1.1} slices={4} />{row(3, 62, 172, 160, (x, i) => <K.Kid x={x} y={0} s={1} shirt={["#4fc3f7", "#8ed081", "#c77dff"][i]} hairStyle={["bun", "curly", "pony"][i] as "bun"} expr="excited" arm="up" />)}<K.Star x={40} y={54} s={2.2} /><K.Star x={280} y={60} s={2.2} /></g> },
  ],
  check: [
    { prompt: "One pizza shared by 4 friends. Each gets…", narration: "One pizza shared by four friends. Each gets?", options: [{ text: "one half" }, { text: "one quarter" }, { text: "one third" }], answer: 1 },
    { prompt: "Which picture shows one quarter shaded?", options: [{ svg: <g><circle r={16} fill="#fff" stroke="#d9a066" strokeWidth={2} /><path d="M0 0 L0 -16 A16 16 0 0 1 16 0 Z" fill="#ffb4c8" /></g> }, { svg: <g><circle r={16} fill="#fff" stroke="#d9a066" strokeWidth={2} /><path d="M0 0 L0 -16 A16 16 0 0 1 0 16 Z" fill="#ffb4c8" /></g> }], answer: 0 },
    { prompt: "How many quarters make one half?", narration: "How many quarters make one half?", options: [num(1), num(2), num(4)], answer: 1 },
    { prompt: "Equal shares means the parts are…", options: [{ text: "all the same size" }, { text: "different sizes" }], answer: 0 },
  ],
};

// ==========================================================
// 7. GRADE 5 — Data handling — "The Data Detectives"
// ==========================================================
function bar(x: number, h: number, fill: string, label: string) {
  return <g><rect x={x} y={168 - h} width={30} height={h} rx={3} fill={fill} stroke="#fff" strokeWidth={1.5} /><text x={x + 15} y={182} fontSize={12} fontWeight={700} fill="#31415f" textAnchor="middle" fontFamily={K.FONT}>{label}</text></g>;
}
const dataDetectives: StoryBook = {
  id: "res-book-data-detectives",
  title: "The Data Detectives",
  subtitle: "Cracking the case with graphs",
  level: "G5", audio: false,
  accent: "#6c8cff", coverFrom: "#dbe4ff", coverTo: "#eef2ff", titleColor: "#26346b",
  characters: [{ name: "Detective Zoya", role: "sharp-eyed data sleuth" }, { name: "Max", role: "her tally-keeping partner" }],
  cover: <g><K.Sky from="#dbe4ff" to="#eef2ff" /><K.Ground y={182} fill="#b9c6a8" /><rect x={96} y={70} width={128} height={104} rx={8} fill="#fff" stroke="#c1cbde" strokeWidth={2} />{bar(112, 40, "#6c8cff", "A")}{bar(150, 74, "#27ab83", "B")}{bar(188, 26, "#f59e0b", "C")}
    <K.Kid x={50} y={170} s={1.15} shirt="#31415f" hairStyle="pony" hair="#1a1a1a" expr="think" /><K.Kid x={272} y={172} s={1.1} shirt="#c65d2e" hairStyle="cap" hair="#3a2a1e" expr="happy" /></g>,
  pages: [
    { text: "A mystery at Maple School! Nobody knows which lunch is the class favourite. Detectives Zoya and Max are on the case.",
      scene: <g><K.Sky from="#dbe4ff" to="#eef2ff" /><K.Ground y={184} fill="#b9c6a8" /><K.Kid x={110} y={168} s={1.5} shirt="#31415f" hairStyle="pony" hair="#1a1a1a" expr="think" /><K.Kid x={215} y={170} s={1.4} shirt="#c65d2e" hairStyle="cap" expr="excited" /><text x={160} y={40} fontSize={16} fontWeight={800} fill="#26346b" textAnchor="middle" fontFamily={K.FONT}>The Lunch Mystery 🔍</text></g> },
    { text: "\"We need data,\" says Zoya. So they survey all 30 classmates and keep a tally of every answer.",
      scene: <g><K.Sky from="#dbe4ff" to="#eef2ff" /><K.Ground y={184} fill="#b9c6a8" /><rect x={70} y={60} width={180} height={104} rx={8} fill="#fff" stroke="#c1cbde" strokeWidth={2} />{["Pizza |||| |||", "Rice |||| ", "Noodles ||||"].map((t, i) => <text key={i} x={86} y={90 + i * 26} fontSize={13} fontWeight={700} fill="#31415f" fontFamily={K.FONT}>{t}</text>)}<K.Kid x={280} y={172} s={0.9} shirt="#31415f" hairStyle="pony" expr="happy" /></g> },
    { text: "Max turns the tallies into a bar chart. The tallest bar shows the most votes — that is the mode.",
      scene: <g><K.Sky from="#dbe4ff" to="#eef2ff" /><K.Ground y={184} fill="#b9c6a8" /><line x1={70} y1={168} x2={250} y2={168} stroke="#98a8c6" strokeWidth={2} />{bar(84, 76, "#6c8cff", "Pizza")}{bar(134, 44, "#27ab83", "Rice")}{bar(184, 30, "#f59e0b", "Noodle")}<K.Kid x={286} y={172} s={0.9} shirt="#c65d2e" hairStyle="cap" expr="proud" /></g> },
    { text: "\"Pizza wins with the tallest bar!\" But Zoya checks carefully — the chart must start at zero, or it can trick us.",
      scene: <g><K.Sky from="#dbe4ff" to="#eef2ff" /><K.Ground y={184} fill="#b9c6a8" /><line x1={80} y1={168} x2={240} y2={168} stroke="#98a8c6" strokeWidth={2} />{bar(96, 80, "#6c8cff", "Pizza")}{bar(150, 48, "#27ab83", "Rice")}<K.Kid x={276} y={170} s={1.1} shirt="#31415f" hairStyle="pony" expr="think" /><text x={150} y={44} fontSize={13} fontWeight={800} fill="#26346b" textAnchor="middle" fontFamily={K.FONT}>Start at 0!</text></g> },
    { text: "Case closed! The data proved pizza is the class favourite. \"Numbers never lie,\" grin the Data Detectives.",
      scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={184} fill="#b9c6a8" /><K.Kid x={120} y={170} s={1.4} shirt="#31415f" hairStyle="pony" expr="excited" arm="up" /><K.Kid x={210} y={172} s={1.3} shirt="#c65d2e" hairStyle="cap" expr="excited" arm="wave" /><K.Star x={50} y={56} s={2.4} /><K.Star x={270} y={60} s={2.4} /></g> },
  ],
  check: [
    { prompt: "What do we call the most common result?", options: [{ text: "the mean" }, { text: "the mode" }, { text: "the range" }], answer: 1 },
    { prompt: "On a bar chart, the biggest group has the…", options: [{ text: "shortest bar" }, { text: "tallest bar" }], answer: 1 },
    { prompt: "A fair bar chart should start its scale at…", narration: "A fair bar chart should start its scale at?", options: [num(0), num(1), num(10)], answer: 0 },
    { prompt: "The detectives asked 30 classmates. This is called a…", options: [{ text: "survey" }, { text: "story" }, { text: "guess" }], answer: 0 },
  ],
};

export const storybooks: StoryBook[] = [nurseryDucks, countingGarden, shapeCity, marketDay, roboBakery, fractionFeast, dataDetectives];

export function getStorybook(id: string): StoryBook | undefined {
  return storybooks.find((b) => b.id === id);
}
