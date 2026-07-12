import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/assignments  → all assignments, newest first
export async function GET() {
  const rows = await prisma.assignment.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

// POST /api/assignments  { resourceId, classId, className, due?, instructions?, assignedBy }
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b?.resourceId || !b?.classId || !b?.assignedBy) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const saved = await prisma.assignment.create({
    data: { resourceId: b.resourceId, classId: b.classId, className: b.className ?? "class", due: b.due ?? null, instructions: b.instructions ?? null, assignedBy: b.assignedBy },
  });
  return NextResponse.json(saved);
}

// DELETE /api/assignments?id=...
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.assignment.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
