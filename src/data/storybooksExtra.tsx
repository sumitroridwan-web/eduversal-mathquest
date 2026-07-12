import React from "react";
import * as K from "@/components/content/storyKit";
import type { StoryBook, CheckOption } from "./storybooks";

// ==========================================================
// MathQuest Storybooks — expansion batch (one per grade).
// Text length grows deliberately with grade: Nursery is a few
// words per page; Grade 6 is several full sentences.
// ==========================================================

const num = (n: number): CheckOption => ({ num: String(n) });
function rowX(n: number, gap: number, cx: number, make: (x: number, i: number) => React.ReactNode) {
  const x0 = cx - ((n - 1) * gap) / 2;
  return Array.from({ length: n }).map((_, i) => <React.Fragment key={i}>{make(x0 + i * gap, i)}</React.Fragment>);
}
const FONT = K.FONT;

// small inline props
const kite = (x: number, y: number, s: number, fill: string) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 -16 L12 0 L0 16 L-12 0 Z" fill={fill} stroke="#fff" strokeWidth={1.5} /><line x1={0} y1={16} x2={0} y2={40} stroke="#8a5a0f" strokeWidth={1.5} />{[22, 30, 38].map((yy, i) => <path key={i} d={`M0 ${yy} q4 4 0 8`} stroke="#f43f5e" strokeWidth={1.5} fill="none" />)}</g>;
const egg = (x: number, y: number, fill = "#fff8e7") => <ellipse cx={x} cy={y} rx={7} ry={9} fill={fill} stroke="#e0cfa0" strokeWidth={1.5} />;

export const extraBooks: StoryBook[] = [
  // ---------- NURSERY — comparing size ----------
  {
    id: "res-book-big-little-duck", title: "Big Duck, Little Duck", subtitle: "A story about big and small",
    level: "EY", audio: true, accent: "#f59e0b", coverFrom: "#bfe6ff", coverTo: "#eaf7ff", titleColor: "#1b2540",
    characters: [{ name: "Bella", role: "the big duck" }, { name: "Pip", role: "the little duck" }],
    cover: <g><K.Sky /><K.Ground y={172} fill="#7ec8ff" /><K.Sun /><K.Duck x={110} y={150} s={2} expr="happy" /><K.Duck x={215} y={158} s={1} body="#ffe27a" expr="excited" /></g>,
    pages: [
      { text: "One big duck.", scene: <g><K.Sky /><K.Ground y={168} fill="#7ec8ff" /><K.Sun /><K.Duck x={160} y={150} s={2.2} expr="happy" /></g> },
      { text: "One little duck.", scene: <g><K.Sky /><K.Ground y={168} fill="#7ec8ff" /><K.Cloud x={80} y={50} /><K.Duck x={160} y={140} s={1} body="#ffe27a" expr="happy" /></g> },
      { text: "Big duck. Little duck.", scene: <g><K.Sky /><K.Ground y={168} fill="#7ec8ff" /><K.Duck x={110} y={150} s={2} /><K.Duck x={215} y={150} s={0.95} body="#ffe27a" /></g> },
      { text: "The big duck is tall!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={168} fill="#7ec8ff" /><K.Duck x={120} y={150} s={2.3} expr="proud" /><K.Duck x={220} y={150} s={0.9} body="#ffe27a" expr="surprised" /></g> },
      { text: "Big and little — best friends!", scene: <g><K.Sky /><K.Ground y={168} fill="#7ec8ff" /><K.Sun /><K.Duck x={120} y={150} s={2} expr="excited" /><K.Duck x={210} y={152} s={1} body="#ffe27a" expr="excited" /><K.Star x={60} y={60} s={2.2} /><K.Star x={270} y={64} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Tap the BIG duck 🦆", narration: "Tap the big duck.", options: [{ svg: <K.Duck x={0} y={4} s={0.5} /> }, { svg: <K.Duck x={0} y={2} s={0.28} body="#ffe27a" /> }], answer: 0 },
      { prompt: "Which one is little?", options: [{ emoji: "🦆" }, { emoji: "🐣" }], answer: 1 },
      { prompt: "Big or little? Tap the SMALL star ⭐", options: [{ svg: <K.Star x={0} y={0} s={4} /> }, { svg: <K.Star x={0} y={0} s={1.6} /> }], answer: 1 },
    ],
  },

  // ---------- KG — counting to 5 ----------
  {
    id: "res-book-five-kites", title: "Five Little Kites", subtitle: "Count the kites one to five",
    level: "KG", audio: true, accent: "#6366f1", coverFrom: "#dbe6ff", coverTo: "#eef3ff", titleColor: "#26346b",
    characters: [{ name: "Ama", role: "a girl who loves kites" }, { name: "the breeze", role: "that lifts them high" }],
    cover: <g><K.Sky from="#dbe6ff" to="#eef3ff" /><K.Ground y={180} fill="#9ccb7a" /><K.Sun x={50} y={44} />{kite(120, 60, 1.4, "#f43f5e")}{kite(200, 80, 1.1, "#14b8a6")}<K.Kid x={230} y={172} s={1.1} shirt="#6366f1" hairStyle="bun" hair="#1a1a1a" expr="excited" arm="up" /></g>,
    pages: [
      { text: "Ama flies one red kite. Count: one!", narration: "Ama flies one red kite. Count. One!", scene: <g><K.Sky from="#dbe6ff" to="#eef3ff" /><K.Ground y={176} fill="#9ccb7a" /><K.Sun />{kite(160, 70, 1.6, "#f43f5e")}<K.Kid x={160} y={168} s={1.1} shirt="#6366f1" hairStyle="bun" expr="happy" arm="up" /></g> },
      { text: "Two kites dance in the wind. One, two!", narration: "Two kites dance in the wind. One, two!", scene: <g><K.Sky from="#dbe6ff" to="#eef3ff" /><K.Ground y={176} fill="#9ccb7a" />{rowX(2, 90, 160, (x) => kite(x, 70, 1.3, "#14b8a6"))}<K.Kid x={160} y={168} s={1} shirt="#6366f1" hairStyle="bun" expr="excited" arm="up" /></g> },
      { text: "Three kites climb higher. Count to three!", narration: "Three kites climb higher. Count to three!", scene: <g><K.Sky from="#dbe6ff" to="#eef3ff" /><K.Ground y={176} fill="#9ccb7a" />{rowX(3, 70, 160, (x, i) => kite(x, 66, 1.2, ["#f43f5e", "#14b8a6", "#f59e0b"][i]))}</g> },
      { text: "Four kites, then five! Count them all: five!", narration: "Four kites, then five! Count them all. Five!", scene: <g><K.Sky from="#dbe6ff" to="#eef3ff" /><K.Ground y={176} fill="#9ccb7a" />{rowX(5, 56, 160, (x, i) => kite(x, 64, 1, ["#f43f5e", "#14b8a6", "#f59e0b", "#6366f1", "#22c55e"][i]))}</g> },
      { text: "Five happy kites in the sky. Hooray, Ama!", narration: "Five happy kites in the sky. Hooray, Ama!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={176} fill="#9ccb7a" />{rowX(5, 54, 160, (x, i) => kite(x, 60, 0.95, ["#f43f5e", "#14b8a6", "#f59e0b", "#6366f1", "#22c55e"][i]))}<K.Kid x={160} y={170} s={1.1} shirt="#6366f1" hairStyle="bun" expr="excited" arm="wave" /></g> },
    ],
    check: [
      { prompt: "How many kites? 🪁🪁🪁", narration: "How many kites?", options: [num(2), num(3), num(4)], answer: 1 },
      { prompt: "Tap the group of FIVE", options: [{ emoji: "🪁🪁🪁🪁" }, { emoji: "🪁🪁🪁🪁🪁" }], answer: 1 },
      { prompt: "Ama had five kites. How many is that?", narration: "How many kites did Ama have?", options: [num(5), num(3), num(4)], answer: 0 },
    ],
  },

  // ---------- GRADE 1 — number bonds to 10 ----------
  {
    id: "res-book-ten-nest", title: "Ten in the Nest", subtitle: "Making ten with the birds",
    level: "G1", audio: true, accent: "#22c55e", coverFrom: "#d7f6df", coverTo: "#eefbf1", titleColor: "#14663a",
    characters: [{ name: "Mama Robin", role: "who counts her chicks" }, { name: "the chicks", role: "who fly and return" }],
    cover: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={182} fill="#8ed081" /><K.Tree x={160} y={200} s={2.2} />{rowX(4, 22, 160, (x) => egg(x, 110))}<K.Bird x={230} y={90} s={1} body="#4fc3f7" expr="happy" /></g>,
    pages: [
      { text: "Mama Robin has ten chicks in her cosy nest.", narration: "Mama Robin has ten chicks in her cosy nest.", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={182} fill="#8ed081" /><K.Tree x={90} y={200} s={2} /><g transform="translate(180 110)"><path d="M-42 0 q42 26 84 0 q-6 18 -42 18 q-36 0 -42 -18 Z" fill="#a9793f" />{rowX(5, 16, 0, (x) => egg(x, -4))}</g><K.Bird x={180} y={70} s={1} body="#c65d2e" expr="proud" /></g> },
      { text: "Six chicks stay warm. Four chicks fly out to play. Six and four make ten!", narration: "Six chicks stay warm. Four chicks fly out to play. Six and four make ten!", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={182} fill="#8ed081" /><g transform="translate(90 120)"><path d="M-40 0 q40 22 80 0 q-6 16 -40 16 q-34 0 -40 -16 Z" fill="#a9793f" />{rowX(3, 18, 0, (x) => egg(x, -2))}{rowX(3, 18, 0, (x) => egg(x, 8))}</g>{rowX(4, 26, 230, (x, i) => <K.Bird x={x} y={70 + (i % 2) * 14} s={0.7} body="#4fc3f7" expr="happy" />)}<text x={160} y={172} fontSize={18} fontWeight={800} fill="#14663a" textAnchor="middle" fontFamily={FONT}>6 + 4 = 10</text></g> },
      { text: "Then seven fly home and three stay out. Seven and three also make ten!", narration: "Then seven fly home and three stay out. Seven and three also make ten!", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={182} fill="#8ed081" /><g transform="translate(90 122)">{rowX(4, 16, 0, (x) => egg(x, -4))}{rowX(3, 16, 0, (x) => egg(x, 8))}</g>{rowX(3, 26, 235, (x) => <K.Bird x={x} y={78} s={0.7} body="#f59e0b" expr="excited" />)}<text x={160} y={172} fontSize={18} fontWeight={800} fill="#14663a" textAnchor="middle" fontFamily={FONT}>7 + 3 = 10</text></g> },
      { text: "\"There are always ten,\" smiles Mama Robin, \"no matter how they split.\"", narration: "There are always ten, smiles Mama Robin, no matter how they split.", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={182} fill="#8ed081" /><K.Bird x={100} y={120} s={1.5} body="#c65d2e" expr="happy" /><g transform="translate(210 120)">{rowX(5, 16, 0, (x) => egg(x, -4))}{rowX(5, 16, 0, (x) => egg(x, 8))}</g><K.Speech x={70} y={40} w={120} text="Always ten!" /></g> },
      { text: "As the sun sets, all ten chicks snuggle back home. Goodnight, little birds!", narration: "As the sun sets, all ten chicks snuggle back home. Goodnight, little birds!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={182} fill="#8ed081" /><K.Tree x={160} y={202} s={2.2} /><g transform="translate(160 116)">{rowX(5, 15, 0, (x) => egg(x, -4))}{rowX(5, 15, 0, (x) => egg(x, 7))}</g><K.Star x={50} y={54} s={2} /><K.Star x={272} y={58} s={2} /></g> },
    ],
    check: [
      { prompt: "6 + 4 = ?", narration: "Six plus four equals?", options: [num(9), num(10), num(8)], answer: 1 },
      { prompt: "7 chicks are home. How many flew out to make 10?", options: [num(2), num(3), num(4)], answer: 1 },
      { prompt: "Which pair makes 10?", options: [{ text: "5 + 5" }, { text: "5 + 4" }, { text: "6 + 3" }], answer: 0 },
      { prompt: "8 + 2 = ?", narration: "Eight plus two equals?", options: [num(10), num(9), num(6)], answer: 0 },
    ],
  },

  // ---------- GRADE 2 — add & subtract within 20 ----------
  {
    id: "res-book-bus-stop", title: "The Number Bus", subtitle: "Adding and taking away riders",
    level: "G2", audio: true, accent: "#f59e0b", coverFrom: "#ffe9c9", coverTo: "#fff7ea", titleColor: "#7a3d00",
    characters: [{ name: "Driver Deb", role: "the friendly bus driver" }, { name: "the riders", role: "who hop on and off" }],
    cover: <g><K.Sky from="#ffe9c9" to="#fff7ea" /><K.Ground y={176} fill="#c9b48a" /><K.Sun x={48} y={40} /><g transform="translate(160 120)"><rect x={-70} y={-30} width={150} height={54} rx={10} fill="#f59e0b" stroke="#c67f0a" strokeWidth={2} />{rowX(4, 30, -10, (x) => <circle cx={x} cy={-14} r={9} fill="#fff" />)}<circle cx={-50} cy={30} r={11} fill="#333" /><circle cx={55} cy={30} r={11} fill="#333" /></g></g>,
    pages: [
      { text: "Driver Deb starts her round with 5 riders on the Number Bus.", narration: "Driver Deb starts her round with five riders on the Number Bus.", scene: bus(5) },
      { text: "At Maple Stop, 4 more riders climb aboard. Five plus four is nine riders now!", narration: "At Maple Stop, four more riders climb aboard. Five plus four is nine riders now!", scene: <g>{bus(9)}<text x={160} y={182} fontSize={16} fontWeight={800} fill="#7a3d00" textAnchor="middle" fontFamily={FONT}>5 + 4 = 9</text></g> },
      { text: "At Oak Stop, 3 riders hop off to visit the park. Nine take away three leaves six.", narration: "At Oak Stop, three riders hop off to visit the park. Nine take away three leaves six.", scene: <g>{bus(6)}<text x={160} y={182} fontSize={16} fontWeight={800} fill="#7a3d00" textAnchor="middle" fontFamily={FONT}>9 − 3 = 6</text></g> },
      { text: "Then 7 excited riders squeeze on for the fair. Six plus seven makes thirteen!", narration: "Then seven excited riders squeeze on for the fair. Six plus seven makes thirteen!", scene: <g>{bus(10)}<text x={160} y={182} fontSize={16} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={FONT}>6 + 7 = 13</text></g> },
      { text: "\"All change!\" calls Deb at the last stop. Everyone hops off with a happy wave.", narration: "All change, calls Deb at the last stop. Everyone hops off with a happy wave.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={176} fill="#c9b48a" />{bus(1)}{rowX(3, 40, 160, (x) => <K.Kid x={x} y={168} s={0.9} shirt="#14b8a6" expr="excited" arm="wave" />)}<K.Star x={50} y={54} s={2} /></g> },
    ],
    check: [
      { prompt: "5 + 4 = ?", narration: "Five plus four?", options: [num(8), num(9), num(10)], answer: 1 },
      { prompt: "9 riders, 3 hop off. How many left?", options: [num(5), num(6), num(7)], answer: 1 },
      { prompt: "6 + 7 = ?", narration: "Six plus seven?", options: [num(12), num(13), num(14)], answer: 1 },
      { prompt: "The bus had 10, then 2 got off. Now there are…", options: [num(8), num(12), num(9)], answer: 0 },
    ],
  },

  // ---------- GRADE 3 — measuring length ----------
  {
    id: "res-book-long-jump", title: "The Long Jump Champions", subtitle: "Measuring how far in centimetres",
    level: "G3", audio: false, accent: "#14b8a6", coverFrom: "#c9f0ea", coverTo: "#eefbf9", titleColor: "#0c6b58",
    characters: [{ name: "Coach Ola", role: "who holds the measuring tape" }, { name: "Frog & Flea", role: "the two jumpers" }],
    cover: <g><K.Sky from="#c9f0ea" to="#eefbf9" /><K.Ground y={176} fill="#9ccb7a" /><rect x={30} y={172} width={260} height={8} fill="#fff5e0" stroke="#f59e0b" />{rowX(14, 19, 160, (x) => <line x1={x} y1={172} x2={x} y2={178} stroke="#f59e0b" strokeWidth={1} />)}<text x={90} y={150} fontSize={26}>🐸</text><K.Kid x={250} y={166} s={1.1} shirt="#14b8a6" hairStyle="curly" hair="#1a1a1a" expr="excited" /></g>,
    pages: [
      { text: "Sports day! Coach Ola rolls out a long measuring tape marked in centimetres for the big jump contest.", scene: <g><K.Sky from="#c9f0ea" to="#eefbf9" /><K.Ground y={176} fill="#9ccb7a" />{tape(140)}<K.Kid x={250} y={164} s={1.1} shirt="#14b8a6" hairStyle="curly" expr="happy" /></g> },
      { text: "Frog leaps first. He lands right on the 60 centimetre mark. \"A mighty 60 cm!\" cheers Coach Ola.", scene: <g><K.Sky from="#c9f0ea" to="#eefbf9" /><K.Ground y={176} fill="#9ccb7a" />{tape(100)}<text x={40 + (60 / 100) * 220} y={150} fontSize={24}>🐸</text><text x={160} y={130} fontSize={18} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>60 cm</text></g> },
      { text: "Tiny Flea springs next. She reaches the 45 centimetre mark — shorter than Frog by fifteen centimetres.", scene: <g><K.Sky from="#c9f0ea" to="#eefbf9" /><K.Ground y={176} fill="#9ccb7a" />{tape(100)}<circle cx={40 + (45 / 100) * 220} cy={150} r={5} fill="#7c3aed" /><text x={160} y={130} fontSize={16} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>60 − 45 = 15 cm</text></g> },
      { text: "\"To find who jumped further, we compare the marks,\" explains Coach Ola. \"Sixty is greater than forty-five.\"", scene: <g><K.Sky from="#c9f0ea" to="#eefbf9" /><K.Ground y={176} fill="#9ccb7a" /><text x={110} y={100} fontSize={20} fontWeight={800} fill="#14b8a6" textAnchor="middle" fontFamily={FONT}>🐸 60 cm</text><text x={160} y={100} fontSize={22} fontWeight={800} fill="#1b2540" textAnchor="middle" fontFamily={FONT}>&gt;</text><text x={215} y={100} fontSize={18} fontWeight={800} fill="#7c3aed" textAnchor="middle" fontFamily={FONT}>45 cm</text><K.Kid x={160} y={168} s={1.1} shirt="#14b8a6" hairStyle="curly" expr="proud" /></g> },
      { text: "Frog wins the golden medal, but both jumpers get an ice cream. Measuring made the contest fair!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={176} fill="#9ccb7a" /><text x={110} y={150} fontSize={30}>🐸</text><K.Star x={110} y={110} s={3} /><K.Kid x={220} y={166} s={1.1} shirt="#14b8a6" hairStyle="curly" expr="excited" arm="up" /></g> },
    ],
    check: [
      { prompt: "How far did Frog jump?", options: [{ text: "45 cm" }, { text: "60 cm" }, { text: "15 cm" }], answer: 1 },
      { prompt: "How much further did Frog jump than Flea?", narration: "How much further did Frog jump than Flea?", options: [{ text: "15 cm" }, { text: "25 cm" }, { text: "5 cm" }], answer: 0 },
      { prompt: "Which is longer?", options: [{ text: "60 cm" }, { text: "45 cm" }], answer: 0 },
      { prompt: "100 cm is the same as…", options: [{ text: "1 metre" }, { text: "1 kilometre" }, { text: "10 metres" }], answer: 0 },
    ],
  },

  // ---------- GRADE 4 — decimals & money ----------
  {
    id: "res-book-decimal-bakery", title: "The Decimal Bakery", subtitle: "Prices, coins and tenths",
    level: "G4", audio: false, accent: "#c65d2e", coverFrom: "#ffe4cf", coverTo: "#fff5ec", titleColor: "#8a3d1a",
    characters: [{ name: "Baker Rosa", role: "who prices every treat" }, { name: "Sam", role: "a careful young customer" }],
    cover: <g><K.Sky from="#ffe4cf" to="#fff5ec" /><K.Ground y={182} fill="#e8c88a" /><rect x={40} y={96} width={110} height={20} rx={4} fill="#fff" stroke="#c65d2e" strokeWidth={2} /><text x={95} y={107} fontSize={13} fontWeight={800} fill="#8a3d1a" textAnchor="middle" fontFamily={FONT}>£2.50</text><K.Kid x={210} y={170} s={1.3} shirt="#c65d2e" hairStyle="bun" hair="#1a1a1a" expr="happy" /><K.Coin x={270} y={110} s={1.1} label="£1" /></g>,
    pages: [
      { text: "At the Decimal Bakery, every treat has a price written with a decimal point. A muffin costs £1.50 — that is one pound and fifty pence.", scene: <g><K.Sky from="#ffe4cf" to="#fff5ec" /><K.Ground y={182} fill="#e8c88a" /><rect x={100} y={80} width={120} height={30} rx={6} fill="#fff" stroke="#c65d2e" strokeWidth={2} /><text x={160} y={96} fontSize={20} fontWeight={800} fill="#8a3d1a" textAnchor="middle" fontFamily={FONT}>£1.50</text><K.Kid x={70} y={170} s={1.2} shirt="#c65d2e" hairStyle="bun" expr="happy" /></g> },
      { text: "\"The digit after the point shows tenths of a pound,\" says Baker Rosa. \"Five tenths is the same as fifty pence, or one half.\"", scene: <g><K.Sky from="#ffe4cf" to="#fff5ec" /><K.Ground y={182} fill="#e8c88a" /><g transform="translate(120 110)"><circle r={40} fill="#fff" stroke="#c65d2e" strokeWidth={2} /><path d="M0 0 L0 -40 A40 40 0 0 1 0 40 Z" fill="#ffcf9e" /></g><text x={230} y={104} fontSize={16} fontWeight={800} fill="#8a3d1a" textAnchor="middle" fontFamily={FONT}>0.5 = 50p</text><text x={230} y={128} fontSize={14} fontWeight={700} fill="#199473" textAnchor="middle" fontFamily={FONT}>= one half</text></g> },
      { text: "Sam buys a muffin for £1.50 and a juice for £0.70. He adds the pennies carefully: fifty and seventy make one hundred and twenty pence.", scene: <g><K.Sky from="#ffe4cf" to="#fff5ec" /><K.Ground y={182} fill="#e8c88a" /><text x={160} y={90} fontSize={20} fontWeight={800} fill="#8a3d1a" textAnchor="middle" fontFamily={FONT}>£1.50 + £0.70</text><text x={160} y={130} fontSize={26} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={FONT}>= £2.20</text><K.Coin x={90} y={160} s={1} label="£1" /><K.Coin x={125} y={160} s={1} label="£1" /><K.Coin x={200} y={160} s={0.9} label="20p" /></g> },
      { text: "He pays with a five-pound note. Rosa counts up the change: from £2.20 to £5.00 is two pounds and eighty pence — £2.80.", scene: <g><K.Sky from="#ffe4cf" to="#fff5ec" /><K.Ground y={182} fill="#e8c88a" /><rect x={90} y={80} width={90} height={34} rx={4} fill="#c9f0d6" stroke="#199473" strokeWidth={2} /><text x={135} y={98} fontSize={16} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>£5.00</text><text x={230} y={98} fontSize={14} fontWeight={700} fill="#8a3d1a" textAnchor="middle" fontFamily={FONT}>− £2.20</text><text x={160} y={150} fontSize={22} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={FONT}>change £2.80</text></g> },
      { text: "\"You lined up the decimal points perfectly,\" beams Rosa. Sam grins — decimals made every price and every coin make sense.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={182} fill="#e8c88a" /><K.Kid x={120} y={172} s={1.3} shirt="#c65d2e" hairStyle="bun" expr="excited" arm="up" /><K.Coin x={210} y={120} s={1.1} label="£1" /><K.Coin x={245} y={140} s={1} label="50p" /><K.Star x={60} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "£1.50 means one pound and…", options: [{ text: "15p" }, { text: "50p" }, { text: "5p" }], answer: 1 },
      { prompt: "The decimal 0.5 is the same as…", narration: "Zero point five is the same as?", options: [{ text: "one half" }, { text: "one fifth" }, { text: "five wholes" }], answer: 0 },
      { prompt: "£1.50 + £0.70 = ?", narration: "One pound fifty plus seventy pence?", options: [{ text: "£2.20" }, { text: "£2.00" }, { text: "£1.70" }], answer: 0 },
      { prompt: "Change from £5.00 after spending £2.20 is…", options: [{ text: "£2.80" }, { text: "£3.20" }, { text: "£2.20" }], answer: 0 },
    ],
  },

  // ---------- GRADE 5 — percentages ----------
  {
    id: "res-book-percent-party", title: "The Percent Party", subtitle: "Fractions, decimals and percent",
    level: "G5", audio: false, accent: "#7c3aed", coverFrom: "#ece0ff", coverTo: "#f7f2ff", titleColor: "#4c1d95",
    characters: [{ name: "Zara", role: "the party planner" }, { name: "Uncle Fen", role: "who loves a discount" }],
    cover: <g><K.Sky from="#ece0ff" to="#f7f2ff" /><K.Ground y={182} fill="#c9b3f0" /><K.Balloon x={70} y={70} fill="#f43f5e" /><K.Balloon x={110} y={60} fill="#14b8a6" /><rect x={150} y={90} width={120} height={22} rx={4} fill="#fff" stroke="#7c3aed" strokeWidth={2} /><rect x={150} y={90} width={60} height={22} rx={4} fill="#c77dff" /><text x={210} y={101} fontSize={12} fontWeight={800} fill="#4c1d95" textAnchor="middle" fontFamily={FONT}>50%</text><K.Kid x={250} y={172} s={1.1} shirt="#7c3aed" hairStyle="pony" expr="excited" /></g>,
    pages: [
      { text: "Zara is planning a party and the shop has a giant banner: \"50% off everything today!\" She wonders exactly what that means for her budget.", scene: <g><K.Sky from="#ece0ff" to="#f7f2ff" /><K.Ground y={182} fill="#c9b3f0" /><rect x={80} y={70} width={160} height={40} rx={8} fill="#7c3aed" /><text x={160} y={90} fontSize={20} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={FONT}>50% OFF!</text><K.Kid x={160} y={172} s={1.2} shirt="#7c3aed" hairStyle="pony" expr="think" /></g> },
      { text: "\"Per cent means out of one hundred,\" explains Uncle Fen. \"50% is 50 out of 100 — which is one half, or the decimal 0.5.\" He shades half a hundred-square to show it.", scene: <g><K.Sky from="#ece0ff" to="#f7f2ff" /><K.Ground y={182} fill="#c9b3f0" /><g transform="translate(96 46)">{Array.from({ length: 100 }).map((_, i) => { const c = i % 10, r = Math.floor(i / 10); return <rect key={i} x={c * 12} y={r * 12} width={11} height={11} rx={1} fill={i % 10 < 5 ? "#c77dff" : "#fff"} stroke="#d8c7f5" strokeWidth={0.6} />; })}</g><text x={250} y={110} fontSize={14} fontWeight={800} fill="#4c1d95" textAnchor="middle" fontFamily={FONT}>50/100</text><text x={250} y={132} fontSize={13} fontWeight={700} fill="#7c3aed" textAnchor="middle" fontFamily={FONT}>= 1/2 = 0.5</text></g> },
      { text: "A £20 gift costs half as much in the sale. Half of twenty pounds is ten pounds, so Zara pays just £10 and saves the other £10.", scene: <g><K.Sky from="#ece0ff" to="#f7f2ff" /><K.Ground y={182} fill="#c9b3f0" /><text x={160} y={80} fontSize={18} fontWeight={800} fill="#4c1d95" textAnchor="middle" fontFamily={FONT}>£20, 50% off</text><rect x={70} y={100} width={180} height={26} rx={6} fill="#eee" /><rect x={70} y={100} width={90} height={26} rx={6} fill="#c77dff" /><text x={160} y={148} fontSize={22} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={FONT}>pay £10, save £10</text></g> },
      { text: "The balloons are 25% off. \"Twenty-five per cent is one quarter,\" says Zara proudly. A £4 pack drops by £1 to only £3. Her mental maths is getting sharp!", scene: <g><K.Sky from="#ece0ff" to="#f7f2ff" /><K.Ground y={182} fill="#c9b3f0" /><K.Balloon x={80} y={80} fill="#f43f5e" /><K.Balloon x={115} y={70} fill="#14b8a6" /><text x={210} y={86} fontSize={16} fontWeight={800} fill="#4c1d95" textAnchor="middle" fontFamily={FONT}>25% = 1/4</text><text x={210} y={112} fontSize={16} fontWeight={800} fill="#199473" textAnchor="middle" fontFamily={FONT}>£4 → £3</text><K.Kid x={210} y={172} s={1.1} shirt="#7c3aed" hairStyle="pony" expr="proud" /></g> },
      { text: "With clever percentages, Zara throws the best party ever and still has money left over. \"Percent, fractions and decimals,\" she laughs, \"are three ways of saying the same thing!\"", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={182} fill="#c9b3f0" /><K.Balloon x={70} y={70} fill="#f43f5e" /><K.Balloon x={250} y={70} fill="#14b8a6" /><K.Kid x={160} y={172} s={1.2} shirt="#7c3aed" hairStyle="pony" expr="excited" arm="up" /><K.Star x={110} y={60} s={2} /><K.Star x={210} y={60} s={2} /></g> },
    ],
    check: [
      { prompt: "50% is the same as…", narration: "Fifty percent is the same as?", options: [{ text: "one half" }, { text: "one quarter" }, { text: "one fifth" }], answer: 0 },
      { prompt: "50% off a £20 gift means you pay…", options: [{ text: "£10" }, { text: "£15" }, { text: "£5" }], answer: 0 },
      { prompt: "25% is the same fraction as…", narration: "Twenty five percent equals which fraction?", options: [{ text: "1/2" }, { text: "1/4" }, { text: "1/3" }], answer: 1 },
      { prompt: "25% off a £4 pack makes it…", options: [{ text: "£3" }, { text: "£2" }, { text: "£1" }], answer: 0 },
    ],
  },

  // ---------- GRADE 6 — coordinates ----------
  {
    id: "res-book-treasure-coords", title: "The Treasure Coordinates", subtitle: "Plotting points to find the gold",
    level: "G6", audio: false, accent: "#199473", coverFrom: "#cdeee2", coverTo: "#eefbf6", titleColor: "#0c6b58",
    characters: [{ name: "Captain Indira", role: "a fearless map-reader" }, { name: "Bo", role: "her sharp-eyed first mate" }],
    cover: <g><K.Sky from="#cdeee2" to="#eefbf6" /><K.Ground y={182} fill="#d9c39a" />{grid(120, 40, 14, 4)}<text x={120 + 3 * 14} y={40 + (4 - 2) * 14 + 4} fontSize={16}>✖️</text><K.Kid x={250} y={172} s={1.1} shirt="#199473" hairStyle="cap" hair="#1a1a1a" expr="excited" /></g>,
    pages: [
      { text: "Captain Indira unrolls an ancient treasure map. Across it runs a grid of numbered lines — an x-axis going right and a y-axis going up — meeting at the origin, zero-zero.", scene: <g><K.Sky from="#cdeee2" to="#eefbf6" /><K.Ground y={186} fill="#d9c39a" />{grid(70, 40, 26, 5, true)}<K.Kid x={250} y={172} s={1.1} shirt="#199473" hairStyle="cap" expr="think" /></g> },
      { text: "\"Every point has two coordinates,\" says Indira. \"We always read the x-coordinate first — how far across — then the y-coordinate — how far up. The order matters!\"", scene: <g><K.Sky from="#cdeee2" to="#eefbf6" /><K.Ground y={186} fill="#d9c39a" />{grid(80, 40, 24, 5, true)}<circle cx={80 + 3 * 24} cy={40 + (5 - 2) * 24} r={6} fill="#f43f5e" /><text x={80 + 3 * 24} y={40 + 5 * 24 + 16} fontSize={13} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>(3, 2)</text></g> },
      { text: "The first clue reads: \"Start at (2, 4).\" Bo counts two squares across and four squares up, and plants a flag exactly on the crossing point. \"Spot on!\" nods the Captain.", scene: <g><K.Sky from="#cdeee2" to="#eefbf6" /><K.Ground y={186} fill="#d9c39a" />{grid(80, 36, 22, 6, true)}<text x={80 + 2 * 22} y={36 + (6 - 4) * 22 + 2} fontSize={16}>🚩</text><text x={80 + 2 * 22} y={36 + 6 * 22 + 16} fontSize={13} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>(2, 4)</text></g> },
      { text: "\"The gold is at (5, 3),\" whispers Indira. Bo moves five across and three up. His shovel strikes something hard — a heavy chest, buried for a hundred years, right where the coordinates crossed.", scene: <g><K.Sky from="#cdeee2" to="#eefbf6" /><K.Ground y={186} fill="#d9c39a" />{grid(70, 36, 22, 6, true)}<text x={70 + 5 * 22} y={36 + (6 - 3) * 22 + 2} fontSize={18}>💰</text><text x={70 + 5 * 22} y={36 + 6 * 22 + 16} fontSize={13} fontWeight={800} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>(5, 3)</text></g> },
      { text: "As they haul the treasure home, Bo grins: \"Two numbers found a spot the whole world had lost.\" Coordinates, it turns out, are the greatest treasure map of all.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#d9c39a" /><text x={110} y={140} fontSize={40}>💰</text><K.Kid x={210} y={172} s={1.2} shirt="#199473" hairStyle="cap" expr="excited" arm="up" /><K.Star x={60} y={56} s={2.2} /><K.Star x={270} y={60} s={2.2} /></g> },
    ],
    check: [
      { prompt: "In a coordinate pair, which do you read first?", narration: "Which coordinate do you read first?", options: [{ text: "x (across)" }, { text: "y (up)" }], answer: 0 },
      { prompt: "The point (2, 4) means…", options: [{ text: "2 across, 4 up" }, { text: "4 across, 2 up" }, { text: "2 up, 4 across" }], answer: 0 },
      { prompt: "The axes meet at the origin, which is…", narration: "The origin is at which point?", options: [{ text: "(0, 0)" }, { text: "(1, 1)" }, { text: "(0, 1)" }], answer: 0 },
      { prompt: "The gold at (5, 3): how many squares up?", options: [num(5), num(3), num(8)], answer: 1 },
    ],
  },
];

// ---- scene helpers used above ----
function bus(riders: number) {
  return <g><K.Sky from="#ffe9c9" to="#fff7ea" /><K.Ground y={176} fill="#c9b48a" /><K.Sun x={44} y={38} />
    <g transform="translate(160 118)">
      <rect x={-90} y={-34} width={190} height={62} rx={12} fill="#f59e0b" stroke="#c67f0a" strokeWidth={2.5} />
      <rect x={-84} y={-28} width={176} height={22} rx={5} fill="#cfeaff" />
      {rowX(Math.min(riders, 6), 27, 6, (x) => <circle cx={x} cy={-17} r={8} fill="#fff" stroke="#c67f0a" />)}
      <circle cx={-64} cy={28} r={13} fill="#333" /><circle cx={72} cy={28} r={13} fill="#333" />
      <text x={5} y={16} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={FONT}>{riders} riders</text>
    </g></g>;
}
function tape(cm: number) {
  return <g><rect x={30} y={168} width={260} height={12} rx={2} fill="#fff5e0" stroke="#f59e0b" strokeWidth={1.5} />{Array.from({ length: 11 }).map((_, i) => <g key={i}><line x1={40 + i * 22} y1={168} x2={40 + i * 22} y2={176} stroke="#c67f0a" strokeWidth={1.2} /><text x={40 + i * 22} y={164} fontSize={8} fontWeight={700} fill="#8a5a0f" textAnchor="middle" fontFamily={FONT}>{i * (cm / 10)}</text></g>)}</g>;
}
function grid(ox: number, oy: number, cell: number, n: number, labels = false) {
  return <g>
    {Array.from({ length: n + 1 }).map((_, i) => <g key={i}><line x1={ox + i * cell} y1={oy} x2={ox + i * cell} y2={oy + n * cell} stroke="#bcd6cc" strokeWidth={1} /><line x1={ox} y1={oy + i * cell} x2={ox + n * cell} y2={oy + i * cell} stroke="#bcd6cc" strokeWidth={1} /></g>)}
    <line x1={ox} y1={oy + n * cell} x2={ox + n * cell} y2={oy + n * cell} stroke="#1b2540" strokeWidth={2} />
    <line x1={ox} y1={oy} x2={ox} y2={oy + n * cell} stroke="#1b2540" strokeWidth={2} />
    {labels && Array.from({ length: n + 1 }).map((_, i) => <g key={i}>
      <text x={ox + i * cell} y={oy + n * cell + 12} fontSize={8} fontWeight={700} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>{i}</text>
      {i > 0 && <text x={ox - 8} y={oy + (n - i) * cell + 3} fontSize={8} fontWeight={700} fill="#0c6b58" textAnchor="middle" fontFamily={FONT}>{i}</text>}
    </g>)}
  </g>;
}
