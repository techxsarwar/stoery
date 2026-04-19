"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import { createStory } from "@/actions/story";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function WritePage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/signin");
    },
  });

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center font-headline font-bold text-on-surface uppercase tracking-wide text-xl">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("coverImage", coverImage);
    formData.append("content", content);

    const res = await createStory(formData);

    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm flex items-center justify-between px-8 py-4 px-6 md:px-12">
          <Link href="/" className="text-xl font-black tracking-tighter text-on-surface font-headline uppercase">
            STORYVERSE
          </Link>
          <div className="font-headline font-bold text-sm text-on-surface flex gap-4 uppercase tracking-wide">
             <Link href="/dashboard" className="px-4 py-2 border-2 border-transparent hover:border-on-surface transition-all duration-300 rounded">Dashboard</Link>
          </div>
      </nav>

      <main className="w-full max-w-4xl flex flex-col gap-8 pb-24 mt-8 relative z-10">
        <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface mb-2 uppercase tracking-tighter">Write a New Story</h1>
        
        {error && (
          <div className="bg-error font-headline font-bold text-on-error p-4 rounded-lg text-sm border-2 border-on-surface">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full bg-white p-8 rounded-lg border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-2">
            <label className="font-headline font-bold text-sm text-on-surface uppercase tracking-wide">Story Title</label>
            <input
              type="text"
              className="bg-surface border-2 border-on-surface text-on-surface text-2xl font-headline px-4 py-3 rounded focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 placeholder:text-outline-variant"
              placeholder="The Title of Your Masterpiece"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-headline font-bold text-sm text-on-surface uppercase tracking-wide">Genre</label>
              <select
                className="bg-surface border-2 border-on-surface text-on-surface px-4 py-3 rounded focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 font-label font-bold"
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
            <div className="flex flex-col gap-2">
              <label className="font-headline font-bold text-sm text-on-surface uppercase tracking-wide">Cover Image URL</label>
              <input
                type="text"
                className="bg-surface border-2 border-on-surface text-on-surface px-4 py-3 rounded focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 font-label placeholder:text-outline-variant"
                placeholder="https://..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-headline font-bold text-sm text-on-surface uppercase tracking-wide">Short Description / Synopsis</label>
            <textarea
              className="bg-surface border-2 border-on-surface text-on-surface px-4 py-3 rounded focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 font-body placeholder:text-outline-variant min-h-[100px] resize-y"
              placeholder="What is this story about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="font-headline font-bold text-sm text-on-surface uppercase tracking-wide">First Chapter Content</label>
            <div className="text-on-surface font-body text-lg">
                <Editor content={content} onChange={setContent} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 bg-primary text-on-primary border-2 border-on-surface font-headline text-xl px-10 py-4 rounded hover:bg-primary-container transition-all duration-300 glow-hover font-black w-max self-end disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isSubmitting ? "Publishing..." : "Publish First Chapter"}
          </button>
        </form>
      </main>
    </div>
  );
}
