"use client";

import { useState } from "react";
import { Flag, X, AlertTriangle } from "lucide-react";
import { createReport } from "@/actions/reports";

interface ReportStoryProps {
  storyId: string;
}

export default function ReportStory({ storyId }: ReportStoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    setMessage(null);

    const res = await createReport(storyId, reason, details);

    setIsSubmitting(false);
    if (res.success) {
      setMessage({ type: "success", text: "Report submitted successfully. Thank you for keeping StoryVerse safe." });
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
        setReason("");
        setDetails("");
      }, 3000);
    } else {
      setMessage({ type: "error", text: res.error || "Failed to submit report." });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-on-surface/60 hover:text-red-500 transition-colors font-headline font-bold text-sm uppercase tracking-wider"
      >
        <Flag size={16} />
        Report Story
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm">
          <div className="bg-white border-4 border-on-surface p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-on-surface/40 hover:text-on-surface"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle size={32} />
              <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">Report Story</h2>
            </div>

            {message ? (
              <div className={`p-4 border-2 font-bold uppercase text-sm ${message.type === "success" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700"}`}>
                {message.text}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-headline font-black uppercase text-xs tracking-widest text-on-surface/60">Reason for reporting</label>
                  <select
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="p-4 bg-surface border-2 border-on-surface font-body font-bold text-lg focus:ring-4 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select a reason</option>
                    <option value="Hate Speech">Hate Speech</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Plagiarism">Plagiarism</option>
                    <option value="Violence">Violence</option>
                    <option value="Spam">Spam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-headline font-black uppercase text-xs tracking-widest text-on-surface/60">Additional details</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide more context..."
                    className="p-4 bg-surface border-2 border-on-surface font-body font-bold text-lg min-h-[120px] focus:ring-4 focus:ring-primary/20 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !reason}
                  className="w-full bg-primary text-on-primary p-4 font-headline font-black uppercase tracking-widest text-xl border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
