"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ storyId }: { storyId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, rating, title, content })
      });
      
      if (res.ok) {
        setRating(0);
        setContent("");
        setTitle("");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-surface p-6 border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h4 className="font-headline font-black text-xl uppercase tracking-widest text-on-surface">Write a Narrative Review</h4>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              size={28}
              className={`${(hoverRating || rating) >= star ? "fill-primary text-primary" : "text-on-surface/30"}`}
            />
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Review Title (Optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-white border-2 border-on-surface p-3 font-headline font-bold outline-none focus:border-primary placeholder:text-on-surface/40"
      />

      <textarea
        placeholder="Share your in-depth thoughts on this chronicle..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        className="w-full bg-white border-2 border-on-surface p-3 font-body outline-none focus:border-primary placeholder:text-on-surface/40 resize-none custom-scrollbar"
      />

      <button 
        type="submit" 
        disabled={isSubmitting || rating === 0 || !content.trim()}
        className="self-end bg-primary text-on-primary font-headline font-black px-6 py-2 uppercase tracking-widest border-2 border-on-surface hover:translate-y-[2px] transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Publishing..." : "Publish Review"}
      </button>
    </form>
  );
}
