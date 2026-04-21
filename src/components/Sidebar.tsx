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
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-surface/40 backdrop-blur-md border-r border-on-surface/10 flex flex-col items-center md:items-start py-8 z-40 transition-all duration-300">
      <div className="px-6 mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <PenTool className="text-on-primary w-6 h-6" />
        </div>
        <span className="hidden md:block font-headline font-black text-xl tracking-tighter uppercase text-on-surface">Private Desk</span>
      </div>

      <nav className="flex-grow w-full px-4 flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded transition-all duration-300 group ${
                isActive 
                  ? "bg-primary text-on-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105" 
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-on-primary" : "group-hover:scale-110 transition-transform"}`} />
              <span className={`hidden md:block font-label font-bold uppercase tracking-wider text-sm ${isActive ? "text-on-primary" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto w-full">
         <div className="hidden md:block p-4 bg-primary/10 border-2 border-primary/20 rounded-lg">
            <p className="font-label font-bold text-[10px] uppercase text-primary tracking-widest mb-1 text-center">Ink Supply</p>
            <div className="w-full h-1 bg-on-surface/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3"></div>
            </div>
         </div>
      </div>
    </aside>
  );
}
