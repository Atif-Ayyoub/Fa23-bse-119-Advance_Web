import { cn } from '../../lib/utils/cn'

export function Badge({ className, children }) {
  return <span className={cn('badge', className)}>{children}</span>
}
