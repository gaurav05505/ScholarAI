import React from 'react'
import Navbar from '../components/Navbar'
import Section1 from './Landingpages/Section1'
import Section2 from './Landingpages/Section2'
import Section3 from './Landingpages/Section3'
import Section4 from './Landingpages/Section4'

const Home = () => {
  return (
    <div className='relative'>
      <Navbar />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </div>
  )
}

export default Home
