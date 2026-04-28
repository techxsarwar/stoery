"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ProfileItem {
  id: string;
  pen_name: string | null;
  username: string | null;
  avatar_url: string | null;
  isVerified: boolean;
  _count: { followers: number };
}

interface FollowersModalProps {
  penName: string;
  followerCount: number;
  followingCount: number;
}

export default function FollowersModal({
  penName,
  followerCount,
  followingCount,
}: FollowersModalProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"followers" | "following">("followers");
  const [list, setList] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(
    async (which: "followers" | "following") => {
      setLoading(true);
      setList([]);
      try {
        const res = await fetch(
          `/api/author/${encodeURIComponent(penName)}/${which}`
        );
        const data = await res.json();
        setList(Array.isArray(data) ? data : []);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    },
    [penName]
  );

  const openModal = (which: "followers" | "following") => {
    setTab(which);
    setOpen(true);
    fetchList(which);
  };

  const switchTab = (which: "followers" | "following") => {
    setTab(which);
    fetchList(which);
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Clickable stat triggers */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => openModal("followers")}
          className="flex flex-col items-center gap-1 py-2 hover:bg-primary/10 rounded transition-colors cursor-pointer group"
        >
          <span className="font-headline text-2xl sm:text-3xl md:text-4xl font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">
            {followerCount}
          </span>
          <span className="font-label text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
            Followers
          </span>
        </button>
        <button
          onClick={() => openModal("following")}
          className="flex flex-col items-center gap-1 py-2 hover:bg-primary/10 rounded transition-colors cursor-pointer group"
        >
          <span className="font-headline text-2xl sm:text-3xl md:text-4xl font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">
            {followingCount}
          </span>
          <span className="font-label text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
            Following
          </span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={tab === "followers" ? "Followers" : "Following"}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col max-h-[80vh] animate-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0 flex-shrink-0">
              <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface">
                {tab === "followers" ? "Followers" : "Following"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 border-2 border-on-surface flex items-center justify-center font-headline font-black text-lg hover:bg-primary hover:text-on-primary transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b-4 border-on-surface mt-4 flex-shrink-0">
              <button
                onClick={() => switchTab("followers")}
                className={`flex-1 py-3 font-headline font-black text-sm uppercase tracking-tighter transition-colors ${
                  tab === "followers"
                    ? "bg-primary text-on-primary border-r-2 border-on-surface"
                    : "bg-white text-on-surface-variant hover:bg-surface-container border-r-2 border-on-surface"
                }`}
              >
                Followers · {followerCount}
              </button>
              <button
                onClick={() => switchTab("following")}
                className={`flex-1 py-3 font-headline font-black text-sm uppercase tracking-tighter transition-colors ${
                  tab === "following"
                    ? "bg-primary text-on-primary"
                    : "bg-white text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                Following · {followingCount}
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 divide-y-2 divide-on-surface/10">
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              )}

              {!loading && list.length === 0 && (
                <div className="py-16 text-center">
                  <p className="font-headline font-black text-xl uppercase tracking-tighter text-on-surface-variant">
                    {tab === "followers" ? "No followers yet" : "Not following anyone"}
                  </p>
                  <p className="font-body text-sm text-on-surface-variant/60 mt-2 italic">
                    {tab === "followers"
                      ? "Be the first to follow this author!"
                      : "This author hasn't followed anyone yet."}
                  </p>
                </div>
              )}

              {!loading &&
                list.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/author/${encodeURIComponent(profile.pen_name || "")}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-colors group"
                  >
                    {/* Avatar */}
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.pen_name || ""}
                        className="w-11 h-11 rounded-full border-2 border-on-surface object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary border-2 border-on-surface flex items-center justify-center flex-shrink-0">
                        <span className="font-headline font-black text-lg text-on-primary">
                          {(profile.pen_name || "?")[0].toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline font-black text-sm uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors truncate">
                          {profile.pen_name}
                        </span>
                        {profile.isVerified && (
                          <span className="flex-shrink-0 inline-flex items-center justify-center w-4 h-4 bg-primary border border-on-surface rounded-full text-[9px] font-black text-on-surface">
                            ✓
                          </span>
                        )}
                      </div>
                      {profile.username && (
                        <span className="font-label text-xs text-on-surface-variant font-bold">
                          @{profile.username}
                        </span>
                      )}
                    </div>

                    {/* Follower count badge */}
                    <span className="flex-shrink-0 font-label text-[10px] font-black uppercase tracking-wider text-on-surface-variant border border-on-surface/20 px-2 py-0.5">
                      {profile._count.followers} followers
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
