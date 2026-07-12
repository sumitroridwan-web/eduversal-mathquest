import { PrismaClient } from "@prisma/client";

// Server-only Prisma client singleton (reused across hot-reloads in dev).
// Import this ONLY from server code (route handlers), never client components.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
