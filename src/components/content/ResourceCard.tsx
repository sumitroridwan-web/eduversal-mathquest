"use client";

import Link from "next/link";
import { Heart, Clock, Play, Plus, Star, Lock, CheckCircle2 } from "lucide-react";
import type { Resource, Role } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResourceCover } from "./ResourceCover";
import { typeLabel, stageLabel, difficultyTone } from "@/lib/content";
import { useFavourites, useToasts } from "@/stores/ui";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  /** Base path for the detail link, e.g. /teacher or /student */
  basePath: string;
  role?: Role;
  locked?: boolean;
  onAssign?: (resource: Resource) => void;
  completion?: { score?: number; done: boolean };
}

export function ResourceCard({
  resource,
  basePath,
  role,
  locked,
  onAssign,
  completion,
}: ResourceCardProps) {
  const { has, toggle } = useFavourites();
  const notify = useToasts((s) => s.notify);
  const fav = has(resource.id);
  const href = `${basePath}/library/${resource.id}`;
  const canAssign = role === "teacher" || role === "admin";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative">
        <Link href={locked ? "/login" : href} aria-label={`Open ${resource.title}`}>
          <ResourceCover resource={resource} className="h-36 w-full" />
        </Link>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge tone="navy" className="bg-white/90 backdrop-blur">
            {typeLabel[resource.type]}
          </Badge>
          {resource.status !== "published" && (
            <Badge tone="amber" className="bg-white/90 capitalize backdrop-blur">
              {resource.status}
            </Badge>
          )}
        </div>
        <button
          onClick={() => {
            toggle(resource.id);
            notify({
              variant: "success",
              title: fav ? "Removed from favourites" : "Added to favourites",
              description: resource.title,
            });
          }}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-navy-500 shadow-sm backdrop-blur transition-colors hover:text-rose-500"
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={fav}
        >
          <Heart className={cn("h-4 w-4", fav && "fill-rose-500 text-rose-500")} />
        </button>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-950/45 backdrop-blur-[2px]">
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-navy-800 shadow">
              <Lock className="h-3.5 w-3.5" /> Login to play
            </span>
          </div>
        )}
        {completion?.done && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {completion.score != null ? `${completion.score}%` : "Done"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone="teal">{stageLabel(resource)}</Badge>
          <Badge tone="grey">{resource.strand === "Early Mathematical Experiences" ? "Early Maths" : resource.strand}</Badge>
          <Badge tone={difficultyTone[resource.difficulty]}>{resource.difficulty}</Badge>
        </div>

        <Link href={locked ? "/login" : href}>
          <h3 className="font-display text-base font-semibold text-navy-900 group-hover:text-teal-700">
            {resource.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-navy-500">{resource.objective.student}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-navy-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {resource.durationMins} min
          </span>
          {resource.rating != null && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" /> {resource.rating}
            </span>
          )}
          <span className="ml-auto font-mono text-[11px] text-navy-300">{resource.curriculumRef}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            asChildHref={locked ? "/login" : href}
          >
            <Play className="h-4 w-4" /> {resource.type === "book" ? "Read" : "Start"}
          </Button>
          {canAssign && onAssign && (
            <Button size="sm" variant="outline" onClick={() => onAssign(resource)}>
              <Plus className="h-4 w-4" /> Assign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
