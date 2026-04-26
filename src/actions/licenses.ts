"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function applyForLicense(formData: { storyId: string; legalName: string; licenseType: string; details: string }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const profile = await prisma.profile.findFirst({
        where: { user: { email: user.email } }
    });

    if (!profile) return { success: false, error: "Profile not found" };

    // Check if story belongs to author
    const story = await prisma.story.findUnique({
        where: { id: formData.storyId }
    });

    if (!story || story.authorId !== profile.id) {
        return { success: false, error: "Story not found or unauthorized" };
    }

    // Check if license already exists
    const existingLicense = await prisma.license.findUnique({
        where: { storyId: formData.storyId }
    });

    if (existingLicense) {
        return { success: false, error: "A license application already exists for this story" };
    }

    await prisma.license.create({
      data: {
        storyId: formData.storyId,
        applicantId: profile.id,
        legalName: formData.legalName,
        licenseType: formData.licenseType,
        details: formData.details,
        status: "PENDING"
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to apply for license:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function reviewLicense(licenseId: string, status: "APPROVED" | "REJECTED") {
  try {
    const licenseNumber = status === "APPROVED" ? `SV-${Math.random().toString(36).substring(2, 10).toUpperCase()}` : null;
    const issuedAt = status === "APPROVED" ? new Date() : null;

    await prisma.license.update({
      where: { id: licenseId },
      data: { 
        status: status,
        licenseNumber: licenseNumber,
        issuedAt: issuedAt
      },
    });

    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to review license:", error);
    return { success: false, error: "Failed to process application" };
  }
}

export async function verifyLicense(licenseNumber: string) {
  try {
    const license = await prisma.license.findUnique({
      where: { licenseNumber: licenseNumber },
      include: {
        story: {
          select: {
            title: true,
            description: true,
            genre: true,
            author: {
              select: {
                pen_name: true
              }
            }
          }
        },
        applicant: {
          select: {
            pen_name: true,
            full_name: true
          }
        }
      }
    });

    if (!license) {
      return { success: false, error: "License not found" };
    }

    if (license.status !== "APPROVED") {
      return { success: false, error: "This license is not yet active" };
    }

    return { success: true, license };
  } catch (error) {
    console.error("Failed to verify license:", error);
    return { success: false, error: "An error occurred during verification" };
  }
}
