import { useEffect, useState } from 'react'
import { Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { fetchAnalyticsSummary } from '../../services/analyticsService'
import { fetchAuditLogs } from '../../services/traceabilityService'

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const [analytics, logs] = await Promise.all([fetchAnalyticsSummary(), fetchAuditLogs({ limit: 8 })])
        if (!active) return
        setSummary(analytics)
        setAuditLogs(logs)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading title="Admin Dashboard" subtitle="Publication command center with traceability highlights." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Listings</p><p className="mt-1 text-3xl font-semibold">{summary?.listings.totalAds ?? 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Active</p><p className="mt-1 text-3xl font-semibold">{summary?.listings.activeAds ?? 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Pending</p><p className="mt-1 text-3xl font-semibold">{summary?.listings.pendingReviews ?? 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Revenue</p><p className="mt-1 text-3xl font-semibold">${summary?.verifiedPaymentsTotal?.toFixed?.(2) ?? '0.00'}</p></Card>
      </div>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Recent Audit Logs</h3>
        {auditLogs.length === 0 ? (
          <EmptyState title="No audit logs" description="Sensitive actions will appear here as they are recorded." />
        ) : (
          <div className="space-y-2">
            {auditLogs.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{item.action_type}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
