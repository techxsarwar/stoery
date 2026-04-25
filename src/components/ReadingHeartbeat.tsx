"use client";

import { useEffect, useRef, useState } from "react";
import { recordReadingTime } from "@/actions/reading";

/**
 * Hidden component that monitors user activity and sends heartbeat pulses
 * to record reading time. Includes multiple layers of bot protection.
 */
export default function ReadingHeartbeat({ storyId }: { storyId: string }) {
  const [isActive, setIsActive] = useState(true);
  const lastActivityTime = useRef(Date.now());
  const heartbeatInterval = 30000; // 30 seconds
  const idleThreshold = 180000;    // 3 minutes

  useEffect(() => {
    // 1. Activity Detection: Updates the last active timestamp
    const handleActivity = () => {
      lastActivityTime.current = Date.now();
      if (!isActive) setIsActive(true);
    };

    // 2. Tab Visibility: Pauses tracking when the user switches tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsActive(false);
      } else {
        setIsActive(true);
        lastActivityTime.current = Date.now();
      }
    };

    // Event Listeners
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. The Pulse: Sends the duration to the server
    const interval = setInterval(async () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime.current;

      // Bot Protection Logic:
      // - Page must be visible (document.visibilityState)
      // - User must have moved/interacted in the last 3 minutes (idleThreshold)
      if (isActive && timeSinceLastActivity < idleThreshold) {
        try {
          await recordReadingTime(storyId, Math.floor(heartbeatInterval / 1000));
        } catch (e) {
          console.warn("Heartbeat pulse failed to resonate.");
        }
      }
    }, heartbeatInterval);

    // Cleanup listeners and interval on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [storyId, isActive]);

  return null; // This component has no visual presence
}
