import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

// Cache in ALL environments — prevents "prepared statement already exists"
// (PG error 42P05) in serverless where the module cache is reused across
// warm invocations but connection state may be stale.
globalForPrisma.prisma = prisma;
