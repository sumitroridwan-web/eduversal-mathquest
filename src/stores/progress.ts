"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================================
// Learner progress — persisted per user so activity results and
// "continue where you left off" survive a refresh. Structured so
// the storage backend can later be swapped for a server/database
// (see lib/repository.ts) without changing callers.
// ==========================================================

export interface ResourceProgress {
  attempts: number;
  bestScore: number; // 0–100 (percent) or raw count, per activity
  stars: number; // 0–3
  completed: boolean;
  lastPage?: number; // books: last leaf viewed
  updatedAt: string; // ISO
}

export type ProgressByResource = Record<string, ResourceProgress>;
export type ProgressMap = Record<string, ProgressByResource>; // userId → resourceId → progress

export interface ResultInput { score?: number; stars?: number; completed?: boolean; at: string }

/** Pure reducer: merge a new result into prior progress (keeps the best). */
export function mergeResult(prev: ResourceProgress | undefined, r: ResultInput): ResourceProgress {
  return {
    attempts: (prev?.attempts ?? 0) + 1,
    bestScore: Math.max(prev?.bestScore ?? 0, r.score ?? 0),
    stars: Math.max(prev?.stars ?? 0, r.stars ?? 0),
    completed: (prev?.completed ?? false) || Boolean(r.completed),
    lastPage: prev?.lastPage,
    updatedAt: r.at,
  };
}

interface ProgressState {
  byUser: ProgressMap;
  activeDays: Record<string, string[]>; // userId → sorted unique YYYY-MM-DD
  record: (userId: string, resourceId: string, r: Omit<ResultInput, "at">) => void;
  setBookPage: (userId: string, resourceId: string, page: number) => void;
  ping: (userId: string) => void; // mark today active (for streaks)
  clearUser: (userId: string) => void;
}

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

function withToday(days: string[] | undefined): string[] {
  const d = today();
  if (days?.includes(d)) return days;
  return [...(days ?? []), d];
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      byUser: {},
      activeDays: {},
      record: (userId, resourceId, r) =>
        set((s) => {
          const user = s.byUser[userId] ?? {};
          return {
            byUser: { ...s.byUser, [userId]: { ...user, [resourceId]: mergeResult(user[resourceId], { ...r, at: now() }) } },
            activeDays: { ...s.activeDays, [userId]: withToday(s.activeDays[userId]) },
          };
        }),
      setBookPage: (userId, resourceId, page) =>
        set((s) => {
          const user = s.byUser[userId] ?? {};
          const prev = user[resourceId];
          return {
            byUser: {
              ...s.byUser,
              [userId]: { ...user, [resourceId]: { attempts: prev?.attempts ?? 0, bestScore: prev?.bestScore ?? 0, stars: prev?.stars ?? 0, completed: prev?.completed ?? false, lastPage: page, updatedAt: now() } },
            },
            activeDays: { ...s.activeDays, [userId]: withToday(s.activeDays[userId]) },
          };
        }),
      ping: (userId) => set((s) => ({ activeDays: { ...s.activeDays, [userId]: withToday(s.activeDays[userId]) } })),
      clearUser: (userId) => set((s) => {
        const copy = { ...s.byUser }; delete copy[userId];
        const days = { ...s.activeDays }; delete days[userId];
        return { byUser: copy, activeDays: days };
      }),
    }),
    { name: "mathquest-progress" },
  ),
);

/** Read a single resource's progress for a user (safe outside React too). */
export function getResourceProgress(userId: string | undefined, resourceId: string): ResourceProgress | undefined {
  if (!userId) return undefined;
  return useProgress.getState().byUser[userId]?.[resourceId];
}
