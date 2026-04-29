"use client";

import { useTransition, useState } from "react";
import { deleteStory, updateStoryStatus } from "@/actions/story";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Book, Trash2, Pause, Play, Edit3, MessageCircle, BarChart, Ghost, ShieldAlert, Flag, Send, Gavel, Scale, Award, Download, Printer } from "lucide-react";
import { respondToReport, submitAppeal } from "@/actions/moderation";
import { applyForLicense } from "@/actions/licenses";
import LicenseCertificate from "./LicenseCertificate";
import AnalyticsGrimoire from "./AnalyticsGrimoire";
import InteractionChamber from "./InteractionChamber";
import PillarsOfProsperity from "./PillarsOfProsperity";

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

export default function DashboardClient({ stories, profile, comments, reports, licenses, stats }: DashboardClientProps) {
    const [isPending, startTransition] = useTransition();
    const [deleteRitualId, setDeleteRitualId] = useState<string | null>(null);
    const [showCertificateId, setShowCertificateId] = useState<string | null>(null);
    const router = useRouter();

    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const handleToggleStatus = (storyId: string, currentStatus: string) => {
        startTransition(async () => {
            const newStatus = currentStatus === "PUBLISHED" ? "PAUSED" : "PUBLISHED";
            await updateStoryStatus(storyId, newStatus);
        });
    };

    const handleBurnRitual = (storyId: string) => {
        startTransition(async () => {
            await deleteStory(storyId);
            setDeleteRitualId(null);
        });
    };

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center p-20 bg-surface/20 rounded-2xl border-2 border-on-surface/5 backdrop-blur-xl">
            <Ghost size={80} className="text-on-surface-variant mb-6 opacity-20" />
            <h3 className="font-headline font-black text-2xl text-on-surface uppercase tracking-widest text-center mb-2">The stars are silent.</h3>
            <p className="font-body text-on-surface-variant italic text-center max-w-sm">Begin your first chronicle and wake the universe from its slumber.</p>
            <Link href="/dashboard/write" className="mt-8 bg-primary text-on-primary font-headline font-black px-10 py-4 uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Inscribe First Tale
            </Link>
        </div>
    );

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-700">
            {/* Ink-Well Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 overflow-hidden">
                <div className="relative">
                    <span className="absolute -left-4 top-0 w-1 h-full bg-primary/20"></span>
                    <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none selection:bg-primary selection:text-on-primary">The Obsidian Desk</h1>
                    <p className="font-label font-bold text-on-surface-variant text-sm uppercase tracking-[0.3em] mt-4 opacity-60">Architect: <span className="text-primary">{profile.pen_name || "Unknown Author"}</span></p>
                </div>
                <Link href="/dashboard/write" className="group flex items-center gap-4 bg-surface-container-high border-2 border-on-surface/10 px-8 py-4 rounded-xl hover:border-primary/50 transition-all duration-500 shadow-2xl">
                    <div className="p-3 bg-primary rounded-lg shadow-inner group-hover:scale-110 transition-transform">
                        <Plus size={20} className="text-on-primary" />
                    </div>
                    <div className="text-left">
                        <p className="font-headline font-black text-lg text-on-surface uppercase tracking-tight">Quick Draft</p>
                        <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest leading-none">New Chronicle</p>
                    </div>
                </Link>
            </header>

            {/* Bento Grid Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-min">

                {/* Performance Grimoire (Top Section) */}
                <section className="lg:col-span-12">
                    <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-6 flex items-center gap-4">
                        <BarChart size={14} className="text-primary" />
                        Performance Grimoire
                    </h2>
                    <AnalyticsGrimoire stories={stories} />
                </section>

                {/* The Three Pillars (Monetization Eligibility) */}
                <section className="lg:col-span-12">
                    <PillarsOfProsperity
                        reads={stats.totalReads}
                        hours={stats.totalReadingHours}
                        comments={stats.totalComments}
                        status={stats.monetizationStatus}
                    />
                </section>

                {/* Manuscript Management (Main Area) */}
                <section className="lg:col-span-8 flex flex-col gap-8">
                    <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-2 flex items-center gap-4">
                        <Book size={14} className="text-primary" />
                        Manuscripts Management
                    </h2>

                    {stories.length === 0 ? <EmptyState /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stories.map(story => (
                                <div key={story.id} className="group bg-surface-container-high border-2 border-on-surface/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 relative flex flex-col">
                                    {/* Visual Indicator */}
                                    <div className="h-40 relative overflow-hidden">
                                        <div
                                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${story.status === 'PAUSED' ? 'grayscale opacity-40' : ''}`}
                                            style={{ backgroundImage: `url('${story.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent opacity-80" />

                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <span className={`px-3 py-1 rounded-full font-label font-black text-[8px] uppercase tracking-widest border border-white/10 backdrop-blur-md ${story.status === 'PUBLISHED' ? 'bg-primary/20 text-primary border-primary/30' :
                                                    story.status === 'PAUSED' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                                        'bg-on-surface/20 text-on-surface'
                                                }`}>
                                                {story.status}
                                            </span>
                                            {story.isBanned && (
                                                <span className="px-3 py-1 rounded-full font-label font-black text-[8px] uppercase tracking-widest bg-red-500 text-white border border-red-600">
                                                    BANNED
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow relative -mt-8">
                                        <h3 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight mb-2 selection:bg-primary line-clamp-1">{story.title}</h3>
                                        <p className="font-body text-xs text-on-surface-variant italic line-clamp-2 mb-6 opacity-70">
                                            {story.description || "A tale yet to be fully inscribed into the obsidian records."}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-on-surface/5">
                                            <div className="flex gap-4">
                                                <Link href={`/dashboard/write?id=${story.id}`} className="p-2 hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors transition-transform active:scale-90" title="Continue Inscribing">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleStatus(story.id, story.status)}
                                                    className="p-2 hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors transition-transform active:scale-90"
                                                    title={story.status === 'PUBLISHED' ? 'Pause Chronicle' : 'Rise Chronicle'}
                                                >
                                                    {story.status === 'PUBLISHED' ? <Pause size={18} /> : <Play size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteRitualId(story.id)}
                                                    className="p-2 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors transition-transform active:scale-90"
                                                    title="Burn Ritual"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">
                                                {story._count?.likes || 0} Souls Loved
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Interaction Chamber (Side Area) */}
                <section className="lg:col-span-4 flex flex-col gap-8">
                    <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-2 flex items-center gap-4">
                        <MessageCircle size={14} className="text-primary" />
                        Interaction Chamber
                    </h2>
                    <InteractionChamber comments={comments} />
                </section>

                {/* Moderation Center */}
                <section className="lg:col-span-12 flex flex-col gap-8 mt-12">
                    <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-2 flex items-center gap-4">
                        <ShieldAlert size={14} className="text-red-500" />
                        Moderation Center
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Reports on your stories */}
                        <div className="bg-white border-4 border-on-surface p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <Flag size={20} className="text-primary" />
                                Incident Reports
                            </h3>

                            <div className="flex flex-col gap-4">
                                {reports.length === 0 ? (
                                    <p className="text-on-surface/40 italic font-medium">No reports filed against your chronicles.</p>
                                ) : (
                                    reports.map(report => (
                                        <div key={report.id} className="p-4 bg-on-surface/5 border-2 border-on-surface rounded-xl flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{report.reason}</span>
                                                <span className="text-[8px] font-bold text-on-surface/30">{formatDate(report.createdAt)}</span>
                                            </div>
                                            <p className="text-xs font-black uppercase text-on-surface/60">Story: {report.story.title}</p>
                                            <p className="text-sm font-medium italic">"{report.details || "No details provided"}"</p>

                                            {report.authorResponse ? (
                                                <div className="mt-2 p-3 bg-white border-2 border-on-surface/10 rounded-lg">
                                                    <p className="text-[9px] font-black uppercase text-primary mb-1">Your Response:</p>
                                                    <p className="text-xs italic">"{report.authorResponse}"</p>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        const response = window.prompt("Respond to this report (this will be seen by the staff):");
                                                        if (response) respondToReport(report.id, response).then(res => res.success && router.refresh());
                                                    }}
                                                    className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2"
                                                >
                                                    Respond to Report <Send size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Banned Stories & Appeals */}
                        <div className="bg-white border-4 border-on-surface p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <Gavel size={20} className="text-red-500" />
                                Restrictive Actions
                            </h3>

                            <div className="flex flex-col gap-4">
                                {stories.filter(s => s.isBanned).length === 0 ? (
                                    <p className="text-on-surface/40 italic font-medium">All your chronicles are in good standing.</p>
                                ) : (
                                    stories.filter(s => s.isBanned).map(story => (
                                        <div key={story.id} className="p-4 bg-red-50 border-2 border-red-500/20 rounded-xl flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-black text-sm uppercase text-red-700">{story.title}</h4>
                                                <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">BANNED</span>
                                            </div>
                                            <p className="text-xs font-medium text-red-900/60">Reason: {story.banReason}</p>

                                            {!story.isPermanentBan && (
                                                <div className="mt-2 p-4 bg-white border-2 border-red-500/10 rounded-xl">
                                                    <p className="text-[10px] font-black uppercase text-red-500 mb-2 flex items-center gap-2">
                                                        <Scale size={12} /> Appeal Status: {story.appealStatus}
                                                    </p>

                                                    {story.appealStatus === 'NONE' ? (
                                                        <div className="flex flex-col gap-3">
                                                            <p className="text-[10px] font-medium text-on-surface/60">
                                                                Appeal window closes: {story.banExpiresAt ? formatDate(story.banExpiresAt) : "N/A"}
                                                            </p>
                                                            <button
                                                                onClick={() => {
                                                                    const appeal = window.prompt("Enter your appeal (state why this story should be reinstated):");
                                                                    if (appeal) submitAppeal(story.id, appeal).then(res => res.success ? router.refresh() : alert(res.error));
                                                                }}
                                                                className="bg-primary text-on-primary text-[10px] font-black uppercase py-2 rounded-lg border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                                                            >
                                                                Submit Appeal (180 Days)
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs italic text-on-surface/60">
                                                            {story.appealStatus === 'SUBMITTED' ? "Your appeal is currently under review by the High Council." :
                                                                story.appealStatus === 'REJECTED' ? "Your appeal was rejected. This chronicle is now under a permanent ban." :
                                                                    "Your appeal was accepted. The chronicle should be reinstated shortly."}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {story.isPermanentBan && (
                                                <div className="mt-2 p-4 bg-red-100 border-2 border-red-500 rounded-xl text-center">
                                                    <p className="text-xs font-black uppercase text-red-700">PERMANENT BAN</p>
                                                    <p className="text-[10px] text-red-700/60 mt-1 italic">This chronicle has been struck from the records forever.</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* License Center */}
                <section className="lg:col-span-12 flex flex-col gap-8 mt-12 mb-20">
                    <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-2 flex items-center gap-4">
                        <Award size={14} className="text-primary" />
                        Codex Registry // License Center
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Apply for License */}
                        <div className="lg:col-span-4 bg-white border-4 border-on-surface p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6">Register Chronicle</h3>
                            <form className="flex flex-col gap-5" onSubmit={async (e) => {
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Select Manuscript</label>
                                    <select name="storyId" required className="w-full bg-on-surface/5 border-2 border-on-surface p-3 rounded-xl font-black uppercase text-xs outline-none focus:border-primary">
                                        {stories.filter(s => !licenses.some(l => l.storyId === s.id)).map(s => (
                                            <option key={s.id} value={s.id}>{s.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Legal Full Name</label>
                                    <input name="legalName" required type="text" className="w-full bg-on-surface/5 border-2 border-on-surface p-3 rounded-xl font-black uppercase text-xs outline-none focus:border-primary" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">License Tier</label>
                                    <select name="licenseType" required className="w-full bg-on-surface/5 border-2 border-on-surface p-3 rounded-xl font-black uppercase text-xs outline-none focus:border-primary">
                                        <option value="Standard Chronicle License">Standard Chronicle License</option>
                                        <option value="Premium Author License">Premium Author License</option>
                                        <option value="Exclusive IP Registry">Exclusive IP Registry</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Creative Details</label>
                                    <textarea name="details" className="w-full bg-on-surface/5 border-2 border-on-surface p-3 rounded-xl font-black text-xs outline-none focus:border-primary min-h-[100px]" placeholder="Briefly describe the unique aspects of this chronicle..."></textarea>
                                </div>
                                <button type="submit" className="bg-primary text-on-primary font-headline font-black py-4 uppercase tracking-tighter rounded-xl border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-4">
                                    Submit Application
                                </button>
                            </form>
                        </div>

                        {/* My Licenses */}
                        <div className="lg:col-span-8 bg-white border-4 border-on-surface p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6">Verified Certificates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {licenses.length === 0 ? (
                                    <div className="md:col-span-2 p-12 text-center bg-on-surface/5 rounded-2xl border-4 border-dashed border-on-surface/10">
                                        <p className="text-on-surface/20 font-black uppercase tracking-widest italic">No licenses issued yet. Submit your first application.</p>
                                    </div>
                                ) : (
                                    licenses.map(license => (
                                        <div key={license.id} className="group bg-on-surface/5 border-2 border-on-surface p-6 rounded-2xl flex flex-col gap-4 relative hover:bg-white transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-black text-sm uppercase tracking-tight text-on-surface">{license.story.title}</h4>
                                                    <p className="text-[9px] font-bold text-on-surface/40 uppercase tracking-widest">{license.licenseType}</p>
                                                </div>
                                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded border-2 ${license.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                        license.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                            'bg-red-100 text-red-700 border-red-200'
                                                    }`}>
                                                    {license.status}
                                                </span>
                                            </div>

                                            {license.status === 'APPROVED' && (
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-on-surface/10">
                                                    <p className="text-[8px] font-black uppercase text-on-surface/40 tracking-widest">ID: {license.licenseNumber}</p>
                                                    <button
                                                        onClick={() => setShowCertificateId(license.id)}
                                                        className="flex items-center gap-2 bg-on-surface text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-surface transition-all"
                                                    >
                                                        <Award size={14} /> View Certificate
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Certificate Modal */}
                {showCertificateId && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                        <div className="relative max-h-screen overflow-y-auto p-12 scrollbar-hide">
                            <button
                                onClick={() => setShowCertificateId(null)}
                                className="absolute top-4 right-4 bg-white text-on-surface w-12 h-12 rounded-full border-4 border-on-surface flex items-center justify-center font-black hover:scale-110 transition-transform z-10"
                            >
                                X
                            </button>
                            <div className="flex flex-col items-center gap-8">
                                {(() => {
                                    const license = licenses.find(l => l.id === showCertificateId);
                                    return <LicenseCertificate license={license} story={license.story} profile={profile} />;
                                })()}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => window.print()}
                                        className="bg-primary text-on-surface px-10 py-4 rounded-xl border-4 border-on-surface font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3"
                                    >
                                        <Printer size={20} /> Print Certificate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Delete Ritual Modal */}
            {deleteRitualId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0a0b]/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                    <div className="max-w-md w-full bg-surface-container-high border-2 border-error/20 p-10 rounded-3xl shadow-2xl text-center">
                        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <Trash2 size={40} />
                        </div>
                        <h3 className="font-headline font-black text-3xl text-on-surface uppercase tracking-tight mb-4">The Final Ember</h3>
                        <p className="font-body text-on-surface-variant italic mb-10 leading-relaxed text-lg">"Are you sure you want to burn this tale forever? Once reduced to ash, no ritual can bring it back."</p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => handleBurnRitual(deleteRitualId)}
                                disabled={isPending}
                                className="bg-error text-on-error font-headline font-black py-4 uppercase tracking-tighter rounded-xl hover:bg-error/80 transition-all disabled:opacity-50"
                            >
                                Burn the Chronicle
                            </button>
                            <button
                                onClick={() => setDeleteRitualId(null)}
                                className="font-headline font-black py-4 uppercase tracking-tighter text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                                Keep the Scroll
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
