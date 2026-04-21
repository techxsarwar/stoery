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
     * Match all request paths that should be protected:
     * - /onboarding
     * - /dashboard (and subpaths)
     * - /library (and subpaths)
     * - /community (and subpaths)
     */
    "/onboarding",
    "/dashboard/:path*",
    "/library/:path*",
    "/community/:path*",
  ],
};
