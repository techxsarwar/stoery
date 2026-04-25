import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function GuidelinesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={user ?? null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Guidelines</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider mt-4">The Noir Aesthetic & Conduct</p>
        </header>

        <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
            <h2>1. The Visual Tone</h2>
            <p>SOULPAD embraces a bold, high-contrast, text-heavy aesthetic. We take inspiration from brutalist web design and Noir-style Manga serialization. Your cover images and story formatting should lean into stark lighting, heavy inks, and mature themes.</p>

            <h2>2. Content Ratings & Maturity</h2>
            <p>We welcome psychological thrillers, dark fantasy, and complex character studies. However, content must remain distinct from reality. We operate a zero-tolerance policy for:</p>
            <ul>
                <li><strong>Real-World Violence:</strong> Promoting harm against real individuals or groups.</li>
                <li><strong>Illegal Content:</strong> Depicting non-consensual exploitation.</li>
                <li><strong>Hate Speech:</strong> Slurs or targeting based on protected demographics.</li>
            </ul>
            <p>Stories violating these bounds will be paused and subject to review.</p>

            <h2>3. Community Interaction</h2>
            <p>Comments should be constructive. Critique the work, engage with the narrative, but do not attack the author. Toxic behavior in the comment sections will result in an immediate and irreversible ban.</p>

            <hr className="border-t-2 border-on-surface my-8" />
            <p className="font-bold text-2xl uppercase tracking-tighter text-center">Write boldly. Act with respect.</p>
        </article>
      </main>
    </div>
  );
}
