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
    return <div className="min-h-screen flex items-center justify-center font-headline text-on-surface">Loading...</div>;
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
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto">
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-8 py-4 px-6 md:px-12">
          <Link href="/" className="text-xl font-black tracking-tighter text-[#8B5CF6] font-headline">
            STORYVERSE
          </Link>
          <div className="font-label text-sm text-on-surface-variant flex gap-4">
             <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
      </nav>

      <main className="w-full max-w-4xl flex flex-col gap-8 pb-24 mt-8">
        <h1 className="font-headline text-4xl font-bold text-on-surface mb-2">Write a New Story</h1>
        
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm font-label border border-error/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <label className="font-label text-sm text-on-surface-variant font-medium">Story Title</label>
            <input
              type="text"
              className="bg-surface border-b-2 border-outline-variant/30 text-on-surface text-2xl font-headline px-4 py-3 focus:outline-none focus:border-primary focus:bg-surface-container-highest transition-all duration-300 placeholder:text-outline-variant/70"
              placeholder="The Title of Your Masterpiece"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label text-sm text-on-surface-variant font-medium">Genre</label>
              <select
                className="bg-surface border-b-2 border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:bg-surface-container-highest transition-all duration-300 font-label"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">Select Genre</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Drama">Drama</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label text-sm text-on-surface-variant font-medium">Cover Image URL</label>
              <input
                type="text"
                className="bg-surface border-b-2 border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:bg-surface-container-highest transition-all duration-300 font-label placeholder:text-outline-variant/70"
                placeholder="https://..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label text-sm text-on-surface-variant font-medium">Short Description / Synopsis</label>
            <textarea
              className="bg-surface border-b-2 border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:bg-surface-container-highest transition-all duration-300 font-label placeholder:text-outline-variant/70 min-h-[100px]"
              placeholder="What is this story about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="font-label text-sm text-on-surface-variant font-medium">First Chapter Content</label>
            <div className="text-on-surface font-body text-lg">
                <Editor content={content} onChange={setContent} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline text-lg px-8 py-4 rounded-full hover:scale-[1.02] transition-all duration-300 glow-hover font-semibold w-max self-end disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publishing..." : "Publish First Chapter"}
          </button>
        </form>
      </main>
    </div>
  );
}
