"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { LabelledField, Input, Textarea, Select } from "@/components/ui/Field";
import { ResourceCover } from "@/components/content/ResourceCover";
import { questPaths } from "@/data/school";
import { resources, getResource } from "@/data/resources";
import { classes } from "@/data/school";
import { stageLabel } from "@/lib/content";
import { useToasts } from "@/stores/ui";
import { Plus, Route, ArrowRight, Check, X, GripVertical } from "lucide-react";
import type { Resource } from "@/types";

export default function QuestPaths() {
  const notify = useToasts((s) => s.notify);
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState<Resource[]>([]);

  const addStep = (r: Resource) =>
    setSteps((prev) => (prev.find((x) => x.id === r.id) ? prev : [...prev, r]));
  const removeStep = (id: string) => setSteps((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <PageHeading
        title="Quest Paths"
        description="Sequence multiple resources into a guided learning journey for your class."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New Quest Path</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {questPaths.map((qp) => (
          <div key={qp.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Route className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-navy-900">{qp.title}</h3>
                  <p className="text-xs text-navy-400">{qp.stageOrBand} · {qp.strand}</p>
                </div>
              </div>
              {qp.assignedClass && <Badge tone="teal">{classes.find((c) => c.id === qp.assignedClass)?.name}</Badge>}
            </div>
            <p className="text-sm text-navy-500">{qp.description}</p>
            <ol className="mt-4 space-y-2">
              {qp.steps.map((step, i) => {
                const r = getResource(step.resourceId);
                return (
                  <li key={step.resourceId} className="flex items-center gap-3 rounded-xl bg-surface-soft p-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
                    {r && <ResourceCover cover={r.cover} type={r.type} className="h-8 w-8 rounded-md" size="sm" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy-900">{r?.title}</p>
                      <p className="text-xs text-navy-400">{step.label}</p>
                    </div>
                    {i < qp.steps.length - 1 && <ArrowRight className="h-4 w-4 text-navy-300" />}
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 flex justify-end gap-2 border-t border-navy-50 pt-3">
              <Button size="sm" variant="ghost">Duplicate</Button>
              <Button size="sm" variant="outline">Assign to class</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Build a Quest Path"
        description="Give it a name, then add resources in the order learners should complete them."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (steps.length < 2) { notify({ variant: "info", title: "Add at least two steps" }); return; }
              notify({ variant: "success", title: "Quest Path created", description: `${steps.length} steps.` });
              setOpen(false); setSteps([]);
            }}>
              <Check className="h-4 w-4" /> Create path
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <LabelledField label="Path title" htmlFor="qp-title" required>
              <Input id="qp-title" placeholder="e.g. Counting to Calculating" />
            </LabelledField>
            <LabelledField label="Assign to class" htmlFor="qp-class">
              <Select id="qp-class">{classes.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
            </LabelledField>
          </div>
          <LabelledField label="Description" htmlFor="qp-desc">
            <Textarea id="qp-desc" placeholder="What will learners achieve on this journey?" className="min-h-[70px]" />
          </LabelledField>

          <div>
            <p className="mb-2 text-sm font-semibold text-navy-800">Path steps ({steps.length})</p>
            {steps.length === 0 ? (
              <p className="rounded-xl bg-surface-soft p-3 text-center text-sm text-navy-400">Add resources below to build the sequence.</p>
            ) : (
              <ol className="space-y-2">
                {steps.map((r, i) => (
                  <li key={r.id} className="flex items-center gap-2 rounded-xl border border-navy-100 p-2">
                    <GripVertical className="h-4 w-4 text-navy-300" />
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">{i + 1}</span>
                    <span className="flex-1 truncate text-sm font-medium text-navy-900">{r.title}</span>
                    <button onClick={() => removeStep(r.id)} className="p-1 text-navy-400 hover:text-red-600" aria-label="Remove step"><X className="h-4 w-4" /></button>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-navy-800">Add a resource</p>
            <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
              {resources.filter((r) => r.status === "published" && !steps.find((s) => s.id === r.id)).slice(0, 12).map((r) => (
                <button key={r.id} onClick={() => addStep(r)} className="flex items-center gap-2 rounded-xl border border-navy-100 p-2 text-left hover:border-teal-400">
                  <ResourceCover cover={r.cover} type={r.type} className="h-8 w-8 rounded-md" size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-navy-900">{r.title}</span>
                    <span className="block text-xs text-navy-400">{stageLabel(r)}</span>
                  </span>
                  <Plus className="h-4 w-4 text-teal-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
