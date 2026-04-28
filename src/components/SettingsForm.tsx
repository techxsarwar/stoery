"use client";

import { useState, useTransition, useRef } from "react";
import { updateProfileSettings } from "@/actions/profile";
import { uploadProfileAvatar } from "@/actions/storage";

interface SettingsFormProps {
  profile: {
    pen_name: string | null;
    full_name: string | null;
    age: number | null;
    bio: string | null;
    avatar_url: string | null;
  };
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const [penName, setPenName] = useState(profile.pen_name || "");
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [age, setAge] = useState(profile.age?.toString() || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProfileAvatar(formData);

      if (result.error) {
        setStatus({ type: "error", message: result.error });
      } else if (result.url) {
        setAvatarUrl(result.url);
        setStatus({ type: "success", message: "Avatar uploaded! Save changes to apply." });
      }
    } catch {
      setStatus({ type: "error", message: "Avatar upload failed." });
    } finally {
      setIsUploading(false);
    }
  };

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
        bio: bio || undefined,
        avatar_url: avatarUrl || undefined,
      });

      if (res.error) {
        setStatus({ type: "error", message: res.error });
      } else {
        setStatus({ type: "success", message: "Profile successfully updated!" });
      }
    });
  };

  const initial = (penName || fullName || "?")[0]?.toUpperCase() || "?";

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-5 sm:gap-6 w-full max-w-2xl bg-white p-5 sm:p-8 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-on-surface">
      
      {status.type !== "idle" && (
        <div className={`border-4 p-4 font-headline font-bold uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            status.type === "error" ? "border-black bg-red-500 text-white" : "border-black bg-[#1DB954] text-black"
        }`}>
          {status.type === "success" && "✓ "} {status.message}
        </div>
      )}

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <p className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm self-start">
          Profile Avatar
        </p>
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Your avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:opacity-70 transition-opacity"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary flex items-center justify-center group-hover:opacity-70 transition-opacity">
              <span className="font-headline font-black text-4xl text-on-primary select-none">
                {initial}
              </span>
            </div>
          )}
          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-on-surface/80 text-white px-3 py-1 font-label font-bold text-xs uppercase tracking-wider rounded-full">
              {isUploading ? "Uploading..." : "Change"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <p className="text-xs font-label text-on-surface-variant font-bold">Click to upload. Max 5 MB.</p>
      </div>

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

      {/* Bio */}
      <div className="flex flex-col gap-2">
        <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">
          Bio
        </label>
        <p className="text-xs font-label text-on-surface-variant font-bold">A short tagline about yourself. Visible on your public profile.</p>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Tell the world your story in 300 characters..."
          className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface resize-none"
        />
        <span className={`text-xs font-label font-bold self-end ${bio.length > 280 ? "text-red-500" : "text-on-surface-variant"}`}>
          {bio.length}/300
        </span>
      </div>

      <button
        type="submit"
        disabled={isPending || isUploading}
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
