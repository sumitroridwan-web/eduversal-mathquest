"use client";

import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChartCard } from "@/components/dashboards/ChartCard";
import { ChildSelector } from "@/components/dashboards/ChildSelector";
import { BarSeries } from "@/components/charts/Charts";
import { ProgressBar } from "@/components/ui/Progress";
import { useParent } from "@/stores/parent";
import { getStudent } from "@/data/school";
import { weeklyLearningTime } from "@/data/analytics";
import { badges, studentAssignments } from "@/data/school";
import { resources } from "@/data/resources";
import { CheckCircle2, Clock, ThumbsUp, TriangleAlert, Quote, ArrowRight } from "lucide-react";

export default function ParentDashboard() {
  const childId = useParent((s) => s.selectedChildId);
  const child = getStudent(childId);
  if (!child) return null;

  const homeLearning = resources.filter((r) =>
    ["res-tenframe", "res-book-fraction-feast", "res-numberline"].includes(r.id),
  );
  const completed = studentAssignments.filter((a) => a.status === "completed").length;
  const pending = studentAssignments.filter((a) => a.status !== "completed").length;

  return (
    <div className="space-y-6">
      <PageHeading title="Your child's learning" description="Track progress, celebrate wins and support at home." />
      <ChildSelector />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current level" value={child.gradeLevel} icon="GraduationCap" tone="navy" hint={child.className} />
        <StatCard label="Overall progress" value={`${child.progress}%`} icon="TrendingUp" tone="teal" delta={{ value: "6%", direction: "up" }} />
        <StatCard label="Completed activities" value={completed} icon="CircleCheck" tone="accent" />
        <StatCard label="This week" value="113 min" icon="Clock" tone="navy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Learning time this week" description="Minutes spent on MathQuest" className="lg:col-span-2">
          <BarSeries data={weeklyLearningTime} xKey="day" bars={[{ key: "minutes", label: "Minutes", color: "teal" }]} />
        </ChartCard>
        <ChartCard title="Progress by strand">
          <div className="space-y-4 pt-2">
            {child.strandMastery.map((s) => (
              <div key={s.strand}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-navy-700">{s.strand === "Early Mathematical Experiences" ? "Early Maths" : s.strand}</span>
                  <span className="font-semibold text-navy-900">{s.mastery}%</span>
                </div>
                <ProgressBar value={s.mastery} tone={s.mastery > 65 ? "teal" : "accent"} />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Strengths & next steps */}
        <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-teal-700">
            <ThumbsUp className="h-5 w-5" />
            <h3 className="font-display font-semibold text-navy-900">Strengths</h3>
          </div>
          <ul className="space-y-2 text-sm text-navy-700">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> Confident counting & number bonds</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> Strong addition strategies</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> Great persistence in games</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-amber-700">
            <TriangleAlert className="h-5 w-5" />
            <h3 className="font-display font-semibold text-navy-900">Next steps</h3>
          </div>
          <ul className="space-y-2 text-sm text-navy-700">
            <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> Practise subtraction within 20</li>
            <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> Explore early fractions</li>
            <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> Read a MathQuest book together</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center gap-2 text-navy-700">
            <Quote className="h-5 w-5 text-teal-600" />
            <h3 className="font-display font-semibold text-navy-900">Teacher feedback</h3>
          </div>
          <p className="text-sm italic text-navy-700">
            “{child.firstName} is making lovely progress in Number. A little subtraction practice at
            home would help build confidence.”
          </p>
          <p className="mt-3 text-xs font-medium text-navy-500">— Ms Rahman · {child.className}</p>
        </section>
      </div>

      {/* Assignments summary + home learning */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-navy-900">Recent activities</h3>
            <Badge tone="grey">{completed} done · {pending} pending</Badge>
          </div>
          <ul className="space-y-2">
            {studentAssignments.map((a) => (
              <li key={a.assignmentId} className="flex items-center justify-between rounded-xl border border-navy-100 p-3 text-sm">
                <div>
                  <p className="font-medium text-navy-900">{a.resourceTitle}</p>
                  <p className="text-xs text-navy-400">{a.title}</p>
                </div>
                <Badge tone={a.status === "completed" ? "green" : a.status === "in-progress" ? "teal" : a.status === "needs-review" ? "amber" : "grey"}>
                  {a.descriptor ?? a.status}
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-navy-900">Suggested home learning</h3>
            <Button variant="ghost" size="sm" asChildHref="/parent/home-learning">More <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <ul className="space-y-3">
            {homeLearning.map((r) => (
              <li key={r.id} className="rounded-xl border border-navy-100 p-3">
                <p className="font-medium text-navy-900">{r.title}</p>
                <p className="mt-0.5 text-xs text-navy-500">{r.parentGuidance ?? r.objective.parent}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Badges */}
      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent-500" />
          <h3 className="font-display font-semibold text-navy-900">Recent Quest Badges &amp; certificates</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {badges.filter((b) => b.earned).map((b) => (
            <div key={b.id} className="flex items-center gap-2 rounded-xl bg-accent-50 px-3 py-2">
              <span className="text-2xl" aria-hidden>{b.icon}</span>
              <div>
                <p className="text-sm font-semibold text-navy-900">{b.name}</p>
                <p className="text-[11px] text-navy-400">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
