
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function ChangelogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Changelog</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">The Evolution of the Universe</p>
        </header>

        <section className="flex flex-col gap-8 w-full">
            <article className="bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <div className="flex justify-between items-end mb-6 border-b-2 border-on-surface pb-4">
                    <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">v1.2.0: The Authority Update</h2>
                    <span className="font-label font-bold text-outline-variant text-sm tracking-widest uppercase">April 21, 2026</span>
                </div>
                <ul className="list-disc pl-6 font-body text-lg flex flex-col gap-3 font-medium">
                    <li><strong className="font-headline uppercase tracking-wider text-primary">Magic Link Authentication:</strong> Migrated completely to Supabase SSR. Passwords are a thing of the past.</li>
                    <li><strong className="font-headline uppercase tracking-wider text-primary">Author Dashboard:</strong> Authors now have a centralized command center at `/dashboard` to manage their stories.</li>
                    <li><strong className="font-headline uppercase tracking-wider text-primary">Story Status Toggles:</strong> You can now toggle your stories between PUBLISHED and PAUSED instantly.</li>
                    <li><strong className="font-headline uppercase tracking-wider text-primary">Secure Deletion:</strong> Added hard deletes for stories with server-author verification constraints.</li>
                    <li><strong className="font-headline uppercase tracking-wider text-primary">Engagement Shielding:</strong> You must be an authorized Slayer of Stars (logged in) to Like or Comment.</li>
                </ul>
            </article>

            <article className="bg-white p-8 md:p-12 border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative opacity-80 mt-4">
                <div className="absolute top-0 left-0 w-2 h-full bg-outline-variant"></div>
                <div className="flex justify-between items-end mb-6 border-b-2 border-on-surface pb-4">
                    <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">v1.1.0: Visual Overhaul</h2>
                    <span className="font-label font-bold text-outline-variant text-sm tracking-widest uppercase">March 29, 2026</span>
                </div>
                <ul className="list-disc pl-6 font-body text-lg flex flex-col gap-3 font-medium">
                    <li>Implemented the Noir Manga visual aesthetic across all components.</li>
                    <li>Added high-contrast shadows, stark borders, and absolute monochromatic styling.</li>
                    <li>Integrated Cloudflare R2 structure for image and cover uploading.</li>
                </ul>
            </article>
        </section>
      </main>
    </div>
  );
}

