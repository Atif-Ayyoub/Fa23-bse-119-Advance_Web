import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

export function Spinner({ className }) {
  return <LoaderCircle className={cn('spinner', className)} aria-hidden="true" />
}
