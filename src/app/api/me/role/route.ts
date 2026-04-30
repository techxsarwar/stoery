import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ role: "AUTHOR" }, { status: 200 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { role: true },
  });

  return NextResponse.json(
    { role: dbUser?.role || "AUTHOR" },
    {
      headers: {
        // Cache for 60s in the browser — role rarely changes
        "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
      },
    }
  );
}
