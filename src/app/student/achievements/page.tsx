"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { badges, getStudent } from "@/data/school";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

const tierRing = { bronze: "ring-amber-300", silver: "ring-navy-200", gold: "ring-accent-400" } as const;

export default function StudentAchievements() {
  const student = getStudent("stu-1");
  const earned = badges.filter((b) => b.earned);

  return (
    <div className="space-y-6">
      <PageHeading title="My achievements 🏆" description="All the badges, points and certificates you've earned!" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Badges earned" value={earned.length} icon="Award" tone="accent" />
        <StatCard label="Total points" value={student?.points ?? 0} icon="Star" tone="teal" />
        <StatCard label="Day streak" value={`${student?.streak ?? 0} 🔥`} icon="Flame" tone="navy" />
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Quest Badges</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((b) => (
            <div key={b.id} className={cn("flex flex-col items-center rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-card", !b.earned && "opacity-50")}>
              <span className={cn("flex h-16 w-16 items-center justify-center rounded-full bg-surface-soft text-4xl ring-4", tierRing[b.tier])} aria-hidden>{b.icon}</span>
              <h3 className="mt-3 font-semibold text-navy-900">{b.name}</h3>
              <p className="mt-1 text-xs text-navy-500">{b.description}</p>
              <Badge tone={b.earned ? "green" : "grey"} className="mt-2">{b.earned ? "Earned" : b.criteria}</Badge>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Certificates</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Counting Champion — Stage 1", "Addition Explorer — Stage 2"].map((cert) => (
            <div key={cert} className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-accent-300 bg-accent-50/40 p-5">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-accent-500 shadow-sm"><Award className="h-7 w-7" /></span>
              <div>
                <p className="font-display font-semibold text-navy-900">{cert}</p>
                <p className="text-xs text-navy-400">Awarded by Ms Rahman · Bright Horizons</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
