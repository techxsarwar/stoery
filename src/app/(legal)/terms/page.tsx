import Navbar from "@/components/Navbar";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Terms of Service</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">The Rules of the Game</p>
        </header>

        <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
            <p><strong>Last Updated:</strong> April 21, 2026</p>
            <p>Welcome to StoryVerse. By accessing this platform, creating an account, or publishing content, you agree to abide by the following directives.</p>

            <h2>1. Content Authorization & Ownership</h2>
            <p><strong>You Own Your Work.</strong> StoryVerse claims absolutely zero copyright or ownership over the original stories, manga, or art you create and publish here. You retain all intellectual property rights.</p>
            <p><strong>Display License:</strong> By publishing on StoryVerse, you grant us a worldwide, non-exclusive, royalty-free license to host, display, and distribute your content strictly within the context of the platform.</p>

            <h2>2. Platform Conduct (The Hard Lines)</h2>
            <p>StoryVerse encourages dark, mature, and complex themes ("Noir Aesthetics", "Dark Psychology"). However, fiction must remain fiction. The following are strictly forbidden:</p>
            <ul>
                <li>Content that incites, promotes, or details real-world harm, terrorism, or violence against individuals or groups.</li>
                <li>Harassment, doxxing, or targeted abuse of other authors and readers.</li>
                <li>Illegal content, including explicit illicit material or the distribution of copyrighted material you do not own.</li>
            </ul>

            <h2>3. Termination and Enforcement</h2>
            <p>We reserve the unilateral right to "pause" works from public visibility or instantly terminate accounts that violate the Conduct guidelines. If your content is paused, it will remain safely in your dashboard, but it will be inaccessible to the public until the violation is resolved.</p>

            <h2>4. DMCA / Copyright Policy</h2>
            <p>StoryVerse respects the intellectual property rights of creators globally. If you believe that your copyrighted work has been copied, scraped, or published on StoryVerse without your authorization, you must submit a formal Takedown Notice.</p>
            <p>Please send all DMCA claims, including proof of original ownership and the specific URL of the infringing material, to:</p>
            <div className="bg-surface border-2 border-on-surface p-4 font-headline uppercase font-bold tracking-widest text-center my-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                legal@storyverse.app
            </div>
            <p>We will act swiftly to investigate and remove stolen assets.</p>

            <hr className="border-t-2 border-on-surface my-8" />
            <p className="font-bold">By continuing to use StoryVerse, you acknowledge these terms. Break the rules, and you lose access to the universe.</p>
        </article>
      </main>
    </div>
  );
}
