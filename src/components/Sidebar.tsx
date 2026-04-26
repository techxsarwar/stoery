"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, BarChart3, MessageSquare, Settings, PenTool, Library, DollarSign, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserRole } from "@/actions/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };
    fetchRole();
  }, []);

  const navItems = [
    { name: "Manuscripts", icon: BookOpen, href: "/dashboard" },
    { name: "The Codex", icon: Library, href: "/dashboard/codex" },
    { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "Monetization", icon: DollarSign, href: "/monetization" },
    { name: "Letters", icon: MessageSquare, href: "/dashboard/comments" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  // Show Observatory if role is EMPLOYEE or ADMIN
  if (userRole === "EMPLOYEE" || userRole === "ADMIN") {
    navItems.push({ name: "Observatory", icon: Shield, href: "/staff" });
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-gradient-to-b from-primary via-primary-container to-surface shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)] border-r border-on-surface/10 flex flex-col items-center md:items-start py-8 z-40 transition-all duration-300">
      <div className="px-6 mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-on-surface flex items-center justify-center rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] rotate-3 hover:rotate-0 transition-transform">
            <PenTool className="text-primary w-6 h-6" />
        </div>
        <span className="hidden md:block font-headline font-black text-xl tracking-tighter uppercase text-on-surface drop-shadow-sm">Private Desk</span>
      </div>

      <nav className="flex-grow w-full px-4 flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-on-surface text-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] scale-105" 
                  : "text-on-surface/70 hover:bg-on-surface/10 hover:text-on-surface"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "group-hover:scale-110 group-hover:rotate-6 transition-transform"}`} />
              <span className={`hidden md:block font-label font-bold uppercase tracking-wider text-sm`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto w-full">
         <div className="hidden md:block p-4 bg-white/30 border-2 border-on-surface/20 rounded-xl backdrop-blur-md hover:bg-white/50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <p className="font-label font-black text-[10px] uppercase text-on-surface tracking-widest mb-2 text-center drop-shadow-sm">Creative Flow</p>
            <div className="w-full h-1.5 bg-on-surface/10 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-on-surface w-2/3"></div>
            </div>
         </div>
      </div>
    </aside>
  );
}
