"use client";

import { useState, useMemo } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SearchField, Select } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { platformUsers } from "@/data/users";
import { roleMeta } from "@/config/navigation";
import { useToasts } from "@/stores/ui";
import type { User, Role } from "@/types";
import { UserPlus } from "lucide-react";

export default function AdminUsers() {
  const notify = useToasts((s) => s.notify);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const data = useMemo(
    () =>
      platformUsers.filter(
        (u) =>
          (role === "all" || u.role === role) &&
          (!query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, role],
  );

  const roleTone: Record<Role, "navy" | "teal" | "accent" | "purple" | "grey"> = {
    admin: "purple", "school-manager": "teal", teacher: "navy", student: "accent", parent: "grey",
  };

  const columns: Column<User>[] = [
    { key: "name", header: "User", render: (u) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={u.name} emoji={u.avatar} size="sm" />
        <div><p className="font-semibold text-navy-900">{u.name}</p><p className="text-xs text-navy-400">{u.email}</p></div>
      </div>
    ) },
    { key: "role", header: "Role", render: (u) => <Badge tone={roleTone[u.role]}>{roleMeta[u.role].label}</Badge> },
    { key: "school", header: "School", render: (u) => <span className="text-sm text-navy-600">{u.schoolName ?? "—"}</span> },
    { key: "actions", header: "", align: "right", render: (u) => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => notify({ variant: "info", title: "Edit user", description: u.name })}>Edit</Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="User management"
        description="Manage all accounts across the platform."
        actions={<Button onClick={() => notify({ variant: "info", title: "Invite user", description: "User invitation flow is a prototype placeholder." })}><UserPlus className="h-4 w-4" /> Invite user</Button>}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchField placeholder="Search users…" value={query} onChange={(e) => setQuery(e.target.value)} wrapperClassName="flex-1" />
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="sm:w-52">
          <option value="all">All roles</option>
          {(Object.keys(roleMeta) as Role[]).map((r) => <option key={r} value={r}>{roleMeta[r].label}</option>)}
        </Select>
      </div>
      <DataTable columns={columns} data={data} keyField={(u) => u.id} empty={{ title: "No users found", icon: "Users" }} />
    </div>
  );
}
