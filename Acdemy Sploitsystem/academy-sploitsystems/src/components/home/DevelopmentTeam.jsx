import { motion } from 'framer-motion'
import { FaCode, FaLaptopCode } from 'react-icons/fa'
import atifPhoto from '../../assets/Atif11.png'

const developers = [
  {
    name: 'Haris Muhammad',
    role: 'CEO',
    description:
      'Strategic and hands-on full-stack developer leading architecture, system planning, and scalable product execution.',
    portfolioUrl: '#',
    badge: 'Lead',
  },
  {
    name: 'Atif Choudhary',
    role: 'Operations Manager',
    description:
      'Creative and detail-focused developer with strong expertise in modern frontend experiences, clean interfaces, and scalable web solutions.',
    portfolioUrl: 'https://atif-portfolio-nine.vercel.app',
    badge: '',
    photo: atifPhoto,
  },
]

function initialsFromName(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function DevelopmentTeam() {
  return (
    <section className="section-spacing">
      <div className="container-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1f2a44] bg-[#0f1629]/85 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d6dbea] shadow-[0_0_24px_rgba(255,122,60,0.16)]">
            <FaCode className="text-[#ff7a3c]" />
            <span>Meet The Developers</span>
          </div>

          <h2 className="heading-section">Development Team</h2>
          <p className="mt-4 text-base leading-8 text-[#a8b0c3]">
            The talented minds building academy.sploitsystems.com
          </p>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-2">
          {developers.map((developer, index) => (
            <motion.article
              key={developer.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              whileHover={{ y: -8 }}
              className={`relative mx-auto w-[80%] overflow-hidden rounded-[28px] border border-[#1f2a44] bg-[#0f1629]/88 p-8 text-center shadow-[0_0_0_1px_rgba(255,122,60,0.12),0_0_28px_rgba(255,122,60,0.16),inset_0_1px_0_rgba(255,255,255,0.04)] ${developer.name === 'Haris Muhammad' ? 'mb-[20px] lg:mb-0' : ''}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,122,60,0.12),_transparent_42%)]" />

              <div className="relative mb-6 flex justify-center">
                {developer.photo ? (
                  <img
                    src={developer.photo}
                    alt={developer.name}
                    className="h-[170px] w-[170px] rounded-full border-[10px] border-[#ff5a1f] object-cover shadow-[0_0_24px_rgba(255,90,31,0.2)]"
                  />
                ) : (
                  <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full border-[10px] border-[#ff5a1f] bg-[#0b0f19] text-4xl font-semibold text-white shadow-[0_0_24px_rgba(255,90,31,0.2)]">
                    {initialsFromName(developer.name)}
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-semibold text-white">{developer.name}</h3>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#1f2a44] bg-[#0b0f19] px-4 py-2 text-xs font-medium text-[#d2d8e4]">
                <FaLaptopCode className="text-[#ff7a3c]" />
                {developer.role}
              </div>

              <p className="mt-5 text-sm leading-7 text-[#a8b0c3]">{developer.description}</p>

              <a
                href={developer.portfolioUrl}
                target={developer.portfolioUrl.startsWith('http') ? '_blank' : undefined}
                rel={developer.portfolioUrl.startsWith('http') ? 'noreferrer' : undefined}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#ff5a1f] to-[#ff7a3c] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_26px_rgba(255,90,31,0.32)] transition hover:scale-[1.02]"
              >
                View Portfolio
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DevelopmentTeam