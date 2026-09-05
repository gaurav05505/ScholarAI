import React from 'react'
import ScrollReveal from '../../components/ScrollReveal'

// Custom LinkedIn SVG icon
const LinkedInIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
)

// Custom X (Twitter) SVG icon
const TwitterXIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Custom Sun/Hub Community SVG icon
const CommunityHubIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M3 12h3" />
    <path d="M18 12h3" />
    <path d="m5.6 5.6 2.1 2.1" />
    <path d="m16.3 16.3 2.1 2.1" />
    <path d="m5.6 18.4 2.1-2.1" />
    <path d="m16.3 7.7 2.1-2.1" />
  </svg>
)

const Footer = () => {
  return (
    <footer className="relative w-full bg-black text-white font-sans overflow-hidden border-white/10">
      {/* ================= TOP GIANT BRAND HEADER ================= */}
      <ScrollReveal
        delay={0}
        duration={850}
        scale={true}
        className="w-full py-16 sm:py-24 lg:py-32 flex items-center justify-center border-b border-white/10 select-none"
      >
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[150px] font-body
        r font-black tracking-widest text-white uppercase text-center leading-none">
          AVORA
        </h1>
      </ScrollReveal>

      {/* ================= 4-COLUMN MAIN FOOTER GRID ================= */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        {/* Column 1: Mission & CTA */}
        <ScrollReveal
          delay={50}
          duration={750}
          className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8"
        >
          <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed max-w-[240px] font-normal">
            Discover resources, explore new ideas, and build the knowledge you need for your next step.
          </p>

          <div>
            <button
              type="button"
              className="get-started cursor-pointer text-xs sm:text-sm font-semibold !py-3 !px-7"
            >
              Get started
            </button>
          </div>
        </ScrollReveal>

        {/* Column 2: Quick Links */}
        <ScrollReveal
          delay={120}
          duration={750}
          className="p-8 sm:p-10 lg:p-12 flex flex-col space-y-6"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">
            Quick Links
          </span>

          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#workflow"
                className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                WorkFlow
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Pricing
              </a>
            </li>
          </ul>
        </ScrollReveal>

        {/* Column 3: Company */}
        <ScrollReveal
          delay={190}
          duration={750}
          className="p-8 sm:p-10 lg:p-12 flex flex-col space-y-6"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">
            Company
          </span>

          <ul className="space-y-4">
            <li>
              <a
                href="#about"
                className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#book-call"
                className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Book A Call
              </a>
            </li>
          </ul>
        </ScrollReveal>

        {/* Column 4: Social Media */}
        <ScrollReveal
          delay={260}
          duration={750}
          className="p-8 sm:p-10 lg:p-12 flex flex-col space-y-6"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">
            Social Media
          </span>

          <div className="flex items-center gap-5 pt-1">
            <a
              href="https://www.linkedin.com/in/gaurav-829829349/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <LinkedInIcon size={19} />
            </a>

            <a
              href="https://hub.avora.ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Community Hub"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <CommunityHubIcon size={19} />
            </a>

            <a
              href="https://x.com/GAURAV79401139"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <TwitterXIcon size={17} />
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* ================= BOTTOM COPYRIGHT ROW ================= */}
      <ScrollReveal
        delay={320}
        duration={650}
        yOffset={10}
        className="w-full px-8 mb-10 sm:px-10 lg:px-12 py-6 flex items-center justify-between text-xs text-zinc-500 font-mono"
      >
        <p>© 2026 Avora. All rights reserved.</p>
      </ScrollReveal>
    </footer>
  )
}

export default Footer
