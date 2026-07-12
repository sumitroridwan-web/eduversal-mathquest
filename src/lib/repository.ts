// ==========================================================
// Data-access seam. Today this reads the static content catalogue
// and the localStorage-backed progress store. To move to a real
// backend, replace the bodies here (e.g. `fetch('/api/resources')`
// or a Prisma/Supabase call) — the components calling these
// functions do not change. Reads are async-shaped for that future.
// ==========================================================

import { resources } from "@/data/resources";
import type { Resource } from "@/types";
import { getResourceProgress, useProgress, type ResourceProgress, type ResultInput } from "@/stores/progress";

// ---- content ----
export async function listResources(): Promise<Resource[]> {
  return resources;
}
export async function getResource(id: string): Promise<Resource | undefined> {
  return resources.find((r) => r.id === id);
}

// ---- learner progress ----
export function progressFor(userId: string | undefined, resourceId: string): ResourceProgress | undefined {
  return getResourceProgress(userId, resourceId);
}
export function recordResult(userId: string, resourceId: string, result: Omit<ResultInput, "at">): void {
  useProgress.getState().record(userId, resourceId, result);
}
export function saveBookPage(userId: string, resourceId: string, page: number): void {
  useProgress.getState().setBookPage(userId, resourceId, page);
}
