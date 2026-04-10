import { useEffect, useMemo, useState } from 'react'
import { Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { fetchNotifications } from '../../services/traceabilityService'

export function ClientNotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadNotifications() {
      if (!user?.id) return
      try {
        const data = await fetchNotifications(user.id)
        if (active) setItems(data)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadNotifications()

    return () => {
      active = false
    }
  }, [user?.id])

  const unreadCount = useMemo(() => items.filter((item) => !item.is_read).length, [items])

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading title="Notifications" subtitle={`You have ${unreadCount} unread alerts.`} />
      {items.length === 0 ? (
        <Card>
          <EmptyState title="No notifications yet" description="Workflow alerts will appear here as your ads move through the pipeline." />
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className={`space-y-1 ${item.is_read ? 'opacity-80' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {item.type || 'info'}
                </span>
              </div>
              {item.link ? (
                <a className="text-sm font-semibold text-brand-700 hover:text-brand-600" href={item.link}>
                  Open related screen
                </a>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
