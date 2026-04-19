import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const stories = await prisma.story.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/60 backdrop-blur-xl bg-gradient-to-b from-[#1c1b1d] to-transparent shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-full">
          <Link
            className="text-2xl font-black tracking-tighter text-[#8B5CF6] font-headline"
            href="/"
          >
            STORYVERSE
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              className="font-headline tracking-wide text-[#f5f7fa]/70 hover:text-[#d0bcff] transition-colors duration-300"
              href="#"
            >
              Discover
            </Link>
            <Link
              className="font-headline tracking-wide text-[#f5f7fa]/70 hover:text-[#d0bcff] transition-colors duration-300"
              href="#"
            >
              Community
            </Link>
            <Link
              className="font-headline tracking-wide text-[#f5f7fa]/70 hover:text-[#d0bcff] transition-colors duration-300"
              href="#"
            >
              My Library
            </Link>
          </div>
          <Link href="/dashboard/write" className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 glow-hover">
            Start Writing
          </Link>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-32">
        <section className="flex flex-col items-center justify-center text-center min-h-[614px] relative z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6 max-w-4xl leading-tight">
            Where Every Story Finds Its Reader
          </h1>
          <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-12 italic">
            Join a community of creators and readers. Write your masterpiece,
            design your covers, and share your universe with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="#trending" className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline text-lg px-8 py-4 rounded-full hover:scale-[1.02] transition-all duration-300 glow-hover font-semibold">
              Start Reading
            </Link>
            <Link href="/auth/signup" className="border border-outline-variant/20 bg-transparent text-on-surface font-headline text-lg px-8 py-4 rounded-full hover:bg-surface-container-high transition-all duration-300 flex items-center justify-center">
              Create an Account
            </Link>
          </div>
        </section>

        <section id="trending" className="w-full relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              Trending This Week
            </h2>
          </div>
          
          {stories.length === 0 ? (
            <div className="text-center py-12 text-outline-variant font-label text-lg">No stories published yet. Be the first!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map(story => (
                <Link key={story.id} href={`/read/${story.id}`}>
                  <article className="bg-surface-container-low rounded-lg overflow-hidden group hover:bg-surface-container-high transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] cursor-pointer relative h-full flex flex-col border border-transparent hover:border-primary/20">
                    <div className="h-48 w-full bg-gradient-to-br from-surface-container-highest to-surface-container-low relative overflow-hidden flex-shrink-0">
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"
                        style={{
                          backgroundImage: `url('${story.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')`,
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                    </div>
                    <div className="p-8 flex flex-col gap-6 relative z-10 flex-grow">
                      {story.genre && (
                        <span className="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-label uppercase tracking-wider w-max">
                          {story.genre}
                        </span>
                      )}
                      <div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2 leading-tight">
                          {story.title}
                        </h3>
                        <p className="font-label text-sm text-outline">
                          {story.author.name}
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

      <footer className="bg-[#1c1b1d] w-full py-12 px-8 mt-auto z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="text-lg font-bold text-[#8B5CF6] font-headline">
            STORYVERSE
          </div>
          <div className="text-[#f5f7fa]/50 font-label text-sm tracking-tight text-center md:text-left">
            © 2024 STORYVERSE. Crafted for high-end storytelling.
          </div>
          <div className="flex gap-6">
            <Link
              className="text-[#f5f7fa]/50 hover:text-white transition-all font-label text-sm"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-[#f5f7fa]/50 hover:text-white transition-all font-label text-sm"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-[#f5f7fa]/50 hover:text-white transition-all font-label text-sm"
              href="#"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
