import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LikeButton, CommentForm } from "@/components/Engagement";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import ReadingHeartbeat from "@/components/ReadingHeartbeat";
import ReportStory from "@/components/ReportStory";
import { AlertOctagon, ShieldAlert } from "lucide-react";

export default async function ReadStoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Increment reads
  try {
      await prisma.story.update({
          where: { id: storyId },
          data: { reads: { increment: 1 } }
      });
  } catch (e) {
      console.error("Failed to increment reads", e);
  }

  // Get current user's profile for interaction checks
  const currentProfile = user ? await prisma.profile.findFirst({
    where: { user: { email: user.email } }
  }) : null;

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      author: true,
      chapters: {
        orderBy: { order: "asc" },
      },
      likes: true,
      comments: {
        where: {
            OR: [
                { isShadowBanned: false },
                { profileId: currentProfile?.id || "none" }
            ]
        },
        include: { profile: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!story || story.chapters.length === 0) {
    notFound();
  }

  if (story.isBanned) {
    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 md:px-12 w-full mx-auto relative">
          <div className="fixed inset-0 bg-[#fdfdfa] -z-20"></div>
          <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 -z-10"></div>
          <Navbar user={user ?? null} />
          
          <main className="w-full max-w-2xl flex flex-col items-center text-center gap-8 bg-white p-12 border-4 border-on-surface shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
             <div className={`${story.isPermanentBan ? 'bg-black' : 'bg-red-500'} w-24 h-24 flex items-center justify-center rounded-3xl border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4`}>
                <ShieldAlert size={48} className="text-white" />
             </div>
             <div className="flex flex-col gap-4">
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface leading-tight uppercase tracking-tighter">
                    {story.isPermanentBan ? "Chronicle Erased" : "Chronicle Restricted"}
                </h1>
                <p className={`font-label font-bold ${story.isPermanentBan ? 'bg-black text-white' : 'bg-red-50 text-red-500'} text-xl uppercase tracking-widest px-4 py-2 border-2 ${story.isPermanentBan ? 'border-black' : 'border-red-500'}`}>
                    Status: {story.isPermanentBan ? "Permanent Ban" : "Restricted"}
                </p>
             </div>
             
             <div className="w-full h-2 bg-on-surface/10 rounded-full my-4"></div>
             
             <div className="flex flex-col gap-4 items-center">
                <p className="font-headline font-black text-xs uppercase tracking-[0.3em] text-on-surface/40">Reason for Restriction</p>
                <p className="font-body text-2xl font-bold text-on-surface italic max-w-lg">
                    "{story.banReason || "This content has been restricted due to a violation of SOULPAD community guidelines."}"
                </p>
                
                {!story.isPermanentBan && story.banExpiresAt && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 mt-4">
                        Appeal Window Open Until: {new Date(story.banExpiresAt).toLocaleDateString()}
                    </p>
                )}
             </div>

             <Link href="/discover" className="mt-8 px-10 py-4 bg-primary text-on-primary font-headline font-black text-xl uppercase tracking-widest border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Back to Discovery
             </Link>
          </main>
        </div>
    );
  }

  const firstChapter = story.chapters[0];
  const isLiked = currentProfile ? story.likes.some(l => l.profileId === currentProfile.id) : false;

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32 relative">
      <div className="fixed inset-0 bg-[#fdfdfa] -z-20"></div>
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 -z-10"></div>
      
      <Navbar user={user ?? null} />

      {/* Reading Heartbeat for Pillar of Time tracking */}
      <ReadingHeartbeat storyId={story.id} />

      <main className="w-full max-w-3xl flex flex-col gap-12 mt-8">
        <header className="flex flex-col gap-6 items-center text-center pb-12 border-b-8 border-primary">
            {story.genre && (
                <span className="inline-block px-4 py-1.5 bg-primary text-on-primary border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-headline text-sm font-bold uppercase tracking-widest w-max mb-4">
                  {story.genre}
                </span>
            )}
            <h1 className="font-headline text-6xl md:text-8xl font-black text-on-surface leading-[0.9] tracking-tighter uppercase mb-4">
                {story.title}
            </h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">
                By <span className="text-on-surface border-b-4 border-primary pb-1">{story.author.full_name || "Unknown Author"}</span>
            </p>
        </header>

        <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-xl prose-p:leading-[1.8] prose-p:text-[#171717] font-medium max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-12" dangerouslySetInnerHTML={{ __html: firstChapter.content }} />

        <section className="flex flex-col gap-8 w-full bg-white p-8 md:p-12 border-4 border-on-surface">
            <div className="flex items-center justify-between">
                <h3 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tighter">Engagement</h3>
                <LikeButton storyId={story.id} initialLiked={isLiked} initialCount={story.likes.length} />
            </div>

            <div className="flex flex-col gap-8 mt-4">
                <CommentForm storyId={story.id} />
                
                <div className="flex justify-center border-t-2 border-on-surface/5 pt-8">
                   <ReportStory storyId={story.id} />
                </div>

                <div className="flex flex-col gap-6 mt-8">
                    {story.comments.map(comment => (
                        <div key={comment.id} className="flex flex-col gap-3 p-6 bg-surface border-2 border-outline-variant relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                            <div className="flex items-center justify-between pl-4">
                                <span className="font-headline font-bold text-lg text-on-surface uppercase">{comment.profile.full_name || "Anonymous"}</span>
                                <span className="font-label font-medium text-sm text-outline-variant">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="font-body text-xl font-medium text-on-surface pl-4">{comment.content}</p>
                        </div>
                    ))}
                    {story.comments.length === 0 && (
                        <div className="p-12 border-4 border-dashed border-outline-variant text-center">
                          <p className="text-on-surface-variant font-headline font-bold text-xl uppercase tracking-wide">No thoughts yet. Have your say.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
