import React from 'react'
import Navbar from '../components/Navbar'
import Section1 from './Landingpages/Section1'
import Section2 from './Landingpages/Section2'
import Section3 from './Landingpages/Section3'
import Section4 from './Landingpages/Section4'
import Section5 from './Landingpages/Section5'
import Section6 from './Landingpages/Section6'
import Section7 from './Landingpages/Section7'

const Home = () => {
  return (
    <div className='relative flex flex-col'>
      <Navbar />
      <Section1 />
      <Section2 /> 
      <Section3 /> 
      <Section4 /> 
      <Section5 />
      <Section6 /> 
      <Section7 />
    </div>
  )
}

export default Home