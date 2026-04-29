"use client";

import { useState } from "react";
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle, Loader2, Shield, ChevronDown, ChevronUp } from "lucide-react";

interface OriginalityReport {
    originalityScore: number;
    verdict: "ORIGINAL" | "LIKELY_ORIGINAL" | "SUSPICIOUS" | "HIGH_RISK";
    summary: string;
    flags: Array<{ type: string; description: string; severity: "LOW" | "MEDIUM" | "HIGH" }>;
    strengths: string[];
    recommendation: "PUBLISH" | "REVIEW_FURTHER" | "DO_NOT_PUBLISH";
}

interface Props {
    content: string;
    title: string;
    storyId?: string;
    initialReport?: OriginalityReport | null;
}

const VERDICT_CONFIG = {
    ORIGINAL: {
        label: "Original Work",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-500",
        icon: CheckCircle,
        iconColor: "text-emerald-500"
    },
    LIKELY_ORIGINAL: {
        label: "Likely Original",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-400",
        icon: ShieldCheck,
        iconColor: "text-blue-500"
    },
    SUSPICIOUS: {
        label: "Suspicious",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-500",
        icon: AlertTriangle,
        iconColor: "text-amber-500"
    },
    HIGH_RISK: {
        label: "High Risk",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-500",
        icon: XCircle,
        iconColor: "text-red-500"
    },
};

const SEVERITY_COLORS = {
    LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
    HIGH: "bg-red-100 text-red-700 border-red-200",
};

const RECOMMENDATION_CONFIG = {
    PUBLISH: { label: "Safe to Publish", color: "text-emerald-700 bg-emerald-100 border-emerald-300" },
    REVIEW_FURTHER: { label: "Review Further Before Publishing", color: "text-amber-700 bg-amber-100 border-amber-300" },
    DO_NOT_PUBLISH: { label: "Do Not Publish", color: "text-red-700 bg-red-100 border-red-300" },
};

export default function OriginalityChecker({ content, title, storyId, initialReport }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<OriginalityReport | null>(initialReport || null);
    const [error, setError] = useState("");

    const runCheck = async () => {
        const plainText = content.replace(/<[^>]+>/g, ' ').trim();
        if (plainText.length < 100) {
            setError("Write at least 100 characters of story content before checking.");
            return;
        }

        setIsLoading(true);
        setError("");
        setReport(null);
        setIsOpen(true);

        try {
            const res = await fetch("/api/ai/originality", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: plainText, title, storyId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setReport(data.report);
        } catch (e: any) {
            setError(e.message || "Originality check failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const verdict = report ? VERDICT_CONFIG[report.verdict] : null;
    const VerdictIcon = verdict?.icon;

    return (
        <div className="flex flex-col gap-4">
            <button
                type="button"
                onClick={runCheck}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full py-3 px-5 border-2 border-on-surface/10 rounded-xl bg-surface-container hover:border-primary/40 hover:bg-primary/5 transition-all font-headline font-black text-sm uppercase tracking-widest text-on-surface disabled:opacity-50"
            >
                {isLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Analysing Chronicle...</>
                ) : (
                    <><Shield size={16} className="text-primary" /> Run Originality Check</>
                )}
            </button>

            {error && (
                <div className="text-error font-label font-bold text-xs uppercase tracking-widest bg-error/10 border border-error/20 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {report && verdict && VerdictIcon && (
                <div className={`border-2 ${verdict.border} rounded-xl overflow-hidden`}>
                    {/* Header */}
                    <div className={`${verdict.bg} p-5 flex items-center justify-between gap-4`}>
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <VerdictIcon size={32} className={verdict.iconColor} />
                            </div>
                            <div>
                                <p className="font-headline font-black text-xs uppercase tracking-widest text-on-surface/50 mb-0.5">Originality Verdict</p>
                                <p className={`font-headline font-black text-xl uppercase tracking-tight ${verdict.color}`}>{verdict.label}</p>
                            </div>
                        </div>
                        {/* Score Ring */}
                        <div className="flex-shrink-0 text-center">
                            <div className={`w-16 h-16 rounded-full border-4 ${verdict.border} flex items-center justify-center`}>
                                <span className={`font-headline font-black text-2xl ${verdict.color}`}>{report.originalityScore}</span>
                            </div>
                            <p className="font-label font-bold text-[9px] uppercase tracking-widest text-on-surface/40 mt-1">/100</p>
                            {storyId && (
                                <div className="mt-2 flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fade-in">
                                    <ShieldCheck size={10} /> Sync
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col gap-5 bg-white">
                        {/* Summary */}
                        <p className="font-body text-sm text-on-surface italic leading-relaxed">{report.summary}</p>

                        {/* Recommendation */}
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-widest ${RECOMMENDATION_CONFIG[report.recommendation].color}`}>
                            <CheckCircle size={14} />
                            {RECOMMENDATION_CONFIG[report.recommendation].label}
                        </div>

                        {/* Flags */}
                        {report.flags.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <p className="font-headline font-black text-[10px] uppercase tracking-widest text-on-surface/40">Flags Detected</p>
                                {report.flags.map((flag, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-on-surface/5">
                                        <span className={`flex-shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${SEVERITY_COLORS[flag.severity]}`}>
                                            {flag.severity}
                                        </span>
                                        <div>
                                            <p className="font-headline font-bold text-xs uppercase tracking-wide text-on-surface/60">{flag.type.replace(/_/g, ' ')}</p>
                                            <p className="font-body text-sm text-on-surface mt-0.5">{flag.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Strengths */}
                        {report.strengths.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <p className="font-headline font-black text-[10px] uppercase tracking-widest text-on-surface/40">Originality Strengths</p>
                                {report.strengths.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <CheckCircle size={14} className="flex-shrink-0 text-emerald-500 mt-0.5" />
                                        <p className="font-body text-sm text-on-surface">{s}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-[9px] text-on-surface/30 font-label tracking-wider uppercase mt-2">
                            ⚠ AI analysis only. Based on training data — not a definitive legal plagiarism check.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
