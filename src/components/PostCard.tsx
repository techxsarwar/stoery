"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import ShareButton from "@/components/ShareButton";
import { likePost } from "@/actions/feed";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image_url?: string | null;
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
  currentProfileId?: string;
  initialIsFollowing: boolean;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

/** Renders post content, turning @username into clickable yellow links */
function RenderContent({ text }: { text: string }) {
  const parts = text.split(/(@[a-zA-Z0-9_]{1,14})/g);
  return (
    <p className="font-body text-base sm:text-lg text-on-surface leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (/^@[a-zA-Z0-9_]{1,14}$/.test(part)) {
          return (
            <Link
              key={i}
              href={`/u/${part.slice(1)}`}
              className="text-primary font-black hover:underline"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export default function PostCard({
  post,
  initialIsFollowing,
  isOwnProfile,
  isLoggedIn,
}: PostCardProps) {
  const { profile, story } = post;
  const initial = (profile.pen_name || "?")[0].toUpperCase();
  const [liked, setLiked] = useState(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    if (!isLoggedIn) {
      window.location.href = "/auth/signin";
      return;
    }
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    startTransition(async () => {
      const result = await likePost(post.id);
      if (result.error) {
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      }
    });
  };

  return (
    <article className="bg-white border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 flex flex-col gap-4">
      {/* Author Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Link href={`/author/${encodeURIComponent(profile.pen_name || "")}`} className="flex-shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.pen_name || "Author"}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-4 border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary border-4 border-on-surface flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-headline font-black text-base sm:text-lg text-on-primary">{initial}</span>
              </div>
            )}
          </Link>

          {/* Name + @username + meta */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/author/${encodeURIComponent(profile.pen_name || "")}`}
                className="font-headline font-black text-sm sm:text-base text-on-surface uppercase tracking-tight hover:text-primary transition-colors"
              >
                {profile.pen_name}
              </Link>
              {profile.isVerified && (
                <span
                  title="Verified Author"
                  className="inline-flex items-center justify-center w-[18px] h-[18px] bg-primary border-2 border-on-surface rounded-full text-[10px] font-black flex-shrink-0 text-on-surface"
                >
                  ✓
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {profile.username && (
                <>
                  <Link href={`/u/${profile.username}`} className="font-label text-[10px] sm:text-xs text-primary font-black tracking-wide hover:underline">
                    @{profile.username}
                  </Link>
                  <span className="text-on-surface-variant/30">·</span>
                </>
              )}
              <span className="font-label text-[10px] sm:text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                {profile._count.followers} followers
              </span>
              <span className="text-on-surface-variant/30">·</span>
              <span className="font-label text-[10px] sm:text-xs text-on-surface-variant font-bold">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Follow Button */}
        <div className="flex-shrink-0">
          <FollowButton
            targetProfileId={profile.id}
            initialIsFollowing={initialIsFollowing}
            isOwnProfile={isOwnProfile}
            isLoggedIn={isLoggedIn}
            compact
          />
        </div>
      </div>

      {/* Post Content — @mentions rendered as links */}
      {post.content && <RenderContent text={post.content} />}

      {/* Post Image */}
      {post.image_url && (
        <div className="border-4 border-on-surface overflow-hidden">
          <img
            src={post.image_url}
            alt="Post image"
            className="w-full max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Attached Story Card */}
      {story && (
        <Link href={`/read/${story.id}`}>
          <div className="border-4 border-on-surface bg-surface-container flex gap-3 sm:gap-4 overflow-hidden hover:bg-primary-container transition-colors group">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-cover bg-center border-r-4 border-on-surface"
              style={{ backgroundImage: `url('${story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"}')` }}
            />
            <div className="flex flex-col justify-center py-2 pr-4 gap-1">
              {story.genre && (
                <span className="font-label text-[9px] font-black uppercase tracking-widest text-primary">{story.genre}</span>
              )}
              <span className="font-headline font-black text-sm sm:text-base text-on-surface uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {story.title}
              </span>
              <span className="font-label text-[10px] text-on-surface-variant font-bold">
                ★ {story._count.likes} likes · Read now →
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Footer — Like + Share + View Profile */}
      <div className="flex items-center justify-between pt-2 border-t-2 border-on-surface/10 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-on-surface font-headline font-black text-xs uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 ${
              liked ? "bg-primary text-on-surface" : "bg-white text-on-surface hover:bg-primary"
            }`}
          >
            <span className="text-sm">{liked ? "♥" : "♡"}</span>
            <span>{likeCount}</span>
          </button>

          {/* Share */}
          <ShareButton
            postId={post.id}
            authorName={profile.username || profile.pen_name}
            content={post.content}
          />
        </div>

        <Link
          href={`/author/${encodeURIComponent(profile.pen_name || "")}`}
          className="font-label text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          View Profile →
        </Link>
      </div>
    </article>
  );
}
