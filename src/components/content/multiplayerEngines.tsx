"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Users, Play, RotateCcw, Trophy, Crown, Droplet, Ruler, Dices, BarChart3, Volume2, VolumeX } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn, clamp } from "@/lib/utils";
import { sfx } from "@/lib/sound";
import { useSound } from "@/stores/sound";

// ==========================================================
// MathQuest Multiplayer — local split-screen games for 2–4
// players on one shared screen (desktop / tablet / projector).
// The math action IS the gameplay: filling to a capacity,
// stopping at a length, predicting probability, sorting data.
// Each player gets a coloured zone, big touch button + a key.
// ==========================================================

export const MULTIPLAYER_IDS = ["res-mp-fill-it-up", "res-mp-stop-length", "res-mp-probability-arena", "res-mp-data-duel"];

export function MultiplayerGame({ resource }: { resource: Resource }) {
  switch (resource.id) {
    case "res-mp-fill-it-up": return <FillItUp />;
    case "res-mp-stop-length": return <StopLength />;
    case "res-mp-probability-arena": return <ProbabilityArena />;
    case "res-mp-data-duel": return <DataDuel />;
    default: return <FillItUp />;
  }
}

// ---------------- shared player config ----------------
const PC = [
  { name: "Teal", hex: "#14b8a6", soft: "#ccfbf1", key: "Q" },
  { name: "Rose", hex: "#f43f5e", soft: "#ffe4e6", key: "P" },
  { name: "Amber", hex: "#f59e0b", soft: "#fef3c7", key: "V" },
  { name: "Indigo", hex: "#6366f1", soft: "#e0e7ff", key: "M" },
];
const ROUNDS = 3;

function useTicker(active: boolean, ms: number, cb: () => void) {
  const ref = useRef(cb); ref.current = cb;
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => ref.current(), ms);
    return () => window.clearInterval(id);
  }, [active, ms]);
}
function usePlayerKeys(active: boolean, np: number, onKey: (p: number) => void) {
  const ref = useRef(onKey); ref.current = onKey;
  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      const p = PC.findIndex((c, i) => i < np && c.key === k);
      if (p >= 0) { e.preventDefault(); ref.current(p); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [active, np, onKey]);
}

// ---------------- shared UI atoms ----------------
function Shell({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-navy-100 bg-white shadow-card">
      <div className="flex items-center justify-between bg-navy-900 px-4 py-2.5 text-white">
        <p className="flex items-center gap-2 text-sm font-bold sm:text-base">{icon}{title}</p>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold"><Users className="h-3.5 w-3.5" /> 2–4 players</span>
          <MuteBtn />
        </div>
      </div>
      {children}
    </div>
  );
}

function Setup({ objective, howto, np, setNp, onStart }: { objective: string; howto: string; np: number; setNp: (n: number) => void; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 p-6 text-center">
      <p className="max-w-md text-sm text-navy-500"><span className="font-semibold text-teal-600">Cambridge focus:</span> {objective}</p>
      <div>
        <p className="mb-2 text-sm font-bold text-navy-700">How many players?</p>
        <div className="flex justify-center gap-2">
          {[2, 3, 4].map((n) => (
            <button key={n} onClick={() => setNp(n)} className={cn("h-14 w-14 rounded-2xl border-2 font-display text-2xl font-extrabold transition-all", np === n ? "border-navy-900 bg-navy-900 text-white scale-105" : "border-navy-200 text-navy-700 hover:border-teal-400")}>{n}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {PC.slice(0, np).map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: c.hex }}>Player {i + 1} <kbd className="rounded bg-white/25 px-1.5 text-xs">{c.key}</kbd></span>
        ))}
      </div>
      <p className="max-w-md rounded-xl bg-surface-soft px-4 py-2 text-sm text-navy-600">{howto}</p>
      <Button variant="accent" onClick={onStart}><Play className="h-4 w-4" /> Start game</Button>
    </div>
  );
}

function MuteBtn() {
  const muted = useSound((s) => s.muted);
  const setMuted = useSound((s) => s.setMuted);
  return (
    <button onClick={() => { const next = !muted; setMuted(next); if (!next) sfx("pop"); }} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted}
      className="rounded-lg bg-white/15 p-1.5 hover:bg-white/25">
      {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}

function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n < 0) { onDone(); return; }
    sfx(n > 0 ? "tick" : "good");
    const t = window.setTimeout(() => setN((v) => v - 1), 650);
    return () => window.clearTimeout(t);
  }, [n, onDone]);
  return (
    <div className="flex h-[360px] items-center justify-center" role="status" aria-live="assertive" aria-label={n > 0 ? `Starting in ${n}` : "Go!"}>
      <span key={n} className="animate-[pop_.5s] font-display text-8xl font-extrabold text-navy-900">{n > 0 ? n : "GO!"}</span>
      <style>{`@keyframes pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

function Scoreboard({ np, wins, round, banner }: { np: number; wins: number[]; round: number; banner?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 bg-surface-soft px-4 py-2">
      <span className="text-xs font-bold text-navy-500">Round {Math.min(round + 1, ROUNDS)} / {ROUNDS}</span>
      {banner && <span className="text-sm font-extrabold text-teal-600" role="status" aria-live="polite">{banner}</span>}
      <div className="flex gap-2">
        {PC.slice(0, np).map((c, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: c.hex }}>
            P{i + 1}: {wins[i]}★
          </span>
        ))}
      </div>
    </div>
  );
}

function Winner({ np, wins, onRestart }: { np: number; wins: number[]; onRestart: () => void }) {
  useEffect(() => { sfx("win"); }, []);
  const best = Math.max(...wins.slice(0, np));
  const champs = PC.slice(0, np).map((c, i) => ({ c, i, w: wins[i] })).filter((x) => x.w === best);
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center" role="status" aria-live="assertive">
      <div className="animate-bounce"><Trophy className="h-16 w-16 text-accent-400" /></div>
      <h3 className="font-display text-2xl font-extrabold text-navy-900">{champs.length > 1 ? "It's a tie! 🎉" : `Player ${champs[0].i + 1} wins! 🎉`}</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {PC.slice(0, np).map((c, i) => (
          <span key={i} className="flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold text-white" style={{ background: c.hex }}>
            {wins[i] === best && <Crown className="h-4 w-4" />} P{i + 1}: {wins[i]}★
          </span>
        ))}
      </div>
      <Button variant="accent" onClick={onRestart}><RotateCcw className="h-4 w-4" /> Play again</Button>
    </div>
  );
}

function ZoneGrid({ np, children }: { np: number; children: React.ReactNode[] }) {
  const cls = np === 2 ? "grid-cols-1 grid-rows-2" : np === 3 ? "grid-cols-3 grid-rows-1" : "grid-cols-2 grid-rows-2";
  return <div className={cn("grid gap-1.5 bg-navy-100 p-1.5", cls)}>{children}</div>;
}
function Zone({ p, children, className }: { p: number; children: React.ReactNode; className?: string }) {
  const c = PC[p];
  return (
    <div className={cn("relative flex flex-col rounded-xl border-2 bg-white p-2.5", className)} style={{ borderColor: c.hex, minHeight: 150 }}>
      <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold text-white" style={{ background: c.hex }}>P{p + 1} <kbd className="rounded bg-white/25 px-1 text-[10px]">{c.key}</kbd></span>
      {children}
    </div>
  );
}
function ActBtn({ p, label, onClick, disabled }: { p: number; label: string; onClick: () => void; disabled?: boolean }) {
  const c = PC[p];
  return <button onClick={onClick} disabled={disabled} className="mt-auto w-full rounded-xl py-2.5 font-display text-base font-extrabold text-white shadow transition-transform active:scale-95 disabled:opacity-40" style={{ background: c.hex }}>{label}</button>;
}

// ================= GAME 1 — FILL IT UP (capacity) =================
function FillItUp() {
  const [phase, setPhase] = useState<"setup" | "count" | "play" | "over">("setup");
  const [np, setNp] = useState(2);
  const [wins, setWins] = useState<number[]>([0, 0, 0, 0]);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(300);
  const [fill, setFill] = useState<number[]>([0, 0, 0, 0]);
  const [done, setDone] = useState<boolean[]>([false, false, false, false]);
  const [banner, setBanner] = useState("");
  const MAX = 500, POUR = 25;

  const startRound = useCallback(() => {
    setTarget([200, 250, 300, 350, 400][Math.floor(Math.random() * 5)]);
    setFill([0, 0, 0, 0]); setDone([false, false, false, false]); setBanner("");
  }, []);
  const begin = () => { setWins([0, 0, 0, 0]); setRound(0); setPhase("count"); };
  const pour = (p: number) => { if (done[p] || phase !== "play") return; setFill((f) => f.map((v, i) => i === p ? Math.min(MAX, v + POUR) : v)); sfx("pop"); };
  const stop = (p: number) => setDone((d) => d.map((v, i) => i === p ? true : v));
  usePlayerKeys(phase === "play", np, pour);

  useEffect(() => {
    if (phase !== "play") return;
    if (done.slice(0, np).every(Boolean)) {
      // closest without going over MAX-tolerance; overflow busts
      let best = -1, bestDiff = 1e9;
      for (let i = 0; i < np; i++) { const over = fill[i] > MAX; const diff = Math.abs(fill[i] - target); if (!over && diff < bestDiff) { bestDiff = diff; best = i; } }
      if (best >= 0) { setWins((w) => w.map((v, i) => i === best ? v + 1 : v)); setBanner(`Player ${best + 1} poured closest to ${target} mL!`); sfx("good"); }
      else setBanner("Everyone overflowed! No point this round.");
      const t = window.setTimeout(() => {
        if (round + 1 >= ROUNDS) setPhase("over");
        else { setRound((r) => r + 1); startRound(); }
      }, 1900);
      return () => window.clearTimeout(t);
    }
  }, [done, np, phase, fill, target, round, startRound]);

  if (phase === "setup") return <Shell title="Fill It Up — Capacity Challenge" icon={<Droplet className="h-4 w-4" />}><Setup np={np} setNp={setNp} onStart={begin} objective="Read a capacity scale and estimate millilitres (Measure)." howto="Tap your button to pour 25 mL. Stop as close to the target line as you can — without overflowing! Closest wins the round." /></Shell>;
  if (phase === "count") return <Shell title="Fill It Up" icon={<Droplet className="h-4 w-4" />}><Countdown onDone={() => { startRound(); setPhase("play"); }} /></Shell>;
  if (phase === "over") return <Shell title="Fill It Up" icon={<Droplet className="h-4 w-4" />}><Winner np={np} wins={wins} onRestart={() => setPhase("setup")} /></Shell>;

  return (
    <Shell title="Fill It Up" icon={<Droplet className="h-4 w-4" />}>
      <Scoreboard np={np} wins={wins} round={round} banner={banner || `Fill to ${target} mL`} />
      <ZoneGrid np={np}>
        {PC.slice(0, np).map((c, p) => {
          const pct = (fill[p] / MAX) * 100, tpct = (target / MAX) * 100, over = fill[p] > MAX;
          return <Zone key={p} p={p}>
            <div className="flex flex-1 items-center gap-3">
              <div className="relative h-28 w-16 overflow-hidden rounded-b-xl rounded-t-md border-2 border-navy-200 bg-sky-50">
                <div className="absolute inset-x-0 bottom-0 transition-all duration-150" style={{ height: `${clamp(pct, 0, 100)}%`, background: over ? "#ef4444" : c.hex, opacity: 0.85 }} />
                <div className="absolute inset-x-0 border-t-2 border-dashed border-navy-800" style={{ bottom: `${tpct}%` }}><span className="absolute -right-0.5 -top-4 text-[10px] font-bold text-navy-700">{target}</span></div>
                {[100, 200, 300, 400].map((mk) => <div key={mk} className="absolute left-0 w-2 border-t border-navy-300" style={{ bottom: `${(mk / MAX) * 100}%` }} />)}
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-extrabold" style={{ color: over ? "#ef4444" : "#1b2540" }}>{fill[p]}<span className="text-sm"> mL</span></p>
                {done[p] && !over && <p className="text-xs font-bold text-emerald-600">Stopped ✓</p>}
                {over && <p className="text-xs font-bold text-red-500">Overflow! 💦</p>}
              </div>
            </div>
            <div className="mt-1 flex gap-1.5">
              <ActBtn p={p} label="Pour +25" onClick={() => pour(p)} disabled={done[p]} />
              <button onClick={() => stop(p)} disabled={done[p]} className="mt-auto rounded-xl border-2 px-3 py-2.5 text-sm font-extrabold disabled:opacity-40" style={{ borderColor: c.hex, color: c.hex }}>Stop</button>
            </div>
          </Zone>;
        })}
      </ZoneGrid>
    </Shell>
  );
}

// ================= GAME 2 — STOP THE LENGTH (length) =================
function StopLength() {
  const [phase, setPhase] = useState<"setup" | "count" | "play" | "over">("setup");
  const [np, setNp] = useState(2);
  const [wins, setWins] = useState<number[]>([0, 0, 0, 0]);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(14);
  const [len, setLen] = useState<number[]>([0, 0, 0, 0]);
  const [done, setDone] = useState<boolean[]>([false, false, false, false]);
  const [banner, setBanner] = useState("");
  const MAXCM = 20;

  const startRound = useCallback(() => {
    setTarget(6 + Math.floor(Math.random() * 12)); setLen([0, 0, 0, 0]); setDone([false, false, false, false]); setBanner("");
  }, []);
  const begin = () => { setWins([0, 0, 0, 0]); setRound(0); setPhase("count"); };
  const stopBar = (p: number) => { if (phase !== "play") return; setDone((d) => d.map((v, i) => i === p ? true : v)); sfx("pop"); };
  usePlayerKeys(phase === "play", np, stopBar);

  // bars grow while not stopped
  useTicker(phase === "play", 45, () => {
    setLen((l) => l.map((v, i) => (i < np && !done[i] && v < MAXCM) ? Math.min(MAXCM, v + 0.28) : v));
  });
  // auto-stop a bar that reaches the end
  useEffect(() => { if (phase === "play") setDone((d) => d.map((v, i) => v || (i < np && len[i] >= MAXCM))); }, [len, np, phase]);

  useEffect(() => {
    if (phase !== "play") return;
    if (done.slice(0, np).every(Boolean)) {
      let best = -1, bestDiff = 1e9;
      for (let i = 0; i < np; i++) { const diff = Math.abs(len[i] - target); if (diff < bestDiff) { bestDiff = diff; best = i; } }
      setWins((w) => w.map((v, i) => i === best ? v + 1 : v));
      setBanner(`Player ${best + 1} stopped closest to ${target} cm!`); sfx("good");
      const t = window.setTimeout(() => { if (round + 1 >= ROUNDS) setPhase("over"); else { setRound((r) => r + 1); startRound(); } }, 1900);
      return () => window.clearTimeout(t);
    }
  }, [done, np, phase, len, target, round, startRound]);

  if (phase === "setup") return <Shell title="Stop the Length — Ruler Race" icon={<Ruler className="h-4 w-4" />}><Setup np={np} setNp={setNp} onStart={begin} objective="Estimate and read length in centimetres on a ruler (Measure)." howto="Your bar grows along the ruler. Tap your button to STOP it as close to the target centimetre line as you can. Closest wins!" /></Shell>;
  if (phase === "count") return <Shell title="Stop the Length" icon={<Ruler className="h-4 w-4" />}><Countdown onDone={() => { startRound(); setPhase("play"); }} /></Shell>;
  if (phase === "over") return <Shell title="Stop the Length" icon={<Ruler className="h-4 w-4" />}><Winner np={np} wins={wins} onRestart={() => setPhase("setup")} /></Shell>;

  return (
    <Shell title="Stop the Length" icon={<Ruler className="h-4 w-4" />}>
      <Scoreboard np={np} wins={wins} round={round} banner={banner || `Stop at ${target} cm`} />
      <ZoneGrid np={np}>
        {PC.slice(0, np).map((c, p) => {
          const tpct = (target / MAXCM) * 100, lpct = (len[p] / MAXCM) * 100;
          return <Zone key={p} p={p}>
            <div className="flex-1">
              <div className="relative mt-2 h-9 w-full rounded bg-amber-50 ring-1 ring-amber-200">
                {Array.from({ length: MAXCM + 1 }).map((_, i) => <div key={i} className="absolute top-0 h-2 w-px bg-navy-300" style={{ left: `${(i / MAXCM) * 100}%` }} />)}
                {[5, 10, 15, 20].map((mk) => <span key={mk} className="absolute top-2.5 -translate-x-1/2 text-[9px] font-bold text-navy-400" style={{ left: `${(mk / MAXCM) * 100}%` }}>{mk}</span>)}
                <div className="absolute bottom-0 h-4 rounded transition-none" style={{ width: `${lpct}%`, background: c.hex }} />
                <div className="absolute inset-y-0 w-0.5 bg-navy-900" style={{ left: `${tpct}%` }}><span className="absolute -top-4 -translate-x-1/2 text-[10px] font-extrabold text-navy-900">{target}</span></div>
              </div>
              <p className="mt-2 text-center font-display text-xl font-extrabold" style={{ color: c.hex }}>{len[p].toFixed(1)} cm {done[p] && <span className="text-xs text-emerald-600">✓</span>}</p>
            </div>
            <ActBtn p={p} label={done[p] ? "Stopped" : "STOP!"} onClick={() => stopBar(p)} disabled={done[p]} />
          </Zone>;
        })}
      </ZoneGrid>
    </Shell>
  );
}

// ================= GAME 3 — PROBABILITY ARENA (probability) =================
const SPIN = [{ c: "#14b8a6", n: "Teal", w: 4 }, { c: "#f59e0b", n: "Amber", w: 3 }, { c: "#f43f5e", n: "Rose", w: 2 }, { c: "#6366f1", n: "Indigo", w: 1 }];
function ProbabilityArena() {
  const [phase, setPhase] = useState<"setup" | "bet" | "spin" | "over">("setup");
  const [np, setNp] = useState(2);
  const [wins, setWins] = useState<number[]>([0, 0, 0, 0]);
  const [round, setRound] = useState(0);
  const [bet, setBet] = useState<number[]>([-1, -1, -1, -1]);
  const [tally, setTally] = useState<number[]>([0, 0, 0, 0]);
  const [trial, setTrial] = useState(0);
  const [angle, setAngle] = useState(0);
  const [banner, setBanner] = useState("");
  const TRIALS = 12;
  const total = SPIN.reduce((s, x) => s + x.w, 0);
  const segAngles = (() => { let a = 0; return SPIN.map((s) => { const start = a; a += (s.w / total) * 360; return { start, end: a }; }); })();

  const begin = () => { setWins([0, 0, 0, 0]); setRound(0); newBet(); };
  const newBet = () => { setBet([-1, -1, -1, -1]); setTally([0, 0, 0, 0]); setTrial(0); setBanner(""); setPhase("bet"); };
  const choose = (p: number, seg: number) => { if (phase !== "bet") return; setBet((b) => b.map((v, i) => i === p ? seg : v)); sfx("tick"); };
  const allBet = bet.slice(0, np).every((v) => v >= 0);

  // run trials
  useTicker(phase === "spin", 380, () => {
    setTrial((t) => {
      if (t >= TRIALS) return t;
      const r = Math.random() * total; let acc = 0, seg = 0;
      for (let i = 0; i < SPIN.length; i++) { acc += SPIN[i].w; if (r < acc) { seg = i; break; } }
      const mid = (segAngles[seg].start + segAngles[seg].end) / 2;
      setAngle(360 * 3 + (360 - mid));
      setTally((tl) => tl.map((v, i) => i === seg ? v + 1 : v));
      return t + 1;
    });
  });
  useEffect(() => {
    if (phase === "spin" && trial >= TRIALS) {
      const most = tally.indexOf(Math.max(...tally));
      let awarded = -1;
      setWins((w) => w.map((v, i) => { if (i < np && bet[i] === most) { awarded = i; return v + 1; } return v; }));
      setBanner(`${SPIN[most].n} came up most! ${bet.slice(0, np).some((b) => b === most) ? "Correct predictors score ★" : "No one predicted it."}`);
      void awarded;
      const t = window.setTimeout(() => { if (round + 1 >= ROUNDS) setPhase("over"); else { setRound((r) => r + 1); newBet(); } }, 2400);
      return () => window.clearTimeout(t);
    }
  }, [trial, phase, tally, bet, np, round]);

  const Wheel = ({ size = 150 }: { size?: number }) => (
    <svg viewBox="-60 -60 120 120" width={size} height={size}>
      <g style={{ transform: `rotate(${angle}deg)`, transition: "transform .34s ease-out", transformOrigin: "center" }}>
        {SPIN.map((s, i) => { const a0 = (segAngles[i].start - 90) * Math.PI / 180, a1 = (segAngles[i].end - 90) * Math.PI / 180, r = 52; const large = segAngles[i].end - segAngles[i].start > 180 ? 1 : 0; return <path key={i} d={`M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 ${large} 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={s.c} stroke="#fff" strokeWidth={2} />; })}
      </g>
      <path d="M0 -58 l-7 -12 h14 Z" fill="#1b2540" />
      <circle r={6} fill="#1b2540" />
    </svg>
  );

  if (phase === "setup") return <Shell title="Probability Arena — Predict & Spin" icon={<Dices className="h-4 w-4" />}><Setup np={np} setNp={setNp} onStart={begin} objective="Describe and compare likelihood; run chance experiments (Probability)." howto="The wheel has bigger and smaller colours. Each player predicts which colour will come up MOST. We spin 12 times and track the results — correct predictions score a star!" /></Shell>;
  if (phase === "over") return <Shell title="Probability Arena" icon={<Dices className="h-4 w-4" />}><Winner np={np} wins={wins} onRestart={() => setPhase("setup")} /></Shell>;

  return (
    <Shell title="Probability Arena" icon={<Dices className="h-4 w-4" />}>
      <Scoreboard np={np} wins={wins} round={round} banner={banner || (phase === "bet" ? "Predict the most likely colour" : `Spin ${trial}/${TRIALS}`)} />
      <div className="flex flex-col items-center gap-2 border-b border-navy-100 bg-gradient-to-b from-sky-50 to-white py-3">
        <Wheel />
        <div className="flex gap-3">
          {SPIN.map((s, i) => <div key={i} className="flex flex-col items-center"><span className="h-3 w-6 rounded" style={{ background: s.c }} /><span className="text-sm font-extrabold text-navy-800">{tally[i]}</span></div>)}
        </div>
        {phase === "bet" && allBet && <Button variant="accent" size="sm" onClick={() => setPhase("spin")}><Play className="h-4 w-4" /> Spin the wheel!</Button>}
      </div>
      <ZoneGrid np={np}>
        {PC.slice(0, np).map((c, p) => (
          <Zone key={p} p={p}>
            <p className="mb-1.5 text-xs font-semibold text-navy-500">{phase === "bet" ? "Pick the colour you think wins:" : bet[p] >= 0 ? "Your pick:" : "No pick"}</p>
            <div className="flex flex-1 flex-wrap content-start gap-1.5">
              {SPIN.map((s, si) => (
                <button key={si} onClick={() => choose(p, si)} disabled={phase !== "bet"}
                  className={cn("h-9 w-9 rounded-lg border-2 transition-all", bet[p] === si ? "scale-110 border-navy-900 ring-2 ring-navy-300" : "border-white")} style={{ background: s.c }} aria-label={s.n} />
              ))}
            </div>
            {bet[p] >= 0 && <p className="mt-1 text-xs font-bold" style={{ color: SPIN[bet[p]].c }}>Betting on {SPIN[bet[p]].n}</p>}
          </Zone>
        ))}
      </ZoneGrid>
    </Shell>
  );
}

// ================= GAME 4 — DATA DUEL (statistics / sorting) =================
const FRUIT = [{ e: "🍎", k: 0 }, { e: "🍌", k: 1 }, { e: "🍇", k: 2 }];
const BINLBL = ["🍎", "🍌", "🍇"];
function DataDuel() {
  const [phase, setPhase] = useState<"setup" | "count" | "play" | "over">("setup");
  const [np, setNp] = useState(2);
  const [cur, setCur] = useState<number[]>([0, 0, 0, 0]);
  const [bins, setBins] = useState<number[][]>([[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [correct, setCorrect] = useState<number[]>([0, 0, 0, 0]);
  const [time, setTime] = useState(30);
  const [wins] = useState<number[]>([0, 0, 0, 0]);

  const rnd = () => Math.floor(Math.random() * FRUIT.length);
  const begin = () => { setBins([[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]); setCorrect([0, 0, 0, 0]); setCur([rnd(), rnd(), rnd(), rnd()]); setTime(30); setPhase("count"); };
  useTicker(phase === "play", 1000, () => setTime((t) => Math.max(0, t - 1)));
  useEffect(() => { if (phase === "play" && time === 0) setPhase("over"); }, [time, phase]);

  const sort = (p: number, bin: number) => {
    if (phase !== "play") return;
    const item = FRUIT[cur[p]];
    if (item.k === bin) { setBins((b) => b.map((row, i) => i === p ? row.map((v, j) => j === bin ? v + 1 : v) : row)); setCorrect((c) => c.map((v, i) => i === p ? v + 1 : v)); sfx("pop"); }
    setCur((cc) => cc.map((v, i) => i === p ? rnd() : v));
  };

  if (phase === "setup") return <Shell title="Data Duel — Sorting Factory" icon={<BarChart3 className="h-4 w-4" />}><Setup np={np} setNp={setNp} onStart={begin} objective="Sort and categorise data; build & read a bar chart (Statistics)." howto="Fruit drops into your zone. Tap the matching basket to sort it — each correct sort grows your bar chart. Sort the most in 30 seconds to win!" /></Shell>;
  if (phase === "count") return <Shell title="Data Duel" icon={<BarChart3 className="h-4 w-4" />}><Countdown onDone={() => setPhase("play")} /></Shell>;
  if (phase === "over") {
    const best = Math.max(...correct.slice(0, np));
    const w = correct.map((v) => v === best ? 1 : 0);
    return <Shell title="Data Duel" icon={<BarChart3 className="h-4 w-4" />}><Winner np={np} wins={w} onRestart={() => setPhase("setup")} /></Shell>;
  }

  return (
    <Shell title="Data Duel" icon={<BarChart3 className="h-4 w-4" />}>
      <Scoreboard np={np} wins={wins} round={0} banner={`⏱ ${time}s left — sort the fruit!`} />
      <ZoneGrid np={np}>
        {PC.slice(0, np).map((c, p) => (
          <Zone key={p} p={p}>
            <div className="flex flex-1 items-center justify-between gap-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-navy-400">sort me</span>
                <span className="animate-[pop_.3s] text-4xl" key={cur[p]}>{FRUIT[cur[p]].e}</span>
                <span className="mt-1 text-xs font-bold text-navy-500">✓ {correct[p]}</span>
              </div>
              <div className="flex items-end gap-1.5">
                {BINLBL.map((e, bi) => (
                  <div key={bi} className="flex flex-col items-center">
                    <div className="flex w-7 flex-col-reverse items-center rounded bg-surface-soft" style={{ height: 56 }}>
                      {Array.from({ length: bins[p][bi] }).map((_, k) => <span key={k} className="h-2 w-5 rounded-sm" style={{ background: c.hex }} />)}
                    </div>
                    <span className="text-lg">{e}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {BINLBL.map((e, bi) => <button key={bi} onClick={() => sort(p, bi)} className="rounded-lg border-2 py-1.5 text-lg" style={{ borderColor: c.hex }}>{e}</button>)}
            </div>
          </Zone>
        ))}
      </ZoneGrid>
    </Shell>
  );
}
