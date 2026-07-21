import React, { useEffect, useState } from 'react'

const cards = [
  {
    id: 1,
    title: 'Roadmap',
    description:
      'Avora creates a personalized roadmap based on your goals, current knowledge, and learning pace, giving you a clear path from where you are to where you want to be.',
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
      'Tackle tricky coding exercises, math problems, or practice questions with interactive, step-by-step assistance that explains the underlying logic.',
  },
]

const Section2 = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  let startOffset = '10%'
  if (windowWidth >= 1024) {
    startOffset = '52%'
  } else if (windowWidth >= 768) {
    startOffset = '30%'
  }

  const getActiveCardOffset = () => {
    let offset = 0
    for (let i = 0; i < activeIndex; i += 1) {
      let margin = -80
      if (i + 1 === activeIndex) {
        margin = 20
      }
      offset += 280 + margin
    }
    return offset
  }

  const getCardStyle = (idx) => {
    const isActive = idx === activeIndex

    let marginLeft = '-80px'
    if (idx === 0) {
      marginLeft = '0px'
    } else if (isActive) {
      marginLeft = '20px'
    } else if (idx === activeIndex + 1) {
      marginLeft = '20px'
    }

    return {
      width: '280px',
      marginLeft,
      zIndex: isActive ? 30 : 20 - Math.abs(idx - activeIndex),
      transition: 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms ease, margin-left 550ms cubic-bezier(0.22, 1, 0.36, 1), filter 350ms ease',
    }
  }

  return (
    <div className="snap-start bg-[#050505] p-5 font-body">
      <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/52 bg-black/40 px-6 py-6 shadow-2xl backdrop-blur-3xl sm:px-10 sm:py-8 lg:h-screen lg:px-16 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="h-10 w-full sm:h-12" />

        <div className="relative z-10 max-w-4xl gap-4 sm:gap-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[64px]">
            Welcome to Avora.
          </h1>
          <p className="max-w-2xl text-lg font-light leading-relaxed text-white/52 sm:text-xl lg:text-2xl">
            Your second friend for learning, researching, solving problems, and celebrating every milestone.
          </p>
        </div>

        <div className="relative z-10 mt-4 w-full overflow-hidden sm:mt-6">
          <div
            className="flex"
            style={{
              transform: `translateX(calc(${startOffset} - ${getActiveCardOffset()}px))`,
              transition: 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {cards.map((card, idx) => {
              const isActive = idx === activeIndex

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="flex shrink-0 select-none cursor-pointer flex-col gap-5 text-left focus:outline-none"
                  style={getCardStyle(idx)}
                >
                  <div
                    className={`relative flex h-[150px] w-full items-center justify-center rounded-sm border transition-all duration-500 ease-out ${
                      isActive
                        ? 'border-white/20 bg-[#09090b] shadow-[0_0_30px_rgba(0,232,82,0.05)] scale-100 opacity-100'
                        : 'border-white/5 bg-[#09090b]/40 opacity-25 scale-[0.96]'
                    }`}
                  >
                    {isActive && (
                      <>
                        <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-xs bg-[#00E852] shadow-[0_0_10px_#00E852]" />
                        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-xs bg-[#00E852] shadow-[0_0_10px_#00E852]" />
                        <span className="absolute -left-1.5 -bottom-1.5 h-3 w-3 rounded-xs bg-[#00E852] shadow-[0_0_10px_#00E852]" />
                        <span className="absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-xs bg-[#00E852] shadow-[0_0_10px_#00E852]" />
                      </>
                    )}

                    <h3 className={`text-lg font-semibold tracking-wide text-white transition-transform duration-500 ease-out sm:text-xl ${isActive ? 'translate-y-0' : 'translate-y-0'}`}>
                      {card.title}
                    </h3>
                  </div>

                  <div
                    className={`w-full pr-2 transition-all duration-500 ease-out ${
                      isActive
                        ? 'visible h-auto translate-y-0 opacity-100'
                        : 'invisible h-0 -translate-y-3 overflow-hidden opacity-0'
                    }`}
                  >
                    <p className="text-xs leading-relaxed text-white/52 sm:text-[13px]">
                      {card.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative z-10 flex h-16 w-full items-center border-t border-white/5">
          <div
            className="absolute h-[3px] overflow-hidden rounded-full bg-white/10"
            style={{
              width: windowWidth >= 640 ? '280px' : '180px',
              left: startOffset,
              top: '12px',
            }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white/40"
              style={{
                width: `${((activeIndex + 1) / cards.length) * 100}%`,
              }}
            />
          </div>

          {cards.map((card, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`absolute flex h-8 w-8 cursor-pointer items-center justify-center rounded font-semibold text-xs transition-all duration-300 ease-out ${
                  isActive
                    ? 'bg-[#00E852] text-black shadow-[0_0_12px_rgba(0,232,82,0.3)] scale-105'
                    : 'bg-[#18181b] text-white/40 hover:bg-zinc-800 hover:text-white hover:scale-105'
                }`}
                style={{
                  left: idx <= activeIndex ? `calc(${startOffset} + ${idx * 40}px)` : `calc(100% - ${(4 - idx) * 40 - 8}px)`,
                  top: '32px',
                }}
              >
                {card.id}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Section2
