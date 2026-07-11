"use client";

import { useState } from "react";
import { RotateCcw, Lightbulb, Check, X, ChevronLeft, ChevronRight, Bookmark, Trophy } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { useToasts } from "@/stores/ui";
import { cn } from "@/lib/utils";

/**
 * A lightweight, genuinely interactive demo player that adapts to the
 * resource type. It's a prototype stand-in for the full activity engine —
 * but every control works (no dead buttons).
 */
export function ActivityPlayer({ resource }: { resource: Resource }) {
  if (resource.type === "book") return <BookReader resource={resource} />;
  if (resource.type === "simulation") return <TenFrameSim resource={resource} />;
  return <QuizGame resource={resource} />;
}

// ---------- Game: simple addition/number quiz ----------
function makeQuestions(seed: string) {
  // deterministic small question set derived from the id length
  const base = seed.length;
  return [
    { q: `${(base % 7) + 3} + ${(base % 5) + 2} = ?`, a: (base % 7) + 3 + ((base % 5) + 2) },
    { q: `${(base % 6) + 5} + ${(base % 4) + 1} = ?`, a: (base % 6) + 5 + ((base % 4) + 1) },
    { q: `${(base % 8) + 2} + ${(base % 3) + 4} = ?`, a: (base % 8) + 2 + ((base % 3) + 4) },
    { q: `${(base % 5) + 6} + ${(base % 6) + 2} = ?`, a: (base % 5) + 6 + ((base % 6) + 2) },
  ];
}

function QuizGame({ resource }: { resource: Resource }) {
  const notify = useToasts((s) => s.notify);
  const questions = makeQuestions(resource.id);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [done, setDone] = useState(false);

  const current = questions[index];
  const options = buildOptions(current.a, resource.id + index);

  const answer = (value: number) => {
    if (feedback) return;
    const correct = value === current.a;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      if (index + 1 >= questions.length) {
        setDone(true);
        notify({ variant: "success", title: "Quest complete!", description: `You scored ${score + (correct ? 1 : 0)}/${questions.length}.` });
      } else {
        setIndex((i) => i + 1);
      }
    }, 900);
  };

  const restart = () => { setIndex(0); setScore(0); setDone(false); setFeedback(null); setShowHint(false); };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center rounded-2xl bg-gradient-to-br from-navy-900 to-teal-800 p-8 text-center text-white">
        <Trophy className="h-14 w-14 text-accent-400" />
        <h3 className="mt-4 font-display text-2xl font-bold">Quest complete!</h3>
        <p className="mt-1 text-white/80">You scored {score} out of {questions.length} ({pct}%)</p>
        <div className="mt-3 text-4xl">{pct >= 75 ? "🌟🌟🌟" : pct >= 50 ? "🌟🌟" : "🌟"}</div>
        <Button variant="accent" className="mt-6" onClick={restart}>
          <RotateCcw className="h-4 w-4" /> Play again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <Badge tone="teal">Question {index + 1} of {questions.length}</Badge>
        <span className="text-sm font-semibold text-navy-600">Score: {score}</span>
      </div>
      <ProgressBar value={((index) / questions.length) * 100} className="mb-6" tone="accent" />
      <div className="rounded-2xl bg-surface-soft py-10 text-center">
        <p className="font-display text-4xl font-bold text-navy-900">{current.q}</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(opt)}
            disabled={Boolean(feedback)}
            className={cn(
              "rounded-xl border-2 py-4 text-xl font-bold transition-colors",
              feedback && opt === current.a
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : feedback === "wrong" && "border-navy-100 opacity-60",
              !feedback && "border-navy-200 text-navy-800 hover:border-teal-400 hover:bg-teal-50",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowHint((v) => !v)}>
          <Lightbulb className="h-4 w-4" /> Hint
        </Button>
        {feedback && (
          <span className={cn("flex items-center gap-1 text-sm font-semibold", feedback === "correct" ? "text-emerald-600" : "text-red-600")}>
            {feedback === "correct" ? <><Check className="h-4 w-4" /> Correct!</> : <><X className="h-4 w-4" /> Try the next one</>}
          </span>
        )}
      </div>
      {showHint && (
        <p className="mt-3 rounded-xl bg-accent-50 p-3 text-sm text-navy-700">
          💡 {resource.thinkPrompt ?? "Try counting on from the bigger number, or make a ten first."}
        </p>
      )}
    </div>
  );
}

function buildOptions(answer: number, seed: string): number[] {
  const s = seed.length;
  const set = new Set<number>([answer]);
  const deltas = [1, 2, -1, 3, -2];
  let i = 0;
  while (set.size < 4 && i < deltas.length) {
    const v = answer + deltas[(s + i) % deltas.length];
    if (v > 0) set.add(v);
    i++;
  }
  return Array.from(set).sort((a, b) => a - b);
}

// ---------- Simulation: interactive ten frame ----------
function TenFrameSim({ resource }: { resource: Resource }) {
  const [count, setCount] = useState(4);
  const [showHint, setShowHint] = useState(false);
  const cells = Array.from({ length: 10 }, (_, i) => i < count);
  const toTen = 10 - count;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Badge tone="teal">Interactive simulation</Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHint((v) => !v)}>
            <Lightbulb className="h-4 w-4" /> Hint
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <p className="mb-4 text-sm text-navy-600">
        Tap the frame to add or remove counters. How many more make ten?
      </p>

      <div className="mx-auto grid w-fit grid-cols-5 gap-2 rounded-2xl bg-surface-soft p-4">
        {cells.map((filled, i) => (
          <button
            key={i}
            onClick={() => setCount(filled ? i : i + 1)}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-colors",
              filled ? "border-teal-500 bg-teal-500 text-white" : "border-navy-200 bg-white hover:bg-teal-50",
            )}
            aria-label={`Counter ${i + 1} ${filled ? "filled" : "empty"}`}
          >
            {filled && <span className="h-6 w-6 rounded-full bg-white/90" />}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-6 text-center">
        <div>
          <p className="font-display text-3xl font-bold text-navy-900">{count}</p>
          <p className="text-xs text-navy-400">counters</p>
        </div>
        <div className="text-navy-300">+</div>
        <div>
          <p className="font-display text-3xl font-bold text-teal-600">{toTen}</p>
          <p className="text-xs text-navy-400">makes ten</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setCount((c) => Math.max(0, c - 1))}>− Remove</Button>
        <Button variant="secondary" size="sm" onClick={() => setCount((c) => Math.min(10, c + 1))}>+ Add</Button>
      </div>

      {showHint && (
        <p className="mt-4 rounded-xl bg-accent-50 p-3 text-sm text-navy-700">
          💡 {resource.discussionPrompts?.[0] ?? "Count the empty boxes — that's how many more you need to make ten."}
        </p>
      )}
    </div>
  );
}

// ---------- Book: reader with checkpoints ----------
function BookReader({ resource }: { resource: Resource }) {
  const notify = useToasts((s) => s.notify);
  const chapters = resource.chapters ?? [];
  const [page, setPage] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [bookmarked, setBookmarked] = useState(false);

  if (chapters.length === 0) {
    return <div className="rounded-2xl border border-navy-100 bg-white p-6 text-navy-500">No preview pages available.</div>;
  }

  const chapter = chapters[page];
  const checkpoint = chapter.checkpoint;

  const check = () => {
    if (!checkpoint) return;
    const correct = answer.trim().toLowerCase() === checkpoint.answer.toLowerCase();
    setChecked(correct);
    notify({
      variant: correct ? "success" : "info",
      title: correct ? "That's right!" : "Not quite — have another look",
      description: correct ? undefined : `Hint: the answer is ${checkpoint.answer}.`,
    });
  };

  return (
    <div className="rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-navy-100 p-4">
        <div className="flex items-center gap-2">
          <Badge tone="navy">Page {page + 1} of {chapters.length}</Badge>
          <span className="text-sm font-medium text-navy-500">{chapter.title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setBookmarked((v) => !v); }}>
          <Bookmark className={cn("h-4 w-4", bookmarked && "fill-accent-400 text-accent-500")} />
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
      </div>

      <div className="p-6 sm:p-8">
        <div className="rounded-2xl bg-gradient-to-br from-navy-50 to-teal-50 p-8 text-center">
          <p className="mx-auto max-w-lg font-display text-xl leading-relaxed text-navy-800">{chapter.body}</p>
        </div>

        {checkpoint && (
          <div className="mt-6 rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-5">
            <p className="mb-2 font-semibold text-navy-900">✏️ Checkpoint: {checkpoint.question}</p>
            <div className="flex flex-wrap gap-2">
              <input
                value={answer}
                onChange={(e) => { setAnswer(e.target.value); setChecked(null); }}
                placeholder="Type your answer"
                className="flex-1 rounded-xl border border-navy-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              <Button size="sm" onClick={check}>Check</Button>
            </div>
            {checked !== null && (
              <p className={cn("mt-2 flex items-center gap-1 text-sm font-semibold", checked ? "text-emerald-600" : "text-amber-600")}>
                {checked ? <><Check className="h-4 w-4" /> Well done!</> : <><X className="h-4 w-4" /> Try again — you can do it!</>}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-navy-100 p-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => { setPage((p) => Math.max(0, p - 1)); setAnswer(""); setChecked(null); }}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <div className="flex gap-1">
          {chapters.map((_, i) => (
            <span key={i} className={cn("h-2 w-2 rounded-full", i === page ? "bg-teal-600" : "bg-navy-200")} />
          ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={page === chapters.length - 1}
          onClick={() => { setPage((p) => Math.min(chapters.length - 1, p + 1)); setAnswer(""); setChecked(null); }}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
