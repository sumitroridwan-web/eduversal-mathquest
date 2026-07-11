import type { Metadata } from "next";
import { Target, Heart, ShieldCheck, Globe2, Sparkles, BookOpen } from "lucide-react";
import { MarketingHero } from "@/components/layout/MarketingHero";
import { Button } from "@/components/ui/Button";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "About" };

const values = [
  { icon: Target, title: "Curriculum first", body: "Every activity is mapped to a clear learning objective, stage and Mathematics strand." },
  { icon: Heart, title: "Child-centred", body: "Playful, age-appropriate design that keeps young learners motivated and confident." },
  { icon: ShieldCheck, title: "Safe by design", body: "Ad-free, private, and role-scoped so children only ever see their own data." },
  { icon: Globe2, title: "Built for real classrooms", body: "Practical tools for teachers, managers and parents — not just another app." },
];

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        eyebrow="About Eduversal MathQuest"
        title="Helping every young learner build a confident, joyful relationship with Maths."
        subtitle={brand.supportingLine}
      />
      <section className="container-page grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 text-navy-700">
          <h2 className="font-display text-2xl font-bold text-navy-900">Our mission</h2>
          <p>
            {brand.name}, managed by Eduversal Indonesia, is an interactive Mathematics learning
            platform for Cambridge Early Years and Cambridge Primary learners aged roughly 3–12. We
            bring together three complementary experiences — <strong>Games</strong>,{" "}
            <strong>Simulations</strong> and <strong>digital Books</strong> — inside one secure,
            curriculum-aligned platform.
          </p>
          <p>
            We believe strong mathematical understanding grows from concrete, hands-on experiences
            before pictorial and abstract representations. Our simulations act as virtual
            manipulatives, our games build fluency through purposeful practice, and our books place
            Maths in rich, language-friendly contexts.
          </p>
          <p>
            For teachers and school leaders, MathQuest makes curriculum coverage visible and
            assignment workflows simple. For parents, it opens a clear window into their child&apos;s
            progress and offers practical home-learning support.
          </p>
          <div className="rounded-2xl border border-navy-100 bg-surface-soft p-6">
            <div className="flex items-center gap-2 text-teal-700">
              <Sparkles className="h-5 w-5" />
              <p className="font-display font-semibold">Original, publisher-independent content</p>
            </div>
            <p className="mt-2 text-sm text-navy-600">
              All learning-objective summaries are written by Eduversal and never reproduce
              copyrighted framework text. Curriculum reference codes are configurable, so schools can
              align content to their own scheme of work.
            </p>
          </div>
        </div>
        <aside className="space-y-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold text-navy-900">{v.title}</h3>
              <p className="mt-1 text-sm text-navy-500">{v.body}</p>
            </div>
          ))}
        </aside>
      </section>
      <section className="border-t border-navy-100 bg-white py-14">
        <div className="container-page flex flex-col items-center gap-4 text-center">
          <BookOpen className="h-8 w-8 text-teal-600" />
          <h2 className="font-display text-2xl font-bold text-navy-900">See how it works in your school</h2>
          <div className="flex gap-3">
            <Button asChildHref="/for-schools">For Schools</Button>
            <Button variant="outline" asChildHref="/contact">Contact us</Button>
          </div>
        </div>
      </section>
    </>
  );
}
