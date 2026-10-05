import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPlans, openRazorpayCheckout } from '../services/payment.service'

const staticPlanInfo = {
  pro: {
    id: 'pro',
    name: 'Pro Learner',
    badge: 'Most Popular',
    fallbackAmount: 49900,
    currency: 'INR',
    originalPrice: '₹999',
    durationDays: 30,
    description: 'Unlimited Dynamic Roadmaps, Adaptive Quiz Loops, and Priority AI processing.',
    features: [
      '50 High-Priority AI Chats / 30 Days',
      'Unlimited Active Knowledge Trees',
      'Adaptive Learning Loops (Sub-Branching)',
      'Full Note Synthesis & Export',
      'Active Recall Quiz Generator',
      'Priority Cloud Agent Processing',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Researcher / Academic',
    badge: 'Deep Tech & Academic',
    fallbackAmount: 79900,
    currency: 'INR',
    originalPrice: '₹1,499',
    durationDays: 30,
    description: 'For Academics, Deep-Tech Researchers, and Complex Paper Synthesis.',
    features: [
      'Unlimited AI Chats & Deep Ingestion',
      'Custom PDF & Paper RAG Ingestion (Syllabi, Papers)',
      'Vector Search Across All Personal Notes',
      'Deep Research Depth & Note Graphing',
      'First Access to New AI Models',
      '1-On-1 Priority Developer Support',
    ],
  },
}

const Checkout = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, token, isAuthenticated, refreshUser } = useAuth()

  const initialPlan = searchParams.get('plan') === 'premium' ? 'premium' : 'pro'
  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [serverPlans, setServerPlans] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true
    getPlans()
      .then((items) => {
        if (mounted && Array.isArray(items)) {
          setServerPlans(items)
        }
      })
      .catch(() => {
        // Use static fallback prices
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const planParam = searchParams.get('plan')
    if (planParam === 'premium' || planParam === 'pro') {
      setSelectedPlan(planParam)
    }
  }, [searchParams])

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId)
    setSearchParams({ plan: planId })
    setErrorMessage('')
  }

  const currentStatic = staticPlanInfo[selectedPlan] || staticPlanInfo.pro
  const currentServer = serverPlans.find((p) => p.id === selectedPlan)

  const formattedPrice = currentServer
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: currentServer.currency, maximumFractionDigits: 0 }).format(currentServer.amount / 100)
    : `₹${currentStatic.fallbackAmount / 100}`

  const handlePayment = async () => {
    if (!isAuthenticated || !token) {
      navigate(`/login?redirect=/checkout?plan=${selectedPlan}`)
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    await openRazorpayCheckout({
      plan: selectedPlan,
      token,
      user,
      onSuccess: async (res) => {
        setIsProcessing(false)
        setPaymentSuccess(true)
        try {
          await refreshUser()
        } catch (err) {
          console.warn('Could not refresh user immediately:', err)
        }
      },
      onError: (errMsg) => {
        setIsProcessing(false)
        setErrorMessage(errMsg || 'Payment was cancelled or failed. Please try again.')
      },
      onCancelled: () => {
        setIsProcessing(false)
        setErrorMessage('Checkout was cancelled. No charges were made.')
      },
    })
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-3xl" />

      {/* Top Header */}
      <header className="w-full border-b border-white/10 bg-neutral-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_0_12px_rgba(79,70,229,0.4)]">
              D
            </div>
            <span className="font-semibold text-lg tracking-tight text-neutral-100 group-hover:text-white transition-colors">
              DocAi <span className="text-xs text-indigo-400 font-normal px-2 py-0.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 ml-1">Payment</span>
            </span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 cursor-pointer"
          >
            &larr; Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
        {paymentSuccess ? (
          /* Payment Success Celebration Card */
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl border border-emerald-500/30 bg-neutral-950 shadow-[0_0_40px_rgba(16,185,129,0.15)] text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl mb-5 text-emerald-400">
              ✓
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
              Payment Verified
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to {currentStatic.name}!
            </h2>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Your 30-day access is now active. You have full access to higher chat limits, knowledge trees, and priority AI processing.
            </p>
            <button
              onClick={() => navigate('/workspace')}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] cursor-pointer"
            >
              Enter Workspace &rarr;
            </button>
          </div>
        ) : (
          /* Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Plan Customization & Benefits */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 block">
                  Secure Checkout
                </span>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                  Choose & Upgrade Plan
                </h1>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  Upgrade your workspace with advanced AI tutoring, comprehensive roadmap generation, and RAG document ingestion.
                </p>
              </div>

              {/* Plan Switcher Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pro Option */}
                <div
                  onClick={() => handleSelectPlan('pro')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPlan === 'pro'
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500'
                      : 'border-white/10 bg-neutral-950 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white text-base">Pro Learner</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Popular
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-2xl font-bold text-white">₹499</span>
                    <span className="text-xs text-neutral-500">/ 30 days</span>
                    <span className="text-xs text-neutral-600 line-through ml-1">₹999</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Ideal for students and developers building roadmaps and quiz recall.
                  </p>
                </div>

                {/* Premium Option */}
                <div
                  onClick={() => handleSelectPlan('premium')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPlan === 'premium'
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500'
                      : 'border-white/10 bg-neutral-950 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white text-base">Researcher</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Academic
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-2xl font-bold text-white">₹799</span>
                    <span className="text-xs text-neutral-500">/ 30 days</span>
                    <span className="text-xs text-neutral-600 line-through ml-1">₹1,499</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Custom paper ingestion, deep vector notes search, and priority support.
                  </p>
                </div>
              </div>

              {/* What is Included */}
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  What is included in {currentStatic.name}:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentStatic.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 text-center py-2">
                <div className="p-3 rounded-xl border border-white/5 bg-white/2">
                  <span className="text-base block mb-1">🔒</span>
                  <span className="text-[11px] font-medium text-neutral-300 block">256-Bit SSL</span>
                  <span className="text-[10px] text-neutral-500">Encrypted checkout</span>
                </div>
                <div className="p-3 rounded-xl border border-white/5 bg-white/2">
                  <span className="text-base block mb-1">⚡</span>
                  <span className="text-[11px] font-medium text-neutral-300 block">Instant Access</span>
                  <span className="text-[10px] text-neutral-500">Auto-activated</span>
                </div>
                <div className="p-3 rounded-xl border border-white/5 bg-white/2">
                  <span className="text-base block mb-1">🛡️</span>
                  <span className="text-[11px] font-medium text-neutral-300 block">Razorpay Verified</span>
                  <span className="text-[10px] text-neutral-500">Official gateway</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order & Billing Summary Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-7 rounded-3xl border border-white/15 bg-neutral-950 shadow-2xl sticky top-24">
                <h3 className="text-base font-semibold text-white mb-4 border-b border-white/10 pb-3">
                  Order Summary
                </h3>

                {/* Selected Plan Details */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {currentStatic.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      30-Day Full Access
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-white">
                      {formattedPrice}
                    </span>
                    <span className="text-xs text-neutral-500 block">/ 30 days</span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/3 mb-5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-400">Account:</span>
                    {isAuthenticated ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Logged In
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium">Guest (Sign in required)</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-white truncate">
                    {isAuthenticated ? (user?.email || user?.name || 'Active User') : 'You will be asked to sign in before completing payment'}
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs text-neutral-400 border-t border-white/10 pt-4 mb-4">
                  <div className="flex justify-between">
                    <span>Plan Subtotal</span>
                    <span className="text-white">{formattedPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-emerald-400">Limited-Time Offer Applied</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span className="text-white">Included</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-3">
                    <span>Total Due Today</span>
                    <span className="text-indigo-400 text-lg font-bold">{formattedPrice}</span>
                  </div>
                </div>

                {/* Error Notice */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs mb-4 leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                {/* Proceed Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayment}
                  className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-[0_0_25px_rgba(79,70,229,0.35)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : isAuthenticated ? (
                    `Proceed to Pay ${formattedPrice}`
                  ) : (
                    'Sign In & Proceed to Pay'
                  )}
                </button>

                <p className="text-[11px] text-neutral-500 text-center mt-4 leading-relaxed">
                  Secured by Razorpay. Includes immediate access to all features for 30 days. No hidden fees.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} DocAi Inc. All rights reserved. Powered by Razorpay.</p>
      </footer>
    </div>
  )
}

export default Checkout
