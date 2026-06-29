import React from 'react'
import { Eclipse, MessageCircle, MessageSquareDot, MessagesSquare, StepBack } from 'lucide-react';
import Button from '../components/Button';

const Workspace = () => {
  return (
    <div className='h-screen w-full bg-white text-[#1E1E1E] p-2.5' >

      {/* header */}
      <div className='flex items-center justify-between mb-2.5'>


        <div className='flex gap-5 items-center'> 
            <div className='flex gap-20 items-center'>
              {/* logo  */}
              <div className='flex gap-1 items-end'>
                <img src="logo.svg" alt="logo" />
                <a className='text-2xl font-body font-medium  ' href="#">ScolarAi</a>
              </div>

              <StepBack size={20} color='#1E1E1E' />

            </div>


            {/* menu  */}
            <div>
              <ul className='px-5 py-1.5 bg-[#EAF2CF] rounded-full w-fit flex gap-3 items-center '>
                <a className='px-6 py-3.5 text-[#1E1E1E]' href="">Source</a>
                <a className='px-6 py-3.5 text-[#1E1E1E] bg-white rounded-full' href="">Ai Chats</a>
                <a className='px-6 py-3.5 text-[#1E1E1E]' href="">Roadmap</a>
                <a className='px-6 py-3.5 text-[#1E1E1E]' href="">Important question</a>
              </ul>
            </div>

        </div>


        <div className='flex gap-4 items-center px-3 py-1 rounded-full w-fit bg-[#EAF2CF] '>
          <Eclipse />
          <MessageSquareDot />

          {/* user profile pic or by default name first letter */}
          <div className='h-12 w-12 rounded-full bg-black/10 '>

          </div>

        </div>


      </div>

      {/* body  */}
      <div>

        {/* left */}
        <div className='w-70 py-5 px-2.5 text-[#1E1E1E] font-body font-normal h-170 rounded-3xl bg-[#EAF2CF]'>
          <button className='text-[16px] flex gap-3 p-4 bg-white w-full rounded-2xl items-center '>
            <MessagesSquare size={20} color='#1E1E1E' />
            New Chat
          </button>


        {/* features */}
        <div className='mt-6'>
          <p className='text-[18px]  text-black/52 mb-4 '>Features</p>
          <div className='flex flex-col gap-1'>
            <Button text="All Chats"
            icon={MessageCircle} />

            <Button text="All Chats"
            icon={MessageCircle} />

            <Button text="All Chats"
            icon={MessageCircle} />
          </div>
        </div>


        {/* features */}
        <div className='mt-6'>
          <p className='text-[18px]  text-black/52 mb-4 '>Recent History</p>
          <div className='flex flex-col gap-1'>
            <Button text="All Chats"
            icon={MessageCircle} />

            <Button text="All Chats"
            icon={MessageCircle} />

            <Button text="All Chats"
            icon={MessageCircle} />
          </div>
        </div>

        </div>
        

        {/* right  */}
        <div></div>

      </div>

    </div>
  )
}

export default Workspace
