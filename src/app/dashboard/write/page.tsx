"use client";

import { useState, useEffect, useTransition } from "react";
import Editor from "@/components/Editor";
import { createStory, getStory } from "@/actions/story";
import { uploadStoryCover } from "@/actions/storage";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";

export default function WritePage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const storyId = searchParams.get("id");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
        
        if (storyId) {
            const res = await getStory(storyId);
            if (res.success && res.story) {
                setTitle(res.story.title);
                setDescription(res.story.description || "");
                setGenre(res.story.genre || "");
                setCoverImage(res.story.cover_url || "");
                setCoverPreview(res.story.cover_url || "");
                if (res.story.chapters && res.story.chapters[0]) {
                    setContent(res.story.chapters[0].content);
                }
            } else {
                setError(res.error || "Failed to load the chronicle.");
            }
        }
        
        setLoading(false);
      } else {
        router.push("/auth/signin");
      }
    });
  }, [router, storyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSaving(true);
    setError("");

    let finalCoverUrl = coverImage;

    if (coverFile) {
      const uploadData = new FormData();
      uploadData.append("file", coverFile);
      const uploadRes = await uploadStoryCover(uploadData);
      
      if (uploadRes.error) {
        setError(uploadRes.error);
        setIsSubmitting(false);
        setIsSaving(false);
        return;
      }
      
      finalCoverUrl = uploadRes.url || "";
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("coverImage", finalCoverUrl);
    formData.append("content", content);
    if (storyId) formData.append("storyId", storyId);

    const res = await createStory(formData);

    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
      setIsSaving(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#131315] flex flex-col items-center justify-center font-headline font-black text-on-surface uppercase tracking-[0.5em] animate-pulse">
            Ink is Flowing...
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131315] flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#1c1b1d,transparent)] -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      <Navbar user={user ?? null} />

      <main className="w-full max-w-5xl flex flex-col gap-12 pb-32 mt-8 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-on-surface/5 pb-8 gap-6">
            <div className="relative">
                <span className="absolute -left-4 top-0 w-1 h-full bg-primary/20"></span>
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface uppercase tracking-tighter selection:bg-primary">
                    {storyId ? "Refine Mastery" : "Begin Chronicle"}
                </h1>
                <p className="font-label font-bold text-on-surface-variant text-[10px] uppercase tracking-[0.4em] mt-4 opacity-50">Transcription of the Unspoken Universe</p>
            </div>
            <Link href="/dashboard" className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                Return to Desk
            </Link>
        </header>
        
        {error && (
          <div className="bg-error/10 border-2 border-error/20 font-headline font-black text-error p-6 rounded-2xl text-sm uppercase tracking-widest animate-in fade-in zoom-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Metadata Section - Left */}
          <div className="lg:col-span-4 flex flex-col gap-8 bg-surface/40 backdrop-blur-md p-8 rounded-2xl border-2 border-on-surface/5 shadow-2xl">
              <div className="flex flex-col gap-2">
                <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Story Title</label>
                <input
                  type="text"
                  className="bg-transparent border-b-2 border-on-surface/10 text-on-surface text-xl font-headline font-black py-2 focus:outline-none focus:border-primary transition-all placeholder:opacity-20"
                  placeholder="Masterpiece Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Genre</label>
                <select
                  className="bg-surface-container-high border-2 border-on-surface/5 text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-all font-label font-bold text-xs uppercase tracking-widest"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  <option value="">Select Genre</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Drama">Drama</option>
                  <option value="Romance">Romance</option>
                  <option value="Thriller">Thriller</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Tale Visual (Cover)</label>
                {coverPreview ? (
                    <div className="relative group aspect-[2/3] w-full bg-surface-container-high rounded-xl overflow-hidden border-2 border-on-surface/10">
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button 
                                type="button" 
                                onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                                className="bg-error text-on-error px-4 py-2 font-headline font-black text-[10px] uppercase tracking-widest shadow-2xl"
                            >
                                Vaporize
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative aspect-[2/3] w-full border-2 border-dashed border-on-surface/10 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors group cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
                            }}
                        />
                        <div className="p-4 bg-surface rounded-full group-hover:scale-110 transition-transform">
                            <Plus className="text-on-surface-variant opacity-20" />
                        </div>
                        <p className="font-label font-bold text-[8px] uppercase tracking-widest text-on-surface-variant opacity-40">Choose Visual Scroll</p>
                    </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Synopsis</label>
                <textarea
                  className="bg-surface-container-high border-2 border-on-surface/5 text-on-surface p-4 rounded-lg focus:outline-none focus:border-primary transition-all font-body text-sm italic min-h-[120px] resize-none"
                  placeholder="Summon the essence of this chronicle..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
          </div>

          {/* Editor Section - Right */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <header className="flex justify-between items-center px-2">
                <div className="flex items-center gap-4">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span>
                    <h2 className="font-headline font-black text-on-surface text-sm uppercase tracking-[0.2em]">The Infinite Parchment</h2>
                </div>
            </header>
            
            <div className="shadow-2xl">
                <Editor content={content} onChange={setContent} isSaving={isSaving} />
            </div>

            <div className="flex justify-end pt-8">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-on-primary font-headline font-black text-lg px-12 py-5 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 uppercase tracking-tighter"
                >
                    {isSubmitting ? "Syncing Universe..." : (storyId ? "Commit Changes" : "Forge Chronicle")}
                </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function Plus({ className, size = 24 }: { className?: string; size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    );
}
