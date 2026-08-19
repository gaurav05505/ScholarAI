import React, { useState } from 'react'
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

const rootNode = {
  key: 'intake',
  x: 51,
  y: 15,
  Icon: Sparkles,
  title: 'AI Intake',
  caption: 'Signal',
}

const rowNodes = [
  { key: 'profile', x: 24, y: 45, Icon: User, title: 'Profile', caption: 'Goals' },
  { key: 'planner', x: 42, y: 45, Icon: Workflow, title: 'Planner', caption: 'Roadmap' },
  { key: 'research', x: 60, y: 45, Icon: Blend, title: 'Research', caption: 'Sources' },
  { key: 'output', x: 78, y: 45, Icon: FileText, title: 'Output', caption: 'Docs' },
]

const helpNode = {
  key: 'review',
  x: 70,
  y: 65,
  Icon: HelpCircle,
  title: 'Review',
  caption: 'Check',
}

const chatNode = {
  key: 'coach',
  x: 70,
  y: 83,
  Icon: MessageCircle,
  title: 'Coach',
  caption: 'Chat',
}

const loopY = 84
const CYCLE = 4.2

const nodes = [rootNode, ...rowNodes, helpNode, chatNode]


const Section4 = () => {
  const [hovered, setHovered] = useState(null)

  return (
    <section className="relative snap-start bg-[#030303] min-h-screen px-3 py-5 sm:px-5">
      <style>{`
        @keyframes pipelinePulse {
          0%, 92%, 100% {
            border-color: rgba(255,255,255,0.1);
            box-shadow: 0 0 0 0 rgba(255,181,158,0);
          }
          8% {
            border-color: rgba(255,181,158,0.8);
            box-shadow: 0 0 18px 2px rgba(255,181,158,0.28), inset 0 0 12px rgba(255,181,158,0.12);
          }
          20% {
            border-color: rgba(255,255,255,0.12);
            box-shadow: 0 0 0 0 rgba(255,181,158,0);
          }
        }
        @keyframes edgeFlow {
          to { stroke-dashoffset: -18; }
        }
        @keyframes nodeFloat {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -2px; }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

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
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-[45%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="pointer-events-none absolute bottom-[18%] left-[18%] right-[21%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="pipelineGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="0.9" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g
                fill="none"
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="0.42"
                strokeDasharray="1.35 1.75"
                vectorEffect="non-scaling-stroke"
                style={{ animation: 'edgeFlow 1.8s linear infinite' }}
              >
                <path d={`M ${rootNode.x} ${rootNode.y + 7} L ${rootNode.x} ${rowNodes[0].y - 13}`} />
                <path d={`M ${rowNodes[0].x} ${rowNodes[0].y - 13} L ${rowNodes[3].x} ${rowNodes[0].y - 13}`} />
                {rowNodes.map((node) => (
                  <path key={node.key} d={`M ${node.x} ${rowNodes[0].y - 13} L ${node.x} ${node.y - 8}`} />
                ))}
                <path d={`M ${rowNodes[0].x + 7} ${rowNodes[0].y} L ${rowNodes[1].x - 7} ${rowNodes[1].y}`} />
                <path d={`M ${rowNodes[1].x + 7} ${rowNodes[1].y} L ${rowNodes[2].x - 7} ${rowNodes[2].y}`} />
                <path d={`M ${rowNodes[2].x + 7} ${rowNodes[2].y} L ${rowNodes[3].x - 7} ${rowNodes[3].y}`} />
                <path d={`M ${helpNode.x} ${rowNodes[3].y + 8} L ${helpNode.x} ${helpNode.y - 8}`} />
                <path d={`M ${chatNode.x} ${helpNode.y + 8} L ${chatNode.x} ${chatNode.y - 8}`} />
                <path
                  d={`M ${rowNodes[0].x} ${rowNodes[0].y + 8}
                      L ${rowNodes[0].x} ${loopY}
                      L ${chatNode.x - 8} ${loopY}`}
                />
              </g>

              <g fill="rgba(255,255,255,0.78)">
                <circle cx={rowNodes[0].x} cy={loopY} r="0.55" />
                <circle cx={chatNode.x - 8} cy={loopY} r="0.55" />
                {rowNodes.map((node) => (
                  <circle key={node.key} cx={node.x} cy={rowNodes[0].y - 13} r="0.42" />
                ))}
              </g>
            </svg>

            {nodes.map((node, index) => (
              <FlowNode
                key={node.key}
                {...node}
                delay={index * 0.35}
                hovered={hovered === node.key}
                onHover={() => setHovered(node.key)}
                onLeave={() => setHovered(null)}
              />
            ))}
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

const FlowNode = ({
  x,
  y,
  Icon,
  title,
  caption,
  delay = 0,
  hovered,
  onHover,
  onLeave,
}) => (
  <div
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    className="absolute flex h-[74px] w-[148px] cursor-pointer items-center gap-4 rounded-none border bg-[#0b0b0b]/95 px-4 text-white/80 transition-all duration-200 ease-out"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      transform: hovered ? 'translate(-50%, -50%) scale(1.06)' : 'translate(-50%, -50%) scale(1)',
      borderColor: hovered ? 'rgba(255,181,158,0.72)' : 'rgba(255,255,255,0.12)',
      color: hovered ? '#ffdccf' : undefined,
      boxShadow: hovered
        ? '0 0 22px 2px rgba(255,181,158,0.28), inset 0 0 14px rgba(255,181,158,0.08)'
        : '0 10px 24px rgba(0,0,0,0.32)',
      animation: hovered ? undefined : `pipelinePulse ${CYCLE}s ease-in-out infinite, nodeFloat 4.5s ease-in-out infinite`,
      animationDelay: `${delay}s, ${delay * 0.4}s`,
    }}
  >
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[0.045]">
      <span
        className="absolute right-[-3px] top-[-3px] h-[5px] w-[5px] bg-[#ffb59e]"
        style={{ animation: `statusBlink 1.7s ease-in-out infinite`, animationDelay: `${delay}s` }}
      />
      <Icon size={20} strokeWidth={1.55} />
    </span>
    <span className="min-w-0 leading-none">
      <span className="block whitespace-nowrap text-[13px] font-semibold uppercase text-white/90">
        {title}
      </span>
      <span className="mt-2 block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.08em] text-white/42">
        {caption}
      </span>
    </span>
  </div>
)

export default Section4