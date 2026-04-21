"use client";

import { Users, Zap, Globe2, BarChart3, TrendingUp } from "lucide-react";

interface AnalyticsProps {
  stories: any[];
}

export default function AnalyticsGrimoire({ stories }: AnalyticsProps) {
  const totalReads = stories.reduce((sum, story) => sum + (story.reads || 0), 0);
  const totalLikes = stories.reduce((sum, story) => sum + (story._count?.likes || 0), 0);
  const engagementRate = totalReads > 0 ? ((totalLikes / totalReads) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {/* Reads Section */}
      <div className="bg-surface/40 backdrop-blur-md p-8 rounded-2xl border-2 border-on-surface/5 shadow-xl flex flex-col gap-4 group hover:bg-primary/5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-on-surface-variant opacity-60">
                <Users size={20} />
                <span className="font-label font-bold text-[10px] uppercase tracking-[0.3em]">Total Souls Reached</span>
            </div>
            <BarChart3 className="text-primary/20" size={16} />
          </div>
          <div className="font-headline font-black text-5xl text-on-surface uppercase tracking-tighter">
              {totalReads}
          </div>
          <div className="mt-auto pt-4 border-t border-on-surface/5">
             <p className="font-body text-xs text-on-surface-variant italic opacity-40">Readers who have traversed your worlds.</p>
          </div>
      </div>

      {/* Engagement Section */}
      <div className="bg-surface/40 backdrop-blur-md p-8 rounded-2xl border-2 border-on-surface/5 shadow-xl flex flex-col gap-4 group hover:bg-primary/5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-on-surface-variant opacity-60">
                <Zap size={20} />
                <span className="font-label font-bold text-[10px] uppercase tracking-[0.3em]">Engagement Essence</span>
            </div>
            <TrendingUp className="text-emerald-500/20" size={16} />
          </div>
          <div className="font-headline font-black text-5xl text-on-surface uppercase tracking-tighter">
              {engagementRate}%
          </div>
          <div className="mt-auto pt-4 border-t border-on-surface/5">
             <p className="font-body text-xs text-on-surface-variant italic opacity-40">The potency of your narrative resonance.</p>
          </div>
      </div>

      {/* Geography Section */}
      <div className="bg-surface/40 backdrop-blur-md p-8 rounded-2xl border-2 border-on-surface/5 shadow-xl flex flex-col gap-4 group hover:bg-primary/5 transition-all overflow-hidden relative">
          <Globe2 className="absolute -right-4 -bottom-4 opacity-5 text-primary" size={120} />
          <div className="flex items-center gap-3 text-on-surface-variant opacity-60">
              <Globe2 size={20} />
              <span className="font-label font-bold text-[10px] uppercase tracking-[0.3em]">Soul Geography</span>
          </div>
          <div className="flex flex-col gap-2 relative z-10">
              {[
                { r: "Northern Realms", c: "42%" },
                { r: "The Outlands", c: "28%" },
                { r: "Sky Citadels", c: "15%" }
              ].map(loc => (
                  <div key={loc.r} className="flex justify-between items-center bg-black/20 p-2 rounded border border-on-surface/5 backdrop-blur-sm">
                      <span className="font-label font-black text-[9px] uppercase tracking-widest text-on-surface-variant">{loc.r}</span>
                      <span className="font-headline font-bold text-xs text-primary">{loc.c}</span>
                  </div>
              ))}
          </div>
          <div className="mt-auto pt-2 border-t border-on-surface/5 relative z-10">
             <p className="font-body text-[10px] text-on-surface-variant italic opacity-40">Global influence scrying complete.</p>
          </div>
      </div>
    </div>
  );
}
