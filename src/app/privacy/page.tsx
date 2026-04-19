import Link from "next/link";

export default function PrivacyPage() {
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
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Privacy Policy</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">How we handle your data</p>
        </header>

        <section className="flex flex-col gap-8 w-full bg-white p-12 border-4 border-on-surface">
            <p className="font-body text-xl font-medium leading-loose text-on-surface">
                We only collect the data necessary to provide you with the core functionality of Storyverse. This includes your email (for authentication), pen name, and stories.
            </p>
            <p className="font-body text-xl font-medium leading-loose text-on-surface">
                We do not sell your personal reading habits, behavioral data, or writing analytics to any third parties. Storyverse is built for writers and readers, not advertisers.
            </p>
        </section>
      </main>
    </div>
  );
}
