// ==========================================================
// Analytics seam. Events are buffered in localStorage today (a
// capped ring buffer) so nothing is lost and they can be viewed
// or flushed. To wire real telemetry, replace the body of track()
// with a fetch/beacon call — callers don't change.
// ==========================================================

export type AnalyticsEvent =
  | "activity_open"
  | "activity_complete"
  | "activity_error"
  | "book_page"
  | "badge_earned";

interface StoredEvent { e: AnalyticsEvent; p?: Record<string, unknown>; t: string }

const KEY = "mathquest-events";
const CAP = 200;

export function track(event: AnalyticsEvent, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const list: StoredEvent[] = raw ? JSON.parse(raw) : [];
    list.push({ e: event, p: props, t: new Date().toISOString() });
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(-CAP)));
  } catch {
    /* analytics must never break the app */
  }
}

export function recentEvents(): StoredEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredEvent[]) : [];
  } catch {
    return [];
  }
}
