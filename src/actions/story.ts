"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createStory(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
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
      authorId: user.id,
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
