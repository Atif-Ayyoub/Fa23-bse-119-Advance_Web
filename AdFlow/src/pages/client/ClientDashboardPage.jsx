import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../../components/cards/MetricCard'
import { Button, Card, EmptyState, SectionHeading, Spinner, StatusPill } from '../../components/ui'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { fetchOwnAds, fetchOwnNotifications } from '../../services/adService'
import { DataTableShell } from '../../components/tables/DataTableShell'

export function ClientDashboardPage() {
  const { user } = useAuth()
  const [ads, setAds] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      if (!user?.id) return
      setLoading(true)

      try {
        const [adsData, notificationsData] = await Promise.all([
          fetchOwnAds(user.id),
          fetchOwnNotifications(user.id),
        ])

        if (!active) return
        setAds(adsData)
        setNotifications(notificationsData)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [user?.id])

  const metrics = useMemo(() => {
    const byStatus = ads.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1
      return acc
    }, {})

    return {
      active: (byStatus.published ?? 0) + (byStatus.payment_pending ?? 0),
      expired: byStatus.expired ?? 0,
      rejected: byStatus.rejected ?? 0,
      pendingReview: (byStatus.submitted ?? 0) + (byStatus.under_review ?? 0),
    }
  }, [ads])

  const activeAds = ads.filter((item) => ['published', 'payment_pending'].includes(item.status)).slice(0, 5)
  const pendingAds = ads.filter((item) => ['submitted', 'under_review'].includes(item.status)).slice(0, 5)

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading title="Client Dashboard" subtitle="Track drafts, submissions, and publication status." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active Ads" value={metrics.active} />
        <MetricCard label="Expired Ads" value={metrics.expired} />
        <MetricCard label="Rejected Ads" value={metrics.rejected} />
        <MetricCard label="Pending Review" value={metrics.pendingReview} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Active Ads</h3>
            <Link to={APP_ROUTES.CLIENT_ADS}>
              <Button variant="secondary">View All</Button>
            </Link>
          </div>

          {activeAds.length === 0 ? (
            <EmptyState
              title="No active ads"
              description="Publish your first ad by creating a draft and submitting it for moderation."
            />
          ) : (
            <DataTableShell
              columns={['Ad Title', 'Status', 'Updated']}
              rows={activeAds.map((ad) => [ad.title, <StatusPill status={ad.status} />, new Date(ad.updated_at).toLocaleString()])}
            />
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Notification Center</h3>
          <div className="mt-3 space-y-2">
            {notifications.length === 0 ? (
              <EmptyState title="No notifications" description="Workflow updates and system alerts will show here." />
            ) : (
              notifications.map((note) => (
                <div key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{note.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Pending Review Ads</h3>
        {pendingAds.length === 0 ? (
          <EmptyState title="Queue clear" description="No ads are waiting for moderation right now." />
        ) : (
          <DataTableShell
            columns={['Ad Title', 'Status', 'Updated']}
            rows={pendingAds.map((ad) => [ad.title, <StatusPill status={ad.status} />, new Date(ad.updated_at).toLocaleString()])}
          />
        )}
      </Card>
    </div>
  )
}
