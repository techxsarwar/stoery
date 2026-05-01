import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/careers/admin/login");
    }

    const jobs = await prisma.jobPosting.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            applications: true
        }
    });

    const applications = await prisma.jobApplication.findMany({
        orderBy: { createdAt: "desc" },
        include: { job: true }
    });

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <header className="bg-white border-b-8 border-on-surface shadow-[0_8px_0_0_rgba(0,0,0,1)] p-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary border-2 border-on-surface flex items-center justify-center font-black">HR</div>
                        <h1 className="font-headline text-3xl font-black uppercase tracking-tight">SOULPAD Careers Admin</h1>
                    </div>
                    <div className="flex gap-4">
                        <span className="font-label text-xs font-black uppercase bg-primary-container px-3 py-1 border-2 border-on-surface">
                            {user.email}
                        </span>
                        <a href="/" className="font-label text-xs font-black uppercase px-3 py-1 border-2 border-on-surface hover:bg-on-surface hover:text-surface transition-colors cursor-pointer">
                            Exit
                        </a>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-12">
                <AdminDashboardClient jobs={jobs} applications={applications} />
            </main>
        </div>
    );
}
