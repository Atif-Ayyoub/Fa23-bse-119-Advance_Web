import { Link, useLocation } from 'react-router-dom'
import {
  BellRing,
  ChartNoAxesColumn,
  ClipboardCheck,
  CreditCard,
  Flag,
  FolderOpen,
  LayoutDashboard,
  MapPin,
  Newspaper,
  PlusSquare,
  ShieldCheck,
  Stethoscope,
  Tag,
  UserRoundCog,
  Users,
  ScrollText,
} from 'lucide-react'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { isAdmin } from '../../lib/utils/rbac'
import { cn } from '../../lib/utils/cn'

const clientNav = [
  { to: APP_ROUTES.CLIENT_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: APP_ROUTES.CLIENT_ADS, label: 'My Ads', icon: Newspaper },
  { to: APP_ROUTES.CLIENT_ADS_NEW, label: 'Create Ad', icon: PlusSquare },
  { to: APP_ROUTES.CLIENT_PAYMENTS, label: 'Payments', icon: CreditCard },
  { to: APP_ROUTES.CLIENT_NOTIFICATIONS, label: 'Notifications', icon: BellRing },
]

const moderatorNav = [
  { to: APP_ROUTES.MODERATOR_QUEUE, label: 'Review Queue', icon: ShieldCheck },
  { to: APP_ROUTES.MODERATOR_FLAGS, label: 'Flags', icon: Flag },
  { to: APP_ROUTES.MODERATOR_HISTORY, label: 'History', icon: ClipboardCheck },
]

const adminNav = [
  { to: APP_ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: UserRoundCog },
  { to: APP_ROUTES.ADMIN_PAYMENTS, label: 'Payments', icon: CreditCard },
  { to: APP_ROUTES.ADMIN_ADS, label: 'Ads', icon: Newspaper },
  { to: APP_ROUTES.ADMIN_PACKAGES, label: 'Packages', icon: Tag },
  { to: APP_ROUTES.ADMIN_CATEGORIES, label: 'Categories', icon: FolderOpen },
  { to: APP_ROUTES.ADMIN_CITIES, label: 'Cities', icon: MapPin },
  { to: APP_ROUTES.ADMIN_USERS, label: 'Users', icon: Users },
  { to: APP_ROUTES.ADMIN_TRACEABILITY, label: 'Traceability', icon: ScrollText },
  { to: APP_ROUTES.ADMIN_ANALYTICS, label: 'Analytics', icon: ChartNoAxesColumn },
  { to: APP_ROUTES.ADMIN_SYSTEM_HEALTH, label: 'System Health', icon: Stethoscope },
]

export function Sidebar() {
  const location = useLocation()
  const { profile } = useAuth()

  const navItems = isAdmin(profile?.role)
    ? adminNav
    : profile?.role === 'moderator'
      ? moderatorNav
      : clientNav

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/70 bg-white/75 p-4 backdrop-blur-sm lg:block">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
