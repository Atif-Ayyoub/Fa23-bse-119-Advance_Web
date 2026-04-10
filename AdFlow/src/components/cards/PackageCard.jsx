import { Star } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils/cn'

export function PackageCard({ item, selected, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(item.id)} className="w-full text-left">
      <Card
        className={cn(
          'h-full border transition-all',
          selected ? 'border-brand-500 bg-brand-50/60 shadow-lg' : 'border-white/70',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.duration_days} day listing window</p>
          </div>
          {item.is_featured ? (
            <span className="inline-flex rounded-full bg-amber-100 p-1.5 text-amber-700">
              <Star size={14} />
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl font-semibold text-slate-900">${Number(item.price).toFixed(2)}</p>
          {item.badge ? <Badge>{item.badge}</Badge> : null}
        </div>

        <p className="mt-3 text-xs text-slate-500">Homepage visibility: {item.homepage_visibility ? 'Yes' : 'No'}</p>
      </Card>
    </button>
  )
}
