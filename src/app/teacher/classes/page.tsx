"use client";

import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { classes, studentsForClass } from "@/data/school";
import { Users, ArrowRight } from "lucide-react";

export default function TeacherClasses() {
  const myClasses = classes.filter((c) => c.teacherId === "u-teacher");
  return (
    <div className="space-y-6">
      <PageHeading title="My classes" description="Your assigned classes and their overall progress." />
      <div className="grid gap-5 sm:grid-cols-2">
        {myClasses.map((c) => {
          const roster = studentsForClass(c.id);
          const support = roster.filter((s) => s.needsSupport).length;
          return (
            <div key={c.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-900">{c.name}</h3>
                  <p className="text-sm text-navy-400">{c.gradeLevel} · {c.stage}</p>
                </div>
                <Badge tone="teal"><Users className="h-3.5 w-3.5" /> {c.studentIds.length}</Badge>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm"><span className="text-navy-600">Average progress</span><span className="font-semibold text-navy-900">{c.avgProgress}%</span></div>
                <ProgressBar value={c.avgProgress} tone="teal" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {roster.slice(0, 6).map((s) => (
                  <span key={s.id} className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-base ring-2 ring-white" title={s.name}>{s.avatar}</span>
                ))}
                {support > 0 && <Badge tone="amber" className="self-center">{support} need support</Badge>}
              </div>
              <div className="mt-4 flex justify-end border-t border-navy-50 pt-3">
                <Button size="sm" variant="ghost" asChildHref="/teacher/students">View students <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
