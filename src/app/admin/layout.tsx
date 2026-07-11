import { RoleLayout } from "@/components/dashboards/RoleLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="admin">{children}</RoleLayout>;
}
