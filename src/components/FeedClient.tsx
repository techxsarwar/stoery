"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";

type Post = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  isLikedByMe: boolean;
  profile: {
    id: string;
    pen_name: string | null;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    isVerified: boolean;
    _count: { followers: number };
  };
  story: {
    id: string;
    title: string;
    genre: string | null;
    cover_url: string | null;
    _count: { likes: number };
  } | null;
};

interface FeedClientProps {
  allPosts: Post[];
  followingPosts: Post[];
  currentProfileId?: string;
  followingIds: string[];
  isLoggedIn: boolean;
}

export default function FeedClient({
  allPosts,
  followingPosts,
  currentProfileId,
  followingIds,
  isLoggedIn,
}: FeedClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");

  const posts = activeTab === "all" ? allPosts : followingPosts;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Tab switcher */}
      <div className="flex border-4 border-on-surface overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
        {(["all", "following"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 sm:px-8 py-3 sm:py-4 font-headline font-black text-xs sm:text-sm uppercase tracking-widest transition-all ${
              activeTab === tab
                ? "bg-on-surface text-primary"
                : "bg-white text-on-surface hover:bg-surface-container"
            } ${tab === "all" ? "border-r-4 border-on-surface" : ""}`}
          >
            {tab === "all" ? "🌍 All Authors" : "✨ Following"}
          </button>
        ))}
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="bg-white border-4 border-dashed border-on-surface/30 p-10 sm:p-16 flex flex-col items-center gap-4 text-center">
          <span className="text-4xl sm:text-5xl">
            {activeTab === "following" ? "💫" : "📢"}
          </span>
          <p className="font-headline font-black text-lg sm:text-2xl text-on-surface uppercase tracking-tighter">
            {activeTab === "following"
              ? isLoggedIn
                ? "No posts from authors you follow yet."
                : "Sign in to see posts from authors you follow."
              : "No posts yet. Be the first!"}
          </p>
          <p className="font-body text-sm sm:text-base text-on-surface-variant italic">
            {activeTab === "following" && isLoggedIn
              ? "Follow some authors and their updates will appear here."
              : activeTab === "all"
              ? "Authors can post updates from their dashboard."
              : ""}
          </p>
          {activeTab === "following" && !isLoggedIn && (
            <a
              href="/auth/signin"
              className="mt-2 bg-on-surface text-white border-4 border-on-surface px-8 py-3 font-headline font-black text-sm uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Sign In
            </a>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          {posts.map((post) => {
            const isOwn = post.profile.id === currentProfileId;
            const isFollowing = followingIds.includes(post.profile.id);

            return (
              <PostCard
                key={post.id}
                post={post}
                currentProfileId={currentProfileId}
                initialIsFollowing={isFollowing}
                isOwnProfile={isOwn}
                isLoggedIn={isLoggedIn}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
