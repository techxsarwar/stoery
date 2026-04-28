import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getAllFeedPosts, getFollowingFeedPosts, getSuggestedAuthors } from "@/actions/feed";
import Navbar from "@/components/Navbar";
import FeedClient from "@/components/FeedClient";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Author Feed — SOULPAD",
  description: "See the latest updates from your favourite authors on SOULPAD.",
};

export default async function FeedPage() {
  // Auth
  let user: any = null;
  let currentProfile: any = null;
  let followingIds: string[] = [];

  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;

    if (user?.email) {
      currentProfile = await prisma.profile.findFirst({
        where: { user: { email: user.email } },
      });

      if (currentProfile) {
        const follows = await prisma.follow.findMany({
          where: { followerId: currentProfile.id },
          select: { followingId: true },
        });
        followingIds = follows.map((f) => f.followingId);
      }
    }
  } catch {
    // Continue as logged-out visitor
  }

  // Data
  const [allPosts, followingPosts, suggestedAuthors] = await Promise.all([
    getAllFeedPosts(currentProfile?.id),
    currentProfile ? getFollowingFeedPosts(currentProfile.id) : Promise.resolve([]),
    getSuggestedAuthors(currentProfile?.id),
  ]);

  return (
    <div className="min-h-screen bg-surface pt-20 sm:pt-24">
      <Navbar user={user ?? null} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-20 sm:pb-32 mt-6 sm:mt-8">

        {/* Page Header */}
        <header className="mb-8 sm:mb-12 border-b-8 border-primary pb-6 sm:pb-8">
          <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">
            Author Feed
          </h1>
          <p className="font-label font-bold text-on-surface-variant text-sm sm:text-base uppercase tracking-[0.3em] mt-3 opacity-70">
            Stories in the making — live updates from the community
          </p>
        </header>

        {/* 3-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* ── LEFT SIDEBAR (desktop only) ── */}
          <aside className="hidden lg:flex flex-col gap-6 w-72 flex-shrink-0">
            {/* Quick nav */}
            <div className="bg-white border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5">
              <h3 className="font-headline font-black text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-4">
                Quick Nav
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Discover Stories", href: "/discover" },
                  { label: "Community", href: "/community" },
                  ...(user
                    ? [
                        { label: "My Library", href: "/library" },
                        { label: "My Dashboard", href: "/dashboard" },
                      ]
                    : []),
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-label font-black text-xs uppercase tracking-widest text-on-surface hover:text-primary py-2 border-b border-on-surface/10 last:border-0 transition-colors"
                  >
                    → {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Start writing CTA */}
            {user && (
              <Link
                href="/dashboard/write"
                className="bg-primary text-on-primary border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all p-5 flex flex-col gap-2"
              >
                <span className="text-2xl">✍️</span>
                <span className="font-headline font-black text-base uppercase tracking-tighter">
                  Write a New Story
                </span>
                <span className="font-label text-xs font-bold opacity-70">
                  Share your universe with the world.
                </span>
              </Link>
            )}
          </aside>

          {/* ── MAIN FEED ── */}
          <main className="flex-1 min-w-0">
            <FeedClient
              allPosts={allPosts as any}
              followingPosts={followingPosts as any}
              currentProfileId={currentProfile?.id}
              followingIds={followingIds}
              isLoggedIn={!!user}
            />
          </main>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="flex flex-col gap-6 w-full lg:w-64 flex-shrink-0">
            {/* Suggested Authors */}
            <div className="bg-white border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5">
              <h3 className="font-headline font-black text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-5">
                🔥 Authors to Follow
              </h3>
              <div className="flex flex-col gap-4">
                {suggestedAuthors.length === 0 ? (
                  <p className="font-label text-xs text-on-surface-variant font-bold">
                    No suggestions yet.
                  </p>
                ) : (
                  suggestedAuthors.map((author) => {
                    const initial = (author.pen_name || "?")[0].toUpperCase();
                    const isFollowing = followingIds.includes(author.id);
                    const isOwn = author.id === currentProfile?.id;

                    return (
                      <div key={author.id} className="flex items-center gap-3">
                        {/* Avatar */}
                        <Link href={`/author/${encodeURIComponent(author.pen_name || "")}`} className="flex-shrink-0">
                          {author.avatar_url ? (
                            <img
                              src={author.avatar_url}
                              alt={author.pen_name || "Author"}
                              className="w-9 h-9 rounded-full object-cover border-2 border-on-surface"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary border-2 border-on-surface flex items-center justify-center">
                              <span className="font-headline font-black text-sm text-on-primary">
                                {initial}
                              </span>
                            </div>
                          )}
                        </Link>

                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/author/${encodeURIComponent(author.pen_name || "")}`}
                              className="font-headline font-black text-xs text-on-surface uppercase truncate hover:text-primary transition-colors"
                            >
                              {author.pen_name}
                            </Link>
                            {author.isVerified && (
                              <span
                                title="Verified Author"
                                className="inline-flex items-center justify-center w-3.5 h-3.5 bg-primary border border-on-surface rounded-full text-[8px] font-black flex-shrink-0 text-on-surface"
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="font-label text-[9px] font-bold text-on-surface-variant">
                            {author._count.followers} followers · {author._count.stories} stories
                          </span>
                        </div>

                        {/* Compact Follow */}
                        <FollowButton
                          targetProfileId={author.id}
                          initialIsFollowing={isFollowing}
                          isOwnProfile={isOwn}
                          isLoggedIn={!!user}
                          compact
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Not signed in — nudge */}
            {!user && (
              <div className="bg-on-surface text-white border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col gap-3">
                <span className="text-2xl">👤</span>
                <p className="font-headline font-black text-sm uppercase tracking-tighter">
                  Join SOULPAD
                </p>
                <p className="font-label text-xs font-bold opacity-70">
                  Follow your favourite authors and never miss an update.
                </p>
                <Link
                  href="/auth/signup"
                  className="bg-primary text-on-primary border-2 border-primary px-4 py-2 font-headline font-black text-xs uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
                >
                  Create Account
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
