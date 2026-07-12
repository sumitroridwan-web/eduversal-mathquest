"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Flame, Star, Trophy, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useProgress } from "@/stores/progress";
import { resources } from "@/data/resources";
import { summarizeRewards } from "@/lib/rewards";
import { gradeRank } from "@/lib/cra";
import { ProgressBar } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

// Rewards (XP / level / streak / badges) + objectives coverage +
// recommended-next — all driven by the learner's saved progress.
export function ProgressOverview({ basePath = "/student" }: { basePath?: string }) {
  const uid = useAuth((s) => s.user?.id);
  const byUser = useProgress((s) => s.byUser);
  const activeDays = useProgress((s) => s.activeDays);

  const { summary, strands, recommended } = useMemo(() => {
    const prog = (uid && byUser[uid]) || {};
    const today = new Date().toISOString().slice(0, 10);
    const summary = summarizeRewards(prog, (uid && activeDays[uid]) || [], resources, today);
    const published = resources.filter((r) => r.status === "published");
    // per-strand coverage
    const map = new Map<string, { done: number; total: number }>();
    for (const r of published) {
      const e = map.get(r.strand) ?? { done: 0, total: 0 };
      e.total++; if (prog[r.id]?.completed) e.done++;
      map.set(r.strand, e);
    }
    const strands = [...map.entries()].map(([name, v]) => ({ name, ...v, pct: Math.round((v.done / v.total) * 100) })).sort((a, b) => a.pct - b.pct);
    const cover = (s: string) => { const e = map.get(s)!; return e.done / e.total; };
    const recommended = [...published].filter((r) => !prog[r.id]?.completed).sort((a, b) => cover(a.strand) - cover(b.strand) || gradeRank(a) - gradeRank(b))[0];
    return { summary, strands, recommended };
  }, [byUser, uid, activeDays]);

  const label = (s: string) => (s === "Early Mathematical Experiences" ? "Early Maths" : s);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* level + streak */}
      <div className="rounded-2xl border border-navy-100 bg-gradient-to-br from-navy-900 to-teal-800 p-5 text-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Level {summary.level.level}</p>
            <p className="font-display text-2xl font-extrabold">{summary.level.title}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm font-bold"><Flame className="h-4 w-4 text-accent-300" /> {summary.streak}-day streak</span>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-white/80"><span>{summary.xp} XP</span><span>{summary.level.xpInto}/{summary.level.xpNeeded} to next</span></div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-accent-400" style={{ width: `${(summary.level.xpInto / summary.level.xpNeeded) * 100}%` }} /></div>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <span className="flex items-center gap-1"><Trophy className="h-4 w-4 text-accent-300" /> {summary.completed} done</span>
          <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent-300 text-accent-300" /> {summary.stars} stars</span>
        </div>
      </div>

      {/* badges */}
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <p className="mb-3 text-sm font-bold text-navy-800">Badges</p>
        <div className="grid grid-cols-4 gap-2">
          {summary.badges.map((b) => (
            <div key={b.id} title={b.hint} className={cn("flex flex-col items-center gap-1 rounded-xl border p-2 text-center", b.earned ? "border-accent-200 bg-accent-50" : "border-navy-100 bg-surface-soft opacity-60")}>
              <span className="relative text-2xl">{b.emoji}{!b.earned && <Lock className="absolute -bottom-1 -right-1 h-3 w-3 text-navy-400" />}</span>
              <span className="text-[10px] font-semibold leading-tight text-navy-600">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* recommended next */}
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <p className="mb-3 text-sm font-bold text-navy-800">Recommended next</p>
        {recommended ? (
          <Link href={`${basePath}/library/${recommended.id}`} className="group block rounded-xl border border-navy-100 bg-surface-soft p-3 transition-colors hover:border-teal-400">
            <p className="text-xs font-semibold text-teal-600">{label(recommended.strand)}</p>
            <p className="font-display font-bold text-navy-900">{recommended.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-navy-500">{recommended.objective.student}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-teal-600 group-hover:gap-2">Start <ArrowRight className="h-4 w-4" /></span>
          </Link>
        ) : <p className="text-sm text-navy-500">You&apos;ve completed everything — amazing! 🎉</p>}
      </div>

      {/* objectives coverage (all strands) */}
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card lg:col-span-3">
        <p className="mb-3 text-sm font-bold text-navy-800">Strand coverage</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {strands.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-navy-700">{label(s.name)}</span><span className="text-navy-400">{s.done}/{s.total}</span></div>
              <ProgressBar value={s.pct} tone={s.pct >= 66 ? "teal" : s.pct >= 33 ? "accent" : "navy"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
