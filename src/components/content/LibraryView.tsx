"use client";

import type { Resource, Role, ContentType } from "@/types";
import { PageHeading } from "@/components/ui/PageHeading";
import { ContentLibrary } from "./ContentLibrary";

export function LibraryView({
  title,
  description,
  resources,
  basePath,
  role,
  lockType,
}: {
  title: string;
  description: string;
  resources: Resource[];
  basePath: string;
  role: Role;
  lockType?: ContentType;
}) {
  return (
    <div className="space-y-6">
      <PageHeading title={title} description={description} />
      <ContentLibrary resources={resources} basePath={basePath} role={role} lockType={lockType} />
    </div>
  );
}
