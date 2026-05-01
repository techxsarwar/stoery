"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles, BrainCircuit, ShieldAlert, Library, Clapperboard, Coins, Trophy, SearchCheck } from "lucide-react";

const features = [
    {
        icon: <Sparkles size={48} />,
        title: "The Resonance Matrix",
        desc: "Our proprietary AI engine analyzes your story's atmosphere, pacing & hidden themes — then automatically surfaces it to readers who crave your exact vibe. Powered by NVIDIA Nemotron embeddings.",
        layoutClasses: "lg:col-span-2 lg:row-span-2 bg-on-surface text-surface group-hover:shadow-[12px_12px_0px_0px_var(--color-primary)]",
        titleColor: "text-primary",
        descColor: "text-surface/80"
    },
    {
        icon: <BrainCircuit size={32} />,
        title: "Multi-Model Neural Engine",
        desc: "A dynamic AI router picking the perfect frontier model: Venice Uncensored for raw storytelling, Hermes 405B for elite prose editing.",
        layoutClasses: "lg:col-span-1 lg:row-span-1 bg-surface-container text-on-surface group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
        titleColor: "text-on-surface",
        descColor: "text-on-surface-variant"
    },
    {
        icon: <ShieldAlert size={32} />,
        title: "PiracyGuard™ IP Protection",
        desc: "Advanced anti-copy mechanisms, dynamic blur-on-blur screenshot deterrents, and a built-in legal story licensing system.",
        layoutClasses: "lg:col-span-1 lg:row-span-1 bg-red-50 text-red-900 border-red-500 group-hover:shadow-[12px_12px_0px_0px_#ef4444]",
        titleColor: "text-red-700",
        descColor: "text-red-900/80"
    },
    {
        icon: <Library size={40} />,
        title: "The Codex Wiki",
        desc: "A private, integrated world-building tool. Keep your character sheets, lore, and magic systems organized right next to your manuscript.",
        layoutClasses: "lg:col-span-1 lg:row-span-2 bg-primary text-on-primary border-primary group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
        titleColor: "text-on-primary",
        descColor: "text-on-primary/90"
    },
    {
        icon: <Clapperboard size={40} />,
        title: "Cinematic Aesthetic",
        desc: "Deep dark-mode exclusive palettes, Framer Motion transitions, and Lenis smooth scrolling. Built to feel like a premium movie experience.",
        layoutClasses: "lg:col-span-2 lg:row-span-1 bg-surface-container text-on-surface group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
        titleColor: "text-on-surface",
        descColor: "text-on-surface-variant"
    },
    {
        icon: <Coins size={32} />,
        title: "Author Monetization",
        desc: "Turn passion into profit. Built-in application pipelines and analytics for dedicated creators.",
        layoutClasses: "lg:col-span-1 lg:row-span-1 bg-surface-container text-on-surface group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
        titleColor: "text-on-surface",
        descColor: "text-on-surface-variant"
    },
    {
        icon: <Trophy size={32} />,
        title: "Gamified Progression",
        desc: "Earn achievement badges and climb the ranks to become a Verified Chronicler.",
        layoutClasses: "lg:col-span-1 lg:row-span-1 bg-surface-container text-on-surface group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
        titleColor: "text-on-surface",
        descColor: "text-on-surface-variant"
    },
    {
        icon: <SearchCheck size={32} />,
        title: "Originality Checker",
        desc: "Run a full AI plagiarism analysis before publishing. Get an originality score (0–100) powered by Hermes 3 405B.",
        layoutClasses: "lg:col-span-1 lg:row-span-1 bg-amber-400 text-black border-black group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
        titleColor: "text-black",
        descColor: "text-black/80"
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 15 
        } 
    }
};

export default function AnimatedFeatures() {
    return (
        <section className="w-full">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-4 mb-12"
            >
                <h2 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight">Platform Features</h2>
                <div className="flex-grow h-1.5 bg-on-surface"></div>
                <div className="w-4 h-4 bg-primary rotate-45 border-2 border-on-surface hidden md:block"></div>
                <div className="w-4 h-4 bg-on-surface rotate-45 hidden md:block"></div>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]"
            >
                {features.map((feature, i) => (
                    <motion.div 
                        key={i} 
                        variants={itemVariants}
                        whileHover={{ 
                            y: -8, 
                            scale: 1.01
                        }}
                        className={`group border-4 border-on-surface p-8 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${feature.layoutClasses} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className={`p-4 border-4 border-current bg-white/5 backdrop-blur-sm ${feature.titleColor}`}>
                                {feature.icon}
                            </div>
                            <div className="font-headline font-black text-6xl opacity-10 pointer-events-none select-none absolute right-0 top-0 -translate-y-4 translate-x-4">
                                0{i + 1}
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className={`font-headline text-2xl lg:text-3xl font-black uppercase tracking-tight mb-3 ${feature.titleColor}`}>
                                {feature.title}
                            </h3>
                            <p className={`font-body italic font-bold leading-relaxed ${feature.descColor}`}>
                                {feature.desc}
                            </p>
                        </div>

                        {/* Hover Overlay Effect */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
