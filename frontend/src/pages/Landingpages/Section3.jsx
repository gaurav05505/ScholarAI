import React from 'react'
import { ArrowRight } from 'lucide-react'

const featureRows = [
  {
    title: 'Personalized Roadmaps',
    description:
      'Every learner is different. Avora creates a personalized roadmap based on your goals, current knowledge, and learning pace, giving you a clear path from where you are to where you want to be.',
  },
  {
    title: 'AI-Powered Research',
    description:
      'Spend less time searching and more time learning. Avora researches trusted articles, videos, documentation, and learning resources, then organizes them into one place.',
  },
  {
    title: 'Smart Learning Workspace',
    description:
      'Keep your roadmaps, notes, research, and AI conversations together in one intelligent workspace. Everything you learn stays connected and easy to revisit.',
  },
]

const Section3 = () => {
  return (
    <section className="snap-start bg-[#050505] p-5">
      <div className="relative min-h-[calc(100vh-2.5rem)] overflow-hidden rounded-[28px] border border-white/15 bg-black px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_68%,transparent_100%)]" />

        <div className="relative z-10">
          <header className="grid grid-cols-1 items-center gap-6 border-b border-white/10 pt-6 pb-10 lg:grid-cols-[minmax(0,0.33fr)_1fr] lg:gap-10 lg:pt-10 lg:pb-12">
            <h2 className="text-[48px] font-black tracking-tight text-white sm:text-[54px] lg:text-[60px]">
              Why Avora?
            </h2>

            <div className="flex items-start gap-0 lg:items-center lg:gap-8">
              <span className="hidden h-24 w-px bg-white/70 lg:block" />
              <p className="max-w-2xl text-[18px] leading-tight text-white/50">
                Everything you need to learn, research, and grow—
                <br className="hidden sm:block" />
                all in one intelligent workspace.
              </p>
            </div>
          </header>

          <div className="divide-y divide-white/10">
            {featureRows.map((feature) => (
              <article
                key={feature.title}
                className="group grid grid-cols-1 items-center gap-6 pl-5 py-14 transition-colors duration-300 hover:bg-white/[0.03] sm:py-16 lg:min-h-[240px] lg:grid-cols-[minmax(0,0.33fr)_minmax(0,1fr)_minmax(0,0.16fr)] lg:gap-10 lg:py-0"
              >
                <div className="lg:pr-10">
                  <h3 className="text-[24px] font-bold text-white transition-transform duration-300 ease-out group-hover:translate-x-1 sm:text-[25px]">
                    {feature.title}
                  </h3>
                </div>

                <div className="lg:border-l lg:border-white/10 lg:pl-16">
                  <p className="max-w-3xl text-[18px] leading-tight text-white/50 transition-colors duration-300 ease-out group-hover:text-white/65">
                    {feature.description}
                  </p>
                </div>

                <div className="hidden items-center justify-center lg:flex lg:border-l lg:border-white/10">
                  <ArrowRight
                    aria-hidden="true"
                    size={44}
                    strokeWidth={1.6}
                    className="text-white transition-transform duration-300 ease-out group-hover:translate-x-2"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section3
