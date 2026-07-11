import { PageHeading } from "@/components/ui/PageHeading";
import { StudentsTable } from "@/components/dashboards/StudentsTable";

export default function TeacherStudents() {
  return (
    <div className="space-y-6">
      <PageHeading title="My students" description="Monitor progress, identify support and extension needs." />
      <StudentsTable classIds={["cls-2a", "cls-3b"]} />
    </div>
  );
}
