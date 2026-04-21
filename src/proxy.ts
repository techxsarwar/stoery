import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Next.js 16: named export must be 'proxy'
export async function proxy(request: NextRequest) {
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
