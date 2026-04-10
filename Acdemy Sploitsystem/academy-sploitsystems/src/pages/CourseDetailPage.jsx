import { Link, useParams } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import { courses } from '../data/courseData'

function CourseDetailPage() {
  const { slug } = useParams()
  const course = courses.find((entry) => entry.slug === slug)

  if (!course) {
    return (
      <section className="section-spacing">
        <div className="container-primary">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="heading-section mb-4">Course Not Found</h2>
            <Link to="/courses" className="btn-primary text-sm">Back to Courses</Link>
          </div>
        </div>
      </section>
    )
  }

  document.title = `${course.name} | academy.sploitsystems.com`

  return (
    <section className="section-spacing">
      <div className="container-primary space-y-8">
        <SectionHeader eyebrow="Course Details" title={course.name} description={course.description} />

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="glass-card rounded-2xl p-7 lg:col-span-2">
            <h3 className="mb-4 text-2xl font-semibold text-white">What You Will Learn</h3>
            <ul className="space-y-3 text-[#a8b0c3]">
              {course.learn.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>

            <h3 className="mt-8 mb-4 text-2xl font-semibold text-white">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {course.tools.map((tool) => (
                <span key={tool} className="rounded-md border border-[#1f2a44] px-3 py-2 text-sm text-[#d2d8e4]">{tool}</span>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-2xl p-7">
            <h3 className="mb-4 text-xl font-semibold text-white">Course Snapshot</h3>
            <ul className="space-y-3 text-sm text-[#cfd5e3]">
              <li>Duration: {course.duration}</li>
              <li>Schedule: {course.frequency}</li>
              <li>Fee: {course.fee}</li>
              <li>Skill Level: {course.level}</li>
              <li>Target Audience: {course.audience}</li>
              <li>Career Outcome: {course.outcome}</li>
            </ul>
            <Link to="/enroll" className="btn-primary mt-6 w-full text-sm">Enroll for This Course</Link>
          </article>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailPage
