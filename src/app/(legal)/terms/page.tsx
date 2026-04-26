import Navbar from "@/components/Navbar";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Terms of Service</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">The Universal Directives</p>
        </header>

        <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
            <p className="text-sm italic"><strong>Effective Date:</strong> April 26, 2026</p>
            <p>Welcome to <strong>SOULPAD</strong> (the "Platform"). These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Author", or "Explorer") and SOULPAD regarding your use of our services.</p>
            
            <div className="bg-primary/10 border-l-4 border-primary p-4 my-6">
                <p className="m-0 font-bold">PLEASE READ CAREFULLY: By accessing the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must immediately cease all use of the Platform.</p>
            </div>

            <h2>1. Account Registration & Security</h2>
            <p>To access certain features, you must create an account. You are responsible for:</p>
            <ul>
                <li>Providing accurate and complete information during registration.</li>
                <li>Maintaining the confidentiality of your credentials.</li>
                <li>All activities that occur under your account.</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that provide false information or compromise Platform security.</p>

            <h2>2. Content Authorization & Author Rights</h2>
            <p><strong>2.1. Absolute Ownership:</strong> You retain 100% ownership and all intellectual property rights to the original content you publish on SOULPAD. <strong>We do not own your stories, art, or ideas.</strong> This platform is a vessel for your creation, not a claimant of it.</p>
            <p><strong>2.2. License to SOULPAD:</strong> By publishing content, you grant SOULPAD a non-exclusive, worldwide, royalty-free license to host, store, display, and distribute your work solely to operate the Platform. You can revoke this license at any time by deleting your content.</p>
            <p><strong>2.3. Author Integrity:</strong> We are built by authors, for authors. We promise never to sell your work to third parties or use it for AI training without your explicit, written consent.</p>

            <h2>3. DMCA & Copyright Policy</h2>
            <p>SOULPAD complies with the Digital Millennium Copyright Act ("DMCA"). If you believe your work has been used in a way that constitutes copyright infringement, you must provide our Designated Copyright Agent with a written notice containing:</p>
            <ol>
                <li>A physical or electronic signature of the owner or authorized agent.</li>
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>Identification of the material that is claimed to be infringing (including the specific URL).</li>
                <li>Your contact information (address, telephone number, and email).</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized.</li>
                <li>A statement, under penalty of perjury, that the information in the notification is accurate.</li>
            </ol>
            <p>Send notices to: <strong className="uppercase">legal@soulpad.app</strong></p>
            <p><strong>Counter-Notice:</strong> If you believe your content was removed by mistake, you may submit a counter-notice. We reserve the right to restore content if the complaining party does not file a court action within 10 business days.</p>

            <h2>4. Prohibited Conduct & Acceptable Use</h2>
            <p>To keep the SOULPAD universe secure, you agree to the following Acceptable Use standards:</p>
            <ul>
                <li><strong>No Harmful Content:</strong> No illegal material, hate speech, or promotion of real-world violence.</li>
                <li><strong>Technical Integrity:</strong> You shall not attempt to hack, probe, or scan our Next.js API or backend infrastructure. Automated scraping, "souls" (bots) used for spamming, and DDoS attacks are strictly forbidden.</li>
                <li><strong>Account Purity:</strong> One human per account. Do not share credentials or use "throwaway" emails to bypass community restrictions.</li>
            </ul>

            <h2>5. Chronicle License & Verification</h2>
            <p>Select works may be issued an official <strong>Chronicle License</strong> through the SOULPAD Codex Registry. These licenses provide platform-verified proof of authenticity. Full terms governing these licenses are available on the <a href="/license" className="text-primary font-black underline hover:bg-primary hover:text-white px-1">Chronicle License Page</a>.</p>

            <h2>6. Limitation of Liability (The Safety Shield)</h2>
            <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOULPAD, ITS AFFILIATES, AND OFFICERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.</strong></p>
            <p>In no event shall our total liability exceed the greater of one hundred U.S. dollars ($100.00) or the amount you paid us in the past six months.</p>

            <h2>7. Disclaimer of Warranties</h2>
            <p>The Platform is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis. We disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>

            <h2>8. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless SOULPAD from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of or in any way connected with your access to or use of the Platform, your violation of these Terms, or your infringement of any third-party rights.</p>

            <h2>9. Governing Law & Jurisdiction</h2>
            <p>These Terms shall be governed by the laws of the jurisdiction in which SOULPAD operates, without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the courts located within said jurisdiction for any actions related to these Terms.</p>

            <hr className="border-t-2 border-on-surface my-8" />
            <p className="font-bold text-center italic uppercase tracking-tighter">By continuing to explore the universe of SOULPAD, you accept these directives. Failure to comply will result in immediate termination of access.</p>
        </article>
      </main>
    </div>
  );
}
