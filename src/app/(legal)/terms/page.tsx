import Navbar from "@/components/Navbar";
import PiracyGuard from "@/components/PiracyGuard";

export default function TermsOfServicePage() {
  return (
    <PiracyGuard>
        <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
        <Navbar user={null} />

        <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
            <header className="border-b-8 border-primary pb-8">
                <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Terms of Service</h1>
                <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">The Universal Directives • Version 2.0</p>
            </header>

            <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
                <p className="text-sm italic"><strong>Effective Date:</strong> April 29, 2026</p>
                <p>Welcome to <strong>SOULPAD</strong> (the "Platform"), owned and operated by the SOULPAD Collective. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Author", or "Explorer") and SOULPAD regarding your access to and use of our website, mobile applications, and all related services.</p>
                
                <div className="bg-primary/10 border-l-4 border-primary p-4 my-6">
                    <p className="m-0 font-bold">PLEASE READ CAREFULLY: By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, including the binding arbitration provision and class action waiver. If you do not agree, you must immediately cease all use of the Platform.</p>
                </div>

                <h2>1. Eligibility & Account Integrity</h2>
                <p><strong>1.1. Minimum Age:</strong> You must be at least 13 years old to use the Platform. If you are under 18, you represent that you have the consent of a parent or legal guardian.</p>
                <p><strong>1.2. Account Security:</strong> To access certain features, you must create an account. You agree to provide accurate, current, and complete information. You are solely responsible for:</p>
                <ul>
                    <li>Maintaining the absolute confidentiality of your login credentials.</li>
                    <li>All activities, transmissions, and interactions that occur under your account.</li>
                    <li>Notifying us immediately at <strong>security@soulpad.app</strong> of any unauthorized access.</li>
                </ul>
                <p><strong>1.3. One Soul, One Account:</strong> Users are prohibited from maintaining multiple accounts for the purpose of manipulating engagement metrics ("soul farming"), bypassing community bans, or engaging in fraudulent activity.</p>

                <h2>2. Content Authorization & Author Sovereignty</h2>
                <p><strong>2.1. Absolute Ownership:</strong> You retain 100% ownership and all intellectual property rights to the original content (stories, art, lore, world-building) you publish on SOULPAD. <strong>We do not own your creative soul.</strong></p>
                <p><strong>2.2. License Grant to SOULPAD:</strong> By publishing content on the Platform, you grant SOULPAD a non-exclusive, worldwide, royalty-free, sublicensable (only to our service providers), and transferable license to host, store, cache, use, display, reproduce, and distribute your content for the sole purpose of operating, developing, and improving the Platform.</p>
                <p><strong>2.3. Termination of License:</strong> You may revoke this license at any time by deleting your content or account. However, you acknowledge that content may persist in cached or archived form for a reasonable period, and content shared with others may remain accessible to them.</p>
                <p><strong>2.4. Author Integrity Promise:</strong> We promise never to sell your work to third parties or utilize your proprietary creative text/images to train external foundation models without your explicit, opt-in written consent.</p>

                <h2>3. DMCA & Copyright Enforcement</h2>
                <p>SOULPAD respects intellectual property rights. If you believe your copyright has been infringed, please submit a formal DMCA notice to our Designated Agent at <strong>legal@soulpad.app</strong> with the following:</p>
                <ol>
                    <li>A physical or electronic signature of the copyright owner.</li>
                    <li>A detailed description of the work claimed to be infringed.</li>
                    <li>The specific URL on our Platform where the infringing material is located.</li>
                    <li>Your contact information (address, phone, and email).</li>
                    <li>A statement of good faith belief that the use is unauthorized.</li>
                    <li>A statement, under penalty of perjury, that the information in the notice is accurate.</li>
                </ol>
                <p><strong>Repeat Infringers:</strong> Accounts with multiple valid copyright strikes will be permanently terminated without notice.</p>

                <h2>4. Community Conduct & The "No Shadows" Policy</h2>
                <p>To maintain a safe and creative universe, you agree not to engage in:</p>
                <ul>
                    <li><strong>Harassment:</strong> Stalking, bullying, or targeted harassment of other authors.</li>
                    <li><strong>Hate Speech:</strong> Content that promotes violence or hatred based on race, religion, gender, identity, or disability.</li>
                    <li><strong>Illegal Content:</strong> Promotion of illegal acts, regulated goods, or sexually explicit content involving minors (Zero Tolerance).</li>
                    <li><strong>Technical Malice:</strong> Probing, scanning, or testing the vulnerability of our systems; scraping data without authorization; or deploying "souls" (automated bots) to spam the platform.</li>
                </ul>

                <h2>5. AI Integration & Algorithmic Governance</h2>
                <p><strong>5.1. Originality Requirements:</strong> To prevent the flooding of the platform with low-effort automated content, all stories undergo an <strong>Originality Check</strong>. You agree that your content must meet a minimum human-intent threshold (currently 60/100) to be visible in the public library.</p>
                <p><strong>5.2. AI-Assisted Tools:</strong> We provide AI-powered tools (e.g., Grimoire Analytics, Storyboard Assistants). While you own the final output, you acknowledge that these tools are provided "as is" and the Platform makes no guarantees regarding the copyrightability of AI-generated components under current law.</p>
                <p><strong>5.3. Content Moderation:</strong> You acknowledge that SOULPAD uses automated AI systems to scan for prohibited content and to optimize discovery algorithms.</p>

                <h2>6. Monetization & Subscriptions</h2>
                <p>If you choose to purchase premium features or "Essence" (platform currency), you agree to our payment terms. All transactions are final and non-refundable unless required by law. We use third-party processors (e.g., Stripe) and do not store your full credit card information.</p>

                <h2>7. Chronicle License & Verification</h2>
                <p>The <strong>Chronicle License</strong> is a platform-verified badge of authenticity. Issuance of a Chronicle License does not transfer ownership to SOULPAD but serves as a registered timestamp of your creation in the Codex Registry. See the <a href="/license" className="text-primary font-black underline hover:bg-primary hover:text-white px-1">License Page</a> for specific details.</p>

                <h2>8. Limitation of Liability</h2>
                <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOULPAD AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE PLATFORM. OUR TOTAL LIABILITY SHALL NOT EXCEED $100.00 USD.</strong></p>

                <h2>9. Indemnification</h2>
                <p>You agree to indemnify and hold harmless SOULPAD from any claims, damages, or legal fees arising from your breach of these Terms, your content, or your violation of any third-party rights.</p>

                <h2>10. Dispute Resolution & Governing Law</h2>
                <p><strong>10.1. Binding Arbitration:</strong> Any dispute arising from these Terms shall be resolved through binding arbitration, rather than in court. You waive your right to a jury trial.</p>
                <p><strong>10.2. Governing Law:</strong> These Terms are governed by the laws of the jurisdiction of our incorporation, without regard to conflict of law principles.</p>

                <h2>11. Modifications to the Directives</h2>
                <p>We reserve the right to modify these Terms at any time. We will notify you of material changes via email or platform notification. Continued use after changes constitutes acceptance.</p>

                <hr className="border-t-2 border-on-surface my-8" />
                <p className="font-bold text-center italic uppercase tracking-tighter">By continuing to explore the universe of SOULPAD, you accept these directives. Failure to comply will result in immediate termination of access.</p>
            </article>
        </main>
        </div>
    </PiracyGuard>
  );
}
