"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMsg("Passwords do not match.");
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
    
    // Update the password for the current authenticated user
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      // Password updated successfully. Redirect to dashboard.
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 w-full">
      {status === "error" && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-headline font-bold uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="••••••••"
          className="w-full border-4 border-on-surface px-4 sm:px-5 py-3 sm:py-4 font-body font-bold text-base sm:text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface placeholder:text-on-surface-variant/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          placeholder="••••••••"
          className="w-full border-4 border-on-surface px-4 sm:px-5 py-3 sm:py-4 font-body font-bold text-base sm:text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface placeholder:text-on-surface-variant/50"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 flex items-center justify-center gap-2 sm:gap-3 bg-on-surface text-surface border-4 border-on-surface px-6 sm:px-10 py-4 sm:py-5 font-headline font-black text-lg sm:text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin inline-block w-5 h-5 border-2 border-surface border-t-transparent rounded-full" />
            Updating...
          </>
        ) : (
          "Save New Password"
        )}
      </button>
    </form>
  );
}
