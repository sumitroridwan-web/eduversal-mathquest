import { RoleLayout } from "@/components/dashboards/RoleLayout";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="parent">{children}</RoleLayout>;
}
