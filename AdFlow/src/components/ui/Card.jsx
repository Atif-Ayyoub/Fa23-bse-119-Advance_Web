import { m } from 'framer-motion'
import { cardHoverLift } from '../../animations/variants'
import { cn } from '../../lib/utils/cn'

export function Card({ className, children }) {
  return (
    <m.section
      initial="rest"
      whileHover="hover"
      variants={cardHoverLift}
      className={cn('card', className)}
    >
      {children}
    </m.section>
  )
}
