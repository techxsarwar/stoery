"use client";

import { useState, useTransition } from "react";
import { updateProfileSettings } from "@/actions/profile";

interface SettingsFormProps {
  profile: {
    pen_name: string | null;
    full_name: string | null;
    age: number | null;
  };
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const [penName, setPenName] = useState(profile.pen_name || "");
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [age, setAge] = useState(profile.age?.toString() || "");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 1) {
       setStatus({ type: "error", message: "Please enter a valid age." });
       return;
    }

    startTransition(async () => {
      const res = await updateProfileSettings({
        pen_name: penName,
        full_name: fullName,
        age: parsedAge,
      });

      if (res.error) {
        setStatus({ type: "error", message: res.error });
      } else {
        setStatus({ type: "success", message: "Profile successfully updated!" });
      }
    });
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-6 w-full max-w-2xl bg-white p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-on-surface">
      
      {status.type !== "idle" && (
        <div className={`border-4 p-4 font-headline font-bold uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            status.type === "error" ? "border-black bg-red-500 text-white" : "border-black bg-[#1DB954] text-black"
        }`}>
          {status.type === "success" && "✓ "} {status.message}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Pen Name
        </label>
        <p className="text-xs font-label text-on-surface-variant font-bold">This is how you will be known to the universe.</p>
        <input
          type="text"
          value={penName}
          onChange={(e) => setPenName(e.target.value)}
          required
          maxLength={30}
          className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          True Name (Full Name)
        </label>
        <p className="text-xs font-label text-on-surface-variant font-bold">Kept strictly in the vault. For official records only.</p>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Chronological Age
        </label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          min={1}
          className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 flex items-center justify-center gap-3 bg-primary text-on-primary border-4 border-on-surface px-10 py-5 font-headline font-black text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full disabled:opacity-50"
      >
        {isPending ? (
          <>
            <span className="animate-spin inline-block w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full" />
            Engraving...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
