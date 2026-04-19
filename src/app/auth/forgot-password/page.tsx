"use client";

import { forgotPassword } from "@/actions/auth";
import { useState, useTransition } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);

      const res = await forgotPassword(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        setMessage("Check your email for a reset link.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-on-surface relative z-10">
        <h2 className="text-4xl font-headline font-black text-on-surface mb-8 text-center tracking-tighter uppercase">
          Reset Password
        </h2>
        {error && (
          <div className="bg-error font-headline font-bold text-on-error p-3 rounded-lg text-sm mb-6 text-center border-2 border-on-surface">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-primary/20 font-headline font-bold text-on-surface p-3 rounded-lg text-sm mb-6 text-center border-2 border-on-surface">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-headline font-bold text-sm text-on-surface uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              className="bg-surface border-2 border-on-surface text-on-surface px-4 py-3 rounded focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 font-label placeholder:text-outline-variant"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 bg-primary text-on-primary border-2 border-on-surface font-headline text-xl px-8 py-4 rounded hover:bg-primary-container transition-all duration-300 glow-hover font-black w-full uppercase tracking-wider disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm font-label font-bold text-on-surface-variant">
          Remember your password?{" "}
          <Link
            href="/auth/signin"
            className="text-on-surface hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary decoration-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
