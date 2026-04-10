import { Inbox } from 'lucide-react'

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div>
        <Inbox size={20} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div style={{ marginTop: '1rem' }}>{action}</div> : null}
    </div>
  )
}
