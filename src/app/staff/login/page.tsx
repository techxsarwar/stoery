"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, Eye, EyeOff, Terminal, AlertTriangle } from "lucide-react";

export default function StaffLoginPage() {
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
      setErrorMsg("Authentication failed. Check your credentials.");
      return;
    }

    // Step 2: Verify role via API
    const res = await fetch("/api/staff/verify-role");
    const { role } = await res.json();

    if (role !== "EMPLOYEE" && role !== "ADMIN") {
      // Immediately sign them out — no access
      await supabase.auth.signOut();
      setStatus("denied");
      setErrorMsg("ACCESS DENIED. This terminal is restricted to authorized personnel only.");
      return;
    }

    // Step 3: Access granted — redirect to The Observatory
    router.push("/staff");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)] pointer-events-none" />

      {/* Glowing orb background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 border-2 border-yellow-400/40 rounded-2xl flex items-center justify-center mb-6 bg-yellow-400/5 shadow-[0_0_40px_rgba(234,179,8,0.15)]">
            <Shield size={40} className="text-yellow-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={12} className="text-yellow-400/60" />
            <span className="font-mono text-yellow-400/60 text-[10px] uppercase tracking-[0.4em]">
              Restricted Access Terminal
            </span>
          </div>
          <h1 className="font-mono font-black text-4xl text-white uppercase tracking-tighter text-center">
            The Observatory
          </h1>
          <p className="font-mono text-white/30 text-xs uppercase tracking-[0.3em] mt-2">
            Staff Portal // Authorize to Enter
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          
          {/* Error / Denied Messages */}
          {(status === "error" || status === "denied") && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border mb-6 ${
              status === "denied" 
                ? "bg-red-500/10 border-red-500/30 text-red-400" 
                : "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
            }`}>
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <p className="font-mono text-xs uppercase tracking-wider leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Personnel ID (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="operative@soulpad.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-yellow-400/5 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Authorization Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-yellow-400/5 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full mt-2 bg-yellow-400 text-black font-mono font-black text-sm uppercase tracking-[0.3em] py-4 rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)]"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Authenticate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center font-mono text-white/20 text-[10px] uppercase tracking-widest mt-8">
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}

