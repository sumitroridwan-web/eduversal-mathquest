"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchField, Select } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { resources } from "@/data/resources";
import { curriculumConfig } from "@/config/brand";
import { stageLabel, typeLabel, distinct } from "@/lib/content";
import type { Resource } from "@/types";
import { Settings2 } from "lucide-react";

export default function CurriculumMapping() {
  const [query, setQuery] = useState("");
  const [programme, setProgramme] = useState("all");
  const [strand, setStrand] = useState("all");
  const [purpose, setPurpose] = useState("all");
  const [twm, setTwm] = useState("all");

  const strands = distinct(resources, "strand");
  const purposes = distinct(resources, "learningPurpose");
  const twms = distinct(resources, "twm");

  const filtered = useMemo(
    () =>
      resources.filter(
        (r) =>
          (!query || r.title.toLowerCase().includes(query.toLowerCase()) || r.curriculumRef.toLowerCase().includes(query.toLowerCase())) &&
          (programme === "all" || r.programme === programme) &&
          (strand === "all" || r.strand === strand) &&
          (purpose === "all" || r.learningPurpose === purpose) &&
          (twm === "all" || r.twm === twm),
      ),
    [query, programme, strand, purpose, twm],
  );

  const columns: Column<Resource>[] = [
    { key: "ref", header: "Ref", render: (r) => <span className="font-mono text-xs text-navy-500">{r.curriculumRef}</span> },
    { key: "title", header: "Resource", render: (r) => (
      <Link href={`/admin/library/${r.id}`} className="font-semibold text-navy-900 hover:text-teal-700">{r.title}</Link>
    ) },
    { key: "type", header: "Type", render: (r) => <Badge tone="navy">{typeLabel[r.type]}</Badge> },
    { key: "stage", header: "Stage", render: (r) => stageLabel(r) },
    { key: "strand", header: "Strand", render: (r) => r.strand === "Early Mathematical Experiences" ? "Early Maths" : r.strand },
    { key: "purpose", header: "Purpose", render: (r) => <Badge tone="grey">{r.learningPurpose}</Badge> },
    { key: "twm", header: "TWM", render: (r) => r.twm ? <Badge tone="purple">{r.twm}</Badge> : <span className="text-navy-300">—</span> },
    { key: "obj", header: "Objective (I can…)", render: (r) => <span className="text-xs text-navy-500">{r.objective.student}</span>, className: "max-w-xs" },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Curriculum mapping"
        description="Every resource mapped to programme, stage, strand, objective and Thinking & Working Mathematically."
        actions={<Button variant="outline"><Settings2 className="h-4 w-4" /> Configure ref codes</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Mapped resources" value={resources.length} icon="LibraryBig" tone="navy" />
        <StatCard label="Strands covered" value={strands.length} icon="Layers" tone="teal" />
        <StatCard label="Early Years" value={resources.filter((r) => r.programme === "early-years").length} icon="Baby" tone="accent" />
        <StatCard label="Primary" value={resources.filter((r) => r.programme === "primary").length} icon="GraduationCap" tone="navy" />
      </div>

      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-sm text-navy-500">
          <span className="font-medium text-navy-700">Mapping to:</span>
          <Badge tone="teal">{curriculumConfig.earlyYearsName}</Badge>
          <Badge tone="teal">{curriculumConfig.primaryName}</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SearchField placeholder="Search title or ref…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select value={programme} onChange={(e) => setProgramme(e.target.value)}>
            <option value="all">All programmes</option>
            <option value="early-years">Early Years</option>
            <option value="primary">Primary</option>
          </Select>
          <Select value={strand} onChange={(e) => setStrand(e.target.value)}>
            <option value="all">All strands</option>
            {strands.map((s) => <option key={s} value={s}>{s === "Early Mathematical Experiences" ? "Early Maths" : s}</option>)}
          </Select>
          <Select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="all">All purposes</option>
            {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
          <Select value={twm} onChange={(e) => setTwm(e.target.value)}>
            <option value="all">All TWM</option>
            {twms.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
      </div>

      <p className="text-sm text-navy-500">{filtered.length} resources</p>
      <DataTable columns={columns} data={filtered} keyField={(r) => r.id} empty={{ title: "No resources match", description: "Try clearing a filter." }} />
    </div>
  );
}
