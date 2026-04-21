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
            <p><strong>Last Updated:</strong> April 21, 2026</p>

            <h2>1. Information We Collect</h2>
            <p>At StoryVerse, we believe in minimal data footprint. We collect only what is strictly necessary to keep your identity secure and your stories safe.</p>
            <ul>
                <li><strong>Email Addresses:</strong> Collected securely via Supabase solely for authentication (Magic Links).</li>
                <li><strong>Profile Data:</strong> Usernames (Pen Names) and basic bio information you choose to provide.</li>
                <li><strong>Uploaded Content:</strong> The stories, chapters, and cover images you create and host on our servers.</li>
            </ul>

            <h2>2. Cookie Policy (The Technical Essentials)</h2>
            <p>We use essential cookies to keep your session alive and your stories secure. We do not use third-party tracking pixels, invasive ad networks, or data brokers. The cookies set by Supabase and Next.js are strictly necessary for the technical operation of StoryVerse.</p>

            <h2>3. Third-Party Infrastructure</h2>
            <p>To keep the universe running, we rely on trusted infrastructure providers who also adhere to strict security protocols:</p>
            <ul>
                <li><strong>Supabase:</strong> For identity management, authentication, and secure database storage.</li>
                <li><strong>Vercel:</strong> For high-performance edge hosting and routing.</li>
                <li><strong>Cloudflare:</strong> For delivering your cover images at lightning speed.</li>
            </ul>

            <h2>4. Your Absolute Rights</h2>
            <p>You own your data. At any time, you have the right to request a full export of your stories or demand the complete, irreversible deletion of your account and all associated data from our servers. To execute this right, use the "Delete" functions in your dashboard or contact our administrative routing desk.</p>

            <hr className="border-t-2 border-on-surface my-8" />
            <p className="italic">StoryVerse operates under the principle of creative freedom backed by technical privacy. Read. Write. Create safely.</p>
        </article>
      </main>
    </div>
  );
}
