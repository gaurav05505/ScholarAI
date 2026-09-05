import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'

// Custom Illustrated Visuals for Hover States
const RoadmapVisual = () => (
  <div className="absolute inset-0 w-full h-full bg-[#3ec060] overflow-hidden select-none flex items-center justify-center">
    {/* Grid Pattern */}
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    />

    {/* Green Notebook on Left */}
    <div className="absolute -left-10 top-2 sm:top-4 w-44 h-56 sm:w-52 sm:h-64 bg-[#239945] rounded-r-2xl shadow-xl transform -rotate-12 border-2 border-white/20 flex flex-col p-4">
      <div className="w-full h-8 border-b border-white/30 rounded-t-lg" />
      <div className="w-16 h-2 bg-white/20 rounded mt-4" />
      <div className="w-24 h-2 bg-white/20 rounded mt-2" />
    </div>

    {/* Notepad / Paper on Right */}
    <div className="absolute -right-8 top-1 sm:top-2 w-44 h-48 sm:w-56 sm:h-56 bg-white rounded-xl shadow-2xl transform rotate-25 border-4 border-[#2ca74e] p-3 flex flex-col gap-2">
      <div className="w-full h-3 bg-[#e4f7ea] rounded" />
      <div className="w-full h-2 bg-zinc-200 rounded" />
      <div className="w-3/4 h-2 bg-zinc-200 rounded" />
      <div className="w-5/6 h-2 bg-zinc-200 rounded" />
      <div className="w-2/3 h-2 bg-zinc-200 rounded" />
    </div>

    {/* Pencil at bottom */}
    <div className="absolute right-12 bottom-3 sm:bottom-4 w-36 sm:w-44 h-7 bg-[#f59e0b] rounded-sm transform -rotate-6 shadow-lg border border-amber-600 flex items-center justify-between px-2">
      <div className="w-6 h-full bg-[#fde68a] border-r border-amber-600" />
      <div className="w-4 h-full bg-[#fbbf24]" />
      {/* Pencil Tip */}
      <div className="absolute -left-4 top-0 w-0 h-0 border-y-[14px] border-y-transparent border-r-[16px] border-r-[#fde68a] flex items-center">
        <div className="absolute -right-[16px] -top-[4px] w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-zinc-900" />
      </div>
      {/* Pencil Eraser */}
      <div className="absolute -right-3 top-0 w-3 h-full bg-[#f472b6] rounded-r-sm border-l border-zinc-400" />
    </div>

    {/* Sparkle Stars */}
    <svg className="absolute left-28 top-5 w-6 h-6 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
    <svg className="absolute left-36 bottom-5 w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
    <svg className="absolute right-40 top-6 w-5 h-5 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </div>
)

const ResearchVisual = () => (
  <div className="absolute inset-0 w-full h-full bg-[#5b52e0] overflow-hidden select-none flex items-center justify-center">
    {/* Grid Pattern */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    />

    {/* Research Paper Card 1 */}
    <div className="absolute -left-6 top-3 w-48 h-56 bg-white rounded-xl shadow-2xl transform -rotate-8 border-2 border-indigo-200 p-4 flex flex-col gap-2">
      <div className="w-12 h-3 bg-indigo-500 rounded" />
      <div className="w-full h-2 bg-zinc-200 rounded mt-2" />
      <div className="w-4/5 h-2 bg-zinc-200 rounded" />
      <div className="w-full h-2 bg-zinc-200 rounded" />
      <div className="w-2/3 h-2 bg-zinc-200 rounded" />
      <div className="mt-auto flex gap-1">
        <span className="w-4 h-4 rounded-full bg-indigo-100" />
        <span className="w-12 h-2 bg-indigo-200 rounded self-center" />
      </div>
    </div>

    {/* Research Card 2 with AI Graph */}
    <div className="absolute -right-4 bottom-2 w-52 h-44 bg-[#1e1b4b] rounded-xl shadow-2xl transform rotate-12 border border-indigo-400/40 p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-indigo-300 font-mono">NEURAL_SYNTHESIS</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </div>
      <div className="flex items-end gap-1.5 h-16 pt-2">
        <div className="w-4 h-8 bg-indigo-500 rounded-t" />
        <div className="w-4 h-14 bg-indigo-400 rounded-t" />
        <div className="w-4 h-10 bg-indigo-300 rounded-t" />
        <div className="w-4 h-16 bg-indigo-200 rounded-t" />
        <div className="w-4 h-12 bg-indigo-400 rounded-t" />
      </div>
    </div>

    {/* Magnifying Glass Accent */}
    <div className="absolute left-32 bottom-4 w-20 h-20 rounded-full border-4 border-amber-300 bg-white/20 backdrop-blur-sm shadow-xl flex items-center justify-center transform -rotate-12">
      <span className="text-amber-300 text-xl font-bold">AI</span>
      <div className="absolute -bottom-6 -right-2 w-4 h-10 bg-amber-400 rounded-b transform -rotate-45" />
    </div>

    {/* Sparkle Stars */}
    <svg className="absolute right-24 top-4 w-7 h-7 text-amber-300 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
    <svg className="absolute left-40 top-8 w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </div>
)

const WorkspaceVisual = () => (
  <div className="absolute inset-0 w-full h-full bg-[#f97316] overflow-hidden select-none flex items-center justify-center">
    {/* Grid Pattern */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    />

    {/* Notes App Window */}
    <div className="absolute -left-6 top-2 w-52 h-52 bg-white rounded-xl shadow-2xl transform -rotate-6 border-2 border-orange-200 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </div>
      <div className="w-20 h-2.5 bg-orange-400 rounded" />
      <div className="w-full h-2 bg-zinc-200 rounded" />
      <div className="w-4/5 h-2 bg-zinc-200 rounded" />
      <div className="w-5/6 h-2 bg-zinc-200 rounded" />
    </div>

    {/* Chat Bubble on Right */}
    <div className="absolute -right-4 bottom-3 w-52 h-40 bg-[#18181b] rounded-2xl shadow-2xl transform rotate-10 border border-orange-300/30 p-3.5 flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 flex items-center justify-center text-[10px] text-black font-bold">
          A
        </span>
        <span className="text-xs text-white/80 font-medium">Avora Assistant</span>
      </div>
      <p className="text-[11px] text-zinc-300 leading-tight">
        "Summarized 14 research papers into your workspace notes."
      </p>
      <div className="w-full h-1.5 bg-orange-500/40 rounded-full" />
    </div>

    {/* Sparkle Stars */}
    <svg className="absolute left-32 top-6 w-6 h-6 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
    <svg className="absolute right-36 top-4 w-5 h-5 text-amber-200" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </div>
)

const featureRows = [
  {
    id: 'roadmaps',
    title: 'Personalized Roadmaps',
    description:
      'Every learner is different. Avora creates a personalized roadmap based on your goals, current knowledge, and learning pace, giving you a clear path from where you are to where you want to be.',
    visual: <RoadmapVisual />,
    delayClass: 'delay-100',
  },
  {
    id: 'research',
    title: 'AI-Powered Research',
    description:
      'Spend less time searching and more time learning. Avora researches trusted articles, videos, documentation, and learning resources, then organizes them into one place.',
    visual: <ResearchVisual />,
    delayClass: 'delay-200',
  },
  {
    id: 'workspace',
    title: 'Smart Learning Workspace',
    description:
      'Keep your roadmaps, notes, research, and AI conversations together in one intelligent workspace. Everything you learn stays connected and easy to revisit.',
    visual: <WorkspaceVisual />,
    delayClass: 'delay-300',
  },
]

const Section3 = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section
      data-theme="light"
      className="w-full bg-white text-black font-sans my-12 border-y border-[#D0D0D0] transition-colors duration-500"
    >
      {/* 1. Header Area Component Reveal */}
      <ScrollReveal
        className="flex flex-col md:flex-row mt-9 md:items-center px-8 sm:px-12 lg:px-16 py-10 sm:py-12 border-b border-[#D0D0D0]"
        delay={0}
        duration={700}
      >
        {/* Left Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-medium pb-5 tracking-tight text-black/60 shrink-0">
          Why Avora?
        </h2>

        {/* Thin Vertical Divider */}
        <div className="hidden md:block w-[1.5px] h-12 bg-[#D0D0D0] mx-8 lg:mx-12 shrink-0" />

        {/* Right Description */}
        <p className="mt-4 md:mt-0 text-zinc-600 text-sm sm:text-base md:text-base leading-relaxed max-w-xl font-normal">
          Everything you need to learn, research, and grow—
          <br className="hidden sm:inline" />
          all in one intelligent workspace.
        </p>
      </ScrollReveal>

      {/* 2. Feature Rows: Each reveals individually on scroll */}
      <div className="w-full flex flex-col divide-y divide-[#D0D0D0]">
        {featureRows.map((feature, idx) => {
          const isHovered = hoveredIndex === idx

          return (
            <ScrollReveal
              key={feature.id}
              delay={idx * 80}
              duration={700}
              yOffset={20}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex flex-col lg:flex-row items-stretch cursor-pointer min-h-[180px] lg:min-h-[190px]"
            >
              {/* Column 1: Feature Title & Image Area (approx 38-40%) */}
              <div className="relative w-full lg:w-[38%] p-6 sm:p-8 lg:p-10 flex items-center justify-start lg:justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#D0D0D0]">
                {/* Visual Image container - Smooth fade + scale 0.96->1 + upward shift on hover */}
                <div
                  className={`absolute inset-0 w-full h-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                    isHovered
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-[0.96] translate-y-2 pointer-events-none'
                  }`}
                >
                  {feature.visual}
                  {/* Darkening layer for contrast */}
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                </div>

                {/* Title with frosted backdrop blur on hover */}
                <h3
                  className={`relative z-10 text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 px-4 py-2 rounded-xl border ${
                    isHovered
                      ? 'text-white bg-black/40 backdrop-blur-md shadow-lg border-white/20'
                      : 'text-black bg-transparent border-transparent'
                  }`}
                >
                  {feature.title}
                </h3>
              </div>

              {/* Column 2: Feature Description (approx 44%) */}
              <div className="w-full lg:w-[44%] p-6 sm:p-8 lg:p-10 flex items-center border-b lg:border-b-0 lg:border-r border-[#D0D0D0]">
                <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-xl font-normal">
                  {feature.description}
                </p>
              </div>

              {/* Column 3: Arrow Icon (approx 18%) */}
              <div className="w-full lg:w-[18%] p-6 sm:p-8 lg:p-10 flex items-center justify-end lg:justify-center">
                <ArrowRight
                  size={26}
                  strokeWidth={1.5}
                  className="text-black transition-transform duration-350 ease-out group-hover:translate-x-2.5"
                />
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}

export default Section3
