import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from './Landingpages/Footer.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import {
  Sparkles,
  Zap,
  Layers,
  GitBranch,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  ChevronRight,
  MoveRight,
  CheckCircle2,
  Share2,
  Cpu,
  Compass,
  FileText,
  RotateCcw
} from 'lucide-react';

const DECONSTRUCTION_EXAMPLES = [
  {
    id: 'transformers',
    topic: 'Transformer Architecture',
    tag: 'Artificial Intelligence',
    fluff: 'A massive 70-billion parameter neural network that speaks English and writes code using deep stacked attention layers.',
    firstPrinciples: [
      { step: '01. Matrix Multiplication & Dot Products', desc: 'Measuring mathematical alignment between query and key vectors in high-dimensional vector space.' },
      { step: '02. Softmax Probability Distribution', desc: 'Converting raw cosine similarities into dynamic attention weights that sum strictly to 1.0.' },
      { step: '03. Weighted Context Aggregation', desc: 'Multiplying value vectors by computed weights to synthesize context-aware token embeddings.' }
    ]
  },
  {
    id: 'quantum',
    topic: 'Quantum Superposition',
    tag: 'Quantum Physics',
    fluff: 'A mysterious state where a particle is magically in two different places at the exact same time until a human looks at it.',
    firstPrinciples: [
      { step: '01. Linear Vector Spaces (Hilbert Space)', desc: 'States are unit vectors in a complex vector space governed by linear algebraic transformations.' },
      { step: '02. Complex Linear Combinations', desc: 'A qubit state is written as |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1 represents measurement probability amplitudes.' },
      { step: '03. Unitary Evolution vs Projection', desc: 'Quantum gates are reversible unitary matrices; measurement projects the state vector onto basis eigenstates.' }
    ]
  },
  {
    id: 'raft',
    topic: 'Raft Consensus Algorithm',
    tag: 'Distributed Systems',
    fluff: 'A voting system among servers on the internet so they all have the same database records without crashing.',
    firstPrinciples: [
      { step: '01. Leader Election & Randomized Timers', desc: 'Heartbeat timeouts trigger candidate state; majority votes ensure at most one leader per term.' },
      { step: '02. Replicated Append-Only Log', desc: 'Leader broadcasts log entries; entries committed only after acknowledgment from a strict majority quorum.' },
      { step: '03. State Machine Safety Invariant', desc: 'If a server applies a log entry at index i, no other server will ever apply a different entry at index i.' }
    ]
  }
];

const PILLARS = [
  {
    num: '01',
    title: 'First-Principles Deconstruction',
    subtitle: 'Axiomatic Foundations',
    desc: 'We break down complex technical subjects into their irreducible atomic building blocks before synthesizing advanced derivations.',
    icon: Zap,
    accent: '#4D74FF',
  },
  {
    num: '02',
    title: 'Adaptive Cognitive Roadmaps',
    subtitle: 'Dynamic Topology Trees',
    desc: 'Structured, prerequisite-aware visual trees that trace your cognitive journey and unlock modules as your conceptual mastery solidifies.',
    icon: GitBranch,
    accent: '#3E64CB',
  },
  {
    num: '03',
    title: 'Zero-Hallucination Vector RAG',
    subtitle: 'Grounded Paper Citations',
    desc: 'Every theorem, formula, and conceptual explanation is anchored directly into verified university textbooks, PDFs, and peer-reviewed papers.',
    icon: ShieldCheck,
    accent: '#2563EB',
  },
  {
    num: '04',
    title: 'Socratic Active Recall',
    subtitle: 'Cognitive Mastery Protocol',
    desc: 'Transform passive reading into deep mental retention through curated high-yield conceptual challenges and first-principles quizzes.',
    icon: Sparkles,
    accent: '#60A5FA',
  },
];

const METRICS = [
  { value: '100%', label: 'First-Principles Grounded', sub: 'Zero superficial regurgitation' },
  { value: '10x', label: 'Faster Concept Retention', sub: 'Driven by axiomatic deconstruction' },
  { value: '0%', label: 'Hallucinated Citations', sub: 'Anchored directly in indexed sources' },
  { value: '50K+', label: 'Generated Learning Roadmaps', sub: 'Across 120+ technical disciplines' },
];

export const About = () => {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState(DECONSTRUCTION_EXAMPLES[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#ffffff] font-body selection:bg-[#4D74FF] selection:text-white overflow-x-hidden">
      {/* Top Main Navigation */}
      <Navbar />

      {/* =========================================================================
          HERO SECTION (Matching Reference Design with Electric Blue Signature Theme)
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-between px-4 sm:px-8 lg:px-14 pt-8 pb-16 overflow-hidden">
        {/* Subtle Atmospheric Blue Radial Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(77,116,255,0.08),rgba(0,0,0,0))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

        {/* Ambient Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        {/* TOP BRAND BADGE WITH POWER PLUG CONNECTOR (Matching reference) */}
        <div className={`relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-4">
            {/* Horizontal cable & plug connector coming from the left */}
            <div className="hidden sm:flex items-center">
              <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-zinc-500 to-zinc-300" />
              <div className="w-4 h-2.5 bg-zinc-400 rounded-sm border border-zinc-200/40 shadow-sm" />
              <div className="w-1.5 h-1 bg-zinc-200" />
            </div>

            {/* White Square Brand Badge with Electric Blue accent dot */}
            <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-md text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <div className="text-center font-heading font-black leading-tight tracking-tighter text-sm uppercase">
                <span>Avora</span>
              </div>
              {/* Electric Blue dot in corner */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4D74FF] shadow-[0_0_8px_#4D74FF]" />
            </div>

            {/* Header Text beside Badge */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                <span>Depth</span>
                <span className="text-zinc-500 font-normal">Never</span>
              </span>
              <span className="text-sm font-light text-zinc-400">
                Looked This Clear
              </span>
            </div>
          </div>

          {/* Subtitle tag */}
          <div className="max-w-xs text-sm text-zinc-400 leading-relaxed font-normal">
            Step into Avora. Where first-principles clarity becomes your greatest intellectual asset.
          </div>
        </div>

        {/* ================= CENTER HERO BOUNDING BOX (THE "LESS ISN'T EMPTY" MASTERPIECE) ================= */}
        <div className="relative z-10 my-auto py-12 sm:py-16 flex flex-col items-center justify-center">
          {/* Outer Selection Bounding Box with Electric Blue Corner Anchor Squares */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl border border-white/20 px-6 sm:px-14 py-12 sm:py-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs">
            
            {/* 4 Electric Blue Corner Anchor Square Handles (Matching Reference Image) */}
            <div className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-[#4D74FF] border-2 border-black shadow-[0_0_14px_#4D74FF]" />
            <div className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-[#4D74FF] border-2 border-black shadow-[0_0_14px_#4D74FF]" />
            <div className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-[#4D74FF] border-2 border-black shadow-[0_0_14px_#4D74FF]" />
            <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-[#4D74FF] border-2 border-black shadow-[0_0_14px_#4D74FF]" />

            {/* Ghosted Header: "Less Isn't" */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-body tracking-tight text-zinc-700/80 uppercase select-none transition-all duration-700">
              Less Isn't
            </h2>

            {/* Giant Main Word: "Empty" */}
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-black font-body tracking-tighter text-white uppercase leading-none select-none transition-all duration-700 drop-shadow-[0_10px_35px_rgba(255,255,255,0.15)]">
              Empty
            </h1>

            {/* Glowing Vertical Cable / Data Conduit Dropping from the Letter Base */}
            <div className="absolute -bottom-16 sm:-bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-3 h-3 bg-zinc-300 rounded-xs border border-zinc-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <div className="w-0.5 h-16 sm:h-24 bg-gradient-to-b from-zinc-300 via-[#4D74FF] to-transparent" />
            </div>
          </div>
        </div>

        {/* ================= LOWER BLUEPRINT CALLOUTS & CINEMATIC ROCK TERRAIN ================= */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-8 sm:pt-14">
          
          {/* Left Column: Philosophical Manifesto with Blueprint Hairlines */}
          <div className="lg:col-span-8 flex flex-col gap-6 text-sm sm:text-base text-zinc-400 leading-relaxed font-normal max-w-2xl">
            {/* Callout 1 with connecting technical guide lines */}
            <div className="relative pl-5 border-l border-zinc-800">
              <div className="absolute -left-1 top-0 w-2 h-2 bg-[#4D74FF] rounded-full shadow-[0_0_8px_#4D74FF]" />
              <p className="text-zinc-300 text-sm sm:text-base font-light">
                At Avora, we don't just generate answers, we dismantle noise. Because every concept you learn should be grounded in absolute first principles. Every axiom speaks.
              </p>
            </div>

            {/* Callout 2 & 3 with blueprint corner frame */}
            <div className="relative p-6 border border-white/10 rounded-2xl bg-zinc-950/60 backdrop-blur-md">
              <div className="text-xs font-semibold text-[#4D74FF] uppercase tracking-wider mb-2">
                [ Axiomatic Protocol ]
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                Every Fundamental Law Says More Than A Thousand Fragmented Layers
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Still memorizing formulas? Still drowning in disconnected AI hallucinations? Maybe it's time to discover the clarity of first-principles knowledge graphs.
              </p>
            </div>
          </div>

          {/* Right Column: Quick Launch Action */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end">
            <div className="flex flex-col gap-3.5 p-6 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-black border border-white/10 shadow-2xl w-full max-w-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#4D74FF]">
                  Cognitive Platform
                </span>
                <span className="w-2 h-2 rounded-full bg-[#4D74FF] shadow-[0_0_8px_#4D74FF] animate-pulse" />
              </div>
              <p className="text-sm text-zinc-300 font-normal leading-relaxed">
                Designed for researchers, engineers, and ambitious self-learners.
              </p>
              <button
                onClick={() => navigate('/workspace')}
                className="mt-2 get-started !w-full !block !py-3 text-center cursor-pointer text-sm font-semibold transition-all"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        </div>

        {/* Atmospheric Rocky Mountain Horizon SVG Graphic in Background */}
        <div className="pointer-events-none absolute bottom-0 right-0 w-[450px] sm:w-[650px] lg:w-[850px] h-[300px] sm:h-[400px] opacity-25 z-0 select-none">
          <svg viewBox="0 0 800 400" fill="none" className="w-full h-full">
            <path
              d="M350 400 L450 220 L510 270 L580 140 L640 230 L720 80 L800 400 Z"
              fill="url(#mountainGrad1)"
            />
            <path
              d="M200 400 L320 280 L400 320 L500 180 L620 310 L750 160 L800 400 Z"
              fill="url(#mountainGrad2)"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="mountainGrad1" x1="575" y1="80" x2="575" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#52525b" />
                <stop offset="0.6" stopColor="#18181b" />
                <stop offset="1" stopColor="#050505" />
              </linearGradient>
              <linearGradient id="mountainGrad2" x1="500" y1="160" x2="500" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3f3f46" />
                <stop offset="1" stopColor="#050505" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: LIVE FIRST-PRINCIPLES DECONSTRUCTION DEMO WIDGET
          ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-14 border-t border-white/10 bg-gradient-to-b from-[#050505] to-[#0a0c10]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal delay={0} duration={700}>
            <div className="flex flex-col items-center text-center mb-12">
              <span className="text-xs font-semibold text-[#4D74FF] uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#4D74FF]/30 bg-[#4D74FF]/10 mb-4">
                Live Interactive Demonstration
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-body tracking-tight text-white">
                How Avora Dismantles Superficial Noise
              </h2>
              <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
                Click a discipline below to see how our engine transforms superficial regurgitation into atomic, first-principles derivations.
              </p>
            </div>
          </ScrollReveal>

          {/* Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {DECONSTRUCTION_EXAMPLES.map((item) => {
              const active = item.id === selectedExample.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedExample(item)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 border ${
                    active
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] font-semibold'
                      : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#4D74FF]' : 'bg-zinc-600'}`} />
                  <span>{item.topic}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Split Comparison Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0E1013] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Ambient blue glow light */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#4D74FF]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Left Col: The Superficial AI Answer */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-zinc-950/80 border border-white/5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    [ Standard AI Chatbot Response ]
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-red-950/40 text-red-400 border border-red-900/30 font-medium">
                    High Fluff / Low Retention
                  </span>
                </div>
                <h4 className="text-base font-bold text-zinc-200 mb-2">
                  {selectedExample.topic}
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed italic bg-black/40 p-4 rounded-xl border border-white/5">
                  "{selectedExample.fluff}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-xs text-zinc-500 flex items-center gap-2">
                <span>Result:</span>
                <span className="text-zinc-400 font-medium">Surface understanding evaporates in 48 hours.</span>
              </div>
            </div>

            {/* Right Col: Avora First-Principles Breakdown */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#16191D] to-[#111316] border border-white/10 shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#4D74FF] uppercase tracking-wider">
                    [ Avora First-Principles Derivation ]
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-blue-950/50 text-[#60A5FA] border border-blue-800/40 font-semibold">
                    100% Axiomatic Clarity
                  </span>
                </div>

                <div className="space-y-3.5 mt-4">
                  {selectedExample.firstPrinciples.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-start gap-3.5 hover:border-white/25 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-[#4D74FF]/15 text-[#4D74FF] shrink-0 mt-0.5 shadow-[0_0_8px_rgba(77,116,255,0.3)]">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold text-white mb-1">
                          {step.step}
                        </h5>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs sm:text-sm text-zinc-400">
                  Ready to test your comprehension?
                </span>
                <button
                  onClick={() => navigate('/workspace')}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-[#4D74FF] hover:text-[#60A5FA] font-semibold cursor-pointer transition-colors"
                >
                  <span>Open Roadmap in Workspace</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE 4 ARCHITECTURAL PILLARS
          ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-8 lg:px-14 border-t border-white/10 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal delay={0} duration={700}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  Engineering The Future of Pedagogy
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-body tracking-tight text-white mt-2">
                  Built Upon Four Unshakeable Pillars
                </h2>
              </div>
              <p className="text-sm sm:text-base text-zinc-400 max-w-md font-normal leading-relaxed">
                Avora is not another chatbot wrapper. It is a pedagogical system engineered to foster deep conceptual intuition and rigorous analytical problem solving.
              </p>
            </div>
          </ScrollReveal>

          {/* Grid of 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={pillar.num} delay={idx * 100} duration={650}>
                  <div className="group relative p-8 sm:p-10 rounded-3xl bg-[#0E1013] border border-white/10 hover:border-white/25 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[260px] overflow-hidden">
                    {/* Corner Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-white group-hover:scale-105 transition-transform">
                        <Icon size={22} style={{ color: pillar.accent }} />
                      </div>
                      <span className="font-heading font-black text-2xl text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        {pillar.num}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">
                        {pillar.subtitle}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                        {pillar.desc}
                      </p>
                    </div>

                    {/* Subtle bottom hover line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: pillar.accent }}
                    />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: IMPACT METRICS & BENCHMARKS
          ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-14 border-t border-white/10 bg-gradient-to-b from-[#0a0c10] to-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {METRICS.map((metric, idx) => (
              <ScrollReveal key={idx} delay={idx * 80} duration={600}>
                <div className="p-7 rounded-3xl bg-[#0E1013]/60 border border-white/10 text-center flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black font-body text-white tracking-tight">
                    {metric.value}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-200 mt-2.5">
                    {metric.label}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    {metric.sub}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: OUR MANIFESTO & PHILOSOPHY
          ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-8 lg:px-14 border-t border-white/10 bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <ScrollReveal delay={0} duration={700}>
            <span className="text-xs font-semibold text-[#4D74FF] uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#4D74FF]/30 bg-[#4D74FF]/10 mb-6 inline-block">
              The Avora Manifesto
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-body tracking-tight text-white leading-tight">
              Knowledge Isn't Noise. <br />
              <span className="text-zinc-500 font-light">Understanding Is Depth.</span>
            </h2>

            <div className="mt-8 space-y-5 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed text-left sm:text-center max-w-3xl">
              <p>
                In the era of infinite AI-generated tokens, information has become cheap, abundant, and noisy. What is rare is genuine, first-principles comprehension.
              </p>
              <p>
                We founded Avora on a single conviction: true mastery does not come from consuming summaries or reciting answers. It comes from stripping a discipline down to its fundamental truths and building upwards step-by-step.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/workspace')}
                className="get-started cursor-pointer text-sm font-semibold !py-4 !px-8"
              >
                Enter Workspace
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-8 py-4 rounded-2xl border border-white/15 transition-all cursor-pointer active:scale-95"
              >
                Create Free Account
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default About;
