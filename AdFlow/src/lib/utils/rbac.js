import { ROLES } from '../../constants/roles'
import { APP_ROUTES } from '../../constants/routes'

export const hasRoleAccess = (role, allowed) => {
  if (!role) return false
  return allowed.includes(role)
}

export const isAdmin = (role) => {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN
}

export const requireRole = (allowedRoles) => {
  return (role) => hasRoleAccess(role, allowedRoles)
}

export const canEditAd = (user, ad) => {
  if (!user || !ad) return false

  const editableStates = ['draft', 'payment_pending', 'rejected']
  const isOwner = user.id === ad.user_id

  return isOwner && editableStates.includes(ad.status)
}

export const resolveRoleHome = (role) => {
  if (isAdmin(role)) return APP_ROUTES.ADMIN_DASHBOARD
  if (role === ROLES.MODERATOR) return APP_ROUTES.MODERATOR_QUEUE
  return APP_ROUTES.CLIENT_DASHBOARD
}
