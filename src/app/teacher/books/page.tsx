import { LibraryView } from "@/components/content/LibraryView";
import { books } from "@/data/resources";

export default function TeacherBooks() {
  return (
    <LibraryView
      title="MathQuest Books"
      description="Interactive digital books with checkpoints, vocabulary help and teacher & parent guides."
      resources={books}
      basePath="/teacher"
      role="teacher"
      lockType="book"
    />
  );
}
