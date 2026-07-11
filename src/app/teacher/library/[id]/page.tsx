import { notFound } from "next/navigation";
import { getResource } from "@/data/resources";
import { ResourceDetail } from "@/components/content/ResourceDetail";

export default function TeacherResourceDetail({ params }: { params: { id: string } }) {
  const resource = getResource(params.id);
  if (!resource) notFound();
  return <ResourceDetail resource={resource} basePath="/teacher" role="teacher" />;
}
