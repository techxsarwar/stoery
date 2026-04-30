
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function FAQPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Answers</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">Frequently Asked Questions</p>
        </header>

        <section className="flex flex-col gap-8 w-full">
            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">How do I write a story?</h3>
                <p className="font-body text-lg font-medium text-on-surface">You must first <Link href="/auth/signin" className="text-primary hover:underline font-bold">sign in</Link>. Once authenticated, click "Start Writing" in the navigation bar to compose your first chapter and set your cover art.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">What is a magic link?</h3>
                <p className="font-body text-lg font-medium text-on-surface">We removed passwords entirely. When you log in, we send a secure, single-use link to your email inbox. Click it, and you're immediately authenticated into the universe.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">Can I hide my story after publishing?</h3>
                <p className="font-body text-lg font-medium text-on-surface">Yes. Head to your <Link href="/dashboard" className="text-primary hover:underline font-bold">Dashboard</Link> and click the pause icon next to your manuscript. This immediately hides it from the public directory while keeping your content safe.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">Do I own my work?</h3>
                <p className="font-body text-lg font-medium text-on-surface">Absolutely. SOULPAD claims no copyright over your original fiction. You grant us permission strictly to host and display it. For more details, read our <Link href="/terms" className="text-primary hover:underline font-bold">Terms of Service</Link>.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">How does Monetization work?</h3>
                <p className="font-body text-lg font-medium text-on-surface">Once you reach certain milestones (like 5,000 global reads and 50 hours of reading time), you become eligible for our Creator Program. You can apply through the <Link href="/monetization" className="text-primary hover:underline font-bold">Monetization Hub</Link> to start earning revenue based on reader engagement and tips.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">How does SOULPAD protect against piracy?</h3>
                <p className="font-body text-lg font-medium text-on-surface">We take IP protection seriously. Our reader utilizes advanced Piracy Guard technology, which includes dynamic invisible watermarking, screenshot tracking, and right-click disabling. If a manuscript is leaked, we can trace exactly which account captured it.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">What are Licenses in the Codex Registry?</h3>
                <p className="font-body text-lg font-medium text-on-surface">Licenses are official, verifiable certificates issued by the High Council to register your intellectual property on SOULPAD. This provides a timestamped, unalterable proof of creation for your chronicles, which you can even print out.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">Are there content restrictions?</h3>
                <p className="font-body text-lg font-medium text-on-surface">We champion creative freedom, but strictly prohibit hate speech, non-consensual explicit content, and plagiarism. AI-generated spam is also forbidden. Please review our <Link href="/guidelines" className="text-primary hover:underline font-bold">Content Guidelines</Link> before publishing.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">How do I report a stolen story?</h3>
                <p className="font-body text-lg font-medium text-on-surface">If you find content that violates copyright or community guidelines, click the "Report" flag icon found on every story page. Our Moderation Council investigates every report within 48 hours.</p>
            </div>
        </section>
      </main>
    </div>
  );
}

