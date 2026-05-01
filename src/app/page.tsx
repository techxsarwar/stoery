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
import AIChatHelper from "@/components/AIChatHelper";
import { 
  getRecentStories, 
  getTrendingStories, 
  getFantasyStories, 
  getPlatformStats, 
  getTopAuthors, 
  getGenres,
  getMasterpieceStories,
  getRecentReviews,
  getEchoOfTheDay,
  getStreakLeaderboard,
  getNowReading,
  getAuthorSpotlights
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
    genres,
    masterpieces,
    recentReviews,
    echoOfTheDay,
    streakLeaderboard,
    nowReading,
    authorSpotlights
  ] = await Promise.all([
    supabase.auth.getUser(),
    getRecentStories(),
    getTrendingStories(),
    getFantasyStories(),
    getPlatformStats(),
    getTopAuthors(),
    getGenres(),
    getMasterpieceStories(),
    getRecentReviews(),
    getEchoOfTheDay(),
    getStreakLeaderboard(),
    getNowReading(),
    getAuthorSpotlights()
  ]);

  const { totalStories, totalAuthors, totalReads } = stats;

  const factionStats = await prisma.profile.groupBy({
      by: ['faction'],
      _count: { id: true },
      where: { faction: { not: null } }
  });

  let recentHistory = null;
  let userFaction: string | null = null;
  if (user) {
    const profile = await prisma.profile.findFirst({
        where: { user: { email: user.email } },
        select: { id: true, faction: true }
    });
    if (profile) {
        userFaction = profile.faction;
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

      {/* Cyberpunk Marquee Ticker */}
      <div className="w-full bg-primary border-b-8 border-on-surface overflow-hidden py-3 relative z-20 flex">
          <div className="animate-marquee whitespace-nowrap flex gap-12 font-headline font-black uppercase tracking-widest text-on-primary text-sm">
              {[...Array(4)].map((_, i) => (
                  <span key={i} className="flex gap-12">
                      <span>/// NEON SYNDICATE TAKES THE LEAD</span>
                      <span>{totalReads.toLocaleString()} SOULS BURNED TODAY</span>
                      <span>SYSTEM ARCHITECTURE: STABLE ///</span>
                      <span>{totalAuthors.toLocaleString()} CHRONICLERS CONNECTED</span>
                  </span>
              ))}
          </div>
      </div>

      {/* Now Reading Live Strip */}
      {nowReading.length > 0 && (
        <div className="w-full bg-surface-container border-b-4 border-on-surface/10 overflow-hidden py-2 flex">
          <div className="animate-marquee whitespace-nowrap flex gap-16 font-label font-bold uppercase tracking-widest text-on-surface-variant text-xs">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="flex gap-16">
                {nowReading.map((r) => (
                  <span key={`${i}-${r.id}`} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
                    Someone is reading{" "}
                    <Link href={`/read/${r.storyId}`} className="text-primary hover:underline">
                      {r.story.title}
                    </Link>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

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

            <HorizontalCarousel title="The Masterpieces" subtitle="The highest-rated chronicles of all time.">
                {masterpieces.map((story) => (
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

        {/* Author Spotlights — Chronicles from Our Community */}
        {authorSpotlights.length > 0 && (
          <section className="w-full">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">Chronicles from Our Community</h2>
              <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
              <Link href="/discover" className="font-label font-black text-xs uppercase tracking-[0.2em] text-primary hover:underline underline-offset-4 decoration-2 whitespace-nowrap">
                All Stories →
              </Link>
            </div>

            <div className="flex flex-col gap-0 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {authorSpotlights.map((author, i) => {
                const story = author.stories[0];
                if (!story) return null;

                const factionLabel: Record<string, { label: string; color: string }> = {
                  NEON_SYNDICATE: { label: "Neon Syndicate", color: "bg-[#00ff41] text-black" },
                  OBSIDIAN_ORDER: { label: "Obsidian Order", color: "bg-on-surface text-surface" },
                  THE_VOIDBORN:   { label: "The Voidborn",   color: "bg-purple-600 text-white" },
                };
                const faction = author.faction ? factionLabel[author.faction] : null;
                const isEven = i % 2 === 0;

                return (
                  <div
                    key={author.id}
                    className={`flex flex-col md:flex-row ${isEven ? "" : "md:flex-row-reverse"} border-b-4 border-on-surface last:border-b-0 group`}
                  >
                    {/* Story Cover */}
                    <Link
                      href={`/read/${story.id}`}
                      className="relative w-full md:w-72 h-64 md:h-auto flex-shrink-0 overflow-hidden bg-on-surface"
                    >
                      <Image
                        src={story.cover_url || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop`}
                        alt={story.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                      />
                      {/* Genre badge */}
                      {story.genre && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-on-primary font-label font-black text-[10px] uppercase tracking-[0.2em]">
                          {story.genre}
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className={`flex-1 p-8 md:p-12 flex flex-col justify-between gap-6 bg-surface-container ${ isEven ? "border-l-0 md:border-l-4" : "border-r-0 md:border-r-4"} border-on-surface`}>
                      {/* Author identity */}
                      <div className="flex items-start gap-4">
                        <Link href={`/u/${author.username || author.id}`} className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-full border-4 border-on-surface overflow-hidden relative bg-primary/20 hover:scale-110 transition-transform">
                            <Image
                              src={author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username || author.id}`}
                              alt={author.pen_name || author.full_name || "Author"}
                              fill unoptimized className="object-cover"
                            />
                          </div>
                        </Link>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/u/${author.username || author.id}`} className="font-headline font-black text-xl uppercase text-on-surface hover:text-primary transition-colors">
                              {author.pen_name || author.full_name || author.username}
                            </Link>
                            {author.isVerified && (
                              <span title="Verified Chronicler" className="text-primary text-base">✦</span>
                            )}
                            {faction && (
                              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 ${faction.color}`}>
                                {faction.label}
                              </span>
                            )}
                          </div>
                          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
                            {author._count.followers.toLocaleString()} Followers · {author._count.stories} {author._count.stories === 1 ? "Story" : "Stories"}
                          </p>
                        </div>
                      </div>

                      {/* Story info */}
                      <div className="flex flex-col gap-3">
                        <Link href={`/read/${story.id}`} className="font-headline font-black text-3xl uppercase tracking-tight text-on-surface hover:text-primary transition-colors leading-tight">
                          {story.title}
                        </Link>
                        {story.description && (
                          <p className="font-body italic text-on-surface-variant leading-relaxed line-clamp-3">
                            {story.description}
                          </p>
                        )}
                      </div>

                      {/* Stats + CTA */}
                      <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t-2 border-on-surface/10">
                        <div className="flex items-center gap-6">
                          <span className="flex items-center gap-1.5 font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            {story.reads.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5 font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            {story._count.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5 font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                            {story._count.chapters} {story._count.chapters === 1 ? "Chapter" : "Chapters"}
                          </span>
                        </div>
                        <Link
                          href={`/read/${story.id}`}
                          className="bg-on-surface text-surface font-headline font-black text-xs uppercase tracking-[0.2em] px-6 py-3 border-2 border-on-surface hover:bg-primary hover:border-primary hover:text-on-primary transition-all duration-300"
                        >
                          Read Now →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* AI Feature Showcase */}

        <section className="w-full">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">The Neural Engine</h2>
            <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-on-surface text-surface p-10 flex flex-col gap-6 border-b-4 md:border-b-0 md:border-r-4 border-surface/20 group hover:bg-primary hover:text-on-primary transition-colors duration-300">
              <div className="text-5xl">✍️</div>
              <h3 className="font-headline text-2xl font-black uppercase tracking-tight">Continue Your Story</h3>
              <p className="font-body text-sm italic opacity-70 leading-relaxed flex-grow">
                Stuck mid-chapter? Let Venice Uncensored pick up your exact atmosphere and keep the prose burning — no safety filters, no compromises.
              </p>
              <Link href="/dashboard" className="font-label font-black text-xs uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 opacity-60 group-hover:opacity-100 transition-opacity">
                Open Writing Studio →
              </Link>
            </div>
            <div className="bg-surface-container-high text-on-surface p-10 flex flex-col gap-6 border-b-4 md:border-b-0 md:border-r-4 border-on-surface/20 group hover:bg-on-surface hover:text-surface transition-colors duration-300">
              <div className="text-5xl">🌌</div>
              <h3 className="font-headline text-2xl font-black uppercase tracking-tight">Map Your Resonance</h3>
              <p className="font-body text-sm italic opacity-70 leading-relaxed flex-grow">
                NVIDIA Nemotron encodes your story into a 4096-dimension vibe vector. Find readers who feel exactly what you wrote — across any genre.
              </p>
              <Link href="/dashboard" className="font-label font-black text-xs uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 opacity-60 group-hover:opacity-100 transition-opacity">
                Explore Resonance Matrix →
              </Link>
            </div>
            <div className="bg-white text-on-surface p-10 flex flex-col gap-6 group hover:bg-primary hover:text-on-primary transition-colors duration-300">
              <div className="text-5xl">🛡️</div>
              <h3 className="font-headline text-2xl font-black uppercase tracking-tight">Originality Check</h3>
              <p className="font-body text-sm italic opacity-70 leading-relaxed flex-grow">
                Hermes 3 (405B) runs a full plagiarism analysis before you publish — originality score, structured flags, and a publish verdict.
              </p>
              <Link href="/dashboard" className="font-label font-black text-xs uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 opacity-60 group-hover:opacity-100 transition-opacity">
                Score Your Story →
              </Link>
            </div>
          </div>
        </section>

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

        {/* Echo of the Day */}
        {echoOfTheDay && (
          <section className="w-full">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">Echo of the Day</h2>
              <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
            </div>
            <div className="relative border-4 border-on-surface bg-surface-container shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="absolute top-4 left-6 font-headline text-[160px] font-black leading-none text-primary/5 select-none pointer-events-none">{String.fromCharCode(0x201C)}</div>
              <div className="relative z-10 p-10 md:p-16 flex flex-col gap-8">
                <div className="inline-block px-3 py-1 bg-primary text-on-primary font-label text-[10px] font-black uppercase tracking-[0.3em] w-fit">
                  Reader&apos;s Echo
                </div>
                <blockquote className="font-body text-2xl md:text-3xl italic text-on-surface leading-relaxed border-l-4 border-primary pl-6">
                  &ldquo;{echoOfTheDay.quote}&rdquo;
                </blockquote>
                <p className="font-body text-on-surface-variant italic text-lg leading-relaxed max-w-3xl">
                  {echoOfTheDay.content}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t-2 border-on-surface/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-on-surface overflow-hidden bg-primary/20 relative flex-shrink-0">
                      <Image
                        src={echoOfTheDay.profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${echoOfTheDay.profile.username}`}
                        alt="Avatar" fill unoptimized className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-headline font-black text-sm uppercase text-on-surface">
                        {echoOfTheDay.profile.pen_name || echoOfTheDay.profile.full_name || echoOfTheDay.profile.username}
                      </p>
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Reader</p>
                    </div>
                  </div>
                  <Link
                    href={`/read/${echoOfTheDay.storyId}`}
                    className="font-headline font-black text-sm uppercase tracking-widest text-primary hover:underline decoration-2 underline-offset-4 flex items-center gap-2"
                  >
                    from: {echoOfTheDay.story.title} →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Community Reviews Section */}
        {recentReviews.length > 0 && (
            <section className="w-full">
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">Voices from the Nexus</h2>
                    <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentReviews.map(review => (
                        <div key={review.id} className="bg-surface-container border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_var(--color-primary)] transition-all duration-300 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex text-brand_yellow">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    ))}
                                </div>
                                <span className="font-label text-[10px] font-bold uppercase tracking-widest opacity-40">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-headline font-black text-lg uppercase tracking-tight text-on-surface leading-snug">"{review.title}"</h3>
                            <p className="font-body italic text-on-surface-variant line-clamp-4 flex-grow">{review.content}</p>
                            <div className="mt-4 pt-4 border-t-2 border-on-surface/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-on-surface overflow-hidden bg-primary/20 relative">
                                        <Image src={review.profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.profile.username || review.profile.full_name}`} alt="Avatar" fill unoptimized className="object-cover" />
                                    </div>
                                    <span className="font-headline text-xs font-black uppercase text-on-surface">{review.profile.full_name || review.profile.username}</span>
                                </div>
                                <Link href={`/read/${review.storyId}`} className="font-label text-[10px] font-bold uppercase tracking-widest text-primary hover:underline max-w-[120px] truncate text-right">
                                    on {review.story.title}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

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
                <span className="font-headline text-6xl font-black block mb-2">{(totalReads || 0).toLocaleString()}</span>
                <span className="font-label text-sm font-black uppercase tracking-[0.2em] opacity-60">Global Reads</span>
            </div>
        </section>

        {/* Reading Streak Leaderboard */}
        {streakLeaderboard.length > 0 && (
          <section className="w-full">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">Streak Leaderboard</h2>
              <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
              <span className="font-label font-black text-xs uppercase tracking-[0.2em] text-primary">🔥 Active Readers</span>
            </div>
            <div className="border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {streakLeaderboard.map((reader, i) => (
                <div
                  key={reader.id}
                  className={`flex items-center gap-6 px-8 py-5 border-b-2 border-on-surface/10 last:border-b-0 hover:-translate-x-1 transition-transform ${
                    i === 0 ? "bg-primary text-on-primary" : i === 1 ? "bg-surface-container-high text-on-surface" : "bg-surface-container text-on-surface"
                  }`}
                >
                  <span className={`font-headline font-black text-3xl w-10 text-center ${ i === 0 ? "text-on-primary" : "text-primary"}`}>
                    {i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div className="w-10 h-10 rounded-full border-2 border-on-surface overflow-hidden bg-primary/20 relative flex-shrink-0">
                    <Image
                      src={reader.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reader.username || reader.id}`}
                      alt={reader.username || "Reader"} fill unoptimized className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/u/${reader.username || reader.id}`} className="font-headline font-black text-lg uppercase hover:underline decoration-2 underline-offset-2">
                      {reader.pen_name || reader.full_name || reader.username || "Anonymous"}
                    </Link>
                    <p className="font-label text-[10px] uppercase tracking-widest opacity-60">Longest: {reader.longest_streak} days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-black text-3xl">{reader.reading_streak}</p>
                    <p className="font-label text-[10px] uppercase tracking-widest opacity-60">Day Streak</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Faction Leaderboard */}
        <section className="w-full">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">The Faction Wars</h2>
                <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['NEON_SYNDICATE', 'OBSIDIAN_ORDER', 'THE_VOIDBORN'].map((faction) => {
                    const count = factionStats.find((f:any) => f.faction === faction)?._count.id || 0;
                    const names = {
                        NEON_SYNDICATE: "The Neon Syndicate",
                        OBSIDIAN_ORDER: "The Obsidian Order",
                        THE_VOIDBORN: "The Voidborn"
                    };
                    const colors = {
                        NEON_SYNDICATE: "border-[#00ff41] text-on-surface shadow-[8px_8px_0px_0px_#00ff41]",
                        OBSIDIAN_ORDER: "border-on-surface text-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-on-surface/5",
                        THE_VOIDBORN: "border-purple-500 text-on-surface shadow-[8px_8px_0px_0px_#a855f7]"
                    };
                    return (
                        <div key={faction} className={`bg-white border-4 p-8 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all ${colors[faction as keyof typeof colors]}`}>
                            <h3 className="font-headline text-2xl font-black uppercase tracking-tight mb-4">{names[faction as keyof typeof names]}</h3>
                            <span className="font-headline text-6xl font-black block mb-2 text-on-surface">{count}</span>
                            <span className="font-label text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant">Souls Pledged</span>
                        </div>
                    );
                })}
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
                                unoptimized
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

        {/* Join a Faction CTA */}
        {(!user || !userFaction) && (
          <section className="w-full border-4 border-on-surface bg-surface-container shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-headline font-black text-xs uppercase tracking-widest text-primary/10 select-none pointer-events-none">CHOOSE_ALLEGIANCE</div>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-primary text-on-primary font-label text-[10px] font-black uppercase tracking-[0.3em] mb-4">Allegiance Required</div>
                <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface uppercase tracking-tight leading-tight mb-4">
                  Choose Your Faction
                </h2>
                <p className="font-body italic text-on-surface-variant max-w-md leading-relaxed">
                  Every chronicler owes allegiance to a cause. Join a faction, earn its colours, and represent your tribe across the SOULPAD universe.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                {([
                  { key: "NEON_SYNDICATE", label: "Neon Syndicate", emoji: "🔴", shadow: "hover:shadow-[6px_6px_0px_0px_#00ff41]" },
                  { key: "OBSIDIAN_ORDER", label: "Obsidian Order", emoji: "⚫", shadow: "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" },
                  { key: "THE_VOIDBORN",   label: "The Voidborn",   emoji: "🌌", shadow: "hover:shadow-[6px_6px_0px_0px_#a855f7]" },
                ] as const).map(f => (
                  <Link
                    key={f.key}
                    href={user ? "/profile" : "/auth/signup"}
                    className={`flex flex-col items-center gap-2 bg-white border-4 border-on-surface px-6 py-5 font-headline font-black text-sm uppercase tracking-widest hover:-translate-y-1 transition-all duration-300 ${f.shadow}`}
                  >
                    <span className="text-3xl">{f.emoji}</span>
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Careers Teaser */}
        <section className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-on-surface bg-surface-container p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <div className="flex items-center gap-5">
            <span className="text-4xl flex-shrink-0">💼</span>
            <div>
              <p className="font-label font-black text-[10px] uppercase tracking-[0.3em] text-primary mb-1">We&apos;re Hiring</p>
              <h3 className="font-headline font-black text-2xl uppercase text-on-surface tracking-tight">
                Join the Team Building the Future of Storytelling
              </h3>
              <p className="font-body italic text-on-surface-variant text-sm mt-1">
                Engineers, designers, and writers — come forge something legendary.
              </p>
            </div>
          </div>
          <Link
            href="/careers"
            className="flex-shrink-0 bg-on-surface text-surface font-headline font-black text-sm uppercase tracking-[0.2em] px-8 py-4 border-4 border-on-surface hover:bg-primary hover:text-on-primary transition-colors duration-300 whitespace-nowrap"
          >
            View Open Roles →
          </Link>
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
      <AIChatHelper />

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


      <footer className="bg-on-surface w-full pt-24 pb-12 px-6 md:px-12 mt-auto z-10 relative border-t-[12px] border-primary overflow-hidden">
        {/* Background Noise/Texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 relative z-10">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 flex flex-col items-start gap-6">
            <Link href="/" className="text-5xl md:text-7xl font-black text-surface font-headline uppercase tracking-tighter hover:text-primary transition-colors duration-500">
              SOULPAD<span className="text-primary">.</span>
            </Link>
            <p className="text-surface-variant/70 font-body text-base max-w-sm italic leading-relaxed">
              The cinematic codex for the universe's most captivating tales. High-contrast storytelling for those who dare to write outside the margins.
            </p>
            <div className="flex gap-4 mt-4">
              {['Twitter', 'Discord', 'Instagram'].map(social => (
                <Link key={social} href="#" className="font-label font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-2 border-2 border-surface-variant/30 text-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 rounded-full">
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            
            <div className="flex flex-col gap-4">
              <span className="font-headline font-black text-primary text-xs uppercase tracking-[0.3em] mb-4">Platform</span>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/about">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> About Us
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/careers">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> Careers
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/changelog">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> Changelog
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/guide">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> Architect's Guide
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/staff/login">
                <span className="w-0 group-hover:w-2 h-[2px] bg-error transition-all duration-300"></span> Staff Portal
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="font-headline font-black text-primary text-xs uppercase tracking-[0.3em] mb-4">Community</span>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/guidelines">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> Codex Laws
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/faq">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> FAQ
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="https://discord.gg/soulpad" target="_blank" rel="noopener noreferrer">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> The Guild (Discord)
              </Link>
            </div>

            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <span className="font-headline font-black text-primary text-xs uppercase tracking-[0.3em] mb-4">Legal</span>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/terms">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> Terms of Service
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/privacy">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> Privacy Policy
              </Link>
              <Link className="text-surface-variant/70 hover:text-surface hover:translate-x-2 transition-all font-label font-bold uppercase text-xs tracking-widest flex items-center gap-2 group" href="/contact">
                <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300"></span> Support
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-surface-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="font-label font-black text-[10px] tracking-[0.3em] text-surface-variant/50 uppercase">
            © {new Date().getFullYear()} SOULPAD. All rights reserved.
          </div>
          <div className="font-label font-black text-[10px] tracking-[0.3em] text-surface-variant/30 uppercase flex items-center gap-2">
            Forged in the Dark <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </div>
        </div>
      </footer>
    </>
  );
}
