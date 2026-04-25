"use server";

import { prisma } from "@/lib/prisma";

/**
 * Records reading time for a story and its author.
 * Includes basic validation to prevent simple bot spoofing.
 */
export async function recordReadingTime(storyId: string, seconds: number) {
  // Bot Protection: Reject pulses that claim impossible amounts of time (e.g. > 65s in one heartbeat)
  if (seconds > 65 || seconds < 1) {
    return { success: false, error: "Invalid duration detected by system watchdogs." };
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true }
    });

    if (!story) return { success: false, error: "Story not found." };

    // Atomic transaction to ensure both story and author metrics stay in sync
    await prisma.$transaction([
      prisma.story.update({
        where: { id: storyId },
        data: { reading_time_seconds: { increment: BigInt(seconds) } }
      }),
      prisma.profile.update({
        where: { id: story.authorId },
        data: { reading_time_seconds: { increment: BigInt(seconds) } }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error("Celestial Error recording reading time:", error);
    return { success: false, error: "System failure in the Pillars of Time." };
  }
}
