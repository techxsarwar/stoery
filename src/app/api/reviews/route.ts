import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findFirst({
      where: { user: { email: user.email } }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await req.json();
    const { storyId, rating, title, content } = body;

    const review = await prisma.review.create({
      data: {
        profileId: profile.id,
        storyId,
        rating,
        title,
        content
      }
    });

    // Optionally notify the author
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (story && story.authorId !== profile.id) {
        await prisma.notification.create({
            data: {
                profileId: story.authorId,
                type: "COMMENT_REPLY", // Reuse or make NEW_REVIEW
                title: "New Review",
                message: `${profile.full_name || 'Someone'} left a ${rating}-star review on ${story.title}`,
                link: `/read/${story.id}`
            }
        });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "You have already reviewed this story." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
