
import Link from "next/link";
import { guides } from "@/data/guides";
import Navbar from "@/components/Navbar";
import { BookOpen, Lightbulb, Clock } from "lucide-react";

export const metadata = {
  title: "Guidebook for Architects | SOULPAD",
  description: "A 20-page masterclass for authors. Learn how to write, build worlds, grow your audience, and unlock monetization on SOULPAD.",
};

const volumes = [
  { number: 1, title: "The How-To", subtitle: "Technical Mastery", icon: BookOpen, color: "text-primary", range: [1, 7] },
  { number: 2, title: "The What-To", subtitle: "Content Strategy", icon: Lightbulb, color: "text-emerald-500", range: [8, 13] },
  { number: 3, title: "The When-To", subtitle: "Timing & Growth", icon: Clock, color: "text-purple-400", range: [14, 20] },
];

export default function GuidebookIndex() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar user={null} />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-20">
        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full font-label font-black text-[10px] uppercase tracking-[0.4em]">
            SOULPAD // Architect Series
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-on-surface uppercase leading-none max-w-4xl">
            Guidebook for <span className="text-primary">Architects</span>
          </h1>
          <p className="font-body text-xl text-on-surface-variant italic max-w-2xl">
            "The difference between a writer and an author is the mastery of craft. These 20 scrolls will make you both."
          </p>
          <div className="flex items-center gap-8 mt-4">
            <div className="text-center">
              <div className="font-headline font-black text-4xl text-on-surface">20</div>
              <div className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Pages</div>
            </div>
            <div className="w-px h-10 bg-on-surface/10" />
            <div className="text-center">
              <div className="font-headline font-black text-4xl text-on-surface">3</div>
              <div className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Volumes</div>
            </div>
            <div className="w-px h-10 bg-on-surface/10" />
            <div className="text-center">
              <div className="font-headline font-black text-4xl text-on-surface">∞</div>
              <div className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Potential</div>
            </div>
          </div>
        </section>

        {/* Volumes */}
        {volumes.map((vol) => {
          const volGuides = guides.filter(g => g.volume === vol.number);
          const Icon = vol.icon;
          return (
            <section key={vol.number} className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-on-surface/5 flex items-center justify-center ${vol.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="font-label font-black text-[10px] uppercase tracking-[0.4em] text-on-surface-variant opacity-60">Volume {vol.number}</p>
                  <h2 className="font-headline font-black text-3xl text-on-surface uppercase tracking-tight">{vol.title} <span className="text-on-surface-variant/40 text-xl">// {vol.subtitle}</span></h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {volGuides.map((guide) => (
                  <Link key={guide.slug} href={`/guide/${guide.slug}`}>
                    <article className="group h-full bg-surface-container-high border-2 border-on-surface/5 hover:border-primary/40 rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <span className="font-headline font-black text-5xl text-on-surface/10 group-hover:text-primary/20 transition-colors">
                          {String(guide.number).padStart(2, "0")}
                        </span>
                        <span className={`font-label font-black text-[9px] uppercase tracking-widest border px-2 py-0.5 rounded-full ${
                          guide.tag === "How-To" ? "border-primary/30 text-primary" :
                          guide.tag === "What-To" ? "border-emerald-500/30 text-emerald-500" :
                          "border-purple-400/30 text-purple-400"
                        }`}>{guide.tag}</span>
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-lg text-on-surface uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="font-body text-sm text-on-surface-variant mt-2 line-clamp-2 italic opacity-70">
                          {guide.excerpt}
                        </p>
                      </div>
                      <span className="mt-auto font-label font-black text-[10px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read →
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="border-t-2 border-on-surface/5 py-8 px-6 text-center">
        <p className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
          SOULPAD Guidebook for Architects — Crafted for the Builders of Worlds
        </p>
      </footer>
    </div>
  );
}

