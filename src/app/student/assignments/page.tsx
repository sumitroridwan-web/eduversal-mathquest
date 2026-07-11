"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { ResourceCover } from "@/components/content/ResourceCover";
import { studentAssignments } from "@/data/school";
import { resources } from "@/data/resources";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Play, CheckCircle2, Clock } from "lucide-react";

const typeIcon = { game: "🎮", simulation: "🧪", book: "📖" } as const;

export default function StudentAssignments() {
  const [tab, setTab] = useState("todo");
  const todo = studentAssignments.filter((a) => a.status !== "completed");
  const done = studentAssignments.filter((a) => a.status === "completed");
  const list = tab === "todo" ? todo : done;

  return (
    <div className="space-y-6">
      <PageHeading title="My assignments" description="Activities your teacher has set for you." />
      <Tabs tabs={[{ id: "todo", label: "To do", count: todo.length }, { id: "done", label: "Completed", count: done.length }]} active={tab} onChange={setTab} className="w-fit" />

      {list.length === 0 ? (
        <EmptyState icon="PartyPopper" title="All done here!" description="You've completed everything in this list. Great work! 🎉" />
      ) : (
        <div className="grid gap-4">
          {list.map((a) => {
            const res = resources.find((r) => r.title === a.resourceTitle);
            const overdue = new Date(a.dueDate) < new Date("2026-07-11") && a.status !== "completed";
            return (
              <div key={a.assignmentId} className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-card sm:flex-row sm:items-center">
                {res && <ResourceCover cover={res.cover} type={res.type} className="h-16 w-full rounded-xl sm:w-16" size="sm" />}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg" aria-hidden>{typeIcon[a.type]}</span>
                    <h3 className="font-semibold text-navy-900">{a.resourceTitle}</h3>
                    {a.descriptor && <Badge tone={a.descriptor === "Secure" ? "green" : "amber"}>{a.descriptor}</Badge>}
                  </div>
                  <p className="text-sm text-navy-500">{a.title}</p>
                  <p className={`mt-1 flex items-center gap-1 text-xs ${overdue ? "text-red-500" : "text-navy-400"}`}>
                    <Clock className="h-3.5 w-3.5" /> Due {formatDate(a.dueDate)}{a.attempts > 0 && ` · ${a.attempts} attempt${a.attempts > 1 ? "s" : ""}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {a.score != null && <span className="font-display text-lg font-bold text-teal-600">{a.score}%</span>}
                  {a.status === "completed" ? (
                    <Badge tone="green"><CheckCircle2 className="h-3.5 w-3.5" /> Done</Badge>
                  ) : (
                    <Button size="sm" asChildHref={res ? `/student/library/${res.id}` : "/student/games"}>
                      <Play className="h-4 w-4" /> {a.status === "in-progress" ? "Continue" : "Start"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
