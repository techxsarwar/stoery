"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/actions/profile";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  targetProfileId: string;
  initialIsFollowing: boolean;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
  compact?: boolean; // Smaller size for feed cards
}

export default function FollowButton({
  targetProfileId,
  initialIsFollowing,
  isOwnProfile,
  isLoggedIn,
  compact = false,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sizeClasses = compact
    ? "px-3 py-1.5 text-[10px] sm:text-xs min-w-[80px] border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
    : "px-6 sm:px-8 py-3 text-base sm:text-lg min-w-[140px] sm:min-w-[160px] border-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

  // Own profile — show edit button
  if (isOwnProfile) {
    return (
      <a
        href="/dashboard/settings"
        className={`inline-flex items-center justify-center gap-1 bg-white text-on-surface border-on-surface font-headline font-black uppercase tracking-tighter transition-all ${sizeClasses}`}
      >
        {compact ? "✎ Edit" : "✎ Edit Profile"}
      </a>
    );
  }

  // Not logged in — redirect to sign in
  if (!isLoggedIn) {
    return (
      <a
        href="/auth/signin"
        className={`inline-flex items-center justify-center bg-on-surface text-white border-on-surface font-headline font-black uppercase tracking-tighter transition-all ${sizeClasses}`}
      >
        {compact ? "Follow" : "Sign in to Follow"}
      </a>
    );
  }

  // Follow / Unfollow toggle
  const handleClick = () => {
    setFollowing((prev) => !prev);
    startTransition(async () => {
      const result = await toggleFollow(targetProfileId);
      if (result.error) {
        setFollowing((prev) => !prev); // revert on error
      }
      router.refresh();
    });
  };

  const getLabel = () => {
    if (isPending) return "...";
    if (following && isHovering) return compact ? "Unfollow" : "UNFOLLOW";
    if (following) return compact ? "Following ✓" : "FOLLOWING ✓";
    return "FOLLOW";
  };

  const getStyles = () => {
    if (following && isHovering) return "bg-red-500 text-white border-red-700";
    if (following) return "bg-primary text-on-primary border-on-surface";
    return "bg-on-surface text-white border-on-surface";
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isPending}
      className={`inline-flex items-center justify-center font-headline font-black uppercase tracking-tighter transition-all disabled:opacity-50 ${sizeClasses} ${getStyles()}`}
    >
      {getLabel()}
    </button>
  );
}
