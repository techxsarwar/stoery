"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Don't auto-poll /api/auth/session — this app uses Supabase as primary auth.
      // next-auth is only used for Spotify OAuth; fetching on every mount causes
      // CLIENT_FETCH_ERROR when the endpoint returns HTML instead of JSON.
      refetchInterval={0}
      refetchOnWindowFocus={false}
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  );
}
