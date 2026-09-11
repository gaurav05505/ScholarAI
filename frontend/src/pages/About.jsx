import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from './Landingpages/Footer.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import {
  ArrowUpRight,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Zap,
  GitBranch,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const ACCORDION_PILLARS = [
  {
    num: '01',
    title: 'FIRST-PRINCIPLES ENGINE',
    badge: 'Core Engine',
    badgeColor: 'bg-[#FF4D6D] text-white',
    shortDesc: 'Axiomatic deconstruction of complex domains into irreducible building blocks.',
    fullDesc: 'We break down complex technical disciplines, scientific papers, and dense syllabi into their foundational axioms. Instead of memorizing surface-level answers, learners construct deep intuition from the ground up.',
    specs: [
      { label: 'Deconstruction Speed', val: '< 1.8s Real-Time' },
      { label: 'Reasoning Mode', val: 'Multi-Step Formal Proofs' },
      { label: 'Noise Reduction', val: '94% Less Superficial Fluff' }
    ]
  },
  {
    num: '02',
    title: 'ADAPTIVE ROADMAP TOPOLOGY',
    badge: 'Dynamic Trees',
    badgeColor: 'bg-[#4D74FF] text-white',
    shortDesc: 'Graph-based prerequisite paths that adapt dynamically to your comprehension pace.',
    fullDesc: 'Dynamic DAG (Directed Acyclic Graph) knowledge trees that assess your background knowledge and generate prerequisite pathways. When you encounter challenging concepts, Avora automatically spawns sub-branches to fill knowledge gaps.',
    specs: [
      { label: 'Graph Topology', val: 'Prerequisite-Aware DAG' },
      { label: 'Branching Trigger', val: 'Automatic Diagnostic Quiz' },
      { label: 'Supported Fields', val: '120+ Technical Disciplines' }
    ]
  },
  {
    num: '03',
    title: 'ZERO-HALLUCINATION VECTOR RAG',
    badge: 'Verified Citations',
    badgeColor: 'bg-[#10B981] text-white',
    shortDesc: 'Grounded vector extraction anchored directly in verified textbooks, papers, and PDFs.',
    fullDesc: 'Every formula, theorem, and explanation is mathematically linked to indexed peer-reviewed literature, university syllabi, and official documentation with exact page and line citations.',
    specs: [
      { label: 'Search Model', val: 'Hybrid Dense + BM25 Vector' },
      { label: 'Citation Fidelity', val: '100% Grounded in Sources' },
      { label: 'Supported Ingestion', val: 'PDF, LaTeX, Markdown, DOCX' }
    ]
  },
  {
    num: '04',
    title: 'SOCRATIC ACTIVE RECALL',
    badge: 'Retention Protocol',
    badgeColor: 'bg-[#F59E0B] text-white',
    shortDesc: 'High-yield conceptual challenges designed to lock knowledge into permanent memory.',
    fullDesc: 'Transform passive reading into active mastery. Our AI orchestrates Socratic questioning sessions and spaced repetition loops that test conceptual boundaries rather than rote memorization.',
    specs: [
      { label: 'Recall Methodology', val: 'Socratic Dialogue & Quizzes' },
      { label: 'Retention Boost', val: '10x Concept Permanence' },
      { label: 'Adaptive Feedback', val: 'Instant Targeted Remediation' }
    ]
  }
];

export const About = () => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(0);
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

      <section className="relative z-10 mx-4 sm:mx-6 lg:mx-8 my-4 mt-2 sm:mt-4 min-h-[75vh] sm:min-h-[85vh] flex flex-col justify-between pt-6 sm:pt-10 pb-16 overflow-hidden">
        
        {/* Soft Multi-Color Ambient Glow Behind Headline (Breathing Floating Animation) */}
        <div className="pointer-events-none absolute top-12 sm:top-20 left-1/4 sm:left-1/3 w-[350px] sm:w-[550px] h-[260px] sm:h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.35),rgba(77,116,255,0.25),transparent_70%)] blur-3xl z-0 animate-glow-float" />
        <div className="pointer-events-none absolute top-28 right-1/4 w-[280px] h-[220px] bg-[radial-gradient(ellipse_at_center,rgba(77,116,255,0.22),transparent_70%)] blur-2xl z-0 animate-glow-float [animation-delay:3s]" />

        {/* Ambient Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)] z-0" />

        {/* Main Headline Container with Staggered Entrance */}
        <div className={`relative z-10 max-w-6xl transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[84px] font-black tracking-tight leading-[1.08] sm:leading-[1.06] text-white uppercase select-none font-body break-words">
            <span>WE ARE THE </span>
            {/* Highlighted text with organic animated hand-drawn SVG loop */}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">TEAM OF</span>
              {/* Hand-Drawn SVG Neon Oval Loop with Draw-in Keyframe Animation */}
              <svg
                className="absolute -top-2 sm:-top-3 -left-4 sm:-left-8 w-[calc(100%+2rem)] sm:w-[calc(100%+4rem)] h-[125%] pointer-events-none z-20 text-[#a3e635] overflow-visible"
                viewBox="0 0 300 80"
                fill="none"
              >
                <path
                  d="M10,42 C30,12 250,8 285,32 C315,52 230,76 110,74 C30,72 -5,55 25,35 C55,15 240,10 290,28"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-loop drop-shadow-[0_0_10px_rgba(163,230,53,0.9)]"
                />
              </svg>
            </span>
            <br />
            <span className="text-white">FIRST-PRINCIPLES & </span>
            <br />
            <span className="text-zinc-200">DEEP LEARNING ARCHITECTS</span>
          </h1>

          {/* Sub-text / Pill CTA */}
          <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-6">
            <button
              onClick={() => navigate('/workspace')}
              className="group px-6 py-2.5 rounded-full border border-white/20 hover:border-white text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/5 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
            >
              <span>Get In Touch</span>
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <span className="text-xs sm:text-sm text-zinc-400 font-light max-w-md">
              Where superficial noise is stripped away, and foundational clarity becomes your greatest intellectual superpower.
            </span>
          </div>
        </div>

        {/* Subtle decorative scroll prompt / bottom line */}
        <div className="relative z-10 pt-12 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4D74FF] animate-ping" />
            <span>[ 01 // ARCHITECTURAL SPECS ]</span>
          </span>
          <span className="hover:text-white transition-colors cursor-default">SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: GIANT NUMBERED EDITORIAL ACCORDION (01, 02, 03, 04)
          ========================================================================= */}
      <section className="relative py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#050505] w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col divide-y divide-white/15 border-t border-b border-white/15">
            {ACCORDION_PILLARS.map((item, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <ScrollReveal key={item.num} delay={idx * 80} duration={650}>
                  <div
                    onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
                    className={`group py-6 sm:py-10 cursor-pointer transition-all duration-500 px-3 sm:px-6 rounded-2xl w-full max-w-full overflow-hidden ${
                      isOpen
                        ? 'bg-white/[0.03] border border-white/15 shadow-[inset_0_0_30px_rgba(77,116,255,0.08)]'
                        : 'border border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                      
                      {/* Left Column: Giant Number (01, 02, 03, 04) */}
                      <div className="lg:col-span-3 xl:col-span-4 flex items-baseline">
                        <span
                          className={`font-heading font-black text-5xl sm:text-7xl lg:text-8xl xl:text-[105px] tracking-tighter leading-none select-none transition-all duration-500 ${
                            isOpen
                              ? 'text-[#4D74FF] translate-x-1 sm:translate-x-3 drop-shadow-[0_0_25px_rgba(77,116,255,0.4)]'
                              : 'text-white group-hover:text-[#4D74FF] group-hover:translate-x-1 sm:group-hover:translate-x-3'
                          }`}
                        >
                          {item.num}
                        </span>
                      </div>

                      {/* Right Column: Title, Expandable Description, Specs & Status */}
                      <div className="lg:col-span-9 xl:col-span-8 flex flex-col justify-between h-full pt-1 sm:pt-3 min-w-0">
                        <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
                          
                          {/* Title & Status Badge container with proper wrap and flex-1 */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <h3 className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-bold font-body tracking-tight uppercase transition-colors duration-300 break-words ${
                              isOpen ? 'text-white' : 'text-zinc-100 group-hover:text-white'
                            }`}>
                              {item.title}
                            </h3>
                            {/* Status badge with radar pulse */}
                            <span className={`shrink-0 relative text-[9px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor} shadow-sm inline-flex items-center gap-1.5 transition-transform duration-300 ${isOpen ? 'scale-105' : ''}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              <span>{item.badge}</span>
                            </span>
                          </div>

                          {/* Plus / Minus Circular Toggle with Smooth 180deg Rotation */}
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 group-hover:border-white flex items-center justify-center transition-all duration-500 shrink-0 ml-1 ${
                            isOpen ? 'bg-white text-black rotate-180 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-zinc-400 group-hover:text-white rotate-0'
                          }`}>
                            {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                          </div>
                        </div>

                        {/* Collapsed Subtitle Preview (smoothly collapses when open) */}
                        <div
                          className={`grid transition-all duration-300 ease-out ${
                            isOpen ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400 font-normal line-clamp-2 sm:line-clamp-1 group-hover:text-zinc-300 transition-colors">
                              {item.shortDesc}
                            </p>
                          </div>
                        </div>

                        {/* Expanded Full Subtitle & Technical Specs with 60fps Smooth CSS Grid Transition */}
                        <div
                          className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isOpen ? 'grid-rows-[1fr] opacity-100 mt-4 sm:mt-5' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="pt-3 sm:pt-4 space-y-4 sm:space-y-6 border-t border-white/10">
                              <p className={`text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed font-normal transition-all duration-500 ${
                                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                              }`}>
                                {item.fullDesc}
                              </p>

                              {/* Technical Specs Grid with Staggered Entrance */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2">
                                {item.specs.map((spec, sIdx) => (
                                  <div
                                    key={sIdx}
                                    style={{
                                      transitionDelay: isOpen ? `${sIdx * 80 + 100}ms` : '0ms'
                                    }}
                                    className={`p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#4D74FF]/50 hover:bg-white/[0.08] transition-all duration-500 transform ${
                                      isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
                                    } group/card shadow-sm hover:shadow-[0_0_20px_rgba(77,116,255,0.15)]`}
                                  >
                                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
                                      {spec.label}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-white group-hover/card:text-[#60A5FA] transition-colors">
                                      {spec.val}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className={`pt-1 sm:pt-2 flex items-center gap-3 transition-all duration-500 delay-300 ${
                                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                              }`}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/workspace');
                                  }}
                                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4D74FF] hover:text-[#60A5FA] transition-all hover:translate-x-1 cursor-pointer"
                                >
                                  <span>Experience in Workspace</span>
                                  <ChevronRight size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CINEMATIC WORKSPACE SHOWCASE & EDITORIAL STATEMENT (Matching Reference)
          ========================================================================= */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#050505] w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Wide Cinematic Workspace Preview Image Card with Parallax Scale */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0} duration={750}>
              <div
                onClick={() => navigate('/workspace')}
                className="relative rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl group cursor-pointer transition-all duration-500 hover:shadow-[0_0_35px_rgba(77,116,255,0.2)] hover:border-white/30"
              >
                <img
                  src="/landingBg.svg"
                  alt="Avora Multi-Agent Cognitive Platform"
                  className="w-full h-[320px] sm:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Floating Shine Bar on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Overlay Card Badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#4D74FF] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4D74FF] animate-ping" />
                      <span>Live Interactive Platform</span>
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">
                      Multi-Agent Pedagogical Workspace
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Statement & Philosophy */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <ScrollReveal delay={120} duration={750}>
              <div className="flex items-center gap-2 text-lime-400">
                <Sparkles size={20} className="animate-spin [animation-duration:8s]" />
                <span className="text-xs font-mono uppercase tracking-widest text-lime-400">
                  Philosophical Manifesto
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-body text-white tracking-tight uppercase leading-tight mt-3">
                Knowledge is not superficial noise. Understanding is depth.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                In an era overwhelmed with superficial AI summaries, genuine first-principles intuition has become rare. We built Avora so you can master any complex engineering, physics, or mathematical domain with axiomatic precision.
              </p>

              <div className="pt-6 border-t border-white/10 flex items-center gap-6">
                <div className="group/metric cursor-default">
                  <span className="font-heading font-black text-2xl text-white group-hover/metric:text-[#4D74FF] transition-colors">100%</span>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Grounded Axioms</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="group/metric cursor-default">
                  <span className="font-heading font-black text-2xl text-white group-hover/metric:text-[#4D74FF] transition-colors">10x</span>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Concept Permanence</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>


      <section className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#050505] w-full max-w-full overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Soft Ambient Radial Corner Glows */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[300px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(239,68,68,0.25),transparent_70%)] blur-3xl z-0 animate-glow-float" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[300px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(77,116,255,0.25),transparent_70%)] blur-3xl z-0 animate-glow-float [animation-delay:4s]" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <ScrollReveal delay={0} duration={800}>
            
            {/* Giant Clickable CTA with Neon Hand-Drawn Loop and Bouncy Angled Arrow */}
            <button
              onClick={() => navigate('/workspace')}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 text-2xl xs:text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-body tracking-tight text-white uppercase cursor-pointer hover:scale-105 transition-all duration-300 py-4 sm:py-6 px-4 sm:px-8 max-w-full"
            >
              <span className="break-words">ENTER WORKSPACE</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-3 group-hover:-translate-y-3 text-[#a3e635] shrink-0">
                ↗
              </span>

              {/* Hand-Drawn SVG Neon Oval Loop encircling the entire CTA (matching reference) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none text-[#a3e635] overflow-visible"
                viewBox="0 0 400 100"
                fill="none"
              >
                <path
                  d="M20,50 C40,15 360,10 385,45 C410,75 320,95 180,92 C40,90 -10,70 25,40 C60,10 350,15 385,48"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-loop drop-shadow-[0_0_14px_rgba(163,230,53,0.9)]"
                />
              </svg>
            </button>

            <p className="mt-8 text-xs sm:text-sm text-zinc-400 font-mono tracking-widest uppercase flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-ping" />
              <span>www.avora.ai // First-Principles Knowledge Engine</span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default About;
