"use client";

import { useTransition } from "react";
import { deleteStory, updateStoryStatus } from "@/actions/story";

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
    <div className="flex flex-col gap-6 mt-8">
      {stories.map(story => (
        <div key={story.id} className="p-6 bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h3 className="font-headline font-black text-2xl uppercase text-on-surface hover:text-primary transition-colors">
              {story.title}
            </h3>
            <p className="font-label font-bold text-on-surface-variant uppercase mt-1">
              Status: <span className={story.status === "PUBLISHED" ? "text-primary" : "text-error"}>{story.status}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleToggleStatus(story.id, story.status)}
              disabled={isPending}
              className="bg-surface text-on-surface border-2 border-on-surface px-6 py-2 font-headline font-bold uppercase transition-all hover:bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] disabled:opacity-50 text-sm"
            >
              {story.status === "PUBLISHED" ? "Pause Story" : "Publish Story"}
            </button>
            <button
              onClick={() => handleDelete(story.id)}
              disabled={isPending}
              className="bg-error text-on-error border-2 border-on-surface px-6 py-2 font-headline font-bold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] disabled:opacity-50 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
