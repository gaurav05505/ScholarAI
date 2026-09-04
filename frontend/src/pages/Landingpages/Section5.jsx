import React from 'react'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'

const Section5 = () => {
  return (
    <section
      data-theme="light"
      className="relative w-full bg-[#ececec] text-black font-sans overflow-hidden py-20 sm:py-28 lg:py-32 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[540px] lg:min-h-[580px]">
        {/* Top Eyebrow / Tag */}
        <ScrollReveal delay={0} duration={650}>
          <span className="text-xs sm:text-[13px] text-zinc-500 font-normal tracking-wide">
            Our Service
          </span>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center my-auto py-8 sm:py-12">
          {/* Left Column: Headings and Description */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6 lg:space-y-8">
            <ScrollReveal delay={100} duration={750} className="space-y-3 sm:space-y-4 max-w-[500px]">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-body font-medium text-zinc-500 tracking-tight">
                One Ecosystem. Total Clarity.
              </h3>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-light text-zinc-900 tracking-tight leading-snug lg:leading-[1.25]">
                Multi-agent AI that breaks down complex domains, synthesizes study materials, and adapts to your pace.
              </h2>
            </ScrollReveal>

            {/* Desktop CTA Link */}
            <ScrollReveal delay={180} duration={700} className="pt-2 hidden lg:block">
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
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Visual SVG */}
          <ScrollReveal delay={150} duration={800} scale={true} className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[560px] lg:max-w-none overflow-hidden shadow-sm">
              <img
                src="/section5.svg"
                alt="AI Learning Friend"
                className="w-full h-auto object-cover select-none pointer-events-none"
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          {/* Mobile CTA Link (placed underneath image on smaller screens) */}
          <ScrollReveal delay={200} duration={700} className="block lg:hidden pt-2">
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default Section5
