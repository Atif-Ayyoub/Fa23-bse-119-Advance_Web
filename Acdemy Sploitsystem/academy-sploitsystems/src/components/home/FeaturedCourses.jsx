import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { courses } from '../../data/courseData'
import SectionHeader from '../common/SectionHeader'

function FeaturedCourses() {
  return (
    <section className="section-spacing">
      <div className="container-primary">
        <SectionHeader
          eyebrow="Core Programs"
          title="Featured Career Tracks"
          description="Choose practical courses designed to build high-demand skills and measurable career outcomes."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.slice(0, 3).map((course, idx) => (
            <motion.article
              key={course.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-2xl p-8"
            >
              <course.icon className="mb-5 text-4xl text-[#ff7a3c]" />
              <h3 className="mb-3 text-xl font-semibold text-white">{course.name}</h3>
              <p className="mb-5 text-sm leading-7 text-[#a8b0c3]">{course.description}</p>
              <div className="mb-6 flex flex-wrap gap-2 text-xs text-[#d2d8e4]">
                <span className="rounded-md border border-[#1f2a44] px-3 py-1">{course.duration}</span>
                <span className="rounded-md border border-[#1f2a44] px-3 py-1">{course.frequency}</span>
              </div>
              <p className="mb-6 text-2xl font-semibold text-white">{course.fee}</p>
              <Link to={`/courses/${course.slug}`} className="btn-primary w-full text-sm">
                View Details
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCourses
