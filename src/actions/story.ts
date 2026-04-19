"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createStory(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const genre = formData.get("genre") as string;
  const coverImage = formData.get("coverImage") as string; // URL for MVP
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const story = await prisma.story.create({
    data: {
      title,
      description,
      genre,
      coverImage,
      authorId: session.user.id,
      chapters: {
        create: {
          title: "Chapter 1",
          content,
          order: 1,
        },
      },
    },
  });

  revalidatePath("/");
  return { success: true, storyId: story.id };
}
