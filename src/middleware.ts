import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = request.nextUrl;

  // 1. If user is logged in but onboarding is not complete
  if (token && !token.onboardingComplete) {
    const isAuthRoute = pathname.startsWith('/api/auth') || pathname.startsWith('/auth');
    const isOnboardingRoute = pathname === '/onboarding';
    
    if (!isAuthRoute && !isOnboardingRoute) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // 2. If user is NOT logged in and trying to access /onboarding, redirect to signin
  if (!token && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
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
