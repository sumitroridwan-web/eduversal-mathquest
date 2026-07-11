"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Flame, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interactive hero illustration — a tappable ten-frame that mirrors the real
 * MathQuest activity, wrapped in a lively (but calm) scene of floating maths
 * shapes. Fully keyboard-accessible and respects reduced-motion preferences.
 */
export function HeroScene() {
  const reduce = useReducedMotion();
  const [filled, setFilled] = useState<boolean[]>(
    () => Array.from({ length: 10 }, (_, i) => i < 6),
  );
  const count = filled.filter(Boolean).length;
  const toTen = 10 - count;
  const complete = count === 10;

  const toggle = (i: number) =>
    setFilled((prev) => {
      // fill/empty progressively so it always reads as a valid quantity
      const next = [...prev];
      const current = prev.filter(Boolean).length;
      const target = prev[i] ? i : i + 1;
      for (let k = 0; k < 10; k++) next[k] = k < target;
      void current;
      return next;
    });

  const float = (delay: number, dist = 10) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -dist, 0] },
          transition: { duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay },
        };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* soft glows */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-200/40 blur-3xl" aria-hidden />

      {/* floating decorative shapes */}
      <motion.div {...float(0)} className="absolute left-2 top-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-400 text-2xl font-extrabold text-navy-950 shadow-card-hover" aria-hidden>
        +
      </motion.div>
      <motion.div {...float(0.6, 14)} className="absolute right-4 top-2 h-12 w-12 rounded-full bg-teal-500 shadow-card-hover" aria-hidden />
      <motion.div {...float(1.2, 8)} className="absolute -left-1 bottom-16 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-extrabold text-teal-600 shadow-card" aria-hidden>
        7
      </motion.div>
      <motion.div {...float(0.9, 12)} className="absolute bottom-6 right-2 h-0 w-0 border-x-[22px] border-b-[36px] border-x-transparent border-b-accent-300 drop-shadow" aria-hidden />
      <motion.div {...float(1.6, 9)} className="absolute right-10 top-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-400 text-sm font-extrabold text-white shadow-card" aria-hidden>
        ×
      </motion.div>

      {/* floating stat badges */}
      <motion.div {...float(0.4, 10)} className="absolute -right-2 top-16 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-card-hover">
        <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
        <span className="text-sm font-bold text-navy-900">+120</span>
      </motion.div>
      <motion.div {...float(1.1, 12)} className="absolute -left-3 top-1/2 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-card-hover">
        <Flame className="h-4 w-4 text-accent-500" />
        <span className="text-sm font-bold text-navy-900">6-day streak</span>
      </motion.div>

      {/* central interactive card */}
      <motion.div
        {...(reduce ? {} : { animate: { y: [0, -6, 0] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } })}
        className="absolute left-1/2 top-1/2 w-[300px] max-w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-navy-100 bg-white p-5 shadow-card-hover"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700">
            <Sparkles className="h-3.5 w-3.5" /> Today&apos;s Quest
          </span>
          <span className="text-xs font-semibold text-navy-400">Make ten!</span>
        </div>

        <p className="mb-3 text-sm font-medium text-navy-600">Tap the frame to make ten:</p>

        <div className="mx-auto grid w-fit grid-cols-5 gap-1.5 rounded-2xl bg-surface-soft p-2.5">
          {filled.map((f, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-colors",
                f ? "border-teal-500 bg-teal-500" : "border-navy-200 bg-white hover:bg-teal-50",
              )}
              aria-label={`Counter ${i + 1}, ${f ? "filled" : "empty"}`}
              aria-pressed={f}
            >
              {f && <span className="h-4 w-4 rounded-full bg-white/90" />}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-center">
          {complete ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              <Trophy className="h-4 w-4" /> You made ten! 🎉
            </span>
          ) : (
            <>
              <span className="font-display text-2xl font-bold text-navy-900">{count}</span>
              <span className="text-navy-300">+</span>
              <span className="font-display text-2xl font-bold text-teal-600">{toTen}</span>
              <span className="text-sm text-navy-400">= 10</span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
