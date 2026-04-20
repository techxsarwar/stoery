"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createStory(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const genre = formData.get("genre") as string;
  const cover_url = formData.get("coverImage") as string; // Will be R2 URL
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  try {
    const profile = await prisma.profile.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      }
    });

    if (!profile) {
      return { error: "Profile not found. Please complete onboarding." };
    }

    const story = await prisma.story.create({
      data: {
        title,
        genre,
        cover_url,
        authorId: profile.id,
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
  } catch (error) {
    console.error("Create story error:", error);
    return { error: "Failed to create story" };
  }
}
