import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'About', to: '/about' },
  { label: 'Enroll', to: '/enroll' },
  { label: 'Workshop', to: '/workshop' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-[#1f2a44] bg-[#070a13]/95 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="container-primary flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center rounded-xl p-2" aria-label="academy.sploitsystems.com home">
          <img src={logo} alt="academy.sploitsystems.com logo" className="mr-3 h-10 w-10 md:h-12 md:w-12" />
          <div>
            <p className="font-['Orbitron'] text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Academy
            </p>
            <p className="text-xs text-[#a8b0c3]">sploitsystems.com</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-base transition ${isActive ? 'text-[#ff5a1f]' : 'text-[#d0d5df] hover:text-[#ff5a1f]'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/enroll" className="btn-primary hidden px-6 py-3 text-sm lg:inline-flex">
          Enroll Now
        </Link>

        <button
          className="text-2xl text-white lg:hidden"
          onClick={() => setIsOpen((state) => !state)}
          aria-label="Toggle mobile navigation"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[#1f2a44] bg-[#070a13] lg:hidden">
          <div className="container-primary flex flex-col gap-5 py-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-base ${isActive ? 'text-[#ff5a1f]' : 'text-[#d0d5df] hover:text-[#ff5a1f]'}`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link onClick={() => setIsOpen(false)} to="/enroll" className="btn-primary">
              Enroll Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
