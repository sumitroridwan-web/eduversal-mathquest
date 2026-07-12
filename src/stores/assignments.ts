"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Persisted teacher→student assignments. Today localStorage-backed
// (shared across the demo); route through lib/repository / a backend
// later for real per-class delivery.
export interface Assignment {
  id: string;
  resourceId: string;
  classId: string;
  className: string;
  due?: string;
  instructions?: string;
  assignedBy: string;
  createdAt: string;
}

interface AssignmentsState {
  list: Assignment[];
  assign: (a: Omit<Assignment, "id" | "createdAt">) => void;
  remove: (id: string) => void;
}

export const useAssignments = create<AssignmentsState>()(
  persist(
    (set) => ({
      list: [],
      assign: (a) =>
        set((s) => ({
          list: [{ ...a, id: `asg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() }, ...s.list],
        })),
      remove: (id) => set((s) => ({ list: s.list.filter((x) => x.id !== id) })),
    }),
    { name: "mathquest-assignments" },
  ),
);
