import { Card, SectionHeading } from '../../components/ui'

export function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading title="Contact" subtitle="Support, escalation, and abuse reporting." />
      <Card className="space-y-3 text-sm leading-7 text-slate-600">
        <p>Email: support@adflowpro.example</p>
        <p>Escalation: moderation@adflowpro.example</p>
        <p>Abuse reports are prioritized for suspicious media, fraud, and policy violations.</p>
      </Card>
    </div>
  )
}
