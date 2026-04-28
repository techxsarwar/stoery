import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) redirect("/auth/signin");

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } }
  });

  if (!profile) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden">
      <Sidebar />
      <main className="flex-grow ml-0 md:ml-20 lg:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,#e5e7eb,transparent)] custom-scrollbar">
        <Navbar user={user ?? null} />
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32 flex flex-col gap-12">
            <header className="relative">
                <span className="absolute -left-4 top-0 w-1 h-full bg-primary"></span>
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Vault Settings</h1>
                <p className="font-label font-bold text-on-surface-variant text-sm uppercase tracking-[0.3em] mt-4 opacity-60">Manage your essential details</p>
            </header>
            
            <div className="mt-8">
                <SettingsForm profile={{ pen_name: profile.pen_name, full_name: profile.full_name, age: profile.age }} />
            </div>
        </div>
      </main>
    </div>
  );
}
