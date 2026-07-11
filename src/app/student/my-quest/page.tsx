"use client";

import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResourceCover } from "@/components/content/ResourceCover";
import { questPaths, getStudent } from "@/data/school";
import { getResource } from "@/data/resources";
import { cn } from "@/lib/utils";
import { Play, Lock, CheckCircle2, Route } from "lucide-react";

export default function MyQuest() {
  const student = getStudent("stu-1");
  const path = questPaths[0];
  const completedSteps = 2;

  return (
    <div className="space-y-6">
      <PageHeading title="My MathQuest Journey" description="Follow your quest step by step and unlock new challenges!" />

      <div className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white"><Route className="h-6 w-6" /></span>
          <div>
            <h2 className="font-display text-xl font-bold text-navy-900">{path.title}</h2>
            <p className="text-sm text-navy-500">{path.description}</p>
          </div>
          <Badge tone="teal" className="ml-auto">{completedSteps}/{path.steps.length} done</Badge>
        </div>

        <div className="space-y-3">
          {path.steps.map((step, i) => {
            const r = getResource(step.resourceId);
            if (!r) return null;
            const done = i < completedSteps;
            const current = i === completedSteps;
            const locked = i > completedSteps;
            return (
              <div key={step.resourceId} className={cn("flex items-center gap-4 rounded-2xl border p-3", current ? "border-accent-300 bg-accent-50" : "border-navy-100 bg-white", locked && "opacity-60")}>
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold", done ? "bg-teal-600 text-white" : current ? "bg-accent-400 text-navy-900" : "bg-navy-100 text-navy-400")}>
                  {done ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </span>
                <ResourceCover resource={r} className="h-14 w-14 rounded-xl" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900">{r.title}</p>
                  <p className="text-xs text-navy-400">{step.label} · {r.durationMins} min</p>
                </div>
                {done ? (
                  <Badge tone="green">Completed</Badge>
                ) : current ? (
                  <Button size="sm" asChildHref={`/student/library/${r.id}`}><Play className="h-4 w-4" /> Start</Button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-navy-400"><Lock className="h-3.5 w-3.5" /> Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm text-navy-500">
        Keep going, {student?.firstName}! Complete each step to earn your <strong>Number Bond Hero</strong> badge. 🏅
      </p>
    </div>
  );
}
