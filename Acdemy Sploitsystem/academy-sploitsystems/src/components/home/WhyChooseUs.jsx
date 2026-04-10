import { FaBriefcase, FaChartLine, FaGlobeAsia, FaLaptopCode, FaProjectDiagram, FaUserCheck } from 'react-icons/fa'
import Reveal from '../common/Reveal'
import SectionHeader from '../common/SectionHeader'

const reasons = [
  {
    title: 'Practical Hands-on Training',
    description: 'Every module includes projects and implementation tasks that mirror real industry workflows.',
    icon: FaLaptopCode,
  },
  {
    title: 'Career-Focused Curriculum',
    description: 'Courses are designed around high-demand skills that employers and clients actively seek.',
    icon: FaChartLine,
  },
  {
    title: 'Accessible Global Delivery',
    description: 'Learning flow and communication style stay practical, clear, and easy to follow across different regions.',
    icon: FaGlobeAsia,
  },
  {
    title: 'Industry-Relevant Projects',
    description: 'Students build portfolio-ready work that demonstrates practical job-readiness.',
    icon: FaProjectDiagram,
  },
  {
    title: 'Mentorship & Guidance',
    description: 'Structured guidance supports students, freelancers, and job switchers from start to finish.',
    icon: FaUserCheck,
  },
  {
    title: 'Future LMS Ecosystem',
    description: 'Architecture is built for expansion to assignments, quizzes, dashboards, and certificates.',
    icon: FaBriefcase,
  },
]

function WhyChooseUs() {
  return (
    <section className="section-spacing">
      <div className="container-primary">
        <SectionHeader
          eyebrow="Why Choose Us"
          title="A Premium Learning Experience Built for Results"
          description="We combine practical implementation, mentorship, and career alignment to accelerate outcomes."
          center
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, idx) => (
            <Reveal key={reason.title} delay={idx * 0.08}>
              <article className="glass-card h-full rounded-2xl p-6">
                <reason.icon className="mb-4 text-4xl text-[#ff7a3c]" />
                <h3 className="mb-3 text-xl font-semibold text-white">{reason.title}</h3>
                <p className="text-sm leading-7 text-[#a8b0c3]">{reason.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
