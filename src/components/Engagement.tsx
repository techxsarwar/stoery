"use client";

import { useState, useEffect } from "react";
import { toggleLike, addComment } from "@/actions/engage";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LikeButton({ storyId, initialLiked, initialCount }: { storyId: string, initialLiked: boolean, initialCount: number }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLike = async () => {
    if (!user) {
      alert("You need to be a 'Slayer of Stars' to do that. Sign in first!");
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
      className={`flex items-center gap-2 px-8 py-3 border-2 border-on-surface uppercase rounded font-headline font-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${liked ? 'bg-primary text-on-primary' : 'bg-white text-on-surface hover:bg-surface-container'}`}
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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You need to be a 'Slayer of Stars' to do that. Sign in first!");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-4 bg-white p-6 rounded border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <textarea
        className="w-full bg-surface border-2 border-on-surface rounded p-4 text-on-surface font-body resize-none focus:outline-none focus:ring-4 focus:ring-primary/50 transition-colors"
        rows={4}
        placeholder={user ? "Share your thoughts on this chapter..." : "Sign in to leave a comment"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!user || loading}
      />
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={!user || loading || !content.trim()}
          className="bg-primary text-on-primary border-2 border-on-surface font-headline px-8 py-3 uppercase rounded font-black hover:bg-primary-container transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
