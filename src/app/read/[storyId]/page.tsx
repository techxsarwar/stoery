export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import ReadingHeartbeat from "@/components/ReadingHeartbeat";
import { AlertOctagon, ShieldAlert } from "lucide-react";
import ReaderClient from "@/components/ReaderClient";
import { getStoryContent, getStoryEngagement } from "@/lib/cache";

export default async function ReadStoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Increment reads (non-blocking)
  prisma.story.update({
      where: { id: storyId },
      data: { reads: { increment: 1 } }
  }).catch(e => console.error("Failed to increment reads", e));

  // Get profile, cached story content, and live engagement in parallel
  const [currentProfile, storyContent] = await Promise.all([
      user ? prisma.profile.findFirst({
        where: { user: { email: user.email } }
      }) : Promise.resolve(null),
      getStoryContent(storyId),
  ]);

  if (!storyContent || storyContent.chapters.length === 0) {
    notFound();
  }

  // Fetch engagement separately (can be after finding story content to avoid unnecessary DB load)
  const engagement = await getStoryEngagement(storyId, currentProfile?.id);

  // Merge story data for the client
  const story = {
      ...storyContent,
      ...engagement
  };

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

  let initialChapterId = null;
  let initialProgress = 0;

  if (currentProfile) {
      const history = await prisma.readingHistory.findUnique({
          where: { profileId_storyId: { profileId: currentProfile.id, storyId: story.id } }
      });
      if (history) {
          initialChapterId = history.chapterId;
          initialProgress = history.scrollProgress;
      }
  }

  return (
    <>
      {/* Reading Heartbeat for Pillar of Time tracking */}
      <ReadingHeartbeat storyId={story.id} />
      <ReaderClient 
        story={story} 
        currentProfile={currentProfile} 
        initialChapterId={initialChapterId} 
        initialProgress={initialProgress} 
        user={user ?? null} 
      />
    </>
  );
}

