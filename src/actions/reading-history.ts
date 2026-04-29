"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function saveReadingProgress(storyId: string, chapterId: string, progress: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return { success: false, error: "Not logged in" };

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } }
  });

  if (!profile) return { success: false, error: "Profile not found" };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update reading history
    await prisma.readingHistory.upsert({
      where: {
        profileId_storyId: {
          profileId: profile.id,
          storyId: storyId
        }
      },
      update: {
        chapterId,
        scrollProgress: progress,
        lastReadAt: new Date()
      },
      create: {
        profileId: profile.id,
        storyId: storyId,
        chapterId,
        scrollProgress: progress,
        lastReadAt: new Date()
      }
    });

    // Handle Streaks
    const lastRead = profile.last_reading_date ? new Date(profile.last_reading_date) : null;
    if (lastRead) lastRead.setHours(0, 0, 0, 0);

    let newStreak = profile.reading_streak;
    let longestStreak = profile.longest_streak;

    if (!lastRead || lastRead.getTime() < today.getTime() - 86400000) {
      // Streak broken
      newStreak = 1;
    } else if (lastRead.getTime() === today.getTime() - 86400000) {
      // Next day, streak continues
      newStreak += 1;
      if (newStreak > longestStreak) {
        longestStreak = newStreak;
      }
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        reading_streak: newStreak,
        longest_streak: longestStreak,
        last_reading_date: new Date()
      }
    });

    // Check Badges
    const existingBadges = await prisma.badge.findMany({
      where: { profileId: profile.id }
    });

    const badgeTypes = existingBadges.map(b => b.badgeType);

    if (newStreak >= 7 && !badgeTypes.includes("7_DAY_SCHOLAR")) {
      await prisma.badge.create({
        data: { profileId: profile.id, badgeType: "7_DAY_SCHOLAR" }
      });
      // Trigger notification
      await prisma.notification.create({
        data: {
            profileId: profile.id,
            type: "BADGE_EARNED",
            title: "Badge Unlocked",
            message: "You've earned the 7-Day Scholar badge!",
            link: "/profile"
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Save progress error:", error);
    return { success: false, error: error.message };
  }
}
