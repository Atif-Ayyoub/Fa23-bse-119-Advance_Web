import { FaCheckCircle, FaGraduationCap, FaLaptopCode, FaRocket } from 'react-icons/fa'
import SectionHeader from '../common/SectionHeader'

const steps = [
  {
    title: 'Choose Your Track',
    detail: 'Select Web Development, Cybersecurity, Digital Marketing, CCNA, or CEH based on your goal.',
    icon: FaGraduationCap,
  },
  {
    title: 'Attend Live Classes',
    detail: 'Join interactive online sessions with clear roadmaps and weekly accountability.',
    icon: FaLaptopCode,
  },
  {
    title: 'Build Projects',
    detail: 'Practice through assignments, labs, and portfolio tasks to gain confidence.',
    icon: FaCheckCircle,
  },
  {
    title: 'Launch Your Career',
    detail: 'Move toward internships, jobs, and freelancing with practical proof of skills.',
    icon: FaRocket,
  },
]

function LearningProcess() {
  return (
    <section className="section-spacing">
      <div className="container-primary">
        <SectionHeader
          eyebrow="Student Journey"
          title="How Learning Works"
          description="A structured path from enrollment to professional outcomes."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.title} className="glass-card rounded-2xl p-6">
              <step.icon className="mb-4 text-3xl text-[#ff7a3c]" />
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#ff7a3c]">Step {idx + 1}</p>
              <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-7 text-[#a8b0c3]">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LearningProcess
