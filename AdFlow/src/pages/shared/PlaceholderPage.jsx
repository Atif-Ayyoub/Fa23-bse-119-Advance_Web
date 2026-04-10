import { Card, EmptyState, SectionHeading } from '../../components/ui'

export function PlaceholderPage({ title, subtitle, description }) {
  return (
    <div className="space-y-6">
      <SectionHeading title={title} subtitle={subtitle} />
      <Card>
        <EmptyState title="Phase 2 route scaffold ready" description={description} />
      </Card>
    </div>
  )
}
