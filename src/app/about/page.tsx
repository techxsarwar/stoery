import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-20 sm:pt-24 px-4 sm:px-6 md:px-12 w-full mx-auto relative pb-24 sm:pb-32">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col gap-2 sm:gap-4 border-b-8 border-primary pb-6 sm:pb-8 text-center items-center">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">About Us</h1>
            <p className="font-label font-bold text-on-surface-variant text-lg sm:text-xl uppercase tracking-wider">A place for stories to breathe</p>
        </header>

        <section className="flex flex-col gap-6 sm:gap-8 w-full bg-white p-6 sm:p-8 md:p-12 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-headline text-3xl font-black text-on-surface uppercase">Our Mission</h2>
            <p className="font-body text-lg sm:text-xl font-medium leading-relaxed sm:leading-loose text-on-surface">
                SOULPAD was born out of a desire to create a brutalist, clean, and entirely distraction-free reading experience that feels as raw as the stories being told. We strip away the complex algorithms and endless feeds, providing a stark white and yellow canvas for creators to write their masterpieces.
            </p>

            <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface uppercase mt-4 sm:mt-8">For Writers</h2>
            <p className="font-body text-lg sm:text-xl font-medium leading-relaxed sm:leading-loose text-on-surface">
                Write loudly. That's our philosophy. No restrictive monetization walls out of the gate. You have the tools, the audience, and the space to craft universes.
            </p>

            <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface uppercase mt-4 sm:mt-8">Join the Community</h2>
            <p className="font-body text-lg sm:text-xl font-medium leading-relaxed sm:leading-loose text-on-surface mb-4 sm:mb-8">
                Ready to dive in? Whether you are here to consume endless arcs of sci-fi fantasy or to publish your next greatest hits, you belong here.
            </p>
            
            <Link href="/auth/signup" className="bg-primary text-on-surface text-center border-2 border-on-surface px-6 sm:px-8 py-3 sm:py-4 font-headline font-black text-lg sm:text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all w-full sm:w-max mx-auto">Start Writing Today</Link>
        </section>
      </main>
    </div>
  );
}
