"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendNexusMessage(content: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not authenticated" };

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) return { success: false, error: "Profile not found" };

    const message = await prisma.nexusMessage.create({
      data: {
        content,
        profileId: profile.id
      },
      include: {
        profile: true
      }
    });

    revalidatePath("/community");
    return { success: true, message };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Failed to send message" };
  }
}
