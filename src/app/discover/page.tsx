import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const stories = await prisma.story.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { author: true, _count: { select: { likes: true, comments: true } } },
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-7xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col md:flex-row gap-6 justify-between items-end border-b-8 border-primary pb-8">
            <div>
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Discover</h1>
                <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">Unearth New Universes</p>
            </div>
            
            <div className="flex w-full md:w-auto relative">
                <input 
                    type="text" 
                    placeholder="SEARCH STORIES..." 
                    className="w-full md:w-96 bg-white border-4 border-on-surface text-on-surface px-6 py-4 rounded font-headline font-bold text-lg uppercase focus:outline-none focus:ring-4 focus:ring-primary/50"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary px-6 border-2 border-on-surface font-headline font-black uppercase text-on-surface hover:bg-primary-container transition-colors">Go</button>
            </div>
        </header>

        <section className="flex flex-col gap-8 w-full">
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {["All", "Sci-Fi", "Fantasy", "Mystery", "Drama", "Romance", "Thriller"].map(genre => (
                    <button key={genre} className={`whitespace-nowrap px-6 py-2 font-headline font-black uppercase tracking-wider border-2 border-on-surface ${genre === "All" ? "bg-on-surface text-white" : "bg-white text-on-surface hover:bg-surface-container"} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}>
                        {genre}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {stories.map(story => (
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
                           <span className="text-on-surface">★ {story._count.likes}</span>
                         </p>
                       </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
        </section>
      </main>
    </div>
  );
}
