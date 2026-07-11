"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, X, Wand2 } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LabelledField, Input, Textarea, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { ResourceCover } from "@/components/content/ResourceCover";
import { resources } from "@/data/resources";
import { classes } from "@/data/school";
import { stageLabel } from "@/lib/content";
import { useToasts } from "@/stores/ui";
import type { Strand, TWMCharacteristic, Difficulty, Resource } from "@/types";

const strands: Strand[] = ["Number", "Geometry and Measure", "Statistics and Probability", "Algebra"];
const twmList: TWMCharacteristic[] = [
  "Specialising", "Generalising", "Conjecturing", "Convincing",
  "Characterising", "Classifying", "Critiquing", "Improving",
];
const diffs: Difficulty[] = ["Foundation", "Core", "Challenge"];

export default function CreateAssignment() {
  const router = useRouter();
  const notify = useToasts((s) => s.notify);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<Resource[]>([]);
  const [teacherObj, setTeacherObj] = useState("");
  const [studentObj, setStudentObj] = useState("");
  const [parentObj, setParentObj] = useState("");
  const [target, setTarget] = useState(classes[0]?.id ?? "");

  const generateObjectives = () => {
    if (!teacherObj.trim()) {
      notify({ variant: "info", title: "Add a teacher objective first" });
      return;
    }
    // Derive student & parent versions from the teacher objective.
    const core = teacherObj.replace(/^(Pupils|Students|Learners)\s+(will|can)\s+/i, "").trim();
    setStudentObj(`I can ${core.charAt(0).toLowerCase()}${core.slice(1)}`);
    setParentObj(`Your child is learning to ${core.charAt(0).toLowerCase()}${core.slice(1)}`);
    notify({ variant: "success", title: "Objectives generated", description: "Student and parent versions created — edit as needed." });
  };

  const toggleResource = (r: Resource) => {
    setSelected((prev) =>
      prev.find((x) => x.id === r.id) ? prev.filter((x) => x.id !== r.id) : [...prev, r],
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      notify({ variant: "error", title: "Add at least one resource" });
      return;
    }
    const cls = classes.find((c) => c.id === target);
    notify({ variant: "success", title: "Assignment created", description: `Assigned to ${cls?.name}.` });
    router.push("/teacher/assignments");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <PageHeading title="Create assignment" description="Assign resources with clear objectives, differentiation and curriculum links." />

      <form onSubmit={submit} className="space-y-6">
        {/* Basics */}
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display font-semibold text-navy-900">1. The basics</h2>
          <div className="space-y-4">
            <LabelledField label="Assignment title" htmlFor="title" required>
              <Input id="title" required placeholder="e.g. Bridging Through Ten — Addition Quest" />
            </LabelledField>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabelledField label="Assign to" htmlFor="target" required>
                <Select id="target" value={target} onChange={(e) => setTarget(e.target.value)}>
                  <optgroup label="Classes">
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.studentIds.length})</option>)}
                  </optgroup>
                  <optgroup label="Groups">
                    <option value="grp-support">Support group</option>
                    <option value="grp-extension">Extension group</option>
                  </optgroup>
                </Select>
              </LabelledField>
              <LabelledField label="Due date" htmlFor="due" required>
                <Input id="due" type="date" required />
              </LabelledField>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display font-semibold text-navy-900">2. Curriculum links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <LabelledField label="Programme" htmlFor="programme">
              <Select id="programme"><option>Cambridge Primary</option><option>Cambridge Early Years</option></Select>
            </LabelledField>
            <LabelledField label="Stage / Age band" htmlFor="stage">
              <Select id="stage">{["Stage 1","Stage 2","Stage 3","Stage 4","Stage 5","Stage 6","Kindergarten 2"].map((s) => <option key={s}>{s}</option>)}</Select>
            </LabelledField>
            <LabelledField label="Strand" htmlFor="strand">
              <Select id="strand">{strands.map((s) => <option key={s}>{s}</option>)}</Select>
            </LabelledField>
            <LabelledField label="Thinking & Working Mathematically" htmlFor="twm">
              <Select id="twm"><option value="">None</option>{twmList.map((t) => <option key={t}>{t}</option>)}</Select>
            </LabelledField>
          </div>
        </section>

        {/* Objectives — 3 versions */}
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-navy-900">3. Learning objectives</h2>
            <Button type="button" variant="outline" size="sm" onClick={generateObjectives}>
              <Wand2 className="h-4 w-4" /> Generate student &amp; parent versions
            </Button>
          </div>
          <div className="space-y-4">
            <LabelledField label="Teacher objective" htmlFor="tobj" hint="Write this first, then generate the other two.">
              <Textarea id="tobj" value={teacherObj} onChange={(e) => setTeacherObj(e.target.value)} placeholder="Pupils will add two single-digit numbers within 20 using number bonds." />
            </LabelledField>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabelledField label="Student-friendly 'I can' statement" htmlFor="sobj">
                <Textarea id="sobj" value={studentObj} onChange={(e) => setStudentObj(e.target.value)} placeholder="I can…" />
              </LabelledField>
              <LabelledField label="Parent-friendly explanation" htmlFor="pobj">
                <Textarea id="pobj" value={parentObj} onChange={(e) => setParentObj(e.target.value)} placeholder="Your child is learning to…" />
              </LabelledField>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-navy-900">4. Resources</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              <Plus className="h-4 w-4" /> Add resources
            </Button>
          </div>
          {selected.length === 0 ? (
            <p className="rounded-xl bg-surface-soft p-4 text-center text-sm text-navy-400">No resources selected yet.</p>
          ) : (
            <ul className="space-y-2">
              {selected.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-xl border border-navy-100 p-2.5">
                  <ResourceCover resource={r} className="h-10 w-10 rounded-lg" size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">{r.title}</p>
                    <p className="text-xs text-navy-400">{stageLabel(r)} · {r.curriculumRef}</p>
                  </div>
                  <button type="button" onClick={() => toggleResource(r)} className="p-1 text-navy-400 hover:text-red-600" aria-label="Remove">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Delivery */}
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display font-semibold text-navy-900">5. Instructions &amp; differentiation</h2>
          <div className="space-y-4">
            <LabelledField label="Instructions for students" htmlFor="inst">
              <Textarea id="inst" placeholder="Explain what to do in child-friendly language." />
            </LabelledField>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabelledField label="Required materials" htmlFor="materials">
                <Input id="materials" placeholder="e.g. counters, whiteboard" />
              </LabelledField>
              <LabelledField label="Differentiation level" htmlFor="diff">
                <Select id="diff" defaultValue="Core">{diffs.map((d) => <option key={d}>{d}</option>)}</Select>
              </LabelledField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabelledField label="Success criteria" htmlFor="success">
                <Textarea id="success" placeholder="I can… / Evidence looks like…" className="min-h-[80px]" />
              </LabelledField>
              <LabelledField label="Assessment approach" htmlFor="assess">
                <Textarea id="assess" placeholder="Formative — scores + short explanation." className="min-h-[80px]" />
              </LabelledField>
            </div>
            <LabelledField label="Parent guidance" htmlFor="pguide">
              <Input id="pguide" placeholder="A short note for parents supporting at home." />
            </LabelledField>
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/teacher/assignments")}>Cancel</Button>
          <Button type="submit"><Check className="h-4 w-4" /> Create assignment</Button>
        </div>
      </form>

      {/* Resource picker */}
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Add resources" description="Select one or more resources for this assignment." size="lg"
        footer={<Button onClick={() => setPickerOpen(false)}>Done ({selected.length})</Button>}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {resources.filter((r) => r.status === "published").map((r) => {
            const isSel = Boolean(selected.find((x) => x.id === r.id));
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleResource(r)}
                className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${isSel ? "border-teal-500 bg-teal-50" : "border-navy-100 hover:border-navy-300"}`}
              >
                <ResourceCover resource={r} className="h-10 w-10 rounded-lg" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{r.title}</p>
                  <p className="text-xs text-navy-400">{stageLabel(r)}</p>
                </div>
                {isSel && <Check className="h-4 w-4 text-teal-600" />}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
