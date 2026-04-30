"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function EmbedTestPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate embedding");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-4 md:px-12 w-full mx-auto pb-32">
      <Navbar user={null} />

      <main className="w-full max-w-4xl flex flex-col gap-8 mt-8">
        <header className="border-b-4 border-primary pb-6">
          <h1 className="font-headline text-4xl md:text-5xl font-black text-on-surface uppercase tracking-tighter">
            The Resonance Matrix
          </h1>
          <p className="font-label font-bold text-on-surface-variant text-sm uppercase tracking-widest mt-2">
            Test your Story's Semantic Vibe Sync
          </p>
        </header>

        <form onSubmit={handleTest} className="flex flex-col gap-4 bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <label className="font-headline font-black text-xl uppercase tracking-tighter">
            Enter text or story synopsis:
          </label>
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 border-4 border-on-surface/20 p-4 font-body text-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="Summon the essence of this chronicle..."
          />
          
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary font-headline font-black text-xl py-4 uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? "Aligning Frequencies..." : "Map Story Resonance"}
          </button>
          
          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 mt-2">
            <p className="font-label font-bold text-amber-700 text-[10px] uppercase tracking-widest leading-relaxed">
              <strong>Note:</strong> By utilizing the Resonance Matrix, your inputs are processed to enhance our platform's Discovery Algorithm and overall services. Please do not upload personal, confidential, or otherwise sensitive real-world information. This tool is strictly for fictional world-building and narrative mapping.
            </p>
          </div>
        </form>

        {error && (
          <div className="bg-error/10 border-4 border-error p-6 font-headline font-black text-error uppercase tracking-widest">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-6 bg-surface-container-high p-8 border-4 border-emerald-500 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.2)] animate-in slide-in-from-bottom-4">
            <header className="flex flex-col gap-2 border-b-2 border-emerald-500/20 pb-4">
                <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-emerald-500 flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                    Resonance Successfully Mapped
                </h2>
                <p className="font-label font-bold uppercase tracking-widest text-on-surface-variant text-xs">
                    Powered by the SOULPAD Resonance Matrix
                </p>
            </header>

            <div className="flex flex-col gap-4">
                <p className="font-body text-lg text-on-surface leading-relaxed">
                    The atmosphere, prose style, and hidden meanings of your story have been mathematically analyzed and permanently synced to the <strong>SOULPAD Discovery Engine</strong>.
                </p>
                <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4">
                    <p className="font-label font-bold text-emerald-700 text-sm uppercase tracking-widest leading-loose">
                        ✨ What happens next?<br/>
                        Our algorithm will now automatically recommend this story to readers who have enjoyed similar pacing, tension, and emotional depth in the past—even if they never search for your exact genre.
                    </p>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
