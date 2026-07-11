import type { Metadata } from "next";
import {
  Gamepad2, FlaskConical, BookOpen, Map, ClipboardList, Route,
  BarChart3, Award, ShieldCheck, Brain, Layers, Accessibility,
} from "lucide-react";
import { MarketingHero } from "@/components/layout/MarketingHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Features" };

const contentTypes = [
  { icon: Gamepad2, title: "MathQuest Games", body: "16+ fluency-building games from counting to multi-step problem solving, each with objectives, difficulty and duration." },
  { icon: FlaskConical, title: "MathQuest Simulations", body: "Virtual manipulatives — ten frames, number lines, place-value blocks, fraction bars, clocks and more — with hints, resets and teacher guides." },
  { icon: BookOpen, title: "MathQuest Books", body: "Interactive digital books with table of contents, page navigation, bookmarks, vocabulary help and checkpoint questions." },
];

const platformFeatures = [
  { icon: Map, title: "Curriculum mapping", body: "Filter and map every resource by programme, stage, strand, objective, TWM characteristic and learning purpose." },
  { icon: ClipboardList, title: "Assignments", body: "Assign to a class, group or individual with due dates, differentiation levels and linked objectives." },
  { icon: Route, title: "Quest Paths", body: "Sequence multiple resources into guided learning journeys tailored to each class." },
  { icon: BarChart3, title: "Reports & analytics", body: "Progress by objective and strand, coverage, completion, and students needing support or extension." },
  { icon: Award, title: "Badges & certificates", body: "Motivate learners with points, stars, streaks, badges and celebration certificates." },
  { icon: Brain, title: "Thinking & Working Mathematically", body: "Reasoning, 'Think Like a Mathematician' and reflection prompts embedded in Primary activities." },
];

const trust = [
  { icon: ShieldCheck, title: "Child safety", body: "Ad-free, private, and strictly role-scoped access." },
  { icon: Accessibility, title: "Accessible", body: "Keyboard-friendly, high-contrast and semantic by default." },
  { icon: Layers, title: "Backend-ready", body: "Clean architecture ready to connect to Supabase/PostgreSQL and secure auth." },
];

export default function FeaturesPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Platform features"
        title="Everything a school needs to teach Maths interactively."
        subtitle="Three content libraries plus a full teaching, assignment and analytics toolkit — all curriculum-aligned."
      />

      <section className="container-page py-16">
        <h2 className="font-display text-2xl font-bold text-navy-900">Three content libraries</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {contentTypes.map((c) => (
            <div key={c.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">{c.title}</h3>
              <p className="mt-2 text-sm text-navy-500">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="curriculum" className="border-y border-navy-100 bg-surface-soft py-16">
        <div className="container-page">
          <Badge tone="accent" className="mb-3">Teaching toolkit</Badge>
          <h2 className="font-display text-2xl font-bold text-navy-900">Plan, assign, monitor</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-semibold text-navy-900">{f.title}</h3>
                <p className="mt-1 text-sm text-navy-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <t.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-navy-900">{t.title}</h3>
                <p className="mt-1 text-sm text-navy-500">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button size="lg" asChildHref="/sign-up">Start your free demo</Button>
        </div>
      </section>
    </>
  );
}
