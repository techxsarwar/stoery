"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { createPost, deletePost } from "@/actions/feed";

interface Story { id: string; title: string; }
interface RecentPost {
  id: string;
  content: string;
  createdAt: Date;
  story: { id: string; title: string } | null;
}
interface MentionProfile {
  username: string | null;
  pen_name: string | null;
  avatar_url: string | null;
  isVerified: boolean;
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function CreatePostBox({
  stories,
  recentPosts,
}: {
  stories: Story[];
  recentPosts: RecentPost[];
}) {
  const [content, setContent] = useState("");
  const [selectedStory, setSelectedStory] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; msg: string }>({
    type: "idle", msg: "",
  });

  // Mention autocomplete state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionResults, setMentionResults] = useState<MentionProfile[]>([]);
  const [mentionPos, setMentionPos] = useState(0); // caret position where @ was typed
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMentions = useCallback(async (q: string) => {
    if (!q) { setMentionResults([]); return; }
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setMentionResults(data);
    } catch {
      setMentionResults([]);
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);

    const caret = e.target.selectionStart ?? val.length;
    // Find if we're currently inside an @mention being typed
    const textBeforeCaret = val.slice(0, caret);
    const mentionMatch = textBeforeCaret.match(/@([a-zA-Z0-9_]{0,14})$/);

    if (mentionMatch) {
      const q = mentionMatch[1];
      setMentionQuery(q);
      setMentionPos(caret - mentionMatch[0].length);
      if (mentionTimerRef.current) clearTimeout(mentionTimerRef.current);
      mentionTimerRef.current = setTimeout(() => fetchMentions(q), 200);
    } else {
      setMentionQuery(null);
      setMentionResults([]);
    }
  };

  const insertMention = (username: string) => {
    const before = content.slice(0, mentionPos);
    const after = content.slice(textareaRef.current?.selectionStart ?? content.length);
    const newContent = `${before}@${username} ${after}`;
    setContent(newContent);
    setMentionQuery(null);
    setMentionResults([]);
    textareaRef.current?.focus();
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    startTransition(async () => {
      const res = await createPost(content, selectedStory || undefined);
      if (res.error) {
        setStatus({ type: "error", msg: res.error });
      } else {
        setStatus({ type: "success", msg: "Post published to the feed!" });
        setContent("");
        setSelectedStory("");
        setTimeout(() => setStatus({ type: "idle", msg: "" }), 3000);
      }
    });
  };

  const handleDelete = (postId: string) => {
    startTransition(async () => { await deletePost(postId); });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Composer */}
      <form
        onSubmit={handlePost}
        className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-7 flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-primary border-2 border-on-surface flex-shrink-0" />
          <h3 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tighter text-on-surface">
            What's New?
          </h3>
        </div>

        {status.type !== "idle" && (
          <div className={`border-4 border-on-surface px-4 py-3 font-headline font-bold text-sm uppercase tracking-tight ${
            status.type === "error" ? "bg-red-500 text-white" : "bg-primary text-on-surface"
          }`}>
            {status.msg}
          </div>
        )}

        {/* Textarea + mention dropdown wrapper */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            maxLength={500}
            rows={3}
            placeholder="Announce your new chapter, share a thought… use @username to mention someone!"
            className="w-full border-4 border-on-surface px-4 py-3 font-body text-base text-on-surface bg-surface focus:outline-none focus:bg-primary-container transition-colors resize-none"
          />

          {/* Mention dropdown */}
          {mentionQuery !== null && mentionResults.length > 0 && (
            <div className="absolute left-0 top-full mt-1 z-50 bg-white border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-xs flex flex-col overflow-hidden">
              {mentionResults.map((profile) => (
                <button
                  key={profile.username}
                  type="button"
                  onClick={() => insertMention(profile.username!)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary hover:text-on-surface transition-colors border-b border-on-surface/10 last:border-0 text-left"
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} className="w-7 h-7 rounded-full border-2 border-on-surface object-cover flex-shrink-0" alt="" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary border-2 border-on-surface flex items-center justify-center flex-shrink-0">
                      <span className="font-headline font-black text-xs text-on-primary">
                        {(profile.pen_name || "?")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline font-black text-xs uppercase truncate text-on-surface">
                      {profile.pen_name}
                      {profile.isVerified && (
                        <span className="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 bg-primary border border-on-surface rounded-full text-[8px] font-black text-on-surface align-middle">✓</span>
                      )}
                    </span>
                    <span className="font-label text-[10px] text-primary font-bold">@{profile.username}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {stories.length > 0 && (
              <select
                value={selectedStory}
                onChange={(e) => setSelectedStory(e.target.value)}
                className="border-4 border-on-surface bg-white px-3 py-2 font-label font-bold text-sm text-on-surface uppercase focus:outline-none focus:bg-primary-container cursor-pointer"
              >
                <option value="">📎 Attach a story (optional)</option>
                {stories.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            )}
            <span className={`font-label font-bold text-xs self-center ${content.length > 450 ? "text-red-500" : "text-on-surface-variant"}`}>
              {content.length}/500
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="w-full sm:w-auto bg-primary text-on-primary border-4 border-on-surface px-8 py-3 font-headline font-black uppercase tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full" />
                Posting...
              </>
            ) : "Publish Post"}
          </button>
        </div>
      </form>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-label font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant opacity-60">
            Your recent posts
          </h4>
          {recentPosts.map((post) => (
            <div key={post.id} className="bg-white border-4 border-on-surface/30 p-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="font-body text-sm text-on-surface line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {post.story && (
                    <span className="font-label text-[10px] font-black uppercase tracking-wider text-primary">
                      📎 {post.story.title}
                    </span>
                  )}
                  <span className="font-label text-[10px] text-on-surface-variant font-bold">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                disabled={isPending}
                className="flex-shrink-0 text-on-surface-variant hover:text-red-500 font-label font-black text-[10px] uppercase tracking-widest transition-colors border-2 border-on-surface/20 hover:border-red-500 px-3 py-1.5 self-start sm:self-auto"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
