import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Next.js 16: named export must be 'proxy'
export async function proxy(request: NextRequest) {
  try {
    const hostname = request.headers.get("host") || "";
    const subdomain = "adswith.globalpulse24.in";

    // Subdomain rewrite: redirect adswith subdomain to /publish-ad
    if (hostname === subdomain || hostname === "adswith.localhost:3001") {
      if (request.nextUrl.pathname === "/") {
        return NextResponse.rewrite(new URL("/publish-ad", request.url));
      }
    }
  } catch {
    // If subdomain logic fails for any reason, fall through to session handling
  }

  // Supabase session refresh for all other requests
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth and api/* that are public
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, public assets
     * - Public pages: /, /discover, /community, /about, /terms, /privacy, /read/*
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|discover|community|about|terms|privacy|read|$).*)",
  ],
};

