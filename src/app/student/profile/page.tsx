"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/stores/auth";
import { useToasts } from "@/stores/ui";
import { getStudent } from "@/data/school";
import { safeAvatars } from "@/data/avatars";
import { cn } from "@/lib/utils";

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const notify = useToasts((s) => s.notify);
  const student = getStudent("stu-1");
  const [avatar, setAvatar] = useState(user?.avatar ?? "🦊");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeading title="My profile" description="Choose your avatar and see your details." />

      <section className="rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-card">
        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-100 to-accent-100 text-6xl" aria-hidden>{avatar}</span>
        <h2 className="mt-4 font-display text-xl font-bold text-navy-900">{user?.firstName}</h2>
        <p className="text-sm text-navy-500">{user?.gradeLevel ?? student?.gradeLevel} · {student?.className}</p>
        <div className="mt-3 flex justify-center gap-2">
          <Badge tone="accent">⭐ {user?.points ?? student?.points} points</Badge>
          <Badge tone="teal">🏅 {student?.badges} badges</Badge>
          <Badge tone="navy">🔥 {student?.streak}-day streak</Badge>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <h3 className="mb-3 font-display font-semibold text-navy-900">Choose your avatar</h3>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {safeAvatars.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={cn("flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition hover:bg-teal-50", avatar === a ? "bg-teal-100 ring-2 ring-teal-500" : "bg-surface-soft")}
              aria-label={`Choose ${a}`}
              aria-pressed={avatar === a}
            >
              {a}
            </button>
          ))}
        </div>
        <Button className="mt-4" onClick={() => { updateUser({ avatar }); notify({ variant: "success", title: "Avatar saved!", description: "Looking great! 🎉" }); }}>
          Save avatar
        </Button>
      </section>
    </div>
  );
}
