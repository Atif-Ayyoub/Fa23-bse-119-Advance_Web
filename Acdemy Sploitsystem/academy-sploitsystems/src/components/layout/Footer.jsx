import { FaFacebookF, FaHeart, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { CONTACT_EMAIL, LOCATION_PRESENCE, PRIMARY_PHONE, WHATSAPP_URL } from '../../lib/contact'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Enroll Now', to: '/enroll' },
  { label: 'Free Workshop', to: '/workshop' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
]

function Footer() {
  return (
    <footer className="border-t border-[#1f2a44] bg-[#070a13] pt-16 pb-12">
      <div className="container-primary grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center">
            <img src={logo} alt="academy.sploitsystems.com logo" className="mr-3 h-12 w-12" />
            <div>
              <p className="font-['Orbitron'] text-sm font-semibold uppercase tracking-[0.18em] text-white">Academy</p>
              <p className="text-xs text-[#a8b0c3]">sploitsystems.com</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-[#a8b0c3]">
            Practical career-focused IT learning.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Quick Links</h3>
          <div className="space-y-3">
            {links.map((item) => (
              <Link key={item.to} to={item.to} className="block text-sm text-[#a8b0c3] transition hover:text-[#ff5a1f]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Contact</h3>
          <div className="space-y-3 text-sm text-[#a8b0c3]">
            <p>Email: {CONTACT_EMAIL}</p>
            <p>
              WhatsApp: <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#a8b0c3] hover:text-[#ff5a1f]">{PRIMARY_PHONE}</a>
            </p>
            <p>{LOCATION_PRESENCE}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Follow Us</h3>
          <div className="flex items-center gap-4 text-2xl text-[#a8b0c3]">
            <a href="#" aria-label="Facebook" className="transition hover:text-[#ff5a1f]"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className="transition hover:text-[#ff5a1f]"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn" className="transition hover:text-[#ff5a1f]"><FaLinkedinIn /></a>
            <a href="#" aria-label="YouTube" className="transition hover:text-[#ff5a1f]"><FaYoutube /></a>
          </div>
        </div>
      </div>
      <div className="container-primary mt-12 flex flex-col gap-3 border-t border-[#1f2a44] pt-6 text-xs text-[#7f889c] md:flex-row md:items-center md:justify-between ml-20">
        <p>© 2026 academy.sploitsystems.com · All rights reserved.</p>
        <p className="inline-flex items-center gap-2 md:text-right mr-20">
          Made with ❤️ by Atif Choudhary
        </p>
      </div>
    </footer>
  )
}

export default Footer
