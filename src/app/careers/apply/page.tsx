"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, UploadCloud } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CareerApplicationPage() {
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get("role") || "";

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: roleFromUrl,
    portfolioUrl: "",
    whySoulpad: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // Success state
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar user={null} />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full flex flex-col gap-12">
        <Link href="/careers" className="flex items-center gap-2 font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Careers
        </Link>

        {step !== 3 && (
          <header className="flex flex-col gap-4">
            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface uppercase leading-none">
              Join the <span className="text-primary">Guild</span>
            </h1>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              You are applying for a position at SOULPAD. Bring your best work.
            </p>
          </header>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <form onSubmit={() => setStep(2)} className="flex flex-col gap-8 bg-surface-container-high border-2 border-on-surface/10 p-8 md:p-12 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-8">
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-80">Full Legal Name</label>
              <input 
                required 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe" 
                className="w-full bg-surface border-2 border-on-surface/20 p-4 rounded-xl font-headline font-bold text-lg outline-none focus:border-primary text-on-surface transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-80">Communication Channel (Email)</label>
              <input 
                required 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com" 
                className="w-full bg-surface border-2 border-on-surface/20 p-4 rounded-xl font-headline font-bold text-lg outline-none focus:border-primary text-on-surface transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-80">Desired Role</label>
              <select 
                required
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-surface border-2 border-on-surface/20 p-4 rounded-xl font-headline font-bold text-lg outline-none focus:border-primary text-on-surface transition-colors appearance-none"
              >
                <option value="" disabled>Select a role...</option>
                <option value="Content Moderator">Content Moderator</option>
                <option value="Community Manager">Community Manager</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Creator Partnerships Lead">Creator Partnerships Lead</option>
                <option value="Illustrator / Visual Artist">Illustrator / Visual Artist</option>
                <option value="Editorial Reviewer">Editorial Reviewer</option>
                <option value="Open Application">Open Application (Other)</option>
              </select>
            </div>

            <button type="submit" className="mt-4 bg-on-surface text-surface font-headline font-black text-lg uppercase tracking-tighter py-5 rounded-2xl hover:bg-primary hover:text-on-primary transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
              Continue to Portfolio
            </button>
          </form>
        )}

        {/* Step 2: Experience & Why Us */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-surface-container-high border-2 border-on-surface/10 p-8 md:p-12 rounded-3xl shadow-xl animate-in fade-in slide-in-from-right-8">
            
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-80 flex items-center gap-2">
                <UploadCloud size={14} /> Link to Artifacts (Portfolio / GitHub / Resume)
              </label>
              <input 
                required 
                type="url" 
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://..." 
                className="w-full bg-surface border-2 border-on-surface/20 p-4 rounded-xl font-headline font-bold text-lg outline-none focus:border-primary text-on-surface transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant opacity-80">Why SOULPAD?</label>
              <p className="font-body text-xs text-on-surface-variant/60 italic mb-2">Tell us a story. Why does our mission resonate with you?</p>
              <textarea 
                required 
                name="whySoulpad"
                value={formData.whySoulpad}
                onChange={handleChange}
                placeholder="I believe stories can..." 
                className="w-full bg-surface border-2 border-on-surface/20 p-4 rounded-xl font-body text-base outline-none focus:border-primary text-on-surface min-h-[200px] resize-y transition-colors"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 bg-surface border-2 border-on-surface/20 text-on-surface font-headline font-black text-lg uppercase tracking-tighter py-5 rounded-2xl hover:bg-on-surface/5 transition-all">
                Back
              </button>
              <button disabled={isSubmitting} type="submit" className="flex-[2] bg-primary text-on-primary font-headline font-black text-lg uppercase tracking-tighter py-5 rounded-2xl hover:bg-yellow-400 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-50">
                {isSubmitting ? "Transmitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success State */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-8 bg-surface-container-high border-2 border-primary/30 p-12 md:p-20 rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in duration-500">
            <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center border-4 border-primary shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <CheckCircle2 size={48} />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-surface uppercase">
                Application Received
              </h2>
              <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-md mx-auto">
                Your transmission has entered the codex. Our guild masters will review your artifacts and contact you at <span className="font-bold text-primary">{formData.email}</span>.
              </p>
            </div>
            <Link href="/" className="mt-8 bg-on-surface text-surface font-headline font-black px-10 py-4 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors">
              Return to Nexus
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
