"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Home, Volume2, Pause, Play, RotateCcw, Check, Trophy, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, clamp } from "@/lib/utils";
import type { StoryBook, CheckItem, CheckOption } from "@/data/storybooks";
import { StoryCover } from "./BookCover";
import { useAuth } from "@/stores/auth";
import { progressFor, saveBookPage, recordResult } from "@/lib/repository";

// ==========================================================
// StoryBookReader — a polished interactive e-book: page-flip,
// read-aloud (speech synthesis) with word highlighting, a short
// friendly end-of-book check, and a completion celebration.
// ==========================================================

export function StoryBookReader({ book, initialLeaf = 0 }: { book: StoryBook; initialLeaf?: number }) {
  const P = book.pages.length;
  const COVER = 0, TITLE = 1, FIRST = 2, LAST_PAGE = 1 + P, CHECK = 2 + P, BACK = 3 + P;
  const LEAVES = 4 + P;

  const [leaf, setLeaf] = useState(initialLeaf);
  const [rot, setRot] = useState(0);
  const [snap, setSnap] = useState(false);
  const [anim, setAnim] = useState(false);
  const leafRef = useRef(initialLeaf); leafRef.current = leaf;
  const animRef = useRef(false);

  const isStory = leaf >= FIRST && leaf <= LAST_PAGE;
  const storyIndex = leaf - FIRST;

  // ---- persistence: resume where the reader left off, save progress ----
  const uid = useAuth((s) => s.user?.id);
  useEffect(() => {
    if (initialLeaf !== 0 || !uid) return;
    const saved = progressFor(uid, book.id)?.lastPage;
    if (saved != null && saved >= FIRST && saved <= LAST_PAGE) { setLeaf(saved); leafRef.current = saved; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (uid && leaf >= FIRST && leaf <= LAST_PAGE) saveBookPage(uid, book.id, leaf); }, [leaf, uid, book.id, FIRST, LAST_PAGE]);
  const onComplete = useCallback((r: { stars: number; score: number }) => { if (uid) recordResult(uid, book.id, { ...r, completed: true }); }, [uid, book.id]);

  // ---- page-flip: fold current away, swap content, unfold incoming ----
  const go = useCallback((delta: number) => {
    const cur = leafRef.current;
    const ni = clamp(cur + delta, 0, LEAVES - 1);
    if (ni === cur || animRef.current) return;
    animRef.current = true; setAnim(true); setSnap(false); setRot(delta > 0 ? -92 : 92);
    window.setTimeout(() => {
      setSnap(true); setLeaf(ni); leafRef.current = ni; setRot(delta > 0 ? 92 : -92);
      window.setTimeout(() => { setSnap(false); setRot(0); window.setTimeout(() => { setAnim(false); animRef.current = false; }, 270); }, 24);
    }, 250);
  }, [LEAVES]);

  const goHome = () => { stop(); setLeaf(0); setRot(0); };

  // ---- narration ----
  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [word, setWord] = useState(-1);
  const [slow, setSlow] = useState(false);
  const readingRef = useRef(false);
  const slowRef = useRef(false); slowRef.current = slow;
  const stop = useCallback(() => {
    readingRef.current = false; setReading(false); setPaused(false); setWord(-1);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const speakPage = useCallback((idx: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const page = book.pages[idx]; if (!page) return;
    const text = page.narration ?? page.text;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = slowRef.current ? 0.7 : 0.95; u.pitch = 1.1;
    // word-boundary highlight (map char index → word index)
    const words = text.split(/\s+/);
    const starts: number[] = []; let c = 0;
    for (const w of words) { starts.push(c); c += w.length + 1; }
    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      let wi = 0; for (let i = 0; i < starts.length; i++) if (e.charIndex >= starts[i]) wi = i;
      setWord(wi);
    };
    u.onend = () => {
      setWord(-1);
      if (!readingRef.current) return;
      // auto-continue to the next story page
      if (idx + 1 < P) { go(1); window.setTimeout(() => speakPage(idx + 1), 620); }
      else { readingRef.current = false; setReading(false); }
    };
    window.speechSynthesis.speak(u);
  }, [book.pages, P, go]);

  const readToMe = () => {
    if (!isStory) return;
    readingRef.current = true; setReading(true); setPaused(false);
    speakPage(storyIndex);
  };
  const togglePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (paused) { window.speechSynthesis.resume(); setPaused(false); }
    else { window.speechSynthesis.pause(); setPaused(true); }
  };
  const replay = () => { if (isStory) { readingRef.current = true; setReading(true); setPaused(false); speakPage(storyIndex); } };

  // stop narration when leaving a story page or unmounting
  useEffect(() => { if (!isStory) stop(); }, [isStory, stop]);
  useEffect(() => () => stop(), [stop]);

  // keyboard arrows
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, [go]);

  const tappable = leaf !== CHECK; // don't hijack taps on the interactive check

  return (
    <div className="mx-auto max-w-3xl">
      {/* book stage */}
      <div className="relative select-none" style={{ perspective: 1800 }}>
        <div
          className="relative w-full origin-left overflow-hidden rounded-2xl shadow-2xl"
          style={{ transform: `rotateY(${rot}deg)`, transformStyle: "preserve-3d", transition: snap ? "none" : "transform .25s ease-in", transformOrigin: "left center" }}
        >
          <Leaf book={book} leaf={leaf} idx={{ COVER, TITLE, FIRST, LAST_PAGE, CHECK, BACK }} storyIndex={storyIndex} word={reading ? word : -1} onFinish={() => go(1)} onRestart={goHome} onComplete={onComplete} savedProgress={Boolean(uid)} />
          {/* page-curl shading while flipping */}
          {anim && <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: rot < 0 ? "linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.18))" : "linear-gradient(270deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.18))" }} />}
        </div>

        {/* tap zones */}
        {tappable && <>
          <button aria-label="Previous page" onClick={() => go(-1)} disabled={leaf === 0} className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize disabled:cursor-default" />
          <button aria-label="Next page" onClick={() => go(1)} disabled={leaf === BACK} className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize disabled:cursor-default" />
        </>}
      </div>

      {/* controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={leaf === 0}><ChevronLeft className="h-4 w-4" /> Back</Button>
          <Button variant="secondary" size="sm" onClick={() => go(1)} disabled={leaf === BACK}>Next <ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={goHome} aria-label="Cover"><Home className="h-4 w-4" /></Button>
        </div>

        {/* read-aloud — available on every book (EY & G1 also get the cover badge) */}
        {isStory && (
          <div className="flex items-center gap-2">
            {!reading
              ? <Button variant="accent" size="sm" onClick={readToMe}><Volume2 className="h-4 w-4" /> Read to me</Button>
              : <><Button variant="outline" size="sm" onClick={togglePause}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Play" : "Pause"}</Button>
                <Button variant="ghost" size="sm" onClick={replay} aria-label="Replay"><RotateCcw className="h-4 w-4" /></Button></>}
            <button onClick={() => setSlow((v) => !v)} aria-pressed={slow} title="Reading speed"
              className={cn("rounded-lg border px-2 py-1 text-xs font-bold transition-colors", slow ? "border-teal-500 bg-teal-50 text-teal-700" : "border-navy-200 text-navy-500 hover:border-teal-400")}>
              {slow ? "🐢 Slower" : "🐇 Normal"}
            </button>
          </div>
        )}

        {/* progress dots for story pages */}
        <div className="flex items-center gap-1.5">
          {book.pages.map((_, i) => (
            <button key={i} onClick={() => { stop(); setLeaf(FIRST + i); }} aria-label={`Page ${i + 1}`}
              className={cn("h-2.5 rounded-full transition-all", isStory && storyIndex === i ? "w-5 bg-teal-500" : "w-2.5 bg-navy-200 hover:bg-navy-300")} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- one book leaf ----------------
function Leaf({ book, leaf, idx, storyIndex, word, onFinish, onRestart, onComplete, savedProgress }: {
  book: StoryBook; leaf: number; idx: { COVER: number; TITLE: number; FIRST: number; LAST_PAGE: number; CHECK: number; BACK: number }; storyIndex: number; word: number; onFinish: () => void; onRestart: () => void; onComplete: (r: { stars: number; score: number }) => void; savedProgress: boolean;
}) {
  // Each leaf sizes to its own content so text is NEVER clipped — the page
  // grows taller for longer text (higher grades) instead of cutting it off.
  const face = "relative w-full overflow-hidden rounded-2xl";
  if (leaf === idx.COVER) {
    return <div className={cn(face, "bg-white")}><StoryCover book={book} mode="full" className="aspect-[4/3] w-full" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-pulse rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-navy-700 shadow">Tap the page to open →</div></div>;
  }
  if (leaf === idx.TITLE) {
    return <div className={cn(face, "flex min-h-[440px] flex-col items-center justify-center bg-gradient-to-br p-6 text-center")} style={{ backgroundImage: `linear-gradient(135deg, ${book.coverFrom}, ${book.coverTo})` }}>
      <BookOpen className="mb-3 h-9 w-9" style={{ color: book.accent }} />
      <h2 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{book.title}</h2>
      <p className="mt-1 text-sm font-semibold text-navy-500">{book.subtitle}</p>
      <div className="mt-5 rounded-2xl bg-white/70 px-5 py-3 text-sm text-navy-700 shadow-sm">
        <p className="mb-1 font-bold text-navy-800">Meet the characters</p>
        {book.characters.map((c) => <p key={c.name}><span className="font-bold" style={{ color: book.accent }}>{c.name}</span> — {c.role}</p>)}
      </div>
      <p className="mt-4 text-xs font-semibold text-navy-400">Tap the right side to begin the story →</p>
    </div>;
  }
  if (leaf >= idx.FIRST && leaf <= idx.LAST_PAGE) {
    const page = book.pages[storyIndex];
    const words = (page.text).split(/(\s+)/);
    let wc = -1;
    return <div className={cn(face, "flex flex-col bg-white")}>
      <div className="relative aspect-[16/10] w-full shrink-0 bg-gradient-to-b from-sky-50 to-white">
        <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">{page.scene}</svg>
      </div>
      <div className="flex flex-1 flex-col justify-center border-t border-navy-100 bg-white px-5 py-4 sm:px-7 sm:py-5" role="group" aria-roledescription="story page" aria-live="polite">
        <p className="font-display text-lg font-semibold leading-relaxed text-navy-800 sm:text-xl">
          {words.map((w, i) => {
            if (/\s+/.test(w)) return <span key={i}>{w}</span>;
            wc++;
            return <span key={i} className={cn("rounded transition-colors", word === wc && "bg-accent-200 px-0.5")}>{w}</span>;
          })}
        </p>
        <span className="mt-2 block text-right text-xs font-bold text-navy-300">{storyIndex + 1} / {book.pages.length}</span>
      </div>
    </div>;
  }
  if (leaf === idx.CHECK) {
    return <div className={cn(face, "flex min-h-[460px] flex-col bg-gradient-to-br from-white to-surface-soft")}><QuickCheck book={book} onFinish={onFinish} onComplete={onComplete} /></div>;
  }
  // back cover
  return <div className={cn(face, "flex min-h-[440px] flex-col items-center justify-center gap-3 bg-gradient-to-br text-center")} style={{ backgroundImage: `linear-gradient(135deg, ${book.coverFrom}, ${book.coverTo})` }}>
    <div className="text-5xl">🌟</div>
    <h2 className="font-display text-3xl font-extrabold text-navy-900">The End</h2>
    <p className="max-w-xs text-sm font-semibold text-navy-600">You read <span style={{ color: book.accent }}>{book.title}</span> — great reading, mathematician!</p>
    {savedProgress && <p className="text-xs font-semibold text-emerald-600">✓ Saved to your progress</p>}
    <Button variant="primary" onClick={onRestart} className="mt-2"><RotateCcw className="h-4 w-4" /> Read again</Button>
  </div>;
}

// ---------------- end-of-book quick check ----------------
function Opt({ o, big }: { o: CheckOption; big?: boolean }) {
  if (o.svg) return <svg viewBox="-24 -24 48 48" className={cn(big ? "h-16 w-16" : "h-12 w-12")}>{o.svg}</svg>;
  if (o.emoji) return <span className={cn(big ? "text-3xl" : "text-2xl")}>{o.emoji}</span>;
  if (o.num) return <span className="font-display text-3xl font-extrabold text-navy-900">{o.num}</span>;
  return <span className="font-display text-base font-bold text-navy-800">{o.text}</span>;
}
// accessible name for a picture / number / emoji answer option
function optLabel(o: CheckOption, i: number): string {
  return o.text ?? o.num ?? (o.emoji ? `picture answer ${i + 1}` : `answer option ${i + 1}`);
}

function QuickCheck({ book, onFinish, onComplete }: { book: StoryBook; onFinish: () => void; onComplete?: (r: { stars: number; score: number }) => void }) {
  const items = book.check;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const item: CheckItem | undefined = items[i];

  // record the result once, when the check is completed
  useEffect(() => {
    if (!done) return;
    const stars = correctCount === items.length ? 3 : correctCount >= items.length - 1 ? 2 : 1;
    onComplete?.({ stars, score: Math.round((correctCount / items.length) * 100) });
  }, [done, correctCount, items.length, onComplete]);

  const pick = (opt: number) => {
    if (picked !== null || done) return;
    if (opt === item!.answer) {
      setPicked(opt); setCorrect((c) => c + 1);
      window.setTimeout(() => {
        if (i + 1 < items.length) { setI(i + 1); setPicked(null); }
        else setDone(true);
      }, 850);
    } else {
      setWrongShake(opt);
      window.setTimeout(() => setWrongShake(null), 450);
    }
  };
  const retry = () => { setI(0); setPicked(null); setCorrect(0); setDone(false); };

  if (done) {
    const all = correctCount === items.length;
    return <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="animate-bounce"><Trophy className="h-16 w-16 text-accent-400" /></div>
      <h3 className="font-display text-2xl font-extrabold text-navy-900">{all ? "Perfect! 🎉" : "Well done! 🌟"}</h3>
      <p className="text-sm font-semibold text-navy-600">You got {correctCount} of {items.length}.</p>
      <div className="text-3xl">{all ? "⭐⭐⭐" : correctCount >= items.length - 1 ? "⭐⭐" : "⭐"}</div>
      <div className="mt-2 flex gap-2">
        <Button variant="outline" size="sm" onClick={retry}><RotateCcw className="h-4 w-4" /> Try again</Button>
        <Button variant="primary" size="sm" onClick={onFinish}>Finish <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>;
  }

  return <div className="flex flex-1 flex-col p-5">
    <div className="mb-1 flex items-center justify-between">
      <span className="rounded-full bg-teal-100 px-3 py-0.5 text-xs font-bold text-teal-700">Quick check</span>
      <span className="text-xs font-bold text-navy-400">{i + 1} / {items.length}</span>
    </div>
    <p className="mb-4 font-display text-lg font-bold text-navy-800" aria-live="polite">{item!.prompt}</p>
    <div role="group" aria-label={item!.prompt} className={cn("grid flex-1 content-center gap-3", item!.options.length >= 3 ? "grid-cols-3" : "grid-cols-2")}>
      {item!.options.map((o, oi) => {
        const isRight = picked !== null && oi === item!.answer;
        return <button key={oi} onClick={() => pick(oi)} disabled={picked !== null} aria-label={optLabel(o, oi)}
          className={cn("flex min-h-[86px] flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-white p-3 transition-all",
            isRight ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300" : "border-navy-200 hover:border-teal-400 hover:bg-teal-50",
            wrongShake === oi && "animate-[wiggle_0.4s] border-rose-400 bg-rose-50")}>
          <Opt o={o} big={item!.options.length <= 2} />
          {isRight && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><Check className="h-3.5 w-3.5" /> Yes!</span>}
        </button>;
      })}
    </div>
    {wrongShake !== null && <p className="mt-2 text-center text-sm font-semibold text-amber-600" role="status">Not quite — have another try! 💪</p>}
    <style>{`@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}`}</style>
  </div>;
}
