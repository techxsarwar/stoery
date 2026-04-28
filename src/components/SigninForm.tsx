"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import MathCaptcha from "./MathCaptcha";

export default function SigninForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    if (!isCaptchaValid) {
      setStatus("error");
      setErrorMsg("Please solve the CAPTCHA correctly.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      // Check for callbackUrl in searchParams
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      
      router.push(callbackUrl);
      router.refresh(); // Refresh to strictly ensure server state is updated
    }
  };

  return (
    <form onSubmit={handleSignin} className="flex flex-col gap-5 w-full">
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
          autoComplete="current-password"
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
            Entering...
          </>
        ) : (
          "Sign In"
        )}
      </button>
      
      <div className="text-center mt-2">
         <a href="/auth/forgot-password" className="text-sm font-label font-bold text-on-surface-variant hover:text-primary transition-colors underline underline-offset-2">
            Forgot Password?
         </a>
      </div>
    </form>
  );
}
