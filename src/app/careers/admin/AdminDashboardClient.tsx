"use client";

import { useState, useTransition } from "react";
import { createJobPosting, toggleJobStatus, sendNotification, updateApplicationStatus } from "@/actions/careers";

export default function AdminDashboardClient({ jobs, applications }: { jobs: any[], applications: any[] }) {
    const [activeTab, setActiveTab] = useState("JOBS");
    const [isPending, startTransition] = useTransition();
    const [notifyMessage, setNotifyMessage] = useState("");

    const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            await createJobPosting(formData);
            (e.target as HTMLFormElement).reset();
        });
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            await toggleJobStatus(id, !currentStatus);
        });
    };

    const handleSendNotification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;

        startTransition(async () => {
            await sendNotification(email, subject, message);
            setNotifyMessage("Notification dispatched successfully.");
            (e.target as HTMLFormElement).reset();
            setTimeout(() => setNotifyMessage(""), 3000);
        });
    };

    const handleUpdateStatus = async (appId: string, email: string, status: "HIRED" | "REJECTED" | "REVIEWED") => {
        startTransition(async () => {
            await updateApplicationStatus(appId, email, status);
        });
    };

    return (
        <div className="flex flex-col gap-12">
            
            <div className="flex gap-4 border-b-4 border-on-surface pb-4 overflow-x-auto scrollbar-hide">
                {['JOBS', 'APPLICATIONS', 'NOTIFICATIONS'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`font-headline font-black text-xl md:text-2xl uppercase tracking-tighter px-6 py-3 border-4 transition-all ${activeTab === tab ? 'bg-primary text-on-surface border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-surface border-transparent text-on-surface-variant hover:border-on-surface/20'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'JOBS' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 flex flex-col gap-6 bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 h-max sticky top-32">
                        <h2 className="font-headline text-2xl font-black uppercase border-b-4 border-on-surface pb-4">Create New Listing</h2>
                        <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
                            <input name="title" required placeholder="Job Title" className="w-full border-2 border-on-surface p-3 font-headline font-bold uppercase focus:bg-primary-container focus:outline-none" />
                            <input name="department" required placeholder="Department" className="w-full border-2 border-on-surface p-3 font-headline font-bold uppercase focus:bg-primary-container focus:outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="type" required placeholder="Type (e.g. Full-Time)" className="w-full border-2 border-on-surface p-3 font-headline font-bold uppercase focus:bg-primary-container focus:outline-none" />
                                <input name="location" required placeholder="Location" className="w-full border-2 border-on-surface p-3 font-headline font-bold uppercase focus:bg-primary-container focus:outline-none" />
                            </div>
                            <textarea name="description" required placeholder="Job Description" rows={4} className="w-full border-2 border-on-surface p-3 font-body focus:bg-primary-container focus:outline-none custom-scrollbar"></textarea>
                            <input name="skills" required placeholder="Skills (comma separated)" className="w-full border-2 border-on-surface p-3 font-headline font-bold uppercase focus:bg-primary-container focus:outline-none" />
                            
                            <button type="submit" disabled={isPending} className="w-full bg-on-surface text-surface font-headline font-black uppercase text-xl py-4 mt-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all disabled:opacity-50 border-2 border-transparent hover:border-primary">
                                {isPending ? "Deploying..." : "Publish Job"}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h2 className="font-headline text-3xl font-black uppercase tracking-tight">Active Postings</h2>
                        {jobs.length === 0 ? (
                            <p className="text-on-surface-variant font-body italic">No active job postings in the database.</p>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {jobs.map(job => (
                                    <div key={job.id} className={`bg-white border-4 border-on-surface p-6 flex flex-col md:flex-row justify-between gap-6 transition-all ${job.isActive ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'opacity-60 bg-surface-variant/30 grayscale'}`}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full border-2 border-on-surface ${job.isActive ? 'bg-primary animate-pulse' : 'bg-error'}`}></span>
                                                <h3 className="font-headline text-2xl font-black uppercase tracking-tight">{job.title}</h3>
                                            </div>
                                            <p className="font-label text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{job.department} • {job.location}</p>
                                            <p className="font-body text-sm mt-2 max-w-lg line-clamp-2">{job.description}</p>
                                            <div className="mt-3 font-label text-xs font-bold uppercase tracking-widest text-primary">
                                                Applications: {job.applications?.length || 0}
                                            </div>
                                        </div>
                                        <div className="flex items-start md:items-center">
                                            <button 
                                                onClick={() => handleToggle(job.id, job.isActive)}
                                                disabled={isPending}
                                                className={`font-headline font-black uppercase tracking-widest text-xs px-6 py-3 border-4 border-on-surface transition-all ${job.isActive ? 'bg-error text-white hover:bg-white hover:text-error' : 'bg-primary text-on-primary hover:bg-white hover:text-primary'}`}
                                            >
                                                {job.isActive ? 'Close Listing' : 'Reactivate'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'APPLICATIONS' && (
                <div className="flex flex-col gap-6">
                    <h2 className="font-headline text-3xl font-black uppercase tracking-tight">Applicant Dossiers</h2>
                    {applications.length === 0 ? (
                        <div className="p-12 border-4 border-dashed border-on-surface/20 text-center font-headline text-xl uppercase tracking-widest opacity-50">
                            No applications submitted yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applications.map(app => (
                                <div key={app.id} className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-4">
                                    <div className="flex justify-between items-start border-b-4 border-on-surface/10 pb-4">
                                        <div>
                                            <h3 className="font-headline text-xl font-black uppercase">{app.applicantName}</h3>
                                            <p className="font-label text-xs uppercase tracking-widest text-primary font-bold">{app.job?.title || "Unknown Role"}</p>
                                        </div>
                                        <span className="bg-on-surface text-surface px-2 py-1 font-label text-[10px] font-black uppercase tracking-widest">{app.status}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 font-body text-sm">
                                        <p><strong>Email:</strong> {app.email}</p>
                                        {app.portfolioUrl && <p><strong>Portfolio:</strong> <a href={app.portfolioUrl} className="text-primary hover:underline" target="_blank">Link</a></p>}
                                        {app.resumeUrl && <p><strong>Resume:</strong> <a href={app.resumeUrl} className="text-primary hover:underline" target="_blank">Link</a></p>}
                                    </div>
                                    <div className="mt-auto pt-4 flex gap-2">
                                        <button 
                                            onClick={() => handleUpdateStatus(app.id, app.email, "HIRED")}
                                            disabled={isPending}
                                            className="flex-1 bg-primary border-2 border-on-surface font-headline font-black uppercase text-xs py-2 hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(app.id, app.email, "REJECTED")}
                                            disabled={isPending}
                                            className="flex-1 bg-error text-white border-2 border-on-surface font-headline font-black uppercase text-xs py-2 hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'NOTIFICATIONS' && (
                <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
                    <div className="bg-white border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                        <h2 className="font-headline text-3xl font-black uppercase border-b-4 border-on-surface pb-4 mb-6">Dispatch Notification</h2>
                        {notifyMessage && (
                            <div className="bg-primary/20 border-2 border-primary text-primary font-headline font-bold uppercase tracking-widest text-sm p-4 mb-6">
                                {notifyMessage}
                            </div>
                        )}
                        <form onSubmit={handleSendNotification} className="flex flex-col gap-4">
                            <input name="email" type="email" required placeholder="Recipient Email" className="w-full border-2 border-on-surface p-4 font-headline font-bold focus:bg-primary-container focus:outline-none" />
                            <input name="subject" required placeholder="Subject Line" className="w-full border-2 border-on-surface p-4 font-headline font-bold uppercase focus:bg-primary-container focus:outline-none" />
                            <textarea name="message" required placeholder="Notification Body" rows={6} className="w-full border-2 border-on-surface p-4 font-body focus:bg-primary-container focus:outline-none custom-scrollbar"></textarea>
                            
                            <button type="submit" disabled={isPending} className="w-full bg-on-surface text-surface font-headline font-black uppercase tracking-widest text-xl py-5 mt-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all disabled:opacity-50">
                                {isPending ? "Transmitting..." : "Send Dispatch"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
