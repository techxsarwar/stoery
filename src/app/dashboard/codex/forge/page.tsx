"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCodexEntry } from "@/actions/codex";
import { uploadCodexImage } from "@/actions/storage";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ChevronLeft, Save, Sparkles, PersonStanding, Map, Swords, ScrollText, ImagePlus, X } from "lucide-react";
import Link from "next/link";

export default function CodexForgePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Character");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { name: "Character", icon: PersonStanding, desc: "Forge a Denizen of your world" },
    { name: "Location", icon: Map, desc: "Map a region or sanctuary" },
    { name: "Artifact", icon: Swords, desc: "Craft a relic or legendary weapon" },
    { name: "Lore", icon: ScrollText, desc: "Record the ancient laws and history" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let image_url = "";
      if (coverFile) {
        const uploadData = new FormData();
        uploadData.append("file", coverFile);
        const uploadRes = await uploadCodexImage(uploadData);
        if (uploadRes.error) throw new Error(uploadRes.error);
        image_url = uploadRes.url || "";
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      if (image_url) formData.append("image_url", image_url);

      const res = await createCodexEntry(formData);
      if (res.error) throw new Error(res.error);

      router.push("/dashboard/codex");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during the forge.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden">
      <Sidebar />
      <main className="flex-grow ml-20 md:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,#e5e7eb,transparent)] custom-scrollbar">
        <Navbar user={null} /> {/* User session handled on server or via client hook if needed */}

        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-32 flex flex-col gap-12">
            <header className="flex flex-col gap-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/dashboard/codex" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-bold text-xs uppercase tracking-widest group w-fit">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to the Vault
                </Link>
                <div className="relative">
                    <span className="absolute -left-4 top-0 w-1 h-full bg-primary/30"></span>
                    <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Forge Entry</h1>
                    <p className="font-label font-bold text-on-surface-variant text-sm uppercase tracking-[0.3em] mt-4 opacity-60">Imprint your creation into the infinite parchment</p>
                </div>
            </header>

            {error && (
                <div className="bg-red-500 text-white p-6 rounded-2xl font-headline font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] animate-in zoom-in duration-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12 animate-in slide-in-from-bottom-8 duration-700">
                {/* Left Column: Visuals & Metadata */}
                <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-8 bg-white/50 backdrop-blur-md p-10 rounded-3xl border-4 border-on-surface shadow-[16px_16px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col gap-4">
                        <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface">Visual Manifestation</label>
                        {coverPreview ? (
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-4 border-on-surface shadow-xl group">
                                <img src={coverPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
                                    <button 
                                        type="button" 
                                        onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                                        className="bg-red-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative aspect-[4/5] rounded-2xl border-4 border-dashed border-on-surface/20 hover:border-primary/50 transition-colors bg-surface/30 group cursor-pointer flex flex-col items-center justify-center gap-4">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setCoverFile(file);
                                            setCoverPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                <div className="p-6 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform">
                                    <ImagePlus className="w-8 h-8 text-on-surface-variant opacity-40" />
                                </div>
                                <p className="font-label font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Imprint Visual</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface">Category</label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.name;
                                return (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setCategory(cat.name)}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-4 transition-all ${
                                            isSelected 
                                            ? "border-on-surface bg-primary text-on-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1" 
                                            : "border-on-surface/10 bg-surface/50 text-on-surface-variant hover:border-on-surface/30"
                                        }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="font-headline font-black text-[10px] uppercase tracking-tighter">{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Title & Content */}
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                        <label className="font-headline font-black text-lg uppercase tracking-tighter text-on-surface">The Title of Creation</label>
                        <input
                            type="text"
                            required
                            placeholder="Name your Denizen, Land, or Relic..."
                            className="w-full bg-white border-4 border-on-surface rounded-2xl px-8 py-6 font-headline font-black text-3xl md:text-5xl uppercase tracking-tighter placeholder:opacity-10 focus:outline-none focus:bg-primary/5 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="font-headline font-black text-lg uppercase tracking-tighter text-on-surface">The Essence (Description)</label>
                        <textarea
                            required
                            placeholder="Weave the soul of this entry. What power does it hold? What secrets are locked within?"
                            className="w-full bg-white border-4 border-on-surface rounded-3xl px-8 py-8 font-body font-medium text-xl leading-relaxed min-h-[400px] placeholder:opacity-20 focus:outline-none focus:bg-primary/5 transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] resize-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-4 bg-on-surface text-surface py-8 rounded-3xl font-headline font-black text-3xl uppercase tracking-tighter shadow-[16px_16px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none active:scale-95 transition-all disabled:opacity-50 group mt-10 overflow-hidden relative"
                    >
                        {isSubmitting ? (
                            <>
                                <Sparkles className="animate-spin w-8 h-8" />
                                Forging in Progress...
                            </>
                        ) : (
                            <>
                                <Save className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                Finalize Imprint
                            </>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-primary"></div>
                    </button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
}

