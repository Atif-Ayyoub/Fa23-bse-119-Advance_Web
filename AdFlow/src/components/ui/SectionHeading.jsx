import { cn } from '../../lib/utils/cn'

export function SectionHeading({ title, subtitle, className }) {
  return (
    <header className={cn('section-heading', className)}>
      <h2 className="section-heading-title">{title}</h2>
      {subtitle ? <p className="section-heading-subtitle">{subtitle}</p> : null}
    </header>
  )
}
