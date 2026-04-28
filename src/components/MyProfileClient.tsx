"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { updateProfileSettings } from "@/actions/profile";
import { uploadProfileAvatar } from "@/actions/storage";

interface ProfileItem {
  id: string;
  pen_name: string | null;
  username: string | null;
  avatar_url: string | null;
  isVerified: boolean;
  _count: { followers: number };
}

interface Props {
  profile: {
    id: string;
    pen_name: string | null;
    full_name: string | null;
    username: string | null;
    bio: string | null;
    avatar_url: string | null;
    age: number | null;
    isVerified: boolean;
    followerCount: number;
    followingCount: number;
    storyCount: number;
  };
  followersList: ProfileItem[];
  followingList: ProfileItem[];
}

const USERNAME_REGEX = /^[a-z0-9_]*$/;

export default function MyProfileClient({ profile, followersList, followingList }: Props) {
  // ─── Followers/Following Modal ───
  const [modalTab, setModalTab] = useState<"followers" | "following" | null>(null);

  // ─── Edit Mode ───
  const [editing, setEditing] = useState(false);
  const [penName, setPenName] = useState(profile.pen_name || "");
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [username, setUsername] = useState(profile.username || "");
  const [age, setAge] = useState(profile.age?.toString() || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [usernameError, setUsernameError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "idle" | "success" | "error"; msg: string }>({ type: "idle", msg: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initial = (penName || fullName || "?")[0]?.toUpperCase() || "?";

  const handleUsernameChange = (val: string) => {
    const lower = val.toLowerCase();
    setUsername(lower);
    if (lower && !USERNAME_REGEX.test(lower)) {
      setUsernameError("Only letters, numbers, and underscores");
    } else if (lower.length > 14) {
      setUsernameError("Max 14 characters");
    } else {
      setUsernameError("");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadProfileAvatar(fd);
      if (result.error) {
        setSaveStatus({ type: "error", msg: result.error });
      } else if (result.url) {
        setAvatarUrl(result.url);
        setSaveStatus({ type: "success", msg: "Avatar uploaded! Save changes to apply." });
      }
    } catch {
      setSaveStatus({ type: "error", msg: "Avatar upload failed." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) return;
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 1) {
      setSaveStatus({ type: "error", msg: "Please enter a valid age." });
      return;
    }
    setSaveStatus({ type: "idle", msg: "" });
    startTransition(async () => {
      const res = await updateProfileSettings({
        pen_name: penName,
        full_name: fullName,
        age: parsedAge,
        username,
        bio: bio || undefined,
        avatar_url: avatarUrl || undefined,
      });
      if (res.error) {
        setSaveStatus({ type: "error", msg: res.error });
      } else {
        setSaveStatus({ type: "success", msg: "Profile updated successfully!" });
        setEditing(false);
      }
    });
  };

  const currentList = modalTab === "followers" ? followersList : followingList;

  return (
    <div className="flex flex-col gap-8">

      {/* ─── HEADER CARD ─── */}
      <section className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start pt-2">
          {/* Avatar */}
          <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => editing && fileInputRef.current?.click()}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Your avatar"
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${editing ? "group-hover:opacity-70 transition-opacity" : ""}`}
              />
            ) : (
              <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary flex items-center justify-center ${editing ? "group-hover:opacity-70 transition-opacity" : ""}`}>
                <span className="font-headline font-black text-4xl sm:text-5xl text-on-primary select-none">{initial}</span>
              </div>
            )}
            {editing && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-on-surface/80 text-white px-3 py-1 font-label font-bold text-xs uppercase tracking-wider rounded-full">
                  {isUploading ? "Uploading..." : "Change"}
                </span>
              </div>
            )}
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-on-surface text-primary rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-xs font-black">✓</span>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
            <div>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter uppercase leading-none">
                  {profile.pen_name || "Set Your Pen Name"}
                </h1>
                {profile.isVerified && (
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-primary border-2 border-on-surface rounded-full text-sm font-black flex-shrink-0 text-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">✓</span>
                )}
              </div>
              {profile.full_name && (
                <p className="font-label text-on-surface-variant font-bold uppercase tracking-wider text-xs sm:text-sm mt-1">
                  {profile.full_name}
                </p>
              )}
              {profile.username && (
                <p className="font-headline font-black text-primary text-base sm:text-lg tracking-tight mt-0.5">
                  @{profile.username}
                </p>
              )}
            </div>

            {profile.bio && (
              <p className="font-body text-base sm:text-lg text-on-surface/80 leading-relaxed max-w-xl italic">
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}

            <div className="flex gap-3 justify-center sm:justify-start mt-2 flex-wrap">
              <button
                onClick={() => setEditing((e) => !e)}
                className="inline-flex items-center gap-2 bg-on-surface text-white border-4 border-on-surface px-5 py-2.5 font-headline font-black text-sm uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                {editing ? "✕ Cancel Edit" : "✎ Edit Profile"}
              </button>
              {profile.pen_name && (
                <Link
                  href={`/author/${encodeURIComponent(profile.pen_name)}`}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary border-4 border-on-surface px-5 py-2.5 font-headline font-black text-sm uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  View Public Profile →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t-4 border-on-surface/10">
          <div className="flex flex-col items-center gap-1">
            <span className="font-headline text-2xl sm:text-3xl font-black text-on-surface">{profile.storyCount}</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Stories</span>
          </div>
          <button
            onClick={() => setModalTab(t => t === "followers" ? null : "followers")}
            className="flex flex-col items-center gap-1 hover:bg-primary/10 rounded transition-colors py-1 group"
          >
            <span className="font-headline text-2xl sm:text-3xl font-black text-on-surface group-hover:text-primary transition-colors">{profile.followerCount}</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">Followers</span>
          </button>
          <button
            onClick={() => setModalTab(t => t === "following" ? null : "following")}
            className="flex flex-col items-center gap-1 hover:bg-primary/10 rounded transition-colors py-1 group"
          >
            <span className="font-headline text-2xl sm:text-3xl font-black text-on-surface group-hover:text-primary transition-colors">{profile.followingCount}</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">Following</span>
          </button>
        </div>
      </section>

      {/* ─── FOLLOWERS / FOLLOWING PANEL ─── */}
      {modalTab && (
        <section className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b-4 border-on-surface">
            <button
              onClick={() => setModalTab("followers")}
              className={`flex-1 py-3 font-headline font-black text-sm uppercase tracking-tighter transition-colors ${
                modalTab === "followers"
                  ? "bg-primary text-on-primary border-r-2 border-on-surface"
                  : "bg-white text-on-surface-variant hover:bg-surface-container border-r-2 border-on-surface"
              }`}
            >
              Followers · {profile.followerCount}
            </button>
            <button
              onClick={() => setModalTab("following")}
              className={`flex-1 py-3 font-headline font-black text-sm uppercase tracking-tighter transition-colors ${
                modalTab === "following"
                  ? "bg-primary text-on-primary"
                  : "bg-white text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Following · {profile.followingCount}
            </button>
            <button
              onClick={() => setModalTab(null)}
              className="px-4 py-3 border-l-2 border-on-surface font-black text-on-surface hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="divide-y-2 divide-on-surface/10 max-h-96 overflow-y-auto">
            {currentList.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-headline font-black text-xl uppercase tracking-tighter text-on-surface-variant">
                  {modalTab === "followers" ? "No followers yet" : "Not following anyone"}
                </p>
                <p className="font-body text-sm text-on-surface-variant/60 mt-2 italic">
                  {modalTab === "followers"
                    ? "Share your profile to gain followers!"
                    : "Discover authors to follow in the feed."}
                </p>
              </div>
            )}
            {currentList.map((p) => (
              <Link
                key={p.id}
                href={`/author/${encodeURIComponent(p.pen_name || "")}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-colors group"
              >
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt={p.pen_name || ""} className="w-11 h-11 rounded-full border-2 border-on-surface object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary border-2 border-on-surface flex items-center justify-center flex-shrink-0">
                    <span className="font-headline font-black text-lg text-on-primary">{(p.pen_name || "?")[0].toUpperCase()}</span>
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline font-black text-sm uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors truncate">
                      {p.pen_name}
                    </span>
                    {p.isVerified && (
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-4 h-4 bg-primary border border-on-surface rounded-full text-[9px] font-black text-on-surface">✓</span>
                    )}
                  </div>
                  {p.username && (
                    <span className="font-label text-xs text-on-surface-variant font-bold">@{p.username}</span>
                  )}
                </div>
                <span className="flex-shrink-0 font-label text-[10px] font-black uppercase tracking-wider text-on-surface-variant border border-on-surface/20 px-2 py-0.5">
                  {p._count.followers} followers
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── EDIT FORM ─── */}
      {editing && (
        <section className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-primary border-2 border-on-surface flex-shrink-0" />
            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface">Edit Profile</h2>
          </div>

          {saveStatus.type !== "idle" && (
            <div className={`border-4 p-4 font-headline font-bold uppercase tracking-tight mb-5 ${
              saveStatus.type === "error" ? "border-black bg-red-500 text-white" : "border-black bg-primary text-on-surface"
            }`}>
              {saveStatus.msg}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {/* Avatar hint */}
            <p className="font-label text-xs text-on-surface-variant font-bold">
              💡 Click your avatar above to change it.
            </p>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">Username</label>
              <p className="text-xs font-label text-on-surface-variant font-bold">Max 14 chars · letters, numbers, underscores</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline font-black text-lg text-on-surface-variant select-none">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  maxLength={14}
                  className={`w-full border-4 pl-9 pr-14 py-4 font-body font-bold text-lg focus:outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface ${
                    usernameError ? "border-red-500 bg-red-50" : "border-on-surface focus:bg-primary-container"
                  }`}
                  placeholder="your_handle"
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-label font-black text-xs ${username.length > 12 ? "text-red-500" : "text-on-surface-variant"}`}>
                  {username.length}/14
                </span>
              </div>
              {usernameError && <p className="text-red-500 font-label font-bold text-xs">{usernameError}</p>}
            </div>

            {/* Pen Name */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">Pen Name</label>
              <input type="text" value={penName} onChange={(e) => setPenName(e.target.value)} required maxLength={30}
                className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface" />
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface" />
            </div>

            {/* Age */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required min={1} max={120}
                className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface" />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-sm">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={3}
                placeholder="Tell the world your story in 300 characters..."
                className="w-full border-4 border-on-surface px-5 py-4 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface resize-none" />
              <span className={`text-xs font-label font-bold self-end ${bio.length > 280 ? "text-red-500" : "text-on-surface-variant"}`}>
                {bio.length}/300
              </span>
            </div>

            <button type="submit" disabled={isPending || isUploading || !!usernameError}
              className="flex items-center justify-center gap-3 bg-primary text-on-primary border-4 border-on-surface px-10 py-5 font-headline font-black text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full disabled:opacity-50">
              {isPending ? (
                <>
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
