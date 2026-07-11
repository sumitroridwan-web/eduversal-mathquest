import { LibraryView } from "@/components/content/LibraryView";
import { games } from "@/data/resources";

export default function AdminGames() {
  return (
    <LibraryView
      title="Games library"
      description="All MathQuest games. Review, preview and manage curriculum mapping."
      resources={games}
      basePath="/admin"
      role="admin"
      lockType="game"
    />
  );
}
