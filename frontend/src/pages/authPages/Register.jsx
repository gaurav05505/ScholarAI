import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { registerSchema } from '../../schemas/auth.schema.js'
import { registerUser } from '../../services/auth.service.js'

const CircuitLines = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="20" y="72" width="80" height="36" rx="4" fill="none" stroke="#2b2b2b" strokeWidth="1.5" />
    <circle cx="115" cy="90" r="3" fill="#525252" />
    <line x1="115" y1="90" x2="320" y2="90" stroke="#2b2b2b" strokeWidth="1" />
    <line x1="320" y1="90" x2="370" y2="140" stroke="#2b2b2b" strokeWidth="1" />

    <rect x="calc(100% - 100px)" y="72" width="80" height="36" rx="4" fill="none" stroke="#2b2b2b" strokeWidth="1.5" />
    <circle cx="calc(100% - 115px)" cy="90" r="3" fill="#525252" />
    <line x1="calc(100% - 115px)" y1="90" x2="calc(100% - 320px)" y2="90" stroke="#2b2b2b" strokeWidth="1" />
    <line x1="calc(100% - 320px)" y1="90" x2="calc(100% - 370px)" y2="140" stroke="#2b2b2b" strokeWidth="1" />

    <rect x="20" y="calc(100% - 108px)" width="80" height="36" rx="4" fill="none" stroke="#2b2b2b" strokeWidth="1.5" />
    <circle cx="115" cy="calc(100% - 90px)" r="3" fill="#525252" />
    <line x1="115" y1="calc(100% - 90px)" x2="320" y2="calc(100% - 90px)" stroke="#2b2b2b" strokeWidth="1" />
    <line x1="320" y1="calc(100% - 90px)" x2="370" y2="calc(100% - 140px)" stroke="#2b2b2b" strokeWidth="1" />

    <rect x="calc(100% - 100px)" y="calc(100% - 108px)" width="80" height="36" rx="4" fill="none" stroke="#2b2b2b" strokeWidth="1.5" />
    <circle cx="calc(100% - 115px)" cy="calc(100% - 90px)" r="3" fill="#525252" />
    <line x1="calc(100% - 115px)" y1="calc(100% - 90px)" x2="calc(100% - 320px)" y2="calc(100% - 90px)" stroke="#2b2b2b" strokeWidth="1" />
    <line x1="calc(100% - 320px)" y1="calc(100% - 90px)" x2="calc(100% - 370px)" y2="calc(100% - 140px)" stroke="#2b2b2b" strokeWidth="1" />
  </svg>
)

const LogoIcon = () => (
  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-[#1f1f1f] to-[#0a0a0a] border border-[#3a3a3a] flex items-center justify-center shadow-lg shadow-black/40">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="11" stroke="#7a7a7a" strokeWidth="2" />
      <path d="M14 4 A10 10 0 0 1 24 14" stroke="#d4d4d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 24 A10 10 0 0 1 4 14" stroke="#8a8a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M20.5 12.2c0-.6-.05-1.1-.14-1.6H12v3.1h4.8c-.2 1.1-.9 2-1.8 2.6v2.2h2.9c1.7-1.5 2.6-3.7 2.6-6.3z" fill="#d4d4d4" />
    <path d="M12 22c2.7 0 5-0.9 6.7-2.4l-2.9-2.2c-.8.5-1.8.8-3 .8-2.3 0-4.3-1.5-5-3.6H4.8v2.3C6.4 19.5 8.9 22 12 22z" fill="#9a9a9a" />
    <path d="M7 13.2c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.2H4.8C4.3 8.3 4 9.6 4 11s.3 2.7.8 3.8l2.2-1.6V13.2z" fill="#737373" />
    <path d="M12 5c1.5 0 2.8.5 3.8 1.4l2.9-2.9C17.1 2 14.8 1 12 1 8.9 1 6.4 3.5 4.8 6.8L7 8.4C7.7 6.3 9.7 5 12 5z" fill="#bdbdbd" />
  </svg>
)

const Register = () => {
  
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },        
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }

      const response = await registerUser(payload)

      console.log(response)

      reset()
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden font-sans">
      <CircuitLines />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #404040 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[620px] h-[620px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <form
        onSubmit={handleSubmit(onSubmit)}
         className="bg-[#0b0b0b]/95 border border-[#272727] rounded-2xl px-8 py-10 shadow-2xl shadow-black/60 backdrop-blur">
          {/* Logo row */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex gap-[3px]">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#3f3f3f]" />
              ))}
            </div>
            <LogoIcon />
            <div className="flex gap-[3px]">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#3f3f3f]" />
              ))}
            </div>
          </div>

          <h1 className="text-white text-2xl font-semibold text-center tracking-tight mb-1">
            Create Account
          </h1>
          <p className="text-[#a3a3a3] text-sm text-center mb-7">
            Already have an account?{' '}
            <a href="#" className="text-[#e5e5e5] font-medium hover:text-white transition-colors">
              Sign in
            </a>
          </p>

          {/* Name field */}
          <div className="relative mb-3">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
            type="text"
            placeholder="Full name"
            {...register('name')}
            className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#8a8a8a] focus:ring-1 focus:ring-[#8a8a8a] transition-colors"
          />

          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </p>
          )}
          </div>

          {/* Email field */}
          <div className="relative mb-3">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email address"
              {...register('email')}
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#8a8a8a] focus:ring-1 focus:ring-[#8a8a8a] transition-colors"
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="relative mb-5">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
            className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#8a8a8a] focus:ring-1 focus:ring-[#8a8a8a] transition-colors"
          />

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#e5e5e5] hover:bg-white active:bg-[#cfcfcf] text-[#080808] font-medium py-3 rounded-lg text-sm transition-colors duration-150 shadow-lg shadow-black/40 mb-5 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <button className="w-full bg-[#e5e5e5] hover:bg-white active:bg-[#cfcfcf] text-[#080808] font-medium py-3 rounded-lg text-sm transition-colors duration-150 shadow-lg shadow-black/40 mb-5">
            Create Account
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#262626]" />
            <span className="text-[#737373] text-xs uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#262626]" />
          </div>

          <button
            aria-label="Sign up with Google"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#111111] border border-[#2a2a2a] rounded-lg text-[#d4d4d4] hover:border-[#454545] hover:bg-[#171717] transition-colors duration-150"
          >
            <GoogleIcon />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register