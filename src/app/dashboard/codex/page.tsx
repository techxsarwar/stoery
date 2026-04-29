export const unstable_instant = { prefetch: "static" };
import { getCodexEntries } from "@/actions/codex";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Plus, PersonStanding, Map, Swords, ScrollText, Trash2 } from "lucide-react";
import { deleteCodexEntry } from "@/actions/codex";

export default async function CodexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) redirect("/auth/signin");

  const res = await getCodexEntries();
  const entries = res.success ? res.entries : [];

  const categories = [
    { name: "Character", icon: PersonStanding, color: "text-blue-500" },
    { name: "Location", icon: Map, color: "text-green-500" },
    { name: "Artifact", icon: Swords, color: "text-amber-500" },
    { name: "Lore", icon: ScrollText, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden cursor-default">
      <Sidebar />
      <main className="flex-grow ml-0 md:ml-20 lg:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,#e5e7eb,transparent)] custom-scrollbar">
        <Navbar user={user ?? null} />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32 flex flex-col gap-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                <div className="relative">
                    <span className="absolute -left-4 top-0 w-1 h-full bg-primary"></span>
                    <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">The Codex</h1>
                    <p className="font-label font-bold text-on-surface-variant text-sm uppercase tracking-[0.3em] mt-4 opacity-60">The Architect's Vault of Infinite Realms</p>
                </div>
                
                <Link 
                    href="/dashboard/codex/forge"
                    className="flex items-center gap-3 bg-on-surface text-surface px-8 py-4 rounded-xl font-headline font-black uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                >
                    <Plus className="group-hover:rotate-90 transition-transform" />
                    Forge Entry
                </Link>
            </header>

            {/* Empty State */}
            {entries?.length === 0 ? (
                <div className="mt-12 flex flex-col items-center justify-center py-32 border-4 border-dashed border-on-surface/10 rounded-3xl bg-surface/50 backdrop-blur-sm">
                    <div className="p-8 bg-on-surface/5 rounded-full mb-6">
                        <Plus className="w-16 h-16 text-on-surface opacity-10" />
                    </div>
                    <h3 className="font-headline font-black text-3xl text-on-surface uppercase tracking-tight mb-2">The Vault is Silent</h3>
                    <p className="font-body text-on-surface-variant max-w-sm text-center">Your world is yet to be populated. Forge your first Denizen, Region, or Relic to begin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {entries?.map((entry: any) => {
                        const categoryInfo = categories.find(c => c.name === entry.category) || categories[0];
                        const CategoryIcon = categoryInfo.icon;
                        
                        return (
                            <div 
                                key={entry.id}
                                className="group relative bg-white border-4 border-on-surface rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all flex flex-col h-full"
                            >
                                {entry.image_url ? (
                                    <div className="h-48 overflow-hidden border-b-4 border-on-surface relative">
                                        <img 
                                            src={entry.image_url} 
                                            alt={entry.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                                                <CategoryIcon className="w-3 h-3 text-white" />
                                                <span className="text-[10px] font-label font-bold text-white uppercase tracking-widest">{entry.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 bg-surface-container-high flex items-center justify-center border-b-4 border-on-surface relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[size:20px_20px]"></div>
                                        <CategoryIcon className="w-16 h-16 text-on-surface opacity-10" />
                                        <div className="absolute bottom-4 left-4">
                                             <div className="flex items-center gap-2 bg-on-surface/5 backdrop-blur-md px-3 py-1 rounded-full border border-on-surface/10">
                                                <CategoryIcon className="w-3 h-3 text-on-surface opacity-60" />
                                                <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest leading-none">{entry.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 flex flex-col flex-grow">
                                    <h4 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight mb-2 group-hover:text-primary transition-colors truncate">
                                        {entry.title}
                                    </h4>
                                    <p className="font-body text-sm text-on-surface-variant line-clamp-3 mb-6 italic opacity-80">
                                        "{entry.content}"
                                    </p>
                                    
                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="text-[8px] font-label font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">
                                            {new Date(entry.createdAt).toLocaleDateString()}
                                        </span>
                                        <form action={async () => {
                                            'use server'
                                            await deleteCodexEntry(entry.id)
                                        }}>
                                            <button 
                                                className="p-3 text-on-surface-variant hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                                                title="Obliterate Entry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

