import React from 'react'
import Navbar from '../../components/Navbar'
import Searchbar from '../../components/Searchbar'
import { BrainCircuit, ChartBarStacked, FileText } from 'lucide-react'

const Section1 = () => {
  return (
    <div className=' p-5 h-screen w-full bg-[url(/landing-background.png)]  bg-cover  '>
      <Navbar />

      <div className='flex flex-col items-center gap-10'>
          <div className='flex flex-col items-center justify-center gap-8 mt-14'>
          {/* inside logo  */}
          <div className='flex gap-2.5 items-center justify-center w-fit px-8 py-1.5 rounded-full border border-white/10 '>
            <img src="/s-logo.svg" alt="" />
            <h1 className='text-[18px] font-heading font-semibold'>Avora</h1>
          </div>

          <div className='flex flex-col gap-5 items-center'>
            <h1 className='text-6xl font-body font-bold '>Learn, Study, and Research with AI</h1>
            <p className='text-[18px] font-body font-light text-white/52 '>Avora combines personalized learning, intelligent research, and AI guidance to help you master any topic with confidence.</p>
          </div>


        </div>

        <Searchbar /> 
      </div>

      <div className='flex gap-50 items-center  justify-center mt-16 '>
        {/* first learning  */}
        <div className='flex flex-col items-center gap-4 '>
          <BrainCircuit color='#FF7B4D' />
          <div className='w-[163px] flex flex-col gap-2.5'>
            <h2 className='text-[15px] font-body font-semibold text-center text-white/60 '>Personalized Learning</h2>
            <p className='text-[14px] font-body font-light text-center text-white/52 '>AI creates learning journeys tailored to your goals, experience, and pace.</p>
          </div>
        </div>

        {/* sec research  */}
        <div className='flex flex-col items-center gap-4   '>
          <ChartBarStacked color='#7CFF94' />
          <div className='w-[163px] flex flex-col gap-2.5'>
            <h2 className='text-[15px] font-body font-semibold text-center text-white/60 '>Intelligent Research</h2>
            <p className='text-[14px] font-body font-light text-center text-white/52 '>AI creates learning journeys tailored to your goals, experience, and pace.</p>
          </div>
        </div>

        {/* third resource  */}
        <div className='flex flex-col items-center gap-4 '>
          <FileText color='pink' />
          <div className='w-[163px] flex flex-col gap-2.5'>
            <h2 className='text-[15px] font-body font-semibold text-center text-white/60 '>Learn from Your Own Resources</h2>
            <p className='text-[14px] font-body font-light text-center text-white/52 '>Chat with your PDFs, notes, and saved resources.</p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Section1
