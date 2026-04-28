import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().replace(/^@/, "") || "";

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const profiles = await prisma.profile.findMany({
    where: {
      username: { startsWith: q, mode: "insensitive" },
    },
    select: { username: true, pen_name: true, avatar_url: true, isVerified: true },
    take: 8,
  });

  return NextResponse.json(profiles);
}
