"use client";

import { useState } from "react";
import { RotateCcw, Lightbulb, Play, Check, X } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToasts } from "@/stores/ui";
import { cn, clamp } from "@/lib/utils";

// ==========================================================
// Bespoke interactive engines for MathQuest simulations.
// Each engine is a genuine manipulative tied to its objective.
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
    case "compare": return <RatioEngine resource={resource} />;
    case "addition": return <OrderOpsEngine resource={resource} />;
    case "shapes": return <ShapeSortEngine resource={resource} />;
    default: return <TenFrameEngine resource={resource} />;
  }
}

// ---------------- shared bits ----------------

function hintFor(r: Resource) {
  return r.discussionPrompts?.[0] ?? r.reasoningPrompt ?? r.thinkPrompt;
}

function EngineCard({
  hint, onReset, children,
}: {
  hint?: string;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Badge tone="teal">Interactive simulation</Badge>
        <div className="flex gap-2">
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
      <button
        onClick={() => set(clamp(value - step, min, max))}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-lg font-bold text-navy-700 hover:bg-navy-50 disabled:opacity-40"
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >−</button>
      <span className="w-10 text-center font-display text-lg font-bold text-navy-900 tabular-nums">{value}</span>
      <button
        onClick={() => set(clamp(value + step, min, max))}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-lg font-bold text-navy-700 hover:bg-navy-50 disabled:opacity-40"
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >+</button>
    </div>
  );
}

// ---------------- 1. Ten frame ----------------
function TenFrameEngine({ resource }: { resource: Resource }) {
  const [count, setCount] = useState(4);
  const toTen = 10 - count;
  const cells = Array.from({ length: 10 }, (_, i) => i < count);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setCount(0)}>
      <p className="mb-4 text-sm text-navy-600">Tap the frame to add or remove counters. How many more make ten?</p>
      <div className="mx-auto grid w-fit grid-cols-5 gap-2 rounded-2xl bg-surface-soft p-4">
        {cells.map((f, i) => (
          <button
            key={i}
            onClick={() => setCount(f ? i : i + 1)}
            className={cn("flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-colors",
              f ? "border-teal-500 bg-teal-500" : "border-navy-200 bg-white hover:bg-teal-50")}
            aria-label={`Counter ${i + 1} ${f ? "filled" : "empty"}`}
          >
            {f && <span className="h-6 w-6 rounded-full bg-white/90" />}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-6 text-center">
        <div><p className="font-display text-3xl font-bold text-navy-900">{count}</p><p className="text-xs text-navy-400">counters</p></div>
        <span className="text-navy-300">+</span>
        <div><p className="font-display text-3xl font-bold text-teal-600">{toTen}</p><p className="text-xs text-navy-400">makes ten</p></div>
      </div>
    </EngineCard>
  );
}

// ---------------- 1b. Hundred square ----------------
function HundredSquareEngine({ resource }: { resource: Resource }) {
  const [step, setStep] = useState(5);
  const [showOddEven, setShowOddEven] = useState(false);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setStep(5); setShowOddEven(false); }}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-navy-600">Count in:</span>
        {[2, 3, 5, 10].map((s) => (
          <button key={s} onClick={() => setStep(s)}
            className={cn("h-8 w-9 rounded-lg border text-sm font-semibold", step === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-600 hover:bg-navy-50")}>
            {s}
          </button>
        ))}
        <Button size="sm" variant={showOddEven ? "secondary" : "outline"} onClick={() => setShowOddEven((v) => !v)}>
          Odd / even
        </Button>
      </div>
      <div className="mx-auto grid w-fit grid-cols-10 gap-0.5 rounded-xl bg-surface-soft p-2">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => {
          const multiple = n % step === 0;
          const odd = n % 2 === 1;
          return (
            <span key={n}
              className={cn("flex h-7 w-7 items-center justify-center rounded text-[10px] font-semibold",
                multiple ? "bg-teal-500 text-white" :
                showOddEven ? (odd ? "bg-accent-50 text-accent-700" : "bg-navy-50 text-navy-600") :
                "bg-white text-navy-500")}>
              {n}
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-navy-500">
        Teal squares are multiples of <span className="font-bold text-teal-700">{step}</span>. What pattern do you notice?
      </p>
    </EngineCard>
  );
}

// ---------------- 2. Number line ----------------
function NumberLineEngine({ resource }: { resource: Resource }) {
  const negative = /negative/i.test(resource.id + resource.title);
  const min = negative ? -10 : 0;
  const max = negative ? 10 : 20;
  const [value, setValue] = useState(negative ? 0 : 4);
  const [step, setStep] = useState(2);
  const W = 320, pad = 16;
  const toX = (v: number) => pad + ((v - min) / (max - min)) * (W - 2 * pad);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setValue(negative ? 0 : 4)}>
      <p className="mb-3 text-sm text-navy-600">Tap the line or jump in steps. Watch the value change.</p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} 90`} className="mx-auto block w-full min-w-[300px]"
          onClick={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            setValue(clamp(Math.round(min + px * (max - min)), min, max));
          }}
        >
          <line x1={pad} y1={54} x2={W - pad} y2={54} stroke="#31415f" strokeWidth={2.5} strokeLinecap="round" />
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((v) => {
            const showLabel = (max - min) <= 12 || v % 2 === 0;
            return (
              <g key={v}>
                <line x1={toX(v)} y1={48} x2={toX(v)} y2={60} stroke="#98a8c6" strokeWidth={2} strokeLinecap="round" />
                {showLabel && <text x={toX(v)} y={76} fontSize={9} textAnchor="middle" fill="#6a80a9" fontWeight={600}>{v}</text>}
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
        <div className="flex items-center gap-1 text-xs text-navy-500">
          step
          {[1, 2, 5, 10].map((s) => (
            <button key={s} onClick={() => setStep(s)}
              className={cn("h-7 w-7 rounded-lg border text-sm font-semibold", step === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-600")}>
              {s}
            </button>
          ))}
        </div>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => clamp(v + step, min, max))}>+ {step}</Button>
      </div>
    </EngineCard>
  );
}

// ---------------- 3. Place value blocks ----------------
function PlaceValueEngine({ resource }: { resource: Resource }) {
  const [h, setH] = useState(2);
  const [t, setT] = useState(3);
  const [o, setO] = useState(4);
  const notify = useToasts((s) => s.notify);
  const total = h * 100 + t * 10 + o;

  const regroup = () => {
    let nh = h, nt = t, no = o;
    if (no >= 10) { nt += Math.floor(no / 10); no = no % 10; }
    if (nt >= 10) { nh += Math.floor(nt / 10); nt = nt % 10; }
    setH(clamp(nh, 0, 9)); setT(nt); setO(no);
    notify({ variant: "success", title: "Regrouped!", description: "Ten ones exchanged for a ten, ten tens for a hundred." });
  };

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setH(0); setT(0); setO(0); }}>
      <p className="mb-3 text-sm text-navy-600">Build a number with hundreds, tens and ones. Try regrouping.</p>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4">
        <Stepper label="Hundreds" value={h} set={setH} min={0} max={9} />
        <Stepper label="Tens" value={t} set={setT} min={0} max={19} />
        <Stepper label="Ones" value={o} set={setO} min={0} max={19} />
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-2xl bg-surface-soft p-4">
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
        <p className="font-display text-sm text-navy-500">
          {h * 100} + {t * 10} + {o} = <span className="text-2xl font-bold text-navy-900">{total}</span>
        </p>
        <Button size="sm" variant="secondary" onClick={regroup}>Regroup</Button>
      </div>
    </EngineCard>
  );
}

// ---------------- 4. Array ----------------
function ArrayEngine({ resource }: { resource: Resource }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setRows(3); setCols(4); }}>
      <p className="mb-3 text-sm text-navy-600">Change the rows and columns to build an array.</p>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4 sm:grid-cols-2">
        <Stepper label="Rows" value={rows} set={setRows} min={1} max={10} />
        <Stepper label="Columns" value={cols} set={setCols} min={1} max={10} />
      </div>
      <div className="flex justify-center rounded-2xl bg-surface-soft p-5">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, i) => (
            <span key={i} className="h-5 w-5 rounded-full bg-teal-500" />
          ))}
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="font-display text-2xl font-bold text-navy-900">{rows} × {cols} = {rows * cols}</p>
        <p className="mt-1 text-xs text-navy-500">{Array.from({ length: rows }).map(() => cols).join(" + ")} = {rows * cols}</p>
      </div>
    </EngineCard>
  );
}

// ---------------- 5. Fraction bars ----------------
function FractionBarsEngine({ resource }: { resource: Resource }) {
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(2);
  const [d2, setD2] = useState(3);
  const v1 = n1 / d1, v2 = n2 / d2;
  const sym = v1 > v2 ? ">" : v1 < v2 ? "<" : "=";

  const Bar = ({ n, d, tone }: { n: number; d: number; tone: string }) => (
    <div className="flex overflow-hidden rounded-xl border-2 border-navy-200">
      {Array.from({ length: d }).map((_, i) => (
        <div key={i} className={cn("h-10 flex-1 border-r border-white/70 last:border-r-0", i < n ? tone : "bg-white")} />
      ))}
    </div>
  );

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setN1(1); setD1(2); setN2(2); setD2(3); }}>
      <p className="mb-3 text-sm text-navy-600">Change each fraction and compare the bars.</p>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-display text-lg font-bold text-teal-600">{n1}/{d1}</span>
            <span className="text-xs text-navy-400">= {Math.round(v1 * 100)}%</span>
          </div>
          <Bar n={n1} d={d1} tone="bg-teal-500" />
          <div className="mt-2 flex flex-wrap gap-4">
            <Stepper label="Numerator" value={n1} set={(x) => setN1(clamp(x, 0, d1))} min={0} max={d1} />
            <Stepper label="Denominator" value={d1} set={(x) => { setD1(x); setN1((p) => clamp(p, 0, x)); }} min={1} max={12} />
          </div>
        </div>

        <div className="text-center font-display text-3xl font-bold text-navy-900">{sym}</div>

        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-display text-lg font-bold text-accent-600">{n2}/{d2}</span>
            <span className="text-xs text-navy-400">= {Math.round(v2 * 100)}%</span>
          </div>
          <Bar n={n2} d={d2} tone="bg-accent-400" />
          <div className="mt-2 flex flex-wrap gap-4">
            <Stepper label="Numerator" value={n2} set={(x) => setN2(clamp(x, 0, d2))} min={0} max={d2} />
            <Stepper label="Denominator" value={d2} set={(x) => { setD2(x); setN2((p) => clamp(p, 0, x)); }} min={1} max={12} />
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 6. Clock ----------------
function ClockEngine({ resource }: { resource: Resource }) {
  const oClockOnly = /s1-clock/.test(resource.id);
  const minStep = oClockOnly ? 30 : 5;
  const [hour, setHour] = useState(3);
  const [min, setMin] = useState(0);
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
    <EngineCard hint={hintFor(resource)} onReset={() => { setHour(3); setMin(0); }}>
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
          <p className="font-display text-3xl font-bold text-navy-900 tabular-nums">
            {hour === 0 ? 12 : hour}:{String(min).padStart(2, "0")}
          </p>
          <p className="mt-1 capitalize text-teal-700">{words}</p>
          <div className="mt-4 grid gap-2">
            <Stepper label="Hours" value={hour} set={(x) => setHour(((x - 1 + 12) % 12) + 1)} min={1} max={12} />
            <Stepper label="Minutes" value={min} set={(x) => setMin((x + 60) % 60)} min={0} max={55} step={minStep} />
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 7. Coordinate grid ----------------
function CoordinateEngine({ resource }: { resource: Resource }) {
  const four = /four-quadrant/.test(resource.id);
  const lo = four ? -5 : 0, hi = 5;
  const [pts, setPts] = useState<[number, number][]>([]);
  const size = 260, pad = 24;
  const span = hi - lo;
  const toX = (x: number) => pad + ((x - lo) / span) * (size - 2 * pad);
  const toY = (y: number) => size - pad - ((y - lo) / span) * (size - 2 * pad);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setPts([])}>
      <p className="mb-3 text-sm text-navy-600">Tap the grid to plot points {four ? "in any quadrant" : "in the first quadrant"}.</p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-64 w-64 rounded-xl bg-surface-soft"
          onClick={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const gx = Math.round(lo + ((e.clientX - r.left) / r.width * size - pad) / (size - 2 * pad) * span);
            const gy = Math.round(lo + (size - pad - (e.clientY - r.top) / r.height * size) / (size - 2 * pad) * span);
            if (gx >= lo && gx <= hi && gy >= lo && gy <= hi) setPts((p) => [...p, [clamp(gx, lo, hi), clamp(gy, lo, hi)]]);
          }}
        >
          {Array.from({ length: span + 1 }, (_, i) => lo + i).map((v) => (
            <g key={v} stroke="#dfe4ee" strokeWidth={1}>
              <line x1={toX(v)} y1={toY(lo)} x2={toX(v)} y2={toY(hi)} />
              <line x1={toX(lo)} y1={toY(v)} x2={toX(hi)} y2={toY(v)} />
            </g>
          ))}
          <line x1={toX(lo)} y1={toY(0)} x2={toX(hi)} y2={toY(0)} stroke="#98a8c6" strokeWidth={2} />
          <line x1={toX(0)} y1={toY(lo)} x2={toX(0)} y2={toY(hi)} stroke="#98a8c6" strokeWidth={2} />
          {pts.length > 1 && <polyline points={pts.map(([x, y]) => `${toX(x)},${toY(y)}`).join(" ")} fill="none" stroke="#199473" strokeWidth={2} />}
          {pts.map(([x, y], i) => <circle key={i} cx={toX(x)} cy={toY(y)} r={5} fill="#f59e0b" stroke="#fff" strokeWidth={2} />)}
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-navy-600">Plotted points</p>
          <div className="mt-2 flex max-w-[160px] flex-wrap justify-center gap-1.5">
            {pts.length === 0 ? <span className="text-xs text-navy-400">Tap the grid…</span> :
              pts.map(([x, y], i) => <Badge key={i} tone="navy">({x}, {y})</Badge>)}
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 8. Bar chart + statistics ----------------
function BarChartEngine({ resource }: { resource: Resource }) {
  const stats = /mode|median|average/i.test(resource.id + resource.title);
  const [data, setData] = useState([3, 5, 2, 6, 4]);
  const labels = ["A", "B", "C", "D", "E"];
  const maxV = Math.max(...data, 1);

  const mean = (data.reduce((a, b) => a + b, 0) / data.length);
  const sorted = [...data].sort((a, b) => a - b);
  const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const counts: Record<number, number> = {};
  data.forEach((v) => { counts[v] = (counts[v] ?? 0) + 1; });
  const mode = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  const range = Math.max(...data) - Math.min(...data);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setData([3, 5, 2, 6, 4])}>
      <p className="mb-3 text-sm text-navy-600">Use the buttons to change the bars.</p>
      <div className="flex items-end justify-center gap-4 rounded-2xl bg-surface-soft p-4" style={{ height: 180 }}>
        {data.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-navy-500">{v}</span>
            <div className="w-10 rounded-t-lg bg-teal-500 transition-all" style={{ height: `${(v / maxV) * 120}px` }} />
            <span className="text-xs font-medium text-navy-600">{labels[i]}</span>
            <div className="flex gap-0.5">
              <button onClick={() => setData((d) => d.map((x, j) => j === i ? clamp(x - 1, 0, 10) : x))} className="h-6 w-6 rounded border border-navy-200 text-sm font-bold text-navy-600 hover:bg-navy-50">−</button>
              <button onClick={() => setData((d) => d.map((x, j) => j === i ? clamp(x + 1, 0, 10) : x))} className="h-6 w-6 rounded border border-navy-200 text-sm font-bold text-navy-600 hover:bg-navy-50">+</button>
            </div>
          </div>
        ))}
      </div>
      {stats && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[["Mean", mean.toFixed(1)], ["Median", `${median}`], ["Mode", `${mode}`], ["Range", `${range}`]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-surface-soft p-3 text-center">
              <p className="font-display text-xl font-bold text-navy-900">{v}</p>
              <p className="text-xs text-navy-400">{k}</p>
            </div>
          ))}
        </div>
      )}
    </EngineCard>
  );
}

// ---------------- 9. Probability spinner ----------------
const SPIN_COLORS = [
  { hex: "#14b8a6", name: "teal" },
  { hex: "#f59e0b", name: "amber" },
  { hex: "#6366f1", name: "indigo" },
  { hex: "#f43f5e", name: "rose" },
];
function SpinnerEngine({ resource }: { resource: Resource }) {
  const n = SPIN_COLORS.length;
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [counts, setCounts] = useState<number[]>(Array(n).fill(0));
  const total = counts.reduce((a, b) => a + b, 0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * n);
    const target = 360 * 4 + (360 - (idx * (360 / n) + 360 / n / 2));
    setRot((r) => r + target);
    window.setTimeout(() => {
      setCounts((c) => c.map((x, i) => (i === idx ? x + 1 : x)));
      setSpinning(false);
    }, 1600);
  };

  const cx = 90, cy = 90, r = 80;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setCounts(Array(n).fill(0))}>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
        <div className="relative">
          <svg viewBox="0 0 180 180" className="h-44 w-44" style={{ transform: `rotate(${rot}deg)`, transition: "transform 1.6s cubic-bezier(.2,.8,.2,1)" }}>
            {SPIN_COLORS.map((c, i) => {
              const a0 = (i * (360 / n) - 90) * (Math.PI / 180);
              const a1 = ((i + 1) * (360 / n) - 90) * (Math.PI / 180);
              const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
              const [x0, y0] = p(a0), [x1, y1] = p(a1);
              return <path key={i} d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={c.hex} stroke="#fff" strokeWidth={2} />;
            })}
            <circle cx={cx} cy={cy} r={7} fill="#1b2540" />
          </svg>
          <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "14px solid #1b2540" }} />
        </div>
        <div className="text-center">
          <Button onClick={spin} loading={spinning}><Play className="h-4 w-4" /> Spin</Button>
          <div className="mt-4 space-y-1.5">
            {SPIN_COLORS.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
                <span className="w-14 text-navy-600">{counts[i]}</span>
                <span className="text-xs text-navy-400">{total ? `${Math.round((counts[i] / total) * 100)}%` : "—"}</span>
              </div>
            ))}
            <p className="pt-1 text-xs text-navy-400">Total spins: {total}</p>
          </div>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 10. Money ----------------
const COINS = [1, 2, 5, 10, 20, 50, 100];
function MoneyEngine({ resource }: { resource: Resource }) {
  const notify = useToasts((s) => s.notify);
  const [target, setTarget] = useState(47);
  const [total, setTotal] = useState(0);
  const fmt = (p: number) => (p >= 100 ? `£${(p / 100).toFixed(2)}` : `${p}p`);
  const done = total === target;

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setTotal(0)}>
      <div className="mb-4 rounded-2xl bg-surface-soft p-4 text-center">
        <p className="text-sm text-navy-500">Make this amount:</p>
        <p className="font-display text-3xl font-bold text-navy-900">{fmt(target)}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {COINS.map((c) => (
          <button key={c} onClick={() => setTotal((t) => t + c)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 font-bold text-navy-900 shadow ring-2 ring-accent-600 hover:bg-accent-300">
            {fmt(c)}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg">Total: <span className={cn("font-bold", done ? "text-emerald-600" : total > target ? "text-red-600" : "text-navy-900")}>{fmt(total)}</span></p>
        <div className="flex gap-2">
          {done && <Badge tone="green"><Check className="h-3.5 w-3.5" /> Exact!</Badge>}
          {total > target && <Badge tone="red"><X className="h-3.5 w-3.5" /> Too much</Badge>}
          <Button size="sm" variant="outline" onClick={() => { setTotal(0); setTarget(10 + Math.floor(Math.random() * 89)); notify({ variant: "info", title: "New amount set" }); }}>New amount</Button>
        </div>
      </div>
    </EngineCard>
  );
}

// ---------------- 11. Symmetry ----------------
function SymmetryEngine({ resource }: { resource: Resource }) {
  const rows = 5, cols = 6, mid = cols / 2;
  const left = new Set(["0-1", "1-0", "1-2", "2-1", "3-0", "3-2"]);
  const [right, setRight] = useState<Set<string>>(new Set());
  const key = (r: number, c: number) => `${r}-${c}`;
  const mirrorOf = (r: number, c: number) => key(r, cols - 1 - c);
  const target = new Set(Array.from(left).map((k) => { const [r, c] = k.split("-").map(Number); return mirrorOf(r, c); }));
  const correct = right.size === target.size && Array.from(right).every((k) => target.has(k));

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setRight(new Set())}>
      <p className="mb-3 text-sm text-navy-600">Complete the pattern so both halves match across the mirror line.</p>
      <div className="flex justify-center">
        <div className="relative grid gap-1 rounded-2xl bg-surface-soft p-3" style={{ gridTemplateColumns: `repeat(${cols}, 2.25rem)` }}>
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const isLeft = c < mid;
              const filled = isLeft ? left.has(key(r, c)) : right.has(key(r, c));
              return (
                <button key={key(r, c)}
                  onClick={() => { if (isLeft) return; setRight((s) => { const n = new Set(s); const k = key(r, c); n.has(k) ? n.delete(k) : n.add(k); return n; }); }}
                  className={cn("h-9 w-9 rounded-md border transition-colors",
                    filled ? "bg-teal-500 border-teal-600" : "bg-white border-navy-200",
                    isLeft ? "cursor-default opacity-90" : "hover:bg-teal-50")}
                  aria-label={`cell ${r},${c}`}
                />
              );
            }),
          )}
          <div className="pointer-events-none absolute inset-y-2 left-1/2 w-0.5 -translate-x-1/2 bg-accent-500" />
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
  const [a, setA] = useState(120);
  const other = 180 - a;
  const cx = 150, cy = 120, len = 110;
  const rad = (a * Math.PI) / 180;
  const ax = cx + len * Math.cos(Math.PI - rad), ay = cy - len * Math.sin(Math.PI - rad);

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setA(120)}>
      <p className="mb-3 text-sm text-navy-600">Drag the slider. The two angles on the straight line always total 180°.</p>
      <svg viewBox="0 0 300 150" className="mx-auto block w-full max-w-sm">
        <line x1={cx - len} y1={cy} x2={cx + len} y2={cy} stroke="#31415f" strokeWidth={3} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" />
        <path d={`M${cx + 28} ${cy} A28 28 0 0 0 ${cx + 28 * Math.cos(rad)} ${cy - 28 * Math.sin(rad)}`} fill="none" stroke="#199473" strokeWidth={2} />
        <text x={cx + 40} y={cy - 14} fontSize={13} fill="#199473" fontWeight={800}>{a}°</text>
        <text x={cx - 52} y={cy - 14} fontSize={13} fill="#6a80a9" fontWeight={800}>{other}°</text>
        <circle cx={cx} cy={cy} r={4} fill="#1b2540" />
      </svg>
      <input type="range" min={10} max={170} value={a} onChange={(e) => setA(Number(e.target.value))} className="mt-3 w-full accent-teal-600" aria-label="angle" />
      <p className="mt-2 text-center font-display text-lg font-bold text-navy-900">{a}° + {other}° = 180°</p>
    </EngineCard>
  );
}

// ---------------- 13. Ratio ----------------
function RatioEngine({ resource }: { resource: Resource }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [k, setK] = useState(2);
  const whole = a + b;
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => { setA(2); setB(3); setK(1); }}>
      <p className="mb-3 text-sm text-navy-600">Set a ratio, then scale it up. The ratio stays equivalent.</p>
      <div className="mb-4 grid gap-2 rounded-2xl bg-surface-soft p-4 sm:grid-cols-3">
        <Stepper label="Part A" value={a} set={setA} min={1} max={6} />
        <Stepper label="Part B" value={b} set={setB} min={1} max={6} />
        <Stepper label="Scale ×" value={k} set={setK} min={1} max={4} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-surface-soft p-4">
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: a * k }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-teal-500" />)}
        </div>
        <span className="font-display text-2xl font-bold text-navy-300">:</span>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: b * k }).map((_, i) => <span key={i} className="h-6 w-6 rounded-full bg-accent-400" />)}
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="font-display text-2xl font-bold text-navy-900">{a * k} : {b * k} <span className="text-base font-medium text-navy-400">= {a} : {b}</span></p>
        <p className="mt-1 text-xs text-navy-500">Part A is {a}/{whole} of the whole (proportion).</p>
      </div>
    </EngineCard>
  );
}

// ---------------- 14. Order of operations ----------------
function OrderOpsEngine({ resource }: { resource: Resource }) {
  const [choice, setChoice] = useState<"none" | "left" | "right">("none");
  const results = { none: 2 + 3 * 4, left: (2 + 3) * 4, right: 2 + 3 * 4 };
  const expr = { none: "2 + 3 × 4", left: "(2 + 3) × 4", right: "2 + (3 × 4)" };
  const explain = {
    none: "No brackets — multiply first: 3 × 4 = 12, then 2 + 12.",
    left: "Brackets first: 2 + 3 = 5, then 5 × 4.",
    right: "Brackets change nothing here — multiply still happens first.",
  };
  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setChoice("none")}>
      <p className="mb-3 text-sm text-navy-600">Choose where to put brackets and watch the answer change.</p>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {(["none", "left", "right"] as const).map((c) => (
          <button key={c} onClick={() => setChoice(c)}
            className={cn("rounded-xl border-2 px-4 py-2 font-display text-lg font-bold transition-colors",
              choice === c ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-700 hover:bg-navy-50")}>
            {expr[c]}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-surface-soft p-6 text-center">
        <p className="font-display text-3xl font-bold text-navy-900">{expr[choice]} = {results[choice]}</p>
        <p className="mt-2 text-sm text-navy-500">{explain[choice]}</p>
      </div>
    </EngineCard>
  );
}

// ---------------- 15. Shape sort ----------------
const SORT_SHAPES = [
  { name: "Circle", curved: true }, { name: "Square", curved: false },
  { name: "Triangle", curved: false }, { name: "Oval", curved: true },
  { name: "Pentagon", curved: false }, { name: "Rectangle", curved: false },
];
function ShapeSortEngine({ resource }: { resource: Resource }) {
  const [bins, setBins] = useState<Record<string, "curved" | "straight" | null>>({});
  const cycle = (n: string) => setBins((b) => ({ ...b, [n]: b[n] === "curved" ? "straight" : b[n] === "straight" ? null : "curved" }));
  const allPlaced = SORT_SHAPES.every((s) => bins[s.name]);
  const allCorrect = SORT_SHAPES.every((s) => bins[s.name] === (s.curved ? "curved" : "straight"));

  return (
    <EngineCard hint={hintFor(resource)} onReset={() => setBins({})}>
      <p className="mb-4 text-sm text-navy-600">Tap each shape to sort it: <span className="font-semibold text-teal-700">curved</span> or <span className="font-semibold text-accent-700">straight sides</span>.</p>
      <div className="flex flex-wrap justify-center gap-2">
        {SORT_SHAPES.map((s) => {
          const bin = bins[s.name];
          return (
            <button key={s.name} onClick={() => cycle(s.name)}
              className={cn("rounded-xl border-2 px-4 py-3 font-semibold transition-colors",
                bin === "curved" ? "border-teal-500 bg-teal-50 text-teal-700" :
                bin === "straight" ? "border-accent-500 bg-accent-50 text-accent-700" :
                "border-navy-200 text-navy-700 hover:bg-navy-50")}>
              {s.name}
              {bin && <span className="ml-1 text-xs">({bin})</span>}
            </button>
          );
        })}
      </div>
      {allPlaced && (
        <p className="mt-4 text-center text-sm font-semibold">
          {allCorrect ? <span className="text-emerald-600">✓ All sorted correctly!</span> : <span className="text-amber-600">Not quite — check the shapes with straight sides.</span>}
        </p>
      )}
    </EngineCard>
  );
}
