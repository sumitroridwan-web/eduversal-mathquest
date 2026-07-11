import { LibraryView } from "@/components/content/LibraryView";
import { books } from "@/data/resources";

export default function StudentBooks() {
  return (
    <LibraryView
      title="Books 📖"
      description="Read maths stories and answer the checkpoint questions."
      resources={books.filter((b) => b.status === "published")}
      basePath="/student"
      role="student"
      lockType="book"
    />
  );
}
