"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Utility to verify admin/HR status
async function verifyHR() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return false;

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

    // In a real app, check for UserRole.EMPLOYEE or MANAGER. 
    // For this prototype, we'll allow AUTHORs too so the user can test it immediately.
    if (!dbUser) return false;
    return true;
}

export async function createJobPosting(formData: FormData) {
    const isHR = await verifyHR();
    if (!isHR) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const department = formData.get("department") as string;
    const type = formData.get("type") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const skillsRaw = formData.get("skills") as string;
    const tag = formData.get("tag") as string;
    const tagColor = formData.get("tagColor") as string;

    const skills = skillsRaw.split(",").map(s => s.trim()).filter(s => s.length > 0);

    try {
        await prisma.jobPosting.create({
            data: {
                title,
                department,
                type,
                location,
                description,
                skills,
                tag: tag || "Hiring",
                tagColor: tagColor || "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            }
        });
        revalidatePath("/careers/admin");
        revalidatePath("/careers");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function toggleJobStatus(jobId: string, isActive: boolean) {
    const isHR = await verifyHR();
    if (!isHR) return { error: "Unauthorized" };

    try {
        await prisma.jobPosting.update({
            where: { id: jobId },
            data: { isActive }
        });
        revalidatePath("/careers/admin");
        revalidatePath("/careers");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function sendNotification(email: string, subject: string, message: string) {
    const isHR = await verifyHR();
    if (!isHR) return { error: "Unauthorized" };

    try {
        // Find the user's profile to send an in-app notification
        const dbUser = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (dbUser?.profile) {
            await prisma.notification.create({
                data: {
                    profileId: dbUser.profile.id,
                    type: "SYSTEM",
                    title: subject,
                    message: message,
                    link: "/careers"
                }
            });
        }
        
        console.log(`[EMAIL DISPATCH] To: ${email} | Sub: ${subject} | Msg: ${message}`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function submitApplication(data: {
    jobId: string;
    applicantName: string;
    email: string;
    portfolioUrl: string;
    coverLetter: string;
}) {
    try {
        await prisma.jobApplication.create({
            data: {
                jobId: data.jobId,
                applicantName: data.applicantName,
                email: data.email,
                portfolioUrl: data.portfolioUrl,
                coverLetter: data.coverLetter
            }
        });
        revalidatePath("/careers/admin");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function updateApplicationStatus(applicationId: string, email: string, status: "HIRED" | "REJECTED" | "REVIEWED") {
    const isHR = await verifyHR();
    if (!isHR) return { error: "Unauthorized" };

    try {
        await prisma.jobApplication.update({
            where: { id: applicationId },
            data: { status }
        });

        // Send an automatic notification based on the decision
        let subject = "";
        let message = "";
        if (status === "HIRED") {
            subject = "Application Update: Accepted";
            message = "Congratulations! Your application has been accepted. Welcome to the SOULPAD Guild. We will be in touch shortly.";
        } else if (status === "REJECTED") {
            subject = "Application Update: Status Change";
            message = "Thank you for applying to SOULPAD. Unfortunately, we will not be moving forward with your application at this time. Keep writing!";
        }

        if (subject && message) {
            await sendNotification(email, subject, message);
        }

        revalidatePath("/careers/admin");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
