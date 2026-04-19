"use client";

import { useState } from "react";
import { toggleLike, addComment } from "@/actions/engage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LikeButton({ storyId, initialLiked, initialCount }: { storyId: string, initialLiked: boolean, initialCount: number }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLike = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    
    setLoading(true);
    const prevLiked = liked;
    setLiked(!prevLiked);
    setCount(c => prevLiked ? c - 1 : c + 1);

    const res = await toggleLike(storyId);
    if (!res.success) {
      setLiked(prevLiked);
      setCount(c => prevLiked ? c + 1 : c - 1);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-2 rounded-full font-headline font-bold transition-all duration-300 ${liked ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
      {count} Likes
    </button>
  );
}

export function CommentForm({ storyId }: { storyId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!content.trim()) return;
    
    setLoading(true);
    const res = await addComment(storyId, content);
    if (res.success) {
      setContent("");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-8">
      <textarea
        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 text-on-surface font-body resize-none focus:outline-none focus:border-primary transition-colors"
        rows={4}
        placeholder={session ? "Share your thoughts on this chapter..." : "Sign in to leave a comment"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!session || loading}
      />
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={!session || loading || !content.trim()}
          className="bg-primary text-on-primary font-headline px-6 py-2 rounded-full font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
