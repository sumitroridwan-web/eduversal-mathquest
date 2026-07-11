import { LibraryView } from "@/components/content/LibraryView";
import { simulations } from "@/data/resources";

export default function TeacherSimulations() {
  return (
    <LibraryView
      title="MathQuest Simulations"
      description="Interactive virtual manipulatives with hints, resets, teacher guides and discussion prompts."
      resources={simulations}
      basePath="/teacher"
      role="teacher"
      lockType="simulation"
      defaultSort="stage"
    />
  );
}
