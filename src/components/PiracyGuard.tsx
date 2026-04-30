"use client";

import React, { useEffect, useState, useRef } from "react";

interface PiracyGuardProps {
  children: React.ReactNode;
}

/**
 * PiracyGuard: A comprehensive component to protect intellectual property
 * by disabling copying, right-clicking, and common piracy keyboard shortcuts.
 * It also implements a "Blur-on-Blur" feature to deter screenshots.
 */
export default function PiracyGuard({ children }: PiracyGuardProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const warningTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarning();
    };

    // 2. Disable Key Shortcuts (Ctrl+C, Ctrl+U, F12, Ctrl+S, Ctrl+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Block common piracy keys
      if (
        (isCtrl && (e.key === "c" || e.key === "u" || e.key === "s" || e.key === "p" || e.key === "a")) ||
        e.key === "F12" ||
        (isCtrl && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        triggerWarning();
      }
    };

    // 3. Screen Obfuscation on Focus Loss (Anti-Screenshot/Recording)
    const handleBlur = () => {
      setIsBlurred(true);
      setShowWarning(true);
    };
    const handleFocus = () => {
      setIsBlurred(false);
      setShowWarning(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleBlur();
      } else {
        handleFocus();
      }
    };

    // 4. Print Protection
    const beforePrint = () => {
      setIsBlurred(true);
    };
    const afterPrint = () => {
      setIsBlurred(false);
    }

    // 5. Mobile Protection (Touch detection)
    const handleTouchStart = (e: TouchEvent) => {
        // Many screenshots involve multiple fingers or specific button combos
        // While we can't block hardware buttons, we can react to sudden loss of touch
        if (e.touches.length > 2) {
            triggerWarning();
        }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleBlur);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleBlur);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const triggerWarning = () => {
    setShowWarning(true);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setShowWarning(false), 3000);
  };

  return (
    <div
      className={`relative transition-all duration-300 select-none ${isBlurred ? "blur-xl grayscale opacity-50" : ""}`}
      style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none", userSelect: "none" }}
    >
      {/* Visual Overlay when blurred */}
      {isBlurred && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md pointer-events-none">
          <div className="bg-primary text-on-primary px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-headline font-black uppercase text-2xl animate-pulse">
            Content Protected
          </div>
        </div>
      )}

      {/* Floating Warning Message */}
      {showWarning && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[10000] bg-error text-on-error px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-label font-bold uppercase tracking-widest text-sm animate-bounce">
          Copyright Protection Active
        </div>
      )}

      {/* Print-only warning */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-20 text-center">
        <h1 className="text-4xl font-black uppercase">Unauthorized Print Attempt</h1>
        <p className="mt-4">This document is protected by SOULPAD Piracy Guard. Printing is disabled to protect intellectual property.</p>
      </div>

      <div className="print:hidden">
        {children}
      </div>
    </div>
  );
}
