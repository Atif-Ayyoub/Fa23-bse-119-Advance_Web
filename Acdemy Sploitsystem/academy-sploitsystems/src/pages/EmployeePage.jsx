import { Link, useParams } from 'react-router-dom'
import { getPersonById } from '../data/leadershipData'

function EmployeePage() {
  const { id } = useParams()
  const person = getPersonById(id)

  if (!person) {
    return (
      <section className="section-spacing">
        <div className="container-primary">
          <article className="glass-card rounded-2xl p-8">
            <h2 className="heading-section mb-4">Person Not Found</h2>
            <Link to="/" className="btn-primary text-sm">
              Back
            </Link>
          </article>
        </div>
      </section>
    )
  }

  document.title = `${person.name} | academy.sploitsystems.com`

  return (
    <section className="section-spacing">
      <div className="container-primary max-w-3xl">
        <article className="glass-card rounded-2xl p-7">
          <img className="mb-5 h-28 w-28 rounded-full border border-[#1f2a44] object-cover" src={person.photo} alt={person.name} />

          <h1 className="text-3xl font-semibold text-white">{person.name}</h1>
          <p className="mt-2 text-base text-[#cfd5e3]">{person.title}</p>
          <p className="mt-1 text-sm text-[#a8b0c3]">{person.team}</p>

          <p className="mt-5 text-sm leading-7 text-[#a8b0c3]">{person.bio}</p>

          <div className="mt-6 rounded-xl border border-[#1f2a44] bg-[#0b0f19]/60 p-4">
            <p className="text-xs uppercase tracking-wide text-[#ff7a3c]">Company Email</p>
            <a href={`mailto:${person.email}`} className="mt-2 inline-block text-sm text-[#d7dcea] hover:text-[#ff7a3c]">
              {person.email}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="btn-primary text-sm"
              href={`mailto:${person.email}?subject=Hello%20${encodeURIComponent(person.name)}`}
            >
              Email {person.name.split(' ')[0]}
            </a>
            <Link className="btn-secondary text-sm" to="/">
              Back
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

export default EmployeePage