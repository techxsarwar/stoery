"use client";

import { useState } from "react";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  Users, 
  Zap, 
  Activity,
  ArrowUpRight,
  MessageSquare,
  Settings,
  LogOut,
  Clock,
  Flag,
  Scale,
  Gavel,
  ShieldAlert,
  ChevronDown,
  Unlock,
  AlertOctagon,
  Award
} from "lucide-react";
import Link from "next/link";
import { banStory, unbanStory, updateMonetizationStatus, toggleVerification, resolveReport, handleAppeal } from "@/actions/staff";
import { reviewLicense } from "@/actions/licenses";

interface StaffDashboardClientProps {
  user: { name: string | null; role: string };
  stats: {
    userCount: number;
    storyCount: number;
    commentCount: number;
    pendingApps: any[];
  };
  allProfiles: any[];
  allStories: any[];
  bannedComments: any[];
  recentUsers: any[];
  allReports: any[];
  pendingAppeals: any[];
  allLicenses: any[];
}

export default function StaffDashboardClient({ 
  user, 
  stats, 
  allProfiles, 
  allStories, 
  bannedComments, 
  recentUsers,
  allReports,
  pendingAppeals,
  allLicenses
}: StaffDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("Command Hub");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { name: "Command Hub", icon: Activity },
    { name: "Verification", icon: CheckCircle },
    { name: "Reports", icon: Flag },
    { name: "Appeals", icon: Gavel },
    { name: "Licenses", icon: Award },
    { name: "Creators", icon: Users },
    { name: "Chronicles", icon: FileText },
    { name: "Moderation", icon: Shield },
    { name: "Economics", icon: Zap },
    { name: "Protocols", icon: Settings },
  ];
  
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleAction = async (action: () => Promise<any>) => {
    const res = await action();
    if (res.success) {
      // Re-fetching or updating local state would be better, but revalidatePath handles it server-side
      window.location.reload(); 
    } else {
      alert(res.error || "Action failed");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Reports":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60 flex items-center gap-3">
              <Flag size={14} className="text-primary" />
              Intelligence Reports // Total Active: {allReports.filter(r => r.status === 'PENDING').length}
            </h2>

            <div className="flex flex-col gap-4">
              {allReports.length === 0 ? (
                <div className="p-16 rounded-3xl border-4 border-dashed border-on-surface/5 flex items-center justify-center bg-white">
                  <p className="text-on-surface/20 font-black uppercase tracking-widest text-center">Peace prevails. No incident reports.</p>
                </div>
              ) : (
                allReports.map((report) => (
                  <div key={report.id} className={`bg-white border-4 border-on-surface p-6 rounded-2xl flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${report.status !== 'PENDING' ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl border-2 border-red-500/20">
                          <Flag size={20} className="text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-black text-sm uppercase tracking-tight">Reason: {report.reason}</h3>
                          <p className="text-[9px] text-on-surface/40 uppercase tracking-widest font-bold">Reported By: {report.reporter.pen_name || "Anonymous"} // {formatDate(report.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 ${
                        report.status === 'PENDING' ? 'bg-primary text-on-surface border-on-surface' : 'bg-on-surface/5 text-on-surface/40 border-on-surface/10'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="p-4 bg-on-surface/5 border-2 border-on-surface rounded-xl">
                       <p className="text-xs font-black uppercase tracking-widest text-on-surface/40 mb-2">Subject: {report.story.title}</p>
                       <p className="font-medium text-sm text-on-surface">"{report.details || "No additional details provided."}"</p>
                    </div>

                    {report.authorResponse && (
                      <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-xl">
                         <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Author Response:</p>
                         <p className="font-medium text-sm text-on-surface italic">"{report.authorResponse}"</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                       <Link href={`/read/${report.storyId}`} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                          Review Chronicle <ArrowUpRight size={12} />
                       </Link>

                       {report.status === 'PENDING' && (
                         <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                const reason = window.prompt("Enter ban reason (this will be shown to the author and readers):", report.reason);
                                if (reason) {
                                  handleAction(async () => {
                                    const banRes = await banStory(report.storyId, reason);
                                    if (banRes.success) {
                                      return resolveReport(report.id, "RESOLVED");
                                    }
                                    return banRes;
                                  });
                                }
                              }}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
                            >
                              <Shield size={14} /> Ban & Resolve
                            </button>
                            <button 
                              onClick={() => handleAction(() => resolveReport(report.id, "DISMISSED"))}
                              className="bg-on-surface text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-on-surface/80 transition-all"
                            >
                              Dismiss
                            </button>
                         </div>
                       )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "Appeals":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60 flex items-center gap-3">
              <Gavel size={14} className="text-primary" />
              Justice Chamber // Pending Appeals: {pendingAppeals.length}
            </h2>

            <div className="flex flex-col gap-4">
              {pendingAppeals.length === 0 ? (
                <div className="p-16 rounded-3xl border-4 border-dashed border-on-surface/5 flex items-center justify-center bg-white">
                  <p className="text-on-surface/20 font-black uppercase tracking-widest text-center">No pending appeals found.</p>
                </div>
              ) : (
                pendingAppeals.map((story: any) => (
                  <div key={story.id} className="bg-white border-4 border-on-surface p-6 rounded-2xl flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl border-2 border-primary/20">
                          <Scale size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-black text-sm uppercase tracking-tight">Appeal for: {story.title}</h3>
                          <p className="text-[9px] text-on-surface/40 uppercase tracking-widest font-bold">By: {story.author.pen_name || "Anonymous"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-on-surface/5 border-2 border-on-surface rounded-xl">
                       <p className="text-xs font-black uppercase tracking-widest text-on-surface/40 mb-2">Ban Reason:</p>
                       <p className="font-medium text-sm text-on-surface mb-4">"{story.banReason}"</p>
                       <div className="h-0.5 bg-on-surface/10 mb-4"></div>
                       <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Author's Appeal:</p>
                       <p className="font-medium text-sm text-on-surface italic">"{story.appealText}"</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                       <button 
                        onClick={() => handleAction(() => handleAppeal(story.id, "ACCEPTED"))}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2"
                       >
                        <CheckCircle size={14} /> Accept Appeal
                       </button>
                       <button 
                        onClick={() => handleAction(() => handleAppeal(story.id, "REJECTED"))}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
                       >
                        <XCircle size={14} /> Reject Appeal
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "Licenses":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60 flex items-center gap-3">
              <Award size={14} className="text-primary" />
              Codex Registry // License Management: {allLicenses.filter(l => l.status === 'PENDING').length} Pending
            </h2>

            <div className="flex flex-col gap-4">
              {allLicenses.length === 0 ? (
                <div className="p-16 rounded-3xl border-4 border-dashed border-on-surface/5 flex items-center justify-center bg-white">
                  <p className="text-on-surface/20 font-black uppercase tracking-widest text-center">No license applications in the system.</p>
                </div>
              ) : (
                allLicenses.map((license) => (
                  <div key={license.id} className={`bg-white border-4 border-on-surface p-6 rounded-2xl flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${license.status !== 'PENDING' ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl border-2 border-primary/20 text-primary">
                          <Award size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-sm uppercase tracking-tight">Application: {license.story.title}</h3>
                          <p className="text-[9px] text-on-surface/40 uppercase tracking-widest font-bold">Applicant: {license.legalName} // Pen: {license.applicant.pen_name}</p>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 ${
                        license.status === 'APPROVED' ? 'bg-emerald-500 text-white border-emerald-600' : 
                        license.status === 'PENDING' ? 'bg-amber-500 text-white border-amber-600' : 
                        'bg-red-500 text-white border-red-600'
                      }`}>
                        {license.status}
                      </span>
                    </div>

                    <div className="p-4 bg-on-surface/5 border-2 border-on-surface rounded-xl flex flex-col gap-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Tier: {license.licenseType}</p>
                       <p className="font-medium text-sm text-on-surface">"{license.details || "No additional creative details provided."}"</p>
                    </div>

                    {license.status === 'PENDING' && (
                      <div className="flex justify-end gap-3 pt-2">
                         <button 
                          onClick={() => handleAction(() => reviewLicense(license.id, "APPROVED"))}
                          className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2"
                         >
                          <CheckCircle size={14} /> Issue License
                         </button>
                         <button 
                          onClick={() => handleAction(() => reviewLicense(license.id, "REJECTED"))}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
                         >
                          <XCircle size={14} /> Reject Request
                         </button>
                      </div>
                    )}

                    {license.status === 'APPROVED' && (
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-on-surface/40 pt-2">
                            <span>License Number: {license.licenseNumber}</span>
                            <span>Issued On: {formatDate(license.issuedAt)}</span>
                        </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "Verification":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60 flex items-center gap-3">
                <CheckCircle size={14} className="text-primary" />
                Identity Verification // Total Users: {allProfiles.length}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {allProfiles.map((profile) => {
                const totalLikes = profile.stories.reduce((acc: number, story: any) => acc + (story._count?.likes || 0), 0);
                
                return (
                  <details key={profile.id} className="group bg-white border-4 border-on-surface rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <summary className="p-6 flex items-center justify-between cursor-pointer list-none">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-on-surface/5 rounded-xl border-2 border-on-surface overflow-hidden flex items-center justify-center">
                          {profile.user.image ? <img src={profile.user.image} alt="" className="w-full h-full object-cover" /> : <Users className="text-on-surface/20" />}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-sm tracking-tight uppercase">{profile.pen_name || profile.user.name || "Anonymous"}</h3>
                            {profile.isVerified && <CheckCircle size={14} className="text-primary fill-primary text-white" />}
                          </div>
                          <p className="text-[9px] text-on-surface/30 uppercase tracking-widest">{profile.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border-2 ${profile.isVerified ? 'bg-primary text-on-surface border-on-surface' : 'bg-on-surface/5 text-on-surface/40 border-on-surface/10'}`}>
                          {profile.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        <ChevronDown className="w-5 h-5 text-on-surface/30 group-open:rotate-180 transition-transform" />
                      </div>
                    </summary>
                    <div className="p-8 bg-on-surface/5 border-t-4 border-on-surface grid grid-cols-1 md:grid-cols-4 gap-8">
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Total Stories</span>
                          <span className="text-2xl font-black">{profile._count.stories}</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Total Likes</span>
                          <span className="text-2xl font-black">{totalLikes}</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Monetization</span>
                          <span className={`text-sm font-black uppercase tracking-tighter ${profile.monetization_status !== 'NONE' ? 'text-emerald-600' : 'text-on-surface/40'}`}>
                             {profile.monetization_status !== 'NONE' ? 'ENABLED' : 'DISABLED'}
                          </span>
                       </div>
                       <div className="flex items-center justify-end">
                          <button 
                            onClick={() => handleAction(() => toggleVerification(profile.id, !profile.isVerified))}
                            className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
                              profile.isVerified 
                                ? 'bg-white text-on-surface' 
                                : 'bg-primary text-on-surface'
                            }`}
                          >
                             {profile.isVerified ? 'Revoke Blue Tick' : 'Grant Blue Tick'}
                          </button>
                       </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        );

      case "Command Hub":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60 flex items-center gap-3">
                <CheckCircle size={14} className="text-primary" />
                Clearance Queue
              </h2>
              <div className="flex flex-col gap-4">
                {stats.pendingApps.length === 0 ? (
                  <div className="p-16 rounded-3xl border-4 border-dashed border-on-surface/5 flex items-center justify-center bg-white">
                    <p className="text-on-surface/20 font-black uppercase tracking-widest text-center">System idle. No pending requests.</p>
                  </div>
                ) : (
                  stats.pendingApps.slice(0, 5).map((app) => (
                    <div key={app.id} className="bg-white border-4 border-on-surface p-5 rounded-2xl flex items-center justify-between group hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-on-surface/5 rounded-lg overflow-hidden flex items-center justify-center border-2 border-on-surface group-hover:border-primary transition-colors">
                          {app.user.image ? <img src={app.user.image} alt="" className="w-full h-full object-cover" /> : <Users className="text-on-surface/20" />}
                        </div>
                        <div>
                          <h3 className="font-black text-sm tracking-tight uppercase">{app.legal_name || app.pen_name}</h3>
                          <p className="text-[9px] text-on-surface/30 uppercase tracking-widest mt-1">{app.user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(() => updateMonetizationStatus(app.id, "APPROVED"))}
                          className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-lg transition-colors"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleAction(() => updateMonetizationStatus(app.id, "REJECTED"))}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60 flex items-center gap-3">
                <Activity size={14} className="text-primary" />
                Live Flux
              </h2>
              <div className="bg-white border-4 border-on-surface rounded-3xl p-6 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {allStories.slice(0, 5).map((story) => (
                  <div key={story.id} className="flex gap-4 relative">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-on-surface/80 leading-tight">
                        Story Published: <span className="text-primary italic">"{story.title}"</span>
                      </p>
                      <p className="text-[8px] uppercase tracking-widest text-on-surface/30">By {story.author.pen_name || "Unknown"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Creators":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProfiles.map((profile) => (
              <div key={profile.id} className="bg-white border-4 border-on-surface p-6 rounded-3xl hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-on-surface rounded-xl flex items-center justify-center font-black text-on-surface uppercase">
                    {profile.pen_name?.[0] || profile.full_name?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight uppercase group-hover:text-primary transition-colors">{profile.pen_name || profile.full_name || "Anonymous"}</h3>
                    <p className="text-[9px] text-on-surface/30 uppercase tracking-widest">UID: {profile.id.slice(-8)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-on-surface/10">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest">Stories</span>
                      <span className="text-xl font-black">{profile._count.stories}</span>
                   </div>
                   <button className="p-2 bg-on-surface/5 rounded-lg hover:bg-primary text-on-surface/40 hover:text-white transition-all">
                      <ArrowUpRight size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "Chronicles":
        return (
          <div className="flex flex-col gap-4">
            {allStories.map((story) => (
              <div key={story.id} className={`bg-white border-4 border-on-surface p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${story.isBanned ? 'opacity-70 grayscale' : ''}`}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base tracking-tight uppercase">{story.title}</h3>
                    {story.isBanned && (
                      <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">BANNED</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-primary uppercase font-black tracking-widest">{story.author.pen_name || "Unknown"}</span>
                    <span className="text-[9px] text-on-surface/20 uppercase font-black tracking-widest flex items-center gap-1">
                      <Clock size={10} /> {formatDate(story.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="bg-on-surface/5 border-2 border-on-surface px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-on-surface/60 flex items-center">
                    {story.status}
                  </span>
                  {story.isBanned ? (
                    <button 
                      onClick={() => handleAction(() => unbanStory(story.id))}
                      className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:bg-emerald-600 transition-all flex items-center gap-2"
                    >
                      <Unlock size={14} /> Reinstate
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        const reason = window.prompt("Enter ban reason:");
                        if (reason) handleAction(() => banStory(story.id, reason));
                      }}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <AlertOctagon size={14} /> Ban Story
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "Moderation":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60">Quarantined Transmissions</h2>
            {bannedComments.length === 0 ? (
              <div className="p-16 rounded-3xl border-4 border-dashed border-on-surface/5 flex items-center justify-center bg-white">
                <p className="text-on-surface/20 font-black uppercase tracking-widest">No shadowbanned content found.</p>
              </div>
            ) : (
              bannedComments.map((comment) => (
                <div key={comment.id} className="bg-red-500/5 border-2 border-red-500/20 p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 font-black text-xs uppercase">
                        {comment.profile.pen_name?.[0] || "?"}
                      </div>
                      <span className="font-black text-sm uppercase tracking-tight">{comment.profile.pen_name || "Anonymous"}</span>
                    </div>
                    <button className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:underline">Reinstate</button>
                  </div>
                  <p className="text-on-surface/60 italic text-sm font-medium">"{comment.content}"</p>
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/20 font-bold">On Story: {comment.story.title}</p>
                </div>
              ))
            )}
          </div>
        );

      case "Economics":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60">Monetization Protocols</h2>
            <div className="grid grid-cols-1 gap-4">
                {stats.pendingApps.map((app) => (
                  <div key={app.id} className="bg-white border-4 border-on-surface p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-on-surface/5 rounded-xl border-2 border-on-surface flex items-center justify-center overflow-hidden">
                          {app.user.image ? <img src={app.user.image} alt="" className="w-full h-full object-cover" /> : <Users className="text-on-surface/20" />}
                       </div>
                       <div className="flex flex-col gap-1">
                          <h3 className="font-black text-lg tracking-tighter uppercase">{app.legal_name || app.pen_name}</h3>
                          <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest text-on-surface/30">
                             <span>PAN: {app.pan_number || "???"}</span>
                             <span>IFSC: {app.ifsc_code || "???"}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button 
                        onClick={() => handleAction(() => updateMonetizationStatus(app.id, "APPROVED"))}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all"
                       >
                        Approve
                       </button>
                       <button 
                        onClick={() => handleAction(() => updateMonetizationStatus(app.id, "REJECTED"))}
                        className="bg-red-500 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
                       >
                        Reject
                       </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case "Protocols":
        return (
          <div className="bg-white border-4 border-on-surface rounded-3xl p-8 flex flex-col gap-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4 text-primary">
               <Shield size={32} />
               <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter text-on-surface">System Integrity</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 text-on-surface font-bold">All defensive protocols active</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
               <div className="p-6 bg-on-surface/5 rounded-2xl border-2 border-on-surface">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4">Core Settings</h4>
                  <div className="flex flex-col gap-4">
                     <div className="flex justify-between items-center opacity-40">
                        <span className="text-xs font-black uppercase">Maintenance Mode</span>
                        <div className="w-10 h-5 bg-on-surface/10 rounded-full"></div>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase">Public Registration</span>
                        <div className="w-10 h-5 bg-primary rounded-full"></div>
                     </div>
                  </div>
               </div>
               <div className="p-6 bg-on-surface/5 rounded-2xl border-2 border-on-surface">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4">Node Health</h4>
                  <p className="text-[9px] text-on-surface/40 leading-relaxed uppercase tracking-wider font-bold">
                     Database: Connected (Latency: 12ms)<br/>
                     Storage: Operational (R2 Sync Active)<br/>
                     Auth: Redundant (Supabase + NextAuth)
                  </p>
               </div>
            </div>
          </div>
        );

      default:
        return <div>HUB_NOT_FOUND</div>;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex overflow-hidden font-sans selection:bg-primary/30">

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-on-primary rounded-lg border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]"
        aria-label="Open menu"
      >
        <Shield className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Aegis Sidebar */}
      <aside className={`fixed md:relative top-0 left-0 h-screen z-50 w-72 md:w-20 lg:w-64 bg-primary border-r-4 border-on-surface flex flex-col items-start py-8 transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-on-surface flex items-center justify-center rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <Shield className="text-primary w-6 h-6" />
          </div>
          <span className="md:hidden lg:block font-black text-xl tracking-tighter uppercase text-on-surface">AEGIS</span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto p-1 text-on-surface/60 hover:text-on-surface"><XCircle className="w-5 h-5" /></button>
        </div>

        <nav className="flex-grow w-full px-4 flex flex-col gap-2">
          {tabs.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group w-full ${
                activeTab === item.name 
                  ? "bg-on-surface text-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] scale-105" 
                  : "text-on-surface/70 hover:text-on-surface hover:bg-on-surface/10"
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.name ? "animate-pulse" : ""}`} />
              <span className="md:hidden lg:block font-black uppercase tracking-widest text-[10px]">
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        <div className="px-4 w-full">
            <Link href="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface/70 hover:text-on-surface hover:bg-on-surface/10 transition-all w-full">
                <LogOut className="w-5 h-5" />
                <span className="md:hidden lg:block font-black uppercase tracking-widest text-[10px]">Exit Portal</span>
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow ml-0 md:ml-20 lg:ml-0 h-screen overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,#eab30805,transparent)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 flex flex-col gap-8 md:gap-10">
          
          {/* Header Area */}
          <header className="flex justify-between items-start gap-4 pl-12 md:pl-0">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase italic">{activeTab} // Section</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40">Session: {user.name}</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-4">
              <div className="bg-white border-2 border-on-surface px-4 py-2 rounded-lg flex items-center gap-3 group focus-within:border-primary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Search size={16} className="text-on-surface/30 group-focus-within:text-primary" />
                <input 
                  type="text" 
                  placeholder="Query System..." 
                  className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest w-32 placeholder:text-on-surface/20"
                />
              </div>
            </div>
          </header>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Neural Nodes (Users)", value: stats.userCount, icon: Users, trend: "+12%" },
              { label: "Chronicles (Stories)", value: stats.storyCount, icon: FileText, trend: "+5%" },
              { label: "Transmissions (Comments)", value: stats.commentCount, icon: MessageSquare, trend: "+24%" },
              { label: "Awaiting Clearance", value: stats.pendingApps.length, icon: Zap, trend: "ACTIVE", alert: stats.pendingApps.length > 0 },
            ].map((stat) => (
              <div key={stat.label} className={`p-6 rounded-2xl border-4 border-on-surface bg-white relative overflow-hidden group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${stat.alert ? 'ring-2 ring-primary' : ''}`}>
                <stat.icon className="absolute -right-2 -bottom-2 w-20 h-20 text-on-surface/5 group-hover:text-primary/10 transition-colors" />
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">{stat.label}</p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded ${stat.alert ? 'bg-primary text-on-surface' : 'bg-on-surface/5 text-on-surface/40'}`}>{stat.trend}</span>
                </div>
                <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
             {renderContent()}
          </div>

          {/* Live User Track Overlay/Footer */}
          <div className="mt-auto pt-12 border-t-4 border-on-surface/10">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-on-surface/60">Live User Flux // Active Sync</h2>
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">Synchronized: Just Now</span>
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_emerald]"></div>
                </div>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {recentUsers.map((u) => (
                   <div key={u.id} className="flex-shrink-0 bg-white border-2 border-on-surface px-4 py-3 rounded-xl flex items-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default group">
                      <div className="w-8 h-8 rounded-full bg-on-surface/10 overflow-hidden border-2 border-on-surface group-hover:border-primary">
                         {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover" /> : <Users className="p-1.5 text-on-surface/20" />}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-on-surface group-hover:text-primary uppercase tracking-tight">{u.name || "New Explorer"}</span>
                         <span className="text-[8px] uppercase tracking-widest text-on-surface/30 truncate w-24">{u.email.slice(0, 15)}...</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
