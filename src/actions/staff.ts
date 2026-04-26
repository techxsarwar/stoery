"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function banStory(storyId: string, reason: string) {
  try {
    const appealDeadline = new Date();
    appealDeadline.setDate(appealDeadline.getDate() + 180);

    await prisma.story.update({
      where: { id: storyId },
      data: { 
        isBanned: true,
        banReason: reason,
        banExpiresAt: appealDeadline,
        appealStatus: "NONE"
      },
    });
    revalidatePath("/staff");
    revalidatePath(`/read/${storyId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to ban story:", error);
    return { success: false, error: "Failed to ban story" };
  }
}

export async function unbanStory(storyId: string) {
  try {
    await prisma.story.update({
      where: { id: storyId },
      data: { isBanned: false },
    });
    revalidatePath("/staff");
    revalidatePath(`/read/${storyId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to unban story:", error);
    return { success: false, error: "Failed to unban story" };
  }
}

export async function updateMonetizationStatus(profileId: string, status: "APPROVED" | "REJECTED") {
  try {
    await prisma.profile.update({
      where: { id: profileId },
      data: { monetization_status: status },
    });
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to update monetization status:", error);
    return { success: false, error: "Failed to update monetization status" };
  }
}

export async function toggleVerification(profileId: string, status: boolean) {
  try {
    await prisma.profile.update({
      where: { id: profileId },
      data: { isVerified: status },
    });
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle verification:", error);
    return { success: false, error: "Failed to toggle verification" };
  }
}

export async function resolveReport(reportId: string, action: "RESOLVED" | "DISMISSED") {
  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { status: action },
    });
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to resolve report:", error);
    return { success: false, error: "Failed to resolve report" };
  }
}

export async function handleAppeal(storyId: string, action: "ACCEPTED" | "REJECTED") {
  try {
    if (action === "ACCEPTED") {
      await prisma.story.update({
        where: { id: storyId },
        data: { 
          isBanned: false,
          appealStatus: "ACCEPTED",
          banReason: null,
          banExpiresAt: null
        },
      });
    } else {
      await prisma.story.update({
        where: { id: storyId },
        data: { 
          appealStatus: "REJECTED",
          isPermanentBan: true
        },
      });
    }
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to handle appeal:", error);
    return { success: false, error: "Failed to process appeal" };
  }
}

export async function setPermanentBan(storyId: string) {
  try {
    await prisma.story.update({
      where: { id: storyId },
      data: { isPermanentBan: true },
    });
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to set permanent ban:", error);
    return { success: false, error: "Failed to set permanent ban" };
  }
}
