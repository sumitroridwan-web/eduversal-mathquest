"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Lightbulb, Play, Check, X, Settings2 } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToasts } from "@/stores/ui";
import { cn, clamp } from "@/lib/utils";

// ==========================================================
// Bespoke interactive engines for MathQuest simulations.
// Every engine exposes an "Options" panel so the simulation
// adapts (range, size, model, precision, difficulty, …).
// SimulationEngine() dispatches to the right one per resource.
// ==========================================================

export function SimulationEngine({ resource }: { resource: Resource }) {
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
    case "equivalent": return <FractionBarsEngine resource={resource} />;
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

function EngineCard({
  hint, onReset, settings, children,
}: {
  hint?: string;
  onReset?: () => void;
  settings?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Badge tone="teal">Interactive simulation</Badge>
        <div className="flex gap-2">
          {settings && (
            <Button variant="outline" size="sm" onClick={() => setShowSettings((v) => !v)} aria-expanded={showSettings}>
              <Settings2 className="h-4 w-4" /> Options
            </Button>
          )}
          {hint && (
            <Button variant="outline" size="sm" onClick={() => setShowHint((v) => !v)}>
              <Lightbulb className="h-4 w-4" /> Hint
            </Button>
          )}
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
      </div>
      {showSettings && settings && (
        <div className="mb-4 space-y-2.5 rounded-xl border border-navy-100 bg-surface-soft p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Simulation options</p>
          {settings}
        </div>
      )}
      {children}
      {showHint && hint && (
        <p className="mt-4 rounded-xl bg-accent-50 p-3 text-sm text-navy-700">💡 {hint}</p>
      )}
    </div>
  );
}

function Stepper({
  label, value, set, min, max, step = 1,
}: {
  label: string; value: number; set: (n: number) => void; min: number; max: number; step?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 text-sm font-medium text-navy-600">{label}</span>
      <button onClick={() => set(clamp(value - step, min, max))} disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-lg font-bold text-navy-700 hover:bg-navy-50 disabled:opacity-40" aria-label={`Decrease ${label}`}>−</button>
      <span className="w-10 text-center font-display text-lg font-bold text-navy-900 tabular-nums">{value}</span>
      <button onClick={() => set(clamp(value + step, min, max))} disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-lg font-bold text-navy-700 hover:bg-navy-50 disabled:opacity-40" aria-label={`Increase ${label}`}>+</button>
    </div>
  );
}

function Segmented<T extends string | number>({
  options, value, onChange,
}: {
  options: { label: string; value: T }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-0.5 rounded-lg bg-surface-muted p-0.5">
      {options.map((o) => (
        <button key={String(o.value)} onClick={() => onChange(o.value)}
          className={cn("rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            o.value === value ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-800")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", checked ? "bg-teal-500" : "bg-navy-200")}>
      <span className={cn("absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform", checked && "translate-x-4")} />
    </button>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xs font-medium text-navy-600">{label}</span>
      {children}
    </div>
  );
}

// ---------------- 1. Ten frame ----------------
function TenFrameEngine({ resource }: { resource: Resource }) {
  const [frames, setFrames] = useState(1);
  const [showBond, setShowBond] = useState(true);
  const total = frames * 10;
  const [count, setCount] = useState(4);
  useEffect(() => { setCount((c) => Math.min(c, total)); }, [total]);
  const cells = Array.from({ length: total }, (_, i) => i < count);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setCount(0)}
      settings={<>
        <SettingRow label="Frame size">
          <Segmented value={frames} onChange={setFrames} options={[{ label: "Ten (0–10)", value: 1 }, { label: "Twenty (0–20)", value: 2 }]} />
        </SettingRow>
        <SettingRow label="Show number bond"><Toggle checked={showBond} onChange={setShowBond} /></SettingRow>
      </>}
    >
      <p className="mb-4 text-sm text-navy-600">Tap the frame to add or remove counters. How many more make {total}?</p>
      <div className="mx-auto grid w-fit grid-cols-5 gap-2 rounded-2xl bg-surface-soft p-4">
        {cells.map((f, i) => (
          <button key={i} onClick={() => setCount(f ? i : i + 1)}
            className={cn("flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-colors",
              f ? "border-teal-500 bg-teal-500" : "border-navy-200 bg-white hover:bg-teal-50")}
            aria-label={`Counter ${i + 1} ${f ? "filled" : "empty"}`}>
            {f && <span className="h-5 w-5 rounded-full bg-white/90" />}
          </button>
        ))}
      </div>
      {showBond && (
        <div className="mt-5 flex items-center justify-center gap-6 text-center">
          <div><p className="font-display text-3xl font-bold text-navy-900">{count}</p><p className="text-xs text-navy-400">counters</p></div>
          <span className="text-navy-300">+</span>
          <div><p className="font-display text-3xl font-bold text-teal-600">{total - count}</p><p className="text-xs text-navy-400">makes {total}</p></div>
        </div>
      )}
    </EngineCard>
  );
}

// ---------------- 1b. Hundred square ----------------
function HundredSquareEngine({ resource }: { resource: Resource }) {
  const [step, setStep] = useState(5);
  const [maxN, setMaxN] = useState(100);
  const [showOddEven, setShowOddEven] = useState(false);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setStep(5); setShowOddEven(false); }}
      settings={<>
        <SettingRow label="Grid size">
          <Segmented value={maxN} onChange={setMaxN} options={[{ label: "1–50", value: 50 }, { label: "1–100", value: 100 }]} />
        </SettingRow>
        <SettingRow label="Highlight odd / even"><Toggle checked={showOddEven} onChange={setShowOddEven} /></SettingRow>
      </>}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-navy-600">Count in:</span>
        {[2, 3, 5, 10].map((s) => (
          <button key={s} onClick={() => setStep(s)}
            className={cn("h-8 w-9 rounded-lg border text-sm font-semibold", step === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-600 hover:bg-navy-50")}>{s}</button>
        ))}
      </div>
      <div className="mx-auto grid w-fit grid-cols-10 gap-0.5 rounded-xl bg-surface-soft p-2">
        {Array.from({ length: maxN }, (_, i) => i + 1).map((n) => {
          const multiple = n % step === 0, odd = n % 2 === 1;
          return (
            <span key={n} className={cn("flex h-7 w-7 items-center justify-center rounded text-[10px] font-semibold",
              multiple ? "bg-teal-500 text-white" : showOddEven ? (odd ? "bg-accent-50 text-accent-700" : "bg-navy-50 text-navy-600") : "bg-white text-navy-500")}>{n}</span>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-navy-500">Teal squares are multiples of <span className="font-bold text-teal-700">{step}</span>. What pattern do you notice?</p>
    </EngineCard>
  );
}

// ---------------- 2. Number line ----------------
const NL_RANGES: Record<string, [number, number]> = { "0-10": [0, 10], "0-20": [0, 20], "0-100": [0, 100], "-10-10": [-10, 10] };
function NumberLineEngine({ resource }: { resource: Resource }) {
  const negative = /negative/i.test(resource.id + resource.title);
  const [rangeKey, setRangeKey] = useState(negative ? "-10-10" : "0-20");
  const [showLabels, setShowLabels] = useState(true);
  const [min, max] = NL_RANGES[rangeKey];
  const [value, setValue] = useState(negative ? 0 : 4);
  const [step, setStep] = useState(2);
  useEffect(() => { setValue((v) => clamp(v, min, max)); }, [min, max]);
  const W = 320, pad = 16;
  const span = max - min;
  const toX = (v: number) => pad + ((v - min) / span) * (W - 2 * pad);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setValue(clamp(0, min, max))}
      settings={<>
        <SettingRow label="Range">
          <Segmented value={rangeKey} onChange={setRangeKey} options={[
            { label: "0–10", value: "0-10" }, { label: "0–20", value: "0-20" },
            { label: "0–100", value: "0-100" }, { label: "−10–10", value: "-10-10" },
          ]} />
        </SettingRow>
        <SettingRow label="Show all labels"><Toggle checked={showLabels} onChange={setShowLabels} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Tap the line or jump in steps. Watch the value change.</p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} 90`} className="mx-auto block w-full min-w-[300px]"
          onClick={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            setValue(clamp(Math.round(min + ((e.clientX - r.left) / r.width) * span), min, max));
          }}>
          <line x1={pad} y1={54} x2={W - pad} y2={54} stroke="#31415f" strokeWidth={2.5} strokeLinecap="round" />
          {Array.from({ length: span + 1 }, (_, i) => min + i).map((v) => {
            const label = showLabels ? (span <= 20 || v % 10 === 0) : v % 10 === 0;
            return (
              <g key={v}>
                <line x1={toX(v)} y1={48} x2={toX(v)} y2={60} stroke="#98a8c6" strokeWidth={2} strokeLinecap="round" />
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
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => clamp(v - step, min, max))}>− {step}</Button>
        <div className="flex items-center gap-1 text-xs text-navy-500">step
          {[1, 2, 5, 10].map((s) => (
            <button key={s} onClick={() => setStep(s)} className={cn("h-7 w-7 rounded-lg border text-sm font-semibold", step === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-600")}>{s}</button>
          ))}
        </div>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => clamp(v + step, min, max))}>+ {step}</Button>
      </div>
    </EngineCard>
  );
}

// ---------------- 3. Place value blocks ----------------
function PlaceValueEngine({ resource }: { resource: Resource }) {
  const notify = useToasts((s) => s.notify);
  const [places, setPlaces] = useState<"to" | "hto" | "thhto">("hto");
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
    notify({ variant: "success", title: "Regrouped!", description: "Ten of one place exchanged for one of the next." });
  };

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setTh(0); setH(0); setT(0); setO(0); }}
      settings={<>
        <SettingRow label="Largest place">
          <Segmented value={places} onChange={setPlaces} options={[
            { label: "Tens", value: "to" }, { label: "Hundreds", value: "hto" }, { label: "Thousands", value: "thhto" },
          ]} />
        </SettingRow>
        <SettingRow label="Show partition"><Toggle checked={showPartition} onChange={setShowPartition} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Build a number with the place-value columns. Try regrouping.</p>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4">
        {showTh && <Stepper label="Thousands" value={th} set={setTh} min={0} max={9} />}
        {showH && <Stepper label="Hundreds" value={h} set={setH} min={0} max={9} />}
        <Stepper label="Tens" value={t} set={setT} min={0} max={19} />
        <Stepper label="Ones" value={o} set={setO} min={0} max={19} />
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-2xl bg-surface-soft p-4">
        {showTh && th > 0 && (
          <div className="flex items-center gap-1 rounded-lg bg-navy-800 px-2 py-1 text-xs font-bold text-white">▣ × {th}</div>
        )}
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: h }).map((_, i) => (
            <div key={i} className="grid h-12 w-12 grid-cols-5 grid-rows-5 gap-px rounded bg-navy-600 p-0.5">
              {Array.from({ length: 25 }).map((__, j) => <span key={j} className="bg-navy-400" />)}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: t }).map((_, i) => (
            <div key={i} className="flex h-12 w-3 flex-col gap-px rounded bg-teal-600 p-0.5">
              {Array.from({ length: 10 }).map((__, j) => <span key={j} className="flex-1 bg-teal-400" />)}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1" style={{ maxWidth: 120 }}>
          {Array.from({ length: o }).map((_, i) => <span key={i} className="h-3 w-3 rounded-sm bg-accent-400 ring-1 ring-accent-600" />)}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {showPartition ? (
          <p className="font-display text-sm text-navy-500">
            {showTh ? `${th * 1000} + ` : ""}{showH ? `${h * 100} + ` : ""}{t * 10} + {o} = <span className="text-2xl font-bold text-navy-900">{total}</span>
          </p>
        ) : <p className="font-display text-2xl font-bold text-navy-900">{total}</p>}
        <Button size="sm" variant="secondary" onClick={regroup}>Regroup</Button>
      </div>
    </EngineCard>
  );
}

// ---------------- 4. Array ----------------
function ArrayEngine({ resource }: { resource: Resource }) {
  const [maxSize, setMaxSize] = useState(10);
  const [showAdd, setShowAdd] = useState(true);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  useEffect(() => { setRows((r) => Math.min(r, maxSize)); setCols((c) => Math.min(c, maxSize)); }, [maxSize]);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setRows(3); setCols(4); }}
      settings={<>
        <SettingRow label="Largest factor">
          <Segmented value={maxSize} onChange={setMaxSize} options={[{ label: "5", value: 5 }, { label: "10", value: 10 }, { label: "12", value: 12 }]} />
        </SettingRow>
        <SettingRow label="Show repeated addition"><Toggle checked={showAdd} onChange={setShowAdd} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Change the rows and columns to build an array.</p>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4 sm:grid-cols-2">
        <Stepper label="Rows" value={rows} set={setRows} min={1} max={maxSize} />
        <Stepper label="Columns" value={cols} set={setCols} min={1} max={maxSize} />
      </div>
      <div className="flex justify-center overflow-x-auto rounded-2xl bg-surface-soft p-5">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, i) => <span key={i} className="h-5 w-5 rounded-full bg-teal-500" />)}
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="font-display text-2xl font-bold text-navy-900">{rows} × {cols} = {rows * cols}</p>
        {showAdd && <p className="mt-1 text-xs text-navy-500">{Array.from({ length: rows }).map(() => cols).join(" + ")} = {rows * cols}</p>}
      </div>
    </EngineCard>
  );
}

// ---------------- 5. Fraction bars / circles ----------------
function FractionCircle({ n, d, color }: { n: number; d: number; color: string }) {
  const cx = 42, cy = 42, r = 38;
  return (
    <svg viewBox="0 0 84 84" className="h-24 w-24">
      {Array.from({ length: d }).map((_, i) => {
        const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
        const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
        const [x0, y0] = p(a0), [x1, y1] = p(a1);
        const large = a1 - a0 > Math.PI ? 1 : 0;
        return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={i < n ? color : "#fff"} stroke="#c1cbde" strokeWidth={1} />;
      })}
    </svg>
  );
}
function FractionBarsEngine({ resource }: { resource: Resource }) {
  const [model, setModel] = useState<"bars" | "circles">("bars");
  const [maxDen, setMaxDen] = useState(12);
  const [showPercent, setShowPercent] = useState(true);
  const [n1, setN1] = useState(1); const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(2); const [d2, setD2] = useState(3);
  useEffect(() => {
    setD1((d) => Math.min(d, maxDen)); setD2((d) => Math.min(d, maxDen));
    setN1((n) => Math.min(n, d1)); setN2((n) => Math.min(n, d2));
  }, [maxDen, d1, d2]);
  const v1 = n1 / d1, v2 = n2 / d2;
  const sym = v1 > v2 ? ">" : v1 < v2 ? "<" : "=";

  const Bar = ({ n, d, tone }: { n: number; d: number; tone: string }) => (
    <div className="flex overflow-hidden rounded-xl border-2 border-navy-200">
      {Array.from({ length: d }).map((_, i) => <div key={i} className={cn("h-10 flex-1 border-r border-white/70 last:border-r-0", i < n ? tone : "bg-white")} />)}
    </div>
  );

  const Row = ({ n, d, setN, setD, tone, color }: { n: number; d: number; setN: (x: number) => void; setD: (x: number) => void; tone: string; color: string }) => (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <span className="font-display text-lg font-bold" style={{ color }}>{n}/{d}</span>
        {showPercent && <span className="text-xs text-navy-400">= {Math.round((n / d) * 100)}%</span>}
      </div>
      {model === "bars" ? <Bar n={n} d={d} tone={tone} /> : <FractionCircle n={n} d={d} color={color} />}
      <div className="mt-2 flex flex-wrap gap-4">
        <Stepper label="Numerator" value={n} set={(x) => setN(clamp(x, 0, d))} min={0} max={d} />
        <Stepper label="Denominator" value={d} set={(x) => { setD(x); setN(Math.min(n, x)); }} min={1} max={maxDen} />
      </div>
    </div>
  );

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setN1(1); setD1(2); setN2(2); setD2(3); }}
      settings={<>
        <SettingRow label="Model">
          <Segmented value={model} onChange={setModel} options={[{ label: "Bars", value: "bars" }, { label: "Circles", value: "circles" }]} />
        </SettingRow>
        <SettingRow label="Largest denominator">
          <Segmented value={maxDen} onChange={setMaxDen} options={[{ label: "6", value: 6 }, { label: "10", value: 10 }, { label: "12", value: 12 }]} />
        </SettingRow>
        <SettingRow label="Show percentage"><Toggle checked={showPercent} onChange={setShowPercent} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Change each fraction and compare.</p>
      <div className="space-y-4">
        <Row n={n1} d={d1} setN={setN1} setD={setD1} tone="bg-teal-500" color="#14b8a6" />
        <div className="text-center font-display text-3xl font-bold text-navy-900">{sym}</div>
        <Row n={n2} d={d2} setN={setN2} setD={setD2} tone="bg-accent-400" color="#f59e0b" />
      </div>
    </EngineCard>
  );
}

// ---------------- 6. Clock ----------------
function ClockEngine({ resource }: { resource: Resource }) {
  const oClockDefault = /s1-clock/.test(resource.id) || resource.programme === "early-years";
  const [precision, setPrecision] = useState(oClockDefault ? 30 : 5);
  const [showWords, setShowWords] = useState(true);
  const [hour, setHour] = useState(3);
  const [min, setMin] = useState(0);
  useEffect(() => { setMin((m) => (Math.round(m / precision) * precision) % 60); }, [precision]);
  const cx = 90, cy = 90, r = 78;
  const minAngle = (min * 6 - 90) * (Math.PI / 180);
  const hourAngle = (((hour % 12) * 30 + min * 0.5) - 90) * (Math.PI / 180);

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
        <SettingRow label="Precision">
          <Segmented value={precision} onChange={setPrecision} options={[
            { label: "o'clock / half", value: 30 }, { label: "quarters", value: 15 }, { label: "5 min", value: 5 }, { label: "1 min", value: 1 },
          ]} />
        </SettingRow>
        <SettingRow label="Read time in words"><Toggle checked={showWords} onChange={setShowWords} /></SettingRow>
      </>}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <svg viewBox="0 0 180 180" className="h-44 w-44">
          <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#31415f" strokeWidth={3} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180);
            return <text key={i} x={cx + (r - 14) * Math.cos(a)} y={cy + (r - 14) * Math.sin(a) + 4} fontSize={12} textAnchor="middle" fill="#6a80a9" fontWeight={700}>{i === 0 ? 12 : i}</text>;
          })}
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

// ---------------- 7. Coordinate grid ----------------
function CoordinateEngine({ resource }: { resource: Resource }) {
  const fourDefault = /four-quadrant/.test(resource.id);
  const [quad, setQuad] = useState(fourDefault ? 4 : 1);
  const [gridMax, setGridMax] = useState(fourDefault ? 5 : 6);
  const [connect, setConnect] = useState(true);
  const [pts, setPts] = useState<[number, number][]>([]);
  useEffect(() => { setPts([]); }, [quad, gridMax]);
  const lo = quad === 4 ? -gridMax : 0, hi = gridMax;
  const size = 260, pad = 24, span = hi - lo;
  const toX = (x: number) => pad + ((x - lo) / span) * (size - 2 * pad);
  const toY = (y: number) => size - pad - ((y - lo) / span) * (size - 2 * pad);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setPts([])}
      settings={<>
        <SettingRow label="Quadrants">
          <Segmented value={quad} onChange={setQuad} options={[{ label: "First only", value: 1 }, { label: "All four", value: 4 }]} />
        </SettingRow>
        <SettingRow label="Grid size">
          <Segmented value={gridMax} onChange={setGridMax} options={[{ label: "5", value: 5 }, { label: "6", value: 6 }, { label: "10", value: 10 }]} />
        </SettingRow>
        <SettingRow label="Connect points"><Toggle checked={connect} onChange={setConnect} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Tap the grid to plot points {quad === 4 ? "in any quadrant" : "in the first quadrant"}.</p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-64 w-64 rounded-xl bg-surface-soft"
          onClick={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const gx = Math.round(lo + (((e.clientX - r.left) / r.width) * size - pad) / (size - 2 * pad) * span);
            const gy = Math.round(lo + (size - pad - ((e.clientY - r.top) / r.height) * size) / (size - 2 * pad) * span);
            if (gx >= lo && gx <= hi && gy >= lo && gy <= hi) setPts((p) => [...p, [gx, gy]]);
          }}>
          {Array.from({ length: span + 1 }, (_, i) => lo + i).map((v) => (
            <g key={v} stroke="#dfe4ee" strokeWidth={1}>
              <line x1={toX(v)} y1={toY(lo)} x2={toX(v)} y2={toY(hi)} />
              <line x1={toX(lo)} y1={toY(v)} x2={toX(hi)} y2={toY(v)} />
            </g>
          ))}
          <line x1={toX(lo)} y1={toY(0)} x2={toX(hi)} y2={toY(0)} stroke="#98a8c6" strokeWidth={2} />
          <line x1={toX(0)} y1={toY(lo)} x2={toX(0)} y2={toY(hi)} stroke="#98a8c6" strokeWidth={2} />
          {connect && pts.length > 1 && <polyline points={pts.map(([x, y]) => `${toX(x)},${toY(y)}`).join(" ")} fill="none" stroke="#199473" strokeWidth={2} />}
          {pts.map(([x, y], i) => <circle key={i} cx={toX(x)} cy={toY(y)} r={5} fill="#f59e0b" stroke="#fff" strokeWidth={2} />)}
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-navy-600">Plotted points</p>
          <div className="mt-2 flex max-w-[160px] flex-wrap justify-center gap-1.5">
            {pts.length === 0 ? <span className="text-xs text-navy-400">Tap the grid…</span> : pts.map(([x, y], i) => <Badge key={i} tone="navy">({x}, {y})</Badge>)}
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 8. Bar chart + statistics ----------------
function BarChartEngine({ resource }: { resource: Resource }) {
  const statsDefault = /mode|median|average/i.test(resource.id + resource.title);
  const [cats, setCats] = useState(5);
  const [maxValue, setMaxValue] = useState(10);
  const [showStats, setShowStats] = useState(statsDefault);
  const [data, setData] = useState([3, 5, 2, 6, 4, 3]);
  useEffect(() => {
    setData((d) => { const nd = [...d]; while (nd.length < cats) nd.push(3); return nd.slice(0, cats); });
  }, [cats]);
  const labels = ["A", "B", "C", "D", "E", "F"];
  const view = data.slice(0, cats);
  const maxV = Math.max(...view, 1);

  const mean = view.reduce((a, b) => a + b, 0) / view.length;
  const sorted = [...view].sort((a, b) => a - b);
  const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const counts: Record<number, number> = {};
  view.forEach((v) => { counts[v] = (counts[v] ?? 0) + 1; });
  const mode = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  const range = Math.max(...view) - Math.min(...view);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setData([3, 5, 2, 6, 4, 3])}
      settings={<>
        <SettingRow label="Categories">
          <Segmented value={cats} onChange={setCats} options={[{ label: "3", value: 3 }, { label: "4", value: 4 }, { label: "5", value: 5 }, { label: "6", value: 6 }]} />
        </SettingRow>
        <SettingRow label="Scale">
          <Segmented value={maxValue} onChange={setMaxValue} options={[{ label: "0–10", value: 10 }, { label: "0–20", value: 20 }]} />
        </SettingRow>
        <SettingRow label="Show averages"><Toggle checked={showStats} onChange={setShowStats} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Use the buttons to change the bars.</p>
      <div className="flex items-end justify-center gap-4 overflow-x-auto rounded-2xl bg-surface-soft p-4" style={{ height: 180 }}>
        {view.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-navy-500">{v}</span>
            <div className="w-9 rounded-t-lg bg-teal-500 transition-all" style={{ height: `${(v / Math.max(maxV, maxValue)) * 120}px` }} />
            <span className="text-xs font-medium text-navy-600">{labels[i]}</span>
            <div className="flex gap-0.5">
              <button onClick={() => setData((d) => d.map((x, j) => j === i ? clamp(x - 1, 0, maxValue) : x))} className="h-6 w-6 rounded border border-navy-200 text-sm font-bold text-navy-600 hover:bg-navy-50">−</button>
              <button onClick={() => setData((d) => d.map((x, j) => j === i ? clamp(x + 1, 0, maxValue) : x))} className="h-6 w-6 rounded border border-navy-200 text-sm font-bold text-navy-600 hover:bg-navy-50">+</button>
            </div>
          </div>
        ))}
      </div>
      {showStats && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[["Mean", mean.toFixed(1)], ["Median", `${median}`], ["Mode", `${mode}`], ["Range", `${range}`]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-surface-soft p-3 text-center">
              <p className="font-display text-xl font-bold text-navy-900">{v}</p><p className="text-xs text-navy-400">{k}</p>
            </div>
          ))}
        </div>
      )}
    </EngineCard>
  );
}

// ---------------- 9. Probability spinner ----------------
const SPIN_COLORS = [
  { hex: "#14b8a6" }, { hex: "#f59e0b" }, { hex: "#6366f1" },
  { hex: "#f43f5e" }, { hex: "#22c55e" }, { hex: "#a855f7" },
];
function SpinnerEngine({ resource }: { resource: Resource }) {
  const [sectors, setSectors] = useState(4);
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [counts, setCounts] = useState<number[]>(Array(4).fill(0));
  useEffect(() => { setCounts(Array(sectors).fill(0)); setRot(0); }, [sectors]);
  const total = counts.reduce((a, b) => a + b, 0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * sectors);
    const target = 360 * 4 + (360 - (idx * (360 / sectors) + 360 / sectors / 2));
    setRot((r) => r + target);
    window.setTimeout(() => { setCounts((c) => c.map((x, i) => (i === idx ? x + 1 : x))); setSpinning(false); }, 1600);
  };

  const cx = 90, cy = 90, r = 80;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setCounts(Array(sectors).fill(0))}
      settings={<SettingRow label="Number of sectors">
        <Segmented value={sectors} onChange={setSectors} options={[{ label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 }, { label: "6", value: 6 }]} />
      </SettingRow>}
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
        <div className="relative">
          <svg viewBox="0 0 180 180" className="h-44 w-44" style={{ transform: `rotate(${rot}deg)`, transition: "transform 1.6s cubic-bezier(.2,.8,.2,1)" }}>
            {SPIN_COLORS.slice(0, sectors).map((c, i) => {
              const a0 = (i * (360 / sectors) - 90) * (Math.PI / 180), a1 = ((i + 1) * (360 / sectors) - 90) * (Math.PI / 180);
              const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
              const [x0, y0] = p(a0), [x1, y1] = p(a1);
              const large = a1 - a0 > Math.PI ? 1 : 0;
              return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={c.hex} stroke="#fff" strokeWidth={2} />;
            })}
            <circle cx={cx} cy={cy} r={7} fill="#1b2540" />
          </svg>
          <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "14px solid #1b2540" }} />
        </div>
        <div className="text-center">
          <Button onClick={spin} loading={spinning}><Play className="h-4 w-4" /> Spin</Button>
          <div className="mt-4 space-y-1.5">
            {SPIN_COLORS.slice(0, sectors).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
                <span className="w-14 text-navy-600">{counts[i]}</span>
                <span className="text-xs text-navy-400">{total ? `${Math.round((counts[i] / total) * 100)}%` : "—"}</span>
              </div>
            ))}
            <p className="pt-1 text-xs text-navy-400">Total spins: {total} · P(each) = 1/{sectors}</p>
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 10. Money ----------------
const COIN_SETS: Record<string, number[]> = { small: [1, 2, 5, 10, 20, 50], full: [1, 2, 5, 10, 20, 50, 100, 200] };
function MoneyEngine({ resource }: { resource: Resource }) {
  const notify = useToasts((s) => s.notify);
  const [maxTarget, setMaxTarget] = useState(50);
  const [coinSet, setCoinSet] = useState<"small" | "full">("small");
  const [target, setTarget] = useState(47);
  const [total, setTotal] = useState(0);
  useEffect(() => { setTarget((t) => Math.min(t, maxTarget)); }, [maxTarget]);
  const fmt = (p: number) => (p >= 100 ? `£${(p / 100).toFixed(2)}` : `${p}p`);
  const done = total === target;

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setTotal(0)}
      settings={<>
        <SettingRow label="Amounts up to">
          <Segmented value={maxTarget} onChange={setMaxTarget} options={[{ label: "20p", value: 20 }, { label: "50p", value: 50 }, { label: "£1", value: 100 }, { label: "£2", value: 200 }]} />
        </SettingRow>
        <SettingRow label="Coins available">
          <Segmented value={coinSet} onChange={setCoinSet} options={[{ label: "To 50p", value: "small" }, { label: "To £2", value: "full" }]} />
        </SettingRow>
      </>}
    >
      <div className="mb-4 rounded-2xl bg-surface-soft p-4 text-center">
        <p className="text-sm text-navy-500">Make this amount:</p>
        <p className="font-display text-3xl font-bold text-navy-900">{fmt(target)}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {COIN_SETS[coinSet].map((c) => (
          <button key={c} onClick={() => setTotal((t) => t + c)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 text-xs font-bold text-navy-900 shadow ring-2 ring-accent-600 hover:bg-accent-300">{fmt(c)}</button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg">Total: <span className={cn("font-bold", done ? "text-emerald-600" : total > target ? "text-red-600" : "text-navy-900")}>{fmt(total)}</span></p>
        <div className="flex items-center gap-2">
          {done && <Badge tone="green"><Check className="h-3.5 w-3.5" /> Exact!</Badge>}
          {total > target && <Badge tone="red"><X className="h-3.5 w-3.5" /> Too much</Badge>}
          <Button size="sm" variant="outline" onClick={() => { setTotal(0); setTarget(2 + Math.floor(Math.random() * (maxTarget - 1))); notify({ variant: "info", title: "New amount set" }); }}>New amount</Button>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 11. Symmetry ----------------
const SYM_BASE: [number, number][] = [[0, 1], [1, 0], [1, 2], [2, 1], [3, 0], [4, 2], [5, 1]];
function SymmetryEngine({ resource }: { resource: Resource }) {
  const [axis, setAxis] = useState<"vertical" | "horizontal">("vertical");
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
      settings={<SettingRow label="Mirror line">
        <Segmented value={axis} onChange={setAxis} options={[{ label: "Vertical", value: "vertical" }, { label: "Horizontal", value: "horizontal" }]} />
      </SettingRow>}
    >
      <p className="mb-3 text-sm text-navy-600">Complete the pattern so both halves match across the mirror line.</p>
      <div className="flex justify-center">
        <div className="relative grid gap-1 rounded-2xl bg-surface-soft p-3" style={{ gridTemplateColumns: `repeat(${C}, 2.25rem)` }}>
          {Array.from({ length: R }).map((_, r) => Array.from({ length: C }).map((__, c) => {
            const g = isGivenCell(r, c);
            const filled = g ? given.has(key(r, c)) : right.has(key(r, c));
            return (
              <button key={key(r, c)} onClick={() => { if (g) return; setRight((s) => { const n = new Set(s); const k = key(r, c); n.has(k) ? n.delete(k) : n.add(k); return n; }); }}
                className={cn("h-9 w-9 rounded-md border transition-colors", filled ? "bg-teal-500 border-teal-600" : "bg-white border-navy-200", g ? "cursor-default opacity-90" : "hover:bg-teal-50")}
                aria-label={`cell ${r},${c}`} />
            );
          }))}
          {axis === "vertical"
            ? <div className="pointer-events-none absolute inset-y-2 left-1/2 w-0.5 -translate-x-1/2 bg-accent-500" />
            : <div className="pointer-events-none absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 bg-accent-500" />}
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-semibold">
        {correct ? <span className="text-emerald-600">✓ Symmetrical — well done!</span> : <span className="text-navy-400">Reflect each teal square across the orange line.</span>}
      </p>
    </EngineCard>
  );
}

// ---------------- 12. Angles on a line ----------------
function AnglesEngine({ resource }: { resource: Resource }) {
  const [snap, setSnap] = useState(1);
  const [quiz, setQuiz] = useState(false);
  const [a, setA] = useState(120);
  const [reveal, setReveal] = useState(false);
  const other = 180 - a;
  const cx = 150, cy = 120, len = 110;
  const rad = (a * Math.PI) / 180;
  const ax = cx + len * Math.cos(Math.PI - rad), ay = cy - len * Math.sin(Math.PI - rad);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(120); setReveal(false); }}
      settings={<>
        <SettingRow label="Snap to">
          <Segmented value={snap} onChange={setSnap} options={[{ label: "1°", value: 1 }, { label: "5°", value: 5 }, { label: "10°", value: 10 }]} />
        </SettingRow>
        <SettingRow label="Quiz mode (hide answer)"><Toggle checked={quiz} onChange={(v) => { setQuiz(v); setReveal(false); }} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Drag the slider. The two angles on the straight line always total 180°.</p>
      <svg viewBox="0 0 300 150" className="mx-auto block w-full max-w-sm">
        <line x1={cx - len} y1={cy} x2={cx + len} y2={cy} stroke="#31415f" strokeWidth={3} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" />
        <path d={`M${cx + 28} ${cy} A28 28 0 0 0 ${cx + 28 * Math.cos(rad)} ${cy - 28 * Math.sin(rad)}`} fill="none" stroke="#199473" strokeWidth={2} />
        <text x={cx + 40} y={cy - 14} fontSize={13} fill="#199473" fontWeight={800}>{a}°</text>
        <text x={cx - 60} y={cy - 14} fontSize={13} fill="#6a80a9" fontWeight={800}>{quiz && !reveal ? "?" : `${other}°`}</text>
        <circle cx={cx} cy={cy} r={4} fill="#1b2540" />
      </svg>
      <input type="range" min={10} max={170} step={snap} value={a} onChange={(e) => { setA(Number(e.target.value)); setReveal(false); }} className="mt-3 w-full accent-teal-600" aria-label="angle" />
      {quiz ? (
        <div className="mt-2 text-center">
          {reveal
            ? <p className="font-display text-lg font-bold text-navy-900">{a}° + {other}° = 180°</p>
            : <Button size="sm" variant="outline" onClick={() => setReveal(true)}>Reveal missing angle</Button>}
        </div>
      ) : <p className="mt-2 text-center font-display text-lg font-bold text-navy-900">{a}° + {other}° = 180°</p>}
    </EngineCard>
  );
}

// ---------------- 13. Ratio ----------------
function RatioEngine({ resource }: { resource: Resource }) {
  const [maxParts, setMaxParts] = useState(6);
  const [maxScale, setMaxScale] = useState(4);
  const [showProp, setShowProp] = useState(true);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [k, setK] = useState(2);
  useEffect(() => { setA((x) => Math.min(x, maxParts)); setB((x) => Math.min(x, maxParts)); setK((x) => Math.min(x, maxScale)); }, [maxParts, maxScale]);
  const whole = a + b;

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(2); setB(3); setK(1); }}
      settings={<>
        <SettingRow label="Largest part">
          <Segmented value={maxParts} onChange={setMaxParts} options={[{ label: "4", value: 4 }, { label: "6", value: 6 }, { label: "8", value: 8 }]} />
        </SettingRow>
        <SettingRow label="Largest scale">
          <Segmented value={maxScale} onChange={setMaxScale} options={[{ label: "×3", value: 3 }, { label: "×4", value: 4 }, { label: "×6", value: 6 }]} />
        </SettingRow>
        <SettingRow label="Show proportion"><Toggle checked={showProp} onChange={setShowProp} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Set a ratio, then scale it up. The ratio stays equivalent.</p>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4 sm:grid-cols-3">
        <Stepper label="Part A" value={a} set={setA} min={1} max={maxParts} />
        <Stepper label="Part B" value={b} set={setB} min={1} max={maxParts} />
        <Stepper label="Scale ×" value={k} set={setK} min={1} max={maxScale} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 overflow-x-auto rounded-2xl bg-surface-soft p-4">
        <div className="flex flex-wrap gap-1.5">{Array.from({ length: a * k }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-teal-500" />)}</div>
        <span className="font-display text-2xl font-bold text-navy-300">:</span>
        <div className="flex flex-wrap gap-1.5">{Array.from({ length: b * k }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-accent-400" />)}</div>
      </div>
      <div className="mt-4 text-center">
        <p className="font-display text-2xl font-bold text-navy-900">{a * k} : {b * k} <span className="text-base font-medium text-navy-400">= {a} : {b}</span></p>
        {showProp && <p className="mt-1 text-xs text-navy-500">Part A is {a}/{whole} of the whole (proportion).</p>}
      </div>
    </EngineCard>
  );
}

// ---------------- 14. Order of operations ----------------
type Tok = [number, string, number, string, number];
const OO_LEVELS: Record<string, Tok> = {
  easy: [2, "+", 3, "×", 4],
  medium: [10, "−", 2, "×", 3],
  hard: [6, "+", 12, "÷", 3],
};
function ooCalc(a: number, op: string, b: number): number {
  return op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b;
}
function ooFlat([n1, op1, n2, op2, n3]: Tok): number {
  const nums = [n1, n2, n3]; const ops = [op1, op2];
  for (let i = 0; i < ops.length;) {
    if (ops[i] === "×" || ops[i] === "÷") { nums.splice(i, 2, ooCalc(nums[i], ops[i], nums[i + 1])); ops.splice(i, 1); }
    else i++;
  }
  return ops.reduce((acc, op, i) => ooCalc(acc, op, nums[i + 1]), nums[0]);
}
function OrderOpsEngine({ resource }: { resource: Resource }) {
  const [level, setLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [choice, setChoice] = useState<"none" | "left" | "right">("none");
  const [n1, op1, n2, op2, n3] = OO_LEVELS[level];
  const results = { none: ooFlat(OO_LEVELS[level]), left: ooCalc(ooCalc(n1, op1, n2), op2, n3), right: ooCalc(n1, op1, ooCalc(n2, op2, n3)) };
  const expr = { none: `${n1} ${op1} ${n2} ${op2} ${n3}`, left: `(${n1} ${op1} ${n2}) ${op2} ${n3}`, right: `${n1} ${op1} (${n2} ${op2} ${n3})` };
  const explain = {
    none: "No brackets — do × and ÷ before + and −.",
    left: "Brackets first, then the remaining operation.",
    right: "Brackets round the second pair before the first operation.",
  };
  const fmt = (x: number) => (Number.isInteger(x) ? `${x}` : x.toFixed(1));

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setChoice("none")}
      settings={<SettingRow label="Level">
        <Segmented value={level} onChange={(v) => { setLevel(v); setChoice("none"); }} options={[{ label: "Easy", value: "easy" }, { label: "Medium", value: "medium" }, { label: "Hard", value: "hard" }]} />
      </SettingRow>}
    >
      <p className="mb-3 text-sm text-navy-600">Choose where to put brackets and watch the answer change.</p>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {(["none", "left", "right"] as const).map((c) => (
          <button key={c} onClick={() => setChoice(c)}
            className={cn("rounded-xl border-2 px-4 py-2 font-display text-lg font-bold transition-colors", choice === c ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-700 hover:bg-navy-50")}>{expr[c]}</button>
        ))}
      </div>
      <div className="rounded-2xl bg-surface-soft p-6 text-center">
        <p className="font-display text-3xl font-bold text-navy-900">{expr[choice]} = {fmt(results[choice])}</p>
        <p className="mt-2 text-sm text-navy-500">{explain[choice]}</p>
      </div>
    </EngineCard>
  );
}

// ---------------- 15. Shape sort ----------------
const SORT_SHAPES = [
  { name: "Circle", curved: true, sides: 0 }, { name: "Square", curved: false, sides: 4 },
  { name: "Triangle", curved: false, sides: 3 }, { name: "Oval", curved: true, sides: 0 },
  { name: "Pentagon", curved: false, sides: 5 }, { name: "Rectangle", curved: false, sides: 4 },
  { name: "Hexagon", curved: false, sides: 6 }, { name: "Semicircle", curved: true, sides: 1 },
];
function ShapeSortEngine({ resource }: { resource: Resource }) {
  const [rule, setRule] = useState<"sides" | "count">("sides");
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
        <SettingRow label="Sort by">
          <Segmented value={rule} onChange={setRule} options={[{ label: "Curved / straight", value: "sides" }, { label: "Number of sides", value: "count" }]} />
        </SettingRow>
        <SettingRow label="How many shapes">
          <Segmented value={count} onChange={setCount} options={[{ label: "4", value: 4 }, { label: "6", value: 6 }, { label: "8", value: 8 }]} />
        </SettingRow>
      </>}
    >
      <p className="mb-4 text-sm text-navy-600">Tap each shape to sort it into: {order.map((o, i) => <span key={o} className="font-semibold">{i > 0 ? " · " : ""}{o}</span>)}.</p>
      <div className="flex flex-wrap justify-center gap-2">
        {shapes.map((s) => (
          <button key={s.name} onClick={() => cycle(s.name)} className={cn("rounded-xl border-2 px-4 py-3 font-semibold transition-colors", tone(bins[s.name]))}>
            {s.name}{bins[s.name] && <span className="ml-1 text-xs">({bins[s.name]})</span>}
          </button>
        ))}
      </div>
      {allPlaced && (
        <p className="mt-4 text-center text-sm font-semibold">
          {allCorrect ? <span className="text-emerald-600">✓ All sorted correctly!</span> : <span className="text-amber-600">Not quite — check your groups and try again.</span>}
        </p>
      )}
    </EngineCard>
  );
}

// ---------------- 16. Compare (more / fewer) — Early Years ----------------
function CompareEngine({ resource }: { resource: Resource }) {
  const [maxN, setMaxN] = useState(10);
  const [showMatch, setShowMatch] = useState(true);
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);
  useEffect(() => { setA((x) => Math.min(x, maxN)); setB((x) => Math.min(x, maxN)); }, [maxN]);
  const sym = a > b ? ">" : a < b ? "<" : "=";
  const word = a > b ? "Group A has more" : a < b ? "Group A has fewer" : "The groups are equal";
  const cols = Math.max(a, b, 1), lo = Math.min(a, b);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(5); setB(3); }}
      settings={<>
        <SettingRow label="Count up to">
          <Segmented value={maxN} onChange={setMaxN} options={[{ label: "5", value: 5 }, { label: "10", value: 10 }]} />
        </SettingRow>
        <SettingRow label="Line up to match"><Toggle checked={showMatch} onChange={setShowMatch} /></SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">Change each group and compare. Which has more?</p>
      {showMatch ? (
        <div className="flex justify-center overflow-x-auto rounded-2xl bg-surface-soft p-4">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1.75rem)` }}>
            {Array.from({ length: cols }).map((_, i) => (
              <span key={`a${i}`} className={cn("h-6 w-6 rounded-full", i < a ? "bg-teal-500" : "bg-transparent", i >= lo && i < a && "ring-2 ring-teal-300 ring-offset-1")} />
            ))}
            {Array.from({ length: cols }).map((_, i) => (
              <span key={`b${i}`} className={cn("h-6 w-6 rounded-full", i < b ? "bg-accent-400" : "bg-transparent", i >= lo && i < b && "ring-2 ring-accent-300 ring-offset-1")} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl bg-surface-soft p-4">
          <div className="flex items-center gap-2"><span className="w-16 text-sm font-semibold text-teal-700">Group A</span><div className="flex flex-wrap gap-1.5">{Array.from({ length: a }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-teal-500" />)}</div></div>
          <div className="flex items-center gap-2"><span className="w-16 text-sm font-semibold text-accent-700">Group B</span><div className="flex flex-wrap gap-1.5">{Array.from({ length: b }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-accent-400" />)}</div></div>
        </div>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Stepper label="Group A" value={a} set={setA} min={0} max={maxN} />
        <Stepper label="Group B" value={b} set={setB} min={0} max={maxN} />
      </div>
      <div className="mt-4 text-center">
        <p className="font-display text-2xl font-bold text-navy-900">{a} {sym} {b}</p>
        <p className="text-sm font-medium text-teal-700">{word}</p>
      </div>
    </EngineCard>
  );
}

// ---------------- 17. Repeating patterns — Early Years ----------------
const P_UNITS: Record<string, number[]> = { AB: [0, 1], ABC: [0, 1, 2], AAB: [0, 0, 1], ABB: [0, 1, 1] };
function PatternToken({ kind, mode }: { kind: number; mode: string }) {
  const color = ["#14b8a6", "#f59e0b", "#6366f1"][kind];
  if (mode === "shapes") {
    if (kind === 0) return <span className="h-8 w-8 rounded-full" style={{ background: "#14b8a6" }} />;
    if (kind === 1) return <span className="h-8 w-8 rounded-md" style={{ background: "#14b8a6" }} />;
    return <span className="h-0 w-0 border-x-[16px] border-b-[28px] border-x-transparent" style={{ borderBottomColor: "#14b8a6" }} />;
  }
  if (mode === "sizes") {
    const s = [14, 22, 32][kind];
    return <span className="rounded-full" style={{ width: s, height: s, background: "#14b8a6" }} />;
  }
  return <span className="h-8 w-8 rounded-full" style={{ background: color }} />;
}
function PatternEngine({ resource }: { resource: Resource }) {
  const [unitKey, setUnitKey] = useState("AB");
  const [mode, setMode] = useState("colours");
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
        <SettingRow label="Pattern unit">
          <Segmented value={unitKey} onChange={setUnitKey} options={[
            { label: "AB", value: "AB" }, { label: "ABC", value: "ABC" }, { label: "AAB", value: "AAB" }, { label: "ABB", value: "ABB" },
          ]} />
        </SettingRow>
        <SettingRow label="Show with">
          <Segmented value={mode} onChange={setMode} options={[{ label: "Colours", value: "colours" }, { label: "Shapes", value: "shapes" }, { label: "Sizes", value: "sizes" }]} />
        </SettingRow>
      </>}
    >
      <p className="mb-3 text-sm text-navy-600">What comes next? Tap the palette to continue the repeating pattern.</p>
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-surface-soft p-4">
        {full.map((k, i) => {
          const given = i < givenCount;
          const sIdx = i - givenCount;
          const show = given || sIdx < filled.length;
          const kind = given ? k : filled[sIdx];
          return (
            <div key={i} className={cn("flex h-11 w-11 items-center justify-center rounded-lg", given ? "" : "border-2 border-dashed border-navy-200 bg-white")}>
              {show ? <PatternToken kind={kind} mode={mode} /> : <span className="text-lg font-bold text-navy-300">?</span>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center gap-3">
        {palette.map((k) => (
          <button key={k} onClick={() => add(k)} disabled={complete}
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-navy-200 hover:border-teal-400 disabled:opacity-40" aria-label={`Add item ${k + 1}`}>
            <PatternToken kind={k} mode={mode} />
          </button>
        ))}
      </div>
      {complete && (
        <p className="mt-4 text-center text-sm font-semibold">
          {correct ? <span className="text-emerald-600">✓ Pattern complete — well done!</span> : <span className="text-amber-600">Look at the repeating part again and try Reset.</span>}
        </p>
      )}
    </EngineCard>
  );
}
