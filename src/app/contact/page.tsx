import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Transmission</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">Make Contact</p>
        </header>

        <section className="flex flex-col gap-8 w-full">
            <div className="bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-body text-xl font-medium text-on-surface mb-8">
                    Whether you've encountered a glitch in the matrix, need to report a violation, or wish to appeal a paused story, you can reach our administrative desk directly.
                </p>

                <div className="flex flex-col gap-6">
                    <div className="border-4 border-on-surface p-6 bg-surface relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-error"></div>
                        <h2 className="font-headline text-2xl font-black uppercase tracking-widest mb-2">Technical Support & General Inquiries</h2>
                        <a href="mailto:support@storyverse.app" className="font-body text-2xl font-bold text-primary hover:underline">support@storyverse.app</a>
                    </div>

                    <div className="border-4 border-on-surface p-6 bg-surface relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <h2 className="font-headline text-2xl font-black uppercase tracking-widest mb-2">Legal, Abuse & DMCA Claims</h2>
                        <a href="mailto:legal@storyverse.app" className="font-body text-2xl font-bold text-primary hover:underline">legal@storyverse.app</a>
                    </div>
                </div>

                <p className="font-label font-bold text-on-surface-variant uppercase tracking-widest text-center mt-12">
                     Average Response Time: 48 Hours.
                </p>
            </div>
        </section>
      </main>
    </div>
  );
}
