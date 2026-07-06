import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

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
  </svg>
)

const LogoIcon = () => (
  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-[#1f1f1f] to-[#0a0a0a] border border-[#3a3a3a] flex items-center justify-center shadow-2xl shadow-black/80 mb-6">
    <svg width="36" height="36" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="11" stroke="#7a7a7a" strokeWidth="2" />
      <path d="M14 4 A10 10 0 0 1 24 14" stroke="#d4d4d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 24 A10 10 0 0 1 4 14" stroke="#8a8a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
)

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans text-white px-4">
      <CircuitLines />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #404040 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[720px] h-[720px] rounded-full bg-white/5 blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
        <LogoIcon />

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-[#a3a3a3] bg-clip-text text-transparent">
          DocAi Workspace
        </h1>

        <p className="text-[#a3a3a3] text-base md:text-lg max-w-md mb-10 leading-relaxed">
          Analyze research documents, query PDF catalogs, and generate customized roadmaps with our AI-powered assistant.
        </p>

        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <p className="text-[#d4d4d4] text-sm mb-2 font-medium">
              Logged in as <span className="text-white underline decoration-white/20 underline-offset-4">{user?.name || user?.email}</span>
            </p>
            <Link
              to="/workspace"
              className="w-full bg-[#e5e5e5] hover:bg-white active:bg-[#cfcfcf] text-[#080808] font-semibold py-3 px-6 rounded-lg text-sm transition-all duration-150 shadow-lg shadow-black/40 text-center"
            >
              Enter Workspace
            </Link>
            <button
              onClick={logout}
              className="w-full py-3 px-6 bg-[#111111] hover:bg-[#171717] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-lg text-sm text-[#a3a3a3] hover:text-white transition-all duration-150 cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm">
            <Link
              to="/login"
              className="flex-1 bg-[#e5e5e5] hover:bg-white active:bg-[#cfcfcf] text-[#080808] font-semibold py-3 px-6 rounded-lg text-sm transition-all duration-150 shadow-lg shadow-black/40 text-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex-1 py-3 px-6 bg-[#111111] hover:bg-[#171717] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-lg text-sm text-[#d4d4d4] hover:text-white transition-all duration-150 text-center"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
