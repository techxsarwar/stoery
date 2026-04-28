import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ penName: string }> }
) {
  const { penName } = await params;
  const decoded = decodeURIComponent(penName);

  try {
    const profile = await prisma.profile.findUnique({
      where: { pen_name: decoded },
      select: { id: true },
    });
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const following = await prisma.follow.findMany({
      where: { followerId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        following: {
          select: {
            id: true,
            pen_name: true,
            username: true,
            avatar_url: true,
            isVerified: true,
            _count: { select: { followers: true } },
          },
        },
      },
    });

    return NextResponse.json(following.map((f) => f.following));
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
