import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FaLaptopCode, FaLayerGroup, FaRocket, FaUsers } from 'react-icons/fa'

const counters = [
  {
    value: 500,
    suffix: '+',
    label: 'Students Trained',
    subtext: 'Learners from Pakistan & India',
    icon: FaUsers,
    duration: 2.2,
  },
  {
    value: 25,
    suffix: '+',
    label: 'Successful Batches',
    subtext: 'Practical, career-focused training cycles',
    icon: FaLayerGroup,
    duration: 2,
  },
  {
    value: 50,
    suffix: '+',
    label: 'Hands-On Projects & Labs',
    subtext: 'Real practice with guided implementation',
    icon: FaLaptopCode,
    duration: 2.1,
  },
  {
    value: 5,
    suffix: '',
    label: 'Career Tracks',
    subtext: 'Web, Cybersecurity, Marketing, CCNA, CEH',
    icon: FaRocket,
    duration: 1.8,
  },
]

function CountUpValue({ value, suffix, duration }) {
  const elementRef = useRef(null)
  const inView = useInView(elementRef, { once: true, amount: 0.6 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!inView) return undefined

    let animationFrame
    const startAt = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startAt) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(value * eased))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrame)
  }, [duration, inView, value])

  return (
    <span ref={elementRef} className="font-['Orbitron'] text-[32px] leading-[1.1] font-bold text-white sm:text-[38px] lg:text-[42px]">
      {displayValue}
      {suffix}
    </span>
  )
}

function CounterSection() {
  return (
    <section className="mt-10 mb-16 md:mb-24">
      <div className="container-primary">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, staggerChildren: 0.12 }}
        >
          <div className="mb-8 max-w-4xl">
            <h2 className="font-['Orbitron'] text-2xl font-semibold text-white md:text-3xl">
              Practical outcomes and job-ready skills
            </h2>
            <p className="mt-3 text-base leading-7 text-[#a8b0c3]">
              From beginner-friendly courses to advanced technical tracks, our learning model is designed to create practical outcomes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {counters.map((item, index) => (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ y: -8 }}
                className="glass-card relative min-h-[170px] overflow-hidden rounded-[18px] p-7 transition duration-300 hover:border-[rgba(255,90,31,0.45)] hover:shadow-[0_0_35px_rgba(255,90,31,0.14)]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.06) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(255,255,255,0.06) 24px)',
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 h-[1px] w-full"
                  style={{ background: 'linear-gradient(90deg, transparent, #FF5A1F, transparent)' }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-[#ff5a1f]/20 blur-[55px]"
                />

                <motion.div whileHover={{ scale: 1.05 }} className="relative mb-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-[rgba(255,90,31,0.22)] bg-[rgba(255,90,31,0.10)] text-[#ff7a3c]">
                  <item.icon size={20} />
                </motion.div>

                <div className="relative">
                  <CountUpValue value={item.value} suffix={item.suffix} duration={item.duration} />
                  <p className="mt-[10px] text-base font-semibold text-white">{item.label}</p>
                  <p className="mt-2 max-w-[220px] text-sm leading-[22px] text-[#a8b0c3]">{item.subtext}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CounterSection
