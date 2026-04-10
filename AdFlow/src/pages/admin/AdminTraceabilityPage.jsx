import { useEffect, useState } from 'react'
import { Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { fetchAuditLogs, fetchRecentStatusHistory } from '../../services/traceabilityService'

export function AdminTraceabilityPage() {
  const [auditLogs, setAuditLogs] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadTraceability() {
      try {
        const [auditData, historyData] = await Promise.all([fetchAuditLogs({ limit: 30 }), fetchRecentStatusHistory(20)])
        if (!active) return
        setAuditLogs(auditData)
        setHistory(historyData)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadTraceability()

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
      <SectionHeading title="Admin Traceability" subtitle="Audit logs, status history, and workflow accountability." />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Audit Log Viewer</h3>
          {auditLogs.length === 0 ? (
            <EmptyState title="No audit logs" description="Sensitive actions will appear here once admin or moderator actions are recorded." />
          ) : (
            <div className="space-y-2">
              {auditLogs.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{item.action_type}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Target {item.target_type} #{item.target_id} · {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Status History Timeline</h3>
          {history.length === 0 ? (
            <EmptyState title="No history entries" description="Status transitions will appear here once an ad is loaded for review." />
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {item.previous_status || 'unknown'} {'->'} {item.new_status}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.note || 'No note provided.'}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
