
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
                <p className="font-body text-lg font-medium text-on-surface">Yes. Head to your <Link href="/dashboard" className="text-primary hover:underline font-bold">Dashboard</Link> and click "Pause Story". This immediately hides it from the public directory while keeping your content safe.</p>
            </div>

            <div className="bg-white p-8 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">Do I own my work?</h3>
                <p className="font-body text-lg font-medium text-on-surface">Absolutely. SOULPAD claims no copyright over your original fiction. You grant us permission strictly to host and display it. For more details, read our <Link href="/terms" className="text-primary hover:underline font-bold">Terms of Service</Link>.</p>
            </div>
        </section>
      </main>
    </div>
  );
}

