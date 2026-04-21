import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardClient from "@/components/DashboardClient";

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

  const totalLikes = stories.reduce((sum, story) => sum + story._count.likes, 0);
  const totalComments = stories.reduce((sum, story) => sum + story._count.comments, 0);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative cursor-default">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-7xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-8 border-primary pb-8">
            <div>
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Dashboard</h1>
                <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">Welcome back, <span className="text-primary">{profile.full_name || profile.pen_name || "Author"}</span></p>
            </div>
            <div className="flex gap-4">
                <div className="bg-surface border-4 border-on-surface p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center min-w-[100px]">
                    <span className="block font-headline font-black text-3xl">{stories.length}</span>
                    <span className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant">Stories</span>
                </div>
                <div className="bg-surface border-4 border-on-surface p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center min-w-[100px]">
                    <span className="block font-headline font-black text-3xl">{totalLikes}</span>
                    <span className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant">Likes</span>
                </div>
                <div className="bg-surface border-4 border-on-surface p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center min-w-[100px]">
                    <span className="block font-headline font-black text-3xl">{totalComments}</span>
                    <span className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant">Comments</span>
                </div>
            </div>
        </header>

        <section className="flex flex-col w-full">
            <DashboardClient stories={stories} />
        </section>
      </main>
    </div>
  );
}
