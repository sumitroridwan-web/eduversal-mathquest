"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiCreateAssignment, apiDeleteAssignment, apiListAssignments } from "@/lib/api";

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
  hydrateServer: () => Promise<void>; // pull DB → local (server authoritative)
}

export const useAssignments = create<AssignmentsState>()(
  persist(
    (set) => ({
      list: [],
      assign: (a) => {
        // optimistic local add for instant UI + offline, then persist to DB
        set((s) => ({ list: [{ ...a, id: `asg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() }, ...s.list] }));
        apiCreateAssignment(a);
      },
      remove: (id) => {
        set((s) => ({ list: s.list.filter((x) => x.id !== id) }));
        apiDeleteAssignment(id);
      },
      hydrateServer: async () => {
        const rows = await apiListAssignments();
        set({ list: rows.map((r) => ({ id: r.id, resourceId: r.resourceId, classId: r.classId, className: r.className, due: r.due ?? undefined, instructions: r.instructions ?? undefined, assignedBy: r.assignedBy, createdAt: r.createdAt })) });
      },
    }),
    { name: "mathquest-assignments" },
  ),
);
