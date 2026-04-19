import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  const stories = await prisma.story.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 max-w-full">
          <Link
            className="text-2xl font-black tracking-tighter text-on-surface font-headline uppercase"
            href="/"
          >
            STORYVERSE
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase"
              href="/discover"
            >
              Discover
            </Link>
            <Link
              className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase"
              href="/community"
            >
              Community
            </Link>
            {user && (
              <Link
                className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface hover:tracking-wider transition-all duration-300 font-bold uppercase"
                href="/library"
              >
                My Library
              </Link>
            )}
          </div>
          <div className="flex gap-4">
            {!user ? (
                <Link href="/auth/signin" className="bg-white text-on-surface font-headline px-6 py-2 rounded font-bold border-2 border-on-surface transition-all duration-300 hover:bg-surface-container uppercase tracking-wide">
                    Sign In
                </Link>
            ) : (
                <Link href="/dashboard/write" className="bg-primary text-on-primary font-headline px-6 py-2 rounded font-bold border-2 border-on-surface transition-all duration-300 glow-hover uppercase tracking-wide">
                    Start Writing
                </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-32">
        <section className="flex flex-col items-center justify-center text-center min-h-[500px] relative z-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container/40 via-surface to-surface opacity-70"></div>
          <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter text-on-surface mb-6 max-w-4xl leading-[0.9] uppercase">
            Where Every Story Finds Its Reader
          </h1>
          <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-12 italic">
            Join a vibrant community of creators and readers. Write your masterpiece,
            design your covers, and share your universe with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="#trending" className="bg-primary text-on-primary font-headline text-lg px-10 py-4 rounded font-bold border-2 border-on-surface hover:scale-[1.02] transition-all duration-300 glow-hover uppercase tracking-wide">
              Start Reading
            </Link>
            {!user && (
              <Link href="/auth/signup" className="bg-surface text-on-surface border-2 border-on-surface font-headline text-lg px-10 py-4 rounded font-bold hover:bg-surface-container-high transition-all duration-300 flex items-center justify-center uppercase tracking-wide glow-hover">
                Create an Account
              </Link>
            )}
          </div>
        </section>

        <section id="trending" className="w-full relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-8 bg-primary border-2 border-on-surface transform rotate-3"></div>
            <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface tracking-tighter uppercase">
              Trending This Week
            </h2>
          </div>
          
          {stories.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant font-headline text-xl border-2 border-dashed border-outline rounded-lg bg-surface-container">No stories published yet. Be the first!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map(story => (
                <Link key={story.id} href={`/read/${story.id}`}>
                  <article className="bg-surface rounded-lg overflow-hidden group transition-all duration-300 cursor-pointer relative h-full flex flex-col border-2 border-on-surface glow-hover">
                    <div className="h-48 w-full bg-surface-variant relative overflow-hidden flex-shrink-0 border-b-2 border-on-surface">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 will-change-transform"
                        style={{
                          backgroundImage: `url('${story.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')`,
                        }}
                      ></div>
                    </div>
                    <div className="p-6 flex flex-col gap-4 relative z-10 flex-grow bg-white">
                      {story.genre && (
                        <span className="inline-block px-3 py-1 bg-primary text-on-primary border border-on-surface font-headline text-sm font-bold uppercase tracking-wider w-max transform -rotate-2">
                          {story.genre}
                        </span>
                      )}
                      <div>
                        <h3 className="font-headline text-2xl font-black text-on-surface leading-tight uppercase group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>
                        <p className="font-label text-sm text-on-surface-variant font-medium mt-2 uppercase">
                          By <span className="text-on-surface font-bold">{story.author.name}</span>
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

      <footer className="bg-on-surface w-full py-16 px-8 mt-auto z-10 relative border-t-8 border-primary">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 max-w-7xl mx-auto">
          <div className="text-4xl font-black text-surface font-headline uppercase tracking-tighter">
            STORYVERSE
          </div>
          <div className="text-surface-variant/70 font-label text-sm tracking-tight text-left md:text-center">
            © 2024 STORYVERSE. Crafted for high-contrast storytelling.
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              className="text-primary hover:text-primary-container transition-all font-headline font-bold uppercase"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-surface hover:text-primary transition-all font-headline font-bold uppercase"
              href="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="text-surface hover:text-primary transition-all font-headline font-bold uppercase"
              href="/privacy"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
