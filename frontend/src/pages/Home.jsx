import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Section1 from './Landingpages/Section1.jsx'
import Section2 from './Landingpages/Section2.jsx'
import Section3 from './Landingpages/Section3.jsx'
import Section4 from './Landingpages/Section4.jsx'
import Section5 from './Landingpages/Section5.jsx'
import Section6 from './Landingpages/Section6.jsx'
import Section7 from './Landingpages/Section7.jsx'
import Footer from './Landingpages/Footer.jsx'

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
      <Footer />
    </div>
  )
}

export default Home