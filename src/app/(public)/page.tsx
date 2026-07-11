import Link from "next/link";
import {
  Gamepad2,
  FlaskConical,
  BookOpen,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  GraduationCap,
  Heart,
  Building2,
  CheckCircle2,
  Compass,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ResourceCover } from "@/components/content/ResourceCover";
import { HeroScene } from "@/components/marketing/HeroScene";
import { brand } from "@/config/brand";
import { games, simulations, books } from "@/data/resources";
import { stageLabel } from "@/lib/content";
import type { Resource } from "@/types";

const previewTabs = [
  { key: "games", label: "MathQuest Games", icon: Gamepad2, items: games.slice(0, 3), iconClass: "bg-accent-50 text-accent-600", desc: "Playful challenges that build fluency and confidence." },
  { key: "simulations", label: "MathQuest Simulations", icon: FlaskConical, items: simulations.slice(0, 3), iconClass: "bg-teal-50 text-teal-600", desc: "Hands-on virtual manipulatives for deep understanding." },
  { key: "books", label: "MathQuest Books", icon: BookOpen, items: books.slice(0, 3), iconClass: "bg-navy-50 text-navy-700", desc: "Interactive digital stories with checkpoint questions." },
];

const steps = [
  { icon: Compass, title: "Explore & Assign", body: "Teachers browse curriculum-aligned games, simulations and books, then assign a Quest Path in a few clicks." },
  { icon: Target, title: "Play & Learn", body: "Learners work through visual, interactive activities with clear instructions and instant, encouraging feedback." },
  { icon: Trophy, title: "Track & Celebrate", body: "Progress is tracked by objective and strand. Learners earn badges; teachers and parents see clear next steps." },
];

const benefits = [
  { icon: Building2, role: "Schools", points: ["Whole-school curriculum coverage view", "Programme implementation insight", "Secure, GDPR-minded data handling"] },
  { icon: GraduationCap, role: "Teachers", points: ["Ready-made, mapped resources", "One-click assignments & Quest Paths", "Live class & individual reports"] },
  { icon: Users, role: "Students", points: ["Safe, ad-free learning space", "Immediate formative feedback", "Badges, points and quests"] },
  { icon: Heart, role: "Parents", points: ["See progress at a glance", "Home-learning suggestions", "Teacher feedback & celebrations"] },
];

const testimonials = [
  { quote: "MathQuest made curriculum coverage visible for the first time. Our Stage 2 teachers plan with real confidence now.", name: "Head of Primary", org: "International School (placeholder)" },
  { quote: "My daughter asks to do her 'maths quest' after school. The badges keep her motivated and I can see exactly what she's learning.", name: "Parent of a Grade 3 learner", org: "Placeholder testimonial" },
  { quote: "The simulations are brilliant for concrete-pictorial-abstract teaching. Fractions finally clicked for my class.", name: "Stage 4 Teacher", org: "Placeholder testimonial" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-navy-100 bg-white">
        <div className="math-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl" aria-hidden />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-in">
            <Badge tone="teal" className="mb-4">
              <Sparkles className="h-3.5 w-3.5" /> {brand.owner}
            </Badge>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-navy-950 sm:text-5xl lg:text-6xl">
              {brand.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-600">
              {brand.name} is a secure, interactive Mathematics platform for Cambridge Early Years and
              Primary learners. Explore <strong>games</strong>, <strong>simulations</strong> and{" "}
              <strong>digital books</strong> — all aligned to the curriculum.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="primary" asChildHref="/sign-up">
                Start Your MathQuest <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChildHref="/explore">
                Explore Preview
              </Button>
              <Button size="lg" variant="ghost" asChildHref="/login">
                Login
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-teal-600" /> Child-safe & ad-free</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Curriculum-aligned</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-teal-600" /> Built for classrooms</span>
            </div>
          </div>

          {/* Interactive hero scene */}
          <div className="relative mt-6 lg:mt-0">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* Preview cards (locked before login) */}
      <section className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900">Three ways to master Maths</h2>
          <p className="mt-3 text-navy-500">
            A preview of the library. <strong>Log in</strong> to unlock full activities, assignments and progress tracking.
          </p>
        </div>

        <div className="mt-12 space-y-14">
          {previewTabs.map((tab) => (
            <div key={tab.key} id={tab.key}>
              <div className="mb-6 flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tab.iconClass}`}>
                  <tab.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy-900">{tab.label}</h3>
                  <p className="text-sm text-navy-500">{tab.desc}</p>
                </div>
                <Button variant="ghost" size="sm" asChildHref="/explore" className="ml-auto hidden sm:inline-flex">
                  See all <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {tab.items.map((r) => (
                  <PreviewCard key={r.id} resource={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-navy-100 bg-white py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="accent" className="mb-3">How MathQuest works</Badge>
            <h2 className="font-display text-3xl font-bold text-navy-900">From lesson plan to celebration</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-navy-100 bg-surface-soft p-6">
                <span className="absolute right-5 top-5 font-display text-4xl font-bold text-navy-100">{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm text-navy-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900">Built for everyone in the school community</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.role} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">{b.role}</h3>
              <ul className="mt-3 space-y-2">
                {b.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-navy-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum statement */}
      <section className="border-y border-navy-100 bg-navy-950 py-16 text-white lg:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge tone="teal" className="mb-4 bg-teal-500/15 text-teal-300 ring-teal-500/30">
              Curriculum aligned
            </Badge>
            <h2 className="font-display text-3xl font-bold">Mapped to Cambridge Early Years &amp; Primary Mathematics</h2>
            <p className="mt-4 max-w-xl text-white/70">
              Every resource is mapped to a stage or age band, a Mathematics strand and an original
              Eduversal learning-objective summary — with configurable curriculum reference codes and
              embedded <em>Thinking &amp; Working Mathematically</em> prompts.
            </p>
            <Button variant="accent" className="mt-6" asChildHref="/features">
              See the curriculum features <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Number", "Geometry & Measure", "Statistics & Probability", "Algebra"].map((strand) => (
              <div key={strand} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-display font-semibold text-white">{strand}</p>
                <p className="mt-1 text-xs text-white/50">Stages 1–6 + Early Years</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900">Loved by schools and families</h2>
          <p className="mt-2 text-sm text-navy-400">Testimonials are placeholders for this prototype.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <blockquote className="text-sm leading-relaxed text-navy-700">“{t.quote}”</blockquote>
              <figcaption className="mt-4 border-t border-navy-100 pt-4">
                <p className="text-sm font-semibold text-navy-900">{t.name}</p>
                <p className="text-xs text-navy-400">{t.org}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-teal-800 px-8 py-14 text-center text-white">
          <div className="math-grid absolute inset-0 opacity-10" aria-hidden />
          <h2 className="relative font-display text-3xl font-bold sm:text-4xl">Ready to begin the quest?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/75">
            Create a free demo account and explore the full platform in minutes.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="accent" asChildHref="/sign-up">
              Start Your MathQuest
            </Button>
            <Button size="lg" variant="outline" asChildHref="/login" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              Login with a demo account
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function PreviewCard({ resource }: { resource: Resource }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="relative">
        <ResourceCover resource={resource} className="h-32 w-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-navy-950/40 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          <Link href="/login" className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-800">
            <Lock className="h-3.5 w-3.5" /> Login to unlock
          </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          <Badge tone="teal">{stageLabel(resource)}</Badge>
          <Badge tone="grey">{resource.difficulty}</Badge>
        </div>
        <h4 className="font-display text-sm font-semibold text-navy-900">{resource.title}</h4>
        <p className="mt-1 line-clamp-2 text-xs text-navy-500">{resource.objective.student}</p>
      </div>
    </div>
  );
}
