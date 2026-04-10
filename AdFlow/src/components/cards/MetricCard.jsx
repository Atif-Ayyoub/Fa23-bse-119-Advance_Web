import { animate, m, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { Card } from '../ui/Card'

export function MetricCard({ label, value }) {
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.9, ease: 'easeOut' })
    return () => controls.stop()
  }, [motionValue, value])

  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <m.p className="mt-1 text-3xl font-semibold tabular-nums">{rounded}</m.p>
    </Card>
  )
}
