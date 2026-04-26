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

  // Fetch Global Stats sequentially to prevent connection exhaustion
  const userCount = await prisma.user.count();
  const storyCount = await prisma.story.count();
  const commentCount = await prisma.comment.count();

  const pendingApps = await prisma.profile.findMany({
    where: { monetization_status: "APPLIED" },
    include: { user: { select: { email: true, image: true, name: true } } }
  });

  const allProfiles = await prisma.profile.findMany({
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
  });

  const allStories = await prisma.story.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });

  const bannedComments = await prisma.comment.findMany({
    where: { isShadowBanned: true },
    include: { profile: true, story: true }
  });

  const recentUsers = await prisma.user.findMany({
    take: 20,
    orderBy: { id: "desc" },
    select: { id: true, name: true, email: true, image: true }
  });

  const allReports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      story: {
        include: { author: true }
      },
      reporter: true
    }
  });

  const pendingAppeals = await prisma.story.findMany({
    where: { 
        isBanned: true,
        appealStatus: "SUBMITTED"
    },
    include: { author: true }
  });

  const allLicenses = await prisma.license.findMany({
    orderBy: { createdAt: "desc" },
    include: {
        story: true,
        applicant: true
    }
  });

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
      allReports={allReports}
      pendingAppeals={pendingAppeals}
      allLicenses={allLicenses}
    />
  );
}
