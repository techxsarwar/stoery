import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: storyId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await request.json();

  try {
    const profile = await prisma.profile.findFirst({
      where: { user: { email: user.email } }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story || story.authorId !== profile.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: { status }
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: storyId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findFirst({
      where: { user: { email: user.email } }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story || story.authorId !== profile.id) {
      return NextResponse.json({ error: "Unauthorized! This isn't your tale to end." }, { status: 403 });
    }

    await prisma.story.delete({
      where: { id: storyId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
