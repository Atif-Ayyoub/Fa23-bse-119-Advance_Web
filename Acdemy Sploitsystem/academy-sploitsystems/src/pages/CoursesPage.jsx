import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import { courses } from '../data/courseData'

const tabs = ['All', 'Starter', 'Advanced']

function getTabType(course) {
  if (['ceh', 'ccna'].includes(course.slug)) return 'Advanced'
  if (['web-development', 'cybersecurity', 'digital-marketing'].includes(course.slug)) return 'Starter'
  return 'All'
}

function CoursesPage() {
  document.title = 'Courses | academy.sploitsystems.com'
  const [activeTab, setActiveTab] = useState('All')

  const filtered = useMemo(
    () => (activeTab === 'All' ? courses : courses.filter((course) => getTabType(course) === activeTab)),
    [activeTab],
  )

  return (
    <section className="section-spacing">
      <div className="container-primary">
        <SectionHeader
          eyebrow="Courses"
          title="Career-Focused IT Programs"
          description="Interactive course cards with practical outcomes, fees, duration, and class structure."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? 'border-[#ff5a1f] bg-[#ff5a1f]/20 text-[#ff7a3c]'
                  : 'border-[#1f2a44] text-[#c6ccda] hover:border-[#ff5a1f]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course, idx) => (
            <motion.article
              key={course.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-2xl p-8"
            >
              <course.icon className="mb-4 text-4xl text-[#ff7a3c]" />
              <h3 className="mb-3 text-xl font-semibold text-white">{course.name}</h3>
              <p className="mb-4 text-sm leading-7 text-[#a8b0c3]">{course.description}</p>
              <ul className="mb-5 space-y-2 text-sm text-[#cfd5e3]">
                <li>Duration: {course.duration}</li>
                <li>Frequency: {course.frequency}</li>
                <li>Level: {course.level}</li>
                <li>Fee: {course.fee}</li>
              </ul>
              <Link to={`/courses/${course.slug}`} className="btn-primary w-full text-sm">
                View Course Details
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoursesPage
