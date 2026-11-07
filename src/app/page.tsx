"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGithub, 
  FaLinkedin, 
  FaPython, 
  FaDocker 
} from "react-icons/fa";
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiFastapi, 
  SiTailwindcss, 
  SiPostgresql,
  SiThreedotjs
} from "react-icons/si";
import { 
  Mail, 
  Terminal, 
  Cpu, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Activity, 
  Copy, 
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Briefcase
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- WEB AUDIO SFX SYNTHESIZER ---
function useUISounds(soundEnabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback((type: "hover" | "click" | "tab") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "tab") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.06);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Audio fallback handling
    }
  }, [soundEnabled]);

  return playSound;
}

// --- 3D INTERACTIVE GLOWING CORE MESH ---
function GlowingCoreMesh({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const layerIndices = [-0.55, 0, 0.55];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4 + (state.pointer.x * 0.02);
      groupRef.current.rotation.x += delta * 0.2 + (state.pointer.y * 0.02);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.08;
    }
  });

  const boxGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);

  return (
    <group ref={groupRef} scale={1.25}>
      {layerIndices.map((y, yi) =>
        layerIndices.map((x, xi) =>
          layerIndices.map((z, zi) => (
            <mesh key={`${xi}-${yi}-${zi}`} position={[x, y, z]} geometry={boxGeo}>
              <meshStandardMaterial
                color={wireframe ? "#06b6d4" : "#a855f7"}
                wireframe={wireframe}
                emissive={wireframe ? "#0284c7" : "#7e22ce"}
                emissiveIntensity={wireframe ? 0.7 : 0.9}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
          ))
        )
      )}
    </group>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "snippets">("overview");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manilaTime, setManilaTime] = useState("");

  const playSound = useUISounds(soundEnabled);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setManilaTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyEmailToClipboard = () => {
    playSound("click");
    navigator.clipboard.writeText("contact@allionvelarde.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTabChange = (tab: "overview" | "architecture" | "snippets") => {
    playSound("tab");
    setActiveTab(tab);
  };

  const stack = [
    { name: "Make.com", icon: Cpu, category: "Workflow Automation" },
    { name: "n8n Automations", icon: Terminal, category: "Low-Code/No-Code" },
    { name: "OpenAI & Anthropic", icon: Sparkles, category: "LLM & AI Models" },
    { name: "Python / FastAPI", icon: FaPython, category: "Backend & APIs" },
    { name: "TensorFlow / PyTorch", icon: Code2, category: "Machine Learning" },
    { name: "Next.js / React", icon: SiNextdotjs, category: "Frontend Web" },
    { name: "Docker & PostgreSQL", icon: FaDocker, category: "Infrastructure" },
  ];

  const doubleStack = [...stack, ...stack];

  const experiences = [
    {
      company: "Taste Central",
      role: "Backend Developer",
      type: "Freelance",
      period: "Nov 2025 — Feb 2026",
      location: "Metro Manila · Remote",
      description:
        "Maintained backend API integrations and automated email dispatch systems (Brevo) to manage vendor communication across 45+ vendor accounts. Built scalable data pipelines to track lead status and sync vendor data.",
      skills: ["Artificial Intelligence (AI)", "Software Development", "API Integration", "Brevo"],
    },
    {
      company: "HappyFresh",
      role: "Automation Specialist",
      type: "Contract",
      period: "Nov 2025 — Jan 2026",
      location: "Metro Manila · Remote",
      description:
        "Designed and tested automated order-processing workflows using custom Webhooks and Google Sheets integrations to streamline operational efficiency and data synchronization.",
      skills: ["Autotask", "Workflow Automation", "Webhooks", "Google Sheets Integration"],
    },
  ];

  const projects = [
    {
      title: "Lumora AI Engine",
      badge: "Production API",
      description:
        "High-performance local LLM execution framework with dynamic prompt orchestration, response caching, and structured JSON output parsers.",
      tech: ["Python", "FastAPI", "Ollama API", "Redis"],
      github: "https://github.com",
      live: "https://vercel.com",
      metrics: "Sub-120ms local routing overhead",
    },
    {
      title: "WebGL Shader Engine",
      badge: "Interactive Graphics",
      description:
        "Modular React Three Fiber viewport with custom shader materials, camera controls, memory-leak-safe disposal loops, and responsive canvas fallbacks.",
      tech: ["Next.js", "Three.js", "GLSL", "Tailwind"],
      github: "https://github.com",
      live: "https://allion-portfolio.vercel.app",
      metrics: "Sustained 60 FPS under geometry load",
    },
    {
      title: "Automated Data Worker",
      badge: "Backend Automation",
      description:
        "Asynchronous task worker for bulk document parsing, media compression, and webhook notifications built with resilience and automatic retry queues.",
      tech: ["Python", "Celery", "Docker", "PostgreSQL"],
      github: "https://github.com",
      live: "https://github.com",
      metrics: "Zero-data-loss queue execution",
    },
  ];

  const sampleSnippet = `// Production API Endpoint Route
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Automation Gateway v1")

class PipelinePayload(BaseModel):
    task_id: str
    target_stream: str
    retry_limit: int = 3

@app.post("/api/v1/dispatch")
async def dispatch_task(payload: PipelinePayload):
    try:
        status = await process_stream_event(payload.dict())
        return {"status": "dispatched", "payload": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`;

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* GLOWING AMBIENT BACKGROUND GRADIENTS */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* BACKGROUND GRID */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0" 
        style={{
          backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      {/* TOP SYSTEM STATUS BAR */}
      <div className="w-full bg-[#030407]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2 text-xs font-mono flex flex-wrap justify-between items-center z-50 relative">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold shadow-cyan-500/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
            SYSTEM_ONLINE
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">LOC: PH (GMT+8)</span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">PHT: {manilaTime || "00:00:00"}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound("click");
            }}
            onMouseEnter={() => playSound("hover")}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={13} className="text-cyan-400" /> : <VolumeX size={13} />}
            <span>SFX: {soundEnabled ? "ON" : "OFF"}</span>
          </button>
          <span className="text-slate-700">|</span>
          <button 
            onClick={copyEmailToClipboard}
            onMouseEnter={() => playSound("hover")}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedEmail ? "COPIED" : "contact@allionvelarde.com"}</span>
          </button>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
            <FaGithub size={14} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
            <FaLinkedin size={14} />
          </a>
        </div>
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#05070c]/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/50 border border-cyan-500/40 rounded-lg text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <Terminal size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none flex items-center gap-2">
                Allion Velarde
                <Sparkles size={14} className="text-cyan-400" />
              </h1>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Full Stack & Automation Developer
              </p>
            </div>
          </div>

          {/* TAB SYSTEM */}
          <div className="flex items-center gap-1 bg-[#090d16] p-1 border border-slate-800 rounded-lg font-mono text-xs">
            {(["overview", "architecture", "snippets"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                onMouseEnter={() => playSound("hover")}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                /{tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10 space-y-10">
        
        {/* HERO SECTION WITH WebGL */}
        <section className="grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* PROFILE CARD */}
          <div className="md:col-span-7 bg-[#090d16]/90 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl backdrop-blur-sm group">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
                <Activity size={13} className="text-cyan-400 animate-pulse" />
                <span>Available for Dev Contracts & Projects</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight leading-snug">
                Building high-performance APIs, WebGL frontends, & automation.
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                Focused on scalable web architecture. Engineering asynchronous pipelines, clean frontend interfaces, and WebGL elements using 
                <span className="text-slate-200 font-medium"> Next.js, React, Python, & Three.js</span>.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 mt-6">
              <a
                href="#projects-list"
                onClick={() => playSound("click")}
                onMouseEnter={() => playSound("hover")}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
              >
                Inspect Projects <ExternalLink size={14} />
              </a>
              <button
                onClick={copyEmailToClipboard}
                onMouseEnter={() => playSound("hover")}
                className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Mail size={14} />
                {copiedEmail ? "Email Copied!" : "Direct Contact"}
              </button>
            </div>
          </div>

          {/* 3D CANVAS VIEWPORT */}
          <div className="md:col-span-5 bg-[#090d16]/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative min-h-[300px] shadow-2xl backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Layers size={13} className="text-cyan-400" />
                WebGL Interactive Viewport
              </span>
              <button
                onClick={() => {
                  playSound("click");
                  setWireframeMode(!wireframeMode);
                }}
                onMouseEnter={() => playSound("hover")}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Render: {wireframeMode ? "Wireframe" : "Glow Solid"}
              </button>
            </div>

            {/* THREE.JS CANVAS */}
            <div className="w-full h-[210px] relative my-auto cursor-grab active:cursor-grabbing">
              <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#06b6d4" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#a855f7" />
                <GlowingCoreMesh wireframe={wireframeMode} />
              </Canvas>
            </div>

            <div className="text-[11px] font-mono text-slate-500 text-center pt-2 border-t border-slate-800 flex justify-between px-1">
              <span>R3F Interactive Model</span>
              <span className="text-cyan-400">FPS: ~60</span>
            </div>
          </div>
        </section>

        {/* DYNAMIC TAB SECTIONS */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.section
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* INFINITE SCROLLING TECH STACK */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Code2 size={14} /> Core Technical Stack
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Hover to pause</span>
                </div>

                {/* SCROLL CONTAINER WITH GRADIENT MASK */}
                <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#090d16]/80 p-3 group">
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#090d16] to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#090d16] to-transparent z-10 pointer-events-none" />

                  <motion.div
                    className="flex items-center gap-4 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 18,
                        ease: "linear",
                      },
                    }}
                    style={{ willChange: "transform" }}
                  >
                    {doubleStack.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => playSound("hover")}
                          className="bg-[#05070c] border border-slate-800/80 hover:border-cyan-500/50 px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0 cursor-pointer"
                        >
                          <div className="p-2 bg-slate-900 rounded text-cyan-400">
                            <Icon size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200 whitespace-nowrap">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{item.category}</div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>

              {/* WORK EXPERIENCE SECTION */}
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={14} /> Work Experience & Roles
                  </h3>
                  <span className="text-xs font-mono text-slate-500">2 Verified Roles</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {experiences.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => playSound("hover")}
                      className="bg-[#090d16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 inline-block mb-1">
                              {exp.type}
                            </span>
                            <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                              {exp.role}
                            </h4>
                            <div className="text-xs text-cyan-400 font-semibold">{exp.company}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/50 block">
                              {exp.period}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                              {exp.location}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {exp.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/60 rounded text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* PROJECTS */}
              <div id="projects-list">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Cpu size={14} /> Featured Technical Projects
                  </h3>
                  <span className="text-xs font-mono text-slate-500">3 Repositories</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {projects.map((proj, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => playSound("hover")}
                      className="bg-[#090d16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 inline-block">
                          {proj.badge}
                        </span>
                        <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400">
                          <span className="text-slate-500">Benchmark: </span>{proj.metrics}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {proj.tech.map((t, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/60 rounded text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                          <a 
                            href={proj.github} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={() => playSound("click")}
                            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                          >
                            <FaGithub size={12} /> Source
                          </a>
                          <a 
                            href={proj.live} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={() => playSound("click")}
                            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink size={12} /> Live Demo
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "architecture" && (
            <motion.section
              key="architecture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#090d16] border border-slate-800 rounded-xl p-6 space-y-6"
            >
              <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} /> Systems Engineering Approach
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
                <div className="space-y-2 bg-slate-900/60 p-4 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors">
                  <div className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                    <CheckCircle2 size={15} className="text-cyan-400" /> Decoupled Frontend & API Architecture
                  </div>
                  <p className="text-slate-400">
                    Designing Next.js frontends with isolated UI components, clean state management, and async API integration endpoints to maintain performance and low latency.
                  </p>
                </div>

                <div className="space-y-2 bg-slate-900/60 p-4 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors">
                  <div className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                    <CheckCircle2 size={15} className="text-cyan-400" /> Python Automation & Async Workers
                  </div>
                  <p className="text-slate-400">
                    Building backend scripts and server routines utilizing FastAPI and task queues. Focused on resilient, non-blocking asynchronous routines.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "snippets" && (
            <motion.section
              key="snippets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#030509] border border-slate-800 rounded-xl p-5 font-mono text-xs overflow-x-auto shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-800 text-slate-500">
                <span>// backend_gateway.py</span>
                <span>FastAPI / Python 3.11</span>
              </div>
              <pre className="text-cyan-300/90 leading-relaxed">
                <code>{sampleSnippet}</code>
              </pre>
            </motion.section>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} Allion Velarde. Built with Next.js, Tailwind, & R3F.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
            <button onClick={copyEmailToClipboard} className="hover:text-cyan-400 transition-colors cursor-pointer">Email</button>
          </div>
        </footer>

      </main>
    </div>
  );
}