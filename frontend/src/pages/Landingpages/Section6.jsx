import React from 'react'
import ScrollReveal from '../../components/ScrollReveal'

const plans = [
  {
    name: 'Standard',
    description: 'Casual Exploration, Quick Roadmaps, And Testing Out The Platform.',
    price: '$0',
    originalPrice: '$10',
    cta: 'Start Free',
    ctaStyle: 'outline',
    recommended: false,
    features: [
      '3 Active Knowledge Trees / Month',
      'Standard Roadmap Generation (Beginner To Intermediate Depth)',
      'Basic AI Study Notes (Markdown Format)',
      'Standard Response Speed',
      'Community Support',
    ],
  },
  {
    name: 'Pro',
    description: 'Unlimited Dynamic Roadmaps, Adaptive Quiz Loops, And Full Note Synthesis.',
    price: '$12',
    originalPrice: '$20',
    cta: 'Upgrade To Pro',
    ctaStyle: 'filled',
    recommended: true,
    features: [
      'Unlimited Active Knowledge Trees',
      'Adaptive Learning Loops (Sub-Branching When You Get Stuck)',
      'Full Note Synthesis',
      'Active Recall Quiz Generator',
      'Priority Agent Processing',
    ],
  },
  {
    name: 'Researcher',
    description: 'For Academics, Deep-Tech Researchers, And Complex Paper Synthesis.',
    price: '$29',
    originalPrice: '$36',
    cta: 'Get Research Access',
    ctaStyle: 'outline',
    recommended: false,
    features: [
      'Everything In Pro Learner, Plus:',
      'Custom PDF & Paper RAG Ingestion (Upload Syllabi, Research Papers)',
      'Deep Research Depth',
      'Vector Search Over Notes',
      '1-On-1 Priority Support',
    ],
  },
]

const Section6 = () => {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28 lg:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
      {/* soft radial glow background */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* 1. Header Component Reveal */}
        <ScrollReveal className="flex flex-col items-center text-center mb-16" delay={0} duration={750}>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold text-neutral-300 tracking-tight mb-4">
            Pick Your Learning Depth
          </h2>
          <p className="max-w-xl text-neutral-500 text-[15px] leading-relaxed">
            Transparent pricing built for students, independent learners, and academic
            researchers. Start building your knowledge trees for free, then scale as you grow.
          </p>
        </ScrollReveal>

        {/* 2. Pricing Cards: Each reveals individually on scroll */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <ScrollReveal
              key={plan.name}
              delay={idx * 120}
              duration={750}
              scale={plan.recommended}
              className={
                plan.recommended
                  ? 'relative flex flex-col rounded-[28px] border border-indigo-400/20 bg-gradient-to-b from-black from-40% to-indigo-900/40 p-7 sm:p-8 md:-translate-y-2'
                  : 'relative flex flex-col rounded-2xl border border-white/10 bg-neutral-950 p-7 sm:p-8'
              }
            >
              {/* Plan name + badge */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                {plan.recommended && (
                  <span className="rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-medium tracking-wide text-white">
                    Recommended
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-semibold text-white">{plan.price}</span>
                <span className="text-base text-neutral-600 line-through">
                  {plan.originalPrice}
                </span>
              </div>

              {/* CTA */}
              <button
                type="button"
                className={
                  plan.ctaStyle === 'filled'
                    ? 'w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-colors py-3 text-sm font-medium text-white mb-7 cursor-pointer shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                    : 'w-full rounded-2xl border border-white/15 hover:bg-white/5 transition-colors py-3 text-sm font-medium text-white mb-7 cursor-pointer'
                }
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-300 mb-3">Features</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-500" />
                      <span className="text-sm text-neutral-400 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section6