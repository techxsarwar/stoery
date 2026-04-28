import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getPublicProfile, isFollowing } from "@/actions/profile";
import Navbar from "@/components/Navbar";
import FollowButton from "@/components/FollowButton";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ penName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { penName } = await params;
  const decoded = decodeURIComponent(penName);
  const profile = await getPublicProfile(decoded);

  if (!profile) {
    return { title: "Author Not Found — SOULPAD" };
  }

  return {
    title: `${profile.pen_name} — SOULPAD Author`,
    description:
      profile.bio ||
      `Read stories by ${profile.pen_name} on SOULPAD. ${profile.stories.length} stories published.`,
  };
}

export default async function AuthorProfilePage({ params }: Props) {
  const { penName } = await params;
  const decoded = decodeURIComponent(penName);
  const profile = await getPublicProfile(decoded);

  if (!profile) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if this is the current user's profile
  let isOwnProfile = false;
  let currentFollowing = false;

  if (user?.email) {
    const currentUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { profile: true },
    });
    if (currentUser?.profile?.id === profile.id) {
      isOwnProfile = true;
    } else {
      currentFollowing = await isFollowing(profile.id);
    }
  }

  const initial = (profile.pen_name || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-4 sm:px-6 md:px-12 w-full mx-auto relative">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-5xl flex flex-col gap-10 mt-8 pb-32">
        {/* ─── HERO CARD ─── */}
        <section className="bg-white border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative overflow-hidden">
          {/* Yellow accent stripe */}
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.pen_name}'s avatar`}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-primary flex items-center justify-center">
                  <span className="font-headline font-black text-5xl md:text-6xl text-on-primary select-none">
                    {initial}
                  </span>
                </div>
              )}
              {profile.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-on-surface text-primary rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-sm font-black">✓</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
              <div>
                <h1 className="font-headline text-4xl md:text-6xl font-black text-on-surface tracking-tighter uppercase leading-none">
                  {profile.pen_name}
                </h1>
                {profile.full_name && (
                  <p className="font-label text-on-surface-variant font-bold uppercase tracking-wider mt-2 text-sm">
                    {profile.full_name}
                  </p>
                )}
              </div>

              {profile.bio && (
                <p className="font-body text-xl text-on-surface/80 leading-relaxed max-w-xl italic">
                  &ldquo;{profile.bio}&rdquo;
                </p>
              )}

              {/* Follow Button */}
              <div className="mt-2">
                {user ? (
                  <FollowButton
                    targetProfileId={profile.id}
                    initialIsFollowing={currentFollowing}
                    isOwnProfile={isOwnProfile}
                  />
                ) : (
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 bg-on-surface text-white border-4 border-on-surface px-8 py-3 font-headline font-black text-lg uppercase tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Sign in to Follow
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ─── STATS BAR ─── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t-4 border-on-surface/10">
            <StatItem label="Stories" value={profile.stories.length} />
            <StatItem label="Total Likes" value={profile.totalLikes} icon="★" />
            <StatItem label="Followers" value={profile.followerCount} />
            <StatItem label="Following" value={profile.followingCount} />
          </div>
        </section>

        {/* ─── PUBLISHED STORIES ─── */}
        <section className="flex flex-col gap-8">
          <h2 className="font-headline text-3xl md:text-4xl font-black text-on-surface uppercase tracking-tighter border-b-8 border-primary pb-4 w-max">
            Published Works
          </h2>

          {profile.stories.length === 0 ? (
            <div className="p-16 border-4 border-dashed border-outline-variant text-center bg-white">
              <p className="font-headline font-bold text-2xl text-on-surface-variant uppercase tracking-wide">
                No stories published yet.
              </p>
              <p className="font-body text-lg text-on-surface-variant/60 mt-2 italic">
                This author is crafting their first masterpiece...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profile.stories.map((story) => (
                <Link key={story.id} href={`/read/${story.id}`}>
                  <article className="bg-white rounded-lg overflow-hidden group transition-all duration-300 cursor-pointer relative h-full flex flex-col border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                    <div className="h-48 w-full bg-surface-variant relative overflow-hidden flex-shrink-0 border-b-4 border-on-surface">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 will-change-transform"
                        style={{
                          backgroundImage: `url('${
                            story.cover_url ||
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                          }')`,
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col gap-4 relative z-10 flex-grow">
                      {story.genre && (
                        <span className="inline-block px-3 py-1 bg-primary text-on-primary border-2 border-on-surface font-headline text-xs font-bold uppercase tracking-wider w-max">
                          {story.genre}
                        </span>
                      )}
                      <div>
                        <h3 className="font-headline text-2xl font-black text-on-surface leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="font-label text-sm text-on-surface-variant font-bold mt-2 uppercase flex justify-between">
                          <span>
                            {new Date(story.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              }
                            )}
                          </span>
                          <span className="text-on-surface flex gap-3">
                            <span>★ {story._count.likes}</span>
                            <span>💬 {story._count.comments}</span>
                          </span>
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <span className="font-headline text-3xl md:text-4xl font-black text-on-surface tracking-tight">
        {icon && <span className="text-primary mr-1">{icon}</span>}
        {value}
      </span>
      <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
