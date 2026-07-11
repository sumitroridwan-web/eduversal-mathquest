"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LabelledField, Input, Checkbox } from "@/components/ui/Field";
import { curriculumConfig, brand } from "@/config/brand";
import { useToasts } from "@/stores/ui";

export default function AdminSettings() {
  const notify = useToasts((s) => s.notify);
  const [mapping] = useState(curriculumConfig.gradeToStage);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeading title="Platform settings" description="Configure curriculum mapping and platform-wide options." />

      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="font-display font-semibold text-navy-900">Curriculum reference frameworks</h2>
        <p className="mt-1 text-sm text-navy-500">The named frameworks resources are aligned to.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <LabelledField label="Early Years framework" htmlFor="ey"><Input id="ey" defaultValue={curriculumConfig.earlyYearsName} /></LabelledField>
          <LabelledField label="Primary framework" htmlFor="pr"><Input id="pr" defaultValue={curriculumConfig.primaryName} /></LabelledField>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="font-display font-semibold text-navy-900">Grade → Stage mapping</h2>
        <p className="mt-1 text-sm text-navy-500">Configure how your school&apos;s grades map to curriculum stages.</p>
        <div className="mt-4 space-y-2">
          {Object.entries(mapping).map(([grade, stage]) => (
            <div key={grade} className="flex items-center gap-3">
              <span className="w-24 text-sm font-medium text-navy-700">{grade}</span>
              <span className="text-navy-300">→</span>
              <Input defaultValue={stage} className="max-w-[160px]" />
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => notify({ variant: "success", title: "Mapping saved" })}>Save mapping</Button>
      </section>

      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="font-display font-semibold text-navy-900">Platform</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm"><span className="text-navy-600">Platform name</span><Badge tone="navy">{brand.name}</Badge></div>
          <Checkbox defaultChecked label="Allow public sign-up (School Manager, Teacher, Student, Parent)" />
          <Checkbox defaultChecked label="Show demo-mode role switcher" />
          <Checkbox label="Require email verification for new accounts" />
        </div>
      </section>
    </div>
  );
}
