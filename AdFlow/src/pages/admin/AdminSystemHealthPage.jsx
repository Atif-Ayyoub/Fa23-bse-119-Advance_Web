import { useCallback, useEffect, useState } from 'react'
import { Button, Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { runAutomationCycle, getSystemHealthLogs, recordDatabaseHeartbeat } from '../../services/automationService'

export function AdminSystemHealthPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getSystemHealthLogs()
      setLogs(data)
    } catch (error) {
      setMessage(error.message ?? 'Unable to load system health logs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  async function handleHeartbeat() {
    setBusy(true)
    setMessage('')
    try {
      await recordDatabaseHeartbeat('manual_admin_check', 0, 'ok')
      setMessage('Heartbeat recorded.')
      await loadLogs()
    } catch (error) {
      setMessage(error.message ?? 'Heartbeat failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleRunAutomation() {
    setBusy(true)
    setMessage('')
    try {
      const result = await runAutomationCycle()
      setMessage(`Automation run complete. Published ${result.publishedCount}, expired ${result.expiredCount}, notified ${result.notifiedCount}.`)
      await loadLogs()
    } catch (error) {
      setMessage(error.message ?? 'Automation run failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="System Health"
        subtitle="Monitor scheduled job execution, DB heartbeat logs, and automation outcomes."
      />

      {message ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{message}</div>
      ) : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleHeartbeat} disabled={busy}>
            {busy ? 'Working...' : 'Record Heartbeat'}
          </Button>
          <Button variant="secondary" onClick={handleRunAutomation} disabled={busy}>
            Run Automation Cycle
          </Button>
        </div>
        <p className="text-sm text-slate-600">
          Use scheduled jobs in Vercel Cron or Supabase Edge Functions to call publish, expire, and expiring-soon routines.
        </p>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Health Log Table</h3>
        {loading ? (
          <div className="grid min-h-[30vh] place-items-center">
            <Spinner className="h-6 w-6 text-brand-600" />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState title="No health logs" description="Heartbeat and automation runs will appear here once executed." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Source</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Response ms</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-slate-700">{item.source}</td>
                    <td className="px-3 py-2 text-slate-700">{item.status}</td>
                    <td className="px-3 py-2 text-slate-700">{item.response_ms ?? 'n/a'}</td>
                    <td className="px-3 py-2 text-slate-700">{new Date(item.checked_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
