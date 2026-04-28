import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardClient from "@/components/DashboardClient";
import Sidebar from "@/components/Sidebar";
import CreatePostBox from "@/components/CreatePostBox";

export const dynamic = "force-dynamic";

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

  const authorReports = await prisma.report.findMany({
    where: { story: { authorId: profile.id } },
    include: { story: true, reporter: true },
    orderBy: { createdAt: "desc" }
  });

  const authorLicenses = await prisma.license.findMany({
    where: { applicantId: profile.id },
    include: { story: true },
    orderBy: { createdAt: "desc" }
  });

  // Wrap recentPosts in try/catch — PostLike/username schema may not exist yet in production
  let recentPosts: any[] = [];
  try {
    recentPosts = await prisma.authorPost.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { story: { select: { id: true, title: true } } },
    });
  } catch (e) {
    console.error("recentPosts fetch failed:", e);
  }

  // Sanitize profile — convert BigInt to Number so RSC serialization doesn't crash
  const safeProfile = {
    ...profile,
    reading_time_seconds: Number(profile.reading_time_seconds ?? 0),
  };

  return (
    <div className="min-h-screen bg-surface flex cursor-default overflow-hidden">
      <Sidebar />
      
      <main className="flex-grow ml-0 md:ml-20 lg:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,#e5e7eb,transparent)] custom-scrollbar">
        <Navbar user={user ?? null} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32 flex flex-col gap-12">
            {/* Post Composer */}
            <section>
              <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tighter text-on-surface mb-4">
                Your Feed
              </h2>
              <CreatePostBox
                stories={stories
                  .filter((s) => s.status === "PUBLISHED")
                  .map((s) => ({ id: s.id, title: s.title }))}
                recentPosts={recentPosts}
              />
            </section>

            <DashboardClient 
                stories={stories} 
                profile={safeProfile} 
                comments={comments}
                reports={authorReports}
                licenses={authorLicenses}
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
