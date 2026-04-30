"use client";

import { motion, Variants } from "framer-motion";

const features = [
    {
        icon: "🧠",
        title: "Dedicated AI Engine",
        desc: "Not a wrapper. A high-concurrency Gemini microservice for real-time prose polishing, title generation, and plagiarism checks."
    },
    {
        icon: "🛡️",
        title: "PiracyGuard™ IP Protection",
        desc: "Advanced anti-copy mechanisms, dynamic blur-on-blur screenshot deterrents, and a built-in legal story licensing system."
    },
    {
        icon: "📖",
        title: "The Codex Wiki",
        desc: "A private, integrated world-building tool. Keep your character sheets, lore, and magic systems organized right next to your manuscript."
    },
    {
        icon: "🎬",
        title: "Cinematic Aesthetic",
        desc: "Deep dark-mode exclusive palettes, Framer Motion transitions, and Lenis smooth scrolling. Built to feel like a premium movie experience."
    },
    {
        icon: "💰",
        title: "Author Monetization",
        desc: "Turn your passion into profit. Built-in application pipelines, bank verification, and analytics for dedicated creators."
    },
    {
        icon: "🏆",
        title: "Gamified Progression",
        desc: "Earn achievement badges, maintain daily reading streaks, and climb the ranks to become a Verified Chronicler."
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
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
                <div className="flex-grow h-1 bg-on-surface-variant/20"></div>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {features.map((feature, i) => (
                    <motion.div 
                        key={i} 
                        variants={itemVariants}
                        whileHover={{ 
                            y: -10, 
                            boxShadow: "12px 12px 0px 0px var(--color-primary)",
                            scale: 1.02
                        }}
                        className="group bg-surface-container border-4 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative overflow-hidden cursor-default"
                    >
                        <motion.div 
                            initial={{ rotate: 0 }}
                            whileHover={{ rotate: 12, scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute -right-6 -top-6 text-9xl opacity-5 group-hover:opacity-10 pointer-events-none select-none"
                        >
                            {feature.icon}
                        </motion.div>
                        <div className="text-4xl mb-6">{feature.icon}</div>
                        <h3 className="font-headline text-2xl font-black uppercase tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">
                            {feature.title}
                        </h3>
                        <p className="font-body text-on-surface-variant italic leading-relaxed">
                            {feature.desc}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
