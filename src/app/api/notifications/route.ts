import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const notifications = await prisma.notification.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return NextResponse.json({ notifications });
}

export async function PUT() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await prisma.notification.updateMany({
    where: { profileId: profile.id, isRead: false },
    data: { isRead: true }
  });

  return NextResponse.json({ success: true });
}
