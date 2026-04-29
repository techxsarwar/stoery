export const unstable_instant = { prefetch: "static" };
import { guides } from "@/data/guides";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Guidebook for Architects | SOULPAD`,
    description: guide.excerpt,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const currentIndex = guides.indexOf(guide);
  const prev = guides[currentIndex - 1] || null;
  const next = guides[currentIndex + 1] || null;

  const tagColor = guide.tag === "How-To"
    ? "border-primary/30 text-primary bg-primary/5"
    : guide.tag === "What-To"
    ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
    : "border-purple-400/30 text-purple-400 bg-purple-400/5";

  const paragraphs = guide.content.split(". ").reduce<string[][]>((acc, sentence, i) => {
    const group = Math.floor(i / 3);
    if (!acc[group]) acc[group] = [];
    acc[group].push(sentence);
    return acc;
  }, []).map(g => g.join(". "));

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar user={null} />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full flex flex-col gap-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-50">
          <Link href="/guide" className="hover:text-primary transition-colors">Guidebook</Link>
          <span>/</span>
          <span>Volume {guide.volume}</span>
          <span>/</span>
          <span className="text-on-surface opacity-100">Page {guide.number}</span>
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-6 pb-12 border-b-4 border-primary">
          <div className="flex items-center gap-4">
            <span className={`font-label font-black text-[10px] uppercase tracking-widest border px-3 py-1 rounded-full ${tagColor}`}>
              {guide.tag}
            </span>
            <span className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
              Volume {guide.volume} // Page {guide.number} of 20
            </span>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface uppercase tracking-tighter leading-none">
            {guide.title}
          </h1>
          <p className="font-body text-xl text-on-surface-variant italic">
            {guide.excerpt}
          </p>
        </header>

        {/* Content */}
        <article className="flex flex-col gap-8">
          {paragraphs.map((para, i) => (
            <p key={i} className="font-body text-xl text-on-surface leading-[1.9] tracking-wide">
              {i === 0 && (
                <span className="float-left font-headline font-black text-7xl leading-[0.75] mr-3 mt-2 text-primary">
                  {para[0]}
                </span>
              )}
              {i === 0 ? para.slice(1) : para}.
            </p>
          ))}
        </article>

        {/* Progress bar */}
        <div className="flex flex-col gap-2 py-8 border-y-2 border-on-surface/5">
          <div className="flex justify-between font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
            <span>Progress through the Grimoire</span>
            <span>{guide.number} / 20</span>
          </div>
          <div className="w-full h-2 bg-on-surface/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(guide.number / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/guide/${prev.slug}`} className="group flex flex-col gap-2 p-6 bg-surface-container-high border-2 border-on-surface/5 hover:border-primary/30 rounded-2xl transition-all">
              <div className="flex items-center gap-2 font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
                <ArrowLeft size={12} />
                Previous
              </div>
              <p className="font-headline font-black text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">{prev.title}</p>
            </Link>
          ) : <div />}

          {next ? (
            <Link href={`/guide/${next.slug}`} className="group flex flex-col gap-2 p-6 bg-surface-container-high border-2 border-on-surface/5 hover:border-primary/30 rounded-2xl transition-all text-right">
              <div className="flex items-center justify-end gap-2 font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
                Next
                <ArrowRight size={12} />
              </div>
              <p className="font-headline font-black text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">{next.title}</p>
            </Link>
          ) : (
            <Link href="/guide" className="group flex flex-col gap-2 p-6 bg-primary border-2 border-primary rounded-2xl transition-all text-right">
              <div className="flex items-center justify-end gap-2 font-label font-bold text-[10px] uppercase tracking-widest text-on-primary opacity-70">
                <BookOpen size={12} />
                Complete
              </div>
              <p className="font-headline font-black text-on-primary uppercase tracking-tight">Back to Guidebook Index</p>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

