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
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative cursor-default">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-7xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col gap-4 border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Dashboard</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">Manage your stories</p>
        </header>

        <section className="flex flex-col w-full">
            <DashboardClient stories={stories} />
        </section>
      </main>
    </div>
  );
}
