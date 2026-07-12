import React from "react";
import * as K from "@/components/content/storyKit";
import type { StoryBook, CheckOption } from "./storybooks";

// ==========================================================
// Storybooks — expansion batch 3. Completes 5 books per grade
// and adds the last topic gaps (3D shape, odd/even, doubles,
// time, fractions of a set, tally/pictogram, multiplication,
// averages, primes, place value/rounding, volume).
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
function cube(cx: number, cy: number, s: number, fill: string) {
  const h = s / 2;
  return <g><rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} fill={fill} stroke="#fff" strokeWidth={2} /><path d={`M${cx - s / 2} ${cy - s / 2} l${h} ${-h} h${s} l${-h} ${h} Z`} fill={fill} opacity={0.75} stroke="#fff" strokeWidth={2} /><path d={`M${cx + s / 2} ${cy - s / 2} l${h} ${-h} v${s} l${-h} ${h} Z`} fill={fill} opacity={0.55} stroke="#fff" strokeWidth={2} /></g>;
}
function sphere(cx: number, cy: number, r: number, fill: string) {
  return <g><circle cx={cx} cy={cy} r={r} fill={fill} stroke="#fff" strokeWidth={2} /><circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.35} fill="#fff" opacity={0.5} /></g>;
}
function cylinder(cx: number, cy: number, r: number, h: number, fill: string) {
  return <g><rect x={cx - r} y={cy - h / 2} width={r * 2} height={h} fill={fill} /><ellipse cx={cx} cy={cy + h / 2} rx={r} ry={r * 0.35} fill={fill} stroke="#fff" strokeWidth={2} /><ellipse cx={cx} cy={cy - h / 2} rx={r} ry={r * 0.35} fill={fill} opacity={0.8} stroke="#fff" strokeWidth={2} /></g>;
}
function clock(cx: number, cy: number, r: number, h: number, m: number) {
  const ha = ((h % 12) + m / 60) / 12 * 360, ma = (m / 60) * 360;
  return <g><circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#1b2540" strokeWidth={3} />{Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * 2 * Math.PI; return <circle key={i} cx={cx + (r - 7) * Math.sin(a)} cy={cy - (r - 7) * Math.cos(a)} r={2} fill="#1b2540" />; })}<line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.5} stroke="#1b2540" strokeWidth={4} strokeLinecap="round" transform={`rotate(${ha} ${cx} ${cy})`} /><line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.78} stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" transform={`rotate(${ma} ${cx} ${cy})`} /><circle cx={cx} cy={cy} r={3.5} fill="#1b2540" /></g>;
}
function tally(n: number, x: number, y: number, color = "#1b2540") {
  const groups = Math.floor(n / 5), rem = n % 5, parts: React.ReactNode[] = [];
  let gx = x;
  for (let g = 0; g < groups; g++) { for (let i = 0; i < 4; i++) parts.push(<line key={`g${g}i${i}`} x1={gx + i * 5} y1={y} x2={gx + i * 5} y2={y + 20} stroke={color} strokeWidth={2} />); parts.push(<line key={`g${g}d`} x1={gx - 2} y1={y + 20} x2={gx + 17} y2={y} stroke={color} strokeWidth={2} />); gx += 30; }
  for (let i = 0; i < rem; i++) parts.push(<line key={`r${i}`} x1={gx + i * 5} y1={y} x2={gx + i * 5} y2={y + 20} stroke={color} strokeWidth={2} />);
  return <g>{parts}</g>;
}
function numGrid(highlight: number[]) {
  return <g>{Array.from({ length: 20 }).map((_, i) => { const n = i + 1, c = i % 10, r = Math.floor(i / 10); const on = highlight.includes(n); return <g key={n}><rect x={54 + c * 21} y={80 + r * 21} width={19} height={19} rx={3} fill={on ? "#14b8a6" : "#fff"} stroke="#c1cbde" strokeWidth={1} /><text x={54 + c * 21 + 9.5} y={80 + r * 21 + 10} fontSize={9} fontWeight={700} fill={on ? "#fff" : "#31415f"} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{n}</text></g>; })}</g>;
}

export const extraBooks3: StoryBook[] = [
  // ===== NURSERY (2) =====
  {
    id: "res-book-shape-train", title: "The Shape Train", subtitle: "Cubes roll and stack",
    level: "EY", audio: true, accent: "#4fc3f7", coverFrom: "#dff1ff", coverTo: "#f2faff", titleColor: "#0b4a6b",
    characters: [{ name: "Choo", role: "the shape-loving engine" }],
    cover: <g><K.Sky from="#dff1ff" to="#f2faff" /><K.Ground y={176} fill="#a5d977" />{sphere(80, 150, 18, "#f43f5e")}{cube(160, 150, 34, "#ffb420")}{cylinder(240, 150, 18, 36, "#14b8a6")}</g>,
    pages: [
      { text: "A round ball. It rolls!", narration: "A round ball. It rolls!", scene: <g><K.Sky from="#dff1ff" to="#f2faff" /><K.Ground y={170} fill="#a5d977" />{sphere(160, 140, 34, "#f43f5e")}</g> },
      { text: "A box cube. It stacks!", narration: "A box cube. It stacks!", scene: <g><K.Sky from="#dff1ff" to="#f2faff" /><K.Ground y={170} fill="#a5d977" />{cube(160, 150, 30, "#ffb420")}{cube(160, 116, 30, "#f59e0b")}</g> },
      { text: "A can cylinder. Roll or stack!", narration: "A can cylinder. Roll or stack!", scene: <g><K.Sky from="#dff1ff" to="#f2faff" /><K.Ground y={170} fill="#a5d977" />{cylinder(160, 130, 22, 50, "#14b8a6")}</g> },
      { text: "Choo builds a shape train!", narration: "Choo builds a shape train!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={170} fill="#a5d977" />{cube(80, 150, 26, "#ffb420")}{sphere(140, 150, 15, "#f43f5e")}{cylinder(200, 150, 15, 30, "#14b8a6")}{cube(255, 150, 26, "#6366f1")}</g> },
      { text: "Roll, stack, choo-choo! Hooray!", narration: "Roll, stack, choo choo! Hooray!", scene: <g><K.Sky from="#dff1ff" to="#f2faff" /><K.Ground y={170} fill="#a5d977" />{cube(160, 150, 30, "#ffb420")}<K.Star x={60} y={60} s={2.4} /><K.Star x={260} y={64} s={2.4} /></g> },
    ],
    check: [
      { prompt: "Which shape ROLLS?", options: [{ emoji: "⚽" }, { emoji: "📦" }], answer: 0 },
      { prompt: "Which shape STACKS best?", options: [{ emoji: "🧊" }, { emoji: "⚽" }], answer: 0 },
      { prompt: "Tap the ball", options: [{ emoji: "🔴" }, { emoji: "🟨" }], answer: 0 },
    ],
  },
  {
    id: "res-book-ten-stars", title: "Ten Twinkly Stars", subtitle: "Counting all the way to ten",
    level: "EY", audio: true, accent: "#ffb420", coverFrom: "#1b2540", coverTo: "#2b3852", titleColor: "#ffffff",
    characters: [{ name: "Luna", role: "a sleepy little owl" }],
    cover: <g><rect x={0} y={0} width={320} height={220} fill="#1b2540" />{rowX(5, 40, 160, (x, i) => <K.Star x={x} y={110 + (i % 2) * 24} s={3} />)}<Emoji x={160} y={175} s={34} e="🦉" /></g>,
    pages: [
      { text: "One star. Twinkle!", narration: "One star. Twinkle!", scene: <g><rect width={320} height={220} fill="#1b2540" /><K.Star x={160} y={110} s={5} /></g> },
      { text: "Five stars. Count them!", narration: "Five stars. Count them!", scene: <g><rect width={320} height={220} fill="#1b2540" />{rowX(5, 50, 160, (x) => <K.Star x={x} y={110} s={3.4} />)}</g> },
      { text: "Ten twinkly stars. So many!", narration: "Ten twinkly stars. So many!", scene: <g><rect width={320} height={220} fill="#1b2540" />{rowX(5, 46, 160, (x) => <K.Star x={x} y={80} s={2.8} />)}{rowX(5, 46, 160, (x) => <K.Star x={x} y={130} s={2.8} />)}</g> },
      { text: "Luna counts: one to ten!", narration: "Luna counts. One to ten!", scene: <g><rect width={320} height={220} fill="#1b2540" />{rowX(5, 44, 160, (x) => <K.Star x={x} y={80} s={2.6} />)}{rowX(5, 44, 160, (x) => <K.Star x={x} y={120} s={2.6} />)}<Emoji x={160} y={180} s={30} e="🦉" /></g> },
      { text: "Ten stars, sweet dreams. Goodnight!", narration: "Ten stars, sweet dreams. Goodnight!", scene: <g><rect width={320} height={220} fill="#1b2540" /><Emoji x={90} y={80} s={30} e="🌙" />{rowX(4, 40, 190, (x) => <K.Star x={x} y={120} s={2.4} />)}<Emoji x={160} y={185} s={26} e="🦉" /></g> },
    ],
    check: [
      { prompt: "How many stars? ⭐⭐⭐⭐⭐", narration: "How many stars?", options: [num(3), num(5), num(4)], answer: 1 },
      { prompt: "Count to the top number in the story", narration: "How high did Luna count?", options: [num(5), num(10), num(8)], answer: 1 },
      { prompt: "Tap TEN stars", options: [{ emoji: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐" }, { emoji: "⭐⭐⭐⭐⭐" }], answer: 0 },
    ],
  },

  // ===== KG (1) =====
  {
    id: "res-book-turtle-add", title: "Two Plus Three Turtles", subtitle: "Adding to five",
    level: "KG", audio: true, accent: "#22c55e", coverFrom: "#d9f7e4", coverTo: "#eefbf2", titleColor: "#14663a",
    characters: [{ name: "Tilly & friends", role: "sunbathing turtles" }],
    cover: <g><K.Sky from="#d9f7e4" to="#eefbf2" /><K.Ground y={170} fill="#7ec8ff" /><rect x={110} y={150} width={100} height={30} rx={15} fill="#c9a06a" />{rowX(5, 32, 160, (x) => <Emoji x={x} y={140} s={22} e="🐢" />)}</g>,
    pages: [
      { text: "Two turtles rest on a log.", narration: "Two turtles rest on a log.", scene: <g><K.Sky from="#d9f7e4" to="#eefbf2" /><K.Ground y={168} fill="#7ec8ff" /><rect x={100} y={148} width={120} height={26} rx={13} fill="#c9a06a" />{rowX(2, 40, 160, (x) => <Emoji x={x} y={138} s={30} e="🐢" />)}</g> },
      { text: "Three more turtles climb up!", narration: "Three more turtles climb up!", scene: <g><K.Sky from="#d9f7e4" to="#eefbf2" /><K.Ground y={168} fill="#7ec8ff" /><rect x={90} y={148} width={140} height={26} rx={13} fill="#c9a06a" />{rowX(2, 34, 120, (x) => <Emoji x={x} y={138} s={26} e="🐢" />)}{rowX(3, 30, 205, (x) => <Emoji x={x} y={138} s={26} e="🐢" />)}</g> },
      { text: "Two plus three makes five turtles!", narration: "Two plus three makes five turtles!", scene: <g><K.Sky from="#d9f7e4" to="#eefbf2" /><K.Ground y={168} fill="#7ec8ff" />{T(160, 90, "2 + 3 = 5", 22, "#14663a")}{rowX(5, 32, 160, (x) => <Emoji x={x} y={150} s={22} e="🐢" />)}</g> },
      { text: "Five happy turtles in the sun.", narration: "Five happy turtles in the sun.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={168} fill="#7ec8ff" /><K.Sun />{rowX(5, 34, 160, (x) => <Emoji x={x} y={150} s={22} e="🐢" />)}</g> },
      { text: "Splash! Five friends dive in. Yay!", narration: "Splash! Five friends dive in. Yay!", scene: <g><K.Sky from="#d9f7e4" to="#eefbf2" /><K.Ground y={150} fill="#7ec8ff" />{rowX(5, 34, 160, (x, i) => <Emoji x={x} y={170 + (i % 2) * 8} s={20} e="🐢" />)}<K.Star x={60} y={60} s={2.2} /></g> },
    ],
    check: [
      { prompt: "2 + 3 = ?", narration: "Two plus three?", options: [num(4), num(5), num(6)], answer: 1 },
      { prompt: "3 turtles and 1 more is…", options: [num(4), num(3), num(5)], answer: 0 },
      { prompt: "How many turtles altogether? 🐢🐢 + 🐢🐢🐢", options: [num(5), num(4), num(6)], answer: 0 },
    ],
  },

  // ===== GRADE 1 (2) =====
  {
    id: "res-book-odd-socks", title: "The Odd Sock Monster", subtitle: "Odd and even numbers",
    level: "G1", audio: true, accent: "#c77dff", coverFrom: "#f0e5ff", coverTo: "#faf5ff", titleColor: "#5b21b6",
    characters: [{ name: "Sockly", role: "a friendly sock monster" }],
    cover: <g><K.Sky from="#f0e5ff" to="#faf5ff" /><K.Ground y={180} fill="#c9b3f0" />{rowX(3, 40, 130, (x, i) => <Emoji x={x} y={120} s={26} e="🧦" />)}<Emoji x={230} y={140} s={40} e="👾" /></g>,
    pages: [
      { text: "Sockly loves socks that come in matching pairs. Two, four, six — those are EVEN.", narration: "Sockly loves socks that come in matching pairs. Two, four, six. Those are even.", scene: <g><K.Sky from="#f0e5ff" to="#faf5ff" /><K.Ground y={182} fill="#c9b3f0" />{rowX(3, 44, 150, (x) => <g key={x}><Emoji x={x - 10} y={110} s={22} e="🧦" /><Emoji x={x + 10} y={110} s={22} e="🧦" /></g>)}{T(150, 160, "2  4  6 — even", 14, "#5b21b6")}</g> },
      { text: "But one lonely sock has no pair! Numbers like 1, 3 and 5 are ODD — one is always left over.", narration: "But one lonely sock has no pair! Numbers like one, three and five are odd. One is always left over.", scene: <g><K.Sky from="#f0e5ff" to="#faf5ff" /><K.Ground y={182} fill="#c9b3f0" /><Emoji x={130} y={120} s={30} e="🧦" /><Emoji x={210} y={150} s={40} e="👾" />{T(130, 160, "1 — odd (no pair)", 13, "#5b21b6")}</g> },
      { text: "Sockly pairs up 4 socks — two neat pairs, none left over. Four is even!", narration: "Sockly pairs up four socks. Two neat pairs, none left over. Four is even!", scene: <g><K.Sky from="#f0e5ff" to="#faf5ff" /><K.Ground y={182} fill="#c9b3f0" />{rowX(2, 70, 160, (x) => <g key={x}><Emoji x={x - 12} y={110} s={24} e="🧦" /><Emoji x={x + 12} y={110} s={24} e="🧦" /></g>)}{T(160, 160, "4 = 2 pairs, even", 14, "#199473")}</g> },
      { text: "With 5 socks, one is always the odd one out. \"Five is odd!\" giggles Sockly, wiggling the spare.", narration: "With five socks, one is always the odd one out. Five is odd, giggles Sockly, wiggling the spare.", scene: <g><K.Sky from="#f0e5ff" to="#faf5ff" /><K.Ground y={182} fill="#c9b3f0" />{rowX(2, 70, 150, (x) => <g key={x}><Emoji x={x - 12} y={104} s={22} e="🧦" /><Emoji x={x + 12} y={104} s={22} e="🧦" /></g>)}<Emoji x={230} y={140} s={26} e="🧦" />{T(160, 165, "5 = odd", 14, "#5b21b6")}</g> },
      { text: "Now Sockly knows: pairs make even, a leftover makes odd. \"Every sock has a story!\"", narration: "Now Sockly knows. Pairs make even, a leftover makes odd. Every sock has a story!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={182} fill="#c9b3f0" /><Emoji x={160} y={130} s={44} e="👾" /><K.Star x={60} y={60} s={2.2} /><K.Star x={260} y={64} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Is 4 odd or even?", narration: "Is four odd or even?", options: [{ text: "even" }, { text: "odd" }], answer: 0 },
      { prompt: "Is 5 odd or even?", options: [{ text: "odd" }, { text: "even" }], answer: 0 },
      { prompt: "Even numbers make…", options: [{ text: "matching pairs" }, { text: "one left over" }], answer: 0 },
      { prompt: "Which is even?", options: [num(6), num(3), num(7)], answer: 0 },
    ],
  },
  {
    id: "res-book-cube-towers", title: "How Tall? Cube Towers", subtitle: "Measuring with cubes",
    level: "G1", audio: true, accent: "#f59e0b", coverFrom: "#fff2d6", coverTo: "#fff9ec", titleColor: "#7a3d00",
    characters: [{ name: "Ben", role: "a keen little builder" }],
    cover: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={180} fill="#c9b48a" />{Array.from({ length: 5 }).map((_, i) => <rect key={i} x={120} y={168 - i * 22} width={22} height={20} rx={2} fill="#ffb420" stroke="#fff" strokeWidth={1.5} />)}<K.Kid x={210} y={168} s={1.1} shirt="#f59e0b" hairStyle="short" expr="happy" /></g>,
    pages: [
      { text: "Ben measures his toys using stacking cubes instead of a ruler.", narration: "Ben measures his toys using stacking cubes instead of a ruler.", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={182} fill="#c9b48a" />{Array.from({ length: 4 }).map((_, i) => <rect key={i} x={150} y={170 - i * 22} width={22} height={20} rx={2} fill="#ffb420" stroke="#fff" strokeWidth={1.5} />)}<K.Kid x={240} y={170} s={1} shirt="#f59e0b" expr="happy" /></g> },
      { text: "His toy car is 3 cubes long. \"Three cubes!\" he says, lining them up carefully.", narration: "His toy car is three cubes long. Three cubes, he says, lining them up carefully.", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={182} fill="#c9b48a" /><Emoji x={160} y={100} s={30} e="🚗" />{rowX(3, 24, 160, (x) => <rect key={x} x={x - 11} y={120} width={22} height={20} rx={2} fill="#14b8a6" stroke="#fff" strokeWidth={1.5} />)}{T(160, 165, "3 cubes long", 15, "#7a3d00")}</g> },
      { text: "His teddy is 5 cubes tall — taller than the car. More cubes means taller!", narration: "His teddy is five cubes tall, taller than the car. More cubes means taller!", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={182} fill="#c9b48a" />{Array.from({ length: 5 }).map((_, i) => <rect key={i} x={130} y={170 - i * 22} width={22} height={20} rx={2} fill="#ffb420" stroke="#fff" strokeWidth={1.5} />)}<Emoji x={200} y={110} s={34} e="🧸" />{T(150, 60, "5 cubes tall", 14, "#7a3d00")}</g> },
      { text: "\"To measure fairly, every cube must be the same size,\" says Ben, checking there are no gaps.", narration: "To measure fairly, every cube must be the same size, says Ben, checking there are no gaps.", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={182} fill="#c9b48a" />{rowX(6, 24, 160, (x) => <rect key={x} x={x - 11} y={120} width={22} height={20} rx={2} fill="#14b8a6" stroke="#fff" strokeWidth={1.5} />)}{T(160, 160, "same-size cubes, no gaps", 12, "#7a3d00")}</g> },
      { text: "Now Ben can compare everything: the teddy (5) is 2 cubes taller than the car (3). Measuring is fun!", narration: "Now Ben can compare everything. The teddy, five, is two cubes taller than the car, three. Measuring is fun!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={182} fill="#c9b48a" /><Emoji x={110} y={120} s={30} e="🧸" />{T(160, 120, "5 − 3 = 2", 18, "#199473")}<Emoji x={210} y={124} s={26} e="🚗" /><K.Star x={60} y={60} s={2.2} /></g> },
    ],
    check: [
      { prompt: "The car is 3 cubes and the teddy is 5. Which is taller?", narration: "Which is taller?", options: [{ text: "teddy" }, { text: "car" }], answer: 0 },
      { prompt: "How much taller is the teddy? 5 − 3", options: [num(2), num(3), num(1)], answer: 0 },
      { prompt: "To measure fairly the cubes must be…", options: [{ text: "the same size" }, { text: "different sizes" }], answer: 0 },
      { prompt: "A tower of 4 cubes on 3 cubes — which is shorter?", options: [{ text: "3 cubes" }, { text: "4 cubes" }], answer: 0 },
    ],
  },

  // ===== GRADE 2 (2) =====
  {
    id: "res-book-double-bunnies", title: "Double Trouble Bunnies", subtitle: "Doubling numbers",
    level: "G2", audio: true, accent: "#ff6b9d", coverFrom: "#ffe1ee", coverTo: "#fff3f8", titleColor: "#a11a52",
    characters: [{ name: "Bibi & Bobo", role: "two mirror-image bunnies" }],
    cover: <g><K.Sky from="#ffe1ee" to="#fff3f8" /><K.Ground y={180} fill="#8ed081" />{rowX(3, 40, 110, (x) => <Emoji x={x} y={130} s={24} e="🥕" />)}{rowX(3, 40, 220, (x) => <Emoji x={x} y={130} s={24} e="🥕" />)}<Emoji x={165} y={160} s={30} e="🐰" /></g>,
    pages: [
      { text: "Bibi picks 3 carrots. Her twin Bobo always picks the same — so together they double it!", narration: "Bibi picks three carrots. Her twin Bobo always picks the same, so together they double it!", scene: <g><K.Sky from="#ffe1ee" to="#fff3f8" /><K.Ground y={182} fill="#8ed081" />{rowX(3, 34, 160, (x) => <Emoji x={x} y={110} s={26} e="🥕" />)}<Emoji x={160} y={160} s={28} e="🐰" /></g> },
      { text: "3 carrots and 3 carrots make 6. Double 3 is 6!", narration: "Three carrots and three carrots make six. Double three is six!", scene: <g><K.Sky from="#ffe1ee" to="#fff3f8" /><K.Ground y={182} fill="#8ed081" />{rowX(3, 30, 100, (x) => <Emoji x={x} y={100} s={22} e="🥕" />)}{T(160, 100, "+", 22, "#a11a52")}{rowX(3, 30, 220, (x) => <Emoji x={x} y={100} s={22} e="🥕" />)}{T(160, 150, "double 3 = 6", 16, "#a11a52")}</g> },
      { text: "Next they find 5 flowers each. Double 5 is 10 — a whole handful!", narration: "Next they find five flowers each. Double five is ten, a whole handful!", scene: <g><K.Sky from="#ffe1ee" to="#fff3f8" /><K.Ground y={182} fill="#8ed081" />{rowX(5, 26, 100, (x) => <Emoji x={x} y={100} s={18} e="🌼" />)}{rowX(5, 26, 220, (x) => <Emoji x={x} y={100} s={18} e="🌼" />)}{T(160, 150, "double 5 = 10", 16, "#a11a52")}</g> },
      { text: "\"Doubling is just adding a number to itself,\" says Bibi. Double 10 would be 20!", narration: "Doubling is just adding a number to itself, says Bibi. Double ten would be twenty!", scene: <g><K.Sky from="#ffe1ee" to="#fff3f8" /><K.Ground y={182} fill="#8ed081" />{T(160, 100, "10 + 10 = 20", 22, "#a11a52")}<Emoji x={110} y={150} s={26} e="🐰" /><Emoji x={210} y={150} s={26} e="🐰" /></g> },
      { text: "Two bunnies, double the fun, double the carrots. Munch, munch — hooray!", narration: "Two bunnies, double the fun, double the carrots. Munch, munch, hooray!", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={182} fill="#8ed081" />{rowX(6, 26, 160, (x) => <Emoji x={x} y={110} s={20} e="🥕" />)}<Emoji x={120} y={155} s={26} e="🐰" /><Emoji x={200} y={155} s={26} e="🐰" /><K.Star x={60} y={60} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Double 3 = ?", narration: "Double three?", options: [num(5), num(6), num(9)], answer: 1 },
      { prompt: "Double 5 = ?", narration: "Double five?", options: [num(10), num(7), num(15)], answer: 0 },
      { prompt: "Doubling means adding a number to…", options: [{ text: "itself" }, { text: "zero" }], answer: 0 },
      { prompt: "Double 10 = ?", options: [num(20), num(12), num(100)], answer: 0 },
    ],
  },
  {
    id: "res-book-tidy-timer", title: "The Tidy-Up Timer", subtitle: "Telling o'clock time",
    level: "G2", audio: true, accent: "#3a4e75", coverFrom: "#e3e9f2", coverTo: "#f1f4f9", titleColor: "#26346b",
    characters: [{ name: "Priya", role: "who beats the clock" }],
    cover: <g><K.Sky from="#e3e9f2" to="#f1f4f9" /><K.Ground y={184} fill="#a9c08a" />{clock(120, 108, 44, 5, 0)}<K.Kid x={230} y={172} s={1.2} shirt="#3a4e75" hairStyle="bun" hair="#1a1a1a" expr="excited" /></g>,
    pages: [
      { text: "Priya's room is a mess! \"Tidy up before 5 o'clock,\" says Dad, pointing at the clock.", narration: "Priya's room is a mess! Tidy up before five o'clock, says Dad, pointing at the clock.", scene: <g><K.Sky from="#e3e9f2" to="#f1f4f9" /><K.Ground y={186} fill="#a9c08a" />{clock(110, 110, 46, 4, 0)}<K.Kid x={240} y={170} s={1.1} shirt="#3a4e75" hairStyle="bun" expr="worried" /></g> },
      { text: "At 4 o'clock the little hand points to 4 and the big hand points straight up to 12.", narration: "At four o'clock the little hand points to four and the big hand points straight up to twelve.", scene: <g><K.Sky from="#e3e9f2" to="#f1f4f9" /><K.Ground y={186} fill="#a9c08a" />{clock(120, 108, 48, 4, 0)}{T(250, 108, "4:00", 22, "#26346b")}</g> },
      { text: "She races! Books away, toys in the box. The big hand sweeps all the way around — that is one whole hour.", narration: "She races! Books away, toys in the box. The big hand sweeps all the way around. That is one whole hour.", scene: <g><K.Sky from="#e3e9f2" to="#f1f4f9" /><K.Ground y={186} fill="#a9c08a" />{clock(120, 108, 48, 4, 30)}<Emoji x={250} y={100} s={26} e="🧹" />{T(250, 140, "half past 4", 12, "#26346b")}</g> },
      { text: "Ding! Both hands say 5 o'clock — little hand on 5, big hand on 12. Done just in time!", narration: "Ding! Both hands say five o'clock. Little hand on five, big hand on twelve. Done just in time!", scene: <g><K.Sky from="#e3e9f2" to="#f1f4f9" /><K.Ground y={186} fill="#a9c08a" />{clock(120, 108, 48, 5, 0)}{T(250, 108, "5:00", 22, "#26346b")}</g> },
      { text: "\"You read the clock and beat the timer!\" cheers Dad. Priya grins — knowing the time helps every day.", narration: "You read the clock and beat the timer, cheers Dad. Priya grins. Knowing the time helps every day.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#a9c08a" />{clock(160, 100, 34, 5, 0)}<K.Kid x={80} y={172} s={1.1} shirt="#3a4e75" hairStyle="bun" expr="excited" arm="up" /><K.Star x={270} y={60} s={2.2} /></g> },
    ],
    check: [
      { prompt: "At 4 o'clock the big hand points to…", narration: "At four o'clock the big hand points to?", options: [num(12), num(4), num(6)], answer: 0 },
      { prompt: "What time is tidy-up finished?", options: [{ text: "5 o'clock" }, { text: "4 o'clock" }, { text: "12 o'clock" }], answer: 0 },
      { prompt: "The big hand going all the way round is…", options: [{ text: "one hour" }, { text: "one minute" }], answer: 0 },
      { prompt: "Little hand on 4, big hand on 12 means…", options: [{ text: "4:00" }, { text: "12:04" }], answer: 0 },
    ],
  },

  // ===== GRADE 3 (1) =====
  {
    id: "res-book-fair-share-farm", title: "The Fair Share Farm", subtitle: "Fractions of a group",
    level: "G3", audio: false, accent: "#f59e0b", coverFrom: "#fff0d0", coverTo: "#fff8ea", titleColor: "#8a5a0f",
    characters: [{ name: "Farmer Gita", role: "who shares the eggs" }],
    cover: <g><K.Sky from="#fff0d0" to="#fff8ea" /><K.Ground y={184} fill="#c9b48a" />{rowX(4, 30, 130, (x) => <Emoji x={x} y={110} s={20} e="🥚" />)}{rowX(4, 30, 130, (x) => <Emoji x={x} y={140} s={20} e="🥚" />)}<Emoji x={240} y={140} s={34} e="🐔" /></g>,
    pages: [
      { text: "Farmer Gita collects 12 eggs and shares them fairly between 3 baskets.", scene: <g><K.Sky from="#fff0d0" to="#fff8ea" /><K.Ground y={186} fill="#c9b48a" />{rowX(6, 24, 160, (x) => <Emoji x={x} y={100} s={18} e="🥚" />)}{rowX(6, 24, 160, (x) => <Emoji x={x} y={130} s={18} e="🥚" />)}<Emoji x={280} y={170} s={26} e="🐔" /></g> },
      { text: "\"To find one third of 12, I share the 12 eggs into 3 equal groups,\" she explains, placing them one by one.", scene: <g><K.Sky from="#fff0d0" to="#fff8ea" /><K.Ground y={186} fill="#c9b48a" />{rowX(3, 84, 160, (gx, g) => <g key={g}><rect x={gx - 34} y={90} width={68} height={54} rx={8} fill="#ffe9c2" stroke="#c99a54" strokeWidth={1.5} />{[0, 1, 2, 3].map((i) => <Emoji key={i} x={gx - 20 + (i % 2) * 24} y={106 + Math.floor(i / 2) * 22} s={16} e="🥚" />)}</g>)}</g> },
      { text: "Each basket holds 4 eggs. So one third of 12 is 4 — a third of the whole group.", scene: <g><K.Sky from="#fff0d0" to="#fff8ea" /><K.Ground y={186} fill="#c9b48a" />{rowX(4, 26, 160, (x) => <Emoji x={x} y={100} s={20} e="🥚" />)}<g transform="translate(160 150)"><text x={0} y={-12} fontSize={22} fontWeight={800} fill="#8a5a0f" textAnchor="middle" fontFamily={FONT}>1</text><line x1={-14} y1={0} x2={14} y2={0} stroke="#8a5a0f" strokeWidth={2.5} /><text x={0} y={14} fontSize={22} fontWeight={800} fill="#8a5a0f" textAnchor="middle" fontFamily={FONT}>3</text></g>{T(230, 150, "of 12 = 4", 15, "#199473")}</g> },
      { text: "For two thirds, she counts two of the baskets: 4 + 4 = 8 eggs. Two thirds of 12 is 8.", scene: <g><K.Sky from="#fff0d0" to="#fff8ea" /><K.Ground y={186} fill="#c9b48a" />{rowX(8, 22, 160, (x) => <Emoji x={x} y={100} s={16} e="🥚" />)}{T(160, 150, "two thirds of 12 = 8", 15, "#8a5a0f")}</g> },
      { text: "\"Fractions share a whole group into equal parts,\" smiles Gita. Every basket is fair, and every hen is happy.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#c9b48a" />{rowX(3, 70, 160, (x) => <Emoji x={x} y={120} s={28} e="🐔" />)}<K.Star x={50} y={56} s={2.2} /><K.Star x={270} y={60} s={2.2} /></g> },
    ],
    check: [
      { prompt: "One third of 12 eggs is…", narration: "One third of twelve eggs?", options: [num(3), num(4), num(6)], answer: 1 },
      { prompt: "To find 1/3, share into how many equal groups?", options: [num(3), num(2), num(4)], answer: 0 },
      { prompt: "Two thirds of 12 is…", options: [num(8), num(4), num(6)], answer: 0 },
      { prompt: "One half of 12 is…", narration: "One half of twelve?", options: [num(6), num(4), num(3)], answer: 0 },
    ],
  },

  // ===== GRADE 4 (2) =====
  {
    id: "res-book-bug-survey", title: "The Great Bug Survey", subtitle: "Tally charts & pictograms",
    level: "G4", audio: false, accent: "#22c55e", coverFrom: "#e0f6e6", coverTo: "#f1fbf3", titleColor: "#14663a",
    characters: [{ name: "Ravi", role: "a garden data-collector" }],
    cover: <g><K.Sky from="#e0f6e6" to="#f1fbf3" /><K.Ground y={184} fill="#8ed081" /><rect x={60} y={70} width={130} height={90} rx={8} fill="#fff" stroke="#c1cbde" strokeWidth={2} />{tally(7, 78, 88)}{tally(4, 78, 120)}<Emoji x={250} y={120} s={40} e="🐞" /></g>,
    pages: [
      { text: "Ravi surveys the minibeasts in the school garden, keeping a tally chart as he spots each one.", scene: <g><K.Sky from="#e0f6e6" to="#f1fbf3" /><K.Ground y={186} fill="#8ed081" /><Emoji x={90} y={110} s={30} e="🐞" /><Emoji x={160} y={130} s={26} e="🐝" /><Emoji x={220} y={110} s={26} e="🐛" /><K.Kid x={270} y={172} s={0.9} shirt="#22c55e" hairStyle="short" expr="happy" /></g> },
      { text: "Each bug gets one tally mark. Every fifth mark goes diagonally across the other four, making groups of five easy to count.", scene: <g><K.Sky from="#e0f6e6" to="#f1fbf3" /><K.Ground y={186} fill="#8ed081" />{T(90, 80, "🐞 ladybirds", 12, "#14663a")}{tally(7, 150, 70)}{T(240, 82, "= 7", 14, "#14663a")}</g> },
      { text: "He counts 7 ladybirds, 4 bees and 3 worms. The tallies turn his counting into clear totals.", scene: <g><K.Sky from="#e0f6e6" to="#f1fbf3" /><K.Ground y={186} fill="#8ed081" /><rect x={70} y={60} width={190} height={100} rx={8} fill="#fff" stroke="#c1cbde" strokeWidth={2} />{["🐞", "🐝", "🐛"].map((e, i) => <g key={i}><Emoji x={90} y={82 + i * 30} s={18} e={e} />{tally([7, 4, 3][i], 120, 74 + i * 30)}<text x={240} y={82 + i * 30} fontSize={13} fontWeight={800} fill="#14663a" fontFamily={FONT}>{[7, 4, 3][i]}</text></g>)}</g> },
      { text: "Ravi turns his totals into a pictogram, drawing one bug picture for each one. Now anyone can read the results at a glance.", scene: <g><K.Sky from="#e0f6e6" to="#f1fbf3" /><K.Ground y={186} fill="#8ed081" />{["🐞", "🐝", "🐛"].map((e, i) => <g key={i}>{rowX([7, 4, 3][i], 20, 60 + [7, 4, 3][i] * 10, (x) => <Emoji x={x} y={80 + i * 34} s={15} e={e} />)}</g>)}</g> },
      { text: "\"Ladybirds are the most common — the tallest row!\" says Ravi. A tally counts, a pictogram shows.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#8ed081" /><Emoji x={160} y={110} s={44} e="🐞" />{T(160, 160, "🐞 the most common", 13, "#14663a")}<K.Star x={50} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "In a tally, groups are counted in…", narration: "In a tally, groups are counted in?", options: [num(5), num(2), num(10)], answer: 0 },
      { prompt: "Which bug was most common?", options: [{ emoji: "🐞" }, { emoji: "🐝" }, { emoji: "🐛" }], answer: 0 },
      { prompt: "7 ladybirds + 4 bees + 3 worms = ? bugs", options: [num(14), num(12), num(10)], answer: 0 },
      { prompt: "A pictogram shows data using…", options: [{ text: "pictures" }, { text: "words only" }], answer: 0 },
    ],
  },
  {
    id: "res-book-mult-market", title: "The Multiplication Market", subtitle: "Arrays and times tables",
    level: "G4", audio: false, accent: "#c65d2e", coverFrom: "#ffe6cf", coverTo: "#fff6ec", titleColor: "#8a3d1a",
    characters: [{ name: "Zola", role: "a busy market trader" }],
    cover: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={184} fill="#e8c88a" /><rect x={80} y={90} width={110} height={70} rx={6} fill="#e8c88a" stroke="#c99a54" strokeWidth={2} />{Array.from({ length: 12 }).map((_, i) => <Emoji key={i} x={98 + (i % 4) * 24} y={106 + Math.floor(i / 4) * 22} s={16} e="🍎" />)}<K.Kid x={250} y={172} s={1.1} shirt="#c65d2e" hairStyle="curly" hair="#1a1a1a" expr="happy" /></g>,
    pages: [
      { text: "Zola arranges her apples in neat rows on the market stall — an array makes them quick to count.", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={186} fill="#e8c88a" /><rect x={110} y={80} width={110} height={70} rx={6} fill="#e8c88a" stroke="#c99a54" strokeWidth={2} />{Array.from({ length: 12 }).map((_, i) => <Emoji key={i} x={128 + (i % 4) * 24} y={96 + Math.floor(i / 4) * 22} s={16} e="🍎" />)}</g> },
      { text: "\"3 rows of 4 apples,\" says Zola. \"Instead of counting all 12, I can multiply: 3 × 4 = 12.\"", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={186} fill="#e8c88a" />{Array.from({ length: 12 }).map((_, i) => <Emoji key={i} x={120 + (i % 4) * 26} y={90 + Math.floor(i / 4) * 24} s={18} e="🍎" />)}{T(160, 172, "3 × 4 = 12", 18, "#8a3d1a")}</g> },
      { text: "A customer wants 5 bags with 6 oranges in each. Zola skip-counts in sixes: 6, 12, 18, 24, 30 — that's 30 oranges!", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={186} fill="#e8c88a" />{rowX(5, 50, 160, (x) => <Emoji x={x} y={100} s={26} e="🍊" />)}{T(160, 150, "5 × 6 = 30", 18, "#8a3d1a")}</g> },
      { text: "\"Multiplication is repeated addition made fast,\" she smiles. 6 + 6 + 6 + 6 + 6 is the same as 5 × 6.", scene: <g><K.Sky from="#ffe6cf" to="#fff6ec" /><K.Ground y={186} fill="#e8c88a" />{T(160, 100, "6+6+6+6+6 = 5 × 6", 15, "#8a3d1a")}{T(160, 140, "= 30", 20, "#199473")}</g> },
      { text: "By closing time Zola has sold every fruit. \"Rows and columns, times tables — the market maths that saves the day!\"", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#e8c88a" /><K.Kid x={160} y={170} s={1.3} shirt="#c65d2e" hairStyle="curly" expr="excited" arm="up" /><Emoji x={90} y={110} s={26} e="🍎" /><Emoji x={230} y={110} s={26} e="🍊" /><K.Star x={50} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "3 rows of 4 = ?", narration: "Three rows of four?", options: [num(7), num(12), num(9)], answer: 1 },
      { prompt: "5 × 6 = ?", narration: "Five times six?", options: [num(30), num(11), num(56)], answer: 0 },
      { prompt: "6 + 6 + 6 + 6 + 6 is the same as…", options: [{ text: "5 × 6" }, { text: "5 + 6" }], answer: 0 },
      { prompt: "Multiplication is repeated…", options: [{ text: "addition" }, { text: "subtraction" }], answer: 0 },
    ],
  },

  // ===== GRADE 5 (2) =====
  {
    id: "res-book-team-averages", title: "The Team Averages", subtitle: "Mode, median and range",
    level: "G5", audio: false, accent: "#6366f1", coverFrom: "#e3e7ff", coverTo: "#f1f3ff", titleColor: "#26346b",
    characters: [{ name: "Coach Rae", role: "who studies the scores" }],
    cover: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={184} fill="#a9c08a" />{[3, 5, 5, 2, 6].map((h, i) => <rect key={i} x={70 + i * 34} y={160 - h * 14} width={26} height={h * 14} rx={3} fill="#6366f1" stroke="#fff" strokeWidth={1.5} />)}<K.Kid x={260} y={172} s={1} shirt="#6366f1" hairStyle="cap" expr="think" /></g>,
    pages: [
      { text: "Coach Rae records the goals her netball team scored across five matches: 3, 5, 5, 2 and 6.", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#a9c08a" />{T(160, 90, "3   5   5   2   6", 22, "#26346b")}<K.Kid x={160} y={172} s={1.1} shirt="#6366f1" hairStyle="cap" expr="happy" /></g> },
      { text: "The MODE is the score that appears most often. The team scored 5 goals twice, so the mode is 5.", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#a9c08a" />{T(160, 90, "3   [5]   [5]   2   6", 20, "#26346b")}{T(160, 140, "mode = 5 (most often)", 14, "#26346b")}</g> },
      { text: "For the MEDIAN she puts the scores in order — 2, 3, 5, 5, 6 — and finds the middle one: 5.", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#a9c08a" />{T(160, 90, "2   3   [5]   5   6", 20, "#26346b")}{T(160, 140, "median = middle = 5", 14, "#26346b")}</g> },
      { text: "The RANGE shows how spread out the scores are: the highest minus the lowest, 6 − 2 = 4.", scene: <g><K.Sky from="#e3e7ff" to="#f1f3ff" /><K.Ground y={186} fill="#a9c08a" />{T(160, 100, "6 − 2 = 4", 24, "#26346b")}{T(160, 150, "range = 4", 15, "#199473")}</g> },
      { text: "\"Mode, median and range each tell a different story about the data,\" says Rae, planning the next match.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#a9c08a" />{[3, 5, 5, 2, 6].map((h, i) => <rect key={i} x={90 + i * 30} y={160 - h * 12} width={22} height={h * 12} rx={3} fill="#6366f1" stroke="#fff" strokeWidth={1.5} />)}<K.Star x={50} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Scores 3,5,5,2,6 — the mode is…", narration: "The mode of three, five, five, two, six?", options: [num(5), num(2), num(6)], answer: 0 },
      { prompt: "The median (middle in order) is…", options: [num(5), num(3), num(6)], answer: 0 },
      { prompt: "The range is 6 − 2 =", options: [num(4), num(8), num(2)], answer: 0 },
      { prompt: "The mode is the value that appears…", options: [{ text: "most often" }, { text: "in the middle" }], answer: 0 },
    ],
  },
  {
    id: "res-book-prime-detectives", title: "The Prime Detectives", subtitle: "Factors and prime numbers",
    level: "G5", audio: false, accent: "#14b8a6", coverFrom: "#cdf3ea", coverTo: "#eefbf7", titleColor: "#0c6b58",
    characters: [{ name: "Inspector Fio", role: "hunting number clues" }],
    cover: <g><K.Sky from="#cdf3ea" to="#eefbf7" />{numGrid([2, 3, 5, 7, 11, 13, 17, 19])}<Emoji x={280} y={180} s={30} e="🔍" /></g>,
    pages: [
      { text: "Inspector Fio investigates numbers. \"A factor,\" she says, \"is a number that divides exactly, with nothing left over.\"", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={186} fill="#c7e59a" />{T(160, 90, "factors of 6: 1, 2, 3, 6", 16, "#0c6b58")}<K.Kid x={160} y={172} s={1.1} shirt="#14b8a6" hairStyle="pony" hair="#1a1a1a" expr="think" /></g> },
      { text: "The number 6 has four factors: 1, 2, 3 and 6, because 6 can be shared into those equal groups.", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={186} fill="#c7e59a" />{rowX(2, 60, 160, (gx, g) => <g key={g}>{[0, 1, 2].map((i) => <Emoji key={i} x={gx - 22 + i * 22} y={110} s={16} e="🔵" />)}</g>)}{T(160, 150, "6 = 2 × 3", 16, "#0c6b58")}</g> },
      { text: "\"A PRIME number is special — it has exactly two factors, just 1 and itself.\" 7 is prime: only 1 × 7 works.", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" /><K.Ground y={186} fill="#c7e59a" />{T(160, 100, "7 = 1 × 7 only", 20, "#0c6b58")}{T(160, 145, "7 is PRIME", 16, "#199473")}</g> },
      { text: "Fio circles the primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19. Each hides from every divisor but 1 and itself!", scene: <g><K.Sky from="#cdf3ea" to="#eefbf7" />{numGrid([2, 3, 5, 7, 11, 13, 17, 19])}{T(160, 150, "primes to 20", 12, "#0c6b58")}</g> },
      { text: "\"Numbers with more than two factors are composite,\" she notes. Case closed — every number has its own identity.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#c7e59a" /><Emoji x={110} y={120} s={40} e="🔍" /><K.Kid x={210} y={172} s={1.1} shirt="#14b8a6" hairStyle="pony" expr="proud" /><K.Star x={60} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "A prime number has exactly…", narration: "A prime number has exactly how many factors?", options: [{ text: "2 factors" }, { text: "1 factor" }, { text: "3 factors" }], answer: 0 },
      { prompt: "Which is prime?", options: [num(7), num(6), num(9)], answer: 0 },
      { prompt: "A factor divides a number with…", options: [{ text: "nothing left over" }, { text: "a remainder" }], answer: 0 },
      { prompt: "Which is NOT prime?", options: [num(9), num(5), num(11)], answer: 0 },
    ],
  },

  // ===== GRADE 6 (2) =====
  {
    id: "res-book-millionaire-machine", title: "The Millionaire Machine", subtitle: "Big numbers & rounding",
    level: "G6", audio: false, accent: "#f59e0b", coverFrom: "#fff2d6", coverTo: "#fff9ec", titleColor: "#8a5a0f",
    characters: [{ name: "Ada", role: "the young inventor" }],
    cover: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={184} fill="#cbb089" /><rect x={70} y={90} width={180} height={44} rx={8} fill="#1b2540" />{T(160, 112, "1,000,000", 24, "#ffd84d")}<K.Robot x={260} y={172} s={1.1} body="#7fd1c9" expr="excited" /></g>,
    pages: [
      { text: "Ada's counting machine ticks past a thousand, then ten thousand, then a hundred thousand — and finally a whole million!", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={186} fill="#cbb089" /><rect x={70} y={80} width={180} height={40} rx={8} fill="#1b2540" />{T(160, 100, "1,000,000", 24, "#ffd84d")}<K.Robot x={160} y={172} s={1.1} body="#7fd1c9" expr="excited" /></g> },
      { text: "\"Each digit's place is worth ten times the one to its right,\" she explains, pointing to the columns.", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={186} fill="#cbb089" />{["M", "HTh", "TTh", "Th", "H", "T", "O"].map((l, i) => <g key={i}><rect x={40 + i * 36} y={90} width={32} height={30} rx={4} fill="#fff" stroke="#c99a54" strokeWidth={1.5} /><text x={56 + i * 36} y={105} fontSize={11} fontWeight={800} fill="#8a5a0f" textAnchor="middle" fontFamily={FONT}>{"1000000"[i]}</text><text x={56 + i * 36} y={132} fontSize={7} fill="#8a5a0f" textAnchor="middle" fontFamily={FONT}>{l}</text></g>)}</g> },
      { text: "The machine reads 24,600. \"To round to the nearest thousand, I look at the hundreds digit — 6, so round up to 25,000.\"", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={186} fill="#cbb089" />{T(160, 90, "24,600", 24, "#8a5a0f")}{T(160, 130, "≈ 25,000", 22, "#199473")}{T(160, 160, "(nearest thousand)", 12, "#8a5a0f")}</g> },
      { text: "For 24,300 the hundreds digit is 3, so it rounds DOWN to 24,000. \"Five or more rounds up; four or less rounds down.\"", scene: <g><K.Sky from="#fff2d6" to="#fff9ec" /><K.Ground y={186} fill="#cbb089" />{T(160, 90, "24,300 ≈ 24,000", 20, "#8a5a0f")}{T(160, 140, "5+ up · 4− down", 15, "#8a5a0f")}</g> },
      { text: "\"Place value builds any number, and rounding keeps big numbers friendly,\" beams Ada. Her machine whirs happily to a million and beyond.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#cbb089" /><rect x={80} y={90} width={160} height={40} rx={8} fill="#1b2540" />{T(160, 110, "1,000,000", 22, "#ffd84d")}<K.Robot x={160} y={176} s={1} body="#7fd1c9" expr="excited" /><K.Star x={60} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "How many zeros in one million?", narration: "How many zeros in one million?", options: [num(6), num(3), num(9)], answer: 0 },
      { prompt: "24,600 to the nearest thousand is…", options: [{ text: "25,000" }, { text: "24,000" }], answer: 0 },
      { prompt: "24,300 to the nearest thousand is…", options: [{ text: "24,000" }, { text: "25,000" }], answer: 0 },
      { prompt: "When rounding, 5 or more rounds…", options: [{ text: "up" }, { text: "down" }], answer: 0 },
    ],
  },
  {
    id: "res-book-cube-castle", title: "The Cube Castle", subtitle: "Finding volume",
    level: "G6", audio: false, accent: "#199473", coverFrom: "#c9f0e4", coverTo: "#eefbf7", titleColor: "#0c6b58",
    characters: [{ name: "Sir Cuboid", role: "a builder of blocks" }],
    cover: <g><K.Sky from="#c9f0e4" to="#eefbf7" /><K.Ground y={184} fill="#bfe3cf" />{Array.from({ length: 3 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => cube(90 + c * 24, 150 - r * 24, 22, "#7fd1c9")))}<K.Kid x={250} y={172} s={1.1} shirt="#199473" hairStyle="cap" hair="#1a1a1a" expr="happy" /></g>,
    pages: [
      { text: "Sir Cuboid builds his castle from identical unit cubes, each one exactly one centimetre on every side.", scene: <g><K.Sky from="#c9f0e4" to="#eefbf7" /><K.Ground y={186} fill="#bfe3cf" />{Array.from({ length: 2 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => cube(120 + c * 26, 150 - r * 26, 24, "#7fd1c9")))}</g> },
      { text: "\"Volume is the space inside — how many cubes fill the shape,\" he booms. One layer here is 4 across by 2 deep: 8 cubes.", scene: <g><K.Sky from="#c9f0e4" to="#eefbf7" /><K.Ground y={186} fill="#bfe3cf" />{Array.from({ length: 8 }).map((_, i) => cube(110 + (i % 4) * 26, 140 + Math.floor(i / 4) * 20, 22, "#8ed0c0"))}{T(160, 175, "1 layer = 4 × 2 = 8", 14, "#0c6b58")}</g> },
      { text: "He stacks the layer 3 high. \"Length × width × height: 4 × 2 × 3 = 24 cubic centimetres of castle!\"", scene: <g><K.Sky from="#c9f0e4" to="#eefbf7" /><K.Ground y={186} fill="#bfe3cf" />{Array.from({ length: 3 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => cube(100 + c * 24, 150 - r * 24, 22, "#7fd1c9")))}{T(160, 176, "4 × 2 × 3 = 24 cm³", 15, "#0c6b58")}</g> },
      { text: "A tower 2 by 2 by 5 has volume 2 × 2 × 5 = 20 cubes — tall and slim, but still measured the same clever way.", scene: <g><K.Sky from="#c9f0e4" to="#eefbf7" /><K.Ground y={186} fill="#bfe3cf" />{Array.from({ length: 5 }).map((_, r) => Array.from({ length: 2 }).map((_, c) => cube(140 + c * 24, 160 - r * 22, 20, "#8ed0c0")))}{T(230, 110, "2×2×5", 15, "#0c6b58")}{T(230, 135, "= 20 cm³", 14, "#199473")}</g> },
      { text: "\"Area covers a flat surface; volume fills a solid space,\" declares Sir Cuboid. His cube castle stands proud and perfectly measured.", scene: <g><K.Sky from="#ffe1c4" to="#fff5ea" /><K.Ground y={186} fill="#bfe3cf" />{Array.from({ length: 2 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => cube(110 + c * 26, 150 - r * 26, 24, "#7fd1c9")))}<K.Kid x={250} y={172} s={1.1} shirt="#199473" hairStyle="cap" expr="excited" arm="up" /><K.Star x={60} y={56} s={2.2} /></g> },
    ],
    check: [
      { prompt: "Volume of a 4 × 2 × 3 cuboid?", narration: "Volume of a four by two by three cuboid?", options: [{ text: "24 cm³" }, { text: "9 cm³" }, { text: "16 cm³" }], answer: 0 },
      { prompt: "Volume measures the…", options: [{ text: "space inside a solid" }, { text: "flat surface" }], answer: 0 },
      { prompt: "2 × 2 × 5 = ?", narration: "Two times two times five?", options: [num(20), num(9), num(25)], answer: 0 },
      { prompt: "Volume is measured in…", options: [{ text: "cubic units" }, { text: "square units" }], answer: 0 },
    ],
  },
];
