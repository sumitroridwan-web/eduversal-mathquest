"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { RotateCcw, Heart, Trophy, Play, Star, Coins, Volume2, VolumeX } from "lucide-react";
import { sfx, type Sfx } from "@/lib/sound";
import { useSound } from "@/stores/sound";
import type { Resource } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn, clamp } from "@/lib/utils";
import { gradeRank } from "@/lib/cra";
import { PresentStage } from "./PresentStage";
import { MultiplayerGame, MULTIPLAYER_IDS } from "./multiplayerEngines";

// ==========================================================
// MathQuest Games — real game-genre engines. The mathematical
// action IS the gameplay (no quiz). Interaction-driven (tap /
// drag / steer), CSS motion, immediate feedback, score / lives /
// stars / win state, keyboard + touch friendly.
//
// Shared across every game: a difficulty selector (Easy / Normal /
// Hard) that shifts the effective grade, and a CSP-safe Web Audio
// sound engine (synthesised tones, no asset files) with a mute
// toggle. Both live in the GameFrame header and persist locally.
// ==========================================================

const rnd = (n: number) => Math.floor(Math.random() * n);
function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
function distinct(count: number, max: number, min = 1): number[] { const s = new Set<number>(); let guard = 0; while (s.size < count && guard++ < 500) s.add(min + rnd(max - min + 1)); return [...s]; }

// ---------------- shared settings context (sound is global — lib/sound) ----------------
type Diff = "easy" | "normal" | "hard";
const DIFF_OFFSET: Record<Diff, number> = { easy: -2, normal: 0, hard: 2 };
const DIFF_LABEL: Record<Diff, string> = { easy: "Easy", normal: "Normal", hard: "Hard" };

type GameSettings = { diff: Diff; setDiff: (d: Diff) => void; sfx: (n: Sfx) => void };
const GameCtx = createContext<GameSettings | null>(null);
function useGame(): GameSettings {
  const v = useContext(GameCtx);
  if (!v) throw new Error("useGame must be used inside GameEngine");
  return v;
}
/** Effective grade rank after applying the chosen difficulty (clamped to 0–8). */
function useDiffGrade(resource: Resource): number {
  const { diff } = useGame();
  return clamp(gradeRank(resource) + DIFF_OFFSET[diff], 0, 8);
}

export function GameEngine({ resource }: { resource: Resource }) {
  const [diff, setDiff] = useState<Diff>("normal");

  // load persisted difficulty after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    try {
      const d = window.localStorage.getItem("mq-game-diff");
      if (d === "easy" || d === "normal" || d === "hard") setDiff(d);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { window.localStorage.setItem("mq-game-diff", diff); } catch { /* ignore */ } }, [diff]);

  const value = useMemo<GameSettings>(() => ({ diff, setDiff, sfx }), [diff]);

  return (
    <GameCtx.Provider value={value}>
      <PresentStage title={resource.title} buttonLabel="Full screen" defaultZoom={1.1} stageWidth={720}>
        <GameBody resource={resource} />
      </PresentStage>
    </GameCtx.Provider>
  );
}

function GameBody({ resource }: { resource: Resource }) {
  if (MULTIPLAYER_IDS.includes(resource.id)) return <MultiplayerGame resource={resource} />;
  switch (resource.id) {
    case "res-counting-objects": return <CatchGame resource={resource} mode="count" />;
    case "res-compare-quantities": return <CatchGame resource={resource} mode="compare" />;
    case "res-number-hunt": return <CatchGame resource={resource} mode="number" />;
    case "res-number-matching": return <MemoryMatch resource={resource} />;
    case "res-shape-detective": return <ShapeShooter resource={resource} />;
    case "res-pattern-builder": return <PatternGame resource={resource} />;
    case "res-addition-race": return <TugOfWar resource={resource} />;
    case "res-subtraction-adventure": return <HopGame resource={resource} />;
    case "res-place-value-builder": return <StackGame resource={resource} />;
    case "res-times-table-challenge": return <ArrayDefense resource={resource} />;
    case "res-fraction-pizza": return <PizzaGame resource={resource} />;
    case "res-money-shop": return <CoinGame resource={resource} />;
    case "res-data-graph-challenge": return <DataSortGame resource={resource} />;
    case "res-problem-solving-mission": return <MazeGame resource={resource} />;
    default: return <CatchGame resource={resource} mode="count" />;
  }
}

// ---------------- shared shell ----------------
function DiffPicker() {
  const { diff, setDiff } = useGame();
  return (
    <div className="inline-flex overflow-hidden rounded-lg ring-1 ring-white/25" role="group" aria-label="Difficulty">
      {(["easy", "normal", "hard"] as Diff[]).map((d) => (
        <button key={d} onClick={() => setDiff(d)} aria-pressed={diff === d}
          className={cn("px-2 py-1 text-xs font-semibold transition-colors", diff === d ? "bg-accent-400 text-navy-900" : "bg-white/10 text-white/70 hover:bg-white/20")}>
          {DIFF_LABEL[d]}
        </button>
      ))}
    </div>
  );
}
function MuteButton() {
  const muted = useSound((s) => s.muted);
  const setMuted = useSound((s) => s.setMuted);
  return (
    <button onClick={() => { const next = !muted; setMuted(next); if (!next) sfx("pop"); }} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted}
      className="rounded-lg bg-white/15 p-1.5 hover:bg-white/25">
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
function GameFrame({ instruction, stats, onRestart, over, overText, overWin, children }: {
  instruction: React.ReactNode; stats: React.ReactNode; onRestart: () => void; over: boolean; overText: React.ReactNode; overWin: boolean; children: React.ReactNode;
}) {
  const { sfx } = useGame();
  // Centralised win / lose stinger — every engine gets it for free.
  useEffect(() => { if (over) sfx(overWin ? "win" : "lose"); }, [over, overWin, sfx]);
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-navy-100 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-navy-900 px-4 py-2.5 text-white">
        <p className="text-sm font-semibold sm:text-base">{instruction}</p>
        <div className="flex flex-wrap items-center gap-2.5 text-sm">{stats}
          <DiffPicker />
          <MuteButton />
          <button onClick={onRestart} className="rounded-lg bg-white/15 p-1.5 hover:bg-white/25" aria-label="Restart"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="relative min-h-[300px] bg-gradient-to-b from-sky-50 to-white">
        {children}
        {over && (
          <div className="absolute inset-0 z-20 flex animate-fade-in flex-col items-center justify-center gap-3 bg-navy-950/60 p-6 text-center backdrop-blur-sm">
            <Trophy className={cn("h-16 w-16", overWin ? "text-accent-400" : "text-white/70")} />
            <p className="font-display text-2xl font-bold text-white">{overText}</p>
            {overWin && <div className="text-3xl">⭐⭐⭐</div>}
            <Button variant="accent" onClick={onRestart}><Play className="h-4 w-4" /> Play again</Button>
          </div>
        )}
      </div>
    </div>
  );
}
function Lives({ n }: { n: number }) {
  return <span className="inline-flex gap-0.5">{Array.from({ length: 3 }).map((_, i) => <Heart key={i} className={cn("h-4 w-4", i < n ? "fill-rose-400 text-rose-400" : "text-white/25")} />)}</span>;
}
function Score({ value, icon }: { value: React.ReactNode; icon?: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 font-bold">{icon ?? <Star className="h-4 w-4 fill-accent-400 text-accent-400" />}{value}</span>;
}
function Dots({ n, color = "#f43f5e" }: { n: number; color?: string }) {
  const cols = n <= 4 ? 2 : 3;
  return <div className="grid justify-center gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>{Array.from({ length: n }).map((_, i) => <span key={i} className="h-3.5 w-3.5 rounded-full" style={{ background: color }} />)}</div>;
}
function useKeys(handler: (k: string) => void) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) { e.preventDefault(); handler(e.key); } };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [handler]);
}

// ================= 1. CATCHER (count / compare / number) =================
function CatchGame({ resource, mode }: { resource: Resource; mode: "count" | "compare" | "number" }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const maxN = mode === "number" ? (g <= 3 ? 20 : 100) : (g <= 1 ? 5 : 9);
  const GOAL = 8;
  const newRound = () => {
    const vals = distinct(3, maxN);
    if (mode === "compare") { const mx = Math.max(...vals); return { prompt: "Catch the group with the MOST 🧺", lanes: vals.map((v) => ({ v, correct: v === mx })) }; }
    const t = vals[rnd(3)];
    return { prompt: mode === "count" ? `Catch exactly ${t}` : `Catch the number ${t}`, lanes: vals.map((v) => ({ v, correct: v === t })) };
  };
  const [round, setRound] = useState(newRound);
  const [basket, setBasket] = useState(1);
  const [drop, setDrop] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState<null | number>(null);
  const won = score >= GOAL, lost = lives <= 0, over = won || lost;

  const doDrop = () => {
    if (drop || over) return;
    setDrop(true);
    window.setTimeout(() => {
      const caught = round.lanes[basket];
      if (caught.correct) { setScore((s) => s + 1); setFlash(basket); sfx("good"); } else { setLives((l) => l - 1); sfx("bad"); }
      window.setTimeout(() => { setDrop(false); setFlash(null); setBasket(1); setRound(newRound()); }, 550);
    }, 600);
  };
  useKeys((k) => { if (over) return; if (k === "ArrowLeft") setBasket((b) => clamp(b - 1, 0, 2)); if (k === "ArrowRight") setBasket((b) => clamp(b + 1, 0, 2)); if (k === " ") doDrop(); });
  const restart = () => { setScore(0); setLives(3); setBasket(1); setDrop(false); setFlash(null); setRound(newRound()); };

  return (
    <GameFrame instruction={round.prompt} onRestart={restart} over={over} overWin={won} overText={won ? "You win! 🎉" : "Out of lives — try again!"}
      stats={<><Score value={`${score}/${GOAL}`} /><Lives n={lives} /></>}>
      <div className="grid h-[300px] grid-cols-3">
        {round.lanes.map((lane, i) => (
          <button key={i} onClick={() => { if (!drop && !over) setBasket(i); }} className="relative border-x border-sky-100/60">
            <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-card ring-2 ring-navy-100 transition-all duration-[600ms]"
              style={{ top: drop ? (i === basket ? 200 : 240) : 16, opacity: drop && i !== basket ? 0.3 : 1 }}>
              {mode === "number" ? <span className="font-display text-3xl font-bold text-navy-900">{lane.v}</span> : <Dots n={lane.v} />}
            </div>
            <div className={cn("absolute bottom-3 left-1/2 flex h-14 w-16 -translate-x-1/2 items-center justify-center rounded-b-2xl rounded-t-lg text-3xl transition-all",
              basket === i ? "bg-accent-400 ring-4 ring-accent-200" : "bg-navy-100", flash === i && "scale-125")}>🧺</div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 pb-3">
        <Button size="sm" variant="outline" onClick={() => setBasket((b) => clamp(b - 1, 0, 2))}>◀</Button>
        <Button size="sm" variant="secondary" onClick={doDrop} disabled={drop}>Catch!</Button>
        <Button size="sm" variant="outline" onClick={() => setBasket((b) => clamp(b + 1, 0, 2))}>▶</Button>
      </div>
    </GameFrame>
  );
}

// ================= 2. MEMORY MATCH (numeral ↔ dots) =================
function MemoryMatch({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const pairs = g <= 1 ? 4 : g >= 4 ? 6 : 5;
  const build = () => {
    const nums = shuffle(Array.from({ length: 9 }, (_, i) => i + 1)).slice(0, pairs);
    const cards = shuffle(nums.flatMap((n) => [{ id: `${n}-a`, n, kind: "num" as const }, { id: `${n}-b`, n, kind: "dot" as const }]));
    return cards;
  };
  const [cards, setCards] = useState(build);
  const [up, setUp] = useState<string[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const won = done.length === pairs;

  const flip = (id: string, n: number) => {
    if (up.length === 2 || up.includes(id) || done.includes(n)) return;
    const nu = [...up, id];
    setUp(nu);
    sfx("tick");
    if (nu.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nu;
      const na = cards.find((c) => c.id === a)!.n, nb = cards.find((c) => c.id === b)!.n;
      window.setTimeout(() => { if (na === nb) { setDone((d) => [...d, na]); sfx("good"); } else sfx("bad"); setUp([]); }, 700);
    }
  };
  const restart = () => { setCards(build()); setUp([]); setDone([]); setMoves(0); };
  return (
    <GameFrame instruction="Match each number to its dots 🃏" onRestart={restart} over={won} overWin overText={`Matched in ${moves} tries!`}
      stats={<><Score value={`${done.length}/${pairs}`} /><span className="text-xs text-white/70">{moves} tries</span></>}>
      <div className="mx-auto grid max-w-md gap-2.5 p-4" style={{ gridTemplateColumns: `repeat(${pairs >= 5 ? 5 : 4}, minmax(0,1fr))` }}>
        {cards.map((c) => {
          const faceUp = up.includes(c.id) || done.includes(c.n);
          return (
            <button key={c.id} onClick={() => flip(c.id, c.n)}
              className={cn("flex aspect-[3/4] items-center justify-center rounded-xl border-2 text-center transition-all",
                faceUp ? "border-teal-300 bg-white shadow-card [transform:rotateY(0)]" : "border-navy-300 bg-navy-700 text-white",
                done.includes(c.n) && "opacity-60 ring-2 ring-emerald-400")}>
              {faceUp ? (c.kind === "num" ? <span className="font-display text-2xl font-bold text-navy-900">{c.n}</span> : <Dots n={c.n} color="#14b8a6" />) : <span className="text-2xl">❓</span>}
            </button>
          );
        })}
      </div>
    </GameFrame>
  );
}

// ================= 3. SHAPE SHOOTER =================
const SHAPES = [
  { k: "circle", label: "circle", draw: (c: string) => <circle cx={20} cy={20} r={16} fill={c} /> },
  { k: "square", label: "square", draw: (c: string) => <rect x={5} y={5} width={30} height={30} rx={3} fill={c} /> },
  { k: "triangle", label: "triangle", draw: (c: string) => <path d="M20 4 L36 34 L4 34 Z" fill={c} /> },
  { k: "rectangle", label: "rectangle", draw: (c: string) => <rect x={2} y={10} width={36} height={20} rx={3} fill={c} /> },
  { k: "star", label: "star", draw: (c: string) => <path transform="translate(20 21) scale(1.7)" d="M0 -9 L2.6 -2.8 L9 -2.8 L3.9 1.1 L5.6 7.3 L0 3.6 L-5.6 7.3 L-3.9 1.1 L-9 -2.8 L-2.6 -2.8 Z" fill={c} /> },
  { k: "pentagon", label: "pentagon", draw: (c: string) => <path d="M20 3 L36 15 L30 34 L10 34 L4 15 Z" fill={c} /> },
];
const SH_COLORS = ["#14b8a6", "#f59e0b", "#6366f1", "#f43f5e", "#22c55e"];
function ShapeShooter({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const kinds = g <= 1 ? 3 : g <= 3 ? 4 : 6;
  const newWave = () => {
    const target = SHAPES[rnd(kinds)];
    const items = Array.from({ length: 8 }, (_, i) => ({ id: i, s: SHAPES[rnd(kinds)], c: SH_COLORS[rnd(SH_COLORS.length)], x: 6 + rnd(80), y: 8 + rnd(70), hit: false }));
    if (!items.some((it) => it.s.k === target.k)) items[0].s = target;
    return { target, items };
  };
  const [wave, setWave] = useState(newWave);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const remaining = wave.items.filter((it) => it.s.k === wave.target.k && !it.hit).length;
  const won = level > 5, lost = lives <= 0, over = won || lost;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (remaining === 0 && !over) { const t = window.setTimeout(() => { setLevel((l) => l + 1); setWave(newWave()); }, 500); return () => clearTimeout(t); } }, [remaining, over]);

  const shoot = (id: number) => {
    if (over) return;
    setWave((w) => {
      const it = w.items.find((x) => x.id === id)!;
      if (it.hit) return w;
      if (it.s.k === w.target.k) { setScore((s) => s + 1); sfx("pop"); return { ...w, items: w.items.map((x) => x.id === id ? { ...x, hit: true } : x) }; }
      setLives((l) => l - 1); sfx("bad"); return { ...w, items: w.items.map((x) => x.id === id ? { ...x, hit: true } : x) };
    });
  };
  const restart = () => { setScore(0); setLives(3); setLevel(1); setWave(newWave()); };
  return (
    <GameFrame instruction={<>Blast every <b>{wave.target.label}</b>! 🚀</>} onRestart={restart} over={over} overWin={won} overText={won ? "Galaxy cleared! 🌟" : "Out of lives!"}
      stats={<><Score value={score} /><span className="text-xs text-white/70">Lvl {Math.min(level, 5)}/5</span><Lives n={lives} /></>}>
      <div className="relative h-[300px] overflow-hidden">
        {wave.items.map((it) => (
          <button key={it.id} onClick={() => shoot(it.id)} disabled={it.hit}
            className={cn("absolute transition-all duration-300", it.hit && "scale-0 opacity-0")} style={{ left: `${it.x}%`, top: `${it.y}%` }} aria-label={it.s.label}>
            <svg viewBox="0 0 40 40" className="h-11 w-11 drop-shadow transition-transform hover:scale-110">{it.s.draw(it.c)}</svg>
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

// ================= 4. PATTERN CONVEYOR =================
const PAT_COLORS = ["#14b8a6", "#f59e0b", "#6366f1", "#f43f5e"];
function PatternGame({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const GOAL = 6;
  const newRound = () => {
    const unitLen = g <= 1 ? 2 : 2 + rnd(2); // 2 or 3
    const kinds = shuffle([0, 1, 2, 3]).slice(0, unitLen);
    const unit = Array.from({ length: unitLen }, (_, i) => kinds[i]);
    const shown = Array.from({ length: unitLen * 2 }, (_, i) => unit[i % unitLen]);
    const answer = unit[(unitLen * 2) % unitLen];
    const tray = shuffle(Array.from(new Set([answer, ...shuffle([0, 1, 2, 3]).slice(0, 2)])));
    return { shown, answer, tray };
  };
  const [round, setRound] = useState(newRound);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wrong, setWrong] = useState<number | null>(null);
  const won = score >= GOAL, lost = lives <= 0, over = won || lost;
  const pick = (k: number) => {
    if (over) return;
    if (k === round.answer) { setScore((s) => s + 1); setWrong(null); sfx("good"); window.setTimeout(() => setRound(newRound()), 250); }
    else { setLives((l) => l - 1); setWrong(k); sfx("bad"); window.setTimeout(() => setWrong(null), 500); }
  };
  const Block = ({ k, size = 44 }: { k: number; size?: number }) => <span className="inline-block rounded-lg shadow-sm ring-2 ring-white" style={{ width: size, height: size, background: PAT_COLORS[k] }} />;
  const restart = () => { setScore(0); setLives(3); setWrong(null); setRound(newRound()); };
  return (
    <GameFrame instruction="What comes next on the belt? 🧱" onRestart={restart} over={over} overWin={won} overText={won ? "Pattern master! 🎉" : "Belt jammed — try again!"}
      stats={<><Score value={`${score}/${GOAL}`} /><Lives n={lives} /></>}>
      <div className="flex flex-col items-center gap-6 p-6">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-navy-800 p-3">
          {round.shown.map((k, i) => <Block key={i} k={k} />)}
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-dashed border-white/60 text-xl font-bold text-white">?</span>
        </div>
        <p className="text-sm font-semibold text-navy-500">Tap the piece that continues the pattern</p>
        <div className="flex gap-3">
          {round.tray.map((k) => (
            <button key={k} onClick={() => pick(k)} className={cn("rounded-xl p-1 transition-transform hover:scale-110", wrong === k && "animate-pulse ring-4 ring-red-300")}><Block k={k} size={52} /></button>
          ))}
        </div>
      </div>
    </GameFrame>
  );
}

// ================= 5. TUG OF WAR (addition) =================
function TugOfWar({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const maxSum = g <= 3 ? 20 : 50;
  const newTarget = () => 6 + rnd(maxSum - 6);
  const [target, setTarget] = useState(newTarget);
  const [sum, setSum] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [rope, setRope] = useState(50); // 0..100, 100 = you win
  const [flash, setFlash] = useState<null | "pull" | "lose">(null);
  const tokens = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const won = rope >= 100, lost = rope <= 0, over = won || lost;
  const tap = (v: number) => {
    if (over) return;
    const ns = sum + v;
    if (ns === target) { setRope((r) => clamp(r + 14, 0, 100)); setFlash("pull"); setSum(0); setPicked([]); setTarget(newTarget()); sfx("good"); window.setTimeout(() => setFlash(null), 400); }
    else if (ns > target) { setRope((r) => clamp(r - 10, 0, 100)); setFlash("lose"); setSum(0); setPicked([]); sfx("bad"); window.setTimeout(() => setFlash(null), 400); }
    else { setSum(ns); setPicked((p) => [...p, v]); sfx("tick"); }
  };
  const restart = () => { setRope(50); setSum(0); setPicked([]); setTarget(newTarget()); setFlash(null); };
  return (
    <GameFrame instruction={<>Make <b>{target}</b> to pull! 🪢</>} onRestart={restart} over={over} overWin={won} overText={won ? "You won the tug! 💪" : "You got pulled in — try again!"}
      stats={<Score value={<>Pull {Math.round(rope)}%</>} icon={<span>🪢</span>} />}>
      <div className="flex flex-col gap-5 p-5">
        <div className="relative h-16 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-100 via-white to-accent-100">
          <div className="absolute inset-y-0 w-1 bg-navy-300" style={{ left: "50%" }} />
          <div className={cn("absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900 text-2xl transition-all duration-300", flash === "pull" && "scale-125")}
            style={{ left: `calc(${rope}% - 24px)` }}>🚩</div>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl">🧑‍🤝‍🧑</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">👹</span>
        </div>
        <div className="text-center">
          <p className="text-sm text-navy-500">Your total</p>
          <p className={cn("font-display text-4xl font-bold", sum > target ? "text-red-500" : "text-navy-900")}>{sum} <span className="text-lg text-navy-400">/ {target}</span></p>
          <p className="mt-1 text-xs text-navy-400">{picked.join(" + ") || "tap numbers to add"}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {tokens.map((v) => <button key={v} onClick={() => tap(v)} className="h-12 w-12 rounded-xl bg-teal-500 font-display text-xl font-bold text-white shadow transition-transform hover:scale-110 active:scale-95">{v}</button>)}
        </div>
      </div>
    </GameFrame>
  );
}

// ================= 6. NUMBER-LINE HOP (subtraction) =================
function HopGame({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const max = g <= 3 ? 20 : 30;
  const [start, setStart] = useState(() => 10 + rnd(max - 10));
  const [pos, setPos] = useState(start);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [hop, setHop] = useState(false);
  const won = level > 5, lost = lives <= 0, over = won || lost;
  const jumps = [1, 2, 5, 10];
  const back = (n: number) => {
    if (over || hop) return;
    const np = pos - n;
    setHop(true);
    window.setTimeout(() => {
      setHop(false);
      if (np === 0) { setLevel((l) => l + 1); const ns = 10 + rnd(max - 10); setStart(ns); setPos(ns); sfx("good"); }
      else if (np < 0) { setLives((l) => l - 1); setPos(start); sfx("bad"); }
      else { setPos(np); sfx("tick"); }
    }, 350);
  };
  const restart = () => { const ns = 10 + rnd(max - 10); setStart(ns); setPos(ns); setLevel(1); setLives(3); };
  const W = start;
  return (
    <GameFrame instruction={<>Hop the frog back to <b>0</b>! 🐸</>} onRestart={restart} over={over} overWin={won} overText={won ? "Home safe! 🎉" : "Splash! Try again!"}
      stats={<><span className="text-xs text-white/70">Lvl {Math.min(level, 5)}/5</span><Lives n={lives} /></>}>
      <div className="flex flex-col gap-6 p-6">
        <div className="relative mx-auto h-16 w-full max-w-lg">
          <div className="absolute top-10 h-1.5 w-full rounded bg-navy-300" />
          {Array.from({ length: W + 1 }, (_, i) => i).map((i) => (
            <div key={i} className="absolute top-8 flex -translate-x-1/2 flex-col items-center" style={{ left: `${(i / W) * 100}%` }}>
              <span className="h-5 w-0.5 bg-navy-300" />
              {(i === 0 || i === W || i % 5 === 0) && <span className="mt-0.5 text-[10px] font-bold text-navy-500">{i}</span>}
            </div>
          ))}
          <div className={cn("absolute -top-1 -translate-x-1/2 text-3xl transition-all duration-300", hop && "-translate-y-3")} style={{ left: `${(pos / W) * 100}%` }}>🐸</div>
          <div className="absolute top-8 -translate-x-1/2 text-lg" style={{ left: "0%" }}>🏠</div>
        </div>
        <p className="text-center font-display text-2xl font-bold text-navy-900">at {pos} — hop back to land on 0</p>
        <div className="flex flex-wrap justify-center gap-2">
          {jumps.map((n) => <button key={n} onClick={() => back(n)} disabled={hop} className="rounded-xl bg-emerald-500 px-4 py-2 font-display text-lg font-bold text-white shadow transition-transform hover:scale-105 active:scale-95 disabled:opacity-50">− {n}</button>)}
        </div>
      </div>
    </GameFrame>
  );
}

// ================= 7. PLACE-VALUE STACKER =================
function StackGame({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const digits = g >= 6 ? 4 : 3;
  const target0 = () => rnd(digits === 4 ? 9000 : 900) + (digits === 4 ? 1000 : 100);
  const [target, setTarget] = useState(target0);
  const [th, setTh] = useState(0); const [h, setH] = useState(0); const [t, setT] = useState(0); const [o, setO] = useState(0);
  const [level, setLevel] = useState(1);
  const value = th * 1000 + h * 100 + t * 10 + o;
  const won = level > 5, over = won;
  const launched = value === target;
  useEffect(() => { if (launched && !won) sfx("good"); }, [launched, won, sfx]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (launched && !won) { const tm = window.setTimeout(() => { setLevel((l) => l + 1); setTarget(target0()); setTh(0); setH(0); setT(0); setO(0); }, 900); return () => clearTimeout(tm); } }, [launched, won]);
  const restart = () => { setLevel(1); setTarget(target0()); setTh(0); setH(0); setT(0); setO(0); };
  const Col = ({ label, n, set, color }: { label: string; n: number; set: (f: (x: number) => number) => void; color: string }) => (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-semibold text-navy-500">{label}</span>
      <div className="flex h-28 w-12 flex-col-reverse items-center gap-0.5 rounded-lg bg-navy-50 p-1">
        {Array.from({ length: n }).map((_, i) => <span key={i} className="w-full shrink-0 rounded-sm" style={{ height: 8, background: color }} />)}
      </div>
      <div className="flex gap-1">
        <button onClick={() => { set((x) => Math.max(0, x - 1)); sfx("tick"); }} className="h-7 w-7 rounded-lg border border-navy-200 font-bold text-navy-600">−</button>
        <button onClick={() => { set((x) => Math.min(digits === 4 && label === "Th" ? 9 : 12, x + 1)); sfx("tick"); }} className="h-7 w-7 rounded-lg border border-navy-200 font-bold text-navy-600">+</button>
      </div>
    </div>
  );
  return (
    <GameFrame instruction={<>Build the number <b>{target}</b> 🚀</>} onRestart={restart} over={over} overWin overText="All rockets launched! 🚀"
      stats={<span className="text-xs text-white/70">Lvl {Math.min(level, 5)}/5</span>}>
      <div className="flex flex-col items-center gap-4 p-5">
        <div className={cn("text-center transition-all", launched && "scale-110")}>
          <p className="font-display text-4xl font-bold" style={{ color: launched ? "#16a34a" : "#1b2540" }}>{value}</p>
          <p className="text-xs text-navy-400">{launched ? "Lift off! 🚀" : `target ${target}`}</p>
        </div>
        <div className="flex gap-3">
          {digits === 4 && <Col label="Th" n={th} set={setTh} color="#6366f1" />}
          <Col label="H" n={h} set={setH} color="#1b2540" />
          <Col label="T" n={t} set={setT} color="#14b8a6" />
          <Col label="O" n={o} set={setO} color="#f59e0b" />
        </div>
      </div>
    </GameFrame>
  );
}

// ================= 8. ARRAY-BLAST DEFENCE (times tables) =================
function ArrayDefense({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const tables = g <= 2 ? [2, 5, 10] : g <= 4 ? [2, 3, 5, 10] : [2, 3, 4, 5, 10];
  const rowMax = g <= 2 ? 3 : 5;
  const newWave = () => { const c = tables[rnd(tables.length)]; const r = 2 + rnd(rowMax); return { rows: r, cols: c }; };
  const [wave, setWave] = useState(newWave);
  const [rows, setRows] = useState(1); const [cols, setCols] = useState(1);
  const [level, setLevel] = useState(1); const [lives, setLives] = useState(3);
  const [blasting, setBlasting] = useState(false);
  const won = level > 5, lost = lives <= 0, over = won || lost;
  const fire = () => {
    if (over || blasting) return;
    if (rows === wave.rows && cols === wave.cols) {
      setBlasting(true); sfx("good");
      window.setTimeout(() => { setBlasting(false); setLevel((l) => l + 1); setWave(newWave()); setRows(1); setCols(1); }, 500);
    } else { setLives((l) => l - 1); sfx("bad"); }
  };
  const restart = () => { setWave(newWave()); setRows(1); setCols(1); setLevel(1); setLives(3); };
  return (
    <GameFrame instruction="Match the blast to the invaders, then FIRE! 👾" onRestart={restart} over={over} overWin={won} overText={won ? "Planet defended! 🛸" : "Invaded — try again!"}
      stats={<><span className="text-xs text-white/70">Lvl {Math.min(level, 5)}/5</span><Lives n={lives} /></>}>
      <div className="flex flex-col items-center gap-4 p-5">
        <div className={cn("grid gap-1 rounded-2xl bg-navy-800 p-3 transition-all", blasting && "scale-0 opacity-0")} style={{ gridTemplateColumns: `repeat(${wave.cols}, minmax(0,1fr))` }}>
          {Array.from({ length: wave.rows * wave.cols }).map((_, i) => <span key={i} className="text-xl">👾</span>)}
        </div>
        <p className="font-display text-lg font-bold text-navy-900">{wave.rows} rows of {wave.cols} = <span className="text-teal-600">{rows * cols === wave.rows * wave.cols ? rows * cols : "?"}</span></p>
        <div className="flex items-end gap-6">
          <div className="text-center"><p className="mb-1 text-xs font-semibold text-navy-500">Rows: {rows}</p><input type="range" min={1} max={6} value={rows} onChange={(e) => setRows(Number(e.target.value))} className="accent-teal-600" /></div>
          <div className="text-center"><p className="mb-1 text-xs font-semibold text-navy-500">Columns: {cols}</p><input type="range" min={1} max={10} value={cols} onChange={(e) => setCols(Number(e.target.value))} className="accent-accent-500" /></div>
        </div>
        <div className="grid gap-0.5 rounded-lg bg-teal-50 p-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, i) => <span key={i} className="h-3 w-3 rounded-sm bg-teal-500" />)}
        </div>
        <Button variant="danger" onClick={fire} disabled={blasting}>🔥 Fire ({rows} × {cols} = {rows * cols})</Button>
      </div>
    </GameFrame>
  );
}

// ================= 9. PIZZA SHOP (fractions) =================
function PizzaGame({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const dens = g <= 4 ? [2, 3, 4] : [2, 3, 4, 6, 8];
  const GOAL = 6;
  const newOrder = () => { const d = dens[rnd(dens.length)]; const n = 1 + rnd(d - 1); return { n, d }; };
  const [order, setOrder] = useState(newOrder);
  const [filled, setFilled] = useState<boolean[]>(() => Array(order.d).fill(false));
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [served, setServed] = useState(0);
  const count = filled.filter(Boolean).length;
  const won = served >= GOAL, lost = lives <= 0, over = won || lost;
  const toggle = (i: number) => { if (over) return; setFilled((f) => f.map((v, j) => j === i ? !v : v)); sfx("pop"); };
  const serve = () => {
    if (over) return;
    if (count === order.n) { setCoins((c) => c + 10); setServed((s) => s + 1); sfx("good"); }
    else { setLives((l) => l - 1); sfx("bad"); }
    const o = newOrder(); setOrder(o); setFilled(Array(o.d).fill(false));
  };
  const restart = () => { const o = newOrder(); setOrder(o); setFilled(Array(o.d).fill(false)); setCoins(0); setLives(3); setServed(0); };
  const R = 90, cx = 100, cy = 100;
  return (
    <GameFrame instruction={<>Order: top <b>{order.n}/{order.d}</b> of the pizza 🍕</>} onRestart={restart} over={over} overWin={won} overText={won ? "Pizzeria star! 🌟" : "Kitchen closed — try again!"}
      stats={<><Score value={coins} icon={<Coins className="h-4 w-4 text-accent-400" />} /><Lives n={lives} /></>}>
      <div className="flex flex-col items-center gap-3 p-5">
        <svg viewBox="0 0 200 200" className="h-52 w-52">
          <circle cx={cx} cy={cy} r={R + 4} fill="#f8d99a" />
          {Array.from({ length: order.d }).map((_, i) => {
            const a0 = (i / order.d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / order.d) * 2 * Math.PI - Math.PI / 2;
            const p = (a: number) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
            const [x0, y0] = p(a0), [x1, y1] = p(a1); const large = a1 - a0 > Math.PI ? 1 : 0;
            return <path key={i} onClick={() => toggle(i)} className="cursor-pointer" d={`M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`} fill={filled[i] ? "#e8b04b" : "#ffe9c2"} stroke="#c98a2e" strokeWidth={2} />;
          })}
          {filled.map((f, i) => f ? Array.from({ length: 3 }).map((_, j) => { const a = ((i + 0.5) / order.d) * 2 * Math.PI - Math.PI / 2; const rr = 30 + j * 20; return <circle key={`${i}-${j}`} cx={cx + rr * Math.cos(a)} cy={cy + rr * Math.sin(a)} r={6} fill="#c0392b" pointerEvents="none" />; }) : null)}
        </svg>
        <p className="font-display text-lg font-bold text-navy-900">Topped {count}/{order.d} — need {order.n}/{order.d}</p>
        <Button variant="secondary" onClick={serve}>🍽️ Serve</Button>
      </div>
    </GameFrame>
  );
}

// ================= 10. COIN SHOP (money) =================
const COINS = [1, 2, 5, 10, 20, 50];
function CoinGame({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const GOAL = 6;
  const maxPrice = g <= 2 ? 20 : g <= 4 ? 50 : 99;
  const newPrice = () => 3 + rnd(maxPrice - 2);
  const [price, setPrice] = useState(newPrice);
  const [paid, setPaid] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [served, setServed] = useState(0);
  const won = served >= GOAL, lost = lives <= 0, over = won || lost;
  const fmt = (p: number) => `${p}p`;
  const add = (c: number) => { if (over) return; setPaid((x) => x + c); sfx("tick"); };
  const sell = () => {
    if (over) return;
    if (paid === price) { setCoins((c) => c + 5); setServed((s) => s + 1); setPrice(newPrice()); setPaid(0); sfx("good"); }
    else { setLives((l) => l - 1); sfx("bad"); }
  };
  const restart = () => { setPrice(newPrice()); setPaid(0); setCoins(0); setLives(3); setServed(0); };
  return (
    <GameFrame instruction={<>Customer must pay exactly <b>{fmt(price)}</b> 🛒</>} onRestart={restart} over={over} overWin={won} overText={won ? "Best shopkeeper! 🏆" : "Shop closed — try again!"}
      stats={<><Score value={coins} icon={<Coins className="h-4 w-4 text-accent-400" />} /><Lives n={lives} /></>}>
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="rounded-2xl bg-white px-8 py-4 text-center shadow-card ring-2 ring-navy-100">
          <p className="text-xs text-navy-400">Price</p><p className="font-display text-3xl font-bold text-navy-900">{fmt(price)}</p>
        </div>
        <p className={cn("font-display text-2xl font-bold", paid > price ? "text-red-500" : paid === price ? "text-emerald-600" : "text-navy-700")}>Paid: {fmt(paid)}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {COINS.map((c) => <button key={c} onClick={() => add(c)} className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 font-bold text-navy-900 shadow ring-2 ring-accent-600 transition-transform hover:scale-110 active:scale-95">{fmt(c)}</button>)}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPaid(0)}>Clear</Button>
          <Button variant="secondary" onClick={sell}>💰 Sell</Button>
        </div>
      </div>
    </GameFrame>
  );
}

// ================= 11. DATA SORT (data handling) =================
const SORT_ITEMS = [{ e: "🍎", k: "apple" }, { e: "🍌", k: "banana" }, { e: "🍇", k: "grape" }];
function DataSortGame({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const qlen = g <= 2 ? 6 : g <= 4 ? 9 : 12;
  const build = () => shuffle(Array.from({ length: qlen }, () => SORT_ITEMS[rnd(SORT_ITEMS.length)]));
  const [queue, setQueue] = useState(build);
  const [bins, setBins] = useState<Record<string, number>>({ apple: 0, banana: 0, grape: 0 });
  const [lives, setLives] = useState(3);
  const current = queue[0];
  const done = !current;
  const restart = () => { setQueue(build()); setBins({ apple: 0, banana: 0, grape: 0 }); setLives(3); };
  const sortTo = (k: string) => {
    if (done) return;
    if (k === current.k) { setBins((b) => ({ ...b, [k]: b[k] + 1 })); setQueue((q) => q.slice(1)); sfx("pop"); }
    else { setLives((l) => l - 1); sfx("bad"); }
  };
  const lost = lives <= 0;
  const most = (Object.entries(bins).sort((a, b) => b[1] - a[1])[0] || ["", 0]);
  return (
    <GameFrame instruction={done ? "All sorted — read your graph!" : "Drop the fruit in the matching column 🍓"} onRestart={restart} over={done || lost} overWin={done && !lost}
      overText={lost ? "Try again!" : `${SORT_ITEMS.find((s) => s.k === most[0])?.e ?? ""} has the most (${most[1]})!`}
      stats={<><span className="text-xs text-white/70">{queue.length} left</span><Lives n={lives} /></>}>
      <div className="flex flex-col items-center gap-4 p-5">
        <div className="flex h-16 items-center justify-center">{current ? <span className="animate-fade-in text-5xl">{current.e}</span> : <span className="text-sm text-navy-400">conveyor empty</span>}</div>
        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          {SORT_ITEMS.map((s) => (
            <button key={s.k} onClick={() => sortTo(s.k)} className="flex flex-col items-center rounded-2xl border-2 border-navy-100 bg-white p-2 transition-colors hover:border-teal-400">
              <div className="flex h-32 w-full flex-col-reverse items-center gap-0.5 rounded-lg bg-surface-soft p-1">
                {Array.from({ length: bins[s.k] }).map((_, i) => <span key={i} className="text-lg leading-none">{s.e}</span>)}
              </div>
              <span className="mt-1 text-2xl">{s.e}</span>
            </button>
          ))}
        </div>
      </div>
    </GameFrame>
  );
}

// ================= 12. MAZE QUEST (problem solving / position) =================
const MAZES = [
  ["#######", "#S..#.E", "#.#.#.#", "#.#...#", "#.###.#", "#.....#", "#######"],
  ["#######", "#S#...E", "#.#.#.#", "#...#.#", "###.#.#", "#...#.#", "#######"],
];
function MazeGame({ resource }: { resource: Resource }) {
  const g = useDiffGrade(resource);
  const { sfx } = useGame();
  const layout = MAZES[Math.min(g % MAZES.length, MAZES.length - 1)];
  const grid = layout.map((r) => r.split(""));
  const rows = grid.length, cols = grid[0].length;
  const findStart = () => { for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (grid[y][x] === "S") return { x, y }; return { x: 1, y: 1 }; };
  const exit = (() => { for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (grid[y][x] === "E") return { x, y }; return { x: cols - 1, y: 1 }; })();
  // coins on some path cells, numbered 1..3 (collect in order)
  const coinCells = (() => { const cells: { x: number; y: number }[] = []; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (grid[y][x] === ".") cells.push({ x, y }); return shuffle(cells).slice(0, 3).map((c, i) => ({ ...c, n: i + 1 })); })();
  const [pos, setPos] = useState(findStart);
  const [next, setNext] = useState(1);
  const [moves, setMoves] = useState(0);
  const won = pos.x === exit.x && pos.y === exit.y && next > 3;
  const move = (dx: number, dy: number) => {
    if (won) return;
    const nx = pos.x + dx, ny = pos.y + dy;
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || grid[ny][nx] === "#") return;
    setPos({ x: nx, y: ny }); setMoves((m) => m + 1);
    const coin = coinCells.find((c) => c.x === nx && c.y === ny && c.n === next);
    if (coin) { setNext((n) => n + 1); sfx("good"); } else sfx("tick");
  };
  useKeys((k) => { if (k === "ArrowUp") move(0, -1); if (k === "ArrowDown") move(0, 1); if (k === "ArrowLeft") move(-1, 0); if (k === "ArrowRight") move(1, 0); });
  const restart = () => { setPos(findStart()); setNext(1); setMoves(0); };
  return (
    <GameFrame instruction={<>Collect coins <b>1 → 2 → 3</b> then reach 🏁</>} onRestart={restart} over={won} overWin overText={`Solved in ${moves} moves! 🎉`}
      stats={<><span className="text-xs text-white/70">Next: coin {Math.min(next, 3)}</span></>}>
      <div className="flex flex-col items-center gap-4 p-5">
        <div className="grid gap-0.5 rounded-xl bg-navy-800 p-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {grid.flatMap((row, y) => row.map((cell, x) => {
            const isPlayer = pos.x === x && pos.y === y;
            const coin = coinCells.find((c) => c.x === x && c.y === y && c.n >= next);
            const isExit = exit.x === x && exit.y === y;
            return <div key={`${x}-${y}`} className={cn("flex h-9 w-9 items-center justify-center rounded text-lg", cell === "#" ? "bg-navy-600" : "bg-sky-50")}>
              {isPlayer ? "🧑‍🚀" : coin ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-400 text-[10px] font-bold text-navy-900">{coin.n}</span> : isExit ? "🏁" : ""}
            </div>;
          }))}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <span /><Button size="sm" variant="outline" onClick={() => move(0, -1)}>▲</Button><span />
          <Button size="sm" variant="outline" onClick={() => move(-1, 0)}>◀</Button>
          <Button size="sm" variant="outline" onClick={() => move(0, 1)}>▼</Button>
          <Button size="sm" variant="outline" onClick={() => move(1, 0)}>▶</Button>
        </div>
      </div>
    </GameFrame>
  );
}
