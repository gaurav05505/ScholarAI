import React from 'react'
import Navbar from '../../components/Navbar'

const Section1 = () => {
  return (
    <div className=' p-5 h-screen w-full bg-[url(/landing-background.png)] bg-cover '>
      <Navbar />

      <div>
        {/* inside logo  */}
        <div className='flex gap-2.5 items-center justify-center w-fit px-8 py-1.5 rounded-full border border-white/10 '>
          <img src="/s-logo.svg" alt="" />
          <h1 className='text-[18px] font-heading font-semibold'>Avora</h1>
        </div>

        <div className='flex flex-col gap-5 items-center'>
          <h1 className='text-6xl font-body'>Learn, Study, and Research with AI</h1>
          <p className='text-[20px] font-body font-light text-white/52 '>Avora combines personalized learning, intelligent research, and AI guidance to help you master any topic with confidence.</p>
        </div>


      </div>
    </div>
  )
}

export default Section1
