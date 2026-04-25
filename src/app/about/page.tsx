import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b-4 border-on-surface flex items-center justify-between px-8 py-4 px-6 md:px-12">
          <Link href="/" className="text-2xl font-black tracking-tighter text-on-surface font-headline uppercase">
            SOULPAD
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface transition-all duration-300 font-bold uppercase" href="/discover">Discover</Link>
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface transition-all duration-300 font-bold uppercase" href="/community">Community</Link>
            <Link className="font-headline tracking-wide text-on-surface-variant hover:text-on-surface transition-all duration-300 font-bold uppercase" href="/library">My Library</Link>
          </div>
          <Link href="/dashboard/write" className="bg-primary text-on-primary font-headline px-6 py-2 rounded font-bold border-2 border-on-surface transition-all duration-300 glow-hover uppercase tracking-wide">
            Start Writing
          </Link>
      </nav>

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8 pb-32">
        <header className="w-full flex flex-col gap-4 border-b-8 border-primary pb-8 text-center items-center">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">About Us</h1>
            <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">A place for stories to breathe</p>
        </header>

        <section className="flex flex-col gap-8 w-full bg-white p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-headline text-3xl font-black text-on-surface uppercase">Our Mission</h2>
            <p className="font-body text-xl font-medium leading-loose text-on-surface">
                SOULPAD was born out of a desire to create a brutalist, clean, and entirely distraction-free reading experience that feels as raw as the stories being told. We strip away the complex algorithms and endless feeds, providing a stark white and yellow canvas for creators to write their masterpieces.
            </p>

            <h2 className="font-headline text-3xl font-black text-on-surface uppercase mt-8">For Writers</h2>
            <p className="font-body text-xl font-medium leading-loose text-on-surface">
                Write loudly. That's our philosophy. No restrictive monetization walls out of the gate. You have the tools, the audience, and the space to craft universes.
            </p>

            <h2 className="font-headline text-3xl font-black text-on-surface uppercase mt-8">Join the Community</h2>
            <p className="font-body text-xl font-medium leading-loose text-on-surface mb-8">
                Ready to dive in? Whether you are here to consume endless arcs of sci-fi fantasy or to publish your next greatest hits, you belong here.
            </p>
            
            <Link href="/auth/signup" className="bg-primary text-on-surface text-center border-2 border-on-surface px-8 py-4 font-headline font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all w-max mx-auto">Start Writing Today</Link>
        </section>
      </main>
    </div>
  );
}
