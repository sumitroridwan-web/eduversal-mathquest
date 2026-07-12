import React from "react";
import * as K from "@/components/content/storyKit";
import type { StoryBook, CheckOption } from "./storybooks";

// ==========================================================
// Storybooks — expansion batch 2. Fills flagged Cambridge gaps
// (mass, Venn/Carroll sorting, line graphs) plus position,
// comparing, subtraction, area/perimeter and negative numbers.
// Text length keeps growing with grade band.
// ==========================================================

const num = (n: number): CheckOption => ({ num: String(n) });
const FONT = K.FONT;
const Emoji = ({ x, y, s, e }: { x: number; y: number; s: number; e: string }) => <text x={x} y={y} fontSize={s} textAnchor="middle" dominantBaseline="central">{e}</text>;
function rowX(n: number, gap: number, cx: number, make: (x: number, i: number) => React.ReactNode) {
  const x0 = cx - ((n - 1) * gap) / 2;
  return Array.from({ length: n }).map((_, i) => <React.Fragment key={i}>{make(x0 + i * gap, i)}</React.Fragment>);
}
const T = (x: number, y: number, t: string, s: number, fill: string) => <text x={x} y={y} fontSize={s} fontWeight={800} fill={fill} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{t}</text>;

// ---- scene helpers ----
function seesaw(leftHeavy: boolean, leftE: string, rightE: string) {
  const a = leftHeavy ? 9 : -9;
  return <g>
    <g transform={`rotate(${a} 160 150)`}>
      <rect x={56} y={146} width={208} height={9} rx={4} fill="#c98a2e" />
      <Emoji x={82} y={130} s={30} e={leftE} /><Emoji x={238} y={130} s={26} e={rightE} />
    </g>
    <path d="M148 150 L172 150 L160 182 Z" fill="#1b2540" />
  </g>;
}
function venn() {
  return <g>
    <circle cx={124} cy={112} r={56} fill="#14b8a6" fillOpacity={0.18} stroke="#14b8a6" strokeWidth={2.5} />
    <circle cx={200} cy={112} r={56} fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeWidth={2.5} />
    {T(96, 58, "Stripes", 12, "#0c6b58")}{T(232, 58, "Big", 12, "#8a5a0f")}
    <Emoji x={92} y={110} s={22} e="🦓" /><Emoji x={162} y={112} s={22} e="🐅" /><Emoji x={228} y={104} s={22} e="🐘" /><Emoji x={228} y={140} s={20} e="🦏" />
  </g>;
}
function areaGrid(cols: number, rows: number, cx: number, cy: number, cell = 20, fill = "#8ed081") {
  const x0 = cx - (cols * cell) / 2, y0 = cy - (rows * cell) / 2;
  return <g>{Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((_, c) => <rect key={`${r}-${c}`} x={x0 + c * cell} y={y0 + r * cell} width={cell} height={cell} fill={fill} stroke="#fff" strokeWidth={1.5} />))}</g>;
}
function lineGraph(pts: number[], maxY = 30) {
  const x0 = 54, x1 = 280, y0 = 60, y1 = 160, n = pts.length;
  const px = (i: number) => x0 + (i / (n - 1)) * (x1 - x0);
  const py = (v: number) => y1 - (v / maxY) * (y1 - y0);
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)} ${py(v)}`).join(" ");
  return <g>
    <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="#98a8c6" strokeWidth={2} /><line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#98a8c6" strokeWidth={2} />
    {[0, 10, 20, 30].map((v) => T(x0 - 14, py(v), `${v}`, 9, "#6a80a9"))}
    <path d={d} fill="none" stroke="#ef4444" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    {pts.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r={4} fill="#ef4444" />)}
    {["Mon", "Tue", "Wed", "Thu", "Fri"].slice(0, n).map((d, i) => T(px(i), y1 + 12, d, 8, "#6a80a9"))}
  </g>;
}
function depthScale(sub: number) {
  const seaY = 78, unit = 20;
  return <g>
    <rect x={0} y={seaY} width={320} height={220 - seaY} fill="#8ecbff" opacity={0.55} />
    <line x1={40} y1={seaY} x2={40} y2={210} stroke="#1b2540" strokeWidth={2} />
    {[0, -1, -2, -3, -4, -5].map((v, i) => <g key={v}><line x1={36} y1={seaY + i * unit} x2={44} y2={seaY + i * unit} stroke="#1b2540" strokeWidth={2} />{T(24, seaY + i * unit, `${v}`, 10, "#1b2540")}</g>)}
    <circle cx={160} cy={seaY + Math.abs(sub) * unit} r={15} fill="#ffd84d" opacity={0.5} />
    <Emoji x={160} y={seaY + Math.abs(sub) * unit} s={26} e="🚤" />
  </g>;
}

export const extraBooks2: StoryBook[] = [
  // ---------- NURSERY — position words ----------
  {
    id: "res-book-where-momo", title: "Where Is Momo?", subtitle: "On, in and under",
    level: "EY", audio: true, accent: "#f59e0b", coverFrom: "#fff0d6", coverTo: "#fff8ec", titleColor: "#7a3d00",
    characters: [{ name: "Momo", role: "a playful little cat" }, { name: "the box", role: "her favourite hiding spot" }],
    cover: <g><K.Sky from="#fff0d6" to="#fff8ec" /><K.Ground y={176} fill="#e8c88a" /><K.Box x={160} y={150} s={1.6} /><K.Cat x={160} y={110} s={1.1} body="#b39ddb" expr="happy" /></g>,
    pages: [
      { text: "Momo sits ON the box.", narration: "Momo sits on the box.", scene: <g><K.Sky from="#fff0d6" to="#fff8ec" /><K.Ground y={170} fill="#e8c88a" /><K.Box x={160} y={150} s={1.8} /><K.Cat x={160} y={104} s={1.3} body="#b39ddb" expr="happy" /></g> },
      { text: "Momo hides IN the box.", narration: "Momo hides in the box.", scene: <g><K.Sky from="#fff0d6" to="#fff8ec" /><K.Ground y={170} fill="#e8c88a" /><K.Box x={160} y={150} s={2} /><Emoji x={160} y={130} s={26} e="🐱" /></g> },
      { text: "Momo naps UNDER the box.", narration: "Momo naps under the box.", scene: <g><K.Sky from="#fff0d6" to="#fff8ec" /><K.Ground y={170} fill="#e8c88a" /><K.Cat x={160} y={150} s={1.2} body="#b39ddb" expr="sleepy" /><rect x={110} y={96} width={100} height={44} rx={4} fill="#d9a066" stroke="#a97a45" strokeWidth={2} /></g> },
      { text: "Peep! Momo pops UP.", narration: "Peep! Momo pops up.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={170} fill="#e8c88a" /><K.Box x={160} y={155} s={1.8} /><K.Cat x={160} y={98} s={1.3} body="#b39ddb" expr="excited" /></g> },
      { text: "On, in, under — found you, Momo!", narration: "On, in, under. Found you, Momo!", scene: <g><K.Sky from="#fff0d6" to="#fff8ec" /><K.Ground y={170} fill="#e8c88a" /><K.Cat x={160} y={140} s={1.5} body="#b39ddb" expr="excited" /><K.Star x={60} y={60} s={2.2} /><K.Star x={260} y={64} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Tap the cat that is ON the box", options: [{ emoji: "🐱⬆️" }, { emoji: "📦🐱" }], answer: 0 },
      { prompt: "Where does Momo nap?", narration: "Where does Momo nap?", options: [{ text: "on" }, { text: "under" }, { text: "in" }], answer: 1 },
      { prompt: "🐱 is inside the 📦. She is…", options: [{ text: "in" }, { text: "on" }], answer: 0 },
    ],
  },

  // ---------- KG — comparing more / fewer ----------
  {
    id: "res-book-picnic-ants", title: "The Picnic Ants", subtitle: "More, fewer and the same",
    level: "KG", audio: true, accent: "#c65d2e", coverFrom: "#ffe6cf", coverTo: "#fff6ec", titleColor: "#8a3d1a",
    characters: [{ name: "the Red Ants", role: "a busy picnic team" }, { name: "the Black Ants", role: "their friendly rivals" }],
    cover: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={168} fill="#8ed081" /><rect x={90} y={150} width={140} height={40} rx={4} fill="#f43f5e" opacity={0.4} />{rowX(4, 26, 160, (x) => <Emoji x={x} y={140} s={18} e="🐜" />)}</g>,
    pages: [
      { text: "The red ants bring 4 crumbs to the picnic.", narration: "The red ants bring four crumbs to the picnic.", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={170} fill="#8ed081" />{rowX(4, 40, 160, (x) => <Emoji x={x} y={110} s={26} e="🍪" />)}<Emoji x={160} y={160} s={22} e="🐜" /></g> },
      { text: "The black ants bring 6 crumbs. Who has more?", narration: "The black ants bring six crumbs. Who has more?", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={170} fill="#8ed081" />{rowX(4, 30, 130, (x) => <Emoji x={x} y={90} s={18} e="🍪" />)}{rowX(6, 30, 165, (x) => <Emoji x={x} y={140} s={18} e="🍪" />)}</g> },
      { text: "6 is more than 4. The black ants have more crumbs!", narration: "Six is more than four. The black ants have more crumbs!", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={170} fill="#8ed081" />{T(90, 90, "4", 30, "#f43f5e")}{T(160, 90, "<", 26, "#1b2540")}{T(230, 90, "6", 30, "#1b2540")}{rowX(6, 26, 160, (x) => <Emoji x={x} y={150} s={16} e="🐜" />)}</g> },
      { text: "They share fairly: 5 crumbs each. Now it is the same!", narration: "They share fairly. Five crumbs each. Now it is the same!", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={170} fill="#8ed081" />{rowX(5, 26, 100, (x) => <Emoji x={x} y={100} s={16} e="🍪" />)}{T(160, 130, "=", 24, "#199473")}{rowX(5, 26, 220, (x) => <Emoji x={x} y={150} s={16} e="🍪" />)}</g> },
      { text: "The same for everyone — what a happy picnic!", narration: "The same for everyone. What a happy picnic!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={170} fill="#8ed081" />{rowX(6, 32, 160, (x) => <Emoji x={x} y={140} s={22} e="🐜" />)}<K.Star x={50} y={56} s={2.2} /><K.Star x={270} y={60} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Which is more?", narration: "Which is more?", options: [num(4), num(6)], answer: 1 },
      { prompt: "🍪🍪🍪 or 🍪🍪🍪🍪🍪 — tap fewer", options: [{ emoji: "🍪🍪🍪" }, { emoji: "🍪🍪🍪🍪🍪" }], answer: 0 },
      { prompt: "5 crumbs and 5 crumbs are…", options: [{ text: "the same" }, { text: "more" }, { text: "fewer" }], answer: 0 },
    ],
  },

  // ---------- GRADE 1 — subtraction ----------
  {
    id: "res-book-five-monkeys", title: "Five Cheeky Monkeys", subtitle: "Taking away, one by one",
    level: "G1", audio: true, accent: "#8a5a2a", coverFrom: "#e7f6d9", coverTo: "#f4fbec", titleColor: "#4c6b1a",
    characters: [{ name: "the Monkeys", role: "five bouncy tricksters" }, { name: "Mr Croc", role: "waiting below" }],
    cover: <g><K.Sky from="#e7f6d9" to="#f4fbec" /><K.Ground y={182} fill="#8ed081" /><K.Tree x={160} y={200} s={2.4} />{rowX(5, 30, 160, (x) => <Emoji x={x} y={120} s={20} e="🐵" />)}</g>,
    pages: [
      { text: "Five cheeky monkeys bounce on the bed. Boing, boing!", narration: "Five cheeky monkeys bounce on the bed. Boing, boing!", scene: <g><K.Sky from="#e7f6d9" to="#f4fbec" /><K.Ground y={180} fill="#8ed081" />{rowX(5, 44, 160, (x) => <Emoji x={x} y={120} s={30} e="🐵" />)}</g> },
      { text: "One bounces off. Five take away one leaves four.", narration: "One bounces off. Five take away one leaves four.", scene: <g><K.Sky from="#e7f6d9" to="#f4fbec" /><K.Ground y={180} fill="#8ed081" />{rowX(4, 48, 150, (x) => <Emoji x={x} y={110} s={30} e="🐵" />)}{T(160, 168, "5 − 1 = 4", 18, "#4c6b1a")}</g> },
      { text: "Two more tumble down! Four take away two leaves two.", narration: "Two more tumble down! Four take away two leaves two.", scene: <g><K.Sky from="#e7f6d9" to="#f4fbec" /><K.Ground y={180} fill="#8ed081" />{rowX(2, 52, 160, (x) => <Emoji x={x} y={110} s={30} e="🐵" />)}{T(160, 168, "4 − 2 = 2", 18, "#4c6b1a")}</g> },
      { text: "The last two swing away to tea. Two take away two leaves none!", narration: "The last two swing away to tea. Two take away two leaves none!", scene: <g><K.Sky from="#e7f6d9" to="#f4fbec" /><K.Ground y={180} fill="#8ed081" /><K.Tree x={160} y={200} s={2.4} />{T(160, 120, "2 − 2 = 0", 20, "#4c6b1a")}</g> },
      { text: "No more monkeys bouncing — time for bed. Goodnight!", narration: "No more monkeys bouncing. Time for bed. Goodnight!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={180} fill="#8ed081" /><Emoji x={160} y={130} s={40} e="🌙" /><K.Star x={60} y={60} s={2.2} /><K.Star x={260} y={70} s={2.2} /></g> },
    ],
    check: [
      { prompt: "5 − 1 = ?", narration: "Five take away one?", options: [num(3), num(4), num(6)], answer: 1 },
      { prompt: "4 − 2 = ?", narration: "Four take away two?", options: [num(2), num(1), num(3)], answer: 0 },
      { prompt: "2 − 2 = ?", narration: "Two take away two?", options: [num(0), num(1), num(2)], answer: 0 },
      { prompt: "3 monkeys, 1 hops off. How many left?", options: [num(2), num(3), num(4)], answer: 0 },
    ],
  },

  // ---------- GRADE 2 — mass / weight ----------
  {
    id: "res-book-wobbly-seesaw", title: "The Wobbly Seesaw", subtitle: "Heavier, lighter and balanced",
    level: "G2", audio: true, accent: "#6366f1", coverFrom: "#e3e7ff", coverTo: "#f1f3ff", titleColor: "#26346b",
    characters: [{ name: "Ellie", role: "a gentle elephant" }, { name: "Mimi", role: "a tiny mouse" }],
    cover: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={184} fill="#9ccb7a" />{seesaw(true, "🐘", "🐭")}</g>,
    pages: [
      { text: "Ellie the elephant and Mimi the mouse find a seesaw in the park.", narration: "Ellie the elephant and Mimi the mouse find a seesaw in the park.", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#9ccb7a" />{seesaw(true, "🐘", "🐭")}</g> },
      { text: "Ellie is much heavier, so her side sinks right down. Mimi flies up high!", narration: "Ellie is much heavier, so her side sinks right down. Mimi flies up high!", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#9ccb7a" />{seesaw(true, "🐘", "🐭")}{T(160, 60, "heavier ⬇   lighter ⬆", 12, "#26346b")}</g> },
      { text: "On a balance scale, the heavier object always tips its pan down.", narration: "On a balance scale, the heavier object always tips its pan down.", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#9ccb7a" />{seesaw(true, "🍎", "🪶")}{T(160, 66, "apple heavier than feather", 11, "#26346b")}</g> },
      { text: "Then five mice hop on! Now both sides balance — they weigh the same.", narration: "Then five mice hop on! Now both sides balance. They weigh the same.", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#9ccb7a" /><g><rect x={56} y={146} width={208} height={9} rx={4} fill="#c98a2e" /><Emoji x={82} y={130} s={30} e="🐘" /><Emoji x={238} y={132} s={22} e="🐭" /><path d="M148 150 L172 150 L160 182 Z" fill="#1b2540" /></g>{T(160, 66, "balanced = same mass", 12, "#199473")}</g> },
      { text: "\"Balanced at last!\" they cheer. Measuring mass is all about comparing.", narration: "Balanced at last, they cheer. Measuring mass is all about comparing.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#9ccb7a" /><Emoji x={110} y={140} s={34} e="🐘" /><Emoji x={210} y={140} s={30} e="🐭" /><K.Star x={60} y={60} s={2.2} /><K.Star x={260} y={64} s={2.2} /></g> },
    ],
    check: [
      { prompt: "On a seesaw the heavier side goes…", narration: "On a seesaw the heavier side goes?", options: [{ text: "up" }, { text: "down" }], answer: 1 },
      { prompt: "Which is heavier?", options: [{ emoji: "🐘" }, { emoji: "🐭" }], answer: 0 },
      { prompt: "If the scale is level, the two masses are…", options: [{ text: "the same" }, { text: "different" }], answer: 0 },
      { prompt: "Which is lighter than an apple?", options: [{ emoji: "🪶" }, { emoji: "🧱" }], answer: 0 },
    ],
  },

  // ---------- GRADE 3 — sorting: Venn & Carroll ----------
  {
    id: "res-book-sorting-safari", title: "The Sorting Safari", subtitle: "Grouping with Venn diagrams",
    level: "G3", audio: false, accent: "#14b8a6", coverFrom: "#cdf3ea", coverTo: "#eefbf7", titleColor: "#0c6b58",
    characters: [{ name: "Ranger Ade", role: "a sharp-eyed guide" }, { name: "the animals", role: "waiting to be sorted" }],
    cover: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={184} fill="#c7e59a" />{venn()}</g>,
    pages: [
      { text: "On safari, Ranger Ade photographs zebras, tigers, elephants and a rhino — then wonders how to group them.", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={186} fill="#c7e59a" />{rowX(4, 56, 160, (x, i) => <Emoji x={x} y={110} s={30} e={["🦓", "🐅", "🐘", "🦏"][i]} />)}<K.Kid x={160} y={172} s={1} shirt="#14b8a6" hairStyle="cap" expr="think" /></g> },
      { text: "She draws two big loops — a Venn diagram. One loop is \"has stripes\", the other is \"is big\".", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={186} fill="#c7e59a" /><circle cx={124} cy={110} r={56} fill="#14b8a6" fillOpacity={0.15} stroke="#14b8a6" strokeWidth={2.5} /><circle cx={200} cy={110} r={56} fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={2.5} />{T(96, 52, "Stripes", 12, "#0c6b58")}{T(232, 52, "Big", 12, "#8a5a0f")}</g> },
      { text: "The zebra has stripes but is not huge, so it goes in the left loop only. The elephant is big with no stripes — the right loop.", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={186} fill="#c7e59a" /><circle cx={124} cy={110} r={56} fill="#14b8a6" fillOpacity={0.15} stroke="#14b8a6" strokeWidth={2.5} /><circle cx={200} cy={110} r={56} fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={2.5} /><Emoji x={92} y={110} s={24} e="🦓" /><Emoji x={230} y={110} s={24} e="🐘" /></g> },
      { text: "The tiger is big AND striped, so it belongs in the middle — where both loops overlap. Clever sorting!", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={186} fill="#c7e59a" />{venn()}<K.Kid x={280} y={176} s={0.9} shirt="#14b8a6" hairStyle="cap" expr="proud" /></g> },
      { text: "\"A Venn diagram shows what things share and what makes them different,\" smiles Ade. Every animal has its place.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#c7e59a" />{venn()}<K.Star x={40} y={56} s={2} /></g> },
    ],
    check: [
      { prompt: "A tiger is big AND striped. It goes…", narration: "A tiger is big and striped. Where does it go?", options: [{ text: "in the overlap" }, { text: "outside both" }, { text: "stripes only" }], answer: 0 },
      { prompt: "Where does the zebra (striped, not big) go?", options: [{ text: "Stripes loop only" }, { text: "Big loop only" }, { text: "the overlap" }], answer: 0 },
      { prompt: "A Venn diagram's overlap shows things that are…", options: [{ text: "in both groups" }, { text: "in neither group" }], answer: 0 },
      { prompt: "Which animal is big but NOT striped?", options: [{ emoji: "🐘" }, { emoji: "🦓" }, { emoji: "🐅" }], answer: 0 },
    ],
  },

  // ---------- GRADE 4 — area & perimeter ----------
  {
    id: "res-book-playground-plan", title: "The Playground Plan", subtitle: "Counting squares and edges",
    level: "G4", audio: false, accent: "#22c55e", coverFrom: "#d7f6df", coverTo: "#eefbf1", titleColor: "#14663a",
    characters: [{ name: "Architect Lin", role: "who designs the playground" }, { name: "the pupils", role: "who will play there" }],
    cover: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={184} fill="#a5d977" />{areaGrid(5, 3, 150, 110, 22, "#8ed081")}<K.Kid x={260} y={172} s={1} shirt="#22c55e" hairStyle="bun" expr="happy" /></g>,
    pages: [
      { text: "The school is building a new playground, and Architect Lin sketches it on squared paper where each square is one metre.", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={186} fill="#a5d977" />{areaGrid(5, 3, 150, 110, 24, "#c7e59a")}<K.Kid x={270} y={172} s={1} shirt="#22c55e" hairStyle="bun" expr="think" /></g> },
      { text: "\"The AREA is the space inside — how many squares cover it,\" says Lin. She counts 5 across and 3 down: 5 × 3 = 15 square metres.", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={186} fill="#a5d977" />{areaGrid(5, 3, 150, 108, 22, "#8ed081")}{T(150, 172, "area = 5 × 3 = 15 m²", 15, "#14663a")}</g> },
      { text: "\"The PERIMETER is the fence all the way around the edge.\" She adds the sides: 5 + 3 + 5 + 3 = 16 metres of fencing.", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={186} fill="#a5d977" /><rect x={95} y={70} width={130} height={78} fill="none" stroke="#ef4444" strokeWidth={4} />{areaGrid(5, 3, 160, 109, 22, "#c7e59a")}{T(160, 172, "perimeter = 16 m", 15, "#c0392b")}</g> },
      { text: "A bigger sandpit needs 6 by 2 squares. Area is 6 × 2 = 12 m², but its perimeter is 6 + 2 + 6 + 2 = 16 m — the same fence, different space!", scene: <g><K.Sky from="#d7f6df" to="#eefbf1" /><K.Ground y={186} fill="#a5d977" />{areaGrid(6, 2, 160, 100, 20, "#ffd18a")}{T(160, 150, "area 12 m² · perimeter 16 m", 13, "#14663a")}</g> },
      { text: "The plan is perfect. \"Area for playing, perimeter for fencing,\" grins Lin, and the pupils cheer for their new playground.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#a5d977" />{areaGrid(4, 3, 120, 110, 20, "#8ed081")}<K.Kid x={230} y={172} s={1.2} shirt="#22c55e" hairStyle="bun" expr="excited" arm="up" /><K.Star x={50} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Area of a 5 × 3 rectangle?", narration: "Area of a five by three rectangle?", options: [{ text: "15 m²" }, { text: "16 m²" }, { text: "8 m²" }], answer: 0 },
      { prompt: "Perimeter of a 5 × 3 rectangle?", options: [{ text: "16 m" }, { text: "15 m" }, { text: "8 m" }], answer: 0 },
      { prompt: "Area measures the…", options: [{ text: "space inside" }, { text: "edge around" }], answer: 0 },
      { prompt: "Perimeter measures the…", options: [{ text: "edge around" }, { text: "space inside" }], answer: 0 },
    ],
  },

  // ---------- GRADE 5 — line graphs ----------
  {
    id: "res-book-temperature-diary", title: "The Temperature Diary", subtitle: "Reading a line graph",
    level: "G5", audio: false, accent: "#ef4444", coverFrom: "#ffe0e0", coverTo: "#fff2f2", titleColor: "#8a1c1c",
    characters: [{ name: "Nia", role: "a young weather-watcher" }, { name: "Grandpa", role: "who keeps the diary" }],
    cover: <g><K.Sky from="#ffe0e0" to="#fff2f2" /><K.Ground y={184} fill="#c7d9a8" /><rect x={44} y={54} width={230} height={116} rx={8} fill="#fff" stroke="#f3c1c1" strokeWidth={2} />{lineGraph([8, 14, 20, 17, 24])}</g>,
    pages: [
      { text: "Every morning for a week, Nia and Grandpa read the thermometer and write the temperature in their weather diary.", scene: <g><K.Sky from="#ffe0e0" to="#fff2f2" /><K.Ground y={186} fill="#c7d9a8" /><Emoji x={110} y={110} s={44} e="🌡️" /><K.Kid x={220} y={172} s={1.1} shirt="#ef4444" hairStyle="pony" hair="#1a1a1a" expr="happy" /></g> },
      { text: "\"A line graph is best for numbers that change over time,\" says Grandpa. Days go along the bottom; temperature goes up the side.", scene: <g><K.Sky from="#ffe0e0" to="#fff2f2" /><K.Ground y={186} fill="#c7d9a8" />{lineGraph([8, 14, 20, 17, 24])}</g> },
      { text: "Nia plots a dot for each day, then joins them with a line. The line climbs steeply from Monday to Wednesday — it warmed up fast!", scene: <g><K.Sky from="#ffe0e0" to="#fff2f2" /><K.Ground y={186} fill="#c7d9a8" />{lineGraph([8, 14, 20, 17, 24])}{T(160, 50, "rising = warmer", 12, "#8a1c1c")}</g> },
      { text: "On Thursday the line dips — a cooler, cloudy day. \"When the line goes down, the temperature fell,\" Nia notes in the diary.", scene: <g><K.Sky from="#ffe0e0" to="#fff2f2" /><K.Ground y={186} fill="#c7d9a8" />{lineGraph([8, 14, 20, 17, 24])}<Emoji x={230} y={78} s={22} e="☁️" /></g> },
      { text: "By reading the graph, Nia can spot the warmest day, the coldest day and every rise and fall — all at a single glance. \"Graphs tell stories,\" she smiles.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#c7d9a8" />{lineGraph([8, 14, 20, 17, 24])}<K.Kid x={296} y={176} s={0.85} shirt="#ef4444" hairStyle="pony" expr="excited" /></g> },
    ],
    check: [
      { prompt: "A line graph is best for data that…", narration: "A line graph is best for data that?", options: [{ text: "changes over time" }, { text: "has no order" }], answer: 0 },
      { prompt: "When the line goes UP, the temperature…", options: [{ text: "rose" }, { text: "fell" }, { text: "stayed" }], answer: 0 },
      { prompt: "A dip in the line means the value…", options: [{ text: "went down" }, { text: "went up" }], answer: 0 },
      { prompt: "The warmest day is where the line is…", options: [{ text: "highest" }, { text: "lowest" }], answer: 0 },
    ],
  },

  // ---------- GRADE 6 — negative numbers ----------
  {
    id: "res-book-submarine-squad", title: "The Submarine Squad", subtitle: "Numbers below zero",
    level: "G6", audio: false, accent: "#199473", coverFrom: "#cfeafd", coverTo: "#eef7ff", titleColor: "#0c5a6b",
    characters: [{ name: "Captain Reef", role: "pilot of the sub" }, { name: "Sonar Sam", role: "reading the depth gauge" }],
    cover: <g><K.Sky from="#cfeafd" to="#eef7ff" />{depthScale(3)}<K.Kid x={250} y={70} s={1} shirt="#199473" hairStyle="cap" hair="#1a1a1a" expr="excited" /></g>,
    pages: [
      { text: "The research sub Nautilus floats at the surface — depth zero. Captain Reef checks the gauge: 0 metres, exactly at sea level.", scene: <g><K.Sky from="#cfeafd" to="#eef7ff" />{depthScale(0)}</g> },
      { text: "\"Dive!\" orders Reef. They sink to 3 metres below the surface. Sonar Sam writes it as −3 m — the minus sign means below zero.", scene: <g><K.Sky from="#cfeafd" to="#eef7ff" />{depthScale(3)}{T(230, 130, "−3 m", 16, "#0c5a6b")}</g> },
      { text: "Deeper still, to −5 metres. \"−5 is lower than −3,\" explains Sam, \"because on a number line the further below zero you go, the smaller the number.\"", scene: <g><K.Sky from="#cfeafd" to="#eef7ff" />{depthScale(5)}{T(230, 170, "−5 < −3", 15, "#0c5a6b")}</g> },
      { text: "A whale glides past at −2 m, above the sub. To rise from −5 up to −2, the sub climbs 3 metres: −5 + 3 = −2.", scene: <g><K.Sky from="#cfeafd" to="#eef7ff" />{depthScale(2)}<Emoji x={210} y={118} s={30} e="🐋" />{T(160, 200, "−5 + 3 = −2", 14, "#0c5a6b")}</g> },
      { text: "Back at the surface — depth 0 again — the squad surfaces triumphantly. \"Below zero, above zero,\" laughs Reef, \"negative numbers chart every depth.\"", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" />{depthScale(0)}<K.Kid x={250} y={60} s={1.1} shirt="#199473" hairStyle="cap" expr="excited" arm="up" /><K.Star x={280} y={40} s={2} /></g> },
    ],
    check: [
      { prompt: "3 metres below sea level is written as…", narration: "Three metres below sea level is written as?", options: [{ text: "−3" }, { text: "3" }, { text: "+3" }], answer: 0 },
      { prompt: "Which is lower (deeper)?", options: [{ text: "−5" }, { text: "−3" }], answer: 0 },
      { prompt: "−5 + 3 = ?", narration: "Negative five plus three?", options: [{ text: "−2" }, { text: "−8" }, { text: "2" }], answer: 0 },
      { prompt: "On a number line, numbers below zero are…", options: [{ text: "negative" }, { text: "positive" }], answer: 0 },
    ],
  },
];
