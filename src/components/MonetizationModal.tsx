"use client";

import { useState } from "react";
import { X, CreditCard, Building2, Phone, User, CheckCircle2, Loader2 } from "lucide-react";
import { applyForMonetization } from "@/actions/monetization";

export default function MonetizationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    legalName: "",
    panNumber: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankAccountHolder: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await applyForMonetization(formData);
      if (result.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
        <div className="max-w-md w-full bg-surface-container-high border-2 border-primary/20 p-10 rounded-3xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="font-headline font-black text-3xl text-on-surface uppercase tracking-tight mb-4">Ritual Initiated</h3>
          <p className="font-body text-on-surface-variant italic mb-10 leading-relaxed text-lg text-pretty">
            "Your application for monetization has been cast into the celestial void. Our keepers will review your credentials and reach out via your provided scroll (phone number)."
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-primary text-on-primary font-headline font-black py-4 uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Acknowledge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="max-w-2xl w-full bg-surface-container-high border-2 border-on-surface/10 p-8 md:p-12 rounded-3xl shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-10">
          <h2 className="font-headline font-black text-3xl text-on-surface uppercase tracking-tight mb-2">Monetization Registry</h2>
          <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Supply your earthly credentials to begin earning.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {error && (
            <div className="bg-error/10 border border-error/20 p-4 rounded-xl text-error text-xs font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legal Name */}
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                <User size={12} className="text-primary" /> Full Legal Name
              </label>
              <input
                required
                type="text"
                name="legalName"
                value={formData.legalName}
                onChange={handleChange}
                placeholder="As per Bank/PAN"
                className="bg-black/20 border-2 border-on-surface/5 rounded-xl px-4 py-3 text-on-surface font-body focus:border-primary/50 outline-none transition-all placeholder:opacity-20"
              />
            </div>

            {/* PAN Number */}
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                <CreditCard size={12} className="text-primary" /> PAN Card Number
              </label>
              <input
                required
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                className="bg-black/20 border-2 border-on-surface/5 rounded-xl px-4 py-3 text-on-surface font-body focus:border-primary/50 outline-none transition-all placeholder:opacity-20 uppercase"
              />
            </div>

            {/* Bank Holder Name */}
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                <User size={12} className="text-primary" /> Account Holder Name
              </label>
              <input
                required
                type="text"
                name="bankAccountHolder"
                value={formData.bankAccountHolder}
                onChange={handleChange}
                placeholder="Exact name in Bank"
                className="bg-black/20 border-2 border-on-surface/5 rounded-xl px-4 py-3 text-on-surface font-body focus:border-primary/50 outline-none transition-all placeholder:opacity-20"
              />
            </div>

            {/* Bank Account Number */}
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                <Building2 size={12} className="text-primary" /> Account Number
              </label>
              <input
                required
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                placeholder="1234567890"
                className="bg-black/20 border-2 border-on-surface/5 rounded-xl px-4 py-3 text-on-surface font-body focus:border-primary/50 outline-none transition-all placeholder:opacity-20"
              />
            </div>

            {/* IFSC Code */}
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                <Building2 size={12} className="text-primary" /> IFSC Code
              </label>
              <input
                required
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="SBIN0001234"
                className="bg-black/20 border-2 border-on-surface/5 rounded-xl px-4 py-3 text-on-surface font-body focus:border-primary/50 outline-none transition-all placeholder:opacity-20 uppercase"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="font-label font-black text-[10px] uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                <Phone size={12} className="text-primary" /> Phone Number (UPI/WA)
              </label>
              <input
                required
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="bg-black/20 border-2 border-on-surface/5 rounded-xl px-4 py-3 text-on-surface font-body focus:border-primary/50 outline-none transition-all placeholder:opacity-20"
              />
            </div>
          </div>

          <p className="font-body text-[10px] text-on-surface-variant italic opacity-40 mt-2">
            By submitting, you agree to the cosmic terms of narrative trade and tax compliance laws of the mortal realms.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-primary text-on-primary font-headline font-black py-4 uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:translate-none disabled:shadow-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
