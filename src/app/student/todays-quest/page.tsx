import { getResource } from "@/data/resources";
import { ResourceDetail } from "@/components/content/ResourceDetail";
import { Badge } from "@/components/ui/Badge";

export default function TodaysQuest() {
  const resource = getResource("res-addition-race")!;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge tone="accent">✨ Today&apos;s Quest</Badge>
        <span className="text-sm text-navy-500">Your special activity picked just for you today!</span>
      </div>
      <ResourceDetail resource={resource} basePath="/student" role="student" />
    </div>
  );
}
