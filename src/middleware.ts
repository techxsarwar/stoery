import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request);

  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in but onboarding is not complete
  // Redirect to /onboarding unless they are already there or on an auth route
  if (user && !user.user_metadata?.onboarding_complete) {
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
    const isOnboardingRoute = request.nextUrl.pathname === '/onboarding';
    
    if (!isAuthRoute && !isOnboardingRoute) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // If user is NOT logged in and trying to access /onboarding, redirect to signin
  if (!user && request.nextUrl.pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
