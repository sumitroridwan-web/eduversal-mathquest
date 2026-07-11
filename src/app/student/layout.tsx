import { RoleLayout } from "@/components/dashboards/RoleLayout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="student">{children}</RoleLayout>;
}
