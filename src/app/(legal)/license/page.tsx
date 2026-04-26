import Navbar from "@/components/Navbar";
import { Shield, Award, CheckCircle2, BookOpen, Scale } from "lucide-react";

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="text-primary" size={48} />
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Chronicle License</h1>
          </div>
          <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">The Codex of Ownership & Authenticity</p>
        </header>

        <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-primary" size={28} />
              <h2 className="m-0 uppercase italic font-black">1. The Registry System</h2>
            </div>
            <p>
              The <strong>Chronicle License</strong> is a digital certificate of authenticity issued by the SOULPAD Codex Registry. 
              It serves as immutable proof that a specific work (Story, Manga, or Artwork) is the original creation of the registered author 
              and is officially recognized within our ecosystem.
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-primary" size={28} />
              <h2 className="m-0 uppercase italic font-black">2. Intellectual Property Rights</h2>
            </div>
            <p>
              Issuance of a Chronicle License <strong>does not transfer ownership</strong> of the work to SOULPAD. 
              The Author retains 100% of their copyright and intellectual property rights. 
              The License acts as a public record of these rights, facilitating verification for third-party platforms, 
              publishers, and readers.
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-primary" size={28} />
              <h2 className="m-0 uppercase italic font-black">3. License Classifications</h2>
            </div>
            <p>Licenses are categorized into three tiers, each reflecting the level of verification and platform integration:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="border-2 border-on-surface p-4 bg-surface/50">
                <h3 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-primary pb-1">Standard</h3>
                <p className="text-sm italic">Basic proof of publication and authorship timestamping.</p>
              </div>
              <div className="border-2 border-on-surface p-4 bg-surface/50">
                <h3 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-primary pb-1">Verified</h3>
                <p className="text-sm italic">Enhanced verification including identity check and plagiarism screening.</p>
              </div>
              <div className="border-2 border-on-surface p-4 bg-primary text-on-primary">
                <h3 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-white pb-1">Chronicle Elite</h3>
                <p className="text-sm italic font-bold">The highest tier, granting priority registry status and commercial protection.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-primary" size={28} />
              <h2 className="m-0 uppercase italic font-black">4. Verification Protocol</h2>
            </div>
            <p>
              Each Chronicle License is assigned a unique <strong>Certificate ID</strong> (e.g., SV-XXXXXX). 
              Any third party can verify the status of a license through our public registry at <code>/verify</code>. 
              A "Verified Authentic" status confirms that the work has not been flagged for plagiarism and remains under 
              the legal control of the stated Author.
            </p>
          </section>

          <hr className="border-t-2 border-on-surface my-8" />
          
          <div className="bg-surface border-2 border-on-surface p-6 font-headline text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black uppercase tracking-widest text-sm mb-2">Legal Disclaimer</p>
            <p className="text-xs italic leading-relaxed">
              The Chronicle License is a platform-specific verification tool. While it serves as strong evidence of authorship, 
              it is not a substitute for official government copyright registration in your jurisdiction. 
              SOULPAD is not a law firm and does not provide legal advice.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
