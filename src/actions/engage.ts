"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(storyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Must be logged in to like" };
  }

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } }
  });

  if (!profile) {
    return { error: "Profile not found" };
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      profileId_storyId: {
        profileId: profile.id,
        storyId: storyId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.like.create({
      data: {
        profileId: profile.id,
        storyId: storyId,
      },
    });
  }

  revalidatePath(`/read/${storyId}`);
  return { success: true };
}

export async function addComment(storyId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Must be logged in to comment" };
  }

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } }
  });

  if (!profile) {
    return { error: "Profile not found" };
  }

  if (!content.trim()) {
    return { error: "Comment cannot be empty" };
  }

  await prisma.comment.create({
    data: {
      content: content.trim(),
      profileId: profile.id,
      storyId: storyId,
    },
  });

  revalidatePath(`/read/${storyId}`);
  return { success: true };
}
