"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/actions/auth";

export default function OnboardingPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await completeOnboarding(formData);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFF00] flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,#000_1px,transparent_1px),linear-gradient(180deg,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="bg-white border-[6px] border-black p-8 md:p-12 max-w-2xl w-full shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10">
        <h1 className="font-headline font-black text-5xl md:text-6xl text-black uppercase tracking-tighter mb-4 leading-none italic">
          Complete Your Universe
        </h1>
        <p className="font-body text-xl text-black/70 mb-10 font-bold tracking-tight">
          One last step before you start writing history.
        </p>

        {error && (
          <div className="bg-red-500 text-white border-4 border-black p-4 mb-8 font-headline font-bold text-xl uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Full Name */}
          <div className="flex flex-col gap-3">
            <label className="font-headline font-black text-2xl uppercase text-black tracking-tighter flex items-center gap-2">
              <span className="bg-black text-[#FFFF00] px-2 py-1">01</span> Full Name
            </label>
            <input
              name="fullName"
              required
              className="w-full border-4 border-black p-4 text-2xl font-body font-bold focus:bg-[#FFFF00] focus:outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              placeholder="YOUR REAL IDENTITY"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Age */}
            <div className="flex flex-col gap-3">
              <label className="font-headline font-black text-2xl uppercase text-black tracking-tighter flex items-center gap-2">
                <span className="bg-black text-[#FFFF00] px-2 py-1">02</span> Age
              </label>
              <input
                name="age"
                type="number"
                required
                className="w-full border-4 border-black p-4 text-2xl font-body font-bold focus:bg-[#FFFF00] focus:outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="YEARS ALIVE"
              />
            </div>

            {/* Pen Name */}
            <div className="flex flex-col gap-3">
              <label className="font-headline font-black text-2xl uppercase text-black tracking-tighter flex items-center gap-2">
                <span className="bg-black text-[#FFFF00] px-2 py-1">03</span> Pen Name
              </label>
              <input
                name="penName"
                required
                className="w-full border-4 border-black p-4 text-2xl font-body font-bold focus:bg-[#FFFF00] focus:outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="YOUR ALIAS"
              />
            </div>
          </div>

          {/* Parentage */}
          <div className="flex flex-col gap-3">
            <label className="font-headline font-black text-2xl uppercase text-black tracking-tighter flex items-center gap-2">
              <span className="bg-black text-[#FFFF00] px-2 py-1">04</span> Parentage (Optional)
            </label>
            <input
              name="parentage"
              className="w-full border-4 border-black p-4 text-2xl font-body font-bold focus:bg-[#FFFF00] focus:outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              placeholder="LINEAGE OR ORIGIN"
            />
          </div>

          {/* Terms & Guardian Approval */}
          <div className="flex items-start gap-4 mt-4">
            <input
              type="checkbox"
              name="guardianApproved"
              id="guardian"
              required
              className="w-8 h-8 border-4 border-black checked:bg-black transition-all cursor-pointer"
            />
            <label htmlFor="guardian" className="font-body font-bold text-lg text-black leading-tight cursor-pointer selection:bg-black selection:text-[#FFFF00]">
              If I am a minor, I confirm my guardian has approved my registration. I agree to the terms of the SOULPAD alliance.
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 bg-black text-white border-4 border-black px-12 py-6 font-headline font-black text-3xl uppercase tracking-tighter italic hover:bg-white hover:text-black hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
          >
            {isPending ? "Syncing..." : "ENTER THE VERSE"}
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
