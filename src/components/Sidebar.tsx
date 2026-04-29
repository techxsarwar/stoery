"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, BarChart3, MessageSquare, Settings, PenTool, Library, DollarSign, Shield, Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserRole } from "@/actions/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };
    fetchRole();
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navItems = [
    { name: "My Profile", icon: User, href: "/profile" },
    { name: "Manuscripts", icon: BookOpen, href: "/dashboard" },
    { name: "The Codex", icon: Library, href: "/dashboard/codex" },
    { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "Monetization", icon: DollarSign, href: "/monetization" },
    { name: "Letters", icon: MessageSquare, href: "/dashboard/comments" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  if (userRole === "EMPLOYEE" || userRole === "ADMIN") {
    navItems.push({ name: "Observatory", icon: Shield, href: "/staff" });
  }

  return (
    <>
      {/* Mobile hamburger button — shown only on mobile, floats in top-left */}
      <button
        id="sidebar-hamburger"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-[60] p-4 bg-primary text-on-primary rounded-full border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center group"
        aria-label="Open navigation"
      >
        <Menu size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-[60] flex flex-col
          w-72 md:w-20 lg:w-64
          bg-gradient-to-b from-primary via-primary-container to-surface
          shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)]
          border-r border-on-surface/10
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-on-surface flex items-center justify-center rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] rotate-3 hover:rotate-0 transition-transform flex-shrink-0">
              <PenTool className="text-primary w-6 h-6" />
            </div>
            <span className="md:hidden lg:block font-headline font-black text-xl tracking-tighter uppercase text-on-surface drop-shadow-sm">
              Private Desk
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-on-surface/60 hover:text-on-surface transition-colors rounded-lg hover:bg-on-surface/10"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-grow w-full px-4 flex flex-col gap-2">
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
                <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-primary" : "group-hover:scale-110 group-hover:rotate-6 transition-transform"}`} />
                <span className="md:hidden lg:block font-label font-bold uppercase tracking-wider text-sm">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Widget */}
        <div className="px-6 pb-8 mt-auto w-full">
          <div className="md:hidden lg:block p-4 bg-white/30 border-2 border-on-surface/20 rounded-xl backdrop-blur-md hover:bg-white/50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <p className="font-label font-black text-[10px] uppercase text-on-surface tracking-widest mb-2 text-center drop-shadow-sm">Creative Flow</p>
            <div className="w-full h-1.5 bg-on-surface/10 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-on-surface w-2/3"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
