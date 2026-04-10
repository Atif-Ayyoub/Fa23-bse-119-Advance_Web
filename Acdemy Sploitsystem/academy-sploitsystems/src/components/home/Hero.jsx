import { motion } from 'framer-motion'
import { FaArrowRight, FaBolt, FaBriefcase, FaLaptopCode, FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import CyberOrb from '../three/CyberOrb'

const badges = [
  'Practical Training',
  'Online Live Classes',
  'Career-Focused Learning',
  'Global Learner Community',
]

const stats = [
  { label: 'Course Duration', value: '2-4 Months', icon: FaBolt },
  { label: 'Class Frequency', value: '3 Classes/Week', icon: FaLaptopCode },
  { label: 'Hands-on Focus', value: 'Real Projects', icon: FaBriefcase },
  { label: 'Learner Community', value: 'Growing Fast', icon: FaUsers },
]

function Hero() {
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container-primary grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#ff7a3c]"
          >
            academy.sploitsystems.com
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-display mb-6 max-w-[640px]"
          >
            Build Your IT Career with Practical, Job-Ready Skills
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8 max-w-[640px] text-lg leading-8 text-[#a8b0c3]"
          >
            Learn Cybersecurity, Web Development, Digital Marketing, and Networking with live practical training built for real career outcomes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 flex flex-wrap gap-4"
          >
            <Link to="/courses" className="btn-primary">
              Explore Courses <FaArrowRight className="ml-2" />
            </Link>
            <Link to="/enroll" className="btn-secondary">Enroll Now</Link>
          </motion.div>

          <div className="mb-10 flex w-full gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="flex-1 text-center rounded-full border border-[#1f2a44] bg-[#0f1629]/75 px-4 py-2 text-xs font-medium text-[#d2d8e4]"
              >
                {badge}
              </span>
            ))}
          </div>

        </div>

        
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-[#ff5a1f]/20 blur-[110px]" />
        </div>

        {/* Overlay orb in front of heading on large screens */}
        <div className="pointer-events-none absolute top-[40px] right-[30px] hidden lg:block z-50">
          <CyberOrb />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5">
              <stat.icon className="mb-3 text-xl text-[#ff7a3c]" />
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-sm text-[#a8b0c3]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
