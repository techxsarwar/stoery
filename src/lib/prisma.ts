import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });
}

// In production always create a single instance.
// In development, bust the cache if the client is stale (e.g. after schema changes).
export const prisma = (() => {
  if (process.env.NODE_ENV === "production") {
    return globalForPrisma.prisma ?? createPrismaClient();
  }
  // Dev: always create a fresh client and update the global reference
  // so HMR picks up new Prisma models without needing a server restart.
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
})();
