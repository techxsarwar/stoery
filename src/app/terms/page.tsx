import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b-4 border-on-surface flex items-center justify-between px-8 py-4 px-6 md:px-12">
          <Link href="/" className="text-2xl font-black tracking-tighter text-on-surface font-headline uppercase">
            STORYVERSE
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface transition-all duration-300 font-bold uppercase" href="/discover">Discover</Link>
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface transition-all duration-300 font-bold uppercase" href="/community">Community</Link>
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface transition-all duration-300 font-bold uppercase" href="/library">My Library</Link>
          </div>
      </nav>

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col gap-4 border-b-8 border-primary pb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Terms of Service</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">Last updated: April 19, 2026</p>
        </header>

        <section className="flex flex-col gap-8 w-full bg-white p-12 border-4 border-on-surface">
            <p className="font-body text-xl font-medium leading-loose text-on-surface">
                By accessing Storyverse, you agree to treat the community with respect. Plagiarism will not be tolerated. Writers maintain 100% ownership of their IP at all times. 
            </p>
            <p className="font-body text-xl font-medium leading-loose text-on-surface">
                Storyverse reserves the right to remove any illegal, extremely graphic, or harmful content that endangers the community.
            </p>
        </section>
      </main>
    </div>
  );
}
