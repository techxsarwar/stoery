
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { MapPin, Clock, Zap, Heart, Globe, Shield } from "lucide-react";

export const metadata = {
  title: "Careers | SOULPAD",
  description: "Join the SOULPAD team. We are building the future of storytelling — come help us shape it.",
};

import { prisma } from "@/lib/prisma";

// We keep values static for the UI


const values = [
  { icon: Zap, title: "Velocity", description: "We move fast and iterate constantly. Ideas become live features within days, not quarters." },
  { icon: Heart, title: "Creator First", description: "Every decision is measured by one question: does this make life better for our authors and readers?" },
  { icon: Globe, title: "Radically Remote", description: "We are a fully remote team. We believe talent is everywhere and that async-first culture produces better work." },
  { icon: Shield, title: "Integrity", description: "We build tools that are honest, fair, and built to last. We do not exploit creators. We grow with them." },
];

export default async function CareersPage() {
  // Fetch active jobs from DB
  const openRoles = await prisma.jobPosting.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar user={null} />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-24">

        {/* Hero */}
        <section className="flex flex-col gap-8 max-w-4xl">
          <div className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full font-label font-black text-[10px] uppercase tracking-[0.4em] w-fit">
            We're Hiring
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-on-surface uppercase leading-none">
            Build the Future of <span className="text-primary">Storytelling</span>
          </h1>
          <p className="font-body text-xl text-on-surface-variant leading-relaxed max-w-2xl">
            SOULPAD is building the platform where the world's most creative voices are heard, supported, and rewarded. We are a small, ambitious team with a massive vision — and we are looking for people who believe that stories can change the world.
          </p>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-headline font-black text-4xl text-on-surface">{openRoles.length}</div>
              <div className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Open Roles</div>
            </div>
            <div className="w-px h-10 bg-on-surface/10" />
            <div className="text-center">
              <div className="font-headline font-black text-4xl text-on-surface">100%</div>
              <div className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Remote</div>
            </div>
            <div className="w-px h-10 bg-on-surface/10" />
            <div className="text-center">
              <div className="font-headline font-black text-4xl text-on-surface">∞</div>
              <div className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Impact</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="flex flex-col gap-10">
          <h2 className="font-headline font-black text-4xl text-on-surface uppercase tracking-tighter">
            How We Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-8 bg-surface-container-high border-2 border-on-surface/5 rounded-3xl flex flex-col gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight">{v.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Open Roles */}
        <section className="flex flex-col gap-10">
          <div className="flex items-end justify-between">
            <h2 className="font-headline font-black text-4xl text-on-surface uppercase tracking-tighter">
              Open Positions
            </h2>
            <p className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
              {openRoles.length} roles available
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {openRoles.map((role) => (
              <div key={role.title} className="group bg-surface-container-high border-2 border-on-surface/5 hover:border-primary/30 rounded-2xl p-8 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex flex-col gap-3 flex-grow">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`font-label font-black text-[9px] uppercase tracking-widest border px-3 py-1 rounded-full ${role.tagColor}`}>
                        {role.tag}
                      </span>
                      <span className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
                        {role.department}
                      </span>
                    </div>
                    <h3 className="font-headline font-black text-2xl text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <p className="font-body text-on-surface-variant leading-relaxed max-w-2xl">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {role.skills.map((skill) => (
                        <span key={skill} className="font-label font-bold text-[10px] uppercase tracking-wider bg-on-surface/5 text-on-surface-variant px-3 py-1 rounded-full border border-on-surface/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:items-end flex-shrink-0">
                    <div className="flex items-center gap-2 text-on-surface-variant opacity-50">
                      <MapPin size={12} />
                      <span className="font-label font-bold text-[10px] uppercase tracking-widest">{role.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant opacity-50">
                      <Clock size={12} />
                      <span className="font-label font-bold text-[10px] uppercase tracking-widest">{role.type}</span>
                    </div>
                    <Link
                      href={`/careers/apply?role=${encodeURIComponent(role.title)}`}
                      className="mt-2 bg-primary text-on-primary font-headline font-black text-sm uppercase tracking-tighter px-6 py-3 rounded-xl hover:bg-on-surface hover:text-surface transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                    >
                      Apply Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-on-surface rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[8px_8px_0px_0px_rgba(234,179,8,0.3)]">
          <div className="flex flex-col gap-4">
            <h2 className="font-headline font-black text-4xl text-surface uppercase tracking-tighter leading-tight">
              Don't See Your <span className="text-primary">Role?</span>
            </h2>
            <p className="font-body text-surface/60 max-w-lg">
              We are always looking for exceptional people. Send us your story — what you do, what you believe in, and why SOULPAD matters to you.
            </p>
          </div>
          <Link
            href="/careers/apply?role=Open%20Application"
            className="flex-shrink-0 bg-primary text-on-primary font-headline font-black text-lg uppercase tracking-tighter px-10 py-5 rounded-2xl hover:bg-yellow-300 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]"
          >
            Send an Open Application
          </Link>
        </section>

      </main>

      <footer className="border-t-2 border-on-surface/5 py-8 px-6 text-center">
        <p className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">
          SOULPAD Careers — Building a world where every story finds its reader.
        </p>
      </footer>
    </div>
  );
}

