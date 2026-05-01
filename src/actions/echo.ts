"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function submitEcho(storyId: string, chapterId: string, quote: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "You must be logged in to leave an echo." };

    const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
    });

    if (!profile) return { error: "Profile not found." };

    try {
        const echo = await prisma.echo.create({
            data: {
                profileId: profile.id,
                storyId,
                chapterId,
                quote,
                content
            },
            include: {
                profile: true
            }
        });
        return { success: true, echo };
    } catch (e: any) {
        return { error: e.message };
    }
}
