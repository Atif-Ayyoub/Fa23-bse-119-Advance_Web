import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../constants/routes'
import { Button, Card } from '../components/ui'

export function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4">
      <Card className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-sm text-slate-500">This route is not mapped yet in Phase 1.</p>
        <Link to={APP_ROUTES.HOME}>
          <Button>Back to Home</Button>
        </Link>
      </Card>
    </div>
  )
}
