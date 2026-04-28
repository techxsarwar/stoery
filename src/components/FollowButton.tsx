"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/actions/profile";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  targetProfileId: string;
  initialIsFollowing: boolean;
  isOwnProfile: boolean;
}

export default function FollowButton({
  targetProfileId,
  initialIsFollowing,
  isOwnProfile,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (isOwnProfile) {
    return (
      <a
        href="/dashboard/settings"
        className="inline-flex items-center gap-2 bg-white text-on-surface border-4 border-on-surface px-8 py-3 font-headline font-black text-lg uppercase tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        ✎ Edit Profile
      </a>
    );
  }

  const handleClick = () => {
    setFollowing(!following);
    startTransition(async () => {
      const result = await toggleFollow(targetProfileId);
      if (result.error) {
        setFollowing(following); // revert on error
      }
      router.refresh();
    });
  };

  const getLabel = () => {
    if (isPending) return "...";
    if (following && isHovering) return "UNFOLLOW";
    if (following) return "FOLLOWING";
    return "FOLLOW";
  };

  const getStyles = () => {
    if (following && isHovering) {
      return "bg-red-500 text-white border-red-700";
    }
    if (following) {
      return "bg-primary text-on-primary border-on-surface";
    }
    return "bg-on-surface text-white border-on-surface";
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isPending}
      className={`inline-flex items-center justify-center min-w-[160px] px-8 py-3 font-headline font-black text-lg uppercase tracking-tighter border-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 ${getStyles()}`}
    >
      {getLabel()}
    </button>
  );
}
