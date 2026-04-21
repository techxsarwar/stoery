"use client";

import { BarChart3, TrendingUp, Users, Globe } from "lucide-react";

interface AnalyticsProps {
  stories: any[];
}

export default function AnalyticsGrimoire({ stories }: AnalyticsProps) {
  const totalReads = stories.reduce((sum, story) => sum + (story.reads || 0), 0);
  const totalLikes = stories.reduce((sum, story) => sum + (story._count?.likes || 0), 0);
  
  // Engagement Rate = (Likes / Reads) * 100
  const engagementRate = totalReads > 0 ? ((totalLikes / totalReads) * 100).toFixed(1) : "0.0";

  const stats = [
    { name: "Total Souls Reached", value: totalReads, icon: Users, color: "text-primary" },
    { name: "Engagement Essence", value: `${engagementRate}%`, icon: TrendingUp, color: "text-emerald-500" },
    { name: "Global Chronicles", value: stories.length, icon: Globe, color: "text-blue-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-surface/60 backdrop-blur-md border-2 border-on-surface/10 p-6 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
             <div className={`p-3 rounded bg-surface border-2 border-on-surface/5 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon size={24} />
             </div>
             <BarChart3 className="text-on-surface-variant/20" size={16} />
          </div>
          <p className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{stat.name}</p>
          <h3 className="font-headline font-black text-4xl text-on-surface uppercase tracking-tight">{stat.value}</h3>
          <div className="mt-4 pt-4 border-t border-on-surface/5 flex items-center justify-between">
             <span className="text-[10px] font-label font-bold text-on-surface-variant/60 uppercase">Last 30 Moons</span>
             <span className="text-[10px] font-label font-bold text-primary uppercase">View Ritual →</span>
          </div>
        </div>
      ))}
    </div>
  );
}
