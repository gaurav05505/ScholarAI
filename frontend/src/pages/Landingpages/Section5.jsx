import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const Section5 = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="relative w-full bg-[#ececec] text-black font-sans overflow-hidden py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[540px] lg:min-h-[580px]">
        {/* Top Eyebrow / Tag */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-xs sm:text-[13px] text-zinc-500 font-normal tracking-wide">
            Our Service
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center my-auto py-8 sm:py-12">
          {/* Left Column: Headings and Description */}
          <div
            className={`lg:col-span-6 flex flex-col justify-between h-full space-y-6 lg:space-y-8 transition-all duration-700 delay-100 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="space-y-3 sm:space-y-4 max-w-[500px]">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-body font-medium text-zinc-500 tracking-tight">
                One Ecosystem. Total Clarity.
              </h3>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-light text-zinc-900 tracking-tight leading-snug lg:leading-[1.25]">
                Multi-agent AI that breaks down complex domains, synthesizes study materials, and adapts to your pace.
              </h2>
            </div>

            {/* Desktop CTA Link */}
            <div className="pt-2 hidden lg:block">
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 pb-1 border-b border-zinc-400 text-xs sm:text-[13px] text-zinc-700 hover:text-black hover:border-black transition-all duration-200 group cursor-pointer"
              >
                <span>Say hey to your learning friend</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual SVG */}
          <div
            className={`lg:col-span-6 flex justify-center lg:justify-end transition-all duration-700 delay-200 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
            }`}
          >
            <div className="w-full max-w-[560px] lg:max-w-none overflow-hidden shadow-sm">
              <img
                src="/section5.svg"
                alt="AI Learning Friend"
                className="w-full h-auto object-cover select-none pointer-events-none"
                loading="lazy"
              />
            </div>
          </div>

          {/* Mobile CTA Link (placed underneath image on smaller screens) */}
          <div className="block lg:hidden pt-2">
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 pb-1 border-b border-zinc-400 text-xs sm:text-[13px] text-zinc-700 hover:text-black hover:border-black transition-all duration-200 group cursor-pointer"
            >
              <span>Say hey to your learning friend</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section5
