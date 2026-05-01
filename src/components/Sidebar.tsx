"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, BarChart3, MessageSquare, Settings, PenTool, Library, DollarSign, Shield, Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/me/role", { cache: "force-cache" });
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch {
        // silently fail
      }
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
      {/* Mobile hamburger button */}
      <button
        id="sidebar-hamburger"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-[60] p-4 bg-primary text-on-primary rounded-none border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center group"
        aria-label="Open navigation"
      >
        <Menu size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-[60] flex flex-col
          w-72 md:w-20 lg:w-64
          bg-white
          shadow-[8px_0px_0px_0px_var(--color-primary)]
          border-r-8 border-on-surface
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="px-6 py-8 flex items-center justify-between border-b-4 border-on-surface bg-surface-container">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3 hover:rotate-0 transition-transform flex-shrink-0">
              <PenTool className="text-on-primary w-6 h-6" />
            </div>
            <div className="md:hidden lg:flex flex-col">
                <span className="font-headline font-black text-2xl tracking-tighter uppercase text-on-surface leading-none drop-shadow-sm">
                Private
                </span>
                <span className="font-headline font-black text-2xl tracking-tighter uppercase text-primary leading-none drop-shadow-sm">
                Desk
                </span>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 bg-white border-4 border-on-surface hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-grow w-full px-4 py-6 flex flex-col gap-3 overflow-y-auto scrollbar-hide bg-surface">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 border-4 transition-all duration-300 group ${
                  isActive
                    ? "bg-on-surface text-surface border-on-surface shadow-[4px_4px_0px_0px_var(--color-primary)] translate-x-2"
                    : "bg-white text-on-surface border-transparent hover:border-on-surface hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1"
                }`}
              >
                <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-primary" : "group-hover:scale-110 group-hover:rotate-6 transition-transform"}`} />
                <span className="md:hidden lg:block font-headline font-black uppercase tracking-widest text-sm">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Widget */}
        <div className="px-6 pb-8 mt-auto w-full border-t-4 border-on-surface pt-6 bg-surface-container">
          <div className="md:hidden lg:flex flex-col items-center justify-center p-4 bg-white border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
            <p className="font-headline font-black text-[10px] uppercase text-on-surface tracking-widest mb-3">Creative Flow</p>
            <div className="w-full h-3 bg-surface border-2 border-on-surface rounded-none overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-primary w-2/3"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
