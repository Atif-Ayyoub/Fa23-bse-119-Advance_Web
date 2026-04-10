import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { testimonials } from '../../data/courseData'
import SectionHeader from '../common/SectionHeader'

function Testimonials() {
  const [isMobile, setIsMobile] = useState(false)
  const [showAllMobile, setShowAllMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateView = () => setIsMobile(mediaQuery.matches)

    updateView()
    mediaQuery.addEventListener('change', updateView)

    return () => {
      mediaQuery.removeEventListener('change', updateView)
    }
  }, [])

  const testimonialItems = isMobile
    ? (showAllMobile ? testimonials : testimonials.slice(0, 3))
    : testimonials.concat(testimonials)

  return (
    <section className="section-spacing">
      <div className="container-primary">
        <SectionHeader
          eyebrow="Success Stories"
          title="What Our Learners Say"
          description="Real feedback from students, freelancers, and career switchers."
          center
        />

        <div className="mt-10">
          <div className={isMobile ? '' : 'marquee overflow-hidden'}>
            <div className={isMobile ? 'grid grid-cols-1' : 'marquee-track flex gap-6'}>
              {testimonialItems.map((item, idx) => (
                <article key={`${item.name}-${idx}`} className="glass-card min-w-[280px] rounded-2xl p-6">
                  <div className="mb-3 flex text-[#ff7a3c]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={`${item.name}-${i}-${idx}`} className="mr-1" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-6 text-[#d9deea]">“{item.quote}”</p>
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1a243d] text-sm font-semibold text-white">
                      {item.name
                        .split(' ')
                        .map((word) => word[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-[#a8b0c3]">{item.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {isMobile && testimonials.length > 3 ? (
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllMobile((state) => !state)}
                className="btn-secondary !px-5 !py-2"
              >
                {showAllMobile ? 'View Less' : 'View All'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
