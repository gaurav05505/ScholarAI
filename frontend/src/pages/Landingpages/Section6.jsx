import React from 'react'

const plans = [
  {
    name: 'Standard',
    description: 'Casual exploration, quick roadmaps, and testing out the platform.',
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
    description: 'Unlimited dynamic roadmaps, adaptive quiz loops, and full note synthesis.',
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
    description: 'For academics, deep-tech researchers, and complex paper synthesis.',
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
    <section className="relative w-full bg-black py-24 px-6 overflow-hidden">
      {/* soft radial glow background */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
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
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.recommended
                  ? 'relative flex flex-col rounded-[28px] border border-indigo-400/20 bg-gradient-to-b from-black from-40% to-indigo-900/40 p-7'
                  : 'relative flex flex-col rounded-2xl border border-white/10 bg-neutral-950 p-7'
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
                    ? 'w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors py-2.5 text-sm font-medium text-white mb-7'
                    : 'w-full rounded-lg border border-white/15 hover:bg-white/5 transition-colors py-2.5 text-sm font-medium text-white mb-7'
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section6