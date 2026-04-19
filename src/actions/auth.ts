"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Email, password and name are required" };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 1. Sign up in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // 2. Create entry in our public.User table via Prisma
    // This allows us to keep using Prisma relations for Stories, Likes, etc.
    try {
      await prisma.user.upsert({
        where: { email },
        update: { name },
        create: {
          id: data.user.id, // Use the Supabase UID as our ID
          name,
          email,
          // @ts-ignore - Bypass strict password check for Google OAuth
          password: "", 
        },
      });
    } catch (e) {
      console.error("Prisma sync error:", e);
      // Even if prisma fails, the auth user exists in Supabase
    }
  }

  return { success: true };
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!email) {
    return { error: "Email is required" };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
