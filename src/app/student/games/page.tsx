import { LibraryView } from "@/components/content/LibraryView";
import { games } from "@/data/resources";

export default function StudentGames() {
  return (
    <LibraryView
      title="Games 🎮"
      description="Play fun maths games and earn points, stars and badges!"
      resources={games.filter((g) => g.status === "published")}
      basePath="/student"
      role="student"
      lockType="game"
    />
  );
}
