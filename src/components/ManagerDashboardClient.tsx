 "use client";

import { useState } from "react";
import {
   Shield,
   Users,
   Activity,
   Terminal,
   Cpu,
   Database,
   Lock,
   UserPlus,
   UserMinus,
   Zap,
   Globe,
   Search,
   LogOut,
   TrendingUp,
   AlertTriangle,
   Crown,
   Radio,
   FileText,
   BarChart3,
   Settings,
   Eye,
   Unlock,
   AlertOctagon,
   Clock,
   Heart,
   MessageSquare,
   CheckCircle,
   CircleDollarSign,
   ScrollText,
   ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { promoteUser, revokeStaffAccess } from "@/actions/manager";
import { banStory, unbanStory } from "@/actions/staff";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface ManagerDashboardClientProps {
   manager: { name: string | null; role: string };
   staff: any[];
   stats: {
      totalUsers: number;
      totalStories: number;
      totalReports: number;
      pendingReports: number;
      totalBans: number;
      staffCount: number;
      employeeCount: number;
      adminCount: number;
      totalComments: number;
      totalLikes: number;
      verifiedProfiles: number;
      monetizedProfiles: number;
      issuedLicenses: number;
   };
   allStories: any[];
}

export default function ManagerDashboardClient({ manager, staff, stats, allStories }: ManagerDashboardClientProps) {
   const [activeTab, setActiveTab] = useState("Command Hub");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [searchEmail, setSearchEmail] = useState("");
   const router = useRouter();

   const handleAction = async (action: () => Promise<any>) => {
      const res = await action();
      if (res.success) {
         router.refresh();
      } else {
         alert(res.error || "Action failed");
      }
   };

   const formatDate = (date: string | Date) => {
      const d = new Date(date);
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
   };

   const tabs = [
      { name: "Command Hub", icon: Activity },
      { name: "Operative Registry", icon: Users },
      { name: "Platform Overview", icon: BarChart3 },
      { name: "Access Control", icon: Lock },
      { name: "Global Audit", icon: Search },
      { name: "Intelligence", icon: Cpu },
      { name: "System Protocols", icon: Settings },
   ];

   const renderContent = () => {
      switch (activeTab) {
         case "Command Hub":
            return (
               <div className="flex flex-col gap-8">
                  {/* Status Banner */}
                  <div className="bg-primary border-4 border-on-surface p-6 rounded-3xl flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white border-4 border-on-surface rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                           <Radio className="text-on-surface animate-pulse w-8 h-8" />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black uppercase tracking-tighter italic">System Status: Operational</h2>
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">All platform protocols synchronized // Level 10 Clearance Active</p>
                        </div>
                     </div>
                     <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded-full border-2 border-on-surface">Uptime: 99.9%</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     {[
                        { label: "Total Neural Links", value: stats.totalUsers, icon: Globe, trend: "+12%" },
                        { label: "Global Chronicles", value: stats.totalStories, icon: FileText, trend: "+5%" },
                        { label: "Active Operatives", value: stats.staffCount, icon: Shield, trend: "STABLE" },
                        { label: "Incident Reports", value: stats.totalReports, icon: AlertTriangle, trend: stats.pendingReports > 0 ? "ACTION REQ" : "CLEAR" },
                     ].map((item) => (
                        <div key={item.label} className="bg-white border-4 border-on-surface p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
                           <div className="flex justify-between items-start mb-4">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/40">{item.label}</p>
                              <item.icon className="w-5 h-5 text-primary" />
                           </div>
                           <h3 className="text-4xl font-black tracking-tighter">{item.value}</h3>
                           <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> {item.trend}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-8 bg-white border-4 border-on-surface rounded-3xl p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center mb-8">
                           <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
                              <Zap className="w-5 h-5 text-primary" /> Recent Staff Activity
                           </h2>
                           <Link href="/staff" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Actions</Link>
                        </div>
                        <div className="space-y-4">
                           {staff.slice(0, 5).map((m) => (
                              <div key={m.id} className="flex items-center justify-between p-4 border-2 border-on-surface/10 rounded-2xl hover:border-primary transition-colors bg-surface/5">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/20 border-2 border-on-surface rounded-lg flex items-center justify-center font-black">
                                       {m.name?.[0] || "?"}
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold uppercase">{m.name || m.email}</p>
                                       <p className="text-[8px] font-black text-on-surface/40 uppercase tracking-widest">{m.role} // ID: {m.id.slice(-6)}</p>
                                    </div>
                                 </div>
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-6">
                        <div className="bg-primary border-4 border-on-surface p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                           <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Crown className="w-4 h-4" /> Command Quick Actions
                           </h3>
                           <div className="grid grid-cols-1 gap-3">
                              <button onClick={() => setActiveTab("Access Control")} className="bg-white border-2 border-on-surface p-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface transition-all flex items-center gap-3">
                                 <UserPlus className="w-4 h-4" /> Promote Personnel
                              </button>
                              <button onClick={() => window.alert("Broadcasting feature coming soon...")} className="bg-white border-2 border-on-surface p-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface transition-all flex items-center gap-3">
                                 <Radio className="w-4 h-4" /> System Broadcast
                              </button>
                           </div>
                        </div>
                        <div className="bg-on-surface text-white border-4 border-on-surface p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                           <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Terminal className="w-4 h-4 text-primary" /> Audit Status
                           </h3>
                           <p className="text-[9px] font-medium leading-relaxed opacity-60 uppercase tracking-widest">
                              All administrative actions are encrypted and logged in the deep-core registry. Tampering is detected instantly.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            );

         case "Operative Registry":
            return (
               <div className="flex flex-col gap-6">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/40 mb-2 italic">Personnel Database // {staff.length} Active Operatives</h2>
                  <div className="grid grid-cols-1 gap-4">
                     {staff.map((member) => (
                        <div key={member.id} className="bg-white border-4 border-on-surface p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-primary/10 border-4 border-on-surface rounded-2xl flex items-center justify-center font-black text-on-surface uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                 {member.name?.[0] || member.email[0]}
                              </div>
                              <div>
                                 <div className="flex items-center gap-3">
                                    <h3 className="font-black text-lg tracking-tight uppercase italic">{member.name || "Unknown"}</h3>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 ${member.role === 'ADMIN' ? 'bg-primary border-on-surface text-on-surface' : 'bg-surface/5 text-on-surface/40 border-on-surface/10'
                                       }`}>
                                       {member.role}
                                    </span>
                                 </div>
                                 <p className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest mt-1">{member.email}</p>
                              </div>
                           </div>

                           <div className="flex items-center gap-3">
                              {member.role === 'EMPLOYEE' ? (
                                 <button
                                    onClick={() => handleAction(() => promoteUser(member.email, 'ADMIN'))}
                                    className="bg-white border-2 border-on-surface text-on-surface px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                                 >
                                    Elevate to ADMIN
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => handleAction(() => promoteUser(member.email, 'EMPLOYEE'))}
                                    className="bg-white border-2 border-on-surface text-on-surface px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                                 >
                                    Restrict to EMPLOYEE
                                 </button>
                              )}
                              <button
                                 onClick={() => {
                                    if (confirm("Terminate operative access?")) handleAction(() => revokeStaffAccess(member.email))
                                 }}
                                 className="bg-red-500 text-white border-2 border-on-surface px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                              >
                                 <UserMinus className="w-4 h-4" /> Terminate
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            );

         case "Platform Overview":
            return (
               <div className="flex flex-col gap-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/40 mb-2 italic">Detailed Platform Intelligence</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {[
                        { label: "Total Employees", value: stats.employeeCount, icon: ShieldCheck, color: "bg-blue-500" },
                        { label: "Total Administrators", value: stats.adminCount, icon: Crown, color: "bg-violet-500" },
                        { label: "Total Verified", value: stats.verifiedProfiles, icon: CheckCircle, color: "bg-emerald-500" },
                        { label: "Total Monetized", value: stats.monetizedProfiles, icon: CircleDollarSign, color: "bg-amber-500" },
                        { label: "Total Comments", value: stats.totalComments, icon: MessageSquare, color: "bg-pink-500" },
                        { label: "Total Likes", value: stats.totalLikes, icon: Heart, color: "bg-red-500" },
                        { label: "Licenses Issued", value: stats.issuedLicenses, icon: ScrollText, color: "bg-indigo-500" },
                        { label: "Banned Chronicles", value: stats.totalBans, icon: AlertOctagon, color: "bg-red-600" },
                     ].map((item) => (
                        <div key={item.label} className="bg-white border-4 border-on-surface p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                           <div className={`w-10 h-10 ${item.color} text-white border-2 border-on-surface rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                              <item.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">{item.label}</p>
                              <p className="text-3xl font-black">{item.value}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-white border-4 border-on-surface rounded-[40px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-sm font-black uppercase tracking-tighter italic mb-6">User Role Distribution</h3>
                        <div className="space-y-4">
                           {[
                              { role: "Authors", count: stats.totalUsers - stats.staffCount, color: "bg-primary" },
                              { role: "Employees", count: stats.employeeCount, color: "bg-blue-500" },
                              { role: "Admins", count: stats.adminCount, color: "bg-violet-500" },
                           ].map(r => {
                              const percentage = stats.totalUsers > 0 ? (r.count / stats.totalUsers) * 100 : 0;
                              return (
                                 <div key={r.role} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                       <span>{r.role}</span>
                                       <span>{r.count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full h-4 bg-surface border-2 border-on-surface rounded-full overflow-hidden">
                                       <div className={`h-full ${r.color}`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     <div className="bg-on-surface text-white border-4 border-on-surface rounded-[40px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-sm font-black uppercase tracking-tighter italic mb-6">Engagement Analytics</h3>
                        <div className="grid grid-cols-2 gap-8">
                           <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border-2 border-white/10">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">L / S Ratio</p>
                              <p className="text-4xl font-black">{(stats.totalLikes / stats.totalStories || 0).toFixed(1)}</p>
                              <p className="text-[8px] font-black uppercase tracking-widest mt-2 opacity-60">Likes per Story</p>
                           </div>
                           <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border-2 border-white/10">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">C / S Ratio</p>
                              <p className="text-4xl font-black">{(stats.totalComments / stats.totalStories || 0).toFixed(1)}</p>
                              <p className="text-[8px] font-black uppercase tracking-widest mt-2 opacity-60">Comments per Story</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            );

         case "Access Control":
            return (
               <div className="max-w-2xl">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/40 mb-6 italic">Grant Access // Clearance Protocol</h2>
                  <div className="bg-primary border-4 border-on-surface p-8 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
                     <div className="flex flex-col gap-3">
                        <label className="font-black text-[10px] uppercase tracking-[0.3em] text-on-surface/60">Personnel Neural ID (Email)</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                           <input
                              type="email"
                              value={searchEmail}
                              onChange={(e) => setSearchEmail(e.target.value)}
                              placeholder="candidate@soulpad.com"
                              className="flex-grow bg-white border-4 border-on-surface rounded-2xl px-6 py-4 font-black text-sm text-on-surface placeholder:text-on-surface/20 focus:outline-none"
                           />
                           <button
                              onClick={() => handleAction(() => promoteUser(searchEmail, 'EMPLOYEE'))}
                              className="bg-on-surface text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-on-surface/80 transition-all flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]"
                           >
                              <UserPlus className="w-5 h-5" /> Grant Entry
                           </button>
                        </div>
                     </div>
                     <div className="p-5 bg-white/20 border-2 border-on-surface/10 rounded-2xl">
                        <p className="text-[10px] font-black text-on-surface uppercase tracking-widest leading-relaxed flex gap-3">
                           <AlertTriangle className="flex-shrink-0 w-4 h-4" />
                           Warning: Granting access enables visibility into restricted platform archives and intelligence modules.
                        </p>
                     </div>
                  </div>
               </div>
            );

         case "Global Audit":
            return (
               <div className="flex flex-col gap-6">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/40 mb-2 italic">Global Chronicle Registry // Total: {allStories.length}</h2>
                  <div className="flex flex-col gap-4">
                     {allStories.map((story) => (
                        <div key={story.id} className={`bg-white border-4 border-on-surface p-5 rounded-2xl flex items-center justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${story.isBanned ? 'opacity-70 grayscale' : ''}`}>
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                 <h3 className="font-black text-base tracking-tight uppercase italic">{story.title}</h3>
                                 {story.isBanned && (
                                    <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">BANNED</span>
                                 )}
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[9px] text-primary uppercase font-black tracking-widest">{story.author.pen_name || "Unknown Author"}</span>
                                 <span className="text-[9px] text-on-surface/20 uppercase font-black tracking-widest flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {formatDate(story.createdAt)}
                                 </span>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <Link href={`/read/${story.id}`} target="_blank" className="bg-surface border-2 border-on-surface px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:bg-primary transition-all flex items-center gap-2">
                                 <Eye className="w-4 h-4" /> Review
                              </Link>
                              {story.isBanned ? (
                                 <button
                                    onClick={() => handleAction(() => unbanStory(story.id))}
                                    className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:bg-emerald-600 transition-all flex items-center gap-2"
                                 >
                                    <Unlock className="w-4 h-4" /> Reinstate
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => {
                                       const reason = window.prompt("Enter ban reason:");
                                       if (reason) handleAction(() => banStory(story.id, reason));
                                    }}
                                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:bg-red-600 transition-all flex items-center gap-2"
                                 >
                                    <AlertOctagon className="w-4 h-4" /> Ban
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            );

         case "Intelligence":
            return (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white border-4 border-on-surface p-8 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                     <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic mb-8">
                        <BarChart3 className="w-5 h-5 text-primary" /> Traffic Flux
                     </h2>
                     <div className="space-y-6">
                        {[
                           { name: "Organic Syncs", val: 84, color: "bg-primary" },
                           { name: "Direct Overrides", val: 12, color: "bg-on-surface" },
                           { name: "Referred Links", val: 34, color: "bg-emerald-500" },
                        ].map(item => (
                           <div key={item.name} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                                 <span>{item.name}</span>
                                 <span>{item.val}%</span>
                              </div>
                              <div className="w-full h-3 bg-surface border-2 border-on-surface rounded-full overflow-hidden">
                                 <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-on-surface text-white border-4 border-on-surface p-8 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                     <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic mb-8">
                        <Database className="w-5 h-5 text-primary" /> Data Integrity
                     </h2>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/10">
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">R2 Storage</p>
                           <p className="text-xl font-black">94.2 GB</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/10">
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">DB Latency</p>
                           <p className="text-xl font-black">12ms</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/10">
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Cache Hit</p>
                           <p className="text-xl font-black">88%</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/10">
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">API Health</p>
                           <p className="text-xl font-black text-emerald-400">OPTIMAL</p>
                        </div>
                     </div>
                  </div>
               </div>
            );

         default:
            return <div className="text-on-surface/20 font-black uppercase tracking-[0.5em]">DIRECTIVE_PENDING</div>;
      }
   };

   return (
      <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/30 overflow-hidden flex">
         {/* Sidebar - Desktop */}
         <aside className={`
        fixed lg:relative z-50 h-screen bg-white border-r-4 border-on-surface flex flex-col transition-all duration-300
        w-80
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
            <div className="p-8 flex items-center gap-5 border-b-4 border-on-surface bg-primary">
               <div className="w-12 h-12 bg-white border-4 border-on-surface flex items-center justify-center rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Shield className="w-7 h-7 text-on-surface" />
               </div>
               <div>
                  <h1 className="font-black text-2xl tracking-tighter uppercase italic leading-none">AEGIS PRO</h1>
                  <span className="text-[8px] uppercase tracking-[0.4em] font-black opacity-60">High Command</span>
               </div>
            </div>

            <nav className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
               {tabs.map((tab) => (
                  <button
                     key={tab.name}
                     onClick={() => { setActiveTab(tab.name); setIsSidebarOpen(false); }}
                     className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group border-4 ${activeTab === tab.name
                           ? "bg-on-surface text-primary border-on-surface shadow-[6px_6px_0px_0px_rgba(234,179,8,0.5)] scale-[1.02]"
                           : "text-on-surface/40 hover:text-on-surface hover:bg-primary/5 border-transparent"
                        }`}
                  >
                     <tab.icon className={`w-5 h-5 ${activeTab === tab.name ? "animate-pulse" : ""}`} />
                     <span className="font-black uppercase tracking-widest text-[11px]">{tab.name}</span>
                  </button>
               ))}
            </nav>

            <div className="p-6 border-t-4 border-on-surface bg-surface/30">
               <Link
                  href="/"
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-on-surface/40 hover:text-red-500 hover:bg-red-50/50 transition-all w-full border-4 border-transparent hover:border-red-500/20"
               >
                  <LogOut className="w-5 h-5" />
                  <span className="font-black uppercase tracking-widest text-[11px]">Exit System</span>
               </Link>
            </div>
         </aside>

         {/* Main Area */}
         <main className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.1),transparent)]">
            <div className="p-6 sm:p-10 lg:p-16 max-w-7xl mx-auto flex flex-col gap-12">

               {/* Header */}
               <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b-4 border-on-surface pb-10">
                  <div className="flex items-center gap-5">
                     <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-4 bg-primary rounded-2xl border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                     >
                        <Terminal className="w-6 h-6" />
                     </button>
                     <div>
                        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase italic leading-none">
                           {activeTab}
                        </h1>
                        <div className="flex items-center gap-3 mt-4">
                           <div className="w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-on-surface" />
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface/40">Active Commander: {manager.name}</p>
                        </div>
                     </div>
                  </div>

                  <div className="hidden md:flex bg-white border-4 border-on-surface px-6 py-4 rounded-2xl items-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-[2px] focus-within:translate-y-[2px] focus-within:shadow-none transition-all">
                     <Search className="w-5 h-5 text-on-surface/20" />
                     <input
                        type="text"
                        placeholder="Query Archives..."
                        className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest w-56 placeholder:text-on-surface/10"
                     />
                  </div>
               </header>

               {/* Content Area */}
               <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-6 duration-700">
                  {renderContent()}
               </div>

               {/* Footer */}
               <footer className="mt-auto pt-16 border-t-4 border-on-surface flex flex-col sm:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-on-surface flex items-center justify-center rounded-xl">
                        <Shield className="w-6 h-6 text-primary" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface/30">Singularity Command // Aegis v1.2</p>
                  </div>
                  <div className="flex items-center gap-6 text-on-surface/40 text-[9px] font-black uppercase tracking-widest">
                     <span className="flex items-center gap-2"><Cpu className="w-3 h-3 text-primary" /> Core Sync: High</span>
                     <span className="flex items-center gap-2"><Database className="w-3 h-3 text-primary" /> Database: Encrypted</span>
                  </div>
               </footer>
            </div>
         </main>
      </div>
   );
}
