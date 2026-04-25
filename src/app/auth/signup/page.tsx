"use client";

import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export default function SignUp() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-on-surface relative z-10">
        <h2 className="text-4xl font-headline font-black text-on-surface mb-2 text-center tracking-tighter uppercase">
          Join SOULPAD
        </h2>
        <p className="text-center text-on-surface-variant font-body mb-8 text-sm">
          Create an account to start your journey
        </p>
        <div className="flex flex-col gap-8">
          <SignupForm />
        </div>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-0.5 bg-on-surface opacity-10"></div>
          <span className="font-headline font-black text-on-surface-variant uppercase text-xs opacity-50 tracking-widest">Been here before?</span>
          <div className="flex-1 h-0.5 bg-on-surface opacity-10"></div>
        </div>

        <p className="text-center text-sm font-label font-bold text-on-surface-variant">
          <Link
            href="/auth/signin"
            className="text-on-surface hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary decoration-4 uppercase tracking-tighter text-lg"
          >
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
