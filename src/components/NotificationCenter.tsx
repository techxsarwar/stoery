"use client";

import { useState, useEffect } from "react";
import { Bell, Check, BookOpen, MessageSquare, Award, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT" });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
        case "NEW_CHAPTER": return <BookOpen size={16} className="text-primary" />;
        case "COMMENT_REPLY": return <MessageSquare size={16} className="text-blue-500" />;
        case "BADGE_EARNED": return <Award size={16} className="text-amber-500" />;
        default: return <AlertCircle size={16} className="text-on-surface-variant" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-error text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b-2 border-on-surface/10 bg-surface">
                <span className="font-headline font-black uppercase tracking-widest text-on-surface">Notifications</span>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                        <Check size={12} /> Mark Read
                    </button>
                )}
            </div>
            <div className="max-h-[400px] overflow-y-auto flex flex-col custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-on-surface-variant italic font-medium">
                        The void is quiet. No new notifications.
                    </div>
                ) : (
                    notifications.map(notif => (
                        <Link 
                           key={notif.id} 
                           href={notif.link || "#"}
                           onClick={() => setIsOpen(false)}
                           className={`p-4 border-b border-on-surface/5 hover:bg-surface-container transition-colors flex gap-4 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className={`text-xs font-black uppercase tracking-tight ${!notif.isRead ? 'text-on-surface' : 'text-on-surface/60'}`}>{notif.title}</span>
                                <span className={`text-sm ${!notif.isRead ? 'font-medium text-on-surface' : 'text-on-surface-variant italic'}`}>{notif.message}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30 mt-1">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
