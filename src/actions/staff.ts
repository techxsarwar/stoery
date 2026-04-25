"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function banStory(storyId: string) {
  try {
    await prisma.story.update({
      where: { id: storyId },
      data: { isBanned: true },
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
