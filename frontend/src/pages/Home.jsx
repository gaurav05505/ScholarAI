import React from 'react'
import Navbar from '../components/Navbar'
import Section1 from './Landingpages/Section1'


const Home = () => {
  return (
    <div className='relative mx-4 sm:mx-6 lg:mx-8 my-4 flex flex-col'>
      <Navbar />
      <Section1 />
    </div>
  )
}

export default Home