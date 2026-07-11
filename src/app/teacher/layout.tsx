import { RoleLayout } from "@/components/dashboards/RoleLayout";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="teacher">{children}</RoleLayout>;
}
