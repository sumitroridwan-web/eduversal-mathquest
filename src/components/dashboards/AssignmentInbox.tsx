"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Play, CheckCircle2, Clock, Trash2, Inbox } from "lucide-react";
import { useAssignments } from "@/stores/assignments";
import { useProgress } from "@/stores/progress";
import { useAuth } from "@/stores/auth";
import { resources } from "@/data/resources";
import { ResourceCover } from "@/components/content/ResourceCover";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const byId = new Map(resources.map((r) => [r.id, r] as const));

// The live teacher→student assignment loop. Student view shows a Start /
// Done state from saved progress; teacher view (manage) adds removal.
export function AssignmentInbox({ mode, basePath = "/student", className }: { mode: "student" | "teacher"; basePath?: string; className?: string }) {
  const list = useAssignments((s) => s.list);
  const remove = useAssignments((s) => s.remove);
  const hydrateServer = useAssignments((s) => s.hydrateServer);
  useEffect(() => { void hydrateServer(); }, [hydrateServer]);
  const uid = useAuth((s) => s.user?.id);
  const byUser = useProgress((s) => s.byUser);
  const prog = (uid && byUser[uid]) || {};

  if (list.length === 0) {
    return (
      <div className={cn("flex items-center gap-3 rounded-2xl border border-dashed border-navy-200 bg-surface-soft p-5 text-sm text-navy-500", className)}>
        <Inbox className="h-5 w-5 text-navy-400" />
        {mode === "student" ? "No new assignments yet — check back soon!" : "No live assignments yet. Assign any resource from the library to see it here."}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3", className)}>
      {list.map((a) => {
        const res = byId.get(a.resourceId);
        const done = prog[a.resourceId]?.completed;
        return (
          <div key={a.id} className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-card sm:flex-row sm:items-center">
            {res && <ResourceCover resource={res} className="h-16 w-full rounded-xl sm:w-16" size="sm" />}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-navy-900">{res?.title ?? a.resourceId}</h3>
                {mode === "teacher" && <Badge tone="navy">{a.className}</Badge>}
              </div>
              <p className="text-sm text-navy-500">{mode === "student" ? `Set by ${a.assignedBy}` : `by ${a.assignedBy}`}{a.instructions ? ` · ${a.instructions}` : ""}</p>
              {a.due && <p className="mt-1 flex items-center gap-1 text-xs text-navy-400"><Clock className="h-3.5 w-3.5" /> Due {a.due}</p>}
            </div>
            <div className="flex items-center gap-3">
              {mode === "student" ? (
                done ? <Badge tone="green"><CheckCircle2 className="h-3.5 w-3.5" /> Done</Badge>
                  : <Button size="sm" asChildHref={res ? `${basePath}/library/${res.id}` : basePath}><Play className="h-4 w-4" /> Start</Button>
              ) : (
                <>
                  <Link href={res ? `/teacher/library/${res.id}` : "#"} className="text-sm font-semibold text-teal-600 hover:underline">Preview</Link>
                  <button onClick={() => remove(a.id)} aria-label="Remove assignment" className="rounded-lg p-1.5 text-navy-400 hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
