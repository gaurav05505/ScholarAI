import React from 'react'

const Navbar = () => {
  return (
    <div className="flex w-full justify-between items-center">
      {/* Logo */}
      <div>
        <p className="text-[24px] font-heading font-black">Avora</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-10 items-center">

        <div className="flex gap-8 text-white/52">
          <a
            href="#"
            className="nav-link"
          >
            Home
          </a>

          <a
            href="#"
            className="nav-link"
          >
            About
          </a>

          <a
            href="#"
            className="nav-link"
          >
            How to use
          </a>
        </div>

        {/* Button */}
        <button className="get-started">
          Get Started
        </button>

      </div>
    </div>
  )
}

export default Navbar