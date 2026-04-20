"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const ageData = formData.get("age") as string;
  const age = parseInt(ageData);
  const pen_name = formData.get("penName") as string;
  const full_name = formData.get("fullName") as string;
  const parentage = formData.get("parentage") as string;
  const guardian_approved = formData.get("guardianApproved") === "on";

  if (!age || !pen_name || !full_name) {
    return { error: "Age, Pen Name, and Full Name are required" };
  }

  try {
    // 1. Find the user by email (next-auth email)
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return { error: "User not found in database" };
    }

    // 2. Upsert the profile
    await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: {
        full_name,
        age,
        pen_name,
        parentage,
        guardian_approved,
      },
      create: {
        userId: dbUser.id,
        full_name,
        age,
        pen_name,
        parentage,
        guardian_approved,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.code === 'P2002') {
      return { error: "This Pen Name is already taken." };
    }
    console.error("Onboarding error:", e);
    return { error: "Failed to update profile" };
  }
}

export async function getProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return prisma.profile.findFirst({
    where: {
      user: {
        email: session.user.email
      }
    }
  });
}
