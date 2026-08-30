import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'How to use', href: '#' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const tickingRef = useRef(false)

  // Throttled, passive scroll listener (avoids layout thrash / excess re-renders)
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
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
          ? 'py-6 px-2 shadow-md'
          : 'bg-transparent rounded-2xl py-4 px-2'
      }`}
    >
      <div className="flex w-full justify-between items-center">
        {/* Logo */}
        <p className="text-[20px] sm:text-[24px] font-heading font-black tracking-wider uppercase transition-all duration-300">
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
              <a key={link.label} href={link.href} className="nav-link">
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
              }`}
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
          className={`absolute top-0 right-0 h-full w-[78%] max-w-xs bg-neutral-950 shadow-xl flex flex-col pt-24 px-8 gap-2 transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="py-3 text-lg text-white/90 hover:text-white border-b border-white/10 transition-all duration-300"
              style={{
                transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
              }}
            >
              {link.label}
            </a>
          ))}

          <button
            className="get-started mt-6 w-full transition-all duration-300"
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
    </nav>
  )
}

export default Navbar