"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { badges } from "@/data/school";
import { useToasts } from "@/stores/ui";
import { Plus } from "lucide-react";

const tierTone = { bronze: "amber", silver: "grey", gold: "accent" } as const;

export default function AdminBadges() {
  const notify = useToasts((s) => s.notify);
  return (
    <div className="space-y-6">
      <PageHeading
        title="Badges & certificates"
        description="Create and manage the badges, certificates and rewards learners can earn."
        actions={<Button onClick={() => notify({ variant: "info", title: "New badge", description: "Badge authoring is a prototype placeholder." })}><Plus className="h-4 w-4" /> New badge</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b) => (
          <div key={b.id} className="rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-card">
            <span className="text-5xl" aria-hidden>{b.icon}</span>
            <h3 className="mt-3 font-display font-semibold text-navy-900">{b.name}</h3>
            <p className="mt-1 text-sm text-navy-500">{b.description}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge tone={tierTone[b.tier]}>{b.tier}</Badge>
              <Badge tone="grey">{b.criteria}</Badge>
            </div>
            <div className="mt-4 flex justify-center gap-1 border-t border-navy-50 pt-3">
              <Button size="sm" variant="ghost" onClick={() => notify({ variant: "info", title: "Edit badge", description: b.name })}>Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
