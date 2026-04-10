import { Link } from 'react-router-dom'
import { Card, SectionHeading } from '../../components/ui'
import { APP_ROUTES } from '../../constants/routes'

export function LegalPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading title="Legal Center" subtitle="Policies and operational notices." />
      <Card className="space-y-3 text-sm leading-7 text-slate-600">
        <p>Review the policy documents that govern usage of the marketplace and account data.</p>
        <div className="flex flex-wrap gap-3">
          <Link to={APP_ROUTES.TERMS} className="font-semibold text-brand-700 hover:text-brand-600">Terms</Link>
          <Link to={APP_ROUTES.PRIVACY} className="font-semibold text-brand-700 hover:text-brand-600">Privacy</Link>
          <Link to={APP_ROUTES.CONTACT} className="font-semibold text-brand-700 hover:text-brand-600">Contact</Link>
        </div>
      </Card>
    </div>
  )
}
