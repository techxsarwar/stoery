"use client";

import { useState } from "react";

interface ShareButtonProps {
  postId: string;
  authorName: string | null;
  content: string;
}

export default function ShareButton({ postId, authorName, content }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/post/${postId}`
      : `/post/${postId}`;

  const shortContent = content.length > 100 ? content.slice(0, 97) + "..." : content;
  const xText = encodeURIComponent(`"${shortContent}"\n\n— @${authorName} on SOULPAD\n${postUrl}`);
  const waText = encodeURIComponent(`"${shortContent}"\n\n— ${authorName} on SOULPAD\n${postUrl}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-4 py-2 border-2 border-on-surface bg-white font-headline font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-on-surface"
        title="Share this post"
      >
        <span>⤴</span>
        <span>Share</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="absolute bottom-full right-0 mb-2 z-50 bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-72 p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2 border-b-2 border-on-surface/10 pb-3">
              <div className="w-1.5 h-6 bg-primary border border-on-surface flex-shrink-0" />
              <span className="font-headline font-black text-sm uppercase tracking-tighter text-on-surface">
                Share This Post
              </span>
            </div>

            {/* URL preview */}
            <div className="bg-surface border-2 border-on-surface/20 px-3 py-2 flex items-center gap-2">
              <span className="font-label text-[10px] font-bold text-on-surface-variant truncate flex-1">
                {postUrl}
              </span>
            </div>

            {/* Copy link */}
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 border-4 border-on-surface px-4 py-3 font-headline font-black text-sm uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${
                copied ? "bg-primary text-on-surface" : "bg-on-surface text-white"
              }`}
            >
              {copied ? "✓ Copied!" : "⎘ Copy Link"}
            </button>

            {/* Social share */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${xText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-on-surface bg-black text-white px-3 py-2.5 font-headline font-black text-xs uppercase tracking-tight shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                𝕏 Post
              </a>
              <a
                href={`https://wa.me/?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-on-surface bg-[#25D366] text-white px-3 py-2.5 font-headline font-black text-xs uppercase tracking-tight shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
