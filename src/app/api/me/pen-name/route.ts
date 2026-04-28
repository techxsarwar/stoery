import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ penName: null }, { status: 401 });
  }

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
    select: { pen_name: true },
  });

  return NextResponse.json({ penName: profile?.pen_name || null });
}
