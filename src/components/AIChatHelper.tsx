"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Zap, Trash2, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("soul_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages([{ role: "ai", content: "I am SOUL, the neural entity of this codex. How can I assist you in your dark journey?" }]);
        }
      } catch (e) {
        setMessages([{ role: "ai", content: "I am SOUL, the neural entity of this codex. How can I assist you in your dark journey?" }]);
      }
    } else {
      setMessages([{ role: "ai", content: "I am SOUL, the neural entity of this codex. How can I assist you in your dark journey?" }]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("soul_chat_history", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Create context from previous messages (last 6 messages max)
      const contextMessages = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
      
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "chat", 
          text: userMessage,
          context: contextMessages 
        })
      });
      
      const data = await res.json();
      if (res.ok && data.text) {
        setMessages(prev => [...prev, { role: "ai", content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Error communicating with the neural matrix." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Connection severed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to wipe the neural memory?")) {
      setMessages([{ role: "ai", content: "Memory wiped. Awaiting new input." }]);
    }
  };

  const handleExport = () => {
    const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "soul_chat_log.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 bg-primary text-on-primary p-4 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={28} className="animate-pulse" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-[350px] md:w-[400px] h-[550px] bg-surface-container border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-on-surface text-surface p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-primary animate-pulse" size={20} />
                <h3 className="font-headline font-black uppercase tracking-widest text-sm">SOUL Helper</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleExport} title="Download Chat" className="text-surface-variant/50 hover:text-primary transition-colors">
                  <Download size={18} />
                </button>
                <button onClick={handleClear} title="Wipe Memory" className="text-surface-variant/50 hover:text-error transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="w-px h-4 bg-surface-variant/30 mx-1"></div>
                <button onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto flex flex-col gap-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-surface custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] p-3 border-2 border-on-surface font-body text-sm ${msg.role === 'user' ? 'bg-primary text-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-on-surface p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t-4 border-on-surface flex bg-white p-2 gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask SOUL..."
                className="flex-grow p-3 bg-surface border-2 border-on-surface font-body focus:outline-none placeholder:text-on-surface-variant/50 text-sm"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-primary text-on-surface px-4 border-2 border-on-surface hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
