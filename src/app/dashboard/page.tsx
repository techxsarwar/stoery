import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardClient from "@/components/DashboardClient";
import Sidebar from "@/components/Sidebar";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/auth/signin");
  }

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } }
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const stories = await prisma.story.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });

  const comments = await prisma.comment.findMany({
    where: { story: { authorId: profile.id } },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
        profile: true,
        story: true
    }
  });

  const totalLikes = stories.reduce((sum, story) => sum + story._count.likes, 0);
  const totalComments = stories.reduce((sum, story) => sum + story._count.comments, 0);
  const totalReads = stories.reduce((sum, story) => sum + (story.reads || 0), 0);
  const totalReadingHours = Number(profile.reading_time_seconds || 0) / 3600;

  return (
    <div className="min-h-screen bg-surface flex cursor-default overflow-hidden">
      <Sidebar />
      
      <main className="flex-grow ml-20 md:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,#e5e7eb,transparent)] custom-scrollbar">
        <Navbar user={user ?? null} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32 flex flex-col gap-12">
            <DashboardClient 
                stories={stories} 
                profile={profile} 
                comments={comments}
                stats={{
                    totalLikes,
                    totalComments,
                    totalReads,
                    totalReadingHours,
                    monetizationStatus: profile.monetization_status
                }}
            />
        </div>
      </main>
    </div>
  );
}
