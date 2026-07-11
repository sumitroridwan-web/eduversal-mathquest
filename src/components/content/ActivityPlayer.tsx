"use client";

import { useState } from "react";
import { Check, X, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToasts } from "@/stores/ui";
import { cn } from "@/lib/utils";
import { SimulationEngine } from "./simEngines";
import { GameEngine } from "./gameEngines";

/**
 * The activity player adapts to the resource type: bespoke interactive
 * manipulatives for simulations, a real game-genre engine for games, and a
 * paged reader with checkpoints for books. Every control works (no dead buttons).
 */
export function ActivityPlayer({ resource }: { resource: Resource }) {
  if (resource.type === "book") return <BookReader resource={resource} />;
  if (resource.type === "simulation") return <SimulationEngine resource={resource} />;
  return <GameEngine resource={resource} />;
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
