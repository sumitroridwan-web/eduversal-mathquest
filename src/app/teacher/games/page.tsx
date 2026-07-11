import { LibraryView } from "@/components/content/LibraryView";
import { games } from "@/data/resources";

export default function TeacherGames() {
  return (
    <LibraryView
      title="MathQuest Games"
      description="Fluency-building games from counting to problem solving. Assign directly to a class or group."
      resources={games}
      basePath="/teacher"
      role="teacher"
      lockType="game"
    />
  );
}
