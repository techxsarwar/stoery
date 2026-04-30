export const dynamic = "force-dynamic";

import { Suspense } from "react";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import ClientRecoveryRedirect from "@/components/ClientRecoveryRedirect";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import StoryCard from "@/components/StoryCard";
import AnimatedFeatures from "@/components/AnimatedFeatures";
import { 
  getRecentStories, 
  getTrendingStories, 
  getFantasyStories, 
  getPlatformStats, 
  getTopAuthors, 
  getGenres 
} from "@/lib/cache";

async function HomeContent() {
  const supabase = await createClient();
  
  const [
    { data: { user } },
    recentStories,
    trendingStories,
    fantasyStories,
    stats,
    topAuthors,
    genres
  ] = await Promise.all([
    supabase.auth.getUser(),
    getRecentStories(),
    getTrendingStories(),
    getFantasyStories(),
    getPlatformStats(),
    getTopAuthors(),
    getGenres()
  ]);

  const { totalStories, totalAuthors, totalReads } = stats;

  let recentHistory = null;
  if (user) {
    const profile = await prisma.profile.findFirst({
        where: { user: { email: user.email } }
    });
    if (profile) {
        recentHistory = await prisma.readingHistory.findFirst({
            where: { profileId: profile.id },
            orderBy: { lastReadAt: "desc" },
            include: { story: { include: { author: true } } }
        });
    }
  }

  return (
    <main className="flex-grow pb-24 w-full flex flex-col gap-12 md:gap-24">
      {/* Hero Section - Pure Wattpad Vibe */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden border-b-8 border-on-surface">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            fill
            priority
            className="object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            <div className="inline-block px-4 py-1 bg-primary text-on-primary font-headline text-xs font-black uppercase tracking-[0.3em] mb-8 border-2 border-on-surface transform -rotate-1">
                The New Era of Storytelling
            </div>
            <h1 className="font-headline text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-on-surface mb-8 leading-[0.85] uppercase">
                Where Stories <br/> Come <span className="text-primary">Alive</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-12 italic leading-relaxed">
                Join millions of readers and writers. Share your voice, build your universe, and find your next favorite obsession.
            </p>
            
            <form action="/discover" method="GET" className="w-full max-w-2xl mb-12 relative group">
                <input 
                    name="q"
                    type="text" 
                    placeholder="Search for stories, authors, or genres..." 
                    className="w-full bg-white border-4 border-on-surface px-8 py-5 font-headline text-lg focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-on-surface-variant/50"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-on-surface text-surface p-2 cursor-pointer hover:bg-primary hover:text-on-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/discover" className="bg-primary text-on-primary font-headline text-xl px-12 py-5 border-4 border-on-surface hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 uppercase tracking-wider font-black">
                    Start Reading
                </Link>
                {!user && (
                    <Link href="/auth/signup" className="bg-white text-on-surface border-4 border-on-surface font-headline text-xl px-12 py-5 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 uppercase tracking-wider font-black">
                        Start Writing
                    </Link>
                )}
            </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 flex flex-col gap-24">
        
        {/* Continue Reading Section */}
        {recentHistory && (
          <section className="bg-surface-container border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 font-headline font-black text-xs uppercase tracking-widest text-primary/20 select-none pointer-events-none">RESUME_SESSION</div>
             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-48 flex-shrink-0 relative bg-on-surface border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <Image
                        src={recentHistory.story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                        alt="Cover"
                        fill
                        loading="lazy"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col text-center md:text-left">
                    <span className="font-label font-black text-xs uppercase tracking-[0.2em] text-primary mb-2">Continue Reading</span>
                    <h2 className="font-headline text-3xl md:text-4xl font-black text-on-surface uppercase tracking-tight mb-4">{recentHistory.story.title}</h2>
                    <p className="font-body text-on-surface-variant italic mb-6 max-w-xl line-clamp-2">
                        {recentHistory.story.description || "Pick up where you left off in this captivating tale."}
                    </p>
                    <Link href={`/read/${recentHistory.storyId}`} className="inline-flex items-center justify-center md:justify-start gap-3 font-headline font-black text-xl uppercase tracking-widest text-on-surface hover:text-primary transition-colors group">
                        Jump Back In <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </Link>
                </div>
             </div>
          </section>
        )}

        {/* Discovery Sections */}
        <div className="flex flex-col gap-24">
            <HorizontalCarousel title="Trending Stories" subtitle="What everyone is talking about right now.">
                {trendingStories.map((story, i) => (
                    <StoryCard 
                        key={story.id} 
                        id={story.id} 
                        title={story.title} 
                        author={story.author.full_name || story.author.username || "Unknown"} 
                        coverUrl={story.cover_url}
                        genre={story.genre}
                        reads={story.reads}
                        likes={story._count.likes}
                        priority={i < 5} // Load first 5 trending stories immediately
                    />
                ))}
            </HorizontalCarousel>

            <HorizontalCarousel title="New Arrivals" subtitle="Fresh voices and untold tales from the community.">
                {recentStories.map(story => (
                    <StoryCard 
                        key={story.id} 
                        id={story.id} 
                        title={story.title} 
                        author={story.author.full_name || story.author.username || "Unknown"} 
                        coverUrl={story.cover_url}
                        genre={story.genre}
                        reads={story.reads}
                        likes={story._count.likes}
                    />
                ))}
            </HorizontalCarousel>

            {fantasyStories.length > 0 && (
                <HorizontalCarousel title="Fantasy Realms" subtitle="Escape into worlds of magic and wonder.">
                    {fantasyStories.map(story => (
                        <StoryCard 
                            key={story.id} 
                            id={story.id} 
                            title={story.title} 
                            author={story.author.full_name || story.author.username || "Unknown"} 
                            coverUrl={story.cover_url}
                            genre={story.genre}
                            reads={story.reads}
                            likes={story._count.likes}
                        />
                    ))}
                </HorizontalCarousel>
            )}
        </div>

        {/* Core Features Grid from README - Animated */}
        <AnimatedFeatures />

        {/* Genre Grid */}
        <section className="w-full">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">Explore Genres</h2>
                <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {genres.map((genre, i) => (
                    <Link 
                        key={i} 
                        href={`/discover?genre=${genre}`}
                        className="bg-white border-2 border-on-surface p-6 text-center font-headline font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        {genre}
                    </Link>
                ))}
            </div>
        </section>

        {/* Community Stats Section */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-on-surface text-surface p-12 border-4 border-on-surface shadow-[8px_8px_0px_0px_var(--color-primary)]">
                <span className="font-headline text-6xl font-black block mb-2">{totalStories.toLocaleString()}</span>
                <span className="font-label text-sm font-black uppercase tracking-[0.2em] opacity-60">Stories Written</span>
            </div>
            <div className="bg-primary text-on-primary p-12 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-headline text-6xl font-black block mb-2">{totalAuthors.toLocaleString()}</span>
                <span className="font-label text-sm font-black uppercase tracking-[0.2em] opacity-80">Chroniclers Joined</span>
            </div>
            <div className="bg-white text-on-surface p-12 border-4 border-on-surface shadow-[8px_8px_0px_0px_var(--color-tertiary,black)]">
                <span className="font-headline text-6xl font-black block mb-2">{(totalReads._sum.reads || 0).toLocaleString()}</span>
                <span className="font-label text-sm font-black uppercase tracking-[0.2em] opacity-60">Global Reads</span>
            </div>
        </section>

        {/* Featured Authors */}
        <section className="w-full">
            <div className="flex items-center justify-between gap-4 mb-12">
                <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">Top Chroniclers</h2>
                <Link href="/community" className="font-headline font-black text-sm uppercase tracking-widest hover:text-primary transition-colors underline decoration-2 underline-offset-4">See All</Link>
            </div>
            <div className="flex flex-wrap gap-8 justify-center md:justify-between">
                {topAuthors.map((author, i) => (
                    <Link href={`/u/${author.username || author.id}`} key={i} className="group flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full border-4 border-on-surface overflow-hidden group-hover:scale-110 transition-transform bg-primary-container relative">
                            <Image
                                src={author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username || author.id}`}
                                alt={author.username || "Author"}
                                fill
                                loading="lazy"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 border-4 border-on-surface rounded-full"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-headline text-lg font-black text-on-surface uppercase group-hover:text-primary transition-colors">
                                {author.full_name || author.username || "Anonymous"}
                            </h3>
                            <p className="font-label text-[10px] font-bold uppercase text-on-surface-variant">
                                {author._count.followers} Followers
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-24 bg-primary border-8 border-on-surface shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <h2 className="font-headline text-6xl md:text-8xl font-black text-on-primary uppercase tracking-tighter mb-12 relative z-10 leading-none">
                Start Your <br/> Legacy
            </h2>
            <Link href={user ? "/dashboard" : "/auth/signup"} className="bg-white text-on-surface border-4 border-on-surface font-headline text-2xl px-16 py-6 rounded-none font-black hover:translate-x-2 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 uppercase tracking-widest relative z-10">
                {user ? "Go to Dashboard" : "Join Soulpad"}
            </Link>
        </section>

      </div>
    </main>
  );
}

export default async function Home() {
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

  return (
    <>
      <ClientRecoveryRedirect />
      <Navbar user={user ?? null} penName={penName} />

      <Suspense fallback={
        <div className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full animate-pulse">
          <div className="h-64 bg-surface-container rounded-none mb-20 border-4 border-on-surface"></div>
          <div className="grid grid-cols-5 gap-6">
            {[1,2,3,4,5].map(i => (
                <div key={i} className="aspect-[2/3] bg-surface-container border-2 border-on-surface"></div>
            ))}
          </div>
        </div>
      }>
        <HomeContent />
      </Suspense>


      <footer className="bg-on-surface w-full py-16 px-8 mt-auto z-10 relative border-t-8 border-primary">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 max-w-7xl mx-auto">
          <div className="text-4xl font-black text-surface font-headline uppercase tracking-tighter">
            SOULPAD
          </div>
          <div className="text-surface-variant/70 font-label text-sm tracking-tight text-left md:text-center">
            © 2024 SOULPAD. Crafted for high-contrast storytelling.
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-x-12 gap-y-6 max-w-2xl">
            <div className="flex flex-col gap-3">
              <span className="font-headline font-black text-surface text-lg uppercase tracking-wider mb-2 border-b-2 border-primary pb-1">Platform</span>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/about">About Us</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/careers">Careers</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/changelog">Changelog</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/faq">FAQ</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/guide">Architect's Guidebook</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/staff/login">Staff Portal</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="font-headline font-black text-surface text-lg uppercase tracking-wider mb-2 border-b-2 border-primary pb-1">Community</span>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/guidelines">Content Guidelines</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="https://discord.gg/soulpad" target="_blank" rel="noopener noreferrer">Discord Server</Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-headline font-black text-surface text-lg uppercase tracking-wider mb-2 border-b-2 border-primary pb-1">Legal & Support</span>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/terms">Terms of Service</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/privacy">Privacy Policy</Link>
              <Link className="text-surface-variant/70 hover:text-primary transition-all font-headline font-bold uppercase text-sm tracking-wide" href="/contact">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
