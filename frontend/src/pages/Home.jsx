import React from 'react'
import Navbar from '../components/Navbar'
import Section1 from './Landingpages/Section1'
import Section2 from './Landingpages/Section2'

const Home = () => {
  return (
    <div className='relative'>
      <Navbar />
      <Section1 />
      <Section2 />
    </div>
  )
}

export default Home
