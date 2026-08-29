import React from 'react'
import Navbar from '../components/Navbar'
import Section1 from './Landingpages/Section1'
import Section2 from './Landingpages/Section2'

const Home = () => {
  return (
    <div className='relative mx-8 my-4 flex flex-col '>
      <Navbar />
      <Section1 />
      <Section2 />
    </div>
  )
}

export default Home
