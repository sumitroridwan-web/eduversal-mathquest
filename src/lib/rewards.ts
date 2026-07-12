// ==========================================================
// Rewards — XP, levels, daily streaks and badges derived from the
// learner's progress. All pure functions so they are unit-tested
// and can run on the server later.
// ==========================================================

import type { Resource, ContentType } from "@/types";
import type { ProgressByResource } from "@/stores/progress";

export interface Badge { id: string; label: string; emoji: string; earned: boolean; hint: string }
export interface LevelInfo { level: number; title: string; xpInto: number; xpNeeded: number }
export interface RewardSummary {
  xp: number;
  level: LevelInfo;
  streak: number;
  completed: number;
  stars: number;
  badges: Badge[];
}

const XP_PER_LEVEL = 100;
const TITLES = ["Beginner", "Explorer", "Adventurer", "Champion", "Maths Wizard", "Grand Mathematician"];

export function computeXp(progress: ProgressByResource): number {
  return Object.values(progress).reduce((sum, p) => {
    return sum + (p.completed ? 30 : 0) + p.stars * 10 + Math.min(p.attempts, 3) * 3;
  }, 0);
}

export function levelForXp(xp: number): LevelInfo {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return {
    level,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
    xpInto: xp % XP_PER_LEVEL,
    xpNeeded: XP_PER_LEVEL,
  };
}

/** Consecutive active days ending today (or yesterday keeps it alive). */
export function computeStreak(days: string[], today: string): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const d = new Date(today + "T00:00:00Z");
  const iso = (x: Date) => x.toISOString().slice(0, 10);
  const yesterday = new Date(d); yesterday.setUTCDate(d.getUTCDate() - 1);
  // streak is only "live" if today or yesterday was active
  let cursor = set.has(today) ? new Date(d) : set.has(iso(yesterday)) ? new Date(yesterday) : null;
  if (!cursor) return 0;
  let streak = 0;
  while (set.has(iso(cursor))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  return streak;
}

function countByType(progress: ProgressByResource, resources: Resource[], type: ContentType, completedOnly = true): number {
  const byId = new Map(resources.map((r) => [r.id, r] as const));
  return Object.entries(progress).filter(([id, p]) => byId.get(id)?.type === type && (!completedOnly || p.completed)).length;
}

export function earnedBadges(progress: ProgressByResource, resources: Resource[], streak: number): Badge[] {
  const completed = Object.values(progress).filter((p) => p.completed).length;
  const threeStars = Object.values(progress).filter((p) => p.stars >= 3).length;
  const books = countByType(progress, resources, "book");
  const gamesDone = countByType(progress, resources, "game");
  const simsDone = countByType(progress, resources, "simulation", false);
  const allTypes = books > 0 && gamesDone > 0 && simsDone > 0;
  return [
    { id: "first-step", emoji: "🌱", label: "First Steps", hint: "Finish your first activity", earned: completed >= 1 },
    { id: "bookworm", emoji: "📚", label: "Bookworm", hint: "Finish 3 storybooks", earned: books >= 3 },
    { id: "game-on", emoji: "🎮", label: "Game On", hint: "Finish 3 games", earned: gamesDone >= 3 },
    { id: "scientist", emoji: "🔬", label: "Lab Scientist", hint: "Explore 3 simulations", earned: simsDone >= 3 },
    { id: "all-rounder", emoji: "🌈", label: "All-Rounder", hint: "Try a game, a sim and a book", earned: allTypes },
    { id: "sharp", emoji: "🎯", label: "Sharpshooter", hint: "Earn 3 stars on 5 activities", earned: threeStars >= 5 },
    { id: "streak-3", emoji: "🔥", label: "On a Roll", hint: "3-day streak", earned: streak >= 3 },
    { id: "streak-7", emoji: "⚡", label: "Unstoppable", hint: "7-day streak", earned: streak >= 7 },
  ];
}

export function summarizeRewards(progress: ProgressByResource, activeDays: string[], resources: Resource[], today: string): RewardSummary {
  const xp = computeXp(progress);
  const streak = computeStreak(activeDays, today);
  return {
    xp,
    level: levelForXp(xp),
    streak,
    completed: Object.values(progress).filter((p) => p.completed).length,
    stars: Object.values(progress).reduce((s, p) => s + p.stars, 0),
    badges: earnedBadges(progress, resources, streak),
  };
}
