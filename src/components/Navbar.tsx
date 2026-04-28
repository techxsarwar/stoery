"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { Menu, X, BookOpen, Compass, Users, Library, User, LayoutDashboard, PenLine, LogOut, LogIn } from "lucide-react";

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
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      await nextAuthSignOut({ redirect: false });
      router.refresh();
      router.push("/");
    });
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm">
        <div className="flex justify-between items-center px-4 sm:px-8 py-4 max-w-full">
          {/* Logo */}
          <Link
            className="flex items-center gap-3 text-xl sm:text-2xl font-black tracking-tighter text-on-surface font-headline uppercase"
            href="/"
          >
            <img src="/logo.png" alt="SOULPAD Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            SOULPAD
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase" href="/discover">
              Discover
            </Link>
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase" href="/community">
              Community
            </Link>
            {user && (
              <>
                <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase" href="/library">
                  My Library
                </Link>
                <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase" href="/dashboard/settings">
                  My Profile
                </Link>
                <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase" href="/dashboard">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-4 items-center">
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

          {/* Mobile Hamburger */}
          <button
            id="navbar-hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-surface flex flex-col" style={{ top: "65px" }}>
          <nav className="flex-1 flex flex-col p-6 gap-2 overflow-y-auto">

            {/* Primary Nav */}
            <div className="mb-4">
              <p className="font-label font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant opacity-50 mb-3 px-2">Explore</p>
              <Link href="/discover" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface font-headline font-black text-lg uppercase tracking-tight hover:bg-primary/10 hover:text-primary transition-all">
                <Compass size={20} className="text-primary" /> Discover
              </Link>
              <Link href="/community" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface font-headline font-black text-lg uppercase tracking-tight hover:bg-primary/10 hover:text-primary transition-all">
                <Users size={20} className="text-primary" /> Community
              </Link>
            </div>

            {/* User Nav */}
            {user && (
              <div className="mb-4">
                <p className="font-label font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant opacity-50 mb-3 px-2">Your Space</p>
                <Link href="/library" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface font-headline font-black text-lg uppercase tracking-tight hover:bg-primary/10 hover:text-primary transition-all">
                  <Library size={20} className="text-primary" /> My Library
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface font-headline font-black text-lg uppercase tracking-tight hover:bg-primary/10 hover:text-primary transition-all">
                  <User size={20} className="text-primary" /> My Profile
                </Link>
                <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface font-headline font-black text-lg uppercase tracking-tight hover:bg-primary/10 hover:text-primary transition-all">
                  <LayoutDashboard size={20} className="text-primary" /> Dashboard
                </Link>
              </div>
            )}

          </nav>

          {/* Bottom CTA */}
          <div className="p-6 border-t border-on-surface/10 flex flex-col gap-3">
            {!user ? (
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-3 bg-on-surface text-surface font-headline font-black text-lg px-6 py-4 rounded-xl uppercase tracking-tight border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <LogIn size={18} /> Sign In
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard/write"
                  className="flex items-center justify-center gap-3 bg-primary text-on-primary font-headline font-black text-lg px-6 py-4 rounded-xl uppercase tracking-tight border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  <PenLine size={18} /> Start Writing
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="flex items-center justify-center gap-3 text-on-surface-variant font-headline font-black text-sm uppercase tracking-wide py-3 hover:text-primary transition-colors disabled:opacity-50"
                >
                  <LogOut size={16} /> {isPending ? "Signing Out..." : "Sign Out"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
