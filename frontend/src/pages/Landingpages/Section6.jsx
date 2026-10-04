import React, { useEffect, useState } from 'react'
import ScrollReveal from '../../components/ScrollReveal'
import { getPlans, openRazorpayCheckout } from '../../services/payment.service.js'
import { useAuth } from '../../context/AuthContext.jsx'

const plans = [
  {
    id: 'free',
    name: 'Standard',
    description: 'Casual Exploration, Quick Roadmaps, And Testing Out The Platform.',
    cta: 'Included',
    ctaStyle: 'outline',
    recommended: false,
    features: [
      '2 AI Tutor Chats Per Week',
      'Standard Roadmap Generation (Beginner To Intermediate Depth)',
      'Basic AI Study Notes (Markdown Format)',
      'Standard Response Speed',
      'Community Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Unlimited Dynamic Roadmaps, Adaptive Quiz Loops, And Full Note Synthesis.',
    cta: 'Upgrade To Pro',
    ctaStyle: 'filled',
    recommended: true,
    features: [
      '50 AI Tutor Chats Per 30 Days',
      'Adaptive Learning Loops (Sub-Branching When You Get Stuck)',
      'Full Note Synthesis',
      'Active Recall Quiz Generator',
      'Priority Agent Processing',
    ],
  },
  {
    id: 'premium',
    name: 'Researcher',
    description: 'For Academics, Deep-Tech Researchers, And Complex Paper Synthesis.',
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
  const { user, token, refreshUser } = useAuth()
  const [serverPlans, setServerPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [processingPlan, setProcessingPlan] = useState(null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let mounted = true
    getPlans().then((items) => { if (mounted) setServerPlans(items) })
      .catch(() => { if (mounted) setNotice({ type: 'error', text: 'Pricing is unavailable right now. Please refresh and try again.' }) })
      .finally(() => { if (mounted) setLoadingPlans(false) })
    return () => { mounted = false }
  }, [])

  const handleUpgrade = async (planId) => {
    if (processingPlan) return
    if (!token) {
      setNotice({ type: 'error', text: 'Sign in to purchase a plan.' })
      return
    }
    setProcessingPlan(planId)
    setNotice({ type: 'processing', text: 'Preparing secure checkout…' })
    await openRazorpayCheckout({
      plan: planId,
      token,
      user,
      onSuccess: async (result) => {
        try {
          await refreshUser()
          setNotice({ type: 'success', text: result.message || 'Payment verified. Your plan is active.' })
        } catch {
          setNotice({ type: 'success', text: 'Payment verified. Refresh the page to load your updated plan.' })
        } finally {
          setProcessingPlan(null)
        }
      },
      onError: async (message) => {
        setNotice({ type: 'error', text: message })
        setProcessingPlan(null)
        try { await refreshUser() } catch { /* Keep the last known user state when the network is unavailable. */ }
      },
      onCancelled: () => {
        setNotice({ type: 'cancelled', text: 'Checkout cancelled. Your plan has not changed.' })
        setProcessingPlan(null)
      },
    })
  }

  const subscription = user?.subscription
  const currentPlan = subscription?.plan !== 'free' && subscription?.status === 'active' && subscription?.endDate && new Date(subscription.endDate) > new Date()
    ? subscription.plan
    : 'free'
  const formatPrice = (amount, currency) => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount / 100)

  return (
    <section className="relative w-full bg-black py-20 sm:py-28 lg:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
      {/* soft radial glow background */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-125 w-200 rounded-full bg-white/2 blur-3xl" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, idx) => {
            const planConfig = serverPlans.find((item) => item.id === plan.id)
            return (
            <ScrollReveal
              key={plan.name}
              delay={idx * 120}
              duration={750}
              scale={plan.recommended}
              className={
                plan.recommended
                  ? 'relative flex flex-col rounded-2xl border border-indigo-400/20 bg-linear-to-b from-neutral-900/90 via-neutral-950 to-indigo-950/40 p-8 sm:p-9 shadow-[0_0_16px_rgba(79,70,229,0.18)] z-10'
                  : 'relative flex flex-col rounded-2xl border border-white/10 bg-neutral-950 p-7 sm:p-8 md:mt-8'
              }
            >
              {/* Plan name + badge */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                {currentPlan === plan.id ? (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Current plan</span>
                ) : plan.recommended && (
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
              <div className="mb-6">
                <span className="text-3xl font-semibold text-white">
                  {loadingPlans ? '…' : plan.id === 'free' ? 'Free' : planConfig ? formatPrice(planConfig.amount, planConfig.currency) : 'Unavailable'}
                </span>
                {plan.id !== 'free' && <span className="ml-2 text-sm text-neutral-500">/ 30 days</span>}
                <p className="mt-1 text-xs text-neutral-600">{plan.id === 'free' ? 'No billing' : 'One-time purchase · 30-day access'}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {planConfig?.weeklyChatLimit ? `${planConfig.weeklyChatLimit} AI chats per week` : planConfig?.monthlyChatLimit ? `${planConfig.monthlyChatLimit} AI chats per 30 days` : plan.id === 'premium' && planConfig ? 'Unlimited AI chats' : ''}
                </p>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => plan.id !== 'free' && handleUpgrade(plan.id)}
                disabled={loadingPlans || (plan.id !== 'free' && !planConfig) || !!processingPlan || currentPlan === plan.id || plan.id === 'free'}


                className={(
                  plan.ctaStyle === 'filled'
                    ? 'w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-colors py-3 text-sm font-medium text-white mb-7 cursor-pointer shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                  : 'w-full rounded-2xl border border-white/15 hover:bg-white/5 transition-colors py-3 text-sm font-medium text-white mb-7 cursor-pointer'
                ) + ' disabled:opacity-50 disabled:cursor-not-allowed'}
              >
                {processingPlan === plan.id ? 'Processing…' : currentPlan === plan.id ? 'Current plan' : plan.id === 'free' ? plan.cta : plan.cta}
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
          )})}
        </div>
        {notice && <p role="status" aria-live="polite" className={`mx-auto mt-8 max-w-2xl rounded-xl border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-300' : notice.type === 'error' ? 'border-rose-400/20 bg-rose-400/5 text-rose-300' : 'border-white/10 bg-white/5 text-neutral-300'}`}>{notice.text}</p>}
      </div>
    </section>
  )
}

export default Section6
