"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createClient } from "@/utils/supabase/client";

import { signOut as nextAuthSignOut } from "next-auth/react";

interface NavbarProps {
  user: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      // Sign out from Supabase if active
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
      
      router.refresh();
      router.push("/");
    });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm">
      <div className="flex justify-between items-center px-8 py-4 max-w-full">
        <Link
          className="flex items-center gap-3 text-2xl font-black tracking-tighter text-on-surface font-headline uppercase"
          href="/"
        >
          <img src="/logo.png" alt="SOULPAD Logo" className="w-8 h-8 object-contain" />
          SOULPAD
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase"
            href="/discover"
          >
            Discover
          </Link>
          <Link
            className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase"
            href="/community"
          >
            Community
          </Link>
          {user && (
            <Link
              className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase"
              href="/library"
            >
              My Library
            </Link>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {!user ? (
            <Link
              href="/auth/signin"
              className="bg-white text-on-surface font-headline px-6 py-2 rounded font-bold border-2 border-on-surface transition-all duration-300 hover:bg-surface-container uppercase tracking-wide"
            >
              Sign In
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard/write"
                className="bg-primary text-on-primary font-headline px-6 py-2 rounded font-bold border-2 border-on-surface transition-all duration-300 glow-hover uppercase tracking-wide"
              >
                Start Writing
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isPending}
                className="text-on-surface-variant hover:text-primary font-headline font-bold uppercase tracking-wide transition-colors text-sm disabled:opacity-50"
              >
                {isPending ? "..." : "Sign Out"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
