import { cn } from "@/lib/utils";
import type { ContentType } from "@/types";

// Map cover keys → gradient + emoji motif. Keeps the design consistent
// and avoids external image dependencies.
const covers: Record<string, { from: string; to: string; motif: string }> = {
  counters: { from: "from-teal-400", to: "to-teal-600", motif: "🔵" },
  cards: { from: "from-navy-400", to: "to-navy-700", motif: "🃏" },
  shapes: { from: "from-accent-300", to: "to-accent-500", motif: "🔷" },
  pattern: { from: "from-purple-400", to: "to-purple-600", motif: "🔶" },
  compare: { from: "from-teal-400", to: "to-navy-600", motif: "⚖️" },
  hunt: { from: "from-navy-500", to: "to-teal-600", motif: "🔎" },
  addition: { from: "from-teal-500", to: "to-emerald-600", motif: "➕" },
  subtraction: { from: "from-amber-400", to: "to-accent-600", motif: "➖" },
  placevalue: { from: "from-navy-500", to: "to-navy-800", motif: "🔢" },
  multiply: { from: "from-accent-400", to: "to-amber-600", motif: "✖️" },
  fraction: { from: "from-rose-400", to: "to-accent-500", motif: "🍕" },
  money: { from: "from-emerald-400", to: "to-teal-600", motif: "🪙" },
  graph: { from: "from-teal-500", to: "to-navy-700", motif: "📊" },
  mission: { from: "from-navy-600", to: "to-purple-700", motif: "🧭" },
  tenframe: { from: "from-teal-400", to: "to-teal-700", motif: "🟩" },
  numberline: { from: "from-navy-400", to: "to-teal-600", motif: "📏" },
  blocks: { from: "from-accent-400", to: "to-navy-600", motif: "🧱" },
  fractionbar: { from: "from-rose-400", to: "to-purple-600", motif: "🟰" },
  equivalent: { from: "from-purple-400", to: "to-navy-600", motif: "♻️" },
  clock: { from: "from-navy-400", to: "to-navy-700", motif: "🕐" },
  symmetry: { from: "from-teal-400", to: "to-purple-600", motif: "🦋" },
  shopping: { from: "from-emerald-400", to: "to-navy-600", motif: "🛒" },
  coordinate: { from: "from-navy-500", to: "to-teal-700", motif: "📍" },
  chartbuilder: { from: "from-accent-400", to: "to-teal-600", motif: "📈" },
  spinner: { from: "from-purple-400", to: "to-accent-500", motif: "🎡" },
  patternmachine: { from: "from-purple-500", to: "to-navy-700", motif: "🔁" },
  "book-garden": { from: "from-emerald-400", to: "to-teal-600", motif: "🌻" },
  "book-city": { from: "from-navy-400", to: "to-navy-700", motif: "🏙️" },
  "book-feast": { from: "from-rose-400", to: "to-accent-500", motif: "🍰" },
  "book-data": { from: "from-teal-500", to: "to-navy-700", motif: "🕵️" },
};

const typeMotif: Record<ContentType, string> = {
  game: "🎮",
  simulation: "🧪",
  book: "📖",
};

export function ResourceCover({
  cover,
  type,
  className,
  size = "md",
}: {
  cover: string;
  type: ContentType;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const c = covers[cover] ?? { from: "from-navy-500", to: "to-teal-600", motif: typeMotif[type] };
  const motifSize = size === "lg" ? "text-6xl" : size === "sm" ? "text-3xl" : "text-5xl";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        c.from,
        c.to,
        className,
      )}
    >
      {/* faint grid motif */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      <span className={cn("relative drop-shadow-sm", motifSize)} aria-hidden>
        {c.motif}
      </span>
    </div>
  );
}
