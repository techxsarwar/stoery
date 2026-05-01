import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLoginPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If already logged in, redirect to the dashboard
    if (user) {
        redirect("/careers/admin");
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-12">
                <div className="mb-8">
                    <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-on-surface mb-2">
                        HR Portal
                    </h1>
                    <p className="font-body text-on-surface-variant font-bold text-sm uppercase tracking-widest">
                        Authorized Personnel Only
                    </p>
                </div>

                <form className="flex flex-col gap-6" action="/auth/signin">
                    <p className="font-body text-sm text-on-surface-variant italic mb-2 border-l-4 border-primary pl-3">
                        Authentication is routed through the main SOULPAD identity provider. Ensure you have EMPLOYEE or MANAGER privileges.
                    </p>
                    
                    <button type="submit" className="w-full bg-primary text-on-primary font-headline font-black uppercase tracking-widest text-lg py-4 border-4 border-on-surface hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                        Authenticate via Identity
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t-4 border-on-surface/10 text-center">
                    <a href="/" className="font-label text-xs font-black uppercase text-on-surface-variant hover:text-primary transition-colors tracking-widest">
                        ← Return to Main Site
                    </a>
                </div>
            </div>
        </div>
    );
}
