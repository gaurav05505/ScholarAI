import React from 'react'
import Navbar from '../components/Navbar'
import Section1 from './Landingpages/Section1'
import Section2 from './Landingpages/Section2'
import Section3 from './Landingpages/Section3'


const Home = () => {
  return (
    <div className='relative flex flex-col'>
      <Navbar />
      <Section1 />
      <Section2 /> 
      <Section3 /> 
    </div>
  )
}

export default Home