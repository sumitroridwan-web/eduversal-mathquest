import { PageHeading } from "@/components/ui/PageHeading";
import { StudentsTable } from "@/components/dashboards/StudentsTable";

export default function ManagerStudents() {
  return (
    <div className="space-y-6">
      <PageHeading title="Students" description="All learners across your school. Identify those needing support or extension." />
      <StudentsTable />
    </div>
  );
}
