import React, { useState, useEffect, useRef } from 'react'

const Section2 = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const containerRef = useRef(null)
  const lastScrollTime = useRef(0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scroll hijacking / panel snap scroll-lock logic
  useEffect(() => {
    const container = containerRef.current
    if (!container || windowWidth < 1024) return // Run scroll-hijacking on desktop only

    const handleWheel = (e) => {
      const now = Date.now()
      const isHijacking = 
        (e.deltaY > 0 && activeIndex < cards.length - 1) || 
        (e.deltaY < 0 && activeIndex > 0)

      // If we are at boundaries and scrolling away, exit immediately (allows browser native snap scroll)
      if (!isHijacking) return

      // Hijack the scroll wheel to cycle cards
      e.preventDefault()

      // Cooldown to prevent trackpad inertia from double triggering slides rapidly
      if (now - lastScrollTime.current < 750) {
        return
      }

      if (e.deltaY > 0) {
        // Scroll Down - cycle forward
        if (activeIndex < cards.length - 1) {
          lastScrollTime.current = now
          setActiveIndex((prev) => prev + 1)
        }
      } else if (e.deltaY < 0) {
        // Scroll Up - cycle backward
        if (activeIndex > 0) {
          lastScrollTime.current = now
          setActiveIndex((prev) => prev - 1)
        }
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [activeIndex, windowWidth])

  // Autoplay / AFK cycling logic
  useEffect(() => {
    let autoplayTimer = null
    let afkTimeout = null

    const startAutoplay = () => {
      autoplayTimer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % cards.length)
      }, 4000) // Transition slides every 4 seconds when AFK
    }

    const resetAFKTimer = () => {
      if (autoplayTimer) clearInterval(autoplayTimer)
      if (afkTimeout) clearTimeout(afkTimeout)

      // Start autoplay after 6 seconds of complete user inactivity (AFK)
      afkTimeout = setTimeout(() => {
        startAutoplay()
      }, 6000)
    }

    // Initialize the AFK timer
    resetAFKTimer()

    // Monitor global user activity events
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => {
      window.addEventListener(event, resetAFKTimer)
    })

    return () => {
      if (autoplayTimer) clearInterval(autoplayTimer)
      if (afkTimeout) clearTimeout(afkTimeout)
      events.forEach((event) => {
        window.removeEventListener(event, resetAFKTimer)
      })
    }
  }, [])

  const cards = [
    {
      id: 1,
      title: 'Roadmap',
      description: 'Avora creates a personalized roadmap based on your goals, current knowledge, and learning pace—giving you a clear path from where you are to where you want to be.'
    },
    {
      id: 2,
      title: 'Learn',
      description: 'Unlock an intelligent learning workspace. Chat with your resources, generate custom study guides, practice with flashcards, and master any concept.'
    },
    {
      id: 3,
      title: 'Research',
      description: 'Synthesize insights from papers, books, and articles. Deep dive into complex information with automated source citation and analysis.'
    },
    {
      id: 4,
      title: 'Solve',
      description: 'Tackle tricky coding exercises, math problems, or practice questions with interactive, step-by-step assistance that explains the underlying logic.'
    }
  ]

  // Calculate focal point alignment based on screen size
  let startOffset = '10%'
  if (windowWidth >= 1024) {
    startOffset = '52%' // Align right of the 42rem (max-w-2xl) subtitle text
  } else if (windowWidth >= 768) {
    startOffset = '30%'
  }

  const getActiveCardOffset = () => {
    let offset = 0
    for (let i = 0; i < activeIndex; i++) {
      let margin = -80 // Overlap for preceding inactive cards
      if (i + 1 === activeIndex) {
        margin = 20 // The active card has a 20px gap before it
      }
      offset += 280 + margin
    }
    return offset
  }

  const getCardStyle = (idx) => {
    const isActive = idx === activeIndex
    
    let marginLeft = '-80px' // Overlap of 80px by default
    if (idx === 0) {
      marginLeft = '0px'
    } else if (isActive) {
      marginLeft = '20px' // Break overlap on active card
    } else if (idx === activeIndex + 1) {
      marginLeft = '20px' // Break overlap on immediate succeeding card
    }

    return {
      width: '280px',
      marginLeft: marginLeft,
      zIndex: isActive ? 30 : 20 - Math.abs(idx - activeIndex),
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    }
  }

  const getButtonLeft = (idx) => {
    if (idx <= activeIndex) {
      return `calc(${startOffset} + ${idx * 40}px)`
    } else {
      return `calc(100% - ${(4 - idx) * 40 - 8}px)`
    }
  }

  return (
    <div ref={containerRef} className='snap-start p-5 bg-[#050505] font-body'>
      {/* Outer Card Wrapper matching user's border style */}
      <div className='min-h-screen lg:h-screen w-full border border-white/52 rounded-2xl bg-black/40 flex flex-col justify-between py-6 sm:py-8 lg:py-10 px-6 sm:px-10 lg:px-16 relative overflow-hidden backdrop-blur-3xl shadow-2xl'>
        
        {/* Subtle grid pattern background overlay for premium aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Spacing at the top to clear the fixed global Navbar */}
        <div className="h-10 sm:h-12 w-full" />

        {/* 2. Hero Content */}
        <div className="z-10 flex flex-col items-start gap-4 sm:gap-6 mt-1 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold tracking-tight text-white leading-tight">
            Welcome to Avora.
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/52 font-light max-w-2xl leading-relaxed">
            Your second friend for learning, researching, solving problems, and celebrating every milestone.
          </p>
        </div>

        {/* 3. Interactive Carousel Section */}
        <div className="z-10 w-full mt-4 sm:mt-6 mb-4 overflow-hidden relative">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(${startOffset} - ${getActiveCardOffset()}px))`
            }}
          >
            {cards.map((card, idx) => {
              const isActive = idx === activeIndex
              
              return (
                <div 
                  key={card.id}
                  onClick={() => setActiveIndex(idx)}
                  className="flex flex-col gap-5 shrink-0 select-none cursor-pointer"
                  style={getCardStyle(idx)}
                >
                  {/* Card Body */}
                  <div 
                    className={`relative w-full h-[150px] sm:h-[170px] rounded-sm border flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? 'bg-[#09090b] border-white/20 shadow-[0_0_30px_rgba(0,232,82,0.05)] scale-100' 
                        : 'bg-[#09090b]/40 border-white/5 opacity-25 blur-[1.5px] scale-95 hover:opacity-40 hover:blur-[0.5px]'
                    }`}
                  >
                    {/* Glowing active corners */}
                    {isActive && (
                      <>
                        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#00E852] rounded-xs shadow-[0_0_10px_#00E852]" />
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00E852] rounded-xs shadow-[0_0_10px_#00E852]" />
                        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#00E852] rounded-xs shadow-[0_0_10px_#00E852]" />
                        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#00E852] rounded-xs shadow-[0_0_10px_#00E852]" />
                      </>
                    )}

                    <h3 className="font-semibold text-lg sm:text-xl text-white tracking-wide">
                      {card.title}
                    </h3>
                  </div>

                  {/* Active Description Text Below the Card */}
                  <div 
                    className={`transition-all duration-500 w-full pr-2 ${
                      isActive 
                        ? 'opacity-100 translate-y-0 h-auto visible' 
                        : 'opacity-0 -translate-y-2 h-0 overflow-hidden invisible'
                    }`}
                  >
                    <p className="text-xs sm:text-[13px] text-white/52 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4. Footer controls (Progress Slider & Dynamic Split Numbers) */}
        <div className="z-10 w-full border-t border-white/5 relative h-16 flex items-center">
          {/* Progress Bar indicator - Aligns exactly below the starting/active card zone */}
          <div 
            className="absolute h-[3px] bg-white/10 rounded-full overflow-hidden transition-all duration-700 ease-in-out"
            style={{
              width: windowWidth >= 640 ? '280px' : '180px',
              left: startOffset,
              top: '12px'
            }}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-white/40 transition-all duration-500 rounded-full"
              style={{
                width: `${((activeIndex + 1) / cards.length) * 100}%`
              }}
            />
          </div>

          {/* Individual Dynamic Split Numbers */}
          {cards.map((card, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={card.id}
                onClick={() => setActiveIndex(idx)}
                className={`absolute w-8 h-8 rounded font-semibold text-xs transition-all duration-700 ease-in-out cursor-pointer flex items-center justify-center ${
                  isActive 
                    ? 'bg-[#00E852] text-black shadow-[0_0_12px_rgba(0,232,82,0.3)]' 
                    : 'bg-[#18181b] hover:bg-zinc-800 text-white/40 hover:text-white'
                }`}
                style={{
                  left: getButtonLeft(idx),
                  top: '32px'
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
