import { MoveRight, Plus, ChevronDown, ArrowUp } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const Section1 = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    // Trigger initial staggered entrance animation once on mount
    const timer = setTimeout(() => setIsLoaded(true), 50)

    // Ultra-lightweight scroll listener for subtle depth parallax
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Subtle parallax translation (strictly bounded to -8px .. +8px)
  const subtleParallax = Math.max(-8, Math.min(8, (scrollY - 100) * 0.03))

  return (
    <div className='mx-4 sm:mx-6 lg:mx-8 my-4 mt-2 sm:mt-4 min-h-[calc(100dvh-5.5rem)] sm:min-h-[calc(100dvh-6.5rem)] flex flex-col justify-between bg-[url("landingBg.svg")] bg-cover bg-center'>

      {/* top  */}
      <div className='flex flex-col gap-5 sm:gap-8 pt-2 sm:pt-4'>

        {/* 1. Main Heading (Entrance: 0ms delay, 700ms duration) */}
        <h1
          className={`text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-light leading-[1.33] lg:leading-[1.33] w-full lg:w-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          From First Principles to Deep Research—Powered by AI.
        </h1>

        {/* 2. CTA Button (Entrance: 150ms delay, 600ms duration) */}
        <button
          className={`group flex items-center gap-8 sm:gap-12 lg:gap-20 border-b border-white py-2 px-2 w-fit cursor-pointer transition-all duration-600 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className='text-sm lg:text-[16px]'>Why avora</p>
          <div className='relative overflow-hidden w-6 h-6 flex items-center justify-center'>
            <MoveRight className='w-6 h-6 transition-transform duration-300 ease-in-out group-hover:translate-x-full' />
            <MoveRight className='w-6 h-6 absolute transition-transform duration-300 ease-in-out -translate-x-full group-hover:translate-x-0' />
          </div>
        </button>

      </div>

      {/* bottom — Hero Visual / Prompt Box (Entrance: 300ms delay, 900ms duration, subtle parallax) */}
      <div
        style={{
          transform: isLoaded
            ? `translateY(${subtleParallax}px) scale(1)`
            : 'translateY(24px) scale(0.97)',
        }}
        className={`relative w-full max-w-250 mx-auto mt-auto pt-8 pb-4 sm:pb-6 transition-all duration-900 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Rotating Linear/Gradient Border Container with exact Figma Drop Shadow */}
        <div
          style={{ boxShadow: '0px 4px 153.4px -2px rgba(77, 116, 255, 0.2)' }}
          className='relative p-[1.5px] overflow-hidden rounded-2xl bg-white/5'
        >
          {/* Rotating Beam with #4D74FF */}
          <div className='absolute inset-[-150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_65%,#254cd9_78%,#4D74FF_88%,#9db5ff_96%,transparent_100%)]' />

          {/* Card Content */}
          <div className='relative w-full min-h-47.5 sm:min-h-55 lg:h-50 bg-[#08080a] rounded-[15px] p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-0'>
            <textarea
              placeholder='What do you want to learn today? e.g., Quantum Computing'
              rows={3}
              className='w-full bg-transparent text-white placeholder:text-zinc-500 text-sm sm:text-base outline-none resize-none focus:outline-none'
            />

            <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
              <div className='flex items-center gap-2'>
                <button className='flex items-center justify-center w-8 h-8 rounded-lg bg-[#18181b] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0'>
                  <Plus size={16} />
                </button>
                <button className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181b] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors cursor-pointer'>
                  <span>Think Deep</span>
                  <ChevronDown size={14} className='text-zinc-400' />
                </button>
              </div>

              <button className='w-9 h-9 rounded-xl bg-linear-to-b from-[#ff825c] to-[#4ac7ec] flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer shrink-0'>
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Section1