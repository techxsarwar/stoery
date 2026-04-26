"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function respondToReport(reportId: string, response: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const profile = await prisma.profile.findFirst({
        where: { user: { email: user.email } }
    });

    if (!profile) return { success: false, error: "Profile not found" };

    const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: { story: true }
    });

    if (!report || report.story.authorId !== profile.id) {
        return { success: false, error: "Report not found or not authorized" };
    }

    await prisma.report.update({
      where: { id: reportId },
      data: { authorResponse: response },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to respond to report:", error);
    return { success: false, error: "Failed to submit response" };
  }
}

export async function submitAppeal(storyId: string, appealText: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const profile = await prisma.profile.findFirst({
        where: { user: { email: user.email } }
    });

    if (!profile) return { success: false, error: "Profile not found" };

    const story = await prisma.story.findUnique({
        where: { id: storyId }
    });

    if (!story || story.authorId !== profile.id) {
        return { success: false, error: "Story not found or not authorized" };
    }

    if (!story.isBanned) {
        return { success: false, error: "Story is not banned" };
    }

    if (story.isPermanentBan) {
        return { success: false, error: "This ban is permanent and cannot be appealed" };
    }

    // Check if appeal deadline has passed
    if (story.banExpiresAt && new Date() > story.banExpiresAt) {
        return { success: false, error: "The appeal window for this chronicle has closed" };
    }

    await prisma.story.update({
      where: { id: storyId },
      data: { 
        appealText: appealText,
        appealStatus: "SUBMITTED"
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit appeal:", error);
    return { success: false, error: "Failed to submit appeal" };
  }
}
