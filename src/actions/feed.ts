"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, storyId?: string, imageUrl?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return { error: "Must be logged in" };

  const trimmed = content.trim();
  if (!trimmed && !imageUrl) return { error: "Post cannot be empty" };
  if (trimmed.length > 500) return { error: "Post must be 500 characters or less" };

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
  });

  if (!profile) return { error: "Profile not found. Complete onboarding first." };

  await prisma.authorPost.create({
    data: {
      content: trimmed,
      image_url: imageUrl || null,
      profileId: profile.id,
      storyId: storyId || null,
    },
  });

  revalidatePath("/feed");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function likePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return { error: "Must be logged in" };

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
  });
  if (!profile) return { error: "Profile not found" };

  const existing = await prisma.postLike.findUnique({
    where: { postId_profileId: { postId, profileId: profile.id } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    return { success: true, liked: false };
  } else {
    await prisma.postLike.create({ data: { postId, profileId: profile.id } });
    return { success: true, liked: true };
  }
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

export async function getAllFeedPosts(currentProfileId?: string) {
  "use cache";
  if (currentProfileId) {
    // Add a cache tag or just rely on the parameter for scoping
  }
  const include: any = {
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
  };
  if (currentProfileId) {
    include.likes = { where: { profileId: currentProfileId }, select: { id: true } };
  }

  const posts = await prisma.authorPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include,
  });

  return posts.map((p: any) => ({
    ...p,
    likeCount: p._count.likes,
    isLikedByMe: currentProfileId ? (p.likes?.length ?? 0) > 0 : false,
  }));
}

export async function getFollowingFeedPosts(currentProfileId: string) {
  "use cache";
  const following = await prisma.follow.findMany({
    where: { followerId: currentProfileId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);
  if (followingIds.length === 0) return [];

  const include: any = {
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
    likes: { where: { profileId: currentProfileId }, select: { id: true } },
  };

  const posts = await prisma.authorPost.findMany({
    where: { profileId: { in: followingIds } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include,
  });

  return posts.map((p: any) => ({
    ...p,
    likeCount: p._count.likes,
    isLikedByMe: (p.likes?.length ?? 0) > 0,
  }));
}

export async function getSuggestedAuthors(currentProfileId?: string) {
  "use cache";
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
