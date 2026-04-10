import { Card, SectionHeading } from '../../components/ui'

export function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading title="Terms of Service" subtitle="Marketplace rules, payment expectations, and publication conditions." />
      <Card className="space-y-3 text-sm leading-7 text-slate-600">
        <p>Ads are moderated before publication. Payment verification is required before scheduling or publishing.</p>
        <p>Users are responsible for the accuracy of submitted content and attached media URLs.</p>
      </Card>
    </div>
  )
}
