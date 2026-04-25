"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function applyForMonetization(formData: {
  legalName: string;
  panNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankAccountHolder: string;
  phoneNumber: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
    include: {
      stories: {
        include: {
          _count: {
            select: { comments: true }
          }
        }
      }
    }
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  // Calculate criteria
  const totalReads = profile.stories.reduce((sum, story) => sum + (story.reads || 0), 0);
  const totalComments = profile.stories.reduce((sum, story) => sum + (story._count?.comments || 0), 0);
  const totalHours = Number(profile.reading_time_seconds) / 3600;

  // Criteria: 4000 reads, 4000 hours, 9000 comments
  const meetsCriteria = totalReads >= 4000 && totalHours >= 4000 && totalComments >= 9000;

  if (!meetsCriteria) {
    throw new Error("You do not meet the criteria for monetization yet.");
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      legal_name: formData.legalName,
      pan_number: formData.panNumber,
      bank_account_number: formData.bankAccountNumber,
      ifsc_code: formData.ifscCode,
      bank_account_holder: formData.bankAccountHolder,
      phone_number: formData.phoneNumber,
      monetization_status: "APPLIED",
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
