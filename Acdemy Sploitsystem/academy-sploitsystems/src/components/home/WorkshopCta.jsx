import { Link } from 'react-router-dom'

function WorkshopCta() {
  return (
    <section className="section-spacing">
      <div className="container-primary">
        <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-12 md:px-10">
          <div className="absolute -top-20 -right-10 h-52 w-52 rounded-full bg-[#ff5a1f]/25 blur-[80px]" />
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#ff7a3c]">Free Counseling / Workshop</p>
          <h3 className="font-['Orbitron'] text-3xl font-semibold text-white md:text-4xl">
            Start with a Free Expert Session Before You Enroll
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#c0c7d7]">
            Get personalized guidance, course recommendations, and career direction aligned with your goals.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/workshop" className="btn-primary">Book Free Workshop</Link>
            <Link to="/contact" className="btn-secondary">Talk to Advisor</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkshopCta
