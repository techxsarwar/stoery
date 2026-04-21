"use client";

import { useTransition, useState } from "react";
import { deleteStory, updateStoryStatus } from "@/actions/story";
import Link from "next/link";
import { Plus, Book, Trash2, Pause, Play, Edit3, MessageCircle, BarChart, Ghost } from "lucide-react";
import AnalyticsGrimoire from "./AnalyticsGrimoire";
import InteractionChamber from "./InteractionChamber";

interface DashboardClientProps {
  stories: any[];
  profile: any;
  comments: any[];
  stats: {
      totalLikes: number;
      totalComments: number;
      totalReads: number;
  }
}

export default function DashboardClient({ stories, profile, comments, stats }: DashboardClientProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteRitualId, setDeleteRitualId] = useState<string | null>(null);

  const handleToggleStatus = (storyId: string, currentStatus: string) => {
    startTransition(async () => {
      const newStatus = currentStatus === "PUBLISHED" ? "PAUSED" : "PUBLISHED";
      await updateStoryStatus(storyId, newStatus);
    });
  };

  const handleBurnRitual = (storyId: string) => {
    startTransition(async () => {
      await deleteStory(storyId);
      setDeleteRitualId(null);
    });
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-20 bg-surface/20 rounded-2xl border-2 border-on-surface/5 backdrop-blur-xl">
        <Ghost size={80} className="text-on-surface-variant mb-6 opacity-20" />
        <h3 className="font-headline font-black text-2xl text-on-surface uppercase tracking-widest text-center mb-2">The stars are silent.</h3>
        <p className="font-body text-on-surface-variant italic text-center max-w-sm">Begin your first chronicle and wake the universe from its slumber.</p>
        <Link href="/dashboard/write" className="mt-8 bg-primary text-on-primary font-headline font-black px-10 py-4 uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            Inscribe First Tale
        </Link>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-700">
      {/* Ink-Well Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 overflow-hidden">
        <div className="relative">
            <span className="absolute -left-4 top-0 w-1 h-full bg-primary/20"></span>
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none selection:bg-primary selection:text-on-primary">The Obsidian Desk</h1>
            <p className="font-label font-bold text-on-surface-variant text-sm uppercase tracking-[0.3em] mt-4 opacity-60">Architect: <span className="text-primary">{profile.pen_name || "Unknown Author"}</span></p>
        </div>
        <Link href="/dashboard/write" className="group flex items-center gap-4 bg-surface-container-high border-2 border-on-surface/10 px-8 py-4 rounded-xl hover:border-primary/50 transition-all duration-500 shadow-2xl">
            <div className="p-3 bg-primary rounded-lg shadow-inner group-hover:scale-110 transition-transform">
                <Plus size={20} className="text-on-primary" />
            </div>
            <div className="text-left">
                <p className="font-headline font-black text-lg text-on-surface uppercase tracking-tight">Quick Draft</p>
                <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest leading-none">New Chronicle</p>
            </div>
        </Link>
      </header>

      {/* Bento Grid Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-min">
        
        {/* Performance Grimoire (Top Section) */}
        <section className="lg:col-span-12">
            <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-6 flex items-center gap-4">
                <BarChart size={14} className="text-primary" />
                Performance Grimoire
            </h2>
            <AnalyticsGrimoire stories={stories} />
        </section>

        {/* Manuscript Management (Main Area) */}
        <section className="lg:col-span-8 flex flex-col gap-8">
            <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-2 flex items-center gap-4">
                <Book size={14} className="text-primary" />
                Manuscripts Management
            </h2>
            
            {stories.length === 0 ? <EmptyState /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stories.map(story => (
                        <div key={story.id} className="group bg-[#1c1b1d] border-2 border-on-surface/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 relative flex flex-col">
                            {/* Visual Indicator */}
                            <div className="h-40 relative overflow-hidden">
                                <div 
                                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${story.status === 'PAUSED' ? 'grayscale opacity-40' : ''}`}
                                    style={{ backgroundImage: `url('${story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1d] to-transparent opacity-80" />
                                
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full font-label font-black text-[8px] uppercase tracking-widest border border-white/10 backdrop-blur-md ${
                                        story.status === 'PUBLISHED' ? 'bg-primary/20 text-primary border-primary/30' : 
                                        story.status === 'PAUSED' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                                        'bg-on-surface/20 text-on-surface'
                                    }`}>
                                        {story.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow relative -mt-8">
                                <h3 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight mb-2 selection:bg-primary line-clamp-1">{story.title}</h3>
                                <p className="font-body text-xs text-on-surface-variant italic line-clamp-2 mb-6 opacity-70">
                                    {story.description || "A tale yet to be fully inscribed into the obsidian records."}
                                </p>
                                
                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-on-surface/5">
                                    <div className="flex gap-4">
                                        <Link href={`/dashboard/write?id=${story.id}`} className="p-2 hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors transition-transform active:scale-90" title="Continue Inscribing">
                                            <Edit3 size={18} />
                                        </Link>
                                        <button 
                                            onClick={() => handleToggleStatus(story.id, story.status)}
                                            className="p-2 hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors transition-transform active:scale-90" 
                                            title={story.status === 'PUBLISHED' ? 'Pause Chronicle' : 'Rise Chronicle'}
                                        >
                                            {story.status === 'PUBLISHED' ? <Pause size={18} /> : <Play size={18} />}
                                        </button>
                                        <button 
                                            onClick={() => setDeleteRitualId(story.id)}
                                            className="p-2 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors transition-transform active:scale-90" 
                                            title="Burn Ritual"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">
                                        {story._count?.likes || 0} Souls Loved
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* Interaction Chamber (Side Area) */}
        <section className="lg:col-span-4 flex flex-col gap-8">
            <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-2 flex items-center gap-4">
                <MessageCircle size={14} className="text-primary" />
                Interaction Chamber
            </h2>
            <InteractionChamber comments={comments} />
        </section>

      </div>

      {/* Delete Ritual Modal */}
      {deleteRitualId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0a0b]/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
              <div className="max-w-md w-full bg-surface-container-high border-2 border-error/20 p-10 rounded-3xl shadow-2xl text-center">
                  <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                      <Trash2 size={40} />
                  </div>
                  <h3 className="font-headline font-black text-3xl text-on-surface uppercase tracking-tight mb-4">The Final Ember</h3>
                  <p className="font-body text-on-surface-variant italic mb-10 leading-relaxed text-lg">"Are you sure you want to burn this tale forever? Once reduced to ash, no ritual can bring it back."</p>
                  
                  <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => handleBurnRitual(deleteRitualId)}
                        disabled={isPending}
                        className="bg-error text-on-error font-headline font-black py-4 uppercase tracking-tighter rounded-xl hover:bg-error/80 transition-all disabled:opacity-50"
                      >
                         Burn the Chronicle
                      </button>
                      <button 
                         onClick={() => setDeleteRitualId(null)}
                         className="font-headline font-black py-4 uppercase tracking-tighter text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                         Keep the Scroll
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
