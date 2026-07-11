"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/Progress";
import { schools } from "@/data/school";
import { formatNumber, formatDate } from "@/lib/utils";
import { useToasts } from "@/stores/ui";
import { Plus, MapPin, Users } from "lucide-react";

export default function AdminSchools() {
  const notify = useToasts((s) => s.notify);
  return (
    <div className="space-y-6">
      <PageHeading
        title="Schools"
        description="Manage all schools using Eduversal MathQuest."
        actions={<Button onClick={() => notify({ variant: "info", title: "Add school", description: "School onboarding flow is a prototype placeholder." })}><Plus className="h-4 w-4" /> Add school</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total schools" value={schools.length} icon="Building2" tone="navy" />
        <StatCard label="Active" value={schools.filter((s) => s.status === "active").length} icon="CircleCheck" tone="teal" />
        <StatCard label="Total students" value={formatNumber(schools.reduce((a, s) => a + s.students, 0))} icon="Baby" tone="accent" />
        <StatCard label="Total teachers" value={schools.reduce((a, s) => a + s.teachers, 0)} icon="GraduationCap" tone="navy" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {schools.map((s) => (
          <div key={s.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-navy-900">{s.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-navy-400"><MapPin className="h-3.5 w-3.5" /> {s.location}</p>
              </div>
              <Badge tone={s.status === "active" ? "green" : s.status === "onboarding" ? "amber" : "red"}>{s.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-surface-soft p-2"><p className="font-display text-lg font-bold text-navy-900">{s.teachers}</p><p className="text-xs text-navy-400">Teachers</p></div>
              <div className="rounded-xl bg-surface-soft p-2"><p className="font-display text-lg font-bold text-navy-900">{formatNumber(s.students)}</p><p className="text-xs text-navy-400">Students</p></div>
              <div className="rounded-xl bg-surface-soft p-2"><p className="font-display text-lg font-bold text-navy-900">{formatNumber(s.parents)}</p><p className="text-xs text-navy-400">Parents</p></div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm"><span className="flex items-center gap-1 text-navy-600"><Users className="h-3.5 w-3.5" /> Active students</span><span className="font-semibold text-navy-900">{Math.round((s.activeStudents / s.students) * 100)}%</span></div>
              <ProgressBar value={(s.activeStudents / s.students) * 100} tone="teal" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-3 text-xs text-navy-400">
              <span>Manager: {s.managerName}</span>
              <span>Joined {formatDate(s.joined)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
