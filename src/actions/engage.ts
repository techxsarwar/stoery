"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleLike(storyId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Must be logged in to like" };
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_storyId: {
        userId: session.user.id,
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
        userId: session.user.id,
        storyId: storyId,
      },
    });
  }

  revalidatePath(`/read/${storyId}`);
  return { success: true };
}

export async function addComment(storyId: string, content: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Must be logged in to comment" };
  }

  if (!content.trim()) {
    return { error: "Comment cannot be empty" };
  }

  await prisma.comment.create({
    data: {
      content: content.trim(),
      userId: session.user.id,
      storyId: storyId,
    },
  });

  revalidatePath(`/read/${storyId}`);
  return { success: true };
}
