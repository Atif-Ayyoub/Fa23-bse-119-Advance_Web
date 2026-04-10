import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Spinner } from '../ui/Spinner'

export function Navbar() {
  const navigate = useNavigate()
  const { profile, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await logout()
      navigate(APP_ROUTES.LOGIN, { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">AdFlow Pro</p>
          <h1 className="text-lg font-semibold text-slate-900">Workflow Command Center</h1>
        </div>
        <div className="hidden min-w-72 flex-1 items-center md:flex">
          <Input label={null} placeholder="Search ads, payments, moderation notes..." className="py-2" />
        </div>

        <div className="flex items-center gap-2">
          {profile?.role ? (
            <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 sm:inline-flex">
              {profile.role.replaceAll('_', ' ')}
            </span>
          ) : null}

          <button className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
            <Bell size={18} />
          </button>

          <Button variant="secondary" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Signing out
              </span>
            ) : (
              'Sign out'
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
