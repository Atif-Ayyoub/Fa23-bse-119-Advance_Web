import SectionHeader from '../components/common/SectionHeader'

function AboutPage() {
  document.title = 'About | academy.sploitsystems.com'

  return (
    <section className="section-spacing">
      <div className="container-primary space-y-10">
        <SectionHeader
          eyebrow="About Us"
          title="Why academy.sploitsystems.com Exists"
          description="We help students and professionals build practical IT skills that directly lead to real opportunities."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <article className="glass-card rounded-2xl p-8">
            <h3 className="mb-4 font-['Orbitron'] text-2xl text-white">Mission</h3>
            <p className="text-base leading-8 text-[#a8b0c3]">
              Deliver practical, career-focused IT education through live online learning, mentorship, and project execution.
            </p>
          </article>
          <article className="glass-card rounded-2xl p-8">
            <h3 className="mb-4 font-['Orbitron'] text-2xl text-white">Vision</h3>
            <p className="text-base leading-8 text-[#a8b0c3]">
              Build a trusted learning ecosystem across multiple regions, evolving into a complete LMS platform.
            </p>
          </article>
        </div>

        <article className="glass-card rounded-2xl p-8">
          <h3 className="mb-4 font-['Orbitron'] text-2xl text-white">Growth Roadmap</h3>
          <ul className="space-y-3 text-base leading-8 text-[#a8b0c3]">
            <li>• Phase 1: Online-first live classes with practical assignments.</li>
            <li>• Phase 2: Hybrid workshops and local community events.</li>
            <li>• Phase 3: LMS portal with videos, assignments, quizzes, certificates, and dashboard.</li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default AboutPage
