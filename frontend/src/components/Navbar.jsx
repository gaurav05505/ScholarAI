import React, { useState, useEffect } from 'react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? ' py-6 px-2  shadow-md'
          : 'bg-transparent rounded-2xl py-4'
      }`}
    >
      <div className="flex w-full justify-between items-center">
        {/* Logo */}
        <div>
          <p className="text-[24px] font-heading font-black tracking-wider uppercase">
            Avora
          </p>
        </div>

        {/* Navigation */}
        {!scrolled ? (
          <div className="flex gap-10 items-center transition-all duration-300">
            <div className="flex gap-8 text-white/52">
              <a href="#" className="nav-link">
                Home
              </a>
              <a href="#" className="nav-link">
                About
              </a>
              <a href="#" className="nav-link">
                How to use
              </a>
            </div>

            {/* Button */}
            <button className="get-started">
              Get Started
            </button>
          </div>
        ) : (
          /* Scrolled - Menu Icon */
          <button
            type="button"
            className="cursor-pointer p-2 hover:opacity-80 transition-opacity flex items-center justify-center"
            aria-label="Open Menu"
          >
            <img src="/manu.svg" alt="Menu" className="w-10 sm:w-12 h-auto" />
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar