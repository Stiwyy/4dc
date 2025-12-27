"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Github, Download, ShieldAlert, Zap,
    Ghost, Fingerprint, Lock, Terminal, XCircle,
    Cpu, Database, Globe, Code2, Layers, Key
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SpotlightCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn(
                "relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 px-8 py-10 transition-all duration-300 hover:border-emerald-500/30",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`,
                }}
            />
            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
};

const ScrollReveal = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default function Home() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [randomHashes, setRandomHashes] = useState([]);

    useEffect(() => {
        const hashes = Array.from({ length: 20 }).map(() =>
            `0x${Math.random().toString(16).substr(2, 32)}... [SECURE]`
        );
        setRandomHashes(hashes);
    }, []);

    return (
        <main className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-emerald-500/30 selection:text-emerald-200">

            <motion.div
                className="fixed left-0 right-0 top-0 z-[100] h-1 bg-emerald-600 origin-left"
                style={{ scaleX }}
            />

            <div className="fixed inset-0 -z-10 h-full w-full bg-[#050505] bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_800px_at_50%_-100px,#10b98115,transparent)]"></div>

            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 px-6 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white">
                    <Terminal className="h-5 w-5 text-emerald-500" />
                    4dc
                </div>
                <div className="flex gap-6 text-sm font-medium text-neutral-500">
                    <a href="#mission" className="hover:text-emerald-400 transition-colors">Mission</a>
                    <a href="#features" className="hover:text-emerald-400 transition-colors">Intel</a>
                    <a
                        href="https://github.com/Stiwyy/4dc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                    >
                        Source
                    </a>
                </div>
            </nav>

            <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
                <ScrollReveal>
                    <div className="mb-8 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="mr-2 flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500">
              <span className="h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
            </span>
                        System Online. Encrypted.
                    </div>

                    <h1 className="bg-gradient-to-b from-white via-neutral-200 to-neutral-600 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent md:text-9xl">
                        Strictly <br /> Business.
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-400 md:text-xl">
                        <span className="font-bold text-white">4 Dealers Chat (4dc)</span> is a desktop messenger built for discretion.
                        Request-based access. Local encryption. Zero traces.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-2 rounded-md bg-white px-8 py-3 font-bold text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:bg-neutral-200"
                        >
                            <Download className="h-5 w-5" />
                            Download Client
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-md border border-neutral-700 bg-transparent px-8 py-3 font-bold text-white transition-all hover:border-white/50 hover:bg-white/5"
                            onClick={() => window.open("https://github.com/Stiwyy/4dc", "_blank")}
                        >
                            <Github className="h-5 w-5" />
                            Check the Repo
                        </motion.button>
                    </div>

                    <p className="mt-8 text-xs font-mono text-neutral-600 uppercase tracking-widest">
                        * For educational purposes only. Obviously.
                    </p>
                </ScrollReveal>
            </section>

            <section id="mission" className="container mx-auto px-4 py-32">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <ScrollReveal>
                            <h2 className="text-3xl font-bold text-white md:text-5xl">
                                Trust is earned. <br/>
                                <span className="text-emerald-500">Access is granted.</span>
                            </h2>
                            <p className="mt-6 text-lg text-neutral-400">
                                In a world of open feeds and data mining, 4dc goes dark.
                                We don't care about your phone number. We don't want your contacts list.
                            </p>
                            <ul className="mt-8 space-y-4 text-neutral-300">
                                <li className="flex items-center gap-3">
                                    <Fingerprint className="h-5 w-5 text-emerald-500" />
                                    <span>Only <strong className="text-white">Unique IDs</strong>. No usernames required.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Ghost className="h-5 w-5 text-emerald-500" />
                                    <span>Invite-only connectivity. Strangers can't message you.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Lock className="h-5 w-5 text-emerald-500" />
                                    <span>Keys stay on your machine. We just move the noise.</span>
                                </li>
                            </ul>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal delay={0.2}>
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8">
                            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />

                            <div className="font-mono text-xs text-emerald-500/50 opacity-50">
                                {randomHashes.map((hash, i) => (
                                    <div key={i} className="truncate">
                                        {hash}
                                    </div>
                                ))}
                            </div>

                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="mb-2 flex items-center gap-2 text-sm text-white">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                    Connection Established
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section id="features" className="border-t border-neutral-900 bg-[#080808] py-32">
                <div className="container mx-auto px-4">
                    <ScrollReveal>
                        <div className="mb-16 max-w-2xl">
                            <h2 className="text-3xl font-bold text-white md:text-4xl">The Toolkit.</h2>
                            <p className="mt-4 text-neutral-400">
                                Built with React, Electron, and Next.js. A modern stack for a classic purpose: private communication.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <SpotlightCard>
                            <Zap className="mb-4 h-8 w-8 text-yellow-500" />
                            <h3 className="mb-2 text-xl font-bold text-white">Real-time Sync</h3>
                            <p className="text-sm text-neutral-400">
                                Instant delivery powered by Cloud Firestore. No page refreshes.
                                If you are online, you get the message. Immediately.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard>
                            <ShieldAlert className="mb-4 h-8 w-8 text-emerald-500" />
                            <h3 className="mb-2 text-xl font-bold text-white">Strict Handshake</h3>
                            <p className="text-sm text-neutral-400">
                                You can't just talk to anyone. Add a User ID &rarr; Send Request &rarr; They Accept.
                                The circle stays tight.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard>
                            <Ghost className="mb-4 h-8 w-8 text-purple-500" />
                            <h3 className="mb-2 text-xl font-bold text-white">Desktop Native</h3>
                            <p className="text-sm text-neutral-400">
                                Runs on your OS via Electron. System notifications, separate window,
                                native performance. No browser tabs needed.
                            </p>
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* FIXED: SYSTEM ARCHITECTURE SECTION */}
            <section className="bg-[#050505] py-24">
                <div className="container mx-auto px-4">
                    <ScrollReveal>
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold text-white md:text-4xl">System Architecture</h2>
                            <p className="mt-4 text-neutral-400">
                                High-performance stack customized for speed and anonymity.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

                        <SpotlightCard>
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <Globe className="mb-3 h-8 w-8 text-white" />
                                <h4 className="font-bold text-white">Next.js 16</h4>
                                <p className="mt-1 text-xs text-neutral-500">API & Backend</p>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <Cpu className="mb-3 h-8 w-8 text-emerald-400" />
                                <h4 className="font-bold text-white">Electron</h4>
                                <p className="mt-1 text-xs text-neutral-500">Desktop Wrapper</p>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <Code2 className="mb-3 h-8 w-8 text-blue-400" />
                                <h4 className="font-bold text-white">React</h4>
                                <p className="mt-1 text-xs text-neutral-500">UI Library</p>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <Database className="mb-3 h-8 w-8 text-yellow-500" />
                                <h4 className="font-bold text-white">Firebase</h4>
                                <p className="mt-1 text-xs text-neutral-500">NoSQL & Auth</p>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <Layers className="mb-3 h-8 w-8 text-cyan-400" />
                                <h4 className="font-bold text-white">Tailwind</h4>
                                <p className="mt-1 text-xs text-neutral-500">Styling</p>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <Key className="mb-3 h-8 w-8 text-purple-500" />
                                <h4 className="font-bold text-white">AES-GCM</h4>
                                <p className="mt-1 text-xs text-neutral-500">Cryptography</p>
                            </div>
                        </SpotlightCard>

                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-24">
                <ScrollReveal>
                    <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center md:p-12">
                        <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                        <h3 className="text-2xl font-bold text-white">Critical System Warning</h3>
                        <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
                            <strong className="text-red-400">This is a joke project.</strong> <br/>
                            While the encryption is real and the code works, <strong>4dc</strong> is a school project.
                            Please do not use this for actual illegal activities or sensitive government secrets.
                            If you do, that's on you.
                        </p>
                    </div>
                </ScrollReveal>
            </section>

            <footer className="border-t border-neutral-900 bg-[#020202] py-12">
                <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row">
                    <div className="flex items-center gap-2 font-bold text-white">
                        <Terminal className="h-5 w-5 text-emerald-600" />
                        4dc
                    </div>
                    <div className="text-sm text-neutral-600">
                        Distributed under MIT License.
                    </div>
                    <div className="flex gap-4">
                        <a href="https://github.com/Stiwyy/4dc" className="text-neutral-500 hover:text-white transition-colors">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    );
}