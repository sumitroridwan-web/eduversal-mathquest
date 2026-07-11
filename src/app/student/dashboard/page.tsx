"use client";

import Link from "next/link";
import { useState } from "react";
import { Play, Star, Flame, Trophy, Target, Sparkles, ArrowRight, Quote } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar, RingProgress } from "@/components/ui/Progress";
import { ResourceCover } from "@/components/content/ResourceCover";
import { Modal } from "@/components/ui/Modal";
import { resources, getResource } from "@/data/resources";
import { badges, studentAssignments, getStudent } from "@/data/school";
import { topicMastery } from "@/data/analytics";
import { safeAvatars } from "@/data/avatars";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const student = getStudent("stu-1");
  const [avatarOpen, setAvatarOpen] = useState(false);

  const todaysQuest = getResource("res-addition-race")!;
  const recommended = resources.filter((r) =>
    ["res-fraction-pizza", "res-number-hunt", "res-book-shape-city"].includes(r.id),
  );
  const earnedBadges = badges.filter((b) => b.earned);
  const assigned = studentAssignments.filter((a) => a.status !== "completed").slice(0, 3);
  const points = user?.points ?? student?.points ?? 0;
  const weeklyGoal = 5;
  const weeklyDone = 3;

  return (
    <div className="space-y-6">
      {/* Greeting hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 to-teal-800 p-6 text-white sm:p-8">
        <div className="math-grid absolute inset-0 opacity-10" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAvatarOpen(true)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl ring-2 ring-white/30 transition hover:ring-accent-400"
              aria-label="Change avatar"
            >
              {user?.avatar ?? "🦊"}
            </button>
            <div>
              <p className="text-sm text-white/70">Welcome back,</p>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{user?.firstName ?? "Explorer"}! 👋</h1>
              <div className="mt-1 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-accent-400 text-accent-400" /> {points} points</span>
                <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4 text-accent-400" /> {student?.streak ?? 0}-day streak</span>
                <span className="inline-flex items-center gap-1"><Trophy className="h-4 w-4 text-accent-400" /> {earnedBadges.length} badges</span>
              </div>
            </div>
          </div>
          <Button variant="accent" size="lg" asChildHref={`/student/games`}>
            <Play className="h-5 w-5" /> Continue learning
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Quest */}
        <section className="rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-600" />
            <h2 className="font-display text-lg font-semibold text-navy-900">Today&apos;s Quest</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ResourceCover cover={todaysQuest.cover} type={todaysQuest.type} className="h-28 w-full rounded-xl sm:w-40" />
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-navy-900">{todaysQuest.title}</h3>
              <p className="mt-1 text-sm text-navy-600">“{todaysQuest.objective.student}”</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="teal">{todaysQuest.durationMins} min</Badge>
                <Badge tone="grey">{todaysQuest.strand}</Badge>
                <Badge tone="accent">{todaysQuest.difficulty}</Badge>
              </div>
              <Button className="mt-4" asChildHref={`/student/library/${todaysQuest.id}`}>
                <Play className="h-4 w-4" /> Start today&apos;s quest
              </Button>
            </div>
          </div>
        </section>

        {/* Weekly goal */}
        <section className="flex flex-col items-center justify-center rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-card">
          <div className="mb-2 flex items-center gap-2 text-navy-700">
            <Target className="h-5 w-5 text-teal-600" />
            <h2 className="font-display font-semibold">Weekly goal</h2>
          </div>
          <RingProgress value={(weeklyDone / weeklyGoal) * 100} size={110} stroke={10} label={`${weeklyDone}/${weeklyGoal}`} />
          <p className="mt-2 text-sm text-navy-500">Quests this week</p>
          <p className="text-xs text-navy-400">{weeklyGoal - weeklyDone} more to reach your goal! 🎯</p>
        </section>
      </div>

      {/* My MathQuest Journey */}
      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-900">My MathQuest Journey</h2>
          <Button variant="ghost" size="sm" asChildHref="/student/my-quest">See full quest <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {["Ten Frames", "Number Line", "Addition Race", "Subtraction", "Place Value"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex min-w-[110px] flex-col items-center gap-1.5">
                <span className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold",
                  i < 3 ? "bg-teal-600 text-white" : i === 3 ? "bg-accent-400 text-navy-900 ring-4 ring-accent-100" : "bg-navy-100 text-navy-400",
                )}>
                  {i < 3 ? "✓" : i + 1}
                </span>
                <span className="text-center text-xs font-medium text-navy-600">{step}</span>
              </div>
              {i < 4 && <div className={cn("h-1 w-8 rounded", i < 3 ? "bg-teal-500" : "bg-navy-100")} />}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assigned */}
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900">Your assigned quests</h2>
          <ul className="space-y-3">
            {assigned.map((a) => {
              const res = resources.find((r) => r.title === a.resourceTitle);
              return (
                <li key={a.assignmentId} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3">
                  {res && <ResourceCover cover={res.cover} type={res.type} className="h-12 w-12 rounded-lg" size="sm" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy-900">{a.resourceTitle}</p>
                    <p className="text-xs text-navy-400">{a.title}</p>
                  </div>
                  <Badge tone={a.status === "in-progress" ? "teal" : a.status === "needs-review" ? "amber" : "grey"}>
                    {a.status === "not-started" ? "New" : a.status === "in-progress" ? "Continue" : "Review"}
                  </Badge>
                  <Button size="sm" variant="outline" asChildHref="/student/assignments">Open</Button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Teacher encouragement */}
        <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
          <div className="mb-2 flex items-center gap-2 text-teal-700">
            <Quote className="h-5 w-5" />
            <h2 className="font-display font-semibold">From your teacher</h2>
          </div>
          <p className="text-sm italic text-navy-700">
            “Brilliant work on your addition strategies this week, {user?.firstName}! Keep using your
            make-ten trick — you&apos;re ready to try some trickier problems. 🌟”
          </p>
          <p className="mt-3 text-xs font-medium text-navy-500">— Ms Rahman</p>
        </section>
      </div>

      {/* Badges + Progress by topic */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-900">Quest Badges</h2>
            <Button variant="ghost" size="sm" asChildHref="/student/achievements">All badges <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {badges.slice(0, 8).map((b) => (
              <div key={b.id} className={cn("flex flex-col items-center gap-1 rounded-xl p-2 text-center", b.earned ? "bg-accent-50" : "opacity-40")}>
                <span className="text-3xl" aria-hidden>{b.icon}</span>
                <span className="text-[10px] font-medium leading-tight text-navy-600">{b.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900">Progress by topic</h2>
          <div className="space-y-3">
            {topicMastery.slice(0, 5).map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-navy-700">{t.topic}</span>
                  <span className="font-semibold text-navy-900">{t.mastery}%</span>
                </div>
                <ProgressBar value={t.mastery} tone={t.mastery > 70 ? "teal" : "accent"} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recommended */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Recommended for you</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {recommended.map((r) => (
            <Link key={r.id} href={`/student/library/${r.id}`} className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              <ResourceCover cover={r.cover} type={r.type} className="h-24 w-full" size="sm" />
              <div className="p-4">
                <p className="font-semibold text-navy-900 group-hover:text-teal-700">{r.title}</p>
                <p className="mt-0.5 text-xs text-navy-400">{r.type === "book" ? "Book" : r.type === "game" ? "Game" : "Simulation"} · {r.durationMins} min</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Avatar picker */}
      <Modal open={avatarOpen} onClose={() => setAvatarOpen(false)} title="Choose your avatar" description="Pick a friendly character to represent you.">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {safeAvatars.map((a) => (
            <button
              key={a}
              onClick={() => { updateUser({ avatar: a }); setAvatarOpen(false); }}
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition hover:bg-teal-50",
                user?.avatar === a ? "bg-teal-100 ring-2 ring-teal-500" : "bg-surface-soft",
              )}
              aria-label={`Choose ${a}`}
            >
              {a}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
