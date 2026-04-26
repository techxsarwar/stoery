import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Privacy Policy</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">The Data Protocol</p>
        </header>

        <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
            <p className="text-sm italic"><strong>Effective Date:</strong> April 26, 2026</p>
            <p>At <strong>SOULPAD</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Platform.</p>

            <h2>1. Information We Collect</h2>
            <p><strong>1.1. Account Data:</strong> When you register, we collect your email address and any authentication data provided by our OAuth partners (e.g., Spotify, Google). This is necessary for secure account access.</p>
            <p><strong>1.2. Profile Information:</strong> You may choose to provide a "Pen Name", bio, and profile image. This information is public and intended to identify you as an author.</p>
            <p><strong>1.3. User Content:</strong> We store the stories, chapters, metadata, and images you upload. While some content may be private or "paused", it remains on our secure servers.</p>
            <p><strong>1.4. Technical Data:</strong> We automatically collect certain information when you visit the Platform, including your IP address, browser type, device information, and usage patterns (via logs).</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the collected data for the following purposes:</p>
            <ul>
                <li>To provide and maintain the Platform.</li>
                <li>To authenticate your identity and prevent unauthorized access.</li>
                <li>To process and display your creative work.</li>
                <li>To communicate with you regarding account updates or technical notices.</li>
                <li>To analyze usage trends and improve the user experience.</li>
                <li>To enforce our Terms of Service and protect against fraud or abuse.</li>
            </ul>

            <h2>3. Data Sharing & Disclosure</h2>
            <p>We do not sell your personal data. We may share information only in the following circumstances:</p>
            <ul>
                <li><strong>Service Providers:</strong> We share data with infrastructure partners (e.g., Supabase for database, Vercel for hosting, Cloudflare for image delivery) who assist in operating the Platform.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, subpoena, or to protect the safety and rights of SOULPAD or its users.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            </ul>

            <h2>4. Cookies & Tracking</h2>
            <p>We use essential cookies to manage your session and security. These are technically necessary for the Platform to function. We do not use third-party advertising or tracking cookies for marketing purposes.</p>

            <h2>5. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.</p>

            <h2>6. Your Rights & Choices</h2>
            <p>Depending on your location (e.g., GDPR in the EU, CCPA in California), you may have the following rights:</p>
            <ul>
                <li><strong>Access:</strong> The right to request copies of your personal data.</li>
                <li><strong>Correction:</strong> The right to request that we correct inaccurate information.</li>
                <li><strong>Deletion:</strong> The right to request that we erase your personal data (subject to certain legal obligations).</li>
                <li><strong>Portability:</strong> The right to request that we transfer your data to another organization.</li>
            </ul>
            <p>To exercise these rights, please contact us at <strong className="uppercase">privacy@soulpad.app</strong>.</p>

            <h2>7. International Data Transfers</h2>
            <p>Your information may be transferred to and maintained on computers located outside of your state or country, where data protection laws may differ. By using the Platform, you consent to these transfers.</p>

            <h2>8. Children's Privacy</h2>
            <p>SOULPAD is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete the data immediately.</p>

            <h2>9. Data Retention</h2>
            <p>We retain your personal information only for as long as your account is active or as needed to provide you with services. If you choose to delete your account, we will purge your primary data (email, pen name, stories) from our active databases within 30 days.</p>
            <p><strong>Reading History:</strong> To maintain the integrity of our analytics and prevent "ghost" data, your anonymized reading history (e.g., view counts on stories) may be retained in an aggregated form that cannot be linked back to your deleted identity.</p>

            <hr className="border-t-2 border-on-surface my-8" />
            <div className="bg-surface border-2 border-on-surface p-6 font-headline text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black uppercase tracking-widest text-sm mb-2">Policy Updates</p>
                <p className="text-xs italic leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Effective Date" at the top.
                </p>
            </div>
        </article>
      </main>
    </div>
  );
}
