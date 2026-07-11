import type { Role } from "@/types";
import { RoleGuard } from "./RoleGuard";
import { DashboardShell } from "./DashboardShell";

export function RoleLayout({ role, children }: { role: Role; children: React.ReactNode }) {
  return (
    <RoleGuard role={role}>
      <DashboardShell role={role}>{children}</DashboardShell>
    </RoleGuard>
  );
}
