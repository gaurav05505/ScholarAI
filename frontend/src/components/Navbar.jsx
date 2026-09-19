import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'How to use', href: '/#workflow' },
]

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [isLightSection, setIsLightSection] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const tickingRef = useRef(false)

  const isLinkActive = useCallback(
    (href) => {
      if (href === '/') {
        return (
          location.pathname === '/' &&
          (!location.hash || location.hash === '#' || location.hash === '')
        )
      }
      if (href === '/about') {
        return location.pathname === '/about'
      }
      if (href.startsWith('/#') || href.startsWith('#')) {
        const targetHash = href.replace(/^\//, '')
        return location.pathname === '/' && location.hash === targetHash
      }
      return location.pathname === href
    },
    [location.pathname, location.hash]
  )

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
        const navHeight = 75

        lightSections.forEach((sec) => {
          const rect = sec.getBoundingClientRect()
          if (rect.top <= navHeight && rect.bottom >= 20) {
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out bg-transparent ${
        scrolled ? 'py-4 px-2' : 'py-5 px-2'
      }`}
    >
      <div className="flex w-full justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className={`text-[20px] sm:text-[24px] font-heading font-black tracking-wider uppercase transition-colors duration-300 cursor-pointer ${
            isLightSection ? 'text-black' : 'text-white'
          }`}
        >
          Avora
        </Link>

        {/* Full navigation - shown on desktop only while not scrolled */}
        <div
          className={`gap-8 lg:gap-10 items-center transition-all duration-300 ${
            scrolled ? 'hidden' : 'hidden md:flex'
          }`}
        >
          <div className="flex gap-6 lg:gap-8 items-center">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href)
              const isInternal = link.href.startsWith('/') && !link.href.includes('#')
              const linkClasses = `nav-link transition-colors duration-300 ${
                active ? 'active' : ''
              } ${isLightSection ? (active ? '!text-black font-semibold' : '!text-black/70 hover:!text-black') : ''}`

              return isInternal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={linkClasses}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={linkClasses}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
          <button
            onClick={() => navigate('/workspace')}
            className="get-started cursor-pointer"
          >
            Get Started
          </button>
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

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Floating Menu Dropdown Panel (Contained in one page/view, no whole-page scroll) */}
      <div
        id="mobile-menu"
        className={`absolute top-full right-4 left-4 sm:left-auto sm:right-6 sm:w-80 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? 'opacity-100 translate-y-2 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-full bg-[#0a0a0d]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-1.5">
          {/* Menu Links with active states */}
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href)
            const isInternal = link.href.startsWith('/') && !link.href.includes('#')
            const itemClasses = `group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 cursor-pointer ${
              active
                ? 'bg-white/10 text-white font-semibold shadow-inner'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`

            const linkContent = (
              <>
                <span>{link.label}</span>
                <span
                  className={`w-2 h-2 rounded-full bg-[#4D74FF] transition-all duration-200 ${
                    active
                      ? 'opacity-100 scale-100 shadow-[0_0_10px_#4D74FF]'
                      : 'opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_8px_#4D74FF]'
                  }`}
                />
              </>
            )

            return isInternal ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={closeMenu}
                className={itemClasses}
              >
                {linkContent}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className={itemClasses}
              >
                {linkContent}
              </a>
            )
          })}

          {/* Bottom Get Started Button */}
          <div className="pt-3 border-t border-white/10 mt-1">
            <button
              className="get-started w-full block text-center py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-300"
              onClick={() => {
                closeMenu()
                navigate('/workspace')
              }}
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