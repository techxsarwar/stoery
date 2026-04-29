import Link from "next/link";
import { ArrowLeft, BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-surface)] p-4 text-center z-10 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-[var(--color-primary-container)] rounded-full blur-[100px] opacity-30" />
      </div>
      
      <div className="relative max-w-2xl w-full">
        <div className="flex justify-center mb-10">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-2xl bg-[var(--color-secondary)] text-[var(--color-primary)] border-4 border-[var(--color-primary)] transform -rotate-3 glow-hover transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 hover:scale-105">
            <BookX size={64} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-headline text-7xl sm:text-8xl md:text-9xl font-black text-[var(--color-secondary)] mb-4 tracking-tighter uppercase drop-shadow-sm">
          404
        </h1>
        
        <div className="inline-block bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-1.5 border-2 border-[var(--color-secondary)] font-label font-bold uppercase tracking-widest mb-8 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Lost in the Archives
        </div>
        
        <p className="font-body text-[var(--color-on-surface-variant)] text-lg sm:text-xl md:text-2xl max-w-lg mx-auto mb-12 leading-relaxed px-4">
          The story you're looking for seems to have been misplaced, deleted, or never existed in our universe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-label font-bold rounded-full border-2 border-[var(--color-secondary)] glow-hover transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={20} />
            Return to Home
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-2 px-8 py-4 bg-[var(--color-surface)] text-[var(--color-on-surface)] font-label font-bold rounded-full border-2 border-[var(--color-secondary)] glow-hover transition-all duration-300 w-full sm:w-auto justify-center"
          >
            Discover Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
