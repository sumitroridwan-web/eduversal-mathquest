"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ChildSelector } from "@/components/dashboards/ChildSelector";
import { badges } from "@/data/school";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

export default function ParentAchievements() {
  return (
    <div className="space-y-6">
      <PageHeading title="Achievements" description="Celebrate the badges and certificates your child has earned." />
      <ChildSelector />

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Quest Badges</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((b) => (
            <div key={b.id} className={cn("flex flex-col items-center rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-card", !b.earned && "opacity-50")}>
              <span className="text-4xl" aria-hidden>{b.icon}</span>
              <h3 className="mt-2 font-semibold text-navy-900">{b.name}</h3>
              <Badge tone={b.earned ? "green" : "grey"} className="mt-2">{b.earned ? "Earned" : "Locked"}</Badge>
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
