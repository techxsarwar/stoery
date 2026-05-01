"use client";

import { useState } from "react";
import { Sparkles, BrainCircuit } from "lucide-react";

export default function TheForge() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "forge",
                    text: prompt
                })
            });
            const data = await res.json();
            if (data.text) {
                setResult(data.text);
            } else {
                setResult("Error connecting to SOUL.");
            }
        } catch (err) {
            setResult("Connection severed.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-surface-container-high border-2 border-on-surface/10 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-6">
            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter flex items-center gap-3">
                <BrainCircuit className="text-primary" size={24} /> The Forge
            </h3>
            <p className="text-sm font-body italic text-on-surface-variant">Invoke SOUL to craft lore, character sheets, or worldbuilding elements for your codex.</p>
            
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe the character, faction, or artifact you want to forge..."
                    className="w-full bg-surface border border-on-surface/20 p-4 rounded-xl font-body text-sm outline-none focus:border-primary min-h-[120px] text-on-surface"
                />
                <button type="submit" disabled={loading || !prompt.trim()} className="bg-primary text-on-primary font-headline font-black py-4 uppercase tracking-tighter rounded-xl border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:translate-x-0 disabled:translate-y-0">
                    {loading ? <Sparkles className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    {loading ? "Forging..." : "Ignite the Forge"}
                </button>
            </form>

            {result && (
                <div className="mt-4 bg-surface p-6 border-2 border-on-surface/20 rounded-xl relative">
                    <pre className="font-body text-sm whitespace-pre-wrap text-on-surface">{result}</pre>
                </div>
            )}
        </div>
    );
}
