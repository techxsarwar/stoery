import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getPublicProfile } from "@/actions/profile";
import Navbar from "@/components/Navbar";
import FollowButton from "@/components/FollowButton";
import type { Metadata } from "next";

// Always server-render at request time so cookies (Supabase session) are available
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ penName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
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
  } catch {
    return { title: "SOULPAD Author" };
  }
}

export default async function AuthorProfilePage({ params }: Props) {
  const { penName } = await params;
  const decoded = decodeURIComponent(penName);

  // Fetch profile data
  const profile = await getPublicProfile(decoded);
  if (!profile) {
    notFound();
  }

  // profile is now guaranteed non-null
  const safeProfile = profile;

  // Fetch current logged-in user (safe — won't throw even if no session)
  let user: any = null;
  let isOwnProfile = false;
  let currentFollowing = false;

  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;

    if (user?.email) {
      const currentUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { profile: true },
      });

      if (currentUser?.profile?.id === safeProfile.id) {
        isOwnProfile = true;
      } else if (currentUser?.profile) {
        // Check follow status
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.profile.id,
              followingId: safeProfile.id,
            },
          },
        });
        currentFollowing = !!follow;
      }
    }
  } catch {
    // If session fetch fails, continue as logged-out visitor
  }

  const initial = (safeProfile.pen_name || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-20 sm:pt-24 px-4 sm:px-6 md:px-12 w-full mx-auto relative">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-5xl flex flex-col gap-8 sm:gap-10 mt-6 sm:mt-8 pb-20 sm:pb-32">

        {/* ─── HERO CARD ─── */}
        <section className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 md:p-12 relative overflow-hidden">
          {/* Yellow accent stripe */}
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start pt-2">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {safeProfile.avatar_url ? (
                <img
                  src={safeProfile.avatar_url}
                  alt={`${safeProfile.pen_name}'s avatar`}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-primary flex items-center justify-center">
                  <span className="font-headline font-black text-4xl sm:text-5xl md:text-6xl text-on-primary select-none">
                    {initial}
                  </span>
                </div>
              )}
              {safeProfile.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-on-surface text-primary rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-xs sm:text-sm font-black">✓</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 text-center sm:text-left w-full">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tighter uppercase leading-none break-words">
                    {safeProfile.pen_name}
                  </h1>
                  {safeProfile.isVerified && (
                    <span
                      title="Verified Author"
                      className="inline-flex items-center justify-center w-7 h-7 bg-primary border-2 border-on-surface rounded-full text-sm font-black flex-shrink-0 text-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      ✓
                    </span>
                  )}
                </div>
                {safeProfile.full_name && (
                  <p className="font-label text-on-surface-variant font-bold uppercase tracking-wider mt-2 text-xs sm:text-sm">
                    {safeProfile.full_name}
                  </p>
                )}
                {safeProfile.username && (
                  <p className="font-headline font-black text-primary text-base sm:text-lg tracking-tight mt-1">
                    @{safeProfile.username}
                  </p>
                )}
              </div>

              {safeProfile.bio && (
                <p className="font-body text-base sm:text-lg md:text-xl text-on-surface/80 leading-relaxed max-w-xl italic">
                  &ldquo;{safeProfile.bio}&rdquo;
                </p>
              )}

              {/* Follow / Edit Button */}
              <div className="mt-1 sm:mt-2 flex justify-center sm:justify-start">
                <FollowButton
                  targetProfileId={safeProfile.id}
                  initialIsFollowing={currentFollowing}
                  isOwnProfile={isOwnProfile}
                  isLoggedIn={!!user}
                />
              </div>
            </div>
          </div>

          {/* ─── STATS BAR ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t-4 border-on-surface/10">
            <StatItem label="Stories" value={safeProfile.stories.length} />
            <StatItem label="Total Likes" value={safeProfile.totalLikes} icon="★" />
            <StatItem label="Followers" value={safeProfile.followerCount} />
            <StatItem label="Following" value={safeProfile.followingCount} />
          </div>
        </section>

        {/* ─── PUBLISHED STORIES ─── */}
        <section className="flex flex-col gap-6 sm:gap-8">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-black text-on-surface uppercase tracking-tighter border-b-8 border-primary pb-3 sm:pb-4 w-max">
            Published Works
          </h2>

          {safeProfile.stories.length === 0 ? (
            <div className="p-10 sm:p-16 border-4 border-dashed border-outline-variant text-center bg-white">
              <p className="font-headline font-bold text-xl sm:text-2xl text-on-surface-variant uppercase tracking-wide">
                No stories published yet.
              </p>
              <p className="font-body text-base sm:text-lg text-on-surface-variant/60 mt-2 italic">
                This author is crafting their first masterpiece...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {safeProfile.stories.map((story) => (
                <Link key={story.id} href={`/read/${story.id}`}>
                  <article className="bg-white rounded-lg overflow-hidden group transition-all duration-300 cursor-pointer relative h-full flex flex-col border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] sm:hover:translate-x-[4px] sm:hover:translate-y-[4px] hover:shadow-none">
                    <div className="h-40 sm:h-48 w-full bg-surface-variant relative overflow-hidden flex-shrink-0 border-b-4 border-on-surface">
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
                    <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 relative z-10 flex-grow">
                      {story.genre && (
                        <span className="inline-block px-3 py-1 bg-primary text-on-primary border-2 border-on-surface font-headline text-xs font-bold uppercase tracking-wider w-max">
                          {story.genre}
                        </span>
                      )}
                      <div>
                        <h3 className="font-headline text-lg sm:text-2xl font-black text-on-surface leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="font-label text-xs sm:text-sm text-on-surface-variant font-bold mt-2 uppercase flex justify-between">
                          <span>
                            {new Date(story.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="text-on-surface flex gap-2 sm:gap-3">
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
      <span className="font-headline text-2xl sm:text-3xl md:text-4xl font-black text-on-surface tracking-tight">
        {icon && <span className="text-primary mr-1">{icon}</span>}
        {value}
      </span>
      <span className="font-label text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
