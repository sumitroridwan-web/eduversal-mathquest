import type { Metadata } from "next";
import { CheckCircle2, Building2, GraduationCap, LineChart, ShieldCheck } from "lucide-react";
import { MarketingHero } from "@/components/layout/MarketingHero";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "For Schools" };

const outcomes = [
  { icon: Building2, title: "Whole-school visibility", body: "Managers see curriculum coverage by stage, class, teacher and strand in one place." },
  { icon: GraduationCap, title: "Teacher time saved", body: "Ready-mapped resources and one-click assignments reduce planning workload." },
  { icon: LineChart, title: "Evidence of progress", body: "Track learning by objective, identify gaps early and celebrate achievement." },
  { icon: ShieldCheck, title: "Safe & compliant", body: "Role-scoped access, no advertising, and data kept within your school." },
];

const plan = [
  "Unlimited access to Games, Simulations and Books",
  "Class, group and individual assignments",
  "Quest Path learning journeys",
  "Curriculum coverage & progress reports",
  "School Manager oversight dashboard",
  "Parent access and home-learning guides",
  "Badges, points and certificates",
  "Priority onboarding support",
];

const steps = [
  { step: "1", title: "Request access", body: "Tell us about your school and stages you teach." },
  { step: "2", title: "Onboard your team", body: "We set up your school, classes, teachers and invitation codes." },
  { step: "3", title: "Start teaching", body: "Assign resources and watch progress build from day one." },
];

export default function ForSchoolsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="For schools"
        title="Bring curriculum-aligned, interactive Maths to your whole primary school."
        subtitle="A single secure platform for leaders, teachers, students and parents — designed around real classroom practice."
      />

      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o) => (
            <div key={o.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <o.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-navy-900">{o.title}</h3>
              <p className="mt-1 text-sm text-navy-500">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-navy-100 bg-surface-soft py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <Badge tone="teal" className="mb-3">School plan</Badge>
            <h2 className="font-display text-2xl font-bold text-navy-900">What&apos;s included</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {plan.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-navy-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
            <h3 className="font-display text-lg font-semibold text-navy-900">Getting started is simple</h3>
            <ol className="mt-6 space-y-5">
              {steps.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{s.title}</p>
                    <p className="text-sm text-navy-500">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button className="mt-8 w-full" size="lg" asChildHref="/contact">
              Request school access
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
