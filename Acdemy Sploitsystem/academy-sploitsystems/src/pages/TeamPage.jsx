import { Link, useParams } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import TreeNode from '../components/leadership/TreeNode'
import { buildTeamTree, getPersonById, getTeamBySlug, getTeamPeople } from '../data/leadershipData'

function TeamPage() {
  const { slug } = useParams()
  const team = getTeamBySlug(slug)

  if (!team) {
    return (
      <section className="section-spacing">
        <div className="container-primary">
          <article className="glass-card rounded-2xl p-8">
            <h2 className="heading-section mb-4">Team Not Found</h2>
            <Link to="/" className="btn-primary text-sm">
              Back
            </Link>
          </article>
        </div>
      </section>
    )
  }

  document.title = `${team.name} | academy.sploitsystems.com`

  const people = getTeamPeople(team.slug).filter((person) => person.id !== team.managerId)
  const exec = getPersonById(team.execId)
  const manager = getPersonById(team.managerId)
  const tree = buildTeamTree(team)

  return (
    <section className="section-spacing">
      <div className="container-primary space-y-8">
        <SectionHeader eyebrow="Team" title={team.name} description={team.summary} />

        {exec || manager ? (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-white">Team Leadership</h2>
              <p className="mt-2 text-sm text-[#a8b0c3]">Who owns this team and who runs it day-to-day.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {exec ? (
                <Link to={`/people/${exec.id}`} className="glass-card rounded-2xl p-5 transition hover:-translate-y-1">
                  <img className="mb-4 h-20 w-20 rounded-full border border-[#1f2a44] object-cover" src={exec.photo} alt={exec.name} />
                  <p className="text-base font-semibold text-white">{exec.name}</p>
                  <p className="mt-1 text-sm text-[#a8b0c3]">{exec.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-[#ff7a3c]">Executive owner</p>
                </Link>
              ) : null}

              {manager ? (
                <Link
                  to={`/people/${manager.id}`}
                  className="glass-card rounded-2xl p-5 transition hover:-translate-y-1"
                >
                  <img
                    className="mb-4 h-20 w-20 rounded-full border border-[#1f2a44] object-cover"
                    src={manager.photo}
                    alt={manager.name}
                  />
                  <p className="text-base font-semibold text-white">{manager.name}</p>
                  <p className="mt-1 text-sm text-[#a8b0c3]">{manager.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-[#ff7a3c]">Team manager</p>
                </Link>
              ) : null}
            </div>
          </section>
        ) : null}

        <article className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 text-2xl font-semibold text-white">Reporting Tree</h2>
          <div className="overflow-x-auto">
            <ul className="min-w-[720px]">
              <TreeNode node={tree} />
            </ul>
          </div>
        </article>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">Team Members</h2>
            <p className="mt-2 text-sm text-[#a8b0c3]">Click a person to view details and email.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <Link
                key={person.id}
                to={`/people/${person.id}`}
                className="glass-card rounded-2xl p-5 transition hover:-translate-y-1"
              >
                <img
                  className="mb-4 h-20 w-20 rounded-full border border-[#1f2a44] object-cover"
                  src={person.photo}
                  alt={person.name}
                />
                <p className="text-base font-semibold text-white">{person.name}</p>
                <p className="mt-1 text-sm text-[#a8b0c3]">{person.title}</p>
              </Link>
            ))}
          </div>
        </section>

        <div>
          <Link to="/" className="btn-secondary text-sm">
            Back
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TeamPage