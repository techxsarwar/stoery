"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/actions/auth";

const USERNAME_REGEX = /^[a-z0-9_]*$/;

export default function OnboardingPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [usernameVal, setUsernameVal] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setUsernameVal(val);
    if (val && !USERNAME_REGEX.test(val)) {
      setUsernameError("Only letters, numbers, and underscores allowed");
    } else if (val.length > 14) {
      setUsernameError("Max 14 characters");
    } else {
      setUsernameError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (usernameError) return;
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await completeOnboarding(formData);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 z-50 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      <div className="bg-black border-2 border-[#00ff41] p-8 md:p-12 max-w-3xl w-full shadow-[0_0_20px_rgba(0,255,65,0.2)] relative z-10 text-[#00ff41]">
        <div className="mb-8 border-b-2 border-[#00ff41]/30 pb-4">
            <h1 className="text-2xl md:text-4xl font-bold tracking-widest uppercase mb-2 animate-pulse">
            &gt; SYSTEM.INITIATE_PROTOCOL("AUTHOR")
            </h1>
            <p className="text-sm opacity-80 uppercase tracking-widest">
            Establishing neural link... Identity required for databank entry.
            </p>
        </div>

        {error && (
          <div className="bg-red-900/20 text-red-500 border border-red-500 p-4 mb-8 text-sm uppercase tracking-wider">
            [ERROR]: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-widest opacity-70">
              [01] INPUT_REAL_IDENTITY
            </label>
            <div className="flex items-center gap-4">
                <span className="text-xl">&gt;</span>
                <input
                name="fullName"
                required
                className="w-full bg-transparent border-b-2 border-[#00ff41]/50 p-2 text-xl focus:border-[#00ff41] focus:outline-none transition-colors placeholder:text-[#00ff41]/20"
                placeholder="YOUR REAL NAME"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest opacity-70">
                [02] CYCLES_ALIVE
              </label>
              <div className="flex items-center gap-4">
                  <span className="text-xl">&gt;</span>
                  <input
                    name="age"
                    type="number"
                    required
                    className="w-full bg-transparent border-b-2 border-[#00ff41]/50 p-2 text-xl focus:border-[#00ff41] focus:outline-none transition-colors placeholder:text-[#00ff41]/20"
                    placeholder="AGE"
                  />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest opacity-70">
                [03] CHOOSE_ALIAS
              </label>
              <div className="flex items-center gap-4">
                  <span className="text-xl">&gt;</span>
                  <input
                    name="penName"
                    required
                    className="w-full bg-transparent border-b-2 border-[#00ff41]/50 p-2 text-xl focus:border-[#00ff41] focus:outline-none transition-colors placeholder:text-[#00ff41]/20"
                    placeholder="PEN NAME"
                  />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-widest opacity-70 flex justify-between">
              <span>[04] NETWORK_HANDLE</span>
              <span className={`${usernameVal.length > 12 ? "text-red-500" : "opacity-50"}`}>
                CHARS: {usernameVal.length}/14
              </span>
            </label>
            <div className="flex items-center gap-4">
                <span className="text-xl">@</span>
                <input
                    name="username"
                    value={usernameVal}
                    onChange={handleUsernameChange}
                    required
                    maxLength={14}
                    className={`w-full bg-transparent border-b-2 p-2 text-xl focus:outline-none transition-colors placeholder:text-[#00ff41]/20 ${
                    usernameError ? "border-red-500 text-red-500" : "border-[#00ff41]/50 focus:border-[#00ff41]"
                    }`}
                    placeholder="system_username"
                />
            </div>
            {usernameError && (
              <p className="text-red-500 text-xs uppercase tracking-widest">{usernameError}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-widest opacity-70">
              [05] LINEAGE (OPTIONAL)
            </label>
            <div className="flex items-center gap-4">
                <span className="text-xl">&gt;</span>
                <input
                name="parentage"
                className="w-full bg-transparent border-b-2 border-[#00ff41]/50 p-2 text-xl focus:border-[#00ff41] focus:outline-none transition-colors placeholder:text-[#00ff41]/20"
                placeholder="PARENTAGE / ORIGIN"
                />
            </div>
          </div>

          <div className="flex items-start gap-4 mt-6 p-4 border border-[#00ff41]/30 bg-[#00ff41]/5">
            <input
              type="checkbox"
              name="guardianApproved"
              id="guardian"
              required
              className="mt-1 w-5 h-5 accent-[#00ff41] bg-black border border-[#00ff41] cursor-pointer flex-shrink-0"
            />
            <label htmlFor="guardian" className="text-xs uppercase tracking-widest leading-relaxed cursor-pointer opacity-90">
              [ACKNOWLEDGE] IF MINOR, GUARDIAN OVERRIDE AUTHORIZED. I SUBMIT TO THE CODEX LAWS AND SOULPAD ARCHITECTURE PROTOCOLS.
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending || !!usernameError}
            className="mt-8 bg-transparent border-2 border-[#00ff41] text-[#00ff41] px-8 py-4 text-xl uppercase tracking-[0.3em] hover:bg-[#00ff41] hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#00ff41]"
          >
            {isPending ? "UPLOADING_CONSCIOUSNESS..." : "EXECUTE_BOOT_SEQUENCE"}
          </button>
        </form>
      </div>
    </div>
  );
}

