import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-surface flex flex-col items-center justify-center gap-4 text-on-surface">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="font-headline font-black text-xl uppercase tracking-widest animate-pulse">Loading...</p>
    </div>
  );
}
