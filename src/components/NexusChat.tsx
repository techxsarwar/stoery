"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { sendNexusMessage } from "@/actions/chat";
import { Send, Zap, Users, Shield } from "lucide-react";

interface NexusChatProps {
  initialMessages: any[];
  currentProfile: any;
}

export default function NexusChat({ initialMessages, currentProfile }: NexusChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Scroll to bottom on load
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);

    // Subscribe to new messages
    // Note: 'NexusMessage' table must have Realtime enabled in Supabase dashboard
    const channel = supabase
      .channel('nexus_chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'NexusMessage',
        },
        async (payload) => {
          // Triggers a non-destructive background refetch of server components
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const content = newMessage;
    setNewMessage("");

    const res = await sendNexusMessage(content);
    if (!res.success) {
      alert(res.error);
    }
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      {/* Chat Header */}
      <div className="bg-on-surface p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#eab308]"></div>
          <h3 className="font-headline font-black text-primary uppercase tracking-tighter text-xl italic">Nexus Chat // Live</h3>
        </div>
        <div className="flex items-center gap-4 text-white/40 font-headline text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-1"><Users size={12} /> Sync Active</span>
          <span className="flex items-center gap-1"><Shield size={12} /> Encrypted</span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4">
            <Zap size={48} className="text-on-surface" />
            <p className="font-headline font-black uppercase tracking-[0.3em] text-center">No transmissions found.<br />Break the silence.</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isOwn = msg.profileId === currentProfile?.id;
          const isStaff = msg.profile.role === "STAFF" || msg.profile.role === "ADMIN";

          return (
            <div
              key={msg.id || i}
              className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex items-center gap-2 mb-1 px-1`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isOwn ? 'text-primary' : 'text-on-surface/40'}`}>
                  {msg.profile.pen_name || msg.profile.full_name || "Anonymous"}
                </span>
                {msg.profile.isVerified && (
                  <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center border border-on-surface">
                    <div className="w-1.5 h-1.5 bg-on-surface rounded-full"></div>
                  </div>
                )}
              </div>

              <div className={`
                max-w-[80%] p-4 border-2 border-on-surface font-body font-medium text-lg relative
                ${isOwn
                  ? 'bg-primary text-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }
              `}>
                {msg.content}
                <span className="absolute -bottom-5 right-0 text-[8px] font-black uppercase text-on-surface/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t-4 border-on-surface bg-white">
        {!currentProfile ? (
          <div className="p-4 bg-on-surface/5 border-2 border-dashed border-on-surface/20 rounded text-center">
            <p className="font-headline font-black text-xs uppercase tracking-widest text-on-surface/40">Initialize profile to join the Nexus</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Inject message into the Nexus..."
              className="flex-grow bg-on-surface/5 border-2 border-on-surface px-4 py-3 font-headline font-bold text-sm uppercase tracking-tight focus:bg-white focus:outline-none transition-all placeholder:text-on-surface/20"
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="bg-primary text-on-surface border-2 border-on-surface px-6 py-3 font-headline font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all flex items-center gap-2"
            >
              <Send size={18} />
              <span className="hidden md:inline">Send</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
