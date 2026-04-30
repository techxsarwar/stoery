export const unstable_instant = false;
export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ role: "NONE" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { role: true }
    });

    return NextResponse.json({ role: dbUser?.role || "NONE" });
  } catch (error) {
    console.error("Manager role verification API failed:", error);
    return NextResponse.json({ role: "NONE", error: "Internal server error" }, { status: 500 });
  }
}
