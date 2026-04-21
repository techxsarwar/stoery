import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 1. If they are logged in but haven't finished onboarding
    // AND they aren't already on the onboarding page
    if (token && !token.onboardingComplete && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only runs for matched routes
    },
    pages: {
      signIn: "/auth/signin", // Your custom sign-in page
    },
  }
);

// 2. THIS IS THE CRUCIAL PART
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. / (The landing page)
     * 2. /api/auth (All NextAuth routes)
     * 3. /discover, /community (Your public pages)
     * 4. Static assets
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|discover|community|$).*)",
  ],
};
