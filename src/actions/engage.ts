"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleLike(storyId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Must be logged in to like" };
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_storyId: {
        userId: user.id,
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
        userId: user.id,
        storyId: storyId,
      },
    });
  }

  revalidatePath(`/read/${storyId}`);
  return { success: true };
}

export async function addComment(storyId: string, content: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Must be logged in to comment" };
  }

  if (!content.trim()) {
    return { error: "Comment cannot be empty" };
  }

  await prisma.comment.create({
    data: {
      content: content.trim(),
      userId: user.id,
      storyId: storyId,
    },
  });

  revalidatePath(`/read/${storyId}`);
  return { success: true };
}
