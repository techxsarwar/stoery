"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getAuthorProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  return prisma.profile.findFirst({
    where: { user: { email: user.email } }
  });
}

export async function getCodexEntries() {
  const profile = await getAuthorProfile();
  if (!profile) return { error: "Unauthorized" };

  try {
    const entries = await prisma.codexEntry.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, entries };
  } catch (e) {
    console.error("Error fetching codex entries:", e);
    return { error: "Failed to fetch codex entries" };
  }
}

export async function createCodexEntry(formData: FormData) {
  const profile = await getAuthorProfile();
  if (!profile) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const image_url = formData.get("image_url") as string;

  if (!title || !category || !content) {
    return { error: "Title, Category, and Content are required." };
  }

  try {
    const entry = await prisma.codexEntry.create({
      data: {
        profileId: profile.id,
        title,
        category,
        content,
        image_url: image_url || null,
        isPrivate: true, // Native private desk feature for now
      }
    });

    revalidatePath("/dashboard/codex");
    return { success: true, entry };
  } catch (e) {
    console.error("Error creating codex entry:", e);
    return { error: "Failed to forge codex entry." };
  }
}

export async function deleteCodexEntry(id: string) {
  const profile = await getAuthorProfile();
  if (!profile) return { error: "Unauthorized" };

  try {
    await prisma.codexEntry.delete({
      where: {
        id: id,
        profileId: profile.id // ensure they own it
      }
    });

    revalidatePath("/dashboard/codex");
    return { success: true };
  } catch (e) {
    console.error("Error deleting codex entry:", e);
    return { error: "Failed to obliterate codex entry." };
  }
}
