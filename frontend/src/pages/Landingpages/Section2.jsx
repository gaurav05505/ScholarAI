import React, { useState, useEffect } from 'react'

const cards = [
  {
    id: 1,
    title: 'Roadmap',
    description:
      'Avora creates a personalized roadmap based on your goals, current knowledge, and learning pace—giving you a clear path from where you are to where you want to be.',
  },
  {
    id: 2,
    title: 'Learn',
    description:
      'Unlock an intelligent learning workspace. Chat with your resources, generate custom study guides, practice with flashcards, and master any concept.',
  },
  {
    id: 3,
    title: 'Research',
    description:
      'Synthesize insights from papers, books, and articles. Deep dive into complex information with automated source citation and analysis.',
  },
  {
    id: 4,
    title: 'Solve',
    description:
      'Tackle tricky exercises, complex problems, or practice questions with interactive step-by-step guidance that explains the core principles.',
  },
]

const Section2 = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const cardWidth = 260
  const cardGap = 48
  const stepOffset = cardWidth + cardGap

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [activeIndex])

  return (
    <div className="relative mx-4 sm:mx-6 lg:mx-8 my-4 mt-30 min-h-[720px] rounded-2xl border border-white/10 bg-[#050505] p-8 md:p-12 lg:p-14 overflow-hidden flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="max-w-xl z-10">
        <h2 className="text-4xl md:text-5xl lg:text-[52px] font-black font-heading tracking-tight text-white leading-tight">
          Welcome to Avora.
        </h2>
        <p className="mt-4 text-zinc-400 text-base md:text-lg font-light leading-relaxed">
          Your second friend for learning, researching, solving problems, and celebrating every milestone.
        </p>
      </div>

      {/* Middle Carousel Area - Positioned on the Right Half */}
      <div className="relative w-full my-8">
        <div className="lg:absolute lg:left-[38%] lg:top-[-110px] w-full">
          {/* Sliding Track */}
          <div
            className="flex items-start transition-transform duration-500 ease-out"
            style={{
              gap: `${cardGap}px`,
              transform: `translateX(-${activeIndex * stepOffset}px)`,
            }}
          >
            {cards.map((card, idx) => {
              const isActive = idx === activeIndex

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveIndex(idx)}
                  className="flex flex-col cursor-pointer shrink-0"
                  style={{ width: `${cardWidth}px` }}
                >
                  {/* Card Box */}
                  <div
                    className={`relative flex items-center justify-center h-[160px] rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-[#0d0d10] border border-white/20 shadow-2xl opacity-100'
                        : 'bg-[#121216]/60 border border-white/5 opacity-25 hover:opacity-50 blur-[0.4px]'
                    }`}
                  >
                    {/* 4 Blue Corner Accents */}
                    {isActive && (
                      <>
                        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#3b66ff] rounded-[2px] shadow-[0_0_10px_#3b66ff]" />
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#3b66ff] rounded-[2px] shadow-[0_0_10px_#3b66ff]" />
                        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#3b66ff] rounded-[2px] shadow-[0_0_10px_#3b66ff]" />
                        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#3b66ff] rounded-[2px] shadow-[0_0_10px_#3b66ff]" />
                      </>
                    )}

                    <h3
                      className={`text-lg sm:text-xl font-semibold tracking-wide ${
                        isActive ? 'text-white' : 'text-zinc-400'
                      }`}
                    >
                      {card.title}
                    </h3>
                  </div>

                  {/* Active Description */}
                  <div
                    className={`mt-5 transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 max-h-40'
                        : 'opacity-0 max-h-0 pointer-events-none'
                    }`}
                  >
                    <p className="text-[13px] text-zinc-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Pagination Numbers */}
      <div className="w-full flex flex-col gap-4 pt-10 mt-14 border-t border-white/10 z-10">
        {/* Progress Bar under active card position */}
        <div className="w-full flex">
          <div className="lg:ml-[38%] w-[200px] sm:w-[260px] h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-300 transition-all duration-300 rounded-full"
              style={{
                width: `${((activeIndex + 1) / cards.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Pagination Numbers Row */}
        <div className="flex items-center justify-between w-full pt-1">
          {/* Active number under active card */}
          <div className="lg:ml-[38%]">
            <div className="w-7 h-7 rounded bg-[#2f54eb] text-white flex items-center justify-center text-xs font-semibold shadow-md">
              {cards[activeIndex].id}
            </div>
          </div>

          {/* Right grouped numbers */}
          <div className="flex items-center gap-2">
            {cards.map((card, idx) => {
              const isCurrent = idx === activeIndex
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#2f54eb] text-white'
                      : 'bg-[#27272a] text-zinc-400 hover:bg-[#3f3f46] hover:text-white'
                  }`}
                >
                  {card.id}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section2
