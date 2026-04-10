import { Navigate, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { requireRole, resolveRoleHome } from '../lib/utils/rbac'
import { Spinner } from '../components/ui/Spinner'

export function RoleRoute({ allowedRoles, children }) {
  const { loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  if (!profile) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />
  }

  const hasAccess = requireRole(allowedRoles)(profile.role)

  if (!hasAccess) {
    return <Navigate to={resolveRoleHome(profile.role)} replace />
  }

  return children ?? <Outlet />
}
