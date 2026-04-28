"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Unauthorized" };
  }

  const ageData = formData.get("age") as string;
  const age = parseInt(ageData);
  const pen_name = formData.get("penName") as string;
  const full_name = formData.get("fullName") as string;
  const parentage = formData.get("parentage") as string;
  const guardian_approved = formData.get("guardianApproved") === "on";
  const username = (formData.get("username") as string || "").trim().toLowerCase();

  if (!age || !pen_name || !full_name) {
    return { error: "Age, Pen Name, and Full Name are required" };
  }

  if (!username) {
    return { error: "Username is required" };
  }
  if (username.length > 14) {
    return { error: "Username must be 14 characters or less" };
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, and underscores" };
  }

  try {
    // Find or create the user in Prisma (bridge between Supabase UID and Prisma)
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.user_metadata?.full_name ?? null,
        image: user.user_metadata?.avatar_url ?? null,
      },
    });

    // Upsert the profile
    await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: {
        full_name,
        age,
        pen_name,
        username,
        parentage,
        guardian_approved,
      },
      create: {
        userId: dbUser.id,
        full_name,
        age,
        pen_name,
        username,
        parentage,
        guardian_approved,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.code === "P2002") {
      const target = e.meta?.target?.[0];
      if (target === "username") return { error: "This username is already taken." };
      return { error: "This Pen Name is already taken." };
    }
    console.error("Onboarding error:", e);
    return { error: "Failed to update profile" };
  }
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  return prisma.profile.findFirst({
    where: {
      user: {
        email: user.email,
      },
    },
  });
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}

export async function getUserRole() {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  
  // Try to get email from Supabase or potentially NextAuth (if we had access to it here)
  const email = supabaseUser?.email;

  if (!email) return "AUTHOR";

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { role: true }
  });

  return dbUser?.role || "AUTHOR";
}
