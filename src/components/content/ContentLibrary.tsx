"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Resource, Role, ContentType } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { AssignModal } from "./AssignModal";
import { SearchField, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { distinct } from "@/lib/content";
import { gradeRank } from "@/lib/cra";
import { MULTIPLAYER_IDS } from "./multiplayerEngines";
import { cn } from "@/lib/utils";
import { Users, User } from "lucide-react";

const isMultiplayer = (r: Resource) => r.type === "game" && MULTIPLAYER_IDS.includes(r.id);

interface ContentLibraryProps {
  resources: Resource[];
  basePath: string;
  role?: Role;
  locked?: boolean;
  /** Restrict the type filter to a single content type (for Games/Sims/Books pages) */
  lockType?: ContentType;
  /** Initial sort, e.g. "stage" to show grade progression first */
  defaultSort?: string;
}

const ALL = "all";

export function ContentLibrary({ resources, basePath, role, locked, lockType, defaultSort }: ContentLibraryProps) {
  const [query, setQuery] = useState("");
  const [programme, setProgramme] = useState(ALL);
  const [stage, setStage] = useState(ALL);
  const [strand, setStrand] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [type, setType] = useState<string>(lockType ?? ALL);
  const [purpose, setPurpose] = useState(ALL);
  const [format, setFormat] = useState<"all" | "single" | "multi">("all");
  const [sort, setSort] = useState(defaultSort ?? "popular");
  const hasGames = useMemo(() => resources.some((r) => r.type === "game"), [resources]);
  const [showFilters, setShowFilters] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Resource | null>(null);

  const strands = useMemo(() => distinct(resources, "strand"), [resources]);
  const stages = useMemo(() => {
    const s = new Set<string>();
    resources.forEach((r) => s.add(r.programme === "early-years" ? r.band ?? "" : r.stage ?? ""));
    return Array.from(s).filter(Boolean).sort();
  }, [resources]);
  const purposes = useMemo(() => distinct(resources, "learningPurpose"), [resources]);

  const filtered = useMemo(() => {
    let out = resources.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.objective.student.toLowerCase().includes(q) ||
        r.vocabulary.some((v) => v.toLowerCase().includes(q));
      const rStage = r.programme === "early-years" ? r.band : r.stage;
      const matchesFormat = format === "all" || (format === "multi" ? isMultiplayer(r) : !isMultiplayer(r));
      return (
        matchesQuery &&
        matchesFormat &&
        (programme === ALL || r.programme === programme) &&
        (stage === ALL || rStage === stage) &&
        (strand === ALL || r.strand === strand) &&
        (difficulty === ALL || r.difficulty === difficulty) &&
        (type === ALL || r.type === type) &&
        (purpose === ALL || r.learningPurpose === purpose)
      );
    });
    out = [...out].sort((a, b) => {
      if (sort === "stage") return gradeRank(a) - gradeRank(b) || (b.plays ?? 0) - (a.plays ?? 0);
      if (sort === "popular") return (b.plays ?? 0) - (a.plays ?? 0);
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "duration") return a.durationMins - b.durationMins;
      if (sort === "az") return a.title.localeCompare(b.title);
      return 0;
    });
    return out;
  }, [resources, query, programme, stage, strand, difficulty, type, purpose, format, sort]);

  const resetFilters = () => {
    setQuery("");
    setProgramme(ALL);
    setStage(ALL);
    setStrand(ALL);
    setDifficulty(ALL);
    if (!lockType) setType(ALL);
    setPurpose(ALL);
    setFormat("all");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          placeholder="Search by title, topic or vocabulary…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          wrapperClassName="flex-1"
          aria-label="Search resources"
        />
        <div className="flex items-center gap-2">
          <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="w-auto">
            <option value="stage">By stage (low→high)</option>
            <option value="popular">Most popular</option>
            <option value="rating">Top rated</option>
            <option value="duration">Shortest first</option>
            <option value="az">A–Z</option>
          </Select>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      {hasGames && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Player format">
          {([["all", "All games", null], ["single", "Single-player", <User key="s" className="h-3.5 w-3.5" />], ["multi", "Multiplayer", <Users key="m" className="h-3.5 w-3.5" />]] as const).map(([v, label, icon]) => (
            <button key={v} onClick={() => setFormat(v)} aria-pressed={format === v}
              className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                format === v ? "border-teal-500 bg-teal-500 text-white" : "border-navy-200 text-navy-600 hover:border-teal-400")}>
              {icon}{label}
              {v === "multi" && <span className={cn("rounded-full px-1.5 text-[10px] font-bold", format === v ? "bg-white/25" : "bg-teal-100 text-teal-700")}>2–4 players</span>}
            </button>
          ))}
        </div>
      )}

      {showFilters && (
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-card sm:grid-cols-3 lg:grid-cols-6">
          <FilterSelect label="Programme" value={programme} onChange={setProgramme}
            options={[["early-years", "Early Years"], ["primary", "Primary"]]} />
          <FilterSelect label="Stage / Band" value={stage} onChange={setStage}
            options={stages.map((s) => [s, s])} />
          <FilterSelect label="Strand" value={strand} onChange={setStrand}
            options={strands.map((s) => [s, s === "Early Mathematical Experiences" ? "Early Maths" : s])} />
          {!lockType && (
            <FilterSelect label="Type" value={type} onChange={setType}
              options={[["game", "Games"], ["simulation", "Simulations"], ["book", "Books"]]} />
          )}
          <FilterSelect label="Difficulty" value={difficulty} onChange={setDifficulty}
            options={[["Foundation", "Foundation"], ["Core", "Core"], ["Challenge", "Challenge"]]} />
          <FilterSelect label="Purpose" value={purpose} onChange={setPurpose}
            options={purposes.map((p) => [p, p])} />
          <div className="col-span-2 flex items-end sm:col-span-1">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear all
            </Button>
          </div>
        </div>
      )}

      <p className="text-sm text-navy-500">
        Showing <span className="font-semibold text-navy-800">{filtered.length}</span> of {resources.length} resources
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No resources match your filters"
          description="Try clearing a filter or searching for a different topic."
          action={<Button variant="outline" onClick={resetFilters}>Clear filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              basePath={basePath}
              role={role}
              locked={locked}
              onAssign={setAssignTarget}
            />
          ))}
        </div>
      )}

      <AssignModal resource={assignTarget} open={Boolean(assignTarget)} onClose={() => setAssignTarget(null)} />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-navy-500">{label}</span>
      <Select value={value} onChange={(e) => onChange(e.target.value)} className="text-sm">
        <option value="all">All</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </Select>
    </label>
  );
}
