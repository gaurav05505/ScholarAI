import React from 'react'
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Bot,
  Blend,
  Plus,
  User,
  Workflow,
  HelpCircle,
  FileText,
  MessageCircle,
  CircleDashed,
  Eye,
  Brain,
} from 'lucide-react'

const leftTools = [
  { label: 'AI WORKFLOW', active: true },
  { label: 'AI CHAT', active: false },
]

const stackIcons = [Sparkles, Sparkles, CircleDashed, Bot, Eye, Plus]

const rootNode = { x: 51, y: 15, Icon: Sparkles }
const rowNodes = [
  { x: 38, y: 46, Icon: User },
  { x: 46, y: 46, Icon: Workflow },
  { x: 54, y: 46, Icon: Blend },
  { x: 62, y: 46, Icon: FileText },
]
const helpNode = { x: 62, y: 63 }
const chatNode = { x: 62, y: 80 }
const loopY = 80

const Section4 = () => {
  return (
    <section className="relative snap-start bg-[#030303] min-h-screen px-3 py-5 sm:px-5">
      <div className="pointer-events-none absolute left-[29%] top-0 hidden h-full w-px bg-white/10 lg:block" />
      <div className="pointer-events-none absolute left-[72%] top-0 hidden h-full w-px bg-white/10 lg:block" />

      <div className="relative mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-[1360px] overflow-hidden rounded-[8px] border border-white/15 bg-[#050505] shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />

        <aside className="relative z-10 flex min-h-[calc(100vh-2.5rem)] w-full flex-col px-8 py-10 sm:w-[248px]">
          <div className="flex gap-7">
            <div className="flex h-[82px] w-4 flex-col justify-between overflow-hidden">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="h-px w-7 origin-left rotate-45 bg-white/80" />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {leftTools.map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  className={`h-[34px] w-[132px] rounded-none border text-[11px] font-semibold uppercase leading-none tracking-normal transition-colors ${
                    tool.active
                      ? 'border-white/25 bg-white text-[#111]'
                      : 'border-white/15 bg-transparent text-white hover:bg-white/5'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-[47px] mt-12">
            <p className="mb-3 text-[11px] font-normal uppercase leading-none text-white/80">
              Stack
            </p>
            <div className="grid w-[132px] grid-cols-3 gap-[10px]">
              {stackIcons.map((Icon, index) => (
                <div
                  key={index}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-none border border-white/15 bg-white/[0.03] text-white"
                >
                  <Icon size={17} strokeWidth={1.6} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-end gap-4">
            <div className="flex flex-col items-start">
              <div className="ml-1 h-[250px] w-[4px] bg-white/90" />
              <div className="ml-1 mt-10 h-[28px] w-[4px] bg-white/90" />
              <div className="ml-1 mt-3 h-[24px] w-[4px] bg-white/90" />
              <div className="flex items-end">
                <div className="ml-1 h-[24px] w-[4px] bg-white/90" />
                <div className="h-[4px] w-[72px] bg-white/90" />
              </div>
            </div>

            <div className="mb-[-2px] flex items-end gap-4">
              <span className="mb-2 text-[9px] font-light uppercase leading-none text-white/85">
                AUTO
              </span>
              <div className="h-[16px] w-[84px] bg-[repeating-linear-gradient(105deg,rgba(255,255,255,0.85)_0_2px,transparent_2px_5px)]" />
            </div>
          </div>
        </aside>

        <main className="relative z-10 mt-8 px-5 pb-8 sm:absolute sm:inset-y-0 sm:left-[288px] sm:right-[104px] sm:mt-0 sm:px-0 sm:pb-0">
          <div className="flex items-center gap-0 sm:absolute sm:left-0 sm:top-11">
            <button
              type="button"
              aria-label="Undo"
              className="flex h-[32px] w-[33px] items-center justify-center rounded-none border border-white/15 bg-white/[0.03] text-white/85 hover:bg-white/10"
            >
              <ArrowLeft size={15} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              aria-label="Redo"
              className="flex h-[32px] w-[33px] items-center justify-center rounded-none border border-l-0 border-white/15 bg-white/[0.03] text-white/30"
            >
              <ArrowRight size={15} strokeWidth={1.7} />
            </button>

            <div className="ml-8 flex items-center">
              <button
                type="button"
                className="flex h-[32px] w-[148px] items-center justify-center gap-2 rounded-none border border-white/15 bg-white/[0.04] text-[10px] font-semibold uppercase leading-none text-white/70"
              >
                LEARNING MODE
                <Sparkles size={14} strokeWidth={1.7} />
              </button>
              <button
                type="button"
                className="flex h-[32px] w-[152px] items-center justify-center gap-2 rounded-none border border-l-0 border-white/15 bg-white/[0.04] text-[10px] font-semibold uppercase leading-none text-white/70 hover:bg-white/8"
              >
                RESEARCH MODE
                <Brain size={14} strokeWidth={1.7} />
              </button>
            </div>
          </div>

          <div className="relative mt-5 h-[520px] overflow-hidden rounded-[7px] border border-white/10 bg-[#030303] sm:absolute sm:left-0 sm:right-0 sm:top-[92px] sm:bottom-[70px] sm:h-auto sm:mt-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[size:18px_18px] opacity-25" />

            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <g
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="0.35"
                strokeDasharray="1.25 1.7"
                vectorEffect="non-scaling-stroke"
              >
                <path d={`M ${rootNode.x} ${rootNode.y + 4} L ${rootNode.x} ${rowNodes[0].y - 8}`} />
                <path d={`M ${rowNodes[0].x} ${rowNodes[0].y - 8} L ${rowNodes[3].x} ${rowNodes[0].y - 8}`} />
                {rowNodes.map((n, i) => (
                  <path key={i} d={`M ${n.x} ${rowNodes[0].y - 8} L ${n.x} ${n.y - 4}`} />
                ))}
                <path d={`M ${helpNode.x} ${rowNodes[3].y + 4} L ${helpNode.x} ${helpNode.y - 4}`} />
                <path d={`M ${chatNode.x} ${helpNode.y + 4} L ${chatNode.x} ${chatNode.y - 4}`} />
                <path
                  d={`M ${rowNodes[0].x} ${rowNodes[0].y + 4}
                      L ${rowNodes[0].x} ${loopY}
                      L ${chatNode.x - 4} ${loopY}`}
                />
              </g>
              <circle cx={rowNodes[0].x} cy={loopY} r="0.55" fill="rgba(255,255,255,0.78)" />
              <circle cx={chatNode.x - 4} cy={loopY} r="0.55" fill="rgba(255,255,255,0.78)" />
            </svg>

            <FlowNode x={rootNode.x} y={rootNode.y}>
              <rootNode.Icon size={19} strokeWidth={1.55} />
            </FlowNode>

            {rowNodes.map((n, i) => (
              <FlowNode key={i} x={n.x} y={n.y}>
                <n.Icon size={18} strokeWidth={1.55} />
              </FlowNode>
            ))}

            <FlowNode x={helpNode.x} y={helpNode.y}>
              <HelpCircle size={18} strokeWidth={1.55} />
            </FlowNode>
            <FlowNode x={chatNode.x} y={chatNode.y}>
              <MessageCircle size={18} strokeWidth={1.55} />
            </FlowNode>
          </div>
        </main>

        <div className="pointer-events-none absolute right-[56px] top-[118px] hidden lg:block">
          <span
            className="text-[10px] font-medium uppercase tracking-normal text-white/85"
            style={{ writingMode: 'vertical-rl' }}
          >
            ITS YOURS
          </span>
        </div>

        <div className="pointer-events-none absolute right-[64px] top-[245px] hidden h-[250px] w-[4px] bg-white/90 lg:block" />
        <div className="pointer-events-none absolute right-[64px] bottom-[72px] hidden h-[28px] w-[4px] bg-white/90 lg:block" />
      </div>
    </section>
  )
}

const FlowNode = ({ x, y, size = 46, children }) => (
  <div
    className="absolute flex items-center justify-center rounded-none border border-white/10 bg-white/[0.045] text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      transform: 'translate(-50%, -50%)',
    }}
  >
    {children}
  </div>
)

export default Section4


