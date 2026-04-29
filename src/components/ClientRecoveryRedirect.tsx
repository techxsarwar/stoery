"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if the URL has a hash fragment containing type=recovery
    // This happens when Supabase falls back to the Site URL (homepage)
    // because the Redirect URL wasn't whitelisted, but the user still needs to reset their password.
    if (typeof window !== "undefined" && window.location.hash) {
      if (window.location.hash.includes("type=recovery")) {
        router.push("/auth/reset-password" + window.location.hash);
      }
    }
    
    // Also check for PKCE code fallback to homepage
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("code") && document.referrer.includes("supabase.co")) {
       // Just in case it's a PKCE flow hitting the homepage directly
       router.push("/auth/callback?code=" + searchParams.get("code") + "&next=/auth/reset-password");
    }
  }, [router]);

  return null;
}
