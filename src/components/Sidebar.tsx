"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, BarChart3, MessageSquare, Settings, PenTool } from "lucide-react";

const navItems = [
  { name: "Manuscripts", icon: BookOpen, href: "/dashboard" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "Letters", icon: MessageSquare, href: "/dashboard/comments" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-gradient-to-b from-fuchsia-600 via-violet-600 to-indigo-700 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)] border-r border-white/10 flex flex-col items-center md:items-start py-8 z-40 transition-all duration-300">
      <div className="px-6 mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-white flex items-center justify-center rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] rotate-3 hover:rotate-0 transition-transform">
            <PenTool className="text-violet-600 w-6 h-6" />
        </div>
        <span className="hidden md:block font-headline font-black text-xl tracking-tighter uppercase text-white drop-shadow-md">Private Desk</span>
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
                  ? "bg-white text-violet-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] scale-105" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-violet-700" : "group-hover:scale-110 group-hover:rotate-6 transition-transform"}`} />
              <span className={`hidden md:block font-label font-bold uppercase tracking-wider text-sm`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto w-full">
         <div className="hidden md:block p-4 bg-white/10 border-2 border-white/20 rounded-xl backdrop-blur-md hover:bg-white/20 transition-colors">
            <p className="font-label font-black text-[10px] uppercase text-white tracking-widest mb-2 text-center drop-shadow">Creative Flow</p>
            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 w-2/3 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            </div>
         </div>
      </div>
    </aside>
  );
}
