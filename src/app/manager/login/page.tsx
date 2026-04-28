"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, Eye, EyeOff, Terminal, AlertTriangle, Cpu, Crown } from "lucide-react";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "denied" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();

    // Step 1: Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      setStatus("error");
      setErrorMsg("Neural link failed. Verify credentials.");
      return;
    }

    // Step 2: Verify role via API
    try {
      const res = await fetch("/api/manager/verify-role");
      
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(`Verification server error: ${res.status}`);
        return;
      }

      const { role } = await res.json();

      if (role !== "MANAGER") {
        await supabase.auth.signOut();
        setStatus("denied");
        setErrorMsg("ACCESS DENIED. HIGH-LEVEL CLEARANCE REQUIRED.");
        return;
      }

      // Step 3: Access granted
      router.push("/manager");
      router.refresh();
    } catch (err) {
      console.error("Manager role verification error:", err);
      setStatus("error");
      setErrorMsg("Connection error during role verification.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(234,179,8,0.05)_2px,transparent_2px)] bg-[size:50px_50px]" />
      
      {/* Neo-brutalist shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 border-4 border-on-surface bg-primary rounded-[32px] flex items-center justify-center mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3">
            <Crown size={48} className="text-on-surface" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Shield size={14} className="text-primary" />
            <span className="font-black text-on-surface/40 text-[10px] uppercase tracking-[0.5em]">
              High Command Access
            </span>
          </div>
          <h1 className="font-black text-6xl text-on-surface uppercase tracking-tighter text-center italic leading-none">
            AEGIS PRO
          </h1>
          <p className="font-black text-on-surface/30 text-[11px] uppercase tracking-[0.3em] mt-4">
            Manager Terminal // Level 10
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border-4 border-on-surface rounded-[40px] p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Error / Denied Messages */}
          {(status === "error" || status === "denied") && (
            <div className={`flex items-start gap-4 p-5 rounded-2xl border-4 mb-8 ${
              status === "denied" 
                ? "bg-red-50 border-red-500 text-red-600" 
                : "bg-primary/10 border-primary text-on-surface"
            }`}>
              <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="font-black text-[10px] uppercase tracking-wider leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-8">
            {/* Email */}
            <div className="flex flex-col gap-3">
              <label className="font-black text-[11px] uppercase tracking-[0.3em] text-on-surface/40">
                Command Neural ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="commander@soulpad.com"
                className="w-full bg-surface border-4 border-on-surface rounded-2xl px-6 py-5 font-black text-sm text-on-surface placeholder:text-on-surface/20 focus:outline-none focus:bg-primary/5 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-3">
              <label className="font-black text-[11px] uppercase tracking-[0.3em] text-on-surface/40">
                Encryption Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-surface border-4 border-on-surface rounded-2xl px-6 py-5 font-black text-sm text-on-surface placeholder:text-on-surface/20 focus:outline-none focus:bg-primary/5 transition-all pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/20 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full mt-4 bg-primary text-on-surface font-black text-sm uppercase tracking-[0.4em] py-6 rounded-2xl border-4 border-on-surface hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group"
            >
              {status === "loading" ? (
                <>
                  <span className="w-5 h-5 border-4 border-on-surface border-t-transparent rounded-full animate-spin" />
                  Syncing Core...
                </>
              ) : (
                <>
                  <Shield size={20} className="group-hover:animate-pulse" />
                  Access System
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center font-black text-on-surface/20 text-[10px] uppercase tracking-[0.4em] mt-12">
          Directive 01: Maintain Absolute Integrity.
        </p>
      </div>
    </div>
  );
}
