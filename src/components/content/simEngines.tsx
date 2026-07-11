"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Lightbulb, Play, Check, X, Settings2, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToasts } from "@/stores/ui";
import { cn, clamp } from "@/lib/utils";
import { simPreset } from "@/config/simPresets";
import { craFor } from "@/lib/cra";

// Concrete "fruit" counter for Early Years / lower grades (CRA — concrete);
// higher grades use plain coloured discs (pictorial/abstract).
function Fruit({ tone = "teal", px = 26 }: { tone?: "teal" | "accent" | "red"; px?: number }) {
  const bg = tone === "accent" ? "#f59e0b" : tone === "red" ? "#ef4444" : "#14b8a6";
  return (
    <span className="relative inline-block" style={{ width: px, height: px }} aria-hidden>
      <span className="absolute inset-x-0 bottom-0 rounded-full ring-1 ring-white/80" style={{ height: px, background: bg }} />
      <span className="absolute rounded-full bg-emerald-600" style={{ width: px * 0.3, height: px * 0.3, top: -px * 0.05, left: px * 0.52 }} />
    </span>
  );
}

// ==========================================================
// Bespoke interactive engines. Each simulation drives its engine
// into a distinct mode/configuration via simPreset(id), so no two
// simulations behave the same. Every engine has an Options panel.
// ==========================================================

// Presentation stage — a full-screen "Present" mode for teaching, with zoom.
function SimStage({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [nativeFS, setNativeFS] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [zoom, setZoom] = useState(1.4);
  const presenting = nativeFS || overlay;

  useEffect(() => {
    const onChange = () => setNativeFS(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOverlay(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [overlay]);

  const present = async () => {
    const el = ref.current;
    if (el?.requestFullscreen) {
      try { await el.requestFullscreen(); return; } catch { /* fall back to overlay */ }
    }
    setOverlay(true);
  };
  const exit = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); setOverlay(false); };
  const bump = (d: number) => setZoom((z) => clamp(Number((z + d).toFixed(2)), 0.8, 3));

  return (
    <div ref={ref} className={cn(overlay ? "fixed inset-0 z-[80] flex flex-col bg-surface-soft" : nativeFS ? "flex h-full w-full flex-col bg-surface-soft" : "relative")}>
      {presenting && (
        <header className="flex items-center justify-between gap-3 border-b border-navy-100 bg-white px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Badge tone="teal">Presenting</Badge>
            <p className="truncate font-display font-semibold text-navy-900">{title}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => bump(-0.2)} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
            <span className="w-12 text-center text-sm font-semibold text-navy-600 tabular-nums">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => bump(0.2)} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
            <Button variant="primary" size="sm" onClick={exit}><Minimize2 className="h-4 w-4" /> Exit</Button>
          </div>
        </header>
      )}
      <div className={cn(presenting && "flex flex-1 justify-center overflow-auto p-6")}>
        <div style={presenting ? { transform: `scale(${zoom})`, transformOrigin: "top center", width: 620, maxWidth: "100%" } : undefined}>
          {children}
        </div>
      </div>
      {!presenting && (
        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={present}><Maximize2 className="h-4 w-4" /> Present full screen</Button>
        </div>
      )}
    </div>
  );
}

export function SimulationEngine({ resource }: { resource: Resource }) {
  return <SimStage title={resource.title}><SimEngineInner resource={resource} /></SimStage>;
}

function SimEngineInner({ resource }: { resource: Resource }) {
  const id = resource.id;
  const cover = resource.cover;

  if (id.includes("hundred-square")) return <HundredSquareEngine resource={resource} />;
  if (/angle/i.test(id)) return <AnglesEngine resource={resource} />;

  switch (cover) {
    case "tenframe": return <TenFrameEngine resource={resource} />;
    case "numberline": return <NumberLineEngine resource={resource} />;
    case "placevalue":
    case "blocks": return <PlaceValueEngine resource={resource} />;
    case "multiply": return <ArrayEngine resource={resource} />;
    case "fraction":
    case "fractionbar":
    case "equivalent": return <FractionEngine resource={resource} />;
    case "clock": return <ClockEngine resource={resource} />;
    case "coordinate": return <CoordinateEngine resource={resource} />;
    case "chartbuilder":
    case "graph": return <BarChartEngine resource={resource} />;
    case "spinner": return <SpinnerEngine resource={resource} />;
    case "shopping":
    case "money": return <MoneyEngine resource={resource} />;
    case "symmetry": return <SymmetryEngine resource={resource} />;
    case "compare": return resource.programme === "early-years" ? <CompareEngine resource={resource} /> : <RatioEngine resource={resource} />;
    case "addition": return <OrderOpsEngine resource={resource} />;
    case "shapes": return <ShapeSortEngine resource={resource} />;
    case "pattern":
    case "patternmachine": return <PatternEngine resource={resource} />;
    default: return <TenFrameEngine resource={resource} />;
  }
}

// ---------------- shared bits ----------------
function hintFor(r: Resource) {
  return r.discussionPrompts?.[0] ?? r.reasoningPrompt ?? r.thinkPrompt;
}
function Intro({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm text-navy-600">{children}</p>;
}
function EngineCard({ hint, onReset, settings, children }: {
  hint?: string; onReset?: () => void; settings?: React.ReactNode; children: React.ReactNode;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Badge tone="teal">Interactive simulation</Badge>
        <div className="flex gap-2">
          {settings && <Button variant="outline" size="sm" onClick={() => setShowSettings((v) => !v)} aria-expanded={showSettings}><Settings2 className="h-4 w-4" /> Options</Button>}
          {hint && <Button variant="outline" size="sm" onClick={() => setShowHint((v) => !v)}><Lightbulb className="h-4 w-4" /> Hint</Button>}
          {onReset && <Button variant="ghost" size="sm" onClick={onReset}><RotateCcw className="h-4 w-4" /> Reset</Button>}
        </div>
      </div>
      {showSettings && settings && (
        <div className="mb-4 space-y-2.5 rounded-xl border border-navy-100 bg-surface-soft p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Simulation options</p>
          {settings}
        </div>
      )}
      {children}
      {showHint && hint && <p className="mt-4 rounded-xl bg-accent-50 p-3 text-sm text-navy-700">💡 {hint}</p>}
    </div>
  );
}
function Stepper({ label, value, set, min, max, step = 1 }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 text-sm font-medium text-navy-600">{label}</span>
      <button onClick={() => set(clamp(value - step, min, max))} disabled={value <= min} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-lg font-bold text-navy-700 hover:bg-navy-50 disabled:opacity-40" aria-label={`Decrease ${label}`}>−</button>
      <span className="w-10 text-center font-display text-lg font-bold text-navy-900 tabular-nums">{value}</span>
      <button onClick={() => set(clamp(value + step, min, max))} disabled={value >= max} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-lg font-bold text-navy-700 hover:bg-navy-50 disabled:opacity-40" aria-label={`Increase ${label}`}>+</button>
    </div>
  );
}
function Segmented<T extends string | number>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex flex-wrap gap-0.5 rounded-lg bg-surface-muted p-0.5">
      {options.map((o) => (
        <button key={String(o.value)} onClick={() => onChange(o.value)} className={cn("rounded-md px-2.5 py-1 text-xs font-semibold transition-colors", o.value === value ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-800")}>{o.label}</button>
      ))}
    </div>
  );
}
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", checked ? "bg-teal-500" : "bg-navy-200")}>
      <span className={cn("absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform", checked && "translate-x-4")} />
    </button>
  );
}
function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-medium text-navy-600">{label}</span>{children}</div>;
}
// Stacked fraction: numerator over a bar over denominator (never "n/d").
function Frac({ n, d, className }: { n: React.ReactNode; d: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center justify-center align-middle leading-none", className)}>
      <span className="px-1 pb-px">{n}</span>
      <span className="h-px w-full self-stretch bg-current" />
      <span className="px-1 pt-px">{d}</span>
    </span>
  );
}

// ==================================================================
// 1. TEN FRAME — modes: count | bond | combine
// ==================================================================
function TenFrameEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  if (p.tfMode === "combine") return <CombineFrames resource={resource} />;
  return <TenFrameMain resource={resource} />;
}
function TenFrameMain({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const bondDefault = p.tfMode === "bond";
  const [frames, setFrames] = useState((p.tfTarget ?? 10) > 10 ? 2 : 1);
  const [showBond, setShowBond] = useState(bondDefault);
  const target = frames * (p.tfTarget && p.tfTarget < 10 ? p.tfTarget : 10) / (frames || 1);
  const total = p.tfTarget && p.tfTarget <= 10 ? p.tfTarget : frames * 10;
  const [count, setCount] = useState(bondDefault ? 6 : 3);
  useEffect(() => { setCount((c) => Math.min(c, total)); }, [total]);
  void target;
  const cols = 5;
  const cells = Array.from({ length: total }, (_, i) => i < count);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setCount(0)}
      settings={<>
        {(p.tfTarget ?? 10) >= 10 && <SettingRow label="Frame size"><Segmented value={frames} onChange={setFrames} options={[{ label: "Ten", value: 1 }, { label: "Twenty", value: 2 }]} /></SettingRow>}
        <SettingRow label="Show number bond"><Toggle checked={showBond} onChange={setShowBond} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? `Tap the frame to add or remove counters, up to ${total}.`}</Intro>
      <div className="mx-auto grid w-fit gap-2 rounded-2xl bg-surface-soft p-4" style={{ gridTemplateColumns: `repeat(${Math.min(cols, total)}, minmax(0,1fr))` }}>
        {cells.map((f, i) => (
          <button key={i} onClick={() => setCount(f ? i : i + 1)} className={cn("flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-colors", f ? "border-teal-500 bg-teal-500" : "border-navy-200 bg-white hover:bg-teal-50")} aria-label={`Counter ${i + 1}`}>
            {f && <span className="h-5 w-5 rounded-full bg-white/90" />}
          </button>
        ))}
      </div>
      {showBond ? (
        <div className="mt-5 flex items-center justify-center gap-6 text-center">
          <div><p className="font-display text-3xl font-bold text-navy-900">{count}</p><p className="text-xs text-navy-400">counters</p></div>
          <span className="text-navy-300">+</span>
          <div><p className="font-display text-3xl font-bold text-teal-600">{total - count}</p><p className="text-xs text-navy-400">makes {total}</p></div>
        </div>
      ) : (
        <p className="mt-5 text-center font-display text-3xl font-bold text-navy-900">{count}</p>
      )}
    </EngineCard>
  );
}
function CombineFrames({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const concrete = craFor(resource) === "concrete";
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const dot = (tone: "teal" | "accent") => concrete
    ? <Fruit tone={tone} px={28} />
    : <span className={cn("h-7 w-7 rounded-full", tone === "accent" ? "bg-accent-400" : "bg-teal-500")} />;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(3); setB(2); }}>
      <Intro>{p.intro ?? "Put the two groups together and count them all."}</Intro>
      <div className="space-y-3 rounded-2xl bg-surface-soft p-4">
        <div className="flex items-center gap-2"><span className="w-16 text-sm font-semibold text-teal-700">Group A</span><div className="flex flex-wrap gap-1.5">{Array.from({ length: a }).map((_, i) => <span key={i}>{dot("teal")}</span>)}</div></div>
        <div className="flex items-center gap-2"><span className="w-16 text-sm font-semibold text-accent-700">Group B</span><div className="flex flex-wrap gap-1.5">{Array.from({ length: b }).map((_, i) => <span key={i}>{dot("accent")}</span>)}</div></div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Stepper label="Group A" value={a} set={setA} min={0} max={10} />
        <Stepper label="Group B" value={b} set={setB} min={0} max={10} />
      </div>
      <p className="mt-4 text-center font-display text-2xl font-bold text-navy-900">{a} + {b} = {a + b}</p>
    </EngineCard>
  );
}

// ==================================================================
// 1b. HUNDRED SQUARE
// ==================================================================
function HundredSquareEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [step, setStep] = useState(p.hsStep ?? 5);
  const [maxN, setMaxN] = useState(p.hsMax ?? 100);
  const [showOddEven, setShowOddEven] = useState(false);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setStep(p.hsStep ?? 5); setShowOddEven(false); }}
      settings={<>
        <SettingRow label="Grid size"><Segmented value={maxN} onChange={setMaxN} options={[{ label: "1–50", value: 50 }, { label: "1–100", value: 100 }]} /></SettingRow>
        <SettingRow label="Highlight odd / even"><Toggle checked={showOddEven} onChange={setShowOddEven} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Colour the counting patterns."}</Intro>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-navy-600">Count in:</span>
        {[2, 3, 5, 10].map((s) => <button key={s} onClick={() => setStep(s)} className={cn("h-8 w-9 rounded-lg border text-sm font-semibold", step === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-600 hover:bg-navy-50")}>{s}</button>)}
      </div>
      <div className="mx-auto grid w-fit grid-cols-10 gap-0.5 rounded-xl bg-surface-soft p-2">
        {Array.from({ length: maxN }, (_, i) => i + 1).map((n) => {
          const multiple = n % step === 0, odd = n % 2 === 1;
          return <span key={n} className={cn("flex h-7 w-7 items-center justify-center rounded text-[10px] font-semibold", multiple ? "bg-teal-500 text-white" : showOddEven ? (odd ? "bg-accent-50 text-accent-700" : "bg-navy-50 text-navy-600") : "bg-white text-navy-500")}>{n}</span>;
        })}
      </div>
      <p className="mt-3 text-center text-sm text-navy-500">Teal squares are multiples of <span className="font-bold text-teal-700">{step}</span>.</p>
    </EngineCard>
  );
}

// ==================================================================
// 2. NUMBER LINE — modes: explore | onemore | steps | order
// ==================================================================
const NL_RANGES: Record<string, [number, number]> = { "0-10": [0, 10], "0-20": [0, 20], "0-100": [0, 100], "-10-10": [-10, 10] };
const ORDER_SCRAMBLE = [4, 1, 7, 0, 9, 3, 6, 10, 2, 8, 5];
function NumberLineEngine({ resource }: { resource: Resource }) {
  if ((simPreset(resource.id).nlMode ?? "explore") === "order") return <NumberOrder resource={resource} />;
  return <NumberLineMain resource={resource} />;
}
function NumberLineMain({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const mode = p.nlMode ?? "explore";
  const [rangeKey, setRangeKey] = useState(p.nlRange ?? "0-20");
  const [showLabels, setShowLabels] = useState(true);
  const [min, max] = NL_RANGES[rangeKey];
  const [value, setValue] = useState(mode === "onemore" ? 4 : 0);
  const [step, setStep] = useState(p.nlStep ?? 2);
  const [drag, setDrag] = useState(false);
  useEffect(() => { setValue((v) => clamp(v, min, max)); }, [min, max]);
  const W = 320, pad = 16, span = max - min;
  const toX = (v: number) => pad + ((v - min) / span) * (W - 2 * pad);
  const setFrom = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setValue(clamp(Math.round(min + ((e.clientX - r.left) / r.width) * span), min, max));
  };

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setValue(clamp(mode === "onemore" ? 4 : 0, min, max))}
      settings={<>
        <SettingRow label="Range"><Segmented value={rangeKey} onChange={setRangeKey} options={[{ label: "0–10", value: "0-10" }, { label: "0–20", value: "0-20" }, { label: "0–100", value: "0-100" }, { label: "−10–10", value: "-10-10" }]} /></SettingRow>
        <SettingRow label="Show all labels"><Toggle checked={showLabels} onChange={setShowLabels} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Tap the line or jump in steps."}</Intro>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} 90`} className="mx-auto block w-full min-w-[300px] cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); setFrom(e); }}
          onPointerMove={(e) => { if (drag) setFrom(e); }}
          onPointerUp={() => setDrag(false)}
          onPointerCancel={() => setDrag(false)}>
          <line x1={pad} y1={54} x2={W - pad} y2={54} stroke="#31415f" strokeWidth={2.5} strokeLinecap="round" />
          {Array.from({ length: span + 1 }, (_, i) => min + i).map((v) => {
            const label = showLabels ? (span <= 20 || v % 10 === 0) : v % 10 === 0;
            const onStep = mode === "steps" && step > 0 && ((v - min) % step === 0);
            return (
              <g key={v}>
                <line x1={toX(v)} y1={48} x2={toX(v)} y2={60} stroke="#98a8c6" strokeWidth={2} strokeLinecap="round" />
                {onStep && <circle cx={toX(v)} cy={54} r={4} fill="#14b8a6" />}
                {label && <text x={toX(v)} y={76} fontSize={9} textAnchor="middle" fill="#6a80a9" fontWeight={600}>{v}</text>}
              </g>
            );
          })}
          <g style={{ transition: "all .35s ease" }} transform={`translate(${toX(value)} 0)`}>
            <circle cx={0} cy={54} r={7} fill="#f59e0b" stroke="#fff" strokeWidth={2.5} />
            <text x={0} y={30} fontSize={14} textAnchor="middle" fill="#1b2540" fontWeight={800}>{value}</text>
            <path d="M0 36 l-5 -7 h10 z" fill="#f59e0b" />
          </g>
        </svg>
      </div>
      {mode === "onemore" ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Button size="sm" variant="outline" onClick={() => setValue((v) => clamp(v - 1, min, max))}>− one fewer</Button>
          <span className="font-display text-sm text-navy-500">one fewer <b className="text-navy-900">{clamp(value - 1, min, max)}</b> · one more <b className="text-navy-900">{clamp(value + 1, min, max)}</b></span>
          <Button size="sm" variant="secondary" onClick={() => setValue((v) => clamp(v + 1, min, max))}>+ one more</Button>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Button size="sm" variant="outline" onClick={() => setValue((v) => clamp(v - step, min, max))}>− {step}</Button>
          <div className="flex items-center gap-1 text-xs text-navy-500">step
            {[1, 2, 5, 10].map((s) => <button key={s} onClick={() => setStep(s)} className={cn("h-7 w-7 rounded-lg border text-sm font-semibold", step === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-600")}>{s}</button>)}
          </div>
          <Button size="sm" variant="secondary" onClick={() => setValue((v) => clamp(v + step, min, max))}>+ {step}</Button>
        </div>
      )}
      {mode === "steps" && <p className="mt-2 text-center text-xs text-navy-400">Teal dots mark the numbers you land on counting in {step}s.</p>}
    </EngineCard>
  );
}
function NumberOrder({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const max = 10;
  const cards = ORDER_SCRAMBLE.filter((n) => n <= max);
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const next = placed.length;
  const pick = (n: number) => {
    if (n === next) { setPlaced((pl) => [...pl, n]); setWrong(null); }
    else { setWrong(n); window.setTimeout(() => setWrong(null), 600); }
  };
  const done = placed.length === max + 1;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setPlaced([]); setWrong(null); }}>
      <Intro>{p.intro ?? "Tap the numbers in order to build the track."}</Intro>
      <div className="flex flex-wrap justify-center gap-1.5 rounded-2xl bg-surface-soft p-4">
        {Array.from({ length: max + 1 }).map((_, i) => (
          <span key={i} className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold", i < placed.length ? "bg-teal-500 text-white" : "border-2 border-dashed border-navy-200 text-navy-300")}>{i < placed.length ? placed[i] : ""}</span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {cards.filter((n) => !placed.includes(n)).map((n) => (
          <button key={n} onClick={() => pick(n)} className={cn("flex h-11 w-11 items-center justify-center rounded-xl border-2 text-lg font-bold transition-colors", wrong === n ? "border-red-400 bg-red-50 text-red-600" : "border-navy-200 text-navy-800 hover:border-teal-400")}>{n}</button>
        ))}
      </div>
      {done && <p className="mt-4 text-center text-sm font-semibold text-emerald-600">✓ In order from 0 to {max}!</p>}
    </EngineCard>
  );
}

// ==================================================================
// 3. PLACE VALUE — places: to | hto | thhto | decimal
// ==================================================================
function PlaceValueEngine({ resource }: { resource: Resource }) {
  if (simPreset(resource.id).pvPlaces === "decimal") return <DecimalPlaceValue resource={resource} />;
  return <PlaceValueMain resource={resource} />;
}
function PlaceValueMain({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const notify = useToasts((s) => s.notify);
  const [places, setPlaces] = useState<"to" | "hto" | "thhto">((p.pvPlaces as "to" | "hto" | "thhto") ?? "hto");
  const [showPartition, setShowPartition] = useState(true);
  const [th, setTh] = useState(0);
  const [h, setH] = useState(2);
  const [t, setT] = useState(3);
  const [o, setO] = useState(4);
  useEffect(() => { if (places === "to") { setH(0); setTh(0); } if (places === "hto") setTh(0); }, [places]);
  const total = th * 1000 + h * 100 + t * 10 + o;
  const showH = places !== "to", showTh = places === "thhto";
  const regroup = () => {
    let nth = th, nh = h, nt = t, no = o;
    if (no >= 10) { nt += Math.floor(no / 10); no %= 10; }
    if (nt >= 10) { nh += Math.floor(nt / 10); nt %= 10; }
    if (nh >= 10 && showTh) { nth += Math.floor(nh / 10); nh %= 10; }
    setTh(nth); setH(clamp(nh, 0, 9)); setT(nt); setO(no);
    notify({ variant: "success", title: "Regrouped!" });
  };
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setTh(0); setH(0); setT(0); setO(0); }}
      settings={<>
        <SettingRow label="Largest place"><Segmented value={places} onChange={setPlaces} options={[{ label: "Tens", value: "to" }, { label: "Hundreds", value: "hto" }, { label: "Thousands", value: "thhto" }]} /></SettingRow>
        <SettingRow label="Show partition"><Toggle checked={showPartition} onChange={setShowPartition} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Build a number and try regrouping."}</Intro>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4">
        {showTh && <Stepper label="Thousands" value={th} set={setTh} min={0} max={9} />}
        {showH && <Stepper label="Hundreds" value={h} set={setH} min={0} max={9} />}
        <Stepper label="Tens" value={t} set={setT} min={0} max={19} />
        <Stepper label="Ones" value={o} set={setO} min={0} max={19} />
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-2xl bg-surface-soft p-4">
        {showTh && th > 0 && <div className="flex items-center gap-1 rounded-lg bg-navy-800 px-2 py-1 text-xs font-bold text-white">▣ × {th}</div>}
        <div className="flex flex-wrap gap-1">{Array.from({ length: h }).map((_, i) => <div key={i} className="grid h-12 w-12 grid-cols-5 grid-rows-5 gap-px rounded bg-navy-600 p-0.5">{Array.from({ length: 25 }).map((__, j) => <span key={j} className="bg-navy-400" />)}</div>)}</div>
        <div className="flex flex-wrap gap-1">{Array.from({ length: t }).map((_, i) => <div key={i} className="flex h-12 w-3 flex-col gap-px rounded bg-teal-600 p-0.5">{Array.from({ length: 10 }).map((__, j) => <span key={j} className="flex-1 bg-teal-400" />)}</div>)}</div>
        <div className="flex flex-wrap gap-1" style={{ maxWidth: 120 }}>{Array.from({ length: o }).map((_, i) => <span key={i} className="h-3 w-3 rounded-sm bg-accent-400 ring-1 ring-accent-600" />)}</div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {showPartition ? <p className="font-display text-sm text-navy-500">{showTh ? `${th * 1000} + ` : ""}{showH ? `${h * 100} + ` : ""}{t * 10} + {o} = <span className="text-2xl font-bold text-navy-900">{total}</span></p> : <p className="font-display text-2xl font-bold text-navy-900">{total}</p>}
        <Button size="sm" variant="secondary" onClick={regroup}>Regroup</Button>
      </div>
    </EngineCard>
  );
}
function DecimalPlaceValue({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [o, setO] = useState(3);
  const [t, setT] = useState(4);
  const [h, setH] = useState(0);
  const value = o + t / 10 + h / 100;
  const shaded = t * 10 + h;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setO(0); setT(0); setH(0); }}>
      <Intro>{p.intro ?? "Build a decimal with tenths and hundredths."}</Intro>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4 sm:grid-cols-3">
        <Stepper label="Ones" value={o} set={setO} min={0} max={9} />
        <Stepper label="Tenths" value={t} set={setT} min={0} max={9} />
        <Stepper label="Hundredths" value={h} set={setH} min={0} max={9} />
      </div>
      <div className="flex items-center justify-center gap-4 rounded-2xl bg-surface-soft p-4">
        <div className="grid grid-cols-10 gap-px rounded bg-navy-200 p-0.5" style={{ width: 132, height: 132 }}>
          {Array.from({ length: 100 }).map((_, i) => <span key={i} className={cn(i < shaded ? "bg-teal-500" : "bg-white")} />)}
        </div>
        <p className="text-xs text-navy-500">one whole =<br />10 tenths =<br />100 hundredths</p>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 font-display text-2xl font-bold text-navy-900">{o} + <Frac n={t} d={10} /> + <Frac n={h} d={100} /> = {value.toFixed(2)}</p>
    </EngineCard>
  );
}

// ==================================================================
// 4. ARRAY — arDoubles
// ==================================================================
function ArrayEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const doubles = Boolean(p.arDoubles);
  const concrete = craFor(resource) === "concrete";
  const [maxSize, setMaxSize] = useState(10);
  const [showAdd, setShowAdd] = useState(true);
  const [rows, setRows] = useState(doubles ? 2 : 3);
  const [cols, setCols] = useState(4);
  useEffect(() => { setCols((c) => Math.min(c, maxSize)); if (!doubles) setRows((r) => Math.min(r, maxSize)); }, [maxSize, doubles]);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setRows(doubles ? 2 : 3); setCols(4); }}
      settings={<>
        <SettingRow label="Largest factor"><Segmented value={maxSize} onChange={setMaxSize} options={[{ label: "5", value: 5 }, { label: "10", value: 10 }, { label: "12", value: 12 }]} /></SettingRow>
        <SettingRow label="Show repeated addition"><Toggle checked={showAdd} onChange={setShowAdd} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Change the rows and columns to build an array."}</Intro>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4 sm:grid-cols-2">
        {!doubles && <Stepper label="Rows" value={rows} set={setRows} min={1} max={maxSize} />}
        <Stepper label={doubles ? "Each group" : "Columns"} value={cols} set={setCols} min={1} max={maxSize} />
      </div>
      <div className="flex justify-center overflow-x-auto rounded-2xl bg-surface-soft p-5">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, i) => concrete
            ? <Fruit key={i} tone={doubles && i >= cols ? "accent" : "teal"} px={20} />
            : <span key={i} className={cn("h-5 w-5 rounded-full", doubles && i >= cols ? "bg-accent-400" : "bg-teal-500")} />)}
        </div>
      </div>
      <div className="mt-4 text-center">
        {doubles ? <p className="font-display text-2xl font-bold text-navy-900">double {cols} = {cols} + {cols} = {2 * cols}</p>
          : <><p className="font-display text-2xl font-bold text-navy-900">{rows} × {cols} = {rows * cols}</p>{showAdd && <p className="mt-1 text-xs text-navy-500">{Array.from({ length: rows }).map(() => cols).join(" + ")} = {rows * cols}</p>}</>}
      </div>
    </EngineCard>
  );
}

// ==================================================================
// 5. FRACTION — modes: compare | equivalent | halves | percent
// ==================================================================
function FractionCircle({ n, d, color }: { n: number; d: number; color: string }) {
  const cx = 42, cy = 42, r = 38;
  return (
    <svg viewBox="0 0 84 84" className="h-24 w-24">
      {Array.from({ length: d }).map((_, i) => {
        const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
        const pt = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
        const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
        const large = a1 - a0 > Math.PI ? 1 : 0;
        return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={i < n ? color : "#fff"} stroke="#c1cbde" strokeWidth={1} />;
      })}
    </svg>
  );
}
function FractionEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  if (p.frMode === "percent") return <PercentGrid resource={resource} />;
  if (p.frMode === "halves") return <HalvesShader resource={resource} />;
  return <FractionLab resource={resource} />;
}

// ---- Fraction Lab: linked circle / bar / number-line representations ----
const TEAL_A = "#14b8a6", AMBER_B = "#f59e0b";
type FMarker = { n: number; d: number; color: string; onSet: (n: number) => void };

function FracCirclePlay({ n, d, color, onSet }: { n: number; d: number; color: string; onSet: (n: number) => void }) {
  const S = 116, cx = S / 2, cy = S / 2, r = S / 2 - 6;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="h-28 w-28 shrink-0" role="group" aria-label="fraction circle (click a slice)">
      <circle cx={cx} cy={cy} r={r + 3} fill="#eef1f6" />
      {Array.from({ length: d }).map((_, i) => {
        const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
        const pt = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
        const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
        const large = a1 - a0 > Math.PI ? 1 : 0;
        return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
          fill={i < n ? color : "#fff"} stroke="#c1cbde" strokeWidth={1.5}
          className="cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => onSet(i < n ? i : i + 1)} />;
      })}
    </svg>
  );
}
function FracBarPlay({ n, d, color, onSet }: { n: number; d: number; color: string; onSet: (n: number) => void }) {
  const [drag, setDrag] = useState(false);
  const setFromX = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onSet(clamp(Math.ceil(((e.clientX - r.left) / r.width) * d), 0, d));
  };
  return (
    <div className="flex h-12 w-full min-w-[150px] cursor-pointer touch-none select-none overflow-hidden rounded-xl border-2 border-navy-200"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); setFromX(e); }}
      onPointerMove={(e) => { if (drag) setFromX(e); }}
      onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}
      role="slider" aria-label="fraction bar (click or drag)" aria-valuenow={n} aria-valuemin={0} aria-valuemax={d}>
      {Array.from({ length: d }).map((_, i) => <div key={i} className="h-full flex-1 border-r border-white/70 transition-colors last:border-r-0" style={{ background: i < n ? color : "#fff" }} />)}
    </div>
  );
}
function FracLine({ markers }: { markers: FMarker[] }) {
  const Wd = 300, H = 66, pad = 20, y = 36;
  const [drag, setDrag] = useState<number | null>(null);
  const toX = (v: number) => pad + v * (Wd - 2 * pad);
  const vAt = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vbX = ((e.clientX - r.left) / r.width) * Wd;
    return clamp((vbX - pad) / (Wd - 2 * pad), 0, 1);
  };
  const grab = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const v = vAt(e);
    let idx = 0, best = Infinity;
    markers.forEach((m, i) => { const dd = Math.abs(v - m.n / m.d); if (dd < best) { best = dd; idx = i; } });
    setDrag(idx); markers[idx].onSet(clamp(Math.round(v * markers[idx].d), 0, markers[idx].d));
  };
  const move = (e: React.PointerEvent<SVGSVGElement>) => { if (drag === null) return; const m = markers[drag]; m.onSet(clamp(Math.round(vAt(e) * m.d), 0, m.d)); };
  return (
    <svg viewBox={`0 0 ${Wd} ${H}`} className="w-full max-w-md cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={grab} onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
      <line x1={pad} y1={y} x2={Wd - pad} y2={y} stroke="#31415f" strokeWidth={2.5} strokeLinecap="round" />
      {markers.map((m, mi) => Array.from({ length: m.d + 1 }).map((_, k) => <line key={`${mi}-${k}`} x1={toX(k / m.d)} y1={y - 5} x2={toX(k / m.d)} y2={y + 5} stroke={m.color} strokeOpacity={0.4} strokeWidth={1.5} />))}
      <text x={pad} y={y + 22} fontSize={11} textAnchor="middle" fill="#6a80a9" fontWeight={700}>0</text>
      <text x={Wd - pad} y={y + 22} fontSize={11} textAnchor="middle" fill="#6a80a9" fontWeight={700}>1</text>
      {markers.map((m, mi) => { const x = toX(m.n / m.d); return <g key={mi}><line x1={x} y1={y - 15} x2={x} y2={y + 6} stroke={m.color} strokeWidth={3} /><circle cx={x} cy={y - 17} r={8} fill={m.color} stroke="#fff" strokeWidth={2} /></g>; })}
    </svg>
  );
}

type FTask = { label: string; ok: (v1: number, v2: number, d1: number, d2: number) => boolean; needB: boolean };
const FRAC_TASKS: FTask[] = [
  { label: "Make fraction A equal to one half.", ok: (v1) => v1 === 0.5, needB: false },
  { label: "Make A larger than three-quarters.", ok: (v1) => v1 > 0.75, needB: false },
  { label: "Make A equal to two-thirds.", ok: (v1) => Math.abs(v1 - 2 / 3) < 1e-9, needB: false },
  { label: "Make A and B equal amounts with different denominators (equivalent!).", ok: (v1, v2, d1, d2) => v1 === v2 && d1 !== d2, needB: true },
  { label: "Make A smaller than B.", ok: (v1, v2) => v1 < v2, needB: true },
];

function FractionLab({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [maxDen, setMaxDen] = useState(12);
  const [compare, setCompare] = useState(true);
  const [show, setShow] = useState({ circle: true, bar: true, line: true, numbers: true });
  const [challenge, setChallenge] = useState(false);
  const [chIdx, setChIdx] = useState(0);
  const [n1, setN1] = useState(1); const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(2); const [d2, setD2] = useState(3);
  useEffect(() => { setD1((d) => Math.min(d, maxDen)); setD2((d) => Math.min(d, maxDen)); }, [maxDen]);
  useEffect(() => { setN1((n) => Math.min(n, d1)); }, [d1]);
  useEffect(() => { setN2((n) => Math.min(n, d2)); }, [d2]);
  useEffect(() => { if (challenge && FRAC_TASKS[chIdx].needB) setCompare(true); }, [challenge, chIdx]);

  const v1 = n1 / d1, v2 = n2 / d2;
  const rel = v1 > v2 ? ">" : v1 < v2 ? "<" : "=";
  const equiv = compare && v1 === v2 && d1 !== d2;
  const same = compare && n1 === n2 && d1 === d2;
  const task = FRAC_TASKS[chIdx];
  const chDone = task.ok(v1, v2, d1, d2);
  const hint = equiv ? "Nice — two different fractions covering the same amount. That's equivalence!"
    : compare ? "Drag the number-line dots. Which fraction covers more of the whole?"
    : "Click the pie slices, drag the bar, or move the slider to change the fraction.";
  const markers: FMarker[] = compare
    ? [{ n: n1, d: d1, color: TEAL_A, onSet: (x) => setN1(clamp(x, 0, d1)) }, { n: n2, d: d2, color: AMBER_B, onSet: (x) => setN2(clamp(x, 0, d2)) }]
    : [{ n: n1, d: d1, color: TEAL_A, onSet: (x) => setN1(clamp(x, 0, d1)) }];

  const pillCls = (on: boolean, accent = false) => cn("rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
    on ? (accent ? "border-accent-500 bg-accent-50 text-accent-700" : "border-teal-500 bg-teal-50 text-teal-700") : "border-navy-200 text-navy-500 hover:bg-navy-50");
  const Pill = ({ k, label }: { k: keyof typeof show; label: string }) => (
    <button onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))} aria-pressed={show[k]} className={pillCls(show[k])}>{label}</button>
  );

  const panel = (label: string, n: number, d: number, setN: (x: number) => void, setD: (x: number) => void, color: string, cls: string) => (
    <div className={cn("rounded-2xl border-2 p-3.5", cls)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: color }}>{label}</span>
        <div className="flex items-center gap-2 font-display font-bold" style={{ color }}>
          <span className="text-xl"><Frac n={n} d={d} /></span>
          {show.numbers && <span className="text-[11px] font-medium text-navy-400">= {(n / d).toFixed(2)} = {Math.round((n / d) * 100)}%</span>}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {show.circle && <FracCirclePlay n={n} d={d} color={color} onSet={(x) => setN(clamp(x, 0, d))} />}
        {show.bar && <div className="min-w-[150px] flex-1"><FracBarPlay n={n} d={d} color={color} onSet={(x) => setN(clamp(x, 0, d))} /></div>}
      </div>
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-navy-500">
          <span className="w-24 shrink-0">Numerator {n}</span>
          <input type="range" min={0} max={d} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="flex-1" style={{ accentColor: color }} aria-label={`${label} numerator`} />
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-navy-500">
          <span className="w-24 shrink-0">Denominator {d}</span>
          <input type="range" min={1} max={maxDen} step={1} value={d} onChange={(e) => { const nd = Number(e.target.value); setD(nd); setN(Math.min(n, nd)); }} className="flex-1" style={{ accentColor: color }} aria-label={`${label} denominator`} />
        </label>
      </div>
    </div>
  );

  return (
    <EngineCard hint={hintFor(resource)}
      onReset={() => { setN1(1); setD1(2); setN2(2); setD2(3); setChIdx(0); }}
      settings={<SettingRow label="Largest denominator"><Segmented value={maxDen} onChange={setMaxDen} options={[{ label: "6", value: 6 }, { label: "10", value: 10 }, { label: "12", value: 12 }]} /></SettingRow>}
    >
      <Intro>{p.intro ?? "Build and compare fractions with circles, bars and a number line."}</Intro>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-navy-400">Show</span>
        <Pill k="circle" label="Circle" /><Pill k="bar" label="Bar" /><Pill k="line" label="Number line" /><Pill k="numbers" label="Decimals" />
        <span className="mx-1 h-4 w-px bg-navy-200" />
        <button onClick={() => setCompare((v) => !v)} aria-pressed={compare} className={pillCls(compare)}>Compare two</button>
        <button onClick={() => setChallenge((v) => !v)} aria-pressed={challenge} className={pillCls(challenge, true)}>Challenge</button>
      </div>

      {compare ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          {panel("A", n1, d1, setN1, setD1, TEAL_A, "border-teal-200 bg-teal-50/40")}
          <div className="flex flex-col items-center justify-center gap-1 py-1">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-display text-2xl font-bold text-white">{rel}</span>
            {equiv && <span className="text-[11px] font-semibold text-emerald-600">equivalent</span>}
            {same && <span className="text-[11px] font-semibold text-navy-400">same</span>}
          </div>
          {panel("B", n2, d2, setN2, setD2, AMBER_B, "border-accent-200 bg-accent-50/40")}
        </div>
      ) : (
        <div className="mx-auto max-w-md">{panel("A", n1, d1, setN1, setD1, TEAL_A, "border-teal-200 bg-teal-50/40")}</div>
      )}

      {show.line && (
        <div className="mt-4 flex flex-col items-center rounded-2xl bg-surface-soft p-3">
          <p className="mb-1 text-xs font-semibold text-navy-400">Number line</p>
          <FracLine markers={markers} />
        </div>
      )}

      {challenge && (
        <div className={cn("mt-4 rounded-2xl border-2 p-4 transition-colors", chDone ? "border-emerald-300 bg-emerald-50/60" : "border-accent-300 bg-accent-50/40")}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">Challenge {chIdx + 1}/{FRAC_TASKS.length}</p>
              <p className="font-medium text-navy-800">{task.label}</p>
            </div>
            {chDone ? <Badge tone="green"><Check className="h-3.5 w-3.5" /> Solved!</Badge> : <Badge tone="grey">Keep trying</Badge>}
          </div>
          <div className="mt-2 flex justify-end"><Button size="sm" variant="outline" onClick={() => setChIdx((i) => (i + 1) % FRAC_TASKS.length)}>Next challenge</Button></div>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-navy-500">💡 {hint}</p>
    </EngineCard>
  );
}
function HalvesShader({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [model, setModel] = useState<"circles" | "bars">(p.frModel === "bars" ? "bars" : "circles");
  const [parts, setParts] = useState(2);
  const [n, setN] = useState(1);
  useEffect(() => { setN((x) => Math.min(x, parts)); }, [parts]);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setN(0)}
      settings={<>
        <SettingRow label="Equal parts"><Segmented value={parts} onChange={setParts} options={[{ label: "Halves", value: 2 }, { label: "Quarters", value: 4 }]} /></SettingRow>
        <SettingRow label="Model"><Segmented value={model} onChange={setModel} options={[{ label: "Circle", value: "circles" }, { label: "Bar", value: "bars" }]} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Shade one part of the shape."}</Intro>
      <div className="flex flex-col items-center gap-4">
        {model === "circles" ? <FractionCircle n={n} d={parts} color="#14b8a6" />
          : <div className="flex w-56 overflow-hidden rounded-xl border-2 border-navy-200">{Array.from({ length: parts }).map((_, i) => <div key={i} className={cn("h-12 flex-1 border-r border-white/70 last:border-r-0", i < n ? "bg-teal-500" : "bg-white")} />)}</div>}
        <Stepper label="Shaded parts" value={n} set={(x) => setN(clamp(x, 0, parts))} min={0} max={parts} />
        <p className="flex items-center gap-1.5 font-display text-2xl font-bold text-navy-900"><Frac n={n} d={parts} />{n === 1 && parts === 2 ? <span>— one half</span> : n === 1 && parts === 4 ? <span>— one quarter</span> : null}</p>
      </div>
    </EngineCard>
  );
}
function PercentGrid({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [shaded, setShaded] = useState(25);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setShaded(0)}>
      <Intro>{p.intro ?? "Shade the grid to show a percentage."}</Intro>
      <div className="mx-auto grid w-fit grid-cols-10 gap-px rounded-lg bg-navy-200 p-0.5">
        {Array.from({ length: 100 }).map((_, i) => (
          <button key={i} onClick={() => setShaded(i < shaded ? i : i + 1)} className={cn("h-6 w-6", i < shaded ? "bg-teal-500" : "bg-white hover:bg-teal-50")} aria-label={`Square ${i + 1}`} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-center">
        <div><p className="font-display text-3xl font-bold text-navy-900">{shaded}%</p><p className="text-xs text-navy-400">shaded</p></div>
        <div><p className="flex justify-center font-display text-3xl font-bold text-teal-600"><Frac n={shaded} d={100} /></p><p className="text-xs text-navy-400">as a fraction</p></div>
      </div>
    </EngineCard>
  );
}

// ==================================================================
// 6. CLOCK
// ==================================================================
function ClockEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [precision, setPrecision] = useState(p.clPrecision ?? (resource.programme === "early-years" ? 30 : 5));
  const [showWords, setShowWords] = useState(true);
  const [hour, setHour] = useState(3);
  const [min, setMin] = useState(0);
  const [drag, setDrag] = useState(false);
  const lastMin = useRef(0);
  useEffect(() => { setMin((m) => (Math.round(m / precision) * precision) % 60); }, [precision]);
  useEffect(() => { lastMin.current = min; }, [min]);
  const cx = 90, cy = 90, r = 78;
  const minAngle = (min * 6 - 90) * (Math.PI / 180);
  const hourAngle = (((hour % 12) * 30 + min * 0.5) - 90) * (Math.PI / 180);
  const setFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rct = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rct.left) / rct.width) * 180 - cx;
    const y = ((e.clientY - rct.top) / rct.height) * 180 - cy;
    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    let m = Math.round(deg / 6) % 60;
    m = (Math.round(m / precision) * precision) % 60;
    const prev = lastMin.current;
    if (prev >= 45 && m <= 15) setHour((h) => (h % 12) + 1);
    else if (prev <= 15 && m >= 45) setHour((h) => ((h - 2 + 12) % 12) + 1);
    lastMin.current = m;
    setMin(m);
  };
  const words = (() => {
    const names = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];
    const h12 = hour % 12;
    if (min === 0) return `${names[h12]} o'clock`;
    if (min === 15) return `quarter past ${names[h12]}`;
    if (min === 30) return `half past ${names[h12]}`;
    if (min === 45) return `quarter to ${names[(h12 + 1) % 12]}`;
    if (min < 30) return `${min} minutes past ${names[h12]}`;
    return `${60 - min} minutes to ${names[(h12 + 1) % 12]}`;
  })();
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setHour(3); setMin(0); }}
      settings={<>
        <SettingRow label="Precision"><Segmented value={precision} onChange={setPrecision} options={[{ label: "o'clock / half", value: 30 }, { label: "quarters", value: 15 }, { label: "5 min", value: 5 }, { label: "1 min", value: 1 }]} /></SettingRow>
        <SettingRow label="Read time in words"><Toggle checked={showWords} onChange={setShowWords} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Drag the hands to set the time, then read it."}</Intro>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <svg viewBox="0 0 180 180" className="h-44 w-44 cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); setFromPointer(e); }}
          onPointerMove={(e) => { if (drag) setFromPointer(e); }}
          onPointerUp={() => setDrag(false)}
          onPointerCancel={() => setDrag(false)}>
          <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#31415f" strokeWidth={3} />
          {Array.from({ length: 12 }).map((_, i) => { const a = (i * 30 - 90) * (Math.PI / 180); return <text key={i} x={cx + (r - 14) * Math.cos(a)} y={cy + (r - 14) * Math.sin(a) + 4} fontSize={12} textAnchor="middle" fill="#6a80a9" fontWeight={700}>{i === 0 ? 12 : i}</text>; })}
          <line x1={cx} y1={cy} x2={cx + (r - 34) * Math.cos(hourAngle)} y2={cy + (r - 34) * Math.sin(hourAngle)} stroke="#1b2540" strokeWidth={5} strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx + (r - 18) * Math.cos(minAngle)} y2={cy + (r - 18) * Math.sin(minAngle)} stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={4} fill="#1b2540" />
        </svg>
        <div className="text-center">
          <p className="font-display text-3xl font-bold text-navy-900 tabular-nums">{hour === 0 ? 12 : hour}:{String(min).padStart(2, "0")}</p>
          {showWords && <p className="mt-1 capitalize text-teal-700">{words}</p>}
          <div className="mt-4 grid gap-2">
            <Stepper label="Hours" value={hour} set={(x) => setHour(((x - 1 + 12) % 12) + 1)} min={1} max={12} />
            <Stepper label="Minutes" value={min} set={(x) => setMin((x + 60) % 60)} min={0} max={60 - precision} step={precision} />
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ==================================================================
// 7. COORDINATE
// ==================================================================
function CoordinateEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [quad, setQuad] = useState<number>(p.coQuad ?? 1);
  const [gridMax, setGridMax] = useState(p.coGrid ?? 6);
  const [connect, setConnect] = useState(true);
  const [pts, setPts] = useState<[number, number][]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  useEffect(() => { setPts([]); }, [quad, gridMax]);
  const lo = quad === 4 ? -gridMax : 0, hi = gridMax;
  const size = 260, pad = 24, span = hi - lo;
  const toX = (x: number) => pad + ((x - lo) / span) * (size - 2 * pad);
  const toY = (y: number) => size - pad - ((y - lo) / span) * (size - 2 * pad);
  const toGrid = (e: React.PointerEvent<SVGSVGElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    const gx = Math.round(lo + (((e.clientX - r.left) / r.width) * size - pad) / (size - 2 * pad) * span);
    const gy = Math.round(lo + (size - pad - ((e.clientY - r.top) / r.height) * size) / (size - 2 * pad) * span);
    return [clamp(gx, lo, hi), clamp(gy, lo, hi)];
  };
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setPts([])}
      settings={<>
        <SettingRow label="Quadrants"><Segmented value={quad} onChange={setQuad} options={[{ label: "First only", value: 1 }, { label: "All four", value: 4 }]} /></SettingRow>
        <SettingRow label="Grid size"><Segmented value={gridMax} onChange={setGridMax} options={[{ label: "5", value: 5 }, { label: "6", value: 6 }, { label: "10", value: 10 }]} /></SettingRow>
        <SettingRow label="Connect points"><Toggle checked={connect} onChange={setConnect} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? `Tap to plot points, or drag a point to move it${quad === 4 ? "" : " (first quadrant)"}.`}</Intro>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-64 w-64 touch-none rounded-xl bg-surface-soft"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const [gx, gy] = toGrid(e);
            const hit = pts.findIndex(([x, y]) => x === gx && y === gy);
            if (hit >= 0) setDragIdx(hit);
            else { setPts((pp) => [...pp, [gx, gy]]); setDragIdx(pts.length); }
          }}
          onPointerMove={(e) => { if (dragIdx === null) return; const g = toGrid(e); setPts((pp) => pp.map((pt, i) => (i === dragIdx ? g : pt))); }}
          onPointerUp={() => setDragIdx(null)}
          onPointerCancel={() => setDragIdx(null)}>
          {Array.from({ length: span + 1 }, (_, i) => lo + i).map((v) => <g key={v} stroke="#dfe4ee" strokeWidth={1}><line x1={toX(v)} y1={toY(lo)} x2={toX(v)} y2={toY(hi)} /><line x1={toX(lo)} y1={toY(v)} x2={toX(hi)} y2={toY(v)} /></g>)}
          <line x1={toX(lo)} y1={toY(0)} x2={toX(hi)} y2={toY(0)} stroke="#98a8c6" strokeWidth={2} />
          <line x1={toX(0)} y1={toY(lo)} x2={toX(0)} y2={toY(hi)} stroke="#98a8c6" strokeWidth={2} />
          {connect && pts.length > 1 && <polyline points={pts.map(([x, y]) => `${toX(x)},${toY(y)}`).join(" ")} fill="none" stroke="#199473" strokeWidth={2} />}
          {pts.map(([x, y], i) => <circle key={i} cx={toX(x)} cy={toY(y)} r={5} fill="#f59e0b" stroke="#fff" strokeWidth={2} />)}
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-navy-600">Plotted points</p>
          <div className="mt-2 flex max-w-[160px] flex-wrap justify-center gap-1.5">{pts.length === 0 ? <span className="text-xs text-navy-400">Tap the grid…</span> : pts.map(([x, y], i) => <Badge key={i} tone="navy">({x}, {y})</Badge>)}</div>
        </div>
      </div>
    </EngineCard>
  );
}

// ==================================================================
// 8. BAR CHART — modes: bar | pictogram | stats
// ==================================================================
function BarChartEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const mode = p.bcMode ?? "bar";
  const [cats, setCats] = useState(p.bcCats ?? 5);
  const [maxValue, setMaxValue] = useState(10);
  const [showStats, setShowStats] = useState(mode === "stats");
  const [data, setData] = useState([3, 5, 2, 6, 4, 3]);
  useEffect(() => { setData((d) => { const nd = [...d]; while (nd.length < cats) nd.push(3); return nd.slice(0, cats); }); }, [cats]);
  const labels = ["A", "B", "C", "D", "E", "F"];
  const view = data.slice(0, cats);
  const maxV = Math.max(...view, 1);
  const mean = view.reduce((a, b) => a + b, 0) / view.length;
  const sorted = [...view].sort((a, b) => a - b);
  const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const counts: Record<number, number> = {}; view.forEach((v) => { counts[v] = (counts[v] ?? 0) + 1; });
  const modeVal = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  const range = Math.max(...view) - Math.min(...view);
  const pictogram = mode === "pictogram";
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setData([3, 5, 2, 6, 4, 3])}
      settings={<>
        <SettingRow label="Categories"><Segmented value={cats} onChange={setCats} options={[{ label: "3", value: 3 }, { label: "4", value: 4 }, { label: "5", value: 5 }, { label: "6", value: 6 }]} /></SettingRow>
        {!pictogram && <SettingRow label="Scale"><Segmented value={maxValue} onChange={setMaxValue} options={[{ label: "0–10", value: 10 }, { label: "0–20", value: 20 }]} /></SettingRow>}
        {!pictogram && <SettingRow label="Show averages"><Toggle checked={showStats} onChange={setShowStats} /></SettingRow>}
      </>}
    >
      <Intro>{p.intro ?? "Use the buttons to change the chart."}</Intro>
      <div className="flex items-end justify-center gap-4 overflow-x-auto rounded-2xl bg-surface-soft p-4" style={{ minHeight: 180 }}>
        {view.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-navy-500">{v}</span>
            {pictogram ? (
              <div className="flex flex-col-reverse gap-0.5">{Array.from({ length: v }).map((_, j) => <span key={j} className="h-4 w-4 rounded-sm bg-teal-500" />)}</div>
            ) : (
              <div className="w-9 rounded-t-lg bg-teal-500 transition-all" style={{ height: `${(v / Math.max(maxV, maxValue)) * 120}px` }} />
            )}
            <span className="text-xs font-medium text-navy-600">{labels[i]}</span>
            <div className="flex gap-0.5">
              <button onClick={() => setData((d) => d.map((x, j) => j === i ? clamp(x - 1, 0, pictogram ? 8 : maxValue) : x))} className="h-6 w-6 rounded border border-navy-200 text-sm font-bold text-navy-600 hover:bg-navy-50">−</button>
              <button onClick={() => setData((d) => d.map((x, j) => j === i ? clamp(x + 1, 0, pictogram ? 8 : maxValue) : x))} className="h-6 w-6 rounded border border-navy-200 text-sm font-bold text-navy-600 hover:bg-navy-50">+</button>
            </div>
          </div>
        ))}
      </div>
      {pictogram && <p className="mt-3 text-center text-xs text-navy-400">Each square stands for one. Which has the most?</p>}
      {!pictogram && showStats && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[["Mean", mean.toFixed(1)], ["Median", `${median}`], ["Mode", `${modeVal}`], ["Range", `${range}`]].map(([k, v]) => <div key={k} className="rounded-xl bg-surface-soft p-3 text-center"><p className="font-display text-xl font-bold text-navy-900">{v}</p><p className="text-xs text-navy-400">{k}</p></div>)}
        </div>
      )}
    </EngineCard>
  );
}

// ==================================================================
// 9. SPINNER
// ==================================================================
const SPIN_COLORS = [{ hex: "#14b8a6" }, { hex: "#f59e0b" }, { hex: "#6366f1" }, { hex: "#f43f5e" }, { hex: "#22c55e" }, { hex: "#a855f7" }];
function SpinnerEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [sectors, setSectors] = useState(p.spSectors ?? 4);
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [counts, setCounts] = useState<number[]>(Array(p.spSectors ?? 4).fill(0));
  useEffect(() => { setCounts(Array(sectors).fill(0)); setRot(0); }, [sectors]);
  const total = counts.reduce((a, b) => a + b, 0);
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * sectors);
    setRot((r) => r + 360 * 4 + (360 - (idx * (360 / sectors) + 360 / sectors / 2)));
    window.setTimeout(() => { setCounts((c) => c.map((x, i) => (i === idx ? x + 1 : x))); setSpinning(false); }, 1600);
  };
  const spinMany = (n: number) => {
    const add = Array(sectors).fill(0);
    for (let k = 0; k < n; k++) add[Math.floor(Math.random() * sectors)] += 1;
    setCounts((c) => c.map((x, i) => x + add[i]));
  };
  const cx = 90, cy = 90, r = 80;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setCounts(Array(sectors).fill(0))}
      settings={<SettingRow label="Number of sectors"><Segmented value={sectors} onChange={setSectors} options={[{ label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 }, { label: "6", value: 6 }]} /></SettingRow>}
    >
      <Intro>{p.intro ?? "Spin and record the results."}</Intro>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
        <div className="relative">
          <svg viewBox="0 0 180 180" className="h-44 w-44" style={{ transform: `rotate(${rot}deg)`, transition: "transform 1.6s cubic-bezier(.2,.8,.2,1)" }}>
            {SPIN_COLORS.slice(0, sectors).map((c, i) => { const a0 = (i * (360 / sectors) - 90) * (Math.PI / 180), a1 = ((i + 1) * (360 / sectors) - 90) * (Math.PI / 180); const pt = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = pt(a0), [x1, y1] = pt(a1); const large = a1 - a0 > Math.PI ? 1 : 0; return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={c.hex} stroke="#fff" strokeWidth={2} />; })}
            <circle cx={cx} cy={cy} r={7} fill="#1b2540" />
          </svg>
          <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "14px solid #1b2540" }} />
        </div>
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={spin} loading={spinning}><Play className="h-4 w-4" /> Spin</Button>
            <Button variant="outline" size="sm" onClick={() => spinMany(10)}>×10</Button>
            <Button variant="outline" size="sm" onClick={() => spinMany(100)}>×100</Button>
          </div>
          <div className="mt-4 space-y-1.5">
            {SPIN_COLORS.slice(0, sectors).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
                <span className="w-10 text-right text-navy-600 tabular-nums">{counts[i]}</span>
                <span className="h-2 w-24 overflow-hidden rounded-full bg-navy-100"><span className="block h-full rounded-full" style={{ width: total ? `${(counts[i] / total) * 100}%` : "0%", background: c.hex }} /></span>
                <span className="w-10 text-xs text-navy-400 tabular-nums">{total ? `${Math.round((counts[i] / total) * 100)}%` : "—"}</span>
              </div>
            ))}
            <p className="pt-1 text-xs text-navy-400">Total spins: {total} · P(each) = 1/{sectors}. More trials → closer to expected.</p>
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ==================================================================
// 10. MONEY
// ==================================================================
const COIN_SETS: Record<string, number[]> = { small: [1, 2, 5, 10, 20, 50], full: [1, 2, 5, 10, 20, 50, 100, 200] };
function MoneyEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const notify = useToasts((s) => s.notify);
  const [maxTarget, setMaxTarget] = useState(50);
  const [coinSet, setCoinSet] = useState<"small" | "full">("small");
  const [target, setTarget] = useState(47);
  const [total, setTotal] = useState(0);
  useEffect(() => { setTarget((t) => Math.min(t, maxTarget)); }, [maxTarget]);
  const fmt = (pence: number) => (pence >= 100 ? `£${(pence / 100).toFixed(2)}` : `${pence}p`);
  const done = total === target;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setTotal(0)}
      settings={<>
        <SettingRow label="Amounts up to"><Segmented value={maxTarget} onChange={setMaxTarget} options={[{ label: "20p", value: 20 }, { label: "50p", value: 50 }, { label: "£1", value: 100 }, { label: "£2", value: 200 }]} /></SettingRow>
        <SettingRow label="Coins available"><Segmented value={coinSet} onChange={setCoinSet} options={[{ label: "To 50p", value: "small" }, { label: "To £2", value: "full" }]} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Choose coins to make the amount."}</Intro>
      <div className="mb-4 rounded-2xl bg-surface-soft p-4 text-center"><p className="text-sm text-navy-500">Make this amount:</p><p className="font-display text-3xl font-bold text-navy-900">{fmt(target)}</p></div>
      <div className="flex flex-wrap justify-center gap-2">{COIN_SETS[coinSet].map((c) => <button key={c} onClick={() => setTotal((t) => t + c)} className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 text-xs font-bold text-navy-900 shadow ring-2 ring-accent-600 hover:bg-accent-300">{fmt(c)}</button>)}</div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg">Total: <span className={cn("font-bold", done ? "text-emerald-600" : total > target ? "text-red-600" : "text-navy-900")}>{fmt(total)}</span></p>
        <div className="flex items-center gap-2">{done && <Badge tone="green"><Check className="h-3.5 w-3.5" /> Exact!</Badge>}{total > target && <Badge tone="red"><X className="h-3.5 w-3.5" /> Too much</Badge>}<Button size="sm" variant="outline" onClick={() => { setTotal(0); setTarget(2 + Math.floor(Math.random() * (maxTarget - 1))); notify({ variant: "info", title: "New amount set" }); }}>New amount</Button></div>
      </div>
    </EngineCard>
  );
}

// ==================================================================
// 11. SYMMETRY
// ==================================================================
const SYM_BASE: [number, number][] = [[0, 1], [1, 0], [1, 2], [2, 1], [3, 0], [4, 2], [5, 1]];
function SymmetryEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [axis, setAxis] = useState<"vertical" | "horizontal">(p.syAxis ?? "vertical");
  const R = 6, C = 6;
  const [right, setRight] = useState<Set<string>>(new Set());
  useEffect(() => { setRight(new Set()); }, [axis]);
  const key = (r: number, c: number) => `${r}-${c}`;
  const given = new Set(axis === "vertical" ? SYM_BASE.map(([r, c]) => key(r, c)) : SYM_BASE.map(([r, c]) => key(c, r)));
  const isGivenCell = (r: number, c: number) => axis === "vertical" ? c < C / 2 : r < R / 2;
  const mirror = (r: number, c: number) => axis === "vertical" ? key(r, C - 1 - c) : key(R - 1 - r, c);
  const target = new Set(Array.from(given).map((k) => { const [r, c] = k.split("-").map(Number); return mirror(r, c); }));
  const correct = right.size === target.size && Array.from(right).every((k) => target.has(k));
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setRight(new Set())}
      settings={<SettingRow label="Mirror line"><Segmented value={axis} onChange={setAxis} options={[{ label: "Vertical", value: "vertical" }, { label: "Horizontal", value: "horizontal" }]} /></SettingRow>}
    >
      <Intro>{p.intro ?? "Complete the pattern across the mirror line."}</Intro>
      <div className="flex justify-center">
        <div className="relative grid gap-1 rounded-2xl bg-surface-soft p-3" style={{ gridTemplateColumns: `repeat(${C}, 2.25rem)` }}>
          {Array.from({ length: R }).map((_, r) => Array.from({ length: C }).map((__, c) => { const g = isGivenCell(r, c); const filled = g ? given.has(key(r, c)) : right.has(key(r, c)); return <button key={key(r, c)} onClick={() => { if (g) return; setRight((s) => { const n = new Set(s); const k = key(r, c); n.has(k) ? n.delete(k) : n.add(k); return n; }); }} className={cn("h-9 w-9 rounded-md border transition-colors", filled ? "bg-teal-500 border-teal-600" : "bg-white border-navy-200", g ? "cursor-default opacity-90" : "hover:bg-teal-50")} aria-label={`cell ${r},${c}`} />; }))}
          {axis === "vertical" ? <div className="pointer-events-none absolute inset-y-2 left-1/2 w-0.5 -translate-x-1/2 bg-accent-500" /> : <div className="pointer-events-none absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 bg-accent-500" />}
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-semibold">{correct ? <span className="text-emerald-600">✓ Symmetrical — well done!</span> : <span className="text-navy-400">Reflect each teal square across the orange line.</span>}</p>
    </EngineCard>
  );
}

// ==================================================================
// 12. ANGLES
// ==================================================================
function AnglesEngine({ resource }: { resource: Resource }) {
  const [snap, setSnap] = useState(1);
  const [quiz, setQuiz] = useState(false);
  const [a, setA] = useState(120);
  const [reveal, setReveal] = useState(false);
  const [drag, setDrag] = useState(false);
  const other = 180 - a;
  const cx = 150, cy = 120, len = 110;
  const rad = (a * Math.PI) / 180;
  const ax = cx + len * Math.cos(rad), ay = cy - len * Math.sin(rad);
  const setFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rct = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - rct.left) / rct.width) * 300;
    const vy = ((e.clientY - rct.top) / rct.height) * 150;
    let deg = (Math.atan2(cy - vy, vx - cx) * 180) / Math.PI;
    if (deg < 0) deg = 0;
    setA(clamp(Math.round(deg / snap) * snap, 10, 170));
    setReveal(false);
  };
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(120); setReveal(false); }}
      settings={<>
        <SettingRow label="Snap to"><Segmented value={snap} onChange={setSnap} options={[{ label: "1°", value: 1 }, { label: "5°", value: 5 }, { label: "10°", value: 10 }]} /></SettingRow>
        <SettingRow label="Quiz mode (hide answer)"><Toggle checked={quiz} onChange={(v) => { setQuiz(v); setReveal(false); }} /></SettingRow>
      </>}
    >
      <Intro>{simPreset(resource.id).intro ?? "Drag the orange ray (or use the slider). The two angles on the line total 180°."}</Intro>
      <svg viewBox="0 0 300 150" className="mx-auto block w-full max-w-sm cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); setFromPointer(e); }}
        onPointerMove={(e) => { if (drag) setFromPointer(e); }}
        onPointerUp={() => setDrag(false)}
        onPointerCancel={() => setDrag(false)}>
        <line x1={cx - len} y1={cy} x2={cx + len} y2={cy} stroke="#31415f" strokeWidth={3} strokeLinecap="round" />
        <path d={`M${cx + 30} ${cy} A30 30 0 0 0 ${cx + 30 * Math.cos(rad)} ${cy - 30 * Math.sin(rad)}`} fill="#199473" fillOpacity={0.15} stroke="#199473" strokeWidth={2} />
        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#f59e0b" strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={ax} cy={ay} r={7} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
        <text x={cx + 12} y={cy - 20} fontSize={13} fill="#199473" fontWeight={800}>{a}°</text>
        <text x={cx - 40} y={cy - 20} fontSize={13} fill="#6a80a9" fontWeight={800}>{quiz && !reveal ? "?" : `${other}°`}</text>
        <circle cx={cx} cy={cy} r={4} fill="#1b2540" />
      </svg>
      <input type="range" min={10} max={170} step={snap} value={a} onChange={(e) => { setA(Number(e.target.value)); setReveal(false); }} className="mt-3 w-full accent-teal-600" aria-label="angle" />
      {quiz ? <div className="mt-2 text-center">{reveal ? <p className="font-display text-lg font-bold text-navy-900">{a}° + {other}° = 180°</p> : <Button size="sm" variant="outline" onClick={() => setReveal(true)}>Reveal missing angle</Button>}</div> : <p className="mt-2 text-center font-display text-lg font-bold text-navy-900">{a}° + {other}° = 180°</p>}
    </EngineCard>
  );
}

// ==================================================================
// 13. RATIO
// ==================================================================
function RatioEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [maxParts, setMaxParts] = useState(p.raParts ?? 6);
  const [maxScale, setMaxScale] = useState(p.raScale ?? 4);
  const [showProp, setShowProp] = useState(true);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [k, setK] = useState(2);
  useEffect(() => { setA((x) => Math.min(x, maxParts)); setB((x) => Math.min(x, maxParts)); setK((x) => Math.min(x, maxScale)); }, [maxParts, maxScale]);
  const whole = a + b;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(2); setB(3); setK(1); }}
      settings={<>
        <SettingRow label="Largest part"><Segmented value={maxParts} onChange={setMaxParts} options={[{ label: "4", value: 4 }, { label: "6", value: 6 }, { label: "8", value: 8 }]} /></SettingRow>
        <SettingRow label="Largest scale"><Segmented value={maxScale} onChange={setMaxScale} options={[{ label: "×3", value: 3 }, { label: "×4", value: 4 }, { label: "×6", value: 6 }]} /></SettingRow>
        <SettingRow label="Show proportion"><Toggle checked={showProp} onChange={setShowProp} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Set a ratio, then scale it up. The ratio stays equivalent."}</Intro>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4 sm:grid-cols-3">
        <Stepper label="Part A" value={a} set={setA} min={1} max={maxParts} /><Stepper label="Part B" value={b} set={setB} min={1} max={maxParts} /><Stepper label="Scale ×" value={k} set={setK} min={1} max={maxScale} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 overflow-x-auto rounded-2xl bg-surface-soft p-4">
        <div className="flex flex-wrap gap-1.5">{Array.from({ length: a * k }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-teal-500" />)}</div>
        <span className="font-display text-2xl font-bold text-navy-300">:</span>
        <div className="flex flex-wrap gap-1.5">{Array.from({ length: b * k }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-accent-400" />)}</div>
      </div>
      <div className="mt-4 text-center"><p className="font-display text-2xl font-bold text-navy-900">{a * k} : {b * k} <span className="text-base font-medium text-navy-400">= {a} : {b}</span></p>{showProp && <p className="mt-1 flex items-center justify-center gap-1 text-xs text-navy-500">Part A is <Frac n={a} d={whole} /> of the whole (proportion).</p>}</div>
    </EngineCard>
  );
}

// ==================================================================
// 14. ORDER OF OPERATIONS
// ==================================================================
type Tok = [number, string, number, string, number];
const OO_LEVELS: Record<string, Tok> = { easy: [2, "+", 3, "×", 4], medium: [10, "−", 2, "×", 3], hard: [6, "+", 12, "÷", 3] };
function ooCalc(a: number, op: string, b: number): number { return op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b; }
function ooFlat([n1, op1, n2, op2, n3]: Tok): number { const nums = [n1, n2, n3]; const ops = [op1, op2]; for (let i = 0; i < ops.length;) { if (ops[i] === "×" || ops[i] === "÷") { nums.splice(i, 2, ooCalc(nums[i], ops[i], nums[i + 1])); ops.splice(i, 1); } else i++; } return ops.reduce((acc, op, i) => ooCalc(acc, op, nums[i + 1]), nums[0]); }
function OrderOpsEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [level, setLevel] = useState<"easy" | "medium" | "hard">(p.ooLevel ?? "easy");
  const [choice, setChoice] = useState<"none" | "left" | "right">("none");
  const [n1, op1, n2, op2, n3] = OO_LEVELS[level];
  const results = { none: ooFlat(OO_LEVELS[level]), left: ooCalc(ooCalc(n1, op1, n2), op2, n3), right: ooCalc(n1, op1, ooCalc(n2, op2, n3)) };
  const expr = { none: `${n1} ${op1} ${n2} ${op2} ${n3}`, left: `(${n1} ${op1} ${n2}) ${op2} ${n3}`, right: `${n1} ${op1} (${n2} ${op2} ${n3})` };
  const explain = { none: "No brackets — do × and ÷ before + and −.", left: "Brackets first, then the remaining operation.", right: "Brackets round the second pair before the first operation." };
  const fmt = (x: number) => (Number.isInteger(x) ? `${x}` : x.toFixed(1));
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setChoice("none")}
      settings={<SettingRow label="Level"><Segmented value={level} onChange={(v) => { setLevel(v); setChoice("none"); }} options={[{ label: "Easy", value: "easy" }, { label: "Medium", value: "medium" }, { label: "Hard", value: "hard" }]} /></SettingRow>}
    >
      <Intro>{p.intro ?? "Choose where to put brackets and watch the answer change."}</Intro>
      <div className="mb-4 flex flex-wrap justify-center gap-2">{(["none", "left", "right"] as const).map((c) => <button key={c} onClick={() => setChoice(c)} className={cn("rounded-xl border-2 px-4 py-2 font-display text-lg font-bold transition-colors", choice === c ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-700 hover:bg-navy-50")}>{expr[c]}</button>)}</div>
      <div className="rounded-2xl bg-surface-soft p-6 text-center"><p className="font-display text-3xl font-bold text-navy-900">{expr[choice]} = {fmt(results[choice])}</p><p className="mt-2 text-sm text-navy-500">{explain[choice]}</p></div>
    </EngineCard>
  );
}

// ==================================================================
// 15. SHAPE SORT
// ==================================================================
const SORT_SHAPES = [
  { name: "Circle", curved: true, sides: 0 }, { name: "Square", curved: false, sides: 4 }, { name: "Triangle", curved: false, sides: 3 }, { name: "Oval", curved: true, sides: 0 },
  { name: "Pentagon", curved: false, sides: 5 }, { name: "Rectangle", curved: false, sides: 4 }, { name: "Hexagon", curved: false, sides: 6 }, { name: "Semicircle", curved: true, sides: 1 },
];
function ShapeSortEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [rule, setRule] = useState<"sides" | "count">(p.ssRule ?? "sides");
  const [count, setCount] = useState(6);
  const [bins, setBins] = useState<Record<string, string | null>>({});
  useEffect(() => { setBins({}); }, [rule, count]);
  const shapes = SORT_SHAPES.slice(0, count);
  const order = rule === "sides" ? ["curved", "straight"] : ["3 sides", "4 sides", "other"];
  const want = (s: typeof SORT_SHAPES[number]) => rule === "sides" ? (s.curved ? "curved" : "straight") : (s.sides === 3 ? "3 sides" : s.sides === 4 ? "4 sides" : "other");
  const cycle = (n: string) => setBins((b) => { const cur = b[n]; const i = cur ? order.indexOf(cur) : -1; const next = i + 1 >= order.length ? null : order[i + 1]; return { ...b, [n]: next }; });
  const allPlaced = shapes.every((s) => bins[s.name]);
  const allCorrect = shapes.every((s) => bins[s.name] === want(s));
  const tone = (bin: string | null | undefined) => bin === order[0] ? "border-teal-500 bg-teal-50 text-teal-700" : bin === order[1] ? "border-accent-500 bg-accent-50 text-accent-700" : bin === order[2] ? "border-purple-400 bg-purple-50 text-purple-700" : "border-navy-200 text-navy-700 hover:bg-navy-50";
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setBins({})}
      settings={<>
        <SettingRow label="Sort by"><Segmented value={rule} onChange={setRule} options={[{ label: "Curved / straight", value: "sides" }, { label: "Number of sides", value: "count" }]} /></SettingRow>
        <SettingRow label="How many shapes"><Segmented value={count} onChange={setCount} options={[{ label: "4", value: 4 }, { label: "6", value: 6 }, { label: "8", value: 8 }]} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Tap each shape to sort it into a group."}</Intro>
      <p className="mb-3 text-center text-xs text-navy-400">Groups: {order.join(" · ")}</p>
      <div className="flex flex-wrap justify-center gap-2">{shapes.map((s) => <button key={s.name} onClick={() => cycle(s.name)} className={cn("rounded-xl border-2 px-4 py-3 font-semibold transition-colors", tone(bins[s.name]))}>{s.name}{bins[s.name] && <span className="ml-1 text-xs">({bins[s.name]})</span>}</button>)}</div>
      {allPlaced && <p className="mt-4 text-center text-sm font-semibold">{allCorrect ? <span className="text-emerald-600">✓ All sorted correctly!</span> : <span className="text-amber-600">Not quite — check your groups and try again.</span>}</p>}
    </EngineCard>
  );
}

// ==================================================================
// 16. COMPARE (more / fewer) — Early Years
// ==================================================================
function CompareEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [maxN, setMaxN] = useState(p.cmMaxN ?? 10);
  const [showMatch, setShowMatch] = useState(true);
  const [a, setA] = useState(Math.min(4, p.cmMaxN ?? 10));
  const [b, setB] = useState(Math.min(2, p.cmMaxN ?? 10));
  useEffect(() => { setA((x) => Math.min(x, maxN)); setB((x) => Math.min(x, maxN)); }, [maxN]);
  const sym = a > b ? ">" : a < b ? "<" : "=";
  const word = a > b ? "Group A has more" : a < b ? "Group A has fewer" : "The groups are equal";
  const cols = Math.max(a, b, 1), lo = Math.min(a, b);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(Math.min(4, maxN)); setB(Math.min(2, maxN)); }}
      settings={<>
        <SettingRow label="Count up to"><Segmented value={maxN} onChange={setMaxN} options={[{ label: "5", value: 5 }, { label: "10", value: 10 }]} /></SettingRow>
        <SettingRow label="Line up to match"><Toggle checked={showMatch} onChange={setShowMatch} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "Change each group and compare. Which has more?"}</Intro>
      {showMatch ? (
        <div className="flex justify-center overflow-x-auto rounded-2xl bg-surface-soft p-4">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1.75rem)` }}>
            {Array.from({ length: cols }).map((_, i) => <span key={`a${i}`} className={cn("h-6 w-6 rounded-full", i < a ? "bg-teal-500" : "bg-transparent", i >= lo && i < a && "ring-2 ring-teal-300 ring-offset-1")} />)}
            {Array.from({ length: cols }).map((_, i) => <span key={`b${i}`} className={cn("h-6 w-6 rounded-full", i < b ? "bg-accent-400" : "bg-transparent", i >= lo && i < b && "ring-2 ring-accent-300 ring-offset-1")} />)}
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl bg-surface-soft p-4">
          <div className="flex items-center gap-2"><span className="w-16 text-sm font-semibold text-teal-700">Group A</span><div className="flex flex-wrap gap-1.5">{Array.from({ length: a }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-teal-500" />)}</div></div>
          <div className="flex items-center gap-2"><span className="w-16 text-sm font-semibold text-accent-700">Group B</span><div className="flex flex-wrap gap-1.5">{Array.from({ length: b }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-accent-400" />)}</div></div>
        </div>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stepper label="Group A" value={a} set={setA} min={0} max={maxN} /><Stepper label="Group B" value={b} set={setB} min={0} max={maxN} /></div>
      <div className="mt-4 text-center"><p className="font-display text-2xl font-bold text-navy-900">{a} {sym} {b}</p><p className="text-sm font-medium text-teal-700">{word}</p></div>
    </EngineCard>
  );
}

// ==================================================================
// 17. REPEATING PATTERNS — Early Years
// ==================================================================
const P_UNITS: Record<string, number[]> = { AB: [0, 1], ABC: [0, 1, 2], AAB: [0, 0, 1], ABB: [0, 1, 1] };
function PatternToken({ kind, mode }: { kind: number; mode: string }) {
  const color = ["#14b8a6", "#f59e0b", "#6366f1"][kind];
  if (mode === "shapes") {
    if (kind === 0) return <span className="h-8 w-8 rounded-full" style={{ background: "#14b8a6" }} />;
    if (kind === 1) return <span className="h-8 w-8 rounded-md" style={{ background: "#14b8a6" }} />;
    return <span className="h-0 w-0 border-x-[16px] border-b-[28px] border-x-transparent" style={{ borderBottomColor: "#14b8a6" }} />;
  }
  if (mode === "sizes") { const s = [14, 22, 32][kind]; return <span className="rounded-full" style={{ width: s, height: s, background: "#14b8a6" }} />; }
  return <span className="h-8 w-8 rounded-full" style={{ background: color }} />;
}
function PatternEngine({ resource }: { resource: Resource }) {
  const p = simPreset(resource.id);
  const [unitKey, setUnitKey] = useState(p.ptUnit ?? "AB");
  const [mode, setMode] = useState(p.ptMode ?? "colours");
  const unit = P_UNITS[unitKey];
  const total = unit.length * 3;
  const full = Array.from({ length: total }, (_, i) => unit[i % unit.length]);
  const givenCount = total - unit.length;
  const hidden = total - givenCount;
  const [filled, setFilled] = useState<number[]>([]);
  useEffect(() => { setFilled([]); }, [unitKey, mode]);
  const palette = Array.from(new Set(unit));
  const complete = filled.length === hidden;
  const correct = complete && filled.every((k, i) => k === full[givenCount + i]);
  const add = (k: number) => { if (filled.length < hidden) setFilled((f) => [...f, k]); };
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setFilled([])}
      settings={<>
        <SettingRow label="Pattern unit"><Segmented value={unitKey} onChange={setUnitKey} options={[{ label: "AB", value: "AB" }, { label: "ABC", value: "ABC" }, { label: "AAB", value: "AAB" }, { label: "ABB", value: "ABB" }]} /></SettingRow>
        <SettingRow label="Show with"><Segmented value={mode} onChange={setMode} options={[{ label: "Colours", value: "colours" }, { label: "Shapes", value: "shapes" }, { label: "Sizes", value: "sizes" }]} /></SettingRow>
      </>}
    >
      <Intro>{p.intro ?? "What comes next? Tap the palette to continue the pattern."}</Intro>
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-surface-soft p-4">
        {full.map((k, i) => { const given = i < givenCount; const sIdx = i - givenCount; const show = given || sIdx < filled.length; const kind = given ? k : filled[sIdx]; return <div key={i} className={cn("flex h-11 w-11 items-center justify-center rounded-lg", given ? "" : "border-2 border-dashed border-navy-200 bg-white")}>{show ? <PatternToken kind={kind} mode={mode} /> : <span className="text-lg font-bold text-navy-300">?</span>}</div>; })}
      </div>
      <div className="mt-4 flex justify-center gap-3">{palette.map((k) => <button key={k} onClick={() => add(k)} disabled={complete} className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-navy-200 hover:border-teal-400 disabled:opacity-40" aria-label={`Add item ${k + 1}`}><PatternToken kind={k} mode={mode} /></button>)}</div>
      {complete && <p className="mt-4 text-center text-sm font-semibold">{correct ? <span className="text-emerald-600">✓ Pattern complete — well done!</span> : <span className="text-amber-600">Look at the repeating part again and try Reset.</span>}</p>}
    </EngineCard>
  );
}
