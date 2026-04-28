"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, storyId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return { error: "Must be logged in" };

  const trimmed = content.trim();
  if (!trimmed) return { error: "Post cannot be empty" };
  if (trimmed.length > 500) return { error: "Post must be 500 characters or less" };

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
  });

  if (!profile) return { error: "Profile not found. Complete onboarding first." };

  await prisma.authorPost.create({
    data: {
      content: trimmed,
      profileId: profile.id,
      storyId: storyId || null,
    },
  });

  revalidatePath("/feed");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return { error: "Unauthorized" };

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
  });

  if (!profile) return { error: "Profile not found" };

  const post = await prisma.authorPost.findUnique({ where: { id: postId } });
  if (!post || post.profileId !== profile.id) {
    return { error: "Not your post" };
  }

  await prisma.authorPost.delete({ where: { id: postId } });

  revalidatePath("/feed");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getAllFeedPosts() {
  return prisma.authorPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      profile: {
        select: {
          id: true,
          pen_name: true,
          full_name: true,
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
    },
  });
}

export async function getFollowingFeedPosts(currentProfileId: string) {
  // Get IDs of profiles the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: currentProfileId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  if (followingIds.length === 0) return [];

  return prisma.authorPost.findMany({
    where: { profileId: { in: followingIds } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      profile: {
        select: {
          id: true,
          pen_name: true,
          full_name: true,
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
    },
  });
}

export async function getSuggestedAuthors(currentProfileId?: string) {
  return prisma.profile.findMany({
    where: {
      pen_name: { not: null },
      ...(currentProfileId
        ? {
            id: { not: currentProfileId },
            // Exclude already-followed authors
            followers: { none: { followerId: currentProfileId } },
          }
        : {}),
    },
    orderBy: { followers: { _count: "desc" } },
    take: 5,
    select: {
      id: true,
      pen_name: true,
      avatar_url: true,
      isVerified: true,
      _count: { select: { followers: true, stories: true } },
    },
  });
}
