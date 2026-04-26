"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function createReport(storyId: string, reason: string, details: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to report a story." };
    }

    const profile = await prisma.profile.findFirst({
      where: { user: { email: user.email } }
    });

    if (!profile) {
      return { success: false, error: "Profile not found." };
    }

    await prisma.report.create({
      data: {
        storyId,
        reason,
        details,
        reporterId: profile.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create report:", error);
    return { success: false, error: "Failed to submit report. Please try again." };
  }
}
