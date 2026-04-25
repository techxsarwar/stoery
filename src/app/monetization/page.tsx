import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import PillarsOfProsperity from "@/components/PillarsOfProsperity";
import Sidebar from "@/components/Sidebar";

export default async function MonetizationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/auth/signin");
  }

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
    include: {
      stories: {
        include: {
          _count: {
            select: { likes: true, comments: true }
          }
        }
      }
    }
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const totalComments = profile.stories.reduce((sum, story) => sum + story._count.comments, 0);
  const totalReads = profile.stories.reduce((sum, story) => sum + (story.reads || 0), 0);
  const totalReadingHours = Number(profile.reading_time_seconds || 0) / 3600;

  return (
    <div className="min-h-screen bg-surface flex cursor-default overflow-hidden">
      <Sidebar />
      
      <main className="flex-grow ml-20 md:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_bottom_left,#eab30810,transparent)] custom-scrollbar">
        <Navbar user={user ?? null} />

        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-32 flex flex-col gap-12">
            <header className="flex flex-col gap-4">
                <div className="inline-block bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-label font-bold text-[10px] uppercase tracking-widest w-fit">
                    Creator Program
                </div>
                <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface tracking-tighter uppercase leading-none">
                    Monetization <span className="text-primary">Hub</span>
                </h1>
                <p className="font-body text-on-surface-variant italic text-lg opacity-60">
                    "From the ink of your soul, may gold flow like starlight."
                </p>
            </header>

            <PillarsOfProsperity 
                reads={totalReads} 
                hours={totalReadingHours} 
                comments={totalComments}
                status={profile.monetization_status}
            />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-surface-container-high border-2 border-on-surface/5 rounded-3xl">
                    <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-4">How it works</h3>
                    <ul className="flex flex-col gap-4 font-body text-sm text-on-surface-variant">
                        <li className="flex gap-3">
                            <span className="text-primary font-bold">01.</span>
                            Meet the cosmic criteria known as The Three Pillars.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary font-bold">02.</span>
                            Submit your earthly credentials for registry.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary font-bold">03.</span>
                            Our keepers will verify your soul's resonance.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary font-bold">04.</span>
                            Begin earning from every read across the multiverse.
                        </li>
                    </ul>
                </div>

                <div className="p-8 bg-primary/5 border-2 border-primary/20 rounded-3xl flex flex-col justify-center">
                    <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-2">Taxes & Payouts</h3>
                    <p className="font-body text-sm text-on-surface-variant italic leading-relaxed">
                        We handle all TDS (Tax Deducted at Source) compliance as per local laws. Payouts are dispatched on the 15th of every moon cycle (month) once you hit the minimum threshold.
                    </p>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
}
