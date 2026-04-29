
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.email) {
    redirect("/auth/signin");
  }

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } }
  });

  const likedStories = profile ? await prisma.like.findMany({
    where: { profileId: profile.id },
    include: {
      story: {
        include: { author: true, _count: { select: { likes: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  }) : [];

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-7xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col gap-4 border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Your Library</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">Stories you love</p>
        </header>

        <section className="flex flex-col gap-8 w-full">
            {likedStories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-4 border-dashed border-outline-variant bg-white">
                    <h3 className="font-headline text-3xl font-black text-on-surface-variant uppercase mb-4">Nothing here yet</h3>
                    <Link href="/discover" className="bg-primary text-on-surface border-2 border-on-surface px-8 py-3 font-headline font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all">Go find something great</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {likedStories.map(({ story }) => (
                    <Link key={story.id} href={`/read/${story.id}`}>
                      <article className="bg-white rounded-lg overflow-hidden group transition-all duration-300 cursor-pointer relative h-full flex flex-col border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                        <div className="h-48 w-full bg-surface-variant relative overflow-hidden flex-shrink-0 border-b-4 border-on-surface">
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 will-change-transform"
                            style={{
                              backgroundImage: `url('${story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')`,
                            }}
                          ></div>
                        </div>
                        <div className="p-6 flex flex-col gap-4 relative z-10 flex-grow">
                          {story.genre && (
                            <span className="inline-block px-3 py-1 bg-primary text-on-primary border-2 border-on-surface font-headline text-xs font-bold uppercase tracking-wider w-max">
                              {story.genre}
                            </span>
                          )}
                          <div>
                            <h3 className="font-headline text-2xl font-black text-on-surface leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2">
                              {story.title}
                            </h3>
                            <p className="font-label text-sm text-on-surface-variant font-bold mt-2 uppercase flex justify-between">
                              <span>{story.author.full_name || "Unknown Author"}</span>
                              <span className="text-primary font-black">LIKED</span>
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
            )}
        </section>
      </main>
    </div>
  );
}

