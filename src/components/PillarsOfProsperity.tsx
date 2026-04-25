"use client";

import { Users, Clock, MessageSquare, ShieldCheck, ChevronRight } from "lucide-react";
import { useState } from "react";
import MonetizationModal from "./MonetizationModal";

interface PillarProps {
  label: string;
  current: number;
  target: number;
  icon: any;
  color: string;
}

const Pillar = ({ label, current, target, icon: Icon, color }: PillarProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="flex flex-col gap-3 p-6 bg-black/40 rounded-2xl border border-on-surface/5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 opacity-60">
          <Icon size={18} className={color} />
          <span className="font-label font-bold text-[10px] uppercase tracking-[0.2em]">{label}</span>
        </div>
        <span className="font-headline font-black text-xs text-on-surface">{Math.floor(percentage)}%</span>
      </div>
      
      <div className="h-2 w-full bg-on-surface/5 rounded-full overflow-hidden border border-on-surface/5">
        <div 
          className={`h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-end">
        <div className="font-headline font-black text-2xl text-on-surface">
          {current.toLocaleString()} <span className="text-[10px] text-on-surface-variant font-bold opacity-40 uppercase tracking-tighter">/ {target.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function PillarsOfProsperity({ 
  reads, 
  hours, 
  comments,
  status 
}: { 
  reads: number; 
  hours: number; 
  comments: number;
  status: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const meetsCriteria = reads >= 4000 && hours >= 4000 && comments >= 9000;
  const isApplied = status === "APPLIED" || status === "APPROVED";

  return (
    <div className="bg-surface-container-high border-2 border-on-surface/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      {/* Decorative background */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
        <div>
          <h2 className="font-headline font-black text-3xl text-on-surface uppercase tracking-tight flex items-center gap-4">
            The Three Pillars
            <ShieldCheck size={24} className="text-primary" />
          </h2>
          <p className="font-body text-sm text-on-surface-variant italic opacity-60 mt-1">Master these cosmic foundations to unlock the prosperity of your universe.</p>
        </div>
        
        {meetsCriteria && !isApplied && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-primary text-on-primary font-headline font-black px-8 py-4 uppercase tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group/btn"
          >
            Apply for Monetization
            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}

        {isApplied && (
          <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-label font-bold px-6 py-3 rounded-full uppercase text-xs tracking-widest">
            Application Under Review
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <Pillar 
          label="Pillar of Souls" 
          current={reads} 
          target={4000} 
          icon={Users} 
          color="text-blue-400" 
        />
        <Pillar 
          label="Pillar of Time" 
          current={Math.floor(hours)} 
          target={4000} 
          icon={Clock} 
          color="text-purple-400" 
        />
        <Pillar 
          label="Pillar of Echoes" 
          current={comments} 
          target={9000} 
          icon={MessageSquare} 
          color="text-amber-400" 
        />
      </div>

      {isModalOpen && (
        <MonetizationModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
