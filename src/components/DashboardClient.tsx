"use client";

import { useTransition, useState } from "react";
import { deleteStory, updateStoryStatus } from "@/actions/story";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Book, Trash2, Pause, Play, Edit3, MessageCircle, BarChart, Ghost, ShieldAlert, Flag, Send, Gavel, Scale, Award, Printer, Sparkles, CheckCircle2, Settings, AlertTriangle, TrendingUp, Megaphone, DollarSign, Activity } from "lucide-react";
import { respondToReport, submitAppeal } from "@/actions/moderation";
import { applyForLicense } from "@/actions/licenses";
import LicenseCertificate from "./LicenseCertificate";
import AnalyticsGrimoire from "./AnalyticsGrimoire";
import InteractionChamber from "./InteractionChamber";
import PillarsOfProsperity from "./PillarsOfProsperity";
import TheForge from "./TheForge";
import SettingsForm from "./SettingsForm";
import { deleteAccount } from "@/actions/profile";

interface DashboardClientProps {
    stories: any[];
    profile: any;
    comments: any[];
    reports: any[];
    licenses: any[];
    stats: {
        totalLikes: number;
        totalComments: number;
        totalReads: number;
        totalReadingHours: number;
        monetizationStatus: string;
    }
}

type TabType = "overview" | "manuscripts" | "worldbuilding" | "community" | "marketing" | "monetization" | "legal" | "settings";

export default function DashboardClient({ stories, profile, comments, reports, licenses, stats }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [isPending, startTransition] = useTransition();
    const [deleteRitualId, setDeleteRitualId] = useState<string | null>(null);
    const [showCertificateId, setShowCertificateId] = useState<string | null>(null);
    const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [resonancePendingId, setResonancePendingId] = useState<string | null>(null);
    const [resonanceMappedIds, setResonanceMappedIds] = useState<Set<string>>(new Set());
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    
    const [optimisticStories, setOptimisticStories] = useState(stories);
    const router = useRouter();

    const handleMapResonance = async (story: any) => {
        if (resonancePendingId) return;
        setResonancePendingId(story.id);
        try {
            const textToEmbed = [
                story.title,
                story.description || "",
                story.content?.replace(/<[^>]*>/g, "").slice(0, 2000) || ""
            ].join("\n\n").trim();

            const res = await fetch("/api/ai/embed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textToEmbed, storyId: story.id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to map resonance");
            setResonanceMappedIds(prev => new Set(prev).add(story.id));
        } catch (e: any) {
            alert("Resonance Mapping failed: " + e.message);
        } finally {
            setResonancePendingId(null);
        }
    };

    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const handleToggleStatus = (storyId: string, currentStatus: string) => {
        const newStatus = currentStatus === "PUBLISHED" ? "PAUSED" : "PUBLISHED";
        setOptimisticStories(prev =>
            prev.map(s => s.id === storyId ? { ...s, status: newStatus } : s)
        );
        setPendingStatusId(storyId);
        startTransition(async () => {
            const res = await updateStoryStatus(storyId, newStatus);
            if (res?.error) {
                setOptimisticStories(prev =>
                    prev.map(s => s.id === storyId ? { ...s, status: currentStatus } : s)
                );
                alert(res.error);
            }
            setPendingStatusId(null);
        });
    };

    const handleBurnRitual = (storyId: string) => {
        setOptimisticStories(prev => prev.filter(s => s.id !== storyId));
        setPendingDeleteId(storyId);
        setDeleteRitualId(null);
        startTransition(async () => {
            const res = await deleteStory(storyId);
            if (res?.error) {
                setOptimisticStories(stories);
                alert(res.error);
            }
            setPendingDeleteId(null);
        });
    };

    const handleDeleteAccount = async () => {
        if (confirm("Type 'CONFIRM' to permanently delete your account.")) {
            startTransition(async () => {
                const res = await deleteAccount();
                if (res?.error) {
                    alert(res.error);
                } else {
                    router.push("/");
                }
            });
        }
    };

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center p-20 bg-surface/40 rounded-3xl border-4 border-on-surface/5 border-dashed backdrop-blur-xl w-full">
            <Ghost size={80} className="text-on-surface-variant mb-6 opacity-20" />
            <h3 className="font-headline font-black text-2xl text-on-surface uppercase tracking-widest text-center mb-2">No Records Found</h3>
            <p className="font-body text-on-surface-variant italic text-center max-w-sm">The archives are empty. Time to forge your legacy.</p>
            <Link href="/dashboard/write" className="mt-8 bg-on-surface text-surface font-headline font-black px-10 py-4 uppercase tracking-tighter shadow-[8px_8px_0px_0px_var(--color-primary)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none border-4 border-on-surface transition-all">
                Inscribe First Tale
            </Link>
        </div>
    );

    const tabs = [
        { id: "overview", icon: Activity, label: "Command Center" },
        { id: "manuscripts", icon: Book, label: "Archive" },
        { id: "worldbuilding", icon: Sparkles, label: "The Forge" },
        { id: "community", icon: MessageCircle, label: "Audience" },
        { id: "marketing", icon: Megaphone, label: "Marketing" },
        { id: "monetization", icon: DollarSign, label: "Revenue" },
        { id: "legal", icon: Award, label: "IP Licenses" },
        { id: "settings", icon: Settings, label: "Vault" },
    ];

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-700 w-full mt-8">
            
            {/* Horizontal Command Navigation */}
            <nav className="w-full bg-white border-4 border-on-surface p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-20 z-40 overflow-x-auto scrollbar-hide flex items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-5 py-3 font-headline font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap rounded-sm ${activeTab === tab.id ? 'bg-on-surface text-surface shadow-inner scale-95' : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                <Link href="/dashboard/write" className="hidden lg:flex flex-shrink-0 items-center justify-center gap-2 bg-primary text-on-primary border-4 border-on-surface py-2 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all mr-2">
                    <Plus size={16} />
                    <span className="font-headline font-black text-[10px] uppercase tracking-widest whitespace-nowrap">Start Writing</span>
                </Link>
            </nav>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col min-h-[60vh] pb-24">
                
                {/* COMMAND CENTER TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Quick Stats Banner */}
                        <div className="xl:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Reads", value: stats.totalReads.toLocaleString(), icon: TrendingUp, color: "bg-primary text-on-primary" },
                                { label: "Reading Hrs", value: stats.totalReadingHours.toFixed(1), icon: Activity, color: "bg-white text-on-surface" },
                                { label: "Interactions", value: (stats.totalLikes + stats.totalComments).toLocaleString(), icon: MessageCircle, color: "bg-white text-on-surface" },
                                { label: "Manuscripts", value: optimisticStories.length, icon: Book, color: "bg-on-surface text-surface" }
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.color} border-4 border-on-surface p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-32 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all`}>
                                    <div className="flex justify-between items-start">
                                        <span className="font-label text-[10px] font-black uppercase tracking-widest opacity-80">{stat.label}</span>
                                        <stat.icon size={16} className="opacity-80" />
                                    </div>
                                    <span className="font-headline text-4xl font-black">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Main Analytics Graph */}
                        <div className="xl:col-span-8 bg-surface-container border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <BarChart className="text-primary" size={24} /> Performance Matrix
                            </h2>
                            <AnalyticsGrimoire stories={stories} />
                        </div>

                        {/* Recent Alerts / Quick Actions */}
                        <div className="xl:col-span-4 flex flex-col gap-8">
                            <div className="bg-white border-4 border-on-surface p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
                                <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6 flex items-center gap-3">
                                    <ShieldAlert size={20} className="text-red-500" /> Matrix Alerts
                                </h2>
                                {reports.length > 0 || stories.some(s => s.isBanned) ? (
                                    <div className="flex flex-col gap-4">
                                        <button onClick={() => setActiveTab('community')} className="w-full text-left p-4 bg-red-50 border-2 border-red-500 flex justify-between items-center group">
                                            <span className="font-label text-xs font-black uppercase tracking-widest text-red-600">You have active moderation alerts</span>
                                            <TrendingUp size={16} className="text-red-500 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center border-2 border-dashed border-on-surface/20 flex flex-col items-center justify-center h-48 opacity-60">
                                        <CheckCircle2 size={32} className="mb-2 text-emerald-500" />
                                        <span className="font-label text-[10px] font-black uppercase tracking-widest text-on-surface-variant">All Systems Nominal</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MANUSCRIPTS TAB */}
                {activeTab === 'manuscripts' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-end border-b-4 border-on-surface pb-6 mb-6">
                            <div>
                                <h2 className="font-headline font-black text-4xl uppercase tracking-tighter flex items-center gap-4">
                                    <Book className="text-primary" size={32} /> Manuscript Archive
                                </h2>
                                <p className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Manage your published and draft chronicles</p>
                            </div>
                            <Link href="/dashboard/write" className="hidden sm:flex items-center gap-2 bg-on-surface text-surface px-6 py-3 font-headline font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Plus size={16} /> New Chronicle
                            </Link>
                        </div>

                        {optimisticStories.length === 0 ? <EmptyState /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {optimisticStories.map(story => (
                                    <div key={story.id} className="group bg-surface-container border-4 border-on-surface overflow-hidden hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 relative flex flex-col h-full">
                                        <div className="h-48 relative overflow-hidden border-b-4 border-on-surface flex-shrink-0">
                                            <div
                                                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${story.status === 'PAUSED' ? 'grayscale opacity-40' : ''}`}
                                                style={{ backgroundImage: `url('${story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-90" />
                                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                                <span className={`px-4 py-1.5 font-headline font-black text-[10px] uppercase tracking-widest border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${story.status === 'PUBLISHED' ? 'bg-primary text-on-primary border-on-surface' :
                                                        story.status === 'PAUSED' ? 'bg-amber-500 text-white border-on-surface' :
                                                            'bg-white text-on-surface border-on-surface'
                                                    }`}>
                                                    {story.status}
                                                </span>
                                                {story.isBanned && (
                                                    <span className="px-4 py-1.5 font-headline font-black text-[10px] uppercase tracking-widest bg-red-500 text-white border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                        RESTRICTED
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow bg-white">
                                            <h3 className="font-headline font-black text-2xl text-on-surface uppercase tracking-tight mb-2 line-clamp-1">{story.title}</h3>
                                            <p className="font-body text-xs text-on-surface-variant italic line-clamp-3 mb-6 flex-grow">
                                                {story.description || "A tale yet to be fully inscribed into the obsidian records."}
                                            </p>

                                            <div className="mt-auto flex flex-col gap-3">
                                                <button
                                                    onClick={() => handleMapResonance(story)}
                                                    disabled={!!resonancePendingId || resonanceMappedIds.has(story.id)}
                                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-headline font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:cursor-not-allowed border-2 ${
                                                        resonanceMappedIds.has(story.id)
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]"
                                                            : resonancePendingId === story.id
                                                            ? "bg-primary/10 text-primary border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
                                                            : "bg-surface text-on-surface border-on-surface hover:bg-primary hover:text-on-primary hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                                    }`}
                                                >
                                                    {resonanceMappedIds.has(story.id) ? (
                                                        <><CheckCircle2 size={14} /> Resonance Mapped</>  
                                                    ) : resonancePendingId === story.id ? (
                                                        <><Sparkles size={14} className="animate-spin" /> Computing...</>
                                                    ) : (
                                                        <><Sparkles size={14} /> Map Resonance</>
                                                    )}
                                                </button>
                                                
                                                <div className="grid grid-cols-3 gap-2 mt-2">
                                                    <Link href={`/dashboard/write?id=${story.id}`} className="flex justify-center items-center p-3 border-2 border-on-surface/10 hover:border-on-surface hover:bg-primary hover:text-on-primary text-on-surface-variant transition-all active:scale-90" title="Edit">
                                                        <Edit3 size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(story.id, story.status)}
                                                        disabled={pendingStatusId === story.id}
                                                        className="flex justify-center items-center p-3 border-2 border-on-surface/10 hover:border-on-surface hover:bg-amber-500 hover:text-white text-on-surface-variant transition-all active:scale-90 disabled:opacity-40"
                                                        title={story.status === 'PUBLISHED' ? 'Pause' : 'Publish'}
                                                    >
                                                        {story.status === 'PUBLISHED' ? <Pause size={16} /> : <Play size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteRitualId(story.id)}
                                                        disabled={pendingDeleteId === story.id}
                                                        className="flex justify-center items-center p-3 border-2 border-on-surface/10 hover:border-red-500 hover:bg-red-500 hover:text-white text-on-surface-variant transition-all active:scale-90 disabled:opacity-40"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* WORLDBUILDING TAB */}
                {activeTab === 'worldbuilding' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col border-b-4 border-on-surface pb-6 mb-6">
                            <h2 className="font-headline font-black text-4xl uppercase tracking-tighter flex items-center gap-4">
                                <Sparkles className="text-primary" size={32} /> The Forge
                            </h2>
                            <p className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Generate world lore, characters, and environments using the AI Matrix.</p>
                        </div>
                        <TheForge />
                    </div>
                )}

                {/* COMMUNITY & MOD TAB */}
                {activeTab === 'community' && (
                    <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <div className="flex flex-col border-b-4 border-on-surface pb-6 mb-8">
                                <h2 className="font-headline font-black text-4xl uppercase tracking-tighter flex items-center gap-4">
                                    <MessageCircle className="text-primary" size={32} /> Audience Hub
                                </h2>
                                <p className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Engage with your readers and monitor community health.</p>
                            </div>
                            <div className="bg-white border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <InteractionChamber comments={comments} />
                            </div>
                        </section>

                        <section>
                            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter border-b-4 border-red-500 pb-4 mb-8 flex items-center gap-4 text-red-500">
                                <ShieldAlert size={28} /> Moderation Desk
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Reports */}
                                <div className="bg-white border-4 border-on-surface p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
                                    <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6 flex items-center gap-3">
                                        <Flag size={20} className="text-primary" /> Incident Reports
                                    </h3>
                                    <div className="flex flex-col gap-4 flex-grow">
                                        {reports.length === 0 ? (
                                            <div className="flex-grow flex items-center justify-center p-8 border-2 border-dashed border-on-surface/20">
                                                <p className="text-on-surface-variant font-label text-[10px] uppercase font-black tracking-widest opacity-60">No pending incident reports</p>
                                            </div>
                                        ) : (
                                            reports.map(report => (
                                                <div key={report.id} className="p-5 bg-surface border-2 border-on-surface flex flex-col gap-3 relative group hover:-translate-y-1 transition-transform">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                                    <div className="flex justify-between items-start pl-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1">{report.reason}</span>
                                                        <span className="text-[8px] font-bold text-on-surface/40 uppercase tracking-widest">{formatDate(report.createdAt)}</span>
                                                    </div>
                                                    <p className="text-xs font-black uppercase text-on-surface/80 pl-2">Story: {report.story.title}</p>
                                                    <p className="text-sm font-body italic pl-2 text-on-surface-variant">"{report.details || "No details provided"}"</p>

                                                    {report.authorResponse ? (
                                                        <div className="mt-3 p-4 bg-primary/5 border-l-2 border-primary ml-2">
                                                            <p className="text-[9px] font-black uppercase text-primary mb-1">Your Response:</p>
                                                            <p className="text-xs italic text-on-surface-variant">"{report.authorResponse}"</p>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                const response = window.prompt("Respond to this report (this will be seen by the staff):");
                                                                if (response) respondToReport(report.id, response).then(res => res.success && router.refresh());
                                                            }}
                                                            className="mt-3 ml-2 text-[10px] font-black uppercase tracking-widest text-on-surface bg-primary px-3 py-2 border-2 border-on-surface hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 max-w-fit"
                                                        >
                                                            Defend Claim <Send size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Banned Stories & Appeals */}
                                <div className="bg-red-50 border-4 border-red-500 p-6 sm:p-8 shadow-[8px_8px_0px_0px_#ef4444] flex flex-col h-full">
                                    <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6 flex items-center gap-3 text-red-600">
                                        <Gavel size={20} /> Restrictive Actions
                                    </h3>
                                    <div className="flex flex-col gap-4 flex-grow">
                                        {stories.filter(s => s.isBanned).length === 0 ? (
                                            <div className="flex-grow flex items-center justify-center p-8 border-2 border-dashed border-red-500/20">
                                                <p className="text-red-500 font-label text-[10px] uppercase font-black tracking-widest opacity-60">All chronicles in good standing</p>
                                            </div>
                                        ) : (
                                            stories.filter(s => s.isBanned).map(story => (
                                                <div key={story.id} className="p-5 bg-white border-2 border-red-500 flex flex-col gap-3 shadow-[4px_4px_0px_0px_#ef4444]">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-black text-sm uppercase text-red-600">{story.title}</h4>
                                                        <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">BANNED</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-red-500/80">Reason: {story.banReason}</p>

                                                    {!story.isPermanentBan && (
                                                        <div className="mt-4 pt-4 border-t-2 border-red-500/20">
                                                            <p className="text-[10px] font-black uppercase text-red-600 mb-3 flex items-center gap-2">
                                                                <Scale size={12} /> Appeal Status: {story.appealStatus}
                                                            </p>
                                                            {story.appealStatus === 'NONE' ? (
                                                                <div className="flex flex-col gap-3">
                                                                    <p className="text-[10px] font-bold text-red-500/60 uppercase">
                                                                        Window closes: {story.banExpiresAt ? formatDate(story.banExpiresAt) : "N/A"}
                                                                    </p>
                                                                    <button
                                                                        onClick={() => {
                                                                            const appeal = window.prompt("Enter your appeal (state why this story should be reinstated):");
                                                                            if (appeal) submitAppeal(story.id, appeal).then(res => res.success ? router.refresh() : alert(res.error));
                                                                        }}
                                                                        className="bg-red-500 text-white text-xs font-black uppercase py-3 border-2 border-red-700 shadow-[4px_4px_0px_0px_#b91c1c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                                                                    >
                                                                        Submit Appeal
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs italic font-bold text-red-500/80 bg-red-50 p-3 border-2 border-red-200">
                                                                    {story.appealStatus === 'SUBMITTED' ? "Your appeal is currently under review by the High Council." :
                                                                        story.appealStatus === 'REJECTED' ? "Your appeal was rejected. This chronicle is now under a permanent ban." :
                                                                            "Your appeal was accepted. The chronicle should be reinstated shortly."}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                    {story.isPermanentBan && (
                                                        <div className="mt-4 p-4 bg-red-600 border-2 border-black text-center shadow-inner">
                                                            <p className="text-sm font-black uppercase text-white tracking-widest">PERMANENT BAN</p>
                                                            <p className="text-[10px] text-white/80 mt-1 uppercase font-bold tracking-wider">Chronicle Struck from Records</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* MARKETING TAB (NEW) */}
                {activeTab === 'marketing' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col border-b-4 border-on-surface pb-6 mb-6">
                            <h2 className="font-headline font-black text-4xl uppercase tracking-tighter flex items-center gap-4">
                                <Megaphone className="text-primary" size={32} /> Marketing Deck
                            </h2>
                            <p className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Tools to amplify your reach and grow your audience.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-surface-container border-4 border-on-surface p-8 flex flex-col justify-center items-center text-center h-64 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <Ghost size={48} className="text-primary mb-4 opacity-50" />
                                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-2">Ad Campaigns</h3>
                                <p className="font-body text-xs text-on-surface-variant mb-4">Promote your chronicles across the SOULPAD network.</p>
                                <span className="bg-primary/20 text-primary font-label font-black text-[10px] uppercase tracking-widest px-3 py-1 border-2 border-primary">Coming Soon</span>
                            </div>
                            <div className="bg-white border-4 border-on-surface p-8 flex flex-col justify-center items-center text-center h-64 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <TrendingUp size={48} className="text-on-surface mb-4 opacity-30" />
                                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-2">Promo Links</h3>
                                <p className="font-body text-xs text-on-surface-variant mb-4">Generate traceable links for external social media.</p>
                                <span className="bg-on-surface/10 text-on-surface font-label font-black text-[10px] uppercase tracking-widest px-3 py-1 border-2 border-on-surface">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* MONETIZATION TAB (NEW) */}
                {activeTab === 'monetization' && (
                    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col border-b-4 border-on-surface pb-6 mb-2">
                            <h2 className="font-headline font-black text-4xl uppercase tracking-tighter flex items-center gap-4">
                                <DollarSign className="text-amber-500" size={32} /> Revenue Desk
                            </h2>
                            <p className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Track earnings and manage your monetization eligibility.</p>
                        </div>

                        <section>
                            <PillarsOfProsperity
                                reads={stats.totalReads}
                                hours={stats.totalReadingHours}
                                comments={stats.totalComments}
                                status={stats.monetizationStatus}
                            />
                        </section>

                        <section className="bg-white border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center justify-center py-20">
                            <h3 className="font-headline font-black text-6xl uppercase tracking-tighter mb-4 text-on-surface/20">0.00 <span className="text-2xl">SOULS</span></h3>
                            <p className="font-body font-bold text-on-surface-variant uppercase tracking-widest text-xs mb-6">Current Cycle Earnings</p>
                            <button className="bg-surface text-on-surface-variant border-4 border-on-surface px-8 py-3 font-headline font-black text-xs uppercase tracking-widest opacity-50 cursor-not-allowed">
                                Payout Unavailable
                            </button>
                        </section>
                    </div>
                )}

                {/* LEGAL TAB */}
                {activeTab === 'legal' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col border-b-4 border-on-surface pb-6 mb-6">
                            <h2 className="font-headline font-black text-4xl uppercase tracking-tighter flex items-center gap-4">
                                <Award className="text-primary" size={32} /> Codex Registry
                            </h2>
                            <p className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Manage your IP licenses and official storytelling certificates.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Apply for License */}
                            <div className="lg:col-span-5 bg-white border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-8">Register Chronicle</h3>
                                <form className="flex flex-col gap-6" onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data = {
                                        storyId: formData.get('storyId') as string,
                                        legalName: formData.get('legalName') as string,
                                        licenseType: formData.get('licenseType') as string,
                                        details: formData.get('details') as string,
                                    };
                                    const res = await applyForLicense(data);
                                    if (res.success) router.refresh();
                                    else alert(res.error);
                                }}>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-on-surface">Select Manuscript</label>
                                        <select name="storyId" required className="w-full bg-surface border-4 border-on-surface p-4 font-headline font-black uppercase text-sm outline-none focus:bg-primary-container transition-colors cursor-pointer">
                                            {stories.filter(s => !licenses.some(l => l.storyId === s.id)).map(s => (
                                                <option key={s.id} value={s.id}>{s.title}</option>
                                            ))}
                                            {stories.filter(s => !licenses.some(l => l.storyId === s.id)).length === 0 && (
                                                <option value="" disabled>No eligible manuscripts</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-on-surface">Legal Full Name</label>
                                        <input name="legalName" required type="text" className="w-full bg-surface border-4 border-on-surface p-4 font-headline font-black uppercase text-sm outline-none focus:bg-primary-container transition-colors" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-on-surface">License Tier</label>
                                        <select name="licenseType" required className="w-full bg-surface border-4 border-on-surface p-4 font-headline font-black uppercase text-sm outline-none focus:bg-primary-container transition-colors cursor-pointer">
                                            <option value="Standard Chronicle License">Standard Chronicle License</option>
                                            <option value="Premium Author License">Premium Author License</option>
                                            <option value="Exclusive IP Registry">Exclusive IP Registry</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-on-surface">Creative Details</label>
                                        <textarea name="details" className="w-full bg-surface border-4 border-on-surface p-4 font-body text-sm outline-none focus:bg-primary-container transition-colors min-h-[120px] resize-none" placeholder="Briefly describe the unique aspects of this chronicle..."></textarea>
                                    </div>
                                    <button type="submit" className="bg-primary text-on-primary font-headline font-black py-5 uppercase tracking-widest border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-4 w-full text-sm">
                                        Submit Application
                                    </button>
                                </form>
                            </div>

                            {/* My Licenses */}
                            <div className="lg:col-span-7 bg-surface-container border-4 border-on-surface/10 p-8 shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 font-headline font-black text-6xl uppercase tracking-tighter text-on-surface/5 select-none pointer-events-none">CERTIFICATES</div>
                                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-8 relative z-10">Verified Certificates</h3>
                                <div className="grid grid-cols-1 gap-6 relative z-10">
                                    {licenses.length === 0 ? (
                                        <div className="p-12 text-center bg-white border-4 border-dashed border-on-surface/20">
                                            <p className="text-on-surface/40 font-black uppercase tracking-widest text-sm">No licenses issued yet.</p>
                                        </div>
                                    ) : (
                                        licenses.map(license => (
                                            <div key={license.id} className="bg-white border-4 border-on-surface p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="font-headline font-black text-xl uppercase tracking-tight text-on-surface">{license.story.title}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border-2 ${license.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-500' :
                                                                license.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-500' :
                                                                    'bg-red-100 text-red-700 border-red-500'
                                                            }`}>
                                                            {license.status}
                                                        </span>
                                                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{license.licenseType}</p>
                                                    </div>
                                                </div>

                                                {license.status === 'APPROVED' && (
                                                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                                                        <p className="text-[9px] font-black uppercase text-on-surface/40 tracking-widest hidden sm:block">ID: {license.licenseNumber}</p>
                                                        <button
                                                            onClick={() => setShowCertificateId(license.id)}
                                                            className="flex justify-center w-full sm:w-auto items-center gap-2 bg-on-surface text-surface px-6 py-3 font-headline font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors border-2 border-transparent"
                                                        >
                                                            <Award size={14} /> View Document
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <div className="flex flex-col border-b-4 border-on-surface pb-6 mb-8">
                                <h2 className="font-headline font-black text-4xl uppercase tracking-tighter flex items-center gap-4">
                                    <Settings className="text-primary" size={32} /> Vault Configuration
                                </h2>
                                <p className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Manage your core identity and system preferences.</p>
                            </div>
                            <SettingsForm profile={{ pen_name: profile.pen_name, full_name: profile.full_name, age: profile.age, bio: profile.bio, avatar_url: profile.avatar_url, username: profile.username, faction: profile.faction }} />
                        </section>

                        <section className="mb-24">
                            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter border-b-4 border-red-500 pb-4 mb-8 flex items-center gap-4 text-red-500">
                                <AlertTriangle size={28} /> Danger Zone
                            </h2>
                            <div className="bg-red-50 border-4 border-red-500 p-8 shadow-[8px_8px_0px_0px_#ef4444] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-red-600 mb-2">Delete Account</h3>
                                    <p className="font-body text-red-500/80 font-bold max-w-xl">
                                        Permanently burn your author profile, all manuscripts, echoes, and interactions from the database. This action cannot be reversed.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDeleteAccountModal(true)}
                                    className="bg-red-500 text-white font-headline font-black px-8 py-4 uppercase tracking-widest border-4 border-red-700 shadow-[4px_4px_0px_0px_#b91c1c] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex-shrink-0"
                                >
                                    Burn Account
                                </button>
                            </div>
                        </section>
                    </div>
                )}

            </div>

            {/* Certificate Modal */}
            {showCertificateId && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto p-4 sm:p-12 scrollbar-hide flex flex-col items-center">
                        <button
                            onClick={() => setShowCertificateId(null)}
                            className="absolute top-4 right-4 bg-white text-on-surface w-14 h-14 border-4 border-on-surface flex items-center justify-center font-headline font-black text-xl hover:bg-primary hover:text-on-primary transition-colors z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                            X
                        </button>
                        <div className="flex flex-col items-center gap-8 w-full">
                            {(() => {
                                const license = licenses.find(l => l.id === showCertificateId);
                                return <LicenseCertificate license={license} story={license.story} profile={profile} />;
                            })()}
                            <button
                                onClick={() => window.print()}
                                className="bg-primary text-on-primary px-12 py-5 border-4 border-on-surface font-headline font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3 mt-4"
                            >
                                <Printer size={20} /> Print Formal Certificate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteAccountModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0a0b]/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                    <div className="max-w-md w-full bg-white border-4 border-red-500 p-10 shadow-[16px_16px_0px_0px_#ef4444] text-center">
                        <div className="w-24 h-24 bg-red-100 border-4 border-red-500 text-red-500 flex items-center justify-center mx-auto mb-8 animate-pulse shadow-[4px_4px_0px_0px_#ef4444]">
                            <AlertTriangle size={48} />
                        </div>
                        <h3 className="font-headline font-black text-4xl text-on-surface uppercase tracking-tight mb-4 leading-none">Total Erasure</h3>
                        <p className="font-body text-on-surface-variant italic mb-10 leading-relaxed text-base font-bold">
                            "Are you absolutely certain? This will annihilate your profile, manuscripts, and legacy forever."
                        </p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isPending}
                                className="bg-red-500 text-white font-headline font-black py-5 uppercase tracking-widest border-4 border-red-700 shadow-[6px_6px_0px_0px_#b91c1c] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                            >
                                {isPending ? "Erasing..." : "Obliterate My Account"}
                            </button>
                            <button
                                onClick={() => setShowDeleteAccountModal(false)}
                                className="bg-surface text-on-surface font-headline font-black py-5 uppercase tracking-widest border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                            >
                                Step Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
