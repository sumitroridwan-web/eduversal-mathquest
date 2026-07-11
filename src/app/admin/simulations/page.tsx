import { LibraryView } from "@/components/content/LibraryView";
import { simulations } from "@/data/resources";

export default function AdminSimulations() {
  return (
    <LibraryView
      title="Simulations library"
      description="All MathQuest simulations. Review, preview and manage curriculum mapping."
      resources={simulations}
      basePath="/admin"
      role="admin"
      lockType="simulation"
      defaultSort="stage"
    />
  );
}
