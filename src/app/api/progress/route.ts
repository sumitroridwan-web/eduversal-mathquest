import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/progress?userId=... → all saved progress for a learner
export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const rows = await prisma.progress.findMany({ where: { userId } });
  return NextResponse.json(rows);
}

// POST /api/progress  { userId, resourceId, result?: {score,stars,completed}, lastPage? }
// Merges the new result into any existing row (keeps the best), server-side.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.userId || !body?.resourceId) return NextResponse.json({ error: "userId and resourceId required" }, { status: 400 });
  const { userId, resourceId, result, lastPage } = body as {
    userId: string; resourceId: string; result?: { score?: number; stars?: number; completed?: boolean }; lastPage?: number;
  };

  const key = { userId_resourceId: { userId, resourceId } };
  const existing = await prisma.progress.findUnique({ where: key });
  const data = {
    attempts: (existing?.attempts ?? 0) + (result ? 1 : 0),
    bestScore: Math.max(existing?.bestScore ?? 0, result?.score ?? 0),
    stars: Math.max(existing?.stars ?? 0, result?.stars ?? 0),
    completed: (existing?.completed ?? false) || Boolean(result?.completed),
    lastPage: lastPage ?? existing?.lastPage ?? null,
  };
  const saved = await prisma.progress.upsert({ where: key, create: { userId, resourceId, ...data }, update: data });
  return NextResponse.json(saved);
}
