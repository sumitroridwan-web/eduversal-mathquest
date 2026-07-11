"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToasts } from "@/stores/ui";
import { FileText, Download, BookOpen, Printer } from "lucide-react";

const guides = [
  { title: "Concrete-Pictorial-Abstract in Early Years", type: "Teaching guide", pages: 8, strand: "Number" },
  { title: "Bridging Through Ten — Teaching Sequence", type: "Teaching guide", pages: 6, strand: "Number" },
  { title: "Fractions: Common Misconceptions", type: "Teaching guide", pages: 5, strand: "Number" },
  { title: "Ten Frame Printables (A4)", type: "Printable", pages: 4, strand: "Number" },
  { title: "Number Line 0–100 Printable", type: "Printable", pages: 2, strand: "Number" },
  { title: "2D Shape Sorting Mats", type: "Printable", pages: 3, strand: "Geometry and Measure" },
  { title: "Thinking & Working Mathematically Prompt Cards", type: "Printable", pages: 4, strand: "All strands" },
  { title: "Home-Learning Parent Guide — Counting", type: "Parent guide", pages: 2, strand: "Early Maths" },
];

export default function TeacherResources() {
  const notify = useToasts((s) => s.notify);
  return (
    <div className="space-y-6">
      <PageHeading title="Teaching resources" description="Teaching guides, printable worksheets and parent guides to support your lessons." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <div key={g.title} className="flex flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
              {g.type === "Printable" ? <Printer className="h-5 w-5" /> : g.type === "Parent guide" ? <BookOpen className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </span>
            <h3 className="mt-3 font-semibold text-navy-900">{g.title}</h3>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge tone="grey">{g.type}</Badge>
              <Badge tone="teal">{g.strand === "Geometry and Measure" ? "Geometry" : g.strand}</Badge>
            </div>
            <p className="mt-2 flex-1 text-xs text-navy-400">{g.pages} pages · PDF</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => notify({ variant: "success", title: "Download started", description: `${g.title} (demo).` })}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
