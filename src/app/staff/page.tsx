import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Shield, FileText, CheckCircle, XCircle, Search, UserCheck } from "lucide-react";

export default async function StaffDashboard() {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || (session.user.role !== "EMPLOYEE" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  const applications = await prisma.profile.findMany({
    where: { monetization_status: "APPLIED" },
    include: { 
        user: {
            select: {
                email: true,
                image: true
            }
        }
    },
    orderBy: { id: "desc" }
  });

  return (
    <div className="min-h-screen bg-surface flex cursor-default">
      <Sidebar />
      
      <main className="flex-grow ml-20 md:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,#eab30805,transparent)] custom-scrollbar">
        <Navbar user={session?.user || null} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32 flex flex-col gap-10">
          <header className="flex justify-between items-end">
            <div className="relative">
                <span className="absolute -left-4 top-0 w-1 h-full bg-primary/20"></span>
                <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface tracking-tighter uppercase leading-none">
                    The Observatory
                </h1>
                <p className="font-label font-bold text-on-surface-variant text-sm uppercase tracking-[0.3em] mt-4 opacity-60 flex items-center gap-2">
                    <Shield size={14} className="text-primary" />
                    Staff Portal // Command Center
                </p>
            </div>

            <div className="flex items-center gap-4 bg-surface-container-high border-2 border-on-surface/5 p-2 rounded-xl">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <Search size={18} className="text-primary" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search Chronicles..." 
                    className="bg-transparent border-none outline-none font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant w-48"
                />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Stats & Actions */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-high border-2 border-on-surface/5 p-8 rounded-3xl relative overflow-hidden">
                    <FileText size={80} className="absolute -right-4 -bottom-4 opacity-5 text-on-surface" />
                    <p className="font-label font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2">Pending Applications</p>
                    <div className="font-headline font-black text-6xl text-on-surface">{applications.length}</div>
                </div>
                <div className="bg-surface-container-high border-2 border-on-surface/5 p-8 rounded-3xl relative overflow-hidden">
                    <UserCheck size={80} className="absolute -right-4 -bottom-4 opacity-5 text-primary" />
                    <p className="font-label font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2">Total Creators</p>
                    <div className="font-headline font-black text-6xl text-on-surface tracking-tighter">1.2K</div>
                </div>
                <div className="bg-primary p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
                    <p className="font-headline font-black text-xl text-on-primary uppercase tracking-tight leading-none mb-2">System Pulse</p>
                    <p className="font-label font-bold text-[10px] text-on-primary/60 uppercase tracking-widest">All systems resonant</p>
                </div>
            </div>

            {/* Main Column: Review Queue */}
            <div className="lg:col-span-12 flex flex-col gap-6">
                <h2 className="font-label font-black text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mb-2 flex items-center gap-4">
                    <FileText size={14} className="text-primary" />
                    Review Queue: Monetization
                </h2>

                {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-surface/20 rounded-3xl border-2 border-on-surface/5 backdrop-blur-xl">
                        <p className="font-headline font-black text-2xl text-on-surface uppercase tracking-widest text-center opacity-40">The scrolls are silent.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {applications.map((app) => (
                            <div key={app.id} className="group bg-surface-container-high border-2 border-on-surface/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-primary/40 transition-all duration-500">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-on-surface/5 rounded-xl flex items-center justify-center text-primary font-headline font-black text-2xl border border-on-surface/5 overflow-hidden">
                                        {app.user.image ? (
                                            <img src={app.user.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            app.pen_name?.[0]
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight">{app.legal_name || app.pen_name}</h3>
                                        <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.2em] opacity-60">{app.user.email}</p>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-[9px] font-label font-black uppercase text-primary/60 tracking-widest border border-primary/20 px-2 py-0.5 rounded-full">PAN: {app.pan_number}</span>
                                            <span className="text-[9px] font-label font-black uppercase text-on-surface-variant/60 tracking-widest border border-on-surface/10 px-2 py-0.5 rounded-full">IFSC: {app.ifsc_code}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <button className="flex-grow md:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 px-6 py-3 rounded-xl font-headline font-black uppercase tracking-tighter hover:bg-emerald-500 hover:text-white transition-all">
                                        <CheckCircle size={18} />
                                        Approve
                                    </button>
                                    <button className="flex-grow md:flex-none flex items-center justify-center gap-2 bg-error/10 text-error border-2 border-error/20 px-6 py-3 rounded-xl font-headline font-black uppercase tracking-tighter hover:bg-error hover:text-white transition-all">
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
