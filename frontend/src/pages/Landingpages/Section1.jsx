import { MoveRight, Plus, ChevronDown, ArrowUp } from 'lucide-react'
import React from 'react'

const Section1 = () => {
  return (
    <div className='mt-6 sm:mt-8 bg-[url("landingBg.svg")] bg-cover bg-center'>

      {/* top  */}
      <div className='flex flex-col gap-5 sm:gap-10'>

        <h1 className='text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-light leading-[1.33] lg:leading-[1.33] w-full lg:w-3xl'>
          From First Principles to Deep Research—Powered by AI.
        </h1>

        <button className='group flex items-center gap-8 sm:gap-12 lg:gap-20 border-b border-white py-2 px-2 w-fit cursor-pointer'>
          <p className='text-sm lg:text-[16px]'>Why avora</p>
          <div className='relative overflow-hidden w-6 h-6 flex items-center justify-center'>
            <MoveRight className='w-6 h-6 transition-transform duration-300 ease-in-out group-hover:translate-x-full' />
            <MoveRight className='w-6 h-6 absolute transition-transform duration-300 ease-in-out -translate-x-full group-hover:translate-x-0' />
          </div>
        </button>

      </div>

      {/* bottom  */}
      <div className='relative w-full max-w-250 mx-auto mt-60 sm:mt-24 lg:mt-32'>
        {/* Rotating Linear/Gradient Border Container with exact Figma Drop Shadow */}
        <div
          style={{ boxShadow: '0px 4px 153.4px -2px rgba(77, 116, 255, 0.2)' }}
          className='relative p-[1.5px] overflow-hidden rounded-2xl bg-white/5'
        >
          {/* Rotating Beam with #4D74FF */}
          <div className='absolute inset-[-150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_65%,#254cd9_78%,#4D74FF_88%,#9db5ff_96%,transparent_100%)]' />

          {/* Card Content */}
          <div className='relative w-full min-h-47.5 sm:min-h-55 lg:h-50 bg-[#08080a] rounded-[15px] p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-0'>
            <textarea
              placeholder='What do you want to learn today? e.g., Quantum Computing'
              rows={3}
              className='w-full bg-transparent text-white placeholder:text-zinc-500 text-sm sm:text-base outline-none resize-none focus:outline-none'
            />

            <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
              <div className='flex items-center gap-2'>
                <button className='flex items-center justify-center w-8 h-8 rounded-lg bg-[#18181b] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0'>
                  <Plus size={16} />
                </button>
                <button className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181b] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors cursor-pointer'>
                  <span>Think Deep</span>
                  <ChevronDown size={14} className='text-zinc-400' />
                </button>
              </div>

              <button className='w-9 h-9 rounded-xl bg-linear-to-b from-[#ff825c] to-[#4ac7ec] flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer shrink-0'>
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Section1