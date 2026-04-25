import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import StaffDashboardClient from "@/components/StaffDashboardClient";

export default async function StaffDashboard() {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  const nextAuthSession = await getServerSession(authOptions);

  const userEmail = supabaseUser?.email || nextAuthSession?.user?.email;

  if (!userEmail) {
    redirect("/staff/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { role: true, name: true }
  });

  if (!dbUser || (dbUser.role !== "EMPLOYEE" && dbUser.role !== "ADMIN")) {
    redirect("/staff/login");
  }

  // Fetch Global Stats
  const [userCount, storyCount, commentCount, pendingApps, allProfiles, allStories, bannedComments, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.story.count(),
    prisma.comment.count(),
    prisma.profile.findMany({
      where: { monetization_status: "APPLIED" },
      include: { user: { select: { email: true, image: true } } },
      orderBy: { id: "desc" }
    }),
    prisma.profile.findMany({
      take: 50,
      orderBy: { id: "desc" },
      include: { 
        _count: { select: { stories: true } },
        user: { select: { email: true, image: true, name: true } },
        stories: {
          select: {
            _count: { select: { likes: true } }
          }
        }
      }
    }),
    prisma.story.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { author: true }
    }),
    prisma.comment.findMany({
      where: { isShadowBanned: true },
      take: 50,
      include: { profile: true, story: true }
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { id: "desc" },
      select: { name: true, email: true, image: true, id: true }
    })
  ]);

  return (
    <StaffDashboardClient 
      user={dbUser}
      stats={{
        userCount,
        storyCount,
        commentCount,
        pendingApps
      }}
      allProfiles={allProfiles}
      allStories={allStories}
      bannedComments={bannedComments}
      recentUsers={recentUsers}
    />
  );
}
