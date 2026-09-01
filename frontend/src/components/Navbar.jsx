import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'How to use', href: '#' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isLightSection, setIsLightSection] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const tickingRef = useRef(false)

  // Scroll listener: detects scrolled state and light/dark section background
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)

        // Check if navbar is currently over a light/white section
        const lightSections = document.querySelectorAll('[data-theme="light"]')
        let overLight = false
        const navHeight = 80

        lightSections.forEach((sec) => {
          const rect = sec.getBoundingClientRect()
          if (rect.top <= navHeight && rect.bottom >= navHeight) {
            overLight = true
          }
        })

        setIsLightSection(overLight)
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${
        scrolled
          ? 'py-6 px-2 '
          : 'bg-transparent rounded-2xl py-4 px-2'
      }`}
    >
      <div className="flex w-full justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <p
          className={`text-[20px] sm:text-[24px] font-heading font-black tracking-wider uppercase transition-colors duration-300 ${
            isLightSection ? 'text-black' : 'text-white'
          }`}
        >
          Avora
        </p>

        {/* Full navigation - shown on desktop only while not scrolled */}
        <div
          className={`gap-8 lg:gap-10 items-center transition-all duration-300 ${
            scrolled ? 'hidden' : 'hidden md:flex'
          }`}
        >
          <div className="flex gap-6 lg:gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`nav-link transition-colors duration-300 ${
                  isLightSection ? '!text-black/70 hover:!text-black' : ''
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <button className="get-started">Get Started</button>
        </div>

        {/* Menu toggle - always shown on mobile, shown on desktop once scrolled */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`relative z-50 cursor-pointer p-2 hover:opacity-70 active:scale-90 transition-all duration-200 items-center justify-center ${
            scrolled ? 'flex' : 'flex md:hidden'
          }`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="relative w-8 h-6 flex items-center justify-center">
            <img
              src="/manu.svg"
              alt="Menu"
              className={`w-8 h-auto transition-all duration-300 ${
                menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              } ${isLightSection && !menuOpen ? 'brightness-0' : 'brightness-100'}`}
            />
            <X
              className={`absolute inset-0 m-auto w-6 h-6 text-white transition-all duration-300 ${
                menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Menu overlay - opens whenever the hamburger is active (mobile always, desktop when scrolled) */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          id="mobile-menu"
          className={`absolute top-0 right-0 h-full w-[80%] max-w-xs bg-neutral-950/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col justify-between pt-24 pb-8 px-8 transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Links with hover states and animation */}
          <div className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="group flex items-center justify-between py-4 text-lg text-zinc-300 hover:text-white hover:translate-x-1.5 border-b border-white/10 transition-all duration-200"
                style={{
                  transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
                }}
              >
                <span className="group-hover:text-white transition-colors">{link.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4D74FF] opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-[0_0_8px_#4D74FF]" />
              </a>
            ))}
          </div>

          {/* Bottom Get Started Button */}
          <div className="mt-auto pt-8">
            <button
              className="get-started w-full block text-center cursor-pointer transition-all duration-300"
              style={{
                transitionDelay: menuOpen ? `${NAV_LINKS.length * 60 + 100}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
              }}
              onClick={closeMenu}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar