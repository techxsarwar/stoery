"use client";

import Link from "next/link";
import FollowButton from "@/components/FollowButton";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    profile: {
      id: string;
      pen_name: string | null;
      full_name: string | null;
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

export default function PostCard({
  post,
  initialIsFollowing,
  isOwnProfile,
  isLoggedIn,
}: PostCardProps) {
  const { profile, story } = post;
  const initial = (profile.pen_name || "?")[0].toUpperCase();

  return (
    <article className="bg-white border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 flex flex-col gap-4 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
                <span className="font-headline font-black text-base sm:text-lg text-on-primary">
                  {initial}
                </span>
              </div>
            )}
          </Link>

          {/* Name + meta */}
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
                  className="inline-flex items-center justify-center w-4 h-4 bg-blue-500 text-white rounded-full text-[9px] font-black flex-shrink-0"
                >
                  ✓
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
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

        {/* Follow Button - compact */}
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

      {/* Post Content */}
      <p className="font-body text-base sm:text-lg text-on-surface leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Attached Story Card */}
      {story && (
        <Link href={`/read/${story.id}`}>
          <div className="border-4 border-on-surface bg-surface-container flex gap-3 sm:gap-4 overflow-hidden hover:bg-primary-container transition-colors group">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-cover bg-center border-r-4 border-on-surface"
              style={{
                backgroundImage: `url('${story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"}')`,
              }}
            />
            <div className="flex flex-col justify-center py-2 pr-4 gap-1">
              {story.genre && (
                <span className="font-label text-[9px] font-black uppercase tracking-widest text-primary">
                  {story.genre}
                </span>
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t-2 border-on-surface/10">
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
