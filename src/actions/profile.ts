"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileSettings(data: {
  pen_name: string;
  full_name: string;
  age: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Unauthorized" };
  }

  if (!data.age || !data.pen_name || !data.full_name) {
    return { error: "Age, Pen Name, and Full Name are required" };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
        return { error: "User not found in system." };
    }

    await prisma.profile.update({
      where: { userId: dbUser.id },
      data: {
        full_name: data.full_name,
        age: data.age,
        pen_name: data.pen_name,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e: any) {
    if (e.code === "P2002") {
      return { error: "This Pen Name is already taken." };
    }
    console.error("Profile update error:", e);
    return { error: "Failed to update profile" };
  }
}
