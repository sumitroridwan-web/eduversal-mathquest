import { LibraryView } from "@/components/content/LibraryView";
import { simulations } from "@/data/resources";

export default function StudentSimulations() {
  return (
    <LibraryView
      title="Simulations 🧪"
      description="Explore maths with hands-on interactive tools."
      resources={simulations.filter((s) => s.status === "published")}
      basePath="/student"
      role="student"
      lockType="simulation"
      defaultSort="stage"
    />
  );
}
