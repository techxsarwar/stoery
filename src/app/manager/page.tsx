export const unstable_instant = { prefetch: "static" };
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ManagerDashboardClient from "@/components/ManagerDashboardClient";

export default async function ManagerPage() {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  const nextAuthSession = await getServerSession(authOptions);
  
  const userEmail = supabaseUser?.email || nextAuthSession?.user?.email;

  if (!userEmail) {
    redirect("/manager/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { role: true, name: true }
  });

  if (!user || user.role !== "MANAGER") {
    redirect("/manager/login");
  }

  // Fetch all staff members
  const staffMembers = await prisma.user.findMany({
    where: {
      role: { in: ["EMPLOYEE", "ADMIN"] }
    },
    include: {
      profile: true
    }
  });

  // Fetch platform stats for the manager
  const stats = {
    totalUsers: await prisma.user.count(),
    totalStories: await prisma.story.count(),
    totalReports: await prisma.report.count(),
    pendingReports: await prisma.report.count({ where: { status: "PENDING" } }),
    totalBans: await prisma.story.count({ where: { isBanned: true } }),
    staffCount: staffMembers.length,
    employeeCount: await prisma.user.count({ where: { role: "EMPLOYEE" } }),
    adminCount: await prisma.user.count({ where: { role: "ADMIN" } }),
    totalComments: await prisma.comment.count(),
    totalLikes: await prisma.like.count(),
    verifiedProfiles: await prisma.profile.count({ where: { isVerified: true } }),
    monetizedProfiles: await prisma.profile.count({ where: { monetization_status: "APPROVED" } }),
    issuedLicenses: await prisma.license.count({ where: { status: "APPROVED" } }),
  };

  const allStories = await prisma.story.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });

  return (
    <ManagerDashboardClient 
      manager={user}
      staff={staffMembers}
      stats={stats}
      allStories={allStories}
    />
  );
}

