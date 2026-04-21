"use client";

import { useState, useTransition } from "react";
import { MessageSquare, Trash2, EyeOff, User, ShieldAlert } from "lucide-react";
import { shadowBanComment, deleteComment } from "@/actions/engage";

interface InteractionChamberProps {
  comments: any[];
}

export default function InteractionChamber({ comments }: InteractionChamberProps) {
  const [activeTab, setActiveTab] = useState<"all" | "flagged">("all");
  const [isPending, startTransition] = useTransition();

  const handleShadowBan = (id: string) => {
    startTransition(async () => {
      await shadowBanComment(id);
    });
  };

  const handlePurge = (id: string) => {
    if (confirm("Are you sure you want to purge this record from history?")) {
      startTransition(async () => {
        await deleteComment(id);
      });
    }
  };

  const filteredComments = activeTab === "all" 
    ? comments 
    : comments.filter(c => c.isShadowBanned);

  if (comments.length === 0) {
    return (
      <div className="p-12 border-4 border-dashed border-on-surface/10 text-center bg-surface/40 backdrop-blur-md rounded-xl">
          <p className="text-on-surface-variant font-headline font-bold text-xl uppercase tracking-widest opacity-50">The letters remain silent.</p>
          <p className="font-body text-on-surface-variant mt-2 text-sm italic">No reader has yet sent their tribute.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-8 border-b-2 border-on-surface/10 pb-4">
         <button 
           onClick={() => setActiveTab("all")}
           className={`font-label font-black text-xs uppercase tracking-widest transition-all ${activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant opacity-50 hover:opacity-100"}`}
         >
           All Correspondence
         </button>
         <button 
           onClick={() => setActiveTab("flagged")}
           className={`font-label font-black text-xs uppercase tracking-widest transition-all ${activeTab === "flagged" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant opacity-50 hover:opacity-100"}`}
         >
           Curst Records {comments.filter(c => c.isShadowBanned).length > 0 && `(${comments.filter(c => c.isShadowBanned).length})`}
         </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className={`bg-surface/60 backdrop-blur-md border-2 p-6 rounded-lg flex gap-6 items-start group hover:border-primary/30 transition-all duration-300 ${comment.isShadowBanned ? "border-orange-500/20 grayscale" : "border-on-surface/10"}`}>
             <div className="w-12 h-12 bg-surface border-2 border-on-surface/10 rounded flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors">
                {comment.isShadowBanned ? <ShieldAlert className="text-orange-500" size={24} /> : <User size={24} className="text-on-surface-variant/40" />}
             </div>
             <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                   <div>
                        <h4 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider">{comment.profile?.pen_name || "Unknown Soul"}</h4>
                        <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">on <span className="text-primary italic">"{comment.story?.title}"</span></p>
                   </div>
                   <span className="text-[10px] font-label font-bold text-on-surface-variant/40 uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="font-body text-on-surface text-lg leading-relaxed mb-4 line-clamp-2 italic">"{comment.content}"</p>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="flex items-center gap-2 font-label font-black text-[10px] uppercase text-primary hover:tracking-widest transition-all">
                      <MessageSquare size={12} />
                      Reply Ritual
                   </button>
                   <button 
                     disabled={isPending}
                     onClick={() => handleShadowBan(comment.id)}
                     className={`flex items-center gap-2 font-label font-black text-[10px] uppercase transition-all ${comment.isShadowBanned ? "text-emerald-500" : "text-on-surface-variant hover:text-on-surface"}`}
                   >
                      <EyeOff size={12} />
                      {comment.isShadowBanned ? "Lift Curse" : "Shadow Curse"}
                   </button>
                   <button 
                     disabled={isPending}
                     onClick={() => handlePurge(comment.id)}
                     className="flex items-center gap-2 font-label font-black text-[10px] uppercase text-error hover:tracking-widest transition-all"
                   >
                      <Trash2 size={12} />
                      Purge
                   </button>
                </div>
             </div>
          </div>
        ))}
        {filteredComments.length === 0 && activeTab === "flagged" && (
            <div className="p-8 text-center text-on-surface-variant/40 font-label font-bold text-xs uppercase tracking-widest">No spirits have been cursed yet.</div>
        )}
      </div>
    </div>
  );
}

