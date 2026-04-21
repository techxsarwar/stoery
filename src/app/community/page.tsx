import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const recentComments = await prisma.comment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      story: true,
    },
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-7xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col gap-4 border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Community</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">Join the Conversation</p>
        </header>

        <section className="flex flex-col md:flex-row gap-12 w-full">
            <div className="w-full md:w-2/3 flex flex-col gap-8">
                <h2 className="font-headline text-3xl font-black text-on-surface uppercase border-b-4 border-on-surface pb-2 w-max">Recent Thoughts</h2>
                {recentComments.length === 0 ? (
                    <div className="p-12 border-4 border-dashed border-outline-variant text-center bg-white">
                        <p className="text-on-surface-variant font-headline font-bold text-xl uppercase tracking-wide">It's quiet here. Go read and comment!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {recentComments.map(comment => (
                            <Link key={comment.id} href={`/read/${comment.storyId}`}>
                                <div className="p-8 bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all cursor-pointer relative group">
                                    <div className="flex flex-col mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-headline font-black text-xl text-on-surface uppercase">{comment.profile.full_name || "Anonymous"}</span>
                                            <span className="font-label font-bold text-on-surface-variant uppercase text-sm">on</span>
                                            <span className="font-headline font-bold text-primary uppercase text-lg group-hover:underline">{comment.story.title}</span>
                                        </div>
                                    </div>
                                    <p className="font-body text-2xl font-medium text-on-surface italic line-clamp-3">"{comment.content}"</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <aside className="w-full md:w-1/3 flex flex-col gap-8">
               <div className="bg-primary border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                   <h3 className="font-headline text-2xl font-black text-on-surface uppercase mb-4">Top Authors</h3>
                   <ul className="flex flex-col gap-4 font-headline font-bold text-lg">
                       <li className="flex justify-between items-center border-b-2 border-on-surface/20 pb-2"><span>1. John Doe</span> <span>★ 142</span></li>
                       <li className="flex justify-between items-center border-b-2 border-on-surface/20 pb-2"><span>2. Jane Smith</span> <span>★ 98</span></li>
                       <li className="flex justify-between items-center pb-2"><span>3. Alex West</span> <span>★ 45</span></li>
                   </ul>
               </div>
            </aside>
        </section>
      </main>
    </div>
  );
}
