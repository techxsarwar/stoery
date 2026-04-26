"use client";

import { Shield, Award, Calendar, Hash, User, Book } from "lucide-react";

interface LicenseCertificateProps {
  license: any;
  story: any;
  profile: any;
}

export default function LicenseCertificate({ license, story, profile }: LicenseCertificateProps) {
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div id="license-certificate" className="relative w-[800px] h-[1000px] bg-[#f8f5f2] border-[16px] border-on-surface p-12 flex flex-col items-center justify-between shadow-2xl overflow-hidden font-serif">
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-[8px] border-l-[8px] border-primary m-4"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-[8px] border-r-[8px] border-primary m-4"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[8px] border-l-[8px] border-primary m-4"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[8px] border-r-[8px] border-primary m-4"></div>

      {/* Header */}
      <div className="text-center mt-8">
        <div className="w-24 h-24 bg-primary border-4 border-on-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Shield size={48} className="text-on-surface" />
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter text-on-surface mb-2">Chronicle License</h1>
        <p className="text-sm font-black uppercase tracking-[0.5em] text-primary">Official Certification of Authenticity</p>
      </div>

      {/* Main Body */}
      <div className="w-full text-center flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-on-surface/40 font-black">This is to certify that the work titled</p>
            <h2 className="text-5xl font-black uppercase text-on-surface italic underline decoration-primary decoration-4 underline-offset-8">
              "{story.title}"
            </h2>
        </div>

        <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-on-surface/40 font-black">Authored and owned by</p>
            <h3 className="text-3xl font-black uppercase text-on-surface">{license.legalName}</h3>
            <p className="text-[10px] text-on-surface/60 font-bold uppercase tracking-widest">Pen Name: {profile.pen_name || "Unknown Explorer"}</p>
        </div>

        <div className="py-8 border-y-2 border-on-surface/10 grid grid-cols-2 gap-12 mt-4">
            <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                    <Award size={18} className="text-primary" />
                    <div>
                        <p className="text-[8px] font-black uppercase text-on-surface/40">License Type</p>
                        <p className="text-sm font-black uppercase">{license.licenseType}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-primary" />
                    <div>
                        <p className="text-[8px] font-black uppercase text-on-surface/40">Date of Issue</p>
                        <p className="text-sm font-black uppercase">{formatDate(license.issuedAt)}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                    <Hash size={18} className="text-primary" />
                    <div>
                        <p className="text-[8px] font-black uppercase text-on-surface/40">Certificate ID</p>
                        <p className="text-sm font-black uppercase tracking-tighter">{license.licenseNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Book size={18} className="text-primary" />
                    <div>
                        <p className="text-[8px] font-black uppercase text-on-surface/40">Registry Status</p>
                        <p className="text-sm font-black uppercase text-emerald-600">Verified & Sealed</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="w-full flex justify-between items-end px-12 mb-12">
        <div className="text-center">
            <div className="w-48 h-px bg-on-surface mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Official Seal</p>
            <div className="mt-4 w-16 h-16 border-4 border-primary rounded-full flex items-center justify-center opacity-20 rotate-12 mx-auto">
                <Shield size={24} className="text-primary" />
            </div>
        </div>
        <div className="text-center">
            <div className="font-cursive text-3xl text-on-surface -mb-2 opacity-80">The High Council</div>
            <div className="w-48 h-px bg-on-surface mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Aegis Moderator</p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-[10px] font-black uppercase tracking-[1em] text-on-surface/20 pb-4">
        StoryVerse // Codex Registry
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none overflow-hidden rotate-[-30deg]">
        <div className="text-[200px] font-black uppercase leading-none text-on-surface">
          VERIFIED VERIFIED VERIFIED VERIFIED
        </div>
      </div>
    </div>
  );
}
