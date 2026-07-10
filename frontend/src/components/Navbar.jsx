import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`fixed top-0 left-[30px] right-[30px] z-50 transition-all duration-300 ${
      isScrolled 
        ? ' border-b border-white/10 py-3 px-5 shadow-lg' 
        : 'bg-transparent py-5 px-5 '
    }`}>
      <div className='w-full flex items-center justify-between h-12 lg:h-15'>
        {/* left - Logo */}
        <div className='flex gap-2 lg:gap-2.5 items-center'>
          <img src="/logo.svg" alt="logo" className='w-6 h-6 lg:w-auto lg:h-auto' />
          <h2 className='font-heading text-lg lg:text-2xl font-bold'>Avora</h2>
        </div>

        {/* right - desktop menu (visible only when not scrolled) */}
        <div className={isScrolled ? 'hidden' : 'hidden lg:block'}>
          <div className='flex gap-14 items-center'>
            <ul className='flex gap-8 items-center '>
              <li><a className='font-body font-light text-[16px] text-[#FF7B4D]' href="">Home</a></li>
              <li><a className='font-body font-light text-[16px] text-white/52' href="">About us</a></li>
              <li><a className='font-body font-light text-[16px] text-white/52' href="">How to use</a></li>
              <li><a className='font-body font-light text-[16px] text-white/52' href="">Pricing</a></li>
            </ul>

            <div className='flex gap-5 items-center'>
              <button className='px-6 py-4 rounded-[12px] border border-white cursor-pointer hover:bg-white/5 transition-colors'>Login</button>
              <button className='px-6 py-4 rounded-[12px] bg-[#FF7B4D] cursor-pointer hover:bg-[#ff6830] transition-colors'>Sign up</button>
            </div>
          </div>
        </div>

        {/* right - hamburger toggle (always visible on scroll, or on mobile when not scrolled) */}
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center justify-center w-9 h-9 text-white cursor-pointer ${
            isScrolled ? 'block' : 'lg:hidden block'
          }`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* dropdown menu (visible to all when scrolled, mobile-only when not scrolled) */}
      {open && (
        <div className={`absolute top-16 right-0 w-[220px] bg-black/95 border border-white/10 rounded-2xl p-5 flex flex-col gap-5 z-50 shadow-lg ${
          isScrolled ? 'block' : 'lg:hidden block'
        }`}>
          <ul className='flex flex-col gap-4'>
            <li><a className='font-body font-light text-[14px] text-[#FF7B4D]' href="">Home</a></li>
            <li><a className='font-body font-light text-[14px] text-white/52' href="">About us</a></li>
            <li><a className='font-body font-light text-[14px] text-white/52' href="">How to use</a></li>
            <li><a className='font-body font-light text-[14px] text-white/52' href="">Pricing</a></li>
          </ul>

          <div className='flex flex-col gap-3'>
            <button className='px-4 py-2.5 text-sm rounded-[12px] border border-white cursor-pointer hover:bg-white/5 transition-colors'>Login</button>
            <button className='px-4 py-2.5 text-sm rounded-[12px] bg-[#FF7B4D] cursor-pointer hover:bg-[#ff6830] transition-colors'>Sign up</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar