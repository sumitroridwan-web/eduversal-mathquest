import { LibraryView } from "@/components/content/LibraryView";
import { books } from "@/data/resources";

export default function AdminBooks() {
  return (
    <LibraryView
      title="Books library"
      description="All MathQuest books. Review, preview and manage curriculum mapping."
      resources={books}
      basePath="/admin"
      role="admin"
      lockType="book"
      defaultSort="stage"
    />
  );
}
