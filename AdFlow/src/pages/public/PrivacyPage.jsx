import { Card, SectionHeading } from '../../components/ui'

export function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading title="Privacy Policy" subtitle="Data usage, notifications, and account information handling." />
      <Card className="space-y-3 text-sm leading-7 text-slate-600">
        <p>We store profile, ad, payment, notification, and audit data needed to operate the platform.</p>
        <p>Media is stored as external URLs only. No local file uploads are retained by this application layer.</p>
      </Card>
    </div>
  )
}
