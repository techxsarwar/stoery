import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // After successful login, check if the user has completed onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check Prisma profile for onboarding status
        const { prisma } = await import("@/lib/prisma");
        const profile = await prisma.profile.findFirst({
          where: {
            user: { email: user.email },
          },
          select: { pen_name: true },
        });

        if (!profile?.pen_name) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to sign in page with error
  return NextResponse.redirect(`${origin}/auth/signin?error=OAuthCallback`);
}
