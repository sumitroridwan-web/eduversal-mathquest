"use client";

import { useState } from "react";
import type { Resource } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LabelledField, Select, Input, Textarea } from "@/components/ui/Field";
import { ResourceCover } from "./ResourceCover";
import { classes } from "@/data/school";
import { useToasts } from "@/stores/ui";
import { stageLabel } from "@/lib/content";

export function AssignModal({
  resource,
  open,
  onClose,
}: {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
}) {
  const notify = useToasts((s) => s.notify);
  const [target, setTarget] = useState(classes[0]?.id ?? "");
  const [due, setDue] = useState("");
  const [instructions, setInstructions] = useState("");

  if (!resource) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign to learners"
      description="Create a quick assignment linked to this resource and its learning objective."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const cls = classes.find((c) => c.id === target);
              notify({
                variant: "success",
                title: "Assignment created",
                description: `${resource.title} assigned to ${cls?.name ?? "class"}.`,
              });
              onClose();
              setInstructions("");
              setDue("");
            }}
          >
            Assign resource
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-3 rounded-xl border border-navy-100 bg-surface-soft p-3">
          <ResourceCover resource={resource} className="h-16 w-16 rounded-lg" size="sm" />
          <div>
            <p className="font-semibold text-navy-900">{resource.title}</p>
            <p className="text-sm text-navy-500">
              {stageLabel(resource)} · {resource.strand} · {resource.curriculumRef}
            </p>
            <p className="mt-1 text-xs text-navy-400">“{resource.objective.student}”</p>
          </div>
        </div>

        <LabelledField label="Assign to" htmlFor="assign-target" required>
          <Select id="assign-target" value={target} onChange={(e) => setTarget(e.target.value)}>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.studentIds.length} students
              </option>
            ))}
          </Select>
        </LabelledField>

        <LabelledField label="Due date" htmlFor="assign-due">
          <Input id="assign-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </LabelledField>

        <LabelledField
          label="Instructions for students"
          htmlFor="assign-inst"
          hint="A student-friendly note. The 'I can' objective is attached automatically."
        >
          <Textarea
            id="assign-inst"
            placeholder={`e.g. ${resource.objective.student}`}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </LabelledField>
      </div>
    </Modal>
  );
}
