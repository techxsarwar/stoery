"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MathCaptcha from "./MathCaptcha";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    
    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!isCaptchaValid) {
      setStatus("error");
      setErrorMsg("Please solve the CAPTCHA correctly.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else if (data?.user?.identities?.length === 0) {
        // Supabase returns an empty identities array if the user already exists 
        // to prevent email enumeration, but conditionally based on settings.
        setStatus("error");
        setErrorMsg("User already registered. Please sign in instead.");
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-full border-4 border-black bg-[#1DB954] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-headline font-black text-2xl text-black uppercase tracking-tighter text-center">
            ✓ Registration Complete!
          </p>
          <p className="font-body text-black/80 text-center mt-2 font-bold">
            We've sent a verification link to <span className="underline decoration-4 decoration-black">{email}</span>.
            Please check your inbox to confirm your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full">
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

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface placeholder:text-on-surface-variant/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface placeholder:text-on-surface-variant/50"
        />
      </div>

      <MathCaptcha onValidate={setIsCaptchaValid} />

      <button
        type="submit"
        disabled={status === "loading" || !isCaptchaValid}
        className="mt-2 flex items-center justify-center gap-3 bg-on-surface text-surface border-4 border-on-surface px-10 py-5 font-headline font-black text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin inline-block w-5 h-5 border-2 border-surface border-t-transparent rounded-full" />
            Processing...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
