import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

const FLOW = ['draft', 'submitted', 'under_review', 'payment_pending']

export function StatusTimeline({ currentStatus }) {
  const currentIndex = Math.max(FLOW.indexOf(currentStatus), 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <p className="text-sm font-semibold text-slate-900">Status Timeline</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {FLOW.map((step, index) => {
          const done = index <= currentIndex

          return (
            <div
              key={step}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs font-semibold uppercase tracking-wide',
                done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500',
              )}
            >
              {done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {step.replaceAll('_', ' ')}
            </div>
          )
        })}
      </div>
    </div>
  )
}
