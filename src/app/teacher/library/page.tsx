import { LibraryView } from "@/components/content/LibraryView";
import { resources } from "@/data/resources";

export default function TeacherLibrary() {
  return (
    <LibraryView
      title="Content library"
      description="Browse and filter all curriculum-aligned games, simulations and books, then assign to your classes."
      resources={resources}
      basePath="/teacher"
      role="teacher"
      defaultSort="stage"
    />
  );
}
