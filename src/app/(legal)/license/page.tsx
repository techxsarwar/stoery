
import Navbar from "@/components/Navbar";
import PiracyGuard from "@/components/PiracyGuard";
import { Shield, Award, CheckCircle2, BookOpen, Scale, Zap, Globe, Lock } from "lucide-react";

export default function LicensePage() {
  return (
    <PiracyGuard>
        <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
        <Navbar user={null} />

        <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
            <header className="border-b-8 border-primary pb-8">
            <div className="flex items-center gap-4 mb-4">
                <Shield className="text-primary" size={48} />
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Chronicle License</h1>
            </div>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">The Codex of Ownership & Authenticity • Version 1.5</p>
            </header>

            <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-primary" size={28} />
                <h2 className="m-0 uppercase italic font-black">1. The Registry Mandate</h2>
                </div>
                <p>
                The <strong>Chronicle License</strong> is a digital certificate of authenticity issued by the SOULPAD Codex Registry. 
                It serves as an immutable, timestamped record that a specific work (Story, Manuscript, Manga, or Digital Art) is the original creation of the registered author 
                and is officially recognized within the SOULPAD ecosystem.
                </p>
            </section>

            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                <Scale className="text-primary" size={28} />
                <h2 className="m-0 uppercase italic font-black">2. Rights and Sovereignty</h2>
                </div>
                <p>
                The issuance of a Chronicle License <strong>does not transfer ownership</strong> of the underlying intellectual property to SOULPAD. 
                The Author retains 100% of their copyright. The License acts as:
                </p>
                <ul>
                    <li><strong>Public Verification:</strong> A searchable record for publishers and collaborators to verify rights holders.</li>
                    <li><strong>Plagiarism Protection:</strong> Evidence of creation date in the event of unauthorized distribution.</li>
                    <li><strong>Ecosystem Permissions:</strong> A prerequisite for certain monetization and platform distribution features.</li>
                </ul>
            </section>

            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                <Award className="text-primary" size={28} />
                <h2 className="m-0 uppercase italic font-black">3. License Tiering System</h2>
                </div>
                <p>To ensure content integrity, we utilize a tiered verification structure:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="border-2 border-on-surface p-4 bg-surface/50">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-primary pb-1 flex items-center gap-2">
                        <Zap size={14} /> Standard
                    </h3>
                    <p className="text-xs italic">Basic timestamping and automated originality check (60+ Score).</p>
                </div>
                <div className="border-2 border-on-surface p-4 bg-surface/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-primary pb-1 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Verified
                    </h3>
                    <p className="text-xs italic">Includes identity verification and manual integrity review for high-traffic works.</p>
                </div>
                <div className="border-2 border-on-surface p-4 bg-primary text-on-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-white pb-1 flex items-center gap-2">
                        <Shield size={14} /> Elite
                    </h3>
                    <p className="text-xs italic font-bold">The highest tier, granting priority registry status and commercial legal support.</p>
                </div>
                </div>
            </section>

            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                <Globe className="text-primary" size={28} />
                <h2 className="m-0 uppercase italic font-black">4. Public Verification Protocol</h2>
                </div>
                <p>
                Each license is assigned a unique <strong>Certificate ID</strong> (e.g., SV-XXXXXX). 
                Any third party can verify the validity of a license through our public portal at <code>/verify</code>. 
                A "Verified Authentic" status confirms the work has passed our AI Integrity analysis and is currently held by the registered account.
                </p>
            </section>

            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                <Lock className="text-primary" size={28} />
                <h2 className="m-0 uppercase italic font-black">5. Revocation and Termination</h2>
                </div>
                <p>
                SOULPAD reserves the right to revoke a Chronicle License if a work is found to be plagiarized, violates our Terms of Service, 
                or if the authorship is successfully challenged by a third party with superior proof of creation.
                </p>
            </section>

            <hr className="border-t-2 border-on-surface my-8" />
            
            <div className="bg-surface border-2 border-on-surface p-6 font-headline text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black uppercase tracking-widest text-sm mb-2">Legal Disclaimer</p>
                <p className="text-xs italic leading-relaxed">
                The Chronicle License is a platform-specific verification tool and not a substitute for official government copyright registration. 
                While it provides strong evidence of creation, we recommend authors also register with their national copyright office for maximum legal protection.
                </p>
            </div>
            </article>
        </main>
        </div>
    </PiracyGuard>
  );
}

