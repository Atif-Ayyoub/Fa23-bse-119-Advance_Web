import { Link } from 'react-router-dom'

function NodeCard({ href, photo, name, role, isTeam = false }) {
  return (
    <Link
      to={href}
      className="glass-card flex min-w-[220px] max-w-[260px] flex-col items-center rounded-2xl border p-4 text-center transition hover:-translate-y-1"
      aria-label={name}
    >
      <img
        className="mb-3 h-16 w-16 rounded-full border border-[#1f2a44] object-cover"
        src={photo}
        alt={name}
      />
      <span className="text-sm font-semibold text-white">{name}</span>
      <span className="mt-1 text-xs text-[#a8b0c3]">{isTeam ? role || 'Team' : role}</span>
    </Link>
  )
}

function TreeNode({ node }) {
  if (!node) return null

  const hasChildren = node.children && node.children.length > 0

  return (
    <li className="flex list-none flex-col items-center">
      {node.person ? (
        <NodeCard
          href={`/people/${node.person.id}`}
          photo={node.person.photo}
          name={node.person.name}
          role={node.person.title}
        />
      ) : null}

      {node.team ? (
        <NodeCard
          href={`/teams/${node.team.slug}`}
          photo={node.team.photo || '/uploads/team/team.webp'}
          name={node.team.name}
          role={node.team.role || 'Team'}
          isTeam
        />
      ) : null}

      {hasChildren ? (
        <ul className="mt-5 flex flex-wrap items-start justify-center gap-4 border-t border-[#1f2a44] pt-5">
          {node.children.map((child) => (
            <TreeNode key={child.person?.id || child.team?.slug} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default TreeNode