import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.authorPost.findUnique({
    where: { id },
    include: { profile: { select: { pen_name: true } } },
  });
  if (!post) return { title: "Post Not Found — SOULPAD" };
  return {
    title: `${post.profile.pen_name} on SOULPAD`,
    description: post.content.slice(0, 160),
  };
}

export default async function SinglePostPage({ params }: Props) {
  const { id } = await params;

  let user: any = null;
  let currentProfile: any = null;
  let followingIds: string[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
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
  } catch {}

  const post = await prisma.authorPost.findUnique({
    where: { id },
    include: {
      profile: {
        select: {
          id: true,
          pen_name: true,
          full_name: true,
          username: true,
          avatar_url: true,
          isVerified: true,
          _count: { select: { followers: true } },
        },
      },
      story: {
        select: {
          id: true,
          title: true,
          genre: true,
          cover_url: true,
          _count: { select: { likes: true } },
        },
      },
      _count: { select: { likes: true } },
      ...(currentProfile
        ? { likes: { where: { profileId: currentProfile.id }, select: { id: true } } }
        : {}),
    },
  });

  if (!post) notFound();

  const enrichedPost = {
    ...post,
    likeCount: post._count.likes,
    isLikedByMe: currentProfile ? (post as any).likes?.length > 0 : false,
  };

  const isOwn = post.profile.id === currentProfile?.id;
  const isFollowing = followingIds.includes(post.profile.id);

  return (
    <div className="min-h-screen bg-surface pt-20 sm:pt-24">
      <Navbar user={user ?? null} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 mt-8">
        {/* Back link */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 font-label font-black text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          ← Back to Feed
        </Link>

        <PostCard
          post={enrichedPost as any}
          currentProfileId={currentProfile?.id}
          initialIsFollowing={isFollowing}
          isOwnProfile={isOwn}
          isLoggedIn={!!user}
        />
      </div>
    </div>
  );
}
