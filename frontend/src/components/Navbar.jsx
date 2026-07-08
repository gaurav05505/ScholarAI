import React from 'react'

const Navbar = () => {
  return (
    <div className='h-15 w-full flex items-center justify-between '>
        {/* left  */}
      <div className=' flex gap-2.5 items-center'>
        <img src="/logo.svg" alt="logo" />
        <h2 className=' font-heading text-2xl font-bold'>Avora</h2>
      </div>

      {/* right  */}
      <div>
        <div className='flex gap-14 items-center'>
          <ul className='flex gap-8 items-center '>
            <li><a className='font-body font-light text-[16px] text-[#FF7B4D]' href="">Home</a></li>
            <li><a  className='font-body font-light text-[16px] text-white/52' href="">About us</a></li>
            <li><a className='font-body font-light text-[16px] text-white/52' href="">How to use</a></li>
            <li><a className='font-body font-light text-[16px] text-white/52' href="">Pricing</a></li>
          </ul>

          <div className='flex gap-5 items-center'>
            <button className='px-6 py-4 rounded-[12px] border border-white '>Login</button>
            <button className='px-6 py-4 rounded-[12px] bg-[#FF7B4D] '>Sign up</button>
          </div>

        </div>



        <div></div>
      </div>
    </div>
  )
}

export default Navbar
