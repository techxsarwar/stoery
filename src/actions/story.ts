"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/** Shared helper — resolves the logged-in user's profile id in ONE query */
async function getProfileId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
    select: { id: true },
  });
  return profile?.id ?? null;
}

export async function createStory(formData: FormData) {
  const profileId = await getProfileId();
  if (!profileId) return { error: "Unauthorized" };

  const title     = formData.get("title") as string;
  const description = formData.get("description") as string;
  const genre     = formData.get("genre") as string;
  const cover_url = formData.get("coverImage") as string;
  const content   = formData.get("content") as string;
  const storyId   = formData.get("storyId") as string;

  if (!title || !content) return { error: "Title and content are required" };

  try {
    if (storyId) {
      // Verify ownership in the same update query — no separate findUnique needed
      const story = await prisma.story.updateMany({
        where: { id: storyId, authorId: profileId },
        data: { title, description, genre, cover_url },
      });
      if (story.count === 0) return { error: "Story not found or unauthorized." };

      // Update chapter separately (updateMany on nested relation not supported)
      await prisma.chapter.updateMany({
        where: { storyId, order: 1 },
        data: { content },
      });

      revalidatePath("/dashboard");
      revalidatePath("/");
      return { success: true, storyId };
    } else {
      const story = await prisma.story.create({
        data: {
          title,
          description,
          genre,
          cover_url,
          authorId: profileId,
          chapters: {
            create: { title: "Chapter 1", content, order: 1 },
          },
        },
      });
      revalidatePath("/");
      revalidatePath("/dashboard");
      return { success: true, storyId: story.id };
    }
  } catch (error) {
    console.error("Story action error:", error);
    return { error: "Failed to process the chronicle." };
  }
}

export async function deleteStory(storyId: string) {
  const profileId = await getProfileId();
  if (!profileId) return { error: "Unauthorized" };

  try {
    // Single query: delete only if the author owns the story
    const result = await prisma.story.deleteMany({
      where: { id: storyId, authorId: profileId },
    });

    if (result.count === 0) return { error: "Story not found or unauthorized." };

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/discover");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to delete story." };
  }
}

export async function updateStoryStatus(storyId: string, status: "PUBLISHED" | "PAUSED" | "DRAFT") {
  const profileId = await getProfileId();
  if (!profileId) return { error: "Unauthorized" };

  try {
    // Fetch story to check ownership + originality — single query
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true, originalityScore: true },
    });

    if (!story || story.authorId !== profileId) {
      return { error: "Story not found or unauthorized." };
    }

    // Enforce originality score for publishing
    if (status === "PUBLISHED" && story.originalityScore !== null && story.originalityScore < 60) {
      return {
        error: `Originality Score too low (${story.originalityScore}/100). You need at least 60/100 to publish.`,
      };
    }

    await prisma.story.update({
      where: { id: storyId },
      data: { status },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/discover");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update status." };
  }
}

export async function getStory(storyId: string) {
  const profileId = await getProfileId();
  if (!profileId) return { error: "Unauthorized" };

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      chapters: { orderBy: { order: "asc" }, take: 1 },
    },
  });

  if (!story || story.authorId !== profileId) {
    return { error: "Chronicle not found or unauthorized access." };
  }

  return { success: true, story };
}
