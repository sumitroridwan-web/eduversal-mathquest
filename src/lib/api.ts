// Client-safe fetch layer for the server API. Kept free of store
// imports so it can be used from stores without a cycle.

const JSON_HEADERS = { "Content-Type": "application/json" };

export interface ServerProgressRow {
  resourceId: string; attempts: number; bestScore: number; stars: number; completed: boolean; lastPage: number | null; updatedAt: string;
}
export interface ServerAssignmentRow {
  id: string; resourceId: string; classId: string; className: string; due: string | null; instructions: string | null; assignedBy: string; createdAt: string;
}

// ---- progress ----
export async function apiListProgress(userId: string): Promise<ServerProgressRow[]> {
  try { const r = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`); return r.ok ? r.json() : []; } catch { return []; }
}
export function apiSaveResult(userId: string, resourceId: string, result: { score?: number; stars?: number; completed?: boolean }): void {
  void fetch("/api/progress", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ userId, resourceId, result }) }).catch(() => {});
}
export function apiSaveBookPage(userId: string, resourceId: string, lastPage: number): void {
  void fetch("/api/progress", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ userId, resourceId, lastPage }) }).catch(() => {});
}

// ---- assignments ----
export async function apiListAssignments(): Promise<ServerAssignmentRow[]> {
  try { const r = await fetch("/api/assignments"); return r.ok ? r.json() : []; } catch { return []; }
}
export function apiCreateAssignment(a: { resourceId: string; classId: string; className: string; due?: string | null; instructions?: string | null; assignedBy: string }): void {
  void fetch("/api/assignments", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(a) }).catch(() => {});
}
export function apiDeleteAssignment(id: string): void {
  void fetch(`/api/assignments?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
}
