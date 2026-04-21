"use client";

import { useTransition } from "react";
import { deleteStory, updateStoryStatus } from "@/actions/story";

import Link from "next/link";

export default function DashboardClient({ stories }: { stories: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (storyId: string, currentStatus: string) => {
    startTransition(async () => {
      const newStatus = currentStatus === "PUBLISHED" ? "PAUSED" : "PUBLISHED";
      await updateStoryStatus(storyId, newStatus);
    });
  };

  const handleDelete = (storyId: string) => {
    if (confirm("Are you sure you want to delete this story? This cannot be undone.")) {
      startTransition(async () => {
        await deleteStory(storyId);
      });
    }
  };

  if (stories.length === 0) {
    return (
      <div className="p-12 border-4 border-dashed border-outline-variant text-center bg-white mt-8">
          <p className="text-on-surface-variant font-headline font-bold text-xl uppercase tracking-wide">You haven't written any stories yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 mt-8">
      <div className="bg-primary border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="font-headline font-black text-3xl uppercase text-on-surface tracking-tighter">Forge a New Path</h2>
           <p className="font-body text-xl font-bold mt-2 text-on-surface">The universe awaits your next move.</p>
        </div>
        <Link href="/dashboard/write" className="bg-white text-on-surface border-4 border-on-surface px-8 py-4 font-headline font-black uppercase text-xl transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto text-center whitespace-nowrap">
           Start Writing
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {stories.map(story => (
          <div key={story.id} className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row relative group">
            {/* Story Thumbnail Status */}
            <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-surface-variant border-b-4 sm:border-b-0 sm:border-r-4 border-on-surface relative overflow-hidden flex-shrink-0">
               <div
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${story.status === "PAUSED" ? "opacity-30 grayscale" : "opacity-100"}`}
                  style={{ backgroundImage: `url('${story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')` }}
                ></div>
                {story.status === "PAUSED" && (
                    <div className="absolute inset-0 flex items-center justify-center font-headline font-black text-on-surface text-2xl uppercase tracking-widest bg-white/50 backdrop-blur-sm -rotate-12 border-y-4 border-on-surface">
                        PAUSED
                    </div>
                )}
            </div>

            {/* Story Details */}
            <div className="flex flex-col flex-grow p-6 relative">
              <div className="flex-grow">
                {story.genre && (
                  <span className="inline-block px-3 py-1 bg-surface border-2 border-on-surface font-headline text-xs font-bold uppercase tracking-wider mb-3 w-max">
                    {story.genre}
                  </span>
                )}
                <h3 className="font-headline font-black text-2xl uppercase text-on-surface leading-tight mb-2 line-clamp-2">
                  {story.title}
                </h3>
                
                <div className="flex gap-4 mt-4 font-label font-bold text-on-surface-variant uppercase text-sm">
                   <span>★ {story._count?.likes || 0} Likes</span>
                   <span>💬 {story._count?.comments || 0} Comments</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t-2 border-on-surface/20">
                <button
                  onClick={() => handleToggleStatus(story.id, story.status)}
                  disabled={isPending}
                  className={`flex-grow border-2 border-on-surface px-4 py-2 font-headline font-bold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none disabled:opacity-50 text-xs sm:text-sm ${story.status === "PUBLISHED" ? "bg-surface-variant text-on-surface" : "bg-primary text-on-primary"}`}
                >
                  {story.status === "PUBLISHED" ? "Pause" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(story.id)}
                  disabled={isPending}
                  className="bg-error text-on-error border-2 border-on-surface px-4 py-2 font-headline font-bold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none disabled:opacity-50 text-xs sm:text-sm flex items-center gap-2"
                  title="Delete Forever"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
