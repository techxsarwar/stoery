"use client";

import { useState } from "react";
import { Shield, Search, Award, Calendar, Hash, Book, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { verifyLicense } from "@/actions/licenses";

export default function VerifyPage() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await verifyLicense(licenseNumber.trim().toUpperCase());
      if (res.success) {
        setResult(res.license);
      } else {
        setError(res.error || "Verification failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-label">
      {/* Header */}
      <div className="max-w-md w-full text-center mb-12">
        <div className="w-20 h-20 bg-primary border-4 border-on-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield size={40} className="text-on-surface" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-on-surface mb-2 font-headline">Registry Verification</h1>
        <p className="text-on-surface-variant font-medium">Verify the authenticity of a Chronicle License and its author.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl w-full mb-12">
        <form onSubmit={handleVerify} className="relative group">
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Enter License Number (e.g., SV-XXXXXX)"
            className="w-full bg-surface border-4 border-on-surface p-6 pr-16 text-xl font-black uppercase tracking-widest focus:outline-none transition-all focus:translate-x-[-4px] focus:translate-y-[-4px] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] placeholder:text-on-surface/20"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary border-2 border-on-surface flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md w-full bg-error-container border-4 border-error p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 mb-12">
          <AlertCircle className="text-error shrink-0" size={32} />
          <p className="text-on-error-container font-black uppercase text-sm tracking-tight">{error}</p>
        </div>
      )}

      {/* Verification Result */}
      {result && (
        <div className="max-w-3xl w-full animate-in fade-in zoom-in duration-500">
          <div className="relative bg-[#f8f5f2] border-[12px] border-on-surface p-8 sm:p-12 shadow-2xl overflow-hidden font-serif">
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-[6px] border-l-[6px] border-primary m-2"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-t-[6px] border-r-[6px] border-primary m-2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[6px] border-l-[6px] border-primary m-2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[6px] border-r-[6px] border-primary m-2"></div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="text-emerald-600" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">Verified Authentic Work</span>
              </div>

              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-widest text-on-surface/40 font-black mb-2">Work Titled</p>
                <h2 className="text-3xl sm:text-5xl font-black uppercase text-on-surface italic underline decoration-primary decoration-4 underline-offset-8">
                  "{result.story.title}"
                </h2>
              </div>

              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-widest text-on-surface/40 font-black mb-2">Authored and Owned by</p>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-on-surface">{result.legalName}</h3>
                <p className="text-[10px] text-on-surface/60 font-bold uppercase tracking-widest mt-1">Pen Name: {result.story.author.pen_name || "Unknown Explorer"}</p>
              </div>

              <div className="w-full py-8 border-y-2 border-on-surface/10 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <Award size={20} className="text-primary shrink-0" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-on-surface/40">License Type</p>
                      <p className="text-base font-black uppercase tracking-tight">{result.licenseType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar size={20} className="text-primary shrink-0" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-on-surface/40">Date of Issue</p>
                      <p className="text-base font-black uppercase tracking-tight">{formatDate(result.issuedAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <Hash size={20} className="text-primary shrink-0" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-on-surface/40">Certificate ID</p>
                      <p className="text-base font-black uppercase tracking-tighter">{result.licenseNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Book size={20} className="text-primary shrink-0" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-on-surface/40">Registry Status</p>
                      <p className="text-base font-black uppercase text-emerald-600">Verified & Sealed</p>
                    </div>
                  </div>
                </div>
              </div>

              {result.details && (
                <div className="mt-10 w-full text-left bg-on-surface/5 p-6 border-l-4 border-primary">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2">License Details & Scope</p>
                  <p className="text-sm font-medium text-on-surface italic leading-relaxed">"{result.details}"</p>
                </div>
              )}

              <div className="mt-12 text-[10px] font-black uppercase tracking-[1em] text-on-surface/20">
                SOULPAD Codex Registry
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none overflow-hidden rotate-[-30deg]">
              <div className="text-[120px] font-black uppercase leading-none text-on-surface">
                VERIFIED VERIFIED VERIFIED
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer link */}
      <div className="mt-12">
        <a href="/" className="text-xs font-black uppercase tracking-widest text-on-surface/40 hover:text-primary transition-colors">
          Return to Library
        </a>
      </div>
    </div>
  );
}

