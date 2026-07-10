import React from 'react'
import Navbar from '../../components/Navbar'
import Searchbar from '../../components/Searchbar'
import { BrainCircuit, ChartBarStacked, FileText } from 'lucide-react'

const Section1 = () => {
  return (
    <div className='p-3 sm:p-5 h-screen w-full bg-[url(/landing-background.png)] bg-cover overflow-hidden'>
      <Navbar />

      <div className='flex flex-col items-center gap-4 sm:gap-6 lg:gap-10'>
        <div className='flex flex-col items-center justify-center gap-3 sm:gap-5 lg:gap-8 mt-6 sm:mt-10 lg:mt-14'>
          {/* inside logo  */}
          <div className='flex gap-2.5 items-center justify-center w-fit px-6 sm:px-8 py-1.5 rounded-full border border-white/10 '>
            <img src="/s-logo.svg" alt="" className='w-4 h-4 sm:w-5 sm:h-5' />
            <h1 className='text-[15px] sm:text-[18px] font-heading font-semibold'>Avora</h1>
          </div>

          <div className='flex flex-col gap-2 sm:gap-3 lg:gap-5 items-center'>
            <h1 className='text-[clamp(1.25rem,4.5vw,3.75rem)] lg:text-6xl font-body font-bold whitespace-nowrap leading-tight'>
              Learn, Study, and Research with AI
            </h1>
            <p className='text-[12px] sm:text-[14px] lg:text-[18px] font-body font-light text-white/52 text-center px-2'>
              Avora combines personalized learning, intelligent research, and AI guidance to help you master any topic with confidence.
            </p>
          </div>
        </div>

        <Searchbar />
      </div>

      <div className='flex gap-4 sm:gap-10 lg:gap-50 items-start justify-center mt-6 sm:mt-10 lg:mt-16'>
        {/* first learning  */}
        <div className='flex flex-col items-center gap-2 sm:gap-3 lg:gap-4'>
          <BrainCircuit color='#FF7B4D' size={18} className='sm:w-5 sm:h-5 lg:w-6 lg:h-6' />
          <div className='w-[85px] sm:w-[120px] lg:w-[163px] flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5'>
            <h2 className='text-[9px] sm:text-[12px] lg:text-[15px] font-body font-semibold text-center text-white/60 '>Personalized Learning</h2>
            <p className='hidden sm:block text-[10px] lg:text-[14px] font-body font-light text-center text-white/52 '>AI creates learning journeys tailored to your goals, experience, and pace.</p>
          </div>
        </div>

        {/* sec research  */}
        <div className='flex flex-col items-center gap-2 sm:gap-3 lg:gap-4'>
          <ChartBarStacked color='#7CFF94' size={18} className='sm:w-5 sm:h-5 lg:w-6 lg:h-6' />
          <div className='w-[85px] sm:w-[120px] lg:w-[163px] flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5'>
            <h2 className='text-[9px] sm:text-[12px] lg:text-[15px] font-body font-semibold text-center text-white/60 '>Intelligent Research</h2>
            <p className='hidden sm:block text-[10px] lg:text-[14px] font-body font-light text-center text-white/52 '>AI creates learning journeys tailored to your goals, experience, and pace.</p>
          </div>
        </div>

        {/* third resource  */}
        <div className='flex flex-col items-center gap-2 sm:gap-3 lg:gap-4'>
          <FileText color='pink' size={18} className='sm:w-5 sm:h-5 lg:w-6 lg:h-6' />
          <div className='w-[85px] sm:w-[120px] lg:w-[163px] flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5'>
            <h2 className='text-[9px] sm:text-[12px] lg:text-[15px] font-body font-semibold text-center text-white/60 '>Learn from Your Own Resources</h2>
            <p className='hidden sm:block text-[10px] lg:text-[14px] font-body font-light text-center text-white/52 '>Chat with your PDFs, notes, and saved resources.</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Section1