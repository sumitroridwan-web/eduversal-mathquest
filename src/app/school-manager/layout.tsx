import { RoleLayout } from "@/components/dashboards/RoleLayout";

export default function SchoolManagerLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="school-manager">{children}</RoleLayout>;
}
