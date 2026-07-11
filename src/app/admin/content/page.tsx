"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { SearchField, Select } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ResourceCover } from "@/components/content/ResourceCover";
import { ConfirmDialog } from "@/components/ui/Modal";
import { resources, games, simulations, books } from "@/data/resources";
import { typeLabel, stageLabel } from "@/lib/content";
import { useToasts } from "@/stores/ui";
import type { Resource } from "@/types";
import { Plus, Archive } from "lucide-react";

export default function AdminContent() {
  const notify = useToasts((s) => s.notify);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [archiveTarget, setArchiveTarget] = useState<Resource | null>(null);

  const base = tab === "all" ? resources : resources.filter((r) => r.type === tab);
  const filtered = useMemo(
    () =>
      base.filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (!query || r.title.toLowerCase().includes(query.toLowerCase())),
      ),
    [base, status, query],
  );

  const columns: Column<Resource>[] = [
    {
      key: "title",
      header: "Resource",
      render: (r) => (
        <Link href={`/admin/library/${r.id}`} className="flex items-center gap-3 hover:text-teal-700">
          <ResourceCover cover={r.cover} type={r.type} className="h-10 w-10 rounded-lg" size="sm" />
          <div>
            <p className="font-semibold text-navy-900">{r.title}</p>
            <p className="text-xs text-navy-400">{r.curriculumRef}</p>
          </div>
        </Link>
      ),
    },
    { key: "type", header: "Type", render: (r) => <Badge tone="navy">{typeLabel[r.type]}</Badge> },
    { key: "stage", header: "Stage / Band", render: (r) => stageLabel(r) },
    { key: "strand", header: "Strand", render: (r) => r.strand === "Early Mathematical Experiences" ? "Early Maths" : r.strand },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" asChildHref={`/admin/library/${r.id}`}>Edit</Button>
          <Button size="sm" variant="ghost" onClick={() => setArchiveTarget(r)} aria-label="Archive">
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Content management"
        description="Create, edit, publish, review and archive all MathQuest resources."
        actions={<Button onClick={() => notify({ variant: "info", title: "New content", description: "The content authoring flow is a prototype placeholder." })}><Plus className="h-4 w-4" /> New resource</Button>}
      />

      <Tabs
        tabs={[
          { id: "all", label: "All", count: resources.length },
          { id: "game", label: "Games", count: games.length },
          { id: "simulation", label: "Simulations", count: simulations.length },
          { id: "book", label: "Books", count: books.length },
        ]}
        active={tab}
        onChange={setTab}
        className="w-fit"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchField placeholder="Search resources…" value={query} onChange={(e) => setQuery(e.target.value)} wrapperClassName="flex-1" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="review">In review</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField={(r) => r.id}
        empty={{ title: "No resources found", description: "Adjust your filters or create a new resource." }}
      />

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => notify({ variant: "success", title: "Resource archived", description: archiveTarget?.title })}
        title="Archive this resource?"
        description={`"${archiveTarget?.title}" will be hidden from learners but kept for your records. You can restore it later.`}
        confirmLabel="Archive"
        danger
      />
    </div>
  );
}
