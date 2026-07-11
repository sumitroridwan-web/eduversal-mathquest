"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock, Star, Heart, Plus, Target, User, Users, Brain,
  BookOpen, Lightbulb, CheckCircle2, ListChecks, Sparkles, GraduationCap,
} from "lucide-react";
import type { Resource, Role } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ResourceCover } from "./ResourceCover";
import { ResourceCard } from "./ResourceCard";
import { ActivityPlayer } from "./ActivityPlayer";
import { AssignModal } from "./AssignModal";
import { getResources } from "@/data/resources";
import { programmeLabel, stageLabel, typeLabel, difficultyTone } from "@/lib/content";
import { useFavourites, useToasts } from "@/stores/ui";
import { cn } from "@/lib/utils";

export function ResourceDetail({
  resource,
  basePath,
  role,
}: {
  resource: Resource;
  basePath: string;
  role: Role;
}) {
  const { has, toggle } = useFavourites();
  const notify = useToasts((s) => s.notify);
  const [tab, setTab] = useState("play");
  const [assignOpen, setAssignOpen] = useState(false);
  const fav = has(resource.id);
  const related = getResources(resource.relatedIds);
  const canAssign = role === "teacher" || role === "admin";

  const tabs = [
    { id: "play", label: resource.type === "book" ? "Read" : "Play" },
    { id: "curriculum", label: "Curriculum" },
    { id: "teacher", label: "Teacher guide" },
    { id: "parent", label: "Parent guide" },
  ];

  const backHref =
    resource.type === "game" ? `${basePath}/games`
    : resource.type === "simulation" ? `${basePath}/simulations`
    : `${basePath}/books`;

  return (
    <div className="space-y-6">
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-800">
        <ArrowLeft className="h-4 w-4" /> Back to {typeLabel[resource.type]}s
      </Link>

      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <div className="grid gap-0 md:grid-cols-[280px_1fr]">
          <ResourceCover cover={resource.cover} type={resource.type} className="h-48 w-full md:h-full" size="lg" />
          <div className="p-6">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge tone="navy">{typeLabel[resource.type]}</Badge>
              <Badge tone="teal">{stageLabel(resource)}</Badge>
              <Badge tone="grey">{resource.strand === "Early Mathematical Experiences" ? "Early Maths" : resource.strand}</Badge>
              <Badge tone={difficultyTone[resource.difficulty]}>{resource.difficulty}</Badge>
              {resource.status !== "published" && <Badge tone="amber" className="capitalize">{resource.status}</Badge>}
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-900">{resource.title}</h1>
            <p className="mt-1 text-navy-500">{programmeLabel(resource)} · {resource.topic}</p>
            <p className="mt-3 text-navy-700">“{resource.objective.student}”</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-navy-500">
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {resource.durationMins} min</span>
              {resource.rating != null && <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-accent-400 text-accent-400" /> {resource.rating}</span>}
              <span className="font-mono text-xs text-navy-400">{resource.curriculumRef}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => setTab("play")}>
                <Sparkles className="h-4 w-4" /> {resource.type === "book" ? "Start reading" : "Start activity"}
              </Button>
              {canAssign && (
                <Button variant="outline" onClick={() => setAssignOpen(true)}>
                  <Plus className="h-4 w-4" /> Assign
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  toggle(resource.id);
                  notify({ variant: "success", title: fav ? "Removed from favourites" : "Added to favourites" });
                }}
              >
                <Heart className={cn("h-4 w-4", fav && "fill-rose-500 text-rose-500")} /> {fav ? "Favourited" : "Favourite"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} className="w-fit" />

      {tab === "play" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityPlayer resource={resource} />
          </div>
          <div className="space-y-4">
            <InfoBox icon={Target} title="Learning objective (I can…)" tone="teal">
              {resource.objective.student}
            </InfoBox>
            {resource.vocabulary.length > 0 && (
              <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900"><BookOpen className="h-4 w-4 text-navy-500" /> Key vocabulary</h3>
                <div className="flex flex-wrap gap-1.5">
                  {resource.vocabulary.map((v) => <Badge key={v} tone="grey">{v}</Badge>)}
                </div>
              </div>
            )}
            {resource.thinkPrompt && (
              <InfoBox icon={Brain} title="Think like a mathematician" tone="accent">
                {resource.thinkPrompt}
              </InfoBox>
            )}
          </div>
        </div>
      )}

      {tab === "curriculum" && <CurriculumTab resource={resource} />}

      {tab === "teacher" && (
        <div className="grid gap-4 md:grid-cols-2">
          <InfoBox icon={GraduationCap} title="Teacher objective" tone="navy">{resource.objective.teacher}</InfoBox>
          {resource.teacherNotes && <InfoBox icon={Lightbulb} title="Facilitation notes" tone="teal">{resource.teacherNotes}</InfoBox>}
          {resource.teachingApproach && <InfoBox icon={ListChecks} title="Teaching approach" tone="navy">{resource.teachingApproach}</InfoBox>}
          {resource.assessmentMethod && <InfoBox icon={CheckCircle2} title="Assessment method" tone="navy">{resource.assessmentMethod}</InfoBox>}
          {resource.evidenceOfLearning && <InfoBox icon={CheckCircle2} title="Evidence of learning" tone="teal">{resource.evidenceOfLearning}</InfoBox>}
          {resource.discussionPrompts && resource.discussionPrompts.length > 0 && (
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card md:col-span-2">
              <h3 className="mb-2 font-semibold text-navy-900">Discussion prompts</h3>
              <ul className="space-y-1.5">
                {resource.discussionPrompts.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-navy-600"><span className="text-teal-500">?</span> {p}</li>
                ))}
              </ul>
            </div>
          )}
          {(resource.supportActivity || resource.extensionActivity) && (
            <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
              {resource.supportActivity && <InfoBox icon={Users} title="Support activity" tone="teal">{resource.supportActivity}</InfoBox>}
              {resource.extensionActivity && <InfoBox icon={Sparkles} title="Extension activity" tone="accent">{resource.extensionActivity}</InfoBox>}
            </div>
          )}
          {resource.observationIndicators && (
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card md:col-span-2">
              <h3 className="mb-2 font-semibold text-navy-900">Observation indicators</h3>
              <ul className="space-y-1.5">
                {resource.observationIndicators.map((o) => (
                  <li key={o} className="flex gap-2 text-sm text-navy-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /> {o}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === "parent" && (
        <div className="grid gap-4 md:grid-cols-2">
          <InfoBox icon={User} title="What your child is learning" tone="teal">{resource.objective.parent}</InfoBox>
          {resource.parentGuidance && <InfoBox icon={Heart} title="How to help at home" tone="accent">{resource.parentGuidance}</InfoBox>}
          {resource.materials && (
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h3 className="mb-2 font-semibold text-navy-900">Things you might use</h3>
              <ul className="space-y-1.5">
                {resource.materials.map((m) => <li key={m} className="flex gap-2 text-sm text-navy-600"><span>•</span> {m}</li>)}
              </ul>
            </div>
          )}
          {resource.offlineExtension && <InfoBox icon={Sparkles} title="Away-from-screen idea" tone="navy">{resource.offlineExtension}</InfoBox>}
          {resource.nextStep && <InfoBox icon={Target} title="Next learning step" tone="teal">{resource.nextStep}</InfoBox>}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-navy-900">Related resources</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ResourceCard key={r.id} resource={r} basePath={basePath} role={role} onAssign={() => setAssignOpen(true)} />
            ))}
          </div>
        </section>
      )}

      <AssignModal resource={assignOpen ? resource : null} open={assignOpen} onClose={() => setAssignOpen(false)} />
    </div>
  );
}

function CurriculumTab({ resource }: { resource: Resource }) {
  const rows: [string, string | undefined][] = [
    ["Programme", programmeLabel(resource)],
    ["Stage / Age band", stageLabel(resource)],
    ["Grade level", resource.gradeLevel],
    ["Strand", resource.strand],
    ["Sub-strand", resource.subStrand],
    ["Topic", resource.topic],
    ["Curriculum reference", resource.curriculumRef],
    ["Thinking & Working Mathematically", resource.twm],
    ["Learning purpose", resource.learningPurpose],
    ["Difficulty", resource.difficulty],
    ["Duration", `${resource.durationMins} minutes`],
    ["Prerequisites", resource.prerequisites],
    ["Review date", resource.reviewDate],
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card lg:col-span-2">
        <h3 className="mb-3 font-semibold text-navy-900">Curriculum mapping</h3>
        <dl className="divide-y divide-navy-50">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2 text-sm">
              <dt className="text-navy-500">{k}</dt>
              <dd className="text-right font-medium text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h3 className="mb-2 font-semibold text-navy-900">The three objectives</h3>
          <div className="space-y-3 text-sm">
            <div><p className="text-xs font-semibold uppercase text-navy-400">Teacher</p><p className="text-navy-700">{resource.objective.teacher}</p></div>
            <div><p className="text-xs font-semibold uppercase text-navy-400">Student (I can)</p><p className="text-navy-700">{resource.objective.student}</p></div>
            <div><p className="text-xs font-semibold uppercase text-navy-400">Parent</p><p className="text-navy-700">{resource.objective.parent}</p></div>
          </div>
        </div>
        {(resource.reasoningPrompt || resource.reflectionPrompt) && (
          <div className="rounded-2xl border border-accent-200 bg-accent-50/40 p-5">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900"><Brain className="h-4 w-4 text-accent-600" /> Reasoning prompts</h3>
            <ul className="space-y-1.5 text-sm text-navy-700">
              {resource.reasoningPrompt && <li>🧠 {resource.reasoningPrompt}</li>}
              {resource.reflectionPrompt && <li>🔍 {resource.reflectionPrompt}</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({
  icon: I, title, tone, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone: "navy" | "teal" | "accent";
  children: React.ReactNode;
}) {
  const tones = {
    navy: "bg-navy-50 text-navy-700",
    teal: "bg-teal-50 text-teal-600",
    accent: "bg-accent-50 text-accent-600",
  };
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", tones[tone])}>
          <I className="h-4 w-4" />
        </span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-navy-600">{children}</p>
    </div>
  );
}
