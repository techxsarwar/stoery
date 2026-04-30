import { prisma } from "@/lib/prisma";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

export default async function DiscoverPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto animate-pulse">
                <div className="h-20 w-full bg-surface-container border-b-8 border-primary mb-12"></div>
                <div className="grid grid-cols-4 gap-8 w-full max-w-7xl">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="aspect-[3/4] bg-surface-container border-4 border-on-surface"></div>
                    ))}
                </div>
            </div>
        }>
            <DiscoverContent {...props} />
        </Suspense>
    );
}

async function DiscoverContent(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const genre = typeof searchParams.genre === 'string' ? searchParams.genre : undefined;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let penName = null;
  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { pen_name: true }
    });
    penName = profile?.pen_name;
  }

  const where: Prisma.StoryWhereInput = {
    status: "PUBLISHED",
    isBanned: false,
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { author: { full_name: { contains: q, mode: 'insensitive' } } },
      { author: { username: { contains: q, mode: 'insensitive' } } },
    ];
  }

  if (genre && genre !== "All") {
    where.genre = genre;
  }

  const stories = await prisma.story.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { 
        author: { select: { full_name: true, pen_name: true, username: true } }, 
        _count: { select: { likes: true, comments: true } } 
    },
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <Navbar user={user ?? null} penName={penName} />

      <main className="w-full max-w-7xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col md:flex-row gap-6 justify-between items-end border-b-8 border-primary pb-8">
            <div>
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">
                    {q ? `Search: ${q}` : "Discover"}
                </h1>
                <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">
                    {q ? `Found ${stories.length} results` : "Unearth New Universes"}
                </p>
            </div>
            
            <form action="/discover" method="GET" className="flex w-full md:w-auto relative">
                <input 
                    name="q"
                    type="text" 
                    defaultValue={q}
                    placeholder="SEARCH STORIES..." 
                    className="w-full md:w-96 bg-white border-4 border-on-surface text-on-surface px-6 py-4 rounded font-headline font-bold text-lg uppercase focus:outline-none focus:ring-4 focus:ring-primary/50"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary px-6 border-2 border-on-surface font-headline font-black uppercase text-on-surface hover:bg-primary-container transition-colors">Go</button>
            </form>
        </header>

        <section className="flex flex-col gap-8 w-full">
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {["All", "Sci-Fi", "Fantasy", "Mystery", "Drama", "Romance", "Thriller", "Horror"].map(g => (
                    <Link 
                        key={g} 
                        href={`/discover?genre=${g}${q ? `&q=${q}` : ""}`}
                        className={`whitespace-nowrap px-6 py-2 font-headline font-black uppercase tracking-wider border-2 border-on-surface transition-all ${
                            (genre === g || (!genre && g === "All")) 
                            ? "bg-on-surface text-white shadow-none translate-x-[2px] translate-y-[2px]" 
                            : "bg-white text-on-surface hover:bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        }`}
                    >
                        {g}
                    </Link>
                ))}
            </div>

            {stories.length === 0 ? (
                <div className="text-center py-32 border-4 border-dashed border-on-surface-variant/30 rounded-none bg-surface-container/50">
                    <p className="font-headline text-3xl font-black text-on-surface-variant uppercase tracking-tighter opacity-50">The void is silent. No stories found.</p>
                    <Link href="/discover" className="mt-6 inline-block font-label font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-8">Clear all filters</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {stories.map(story => (
                    <Link key={story.id} href={`/read/${story.id}`}>
                      <article className="bg-white overflow-hidden group transition-all duration-300 cursor-pointer relative h-full flex flex-col border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                        <div className="h-48 w-full bg-surface-variant relative overflow-hidden flex-shrink-0 border-b-4 border-on-surface">
                          <Image
                             src={story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                             alt={story.title}
                             fill
                             className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                           />
                         </div>
                         <div className="p-6 flex flex-col gap-4 relative z-10 flex-grow">
                            <div className="flex justify-between items-start gap-4">
                                 {story.genre && (
                                     <span className="inline-block px-3 py-1 bg-primary text-on-primary border-2 border-on-surface font-headline text-[10px] font-black uppercase tracking-widest">
                                         {story.genre}
                                     </span>
                                 )}
                                 <div className="font-headline font-black text-xs uppercase text-on-surface flex items-center gap-1">
                                     ★ {story._count.likes}
                                 </div>
                            </div>
                            <div>
                              <h3 className="font-headline text-2xl font-black text-on-surface leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2">
                                {story.title}
                              </h3>
                              <p className="font-label text-[10px] text-on-surface-variant font-bold mt-2 uppercase">
                                By {story.author.full_name || story.author.username || "Unknown"}
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
