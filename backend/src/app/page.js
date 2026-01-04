"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
    Github, Download, ShieldAlert, Zap,
    Ghost, Fingerprint, Lock, Terminal, XCircle,
    Cpu, Database, Globe, Code2, Layers, Key,
    Shield, ChevronRight, Hash, AlertCircle, FileCode, Monitor, Server
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const files = [
    {
        os: "Windows",
        arch: "x64",
        filename: "4dc-1.0.0.Setup.exe",
        label: "Windows Installer",
        type: "exe",
        icon: Monitor,
        primary: true,
        url: "https://github.com/Stiwyy/4dc/releases/download/v1.0.0/4dc-1.0.0.Setup.exe",
    },
    {
        os: "Linux",
        arch: "Debian/Ubuntu",
        filename: "4dc_1.0.0_amd64.deb",
        label: ".deb Package",
        type: "deb",
        icon: Terminal,
        primary: false,
        url: "https://github.com/Stiwyy/4dc/releases/download/v1.0.0/4dc_1.0.0_amd64.deb",
    },
    {
        os: "Linux",
        arch: "RedHat/Fedora",
        filename: "4dc-1.0.0-1.x86_64.rpm",
        label: ".rpm Package",
        type: "rpm",
        icon: Server,
        primary: false,
        url: "https://github.com/Stiwyy/4dc/releases/download/v1.0.0/4dc-1.0.0-1.x86_64.rpm",
    },
    {
        os: "Linux",
        arch: "Tarball",
        filename: "4dc-linux-x64.tar.gz",
        label: "Portable .tar.gz",
        type: "zip",
        icon: FileCode,
        primary: false,
        url: "https://github.com/Stiwyy/4dc/releases/download/v1.0.0/4dc-linux-x64.tar.gz",
    },
];

const SpotlightCard = ({ children, className = "", contentClassName = "" }) => {
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
                "relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 transition-all duration-300 hover:border-emerald-500/30",
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
            <div className={cn("relative z-10 h-full w-full", contentClassName)}>{children}</div>
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

const FileRow = ({ file, delay }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyHash = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="group relative flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05]"
        >
            <div className="flex items-center gap-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-black",
                    file.primary ? "text-emerald-500" : "text-neutral-400"
                )}>
                    <file.icon className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-mono text-sm font-bold text-neutral-200">{file.label}</h3>
                    <p className="text-xs text-neutral-500">{file.filename}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleCopyHash}
                    className="hidden text-[10px] font-mono text-neutral-600 transition-colors hover:text-emerald-500 md:block"
                    title="Copy SHA-256 Checksum"
                >
                    {copied ? "COPIED" : "SHA-256"}
                </button>
                <div className="h-4 w-px bg-neutral-800" />
                <a
                    href={file.url}
                    download
                    className={cn(
                        "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-all",
                        file.primary
                            ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]"
                            : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    )}
                >
                    <Download className="h-3 w-3" />
                    GET
                </a>
            </div>
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
    const [bootSequence, setBootSequence] = useState(true);

    useEffect(() => {
        const hashes = Array.from({ length: 20 }).map(() =>
            `0x${Math.random().toString(16).substr(2, 32)}... [SECURE]`
        );
        setRandomHashes(hashes);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setBootSequence(false), 1500);
        return () => clearTimeout(timer);
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
                    <a href="#downloads" className="hover:text-emerald-400 transition-colors">Download</a>
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

            <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-12">
                <AnimatePresence mode="wait">
                    {bootSequence ? (
                        <motion.div
                            key="boot"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            className="flex flex-col items-center gap-4"
                        >
                            <Terminal className="h-12 w-12 animate-pulse text-emerald-500" />
                            <div className="font-mono text-sm text-emerald-500/70">
                                &gt; INITIALIZING SECURE HANDSHAKE...
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-10 text-center">
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
                                        <motion.a
                                            href="#downloads"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="group flex items-center gap-2 rounded-md bg-white px-8 py-3 font-bold text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:bg-neutral-200"
                                        >
                                            <Download className="h-5 w-5" />
                                            Download Client
                                        </motion.a>
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
                                        * For educational purposes only.
                                    </p>
                                </ScrollReveal>
                            </section>

                            <section id="mission" className="container mx-auto px-4 py-32">
                                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                                    <div>
                                        <ScrollReveal>
                                            <h2 className="text-3xl font-bold text-white md:text-5xl">
                                                Trust is earned. <br />
                                                <span className="text-emerald-500">Access is granted.</span>
                                            </h2>
                                            <p className="mt-6 text-lg text-neutral-400">
                                                In a world of open feeds and data mining, 4dc goes dark.
                                                No phone numbers. No contact lists.
                                            </p>
                                            <ul className="mt-8 space-y-4 text-neutral-300">
                                                <li className="flex items-center gap-3">
                                                    <Fingerprint className="h-5 w-5 text-emerald-500" />
                                                    <span>Only <strong className="text-white">Unique IDs</strong>. No usernames.</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <Ghost className="h-5 w-5 text-emerald-500" />
                                                    <span>Invite-only connectivity. Strangers cannot reach you.</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <Lock className="h-5 w-5 text-emerald-500" />
                                                    <span>Keys stay on your machine. We only move the noise.</span>
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

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
                                        <SpotlightCard
                                            className="h-full min-h-[220px] p-8"
                                            contentClassName="flex h-full flex-col items-center justify-center text-center gap-4"
                                        >
                                            <div className="h-12 w-12 flex items-center justify-center">
                                                <Zap className="h-8 w-8 text-yellow-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Real-time Sync</h3>
                                            <p className="text-sm text-neutral-400">
                                                Instant delivery powered by Cloud Firestore. No page refreshes. If you are online, you get the message immediately.
                                            </p>
                                        </SpotlightCard>

                                        <SpotlightCard
                                            className="h-full min-h-[220px] p-8"
                                            contentClassName="flex h-full flex-col items-center justify-center text-center gap-4"
                                        >
                                            <div className="h-12 w-12 flex items-center justify-center">
                                                <ShieldAlert className="h-8 w-8 text-emerald-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Strict Handshake</h3>
                                            <p className="text-sm text-neutral-400">
                                                Add a User ID → Send Request → They Accept. The circle stays tight.
                                            </p>
                                        </SpotlightCard>

                                        <SpotlightCard
                                            className="h-full min-h-[220px] p-8"
                                            contentClassName="flex h-full flex-col items-center justify-center text-center gap-4"
                                        >
                                            <div className="h-12 w-12 flex items-center justify-center">
                                                <Ghost className="h-8 w-8 text-purple-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Desktop Native</h3>
                                            <p className="text-sm text-neutral-400">
                                                Runs on your OS via Electron. System notifications, separate window, native performance.
                                            </p>
                                        </SpotlightCard>
                                    </div>
                                </div>
                            </section>

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

                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 items-stretch">
                                        {[
                                            { Icon: Globe, color: "text-white", title: "Next.js 16", desc: "API & Backend" },
                                            { Icon: Cpu, color: "text-emerald-400", title: "Electron", desc: "Desktop Wrapper" },
                                            { Icon: Code2, color: "text-blue-400", title: "React", desc: "UI Library" },
                                            { Icon: Database, color: "text-yellow-500", title: "Firebase", desc: "NoSQL & Auth" },
                                            { Icon: Layers, color: "text-cyan-400", title: "Tailwind", desc: "Styling" },
                                            { Icon: Key, color: "text-purple-500", title: "AES-GCM", desc: "Cryptography" },
                                        ].map(({ Icon, color, title, desc }) => (
                                            <SpotlightCard
                                                key={title}
                                                className="h-full min-h-[160px] p-6"
                                                contentClassName="flex h-full flex-col items-center justify-center text-center gap-3"
                                            >
                                                <div className="h-12 w-12 flex items-center justify-center">
                                                    <Icon className={`h-8 w-8 ${color}`} />
                                                </div>
                                                <h4 className="font-bold text-white">{title}</h4>
                                                <p className="text-xs text-neutral-500">{desc}</p>
                                            </SpotlightCard>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section id="downloads" className="container mx-auto px-4 py-32">
                                <div className="mb-12 text-center">
                                    <h2 className="bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
                                        Acquire the Signal.
                                    </h2>
                                    <p className="mx-auto mt-6 max-w-lg text-lg text-neutral-400">
                                        Select the appropriate package for your environment.
                                    </p>
                                </div>

                                <div className="grid gap-8 lg:grid-cols-3">
                                    <div className="lg:col-span-2">
                                        <SpotlightCard className="h-full border-neutral-800 bg-black/40 p-0">
                                            <div className="border-b border-white/5 bg-white/5 px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                                                    <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                                                    <div className="h-3 w-3 rounded-full bg-emerald-500/50"></div>
                                                    <span className="ml-2 font-mono text-xs text-neutral-500">root@4dc-repo:~/public/downloads</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 p-6">
                                                {files.map((file, idx) => (
                                                    <FileRow key={file.filename} file={file} delay={idx * 0.1} />
                                                ))}
                                            </div>
                                        </SpotlightCard>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <SpotlightCard className="border-neutral-800 bg-neutral-900/20 p-6">
                                            <div className="flex items-center gap-3">
                                                <Cpu className="h-5 w-5 text-neutral-400" />
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">System Req</h3>
                                                    <p className="text-xs text-neutral-500">64-bit Architecture</p>
                                                </div>
                                            </div>
                                        </SpotlightCard>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-center">
                                    <a
                                        href="https://github.com/Stiwyy/4dc"
                                        target="_blank"
                                        className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
                                    >
                                    <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-emerald-500">
                                        View Build Source
                                    </span>
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </section>

                            <section className="container mx-auto px-4 pb-24">
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
                                        Distributed under GPL-3.0 License.
                                    </div>
                                    <div className="flex gap-4">
                                        <a href="https://github.com/Stiwyy/4dc" className="text-neutral-500 hover:text-white transition-colors">
                                            <Github className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>
                            </footer>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}