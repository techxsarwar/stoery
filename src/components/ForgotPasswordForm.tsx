"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    
    // Send password reset email and redirect back to our reset password page
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-full border-4 border-black bg-[#1DB954] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-headline font-black text-2xl text-black uppercase tracking-tighter text-center">
            ✓ Check Your Inbox
          </p>
          <p className="font-body text-black/80 text-center mt-2 font-bold">
            If an account with <span className="underline decoration-4 decoration-black">{email}</span> exists, a password reset link has been sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetRequest} className="flex flex-col gap-4 w-full">
      {status === "error" && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-headline font-bold uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Account Email
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
        className="mt-2 flex items-center justify-center gap-3 bg-on-surface text-surface border-4 border-on-surface px-10 py-5 font-headline font-black text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin inline-block w-5 h-5 border-2 border-surface border-t-transparent rounded-full" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>
    </form>
  );
}
