// ==========================================================
// Data-access seam. Content still comes from the static catalogue;
// learner progress and assignments are now backed by a real server
// database (Prisma/SQLite via /api/*), with the zustand stores as an
// offline-first cache that writes through and hydrates from the DB.
// To move content to the backend too, swap listResources/getResource
// for a fetch — callers don't change.
// ==========================================================

import { resources } from "@/data/resources";
import type { Resource } from "@/types";
import { getResourceProgress, useProgress, type ResourceProgress, type ResultInput } from "@/stores/progress";

// server sync layer (Prisma-backed API)
export { apiListProgress, apiListAssignments } from "@/lib/api";

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
