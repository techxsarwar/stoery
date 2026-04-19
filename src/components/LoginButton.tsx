"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginButton() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-4 bg-[#1DB954] text-black border-4 border-black px-10 py-5 rounded-none font-headline font-black text-2xl uppercase tracking-tighter shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.306c-.215.354-.675.466-1.028.249-2.856-1.745-6.452-2.14-10.686-1.171-.405.094-.813-.157-.907-.562-.094-.405.157-.813.562-.907 4.637-1.06 8.624-.606 11.802 1.338.353.217.465.677.248 1.031l.009-.078zm1.464-3.262c-.271.442-.848.583-1.287.311-3.27-2.01-8.254-2.593-12.122-1.417-.496.15-.1.884-.311.666-.07-.442.069-.884.341-1.287.442-.271.884-.341 1.287-.069 4.412-1.334 9.897-.677 13.621 1.621l.009-.078c.442.272.583.848.311 1.288l-.009-.069zm.138-3.376c-3.924-2.33-10.383-2.545-14.137-1.405-.6.182-1.24-.165-1.423-.765-.182-.6.165-1.24.765-1.423 4.316-1.31 11.444-1.054 15.908 1.597.54.32.715 1.015.395 1.555s-1.015.715-1.555.395l-.009-.078z"/>
        </svg>
        Continue with Spotify
      </button>
    </div>
  );
}
