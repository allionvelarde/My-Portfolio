"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, ArrowUpRight, Sparkles, Code2, Cpu, ExternalLink } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Sound FX
const playSoundFX = (type: "hover" | "click") => {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
  if (!AudioContext) return;
  
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "click") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch (e) {
    // ignore
  }
};

// Sequential Layer Rotation Rubik's Cube
function GlowingRubiksCube() {
  const mainGroup = useRef<THREE.Group>(null);
  const slicesGroup = useRef<THREE.Group[]>([]);

  const layerIndices = [-1, 0, 1];
  const spacing = 0.58;

  const activeLayerRef = useRef(0);
  const progressRef = useRef(0);
  const anglesRef = useRef([0, 0, 0]);

  useFrame((_, delta) => {
    if (mainGroup.current) {
      mainGroup.current.rotation.y += delta * 0.25;
      mainGroup.current.rotation.x = 0.35 + Math.sin(Date.now() * 0.001) * 0.05;
    }

    progressRef.current += delta * 1.8;

    const activeIdx = activeLayerRef.current;
    if (progressRef.current <= Math.PI / 2) {
      anglesRef.current[activeIdx] += delta * 1.8;
    } else {
      anglesRef.current[activeIdx] = Math.round(anglesRef.current[activeIdx] / (Math.PI / 2)) * (Math.PI / 2);
      progressRef.current = 0;
      activeLayerRef.current = (activeLayerRef.current + 1) % 3;
    }

    slicesGroup.current.forEach((slice, idx) => {
      if (slice) {
        slice.rotation.y = anglesRef.current[idx];
      }
    });
  });

  const boxGeo = new THREE.BoxGeometry(0.52, 0.52, 0.52);
  const edgesGeo = new THREE.EdgesGeometry(boxGeo);

  return (
    <group ref={mainGroup} scale={0.85}>
      {layerIndices.map((yVal, layerIdx) => (
        <group 
          key={layerIdx} 
          position={[0, yVal * spacing, 0]}
          ref={(el) => {
            if (el) slicesGroup.current[layerIdx] = el;
          }}
        >
          {[-1, 0, 1].map((xVal) =>
            [-1, 0, 1].map((zVal) => (
              <group key={`${xVal}-${zVal}`} position={[xVal * spacing, 0, zVal * spacing]}>
                <mesh geometry={boxGeo}>
                  <meshBasicMaterial color="#0284c7" transparent opacity={0.06} />
                </mesh>
                <lineSegments geometry={edgesGeo}>
                  <lineBasicMaterial color="#38bdf8" linewidth={1.5} />
                </lineSegments>
              </group>
            ))
          )}
        </group>
      ))}
    </group>
  );
}

export default function Home() {
  const [time, setTime] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const projects = [
    {
      title: "Lumora AI Engine",
      category: "AI Architecture / Python",
      description: "Local AI interface framework integrated with Ollama for dynamic prompt routing.",
      tags: ["Python", "Ollama", "React"],
    },
    {
      title: "Digilux Design System",
      category: "Branding / UI Systems",
      description: "Full modern design system and component library built for agency scale.",
      tags: ["Figma", "Tailwind", "Next.js"],
    },
    {
      title: "Autonomous Workflow Agent",
      category: "Automation / Backend",
      description: "Python-driven automation pipeline for media asset processing and data parsing.",
      tags: ["FastAPI", "Docker", "Python"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080c] text-white bg-grid relative selection:bg-cyan-500/30 scroll-smooth overflow-x-hidden w-full">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        style={{ scaleX }} 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transform-origin-left z-[100]"
      />

      {/* FIXED STICKY HEADER */}
      <header className="sticky top-0 z-[90] w-full bg-[#08080c]/90 backdrop-blur-md border-b border-white/[0.06] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <motion.a 
            href="#hero"
            whileHover={{ scale: 1.05 }}
            className="font-extrabold text-xl sm:text-2xl tracking-tighter text-white flex items-center gap-1 cursor-pointer"
            onMouseEnter={() => playSoundFX("hover")}
          >
            AV<span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
          </motion.a>

          <nav className="hidden md:flex items-center gap-8 text-xs tracking-wide text-gray-400 font-medium">
            {[
              { label: "Home", href: "#hero" },
              { label: "Work", href: "#projects" },
              { label: "Experience", href: "#experience" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href}
                onMouseEnter={() => playSoundFX("hover")}
                onClick={() => playSoundFX("click")}
                className="hover:text-white transition-colors cursor-pointer relative group py-1"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="bg-[#111116]/90 border border-white/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono text-gray-300 flex items-center gap-1.5 sm:gap-2 shadow-inner">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="text-gray-400 font-semibold">GMT+8</span>
            <span>{time || "08:00 PM"}</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-4 sm:pt-8 pb-16 flex flex-col justify-between relative z-10 w-full overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-cyan-950/20 blur-[120px] pointer-events-none rounded-full" />

        {/* Hero Section */}
        <section id="hero" className="w-full min-h-[75vh] flex items-center justify-center py-6 sm:py-10 scroll-mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-gradient-to-b from-[#12121a]/95 via-[#0d0d14]/90 to-[#0a0a0f]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.95)] grid md:grid-cols-12 gap-6 sm:gap-8 items-center w-full overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

            <div className="md:col-span-7 space-y-4 sm:space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 text-cyan-300 text-[10px] sm:text-[11px] font-mono shadow-sm">
                <Sparkles size={12} className="text-cyan-400 animate-pulse shrink-0" /> 
                <span className="truncate">Available for projects & engineering roles</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                  Allion Velarde
                </h1>
                <p className="text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide leading-relaxed">
                  AI Automation Specialist · Backend Developer · Systems Architect
                </p>
              </div>

              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md font-normal">
                Driven developer specializing in architecting autonomous LLM agents, workflow automation pipelines, and Python-based media systems.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 sm:pt-2">
                <motion.a 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() => playSoundFX("hover")}
                  onClick={() => playSoundFX("click")}
                  href="#projects" 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all shadow-lg shadow-cyan-600/30 flex items-center gap-2"
                >
                  View Projects <ArrowUpRight size={14} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() => playSoundFX("hover")}
                  onClick={() => playSoundFX("click")}
                  href="#contact" 
                  className="bg-[#16161e] hover:bg-[#20202b] border border-white/10 text-white font-semibold text-xs px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all"
                >
                  Let&apos;s Talk
                </motion.a>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10 text-center sm:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">4<span className="text-cyan-400 text-xs sm:text-sm">↗</span></div>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Roles Led</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">100+<span className="text-cyan-400 text-xs sm:text-sm">↗</span></div>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Designs Delivered</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">10K+<span className="text-cyan-400 text-xs sm:text-sm">↗</span></div>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Community Reach</p>
                </div>
              </div>
            </div>

            {/* 3D Canvas Adjusted for Mobile */}
            <div className="md:col-span-5 relative flex justify-center items-center h-[240px] sm:h-[320px] md:h-[380px] w-full">
              <div className="w-full h-full relative flex items-center justify-center">
                <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] bg-cyan-500/15 blur-3xl rounded-full pointer-events-none animate-pulse" />
                <Canvas 
                  camera={{ position: [0, 0, 5.8], fov: 45 }}
                  style={{ width: "100%", height: "100%", background: "transparent" }}
                >
                  <ambientLight intensity={1.2} />
                  <GlowingRubiksCube />
                </Canvas>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="w-full py-12 sm:py-16 scroll-mt-20">
          <div className="flex justify-between items-end mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Selected Projects</h2>
              <p className="text-xs text-gray-400 mt-1">Featured systems, agents, and design work.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                onMouseEnter={() => playSoundFX("hover")}
                onClick={() => playSoundFX("click")}
                className="bg-[#0d0d12]/90 border border-white/10 hover:border-cyan-500/50 transition-all p-5 sm:p-6 rounded-2xl flex flex-col justify-between gap-4 sm:gap-6 group relative overflow-hidden shadow-lg backdrop-blur-md cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    {item.title}
                    <ExternalLink size={15} className="opacity-0 group-hover:opacity-100 transition-all text-cyan-400" />
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Timeline Section */}
        <section id="experience" className="w-full py-10 sm:py-16 scroll-mt-20">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Experience & Roles</h2>
            <p className="text-xs text-gray-400 mt-1">Leadership, projects, and systems architecture.</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              onMouseEnter={() => playSoundFX("hover")}
              className="bg-[#0d0d12]/90 border border-white/10 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 backdrop-blur-md hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">Founder & Chief Architect</h3>
                  <p className="text-[11px] sm:text-xs text-cyan-400">Digilux Startup</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-gray-500 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/5 w-fit">2024 — Present</span>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              onMouseEnter={() => playSoundFX("hover")}
              className="bg-[#0d0d12]/90 border border-white/10 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 backdrop-blur-md hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Code2 size={18} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">Lead Systems Developer</h3>
                  <p className="text-[11px] sm:text-xs text-cyan-400">Lumora AI Thesis Project</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-gray-500 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/5 w-fit">2025 — 2026</span>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-10 sm:py-16 scroll-mt-20">
          <div className="bg-gradient-to-r from-cyan-950/40 via-[#0d0d12] to-[#0d0d12] border border-cyan-500/30 p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            <div className="z-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Let&apos;s build something together.</h2>
              <p className="text-xs text-gray-400 mt-2">Open for collaborations, backend engineering, and AI pipelines.</p>
            </div>

            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => playSoundFX("hover")}
              onClick={() => playSoundFX("click")}
              href="mailto:contact@allionvelarde.com"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap shadow-xl shadow-cyan-600/30 z-10 w-full sm:w-auto justify-center"
            >
              <Mail size={16} /> Get In Touch
            </motion.a>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 z-10 pt-8 border-t border-white/5">
          <p>© {new Date().getFullYear()} Allion Velarde. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://github.com" target="_blank" rel="noreferrer" onMouseEnter={() => playSoundFX("hover")} className="hover:text-cyan-400 transition-colors"><FaGithub size={16} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" onMouseEnter={() => playSoundFX("hover")} className="hover:text-cyan-400 transition-colors"><FaLinkedin size={16} /></a>
            <a href="mailto:contact@allionvelarde.com" onMouseEnter={() => playSoundFX("hover")} className="hover:text-cyan-400 transition-colors"><Mail size={16} /></a>
          </div>
        </footer>

      </main>
    </div>
  );
}