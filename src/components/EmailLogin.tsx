"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-full border-4 border-black bg-[#1DB954] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-headline font-black text-2xl text-black uppercase tracking-tighter text-center">
            ✓ Check Your Inbox
          </p>
          <p className="font-body text-black/80 text-center mt-2 font-bold">
            A magic link has been sent to <span className="underline decoration-4 decoration-black">{email}</span>
          </p>
        </div>
        <button
          onClick={() => { setStatus("idle"); setEmail(""); }}
          className="text-on-surface-variant font-headline text-sm uppercase tracking-widest hover:text-on-surface transition-colors underline underline-offset-4"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
      {status === "error" && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-headline font-bold uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="YOUR.EMAIL@UNIVERSE.COM"
          className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface placeholder:text-on-surface-variant/50 uppercase"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-3 bg-on-surface text-surface border-4 border-on-surface px-10 py-5 font-headline font-black text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all w-full disabled:opacity-50"
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin inline-block w-5 h-5 border-2 border-surface border-t-transparent rounded-full" />
            Sending...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.42 2 2 0 0 1 3.91 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Send Magic Link
          </>
        )}
      </button>

      <p className="text-center text-xs font-label text-on-surface-variant mt-2 leading-relaxed">
        We&apos;ll send a secure, single-use link to your email.
        <br />No password needed.
      </p>
    </form>
  );
}
