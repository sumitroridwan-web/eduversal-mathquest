"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { LabelledField, Input, Textarea, Select } from "@/components/ui/Field";
import { announcements } from "@/data/school";
import { formatDate } from "@/lib/utils";
import { useToasts } from "@/stores/ui";
import { Megaphone, Plus } from "lucide-react";

export function AnnouncementsPanel({
  canCreate = false,
  scope,
  title = "Announcements",
}: {
  canCreate?: boolean;
  scope?: "platform" | "school";
  title?: string;
}) {
  const notify = useToasts((s) => s.notify);
  const [open, setOpen] = useState(false);
  const list = scope ? announcements.filter((a) => a.scope === scope || a.scope === "platform") : announcements;

  return (
    <div className="space-y-6">
      <PageHeading
        title={title}
        description={canCreate ? "Create and manage announcements for your audience." : "Latest updates from your school and Eduversal."}
        actions={canCreate ? <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New announcement</Button> : undefined}
      />

      <div className="space-y-4">
        {list.map((a) => (
          <article key={a.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Megaphone className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-semibold text-navy-900">{a.title}</h3>
                  <Badge tone={a.scope === "platform" ? "navy" : "teal"}>{a.scope === "platform" ? "Platform" : "School"}</Badge>
                </div>
                <p className="mt-1 text-sm text-navy-600">{a.body}</p>
                <p className="mt-2 text-xs text-navy-400">{a.author} · {formatDate(a.date)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New announcement"
        footer={<>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { notify({ variant: "success", title: "Announcement published" }); setOpen(false); }}>Publish</Button>
        </>}
      >
        <div className="space-y-4">
          <LabelledField label="Title" htmlFor="a-title" required><Input id="a-title" placeholder="Announcement title" /></LabelledField>
          <LabelledField label="Audience" htmlFor="a-aud">
            <Select id="a-aud"><option>All roles</option><option>Teachers</option><option>Parents</option><option>Students</option></Select>
          </LabelledField>
          <LabelledField label="Message" htmlFor="a-body" required><Textarea id="a-body" placeholder="Write your announcement…" /></LabelledField>
        </div>
      </Modal>
    </div>
  );
}
