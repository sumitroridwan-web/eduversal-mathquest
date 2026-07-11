import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  tone?: "teal" | "accent" | "navy";
  showLabel?: boolean;
  size?: "sm" | "md";
}

const tones = {
  teal: "bg-teal-500",
  accent: "bg-accent-400",
  navy: "bg-navy-700",
};

export function ProgressBar({
  value,
  className,
  tone = "teal",
  showLabel,
  size = "md",
}: ProgressBarProps) {
  const pct = clamp(Math.round(value), 0, 100);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-full bg-navy-100",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", tones[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs font-semibold text-navy-600 tabular-nums">
          {pct}%
        </span>
      )}
    </div>
  );
}

export function RingProgress({
  value,
  size = 64,
  stroke = 6,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const pct = clamp(value, 0, 100);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e9f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#27ab83"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-sm font-bold text-navy-800">{label ?? `${Math.round(pct)}%`}</span>
    </div>
  );
}
