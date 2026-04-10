import { Card, SectionHeading } from '../../components/ui'

export function AdminControlPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Admin Control Center"
        subtitle="Verify payments, schedule publication, and monitor platform health."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Payment Verification Board</h3>
          <p className="mt-1 text-sm text-slate-500">Pending and rejected payment records will render here.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-900">System Health Feed</h3>
          <p className="mt-1 text-sm text-slate-500">Latency and automation health logs are ready for charting.</p>
        </Card>
      </div>
    </div>
  )
}
