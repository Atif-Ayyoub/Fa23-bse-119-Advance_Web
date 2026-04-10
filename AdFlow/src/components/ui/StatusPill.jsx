import { cn } from '../../lib/utils/cn'

const statusColorMap = {
  draft: 'status-pill--default',
  submitted: 'status-pill--default',
  under_review: 'status-pill--default',
  payment_pending: 'status-pill--default',
  payment_submitted: 'status-pill--default',
  payment_verified: 'status-pill--default',
  published: 'status-pill--default',
  rejected: 'status-pill--default',
  expired: 'status-pill--default',
}

export function StatusPill({ status = 'draft' }) {
  return (
    <span
      className={cn(
        'status-pill',
        statusColorMap[status] ?? 'status-pill--default',
      )}
    >
      {status.replaceAll('_', ' ')}
    </span>
  )
}
