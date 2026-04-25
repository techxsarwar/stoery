import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ role: "NONE" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { role: true }
    });

    return NextResponse.json({ role: dbUser?.role || "AUTHOR" });
  } catch (error) {
    return NextResponse.json({ role: "AUTHOR" });
  }
}
