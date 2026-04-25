"use client";

import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-on-surface relative z-10">
        <h2 className="text-4xl font-headline font-black text-on-surface mb-2 text-center tracking-tighter uppercase">
          Lost Key
        </h2>
        <p className="text-center text-on-surface-variant font-body mb-8 text-sm">
          Enter your email to receive a password reset link
        </p>

        <ForgotPasswordForm />

        <p className="mt-8 text-center text-sm font-label font-bold text-on-surface-variant">
          <Link
            href="/auth/signin"
            className="text-on-surface hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary decoration-4 uppercase tracking-tighter"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
