"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResourceCover } from "@/components/content/ResourceCover";
import { resources } from "@/data/resources";
import { stageLabel } from "@/lib/content";
import { Home, Lightbulb } from "lucide-react";

export default function HomeLearning() {
  const suggestions = resources.filter((r) =>
    ["res-tenframe", "res-book-fraction-feast", "res-numberline", "res-counting-objects", "res-book-garden", "res-money-shop"].includes(r.id) || r.parentGuidance,
  ).slice(0, 6);

  const tips = [
    "Count everyday objects — stairs, grapes, toys — and ask 'how many altogether?'",
    "Spot shapes and numbers on a walk or in the kitchen.",
    "Play a quick maths game together for 10 minutes, not an hour.",
    "Praise effort and strategies, not just correct answers.",
  ];

  return (
    <div className="space-y-6">
      <PageHeading title="Home learning" description="Simple, practical ways to support your child's Maths at home." />

      <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
        <div className="mb-3 flex items-center gap-2 text-teal-700">
          <Lightbulb className="h-5 w-5" />
          <h2 className="font-display font-semibold text-navy-900">Everyday tips</h2>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {tips.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-navy-700"><Home className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> {t}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Suggested activities</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              <ResourceCover resource={r} className="h-24 w-full" size="sm" />
              <div className="p-4">
                <div className="mb-1 flex gap-1.5"><Badge tone="teal">{stageLabel(r)}</Badge></div>
                <h3 className="font-semibold text-navy-900">{r.title}</h3>
                <p className="mt-1 text-sm text-navy-500">{r.parentGuidance ?? r.objective.parent}</p>
                <Button size="sm" variant="outline" className="mt-3" asChildHref="/parent/progress">See progress</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
