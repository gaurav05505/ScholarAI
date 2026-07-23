import React from 'react'
import {
  Brain,
  CircleDashed,
  Eye,
  FileText,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Bot,
  Blend,
  Plus,
  User,
  Workflow,
  HelpCircle,
} from 'lucide-react'

const leftTools = [
  { label: 'AI WORKFLOW', active: true },
  { label: 'AI CHAT', active: false },
]

const stackIcons = [Brain, Sparkles, CircleDashed, Bot, Eye, Plus]

const Section4 = () => {
  return (
    <section className="snap-start bg-[#050505] p-5">
      <div className="relative min-h-[calc(100vh-2.5rem)] overflow-hidden rounded-[28px] border border-white/15 bg-black px-4 pb-10 pt-2 sm:px-6 lg:px-10 lg:pt-4">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col">
          <div className="grid grid-cols-1 items-start gap-4 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-0 lg:pb-10">
            <div />
            <h2 className="text-center text-[42px] font-light tracking-tight text-[#ffb59e] sm:text-[54px] lg:text-[64px]">
              easier, faster more in-depth
            </h2>
            <div />
          </div>

          <div className="mt-6 rounded-[16px] border border-white/15 bg-[#050505] px-4 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:px-6 sm:py-8 lg:flex-1 lg:px-8 lg:py-8">
            <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
              <aside className="flex flex-col gap-8 lg:pt-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-28 flex-col justify-between py-1">
                    <span className="h-1.5 w-8 bg-white/80" />
                    <span className="h-1.5 w-8 bg-white/80" />
                    <span className="h-1.5 w-8 bg-white/80" />
                    <span className="h-1.5 w-8 bg-white/80" />
                    <span className="h-1.5 w-8 bg-white/80" />
                    <span className="h-1.5 w-8 bg-white/80" />
                    <span className="h-1.5 w-8 bg-white/80" />
                    <span className="h-1.5 w-8 bg-white/80" />
                  </div>

                  <div className="flex flex-col gap-4">
                    {leftTools.map((tool) => (
                      <button
                        key={tool.label}
                        type="button"
                        className={`h-12 w-[170px] border px-6 text-left text-sm font-semibold tracking-wide ${
                          tool.active
                            ? 'border-white/10 bg-white text-black'
                            : 'border-white/15 bg-transparent text-white'
                        }`}
                      >
                        {tool.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <p className="mb-4 text-sm uppercase tracking-wide text-white">STACK</p>
                    <div className="grid max-w-[185px] grid-cols-3 gap-3">
                      {stackIcons.map((Icon, index) => (
                        <div
                          key={index}
                          className="flex h-14 w-14 items-center justify-center border border-white/15 bg-white/5 text-white"
                        >
                          <Icon size={22} strokeWidth={1.8} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-end gap-4 pb-2">
                  <div className="flex flex-col items-start gap-4">
                    <div className="h-10 w-1 bg-white/85" />
                    <div className="h-10 w-1 bg-white/85" />
                    <div className="flex h-8 items-end gap-3">
                      <div className="h-full w-1 bg-white/85" />
                      <div className="h-1 w-24 bg-white/85" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <span className="text-sm font-light text-white">AUTO</span>
                    <div className="h-6 w-28 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.85)_0_4px,transparent_4px_8px)]" />
                  </div>
                </div>
              </aside>

              <main className="relative min-h-[560px] overflow-hidden rounded-[14px] border border-white/10 bg-[#070707]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:18px_18px] opacity-35" />

                <div className="relative z-10 flex items-center gap-3 px-5 py-5 sm:px-6">
                  <button type="button" className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/5 text-white">
                    <ArrowLeft size={20} strokeWidth={1.8} />
                  </button>
                  <button type="button" className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/5 text-white/40">
                    <ArrowRight size={20} strokeWidth={1.8} />
                  </button>

                  <div className="ml-6 flex items-center">
                    <button type="button" className="flex h-11 items-center justify-center border border-white/15 bg-white/10 px-7 text-sm text-white">
                      LEARNING MODE
                      <Sparkles size={18} className="ml-2" strokeWidth={1.8} />
                    </button>
                    <button type="button" className="flex h-11 items-center justify-center border border-white/15 bg-transparent px-7 text-sm text-white/90">
                      RESEARCH MODE
                      <Brain size={18} className="ml-2" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center px-8 pb-8 pt-20">
                  <div className="relative h-[470px] w-full max-w-[900px] rounded-[14px] border border-white/10 bg-[#050505]/90">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30" />

                    <div className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-sm border border-white/10 bg-white/8 p-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                      <Bot size={34} strokeWidth={1.6} />
                    </div>

                    <div className="absolute left-1/2 top-[27%] h-12 w-px -translate-x-1/2 border-l-2 border-dotted border-white/80" />
                    <div className="absolute left-[30%] top-[38%] h-px w-[40%] border-t-2 border-dotted border-white/80" />
                    <div className="absolute left-[30%] top-[38%] h-16 border-l-2 border-dotted border-white/80" />
                    <div className="absolute left-[43%] top-[38%] h-16 border-l-2 border-dotted border-white/80" />
                    <div className="absolute left-[57%] top-[38%] h-16 border-l-2 border-dotted border-white/80" />
                    <div className="absolute left-[70%] top-[38%] h-16 border-l-2 border-dotted border-white/80" />

                    <div className="absolute left-[30%] top-[48%] flex h-16 w-16 items-center justify-center border border-white/10 bg-white/8 text-white">
                      <User size={28} strokeWidth={1.6} />
                    </div>
                    <div className="absolute left-[43%] top-[48%] flex h-16 w-16 items-center justify-center border border-white/10 bg-white/8 text-white">
                      <Workflow size={28} strokeWidth={1.6} />
                    </div>
                    <div className="absolute left-[57%] top-[48%] flex h-16 w-16 items-center justify-center border border-white/10 bg-white/8 text-white">
                      <Blend size={28} strokeWidth={1.6} />
                    </div>
                    <div className="absolute left-[70%] top-[48%] flex h-16 w-16 items-center justify-center border border-white/10 bg-white/8 text-white">
                      <FileText size={28} strokeWidth={1.6} />
                    </div>

                    <div className="absolute left-[70%] top-[64%] h-16 border-l-2 border-dotted border-white/80" />
                    <div className="absolute left-[70%] top-[76%] flex h-16 w-16 items-center justify-center border border-white/10 bg-white/8 text-white">
                      <HelpCircle size={28} strokeWidth={1.6} />
                    </div>
                    <div className="absolute left-[70%] top-[90%] h-12 border-l-2 border-dotted border-white/80" />
                    <div className="absolute left-[70%] top-[104%] flex h-16 w-16 -translate-y-full items-center justify-center border border-white/10 bg-white/8 text-white">
                      <MessageCircle size={28} strokeWidth={1.6} />
                    </div>

                    <div className="absolute left-[30%] top-[64%] h-28 border-l-2 border-dotted border-white/80" />
                    <div className="absolute left-[30%] top-[92%] h-2 w-2 rounded-full bg-white/80" />
                    <div className="absolute left-[30%] top-[94%] h-px w-[40%] border-t-2 border-dotted border-white/80" />
                    <div className="absolute left-[65%] top-[94%] h-2 w-2 rounded-full bg-white/80" />
                  </div>
                </div>
              </main>
            </div>
          </div>

          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 lg:block">
            <span className="text-[14px] tracking-[0.2em] text-white/90" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              ITS YOURS
            </span>
          </div>

          <div className="pointer-events-none absolute right-6 top-[58%] hidden h-32 w-1 bg-white/85 lg:block" />
          <div className="pointer-events-none absolute right-6 bottom-14 hidden h-10 w-1 bg-white/85 lg:block" />
        </div>
      </div>
    </section>
  )
}

export default Section4
