"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useToasts } from "@/stores/ui";
import { UserPlus } from "lucide-react";

interface ParentRow { id: string; name: string; email: string; children: string; status: string }

const parents: ParentRow[] = [
  { id: "p1", name: "Dewi Santoso", email: "parent@eduversal.org", children: "Bimo, Sari", status: "linked" },
  { id: "p2", name: "Arif Hidayat", email: "a.hidayat@mail.com", children: "Farah", status: "linked" },
  { id: "p3", name: "Lena Kusuma", email: "l.kusuma@mail.com", children: "Chen Wei", status: "invited" },
  { id: "p4", name: "Toni Wibowo", email: "t.wibowo@mail.com", children: "Gilang", status: "linked" },
];

export default function ManagerParents() {
  const notify = useToasts((s) => s.notify);
  const columns: Column<ParentRow>[] = [
    { key: "name", header: "Parent", render: (p) => (
      <div className="flex items-center gap-2.5"><Avatar name={p.name} size="sm" /><div><p className="font-semibold text-navy-900">{p.name}</p><p className="text-xs text-navy-400">{p.email}</p></div></div>
    ) },
    { key: "children", header: "Linked children", render: (p) => p.children },
    { key: "status", header: "Access", render: (p) => <Badge tone={p.status === "linked" ? "green" : "amber"}>{p.status}</Badge> },
  ];
  return (
    <div className="space-y-6">
      <PageHeading
        title="Parents"
        description="Manage parent access and links to their children."
        actions={<Button onClick={() => notify({ variant: "info", title: "Invite parent", description: "Invitation flow is a prototype placeholder." })}><UserPlus className="h-4 w-4" /> Invite parent</Button>}
      />
      <DataTable columns={columns} data={parents} keyField={(p) => p.id} />
    </div>
  );
}
