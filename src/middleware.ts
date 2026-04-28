import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Define the subdomain you want to detect
  const subdomain = 'adswith.globalpulse24.in'

  // If the user is visiting the subdomain
  if (hostname === subdomain || hostname === `adswith.localhost:3001`) {
    // Rewrite the request to the internal "/publish-ad" route
    if (url.pathname === '/') {
       return NextResponse.rewrite(new URL('/publish-ad', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
