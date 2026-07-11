"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContentLibrary } from "@/components/content/ContentLibrary";
import { resources, games, simulations, books } from "@/data/resources";

const tabs = [
  { id: "all", label: "All", count: resources.length },
  { id: "game", label: "Games", count: games.length },
  { id: "simulation", label: "Simulations", count: simulations.length },
  { id: "book", label: "Books", count: books.length },
];

export default function ExplorePage() {
  const [tab, setTab] = useState("all");
  const list =
    tab === "all" ? resources : resources.filter((r) => r.type === tab);

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <Badge tone="accent" className="mb-3">Preview mode</Badge>
        <h1 className="font-display text-3xl font-bold text-navy-900">Explore the MathQuest library</h1>
        <p className="mt-3 text-navy-500">
          Browse a preview of our curriculum-aligned games, simulations and books. Activities are
          locked until you log in — create a free demo account to start playing and assigning.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50/60 p-4">
        <Lock className="h-5 w-5 text-accent-600" />
        <p className="text-sm text-navy-700">
          This is a preview. <strong>Login or sign up</strong> to open full activities, save favourites and track progress.
        </p>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" asChildHref="/login">Login</Button>
          <Button size="sm" variant="primary" asChildHref="/sign-up">Sign Up</Button>
        </div>
      </div>

      <div className="mt-8">
        <Tabs tabs={tabs} active={tab} onChange={setTab} className="mb-6 w-fit" />
        <ContentLibrary resources={list} basePath="/explore" locked />
      </div>
    </div>
  );
}
