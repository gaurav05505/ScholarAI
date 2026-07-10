import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className='relative w-full'>
      <div className='h-12 lg:h-15 w-full flex items-center justify-between'>
        {/* left  */}
        <div className='flex gap-2 lg:gap-2.5 items-center'>
          <img src="/logo.svg" alt="logo" className='w-6 h-6 lg:w-auto lg:h-auto' />
          <h2 className='font-heading text-lg lg:text-2xl font-bold'>Avora</h2>
        </div>

        {/* right - desktop  */}
        <div className='hidden lg:block'>
          <div className='flex gap-14 items-center'>
            <ul className='flex gap-8 items-center '>
              <li><a className='font-body font-light text-[16px] text-[#FF7B4D]' href="">Home</a></li>
              <li><a className='font-body font-light text-[16px] text-white/52' href="">About us</a></li>
              <li><a className='font-body font-light text-[16px] text-white/52' href="">How to use</a></li>
              <li><a className='font-body font-light text-[16px] text-white/52' href="">Pricing</a></li>
            </ul>

            <div className='flex gap-5 items-center'>
              <button className='px-6 py-4 rounded-[12px] border border-white '>Login</button>
              <button className='px-6 py-4 rounded-[12px] bg-[#FF7B4D] '>Sign up</button>
            </div>
          </div>
        </div>

        {/* right - mobile hamburger  */}
        <button
          onClick={() => setOpen(!open)}
          className='lg:hidden flex items-center justify-center w-9 h-9 text-white'
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* mobile dropdown menu  */}
      {open && (
        <div className='lg:hidden absolute top-14 right-0 w-[220px] bg-black/95 border border-white/10 rounded-2xl p-5 flex flex-col gap-5 z-50 shadow-lg'>
          <ul className='flex flex-col gap-4'>
            <li><a className='font-body font-light text-[14px] text-[#FF7B4D]' href="">Home</a></li>
            <li><a className='font-body font-light text-[14px] text-white/52' href="">About us</a></li>
            <li><a className='font-body font-light text-[14px] text-white/52' href="">How to use</a></li>
            <li><a className='font-body font-light text-[14px] text-white/52' href="">Pricing</a></li>
          </ul>

          <div className='flex flex-col gap-3'>
            <button className='px-4 py-2.5 text-sm rounded-[12px] border border-white'>Login</button>
            <button className='px-4 py-2.5 text-sm rounded-[12px] bg-[#FF7B4D]'>Sign up</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar