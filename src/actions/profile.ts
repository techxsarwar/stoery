"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileSettings(data: {
  pen_name: string;
  full_name: string;
  age: number;
  username: string;
  bio?: string;
  avatar_url?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Unauthorized" };
  }

  if (!data.age || !data.pen_name || !data.full_name) {
    return { error: "Age, Pen Name, and Full Name are required" };
  }

  const username = (data.username || "").trim().toLowerCase();
  if (!username) return { error: "Username is required" };
  if (username.length > 14) return { error: "Username must be 14 characters or less" };
  if (!/^[a-z0-9_]+$/.test(username)) return { error: "Username can only contain letters, numbers, and underscores" };

  // Bio character limit
  if (data.bio && data.bio.length > 300) {
    return { error: "Bio must be 300 characters or less." };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
        return { error: "User not found in system." };
    }

    await prisma.profile.update({
      where: { userId: dbUser.id },
      data: {
        full_name: data.full_name,
        age: data.age,
        pen_name: data.pen_name,
        username,
        bio: data.bio ?? undefined,
        avatar_url: data.avatar_url ?? undefined,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath(`/author/${data.pen_name}`);
    return { success: true };
  } catch (e: any) {
    if (e.code === "P2002") {
      const target = e.meta?.target?.[0];
      if (target === "username") return { error: "This username is already taken." };
      return { error: "This Pen Name is already taken." };
    }
    console.error("Profile update error:", e);
    return { error: "Failed to update profile" };
  }
}

export async function toggleFollow(targetProfileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Must be logged in to follow" };
  }

  const currentProfile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
  });

  if (!currentProfile) {
    return { error: "Profile not found" };
  }

  if (currentProfile.id === targetProfileId) {
    return { error: "You cannot follow yourself" };
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentProfile.id,
        followingId: targetProfileId,
      },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId: currentProfile.id,
        followingId: targetProfileId,
      },
    });
  }

  // Revalidate the target profile page
  const targetProfile = await prisma.profile.findUnique({
    where: { id: targetProfileId },
    select: { pen_name: true },
  });

  if (targetProfile?.pen_name) {
    revalidatePath(`/author/${targetProfile.pen_name}`);
  }

  return { success: true };
}

export async function getPublicProfile(penName: string) {
  const profile = await prisma.profile.findUnique({
    where: { pen_name: penName },
    include: {
      stories: {
        where: { status: "PUBLISHED", isBanned: false },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { likes: true, comments: true } },
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!profile) return null;

  const totalLikes = profile.stories.reduce(
    (acc, story) => acc + story._count.likes,
    0
  );

  return {
    id: profile.id,
    pen_name: profile.pen_name,
    full_name: profile.full_name,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    isVerified: profile.isVerified,
    stories: profile.stories,
    totalLikes,
    followerCount: profile._count.followers,
    followingCount: profile._count.following,
  };
}

export async function isFollowing(targetProfileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return false;

  const currentProfile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
  });

  if (!currentProfile) return false;

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentProfile.id,
        followingId: targetProfileId,
      },
    },
  });

  return !!follow;
}
