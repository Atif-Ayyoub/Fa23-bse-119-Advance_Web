import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthSplitLayout } from '../../components/layout/AuthSplitLayout'
import { Button, Input, Spinner } from '../../components/ui'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { resolveRoleHome } from '../../lib/utils/rbac'
import { loginSchema } from '../../lib/validators/authSchema'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, refreshProfile } = useAuth()
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      await login(values)
      const profile = await refreshProfile()
      const fallbackRoute = resolveRoleHome(profile?.role)
      const nextPath = location.state?.from ?? fallbackRoute

      setTimeout(() => {
        navigate(nextPath, { replace: true })
      }, 240)
    } catch (error) {
      setSubmitError(error.message ?? 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthSplitLayout
      eyebrow="Welcome Back"
      title="Sign in to AdFlow Pro"
      description="Access your role-specific workspace with secure Supabase authentication."
      altPanel={
        <div className="card">
          <p className="auth-note">Role-aware onboarding keeps access scoped by profile role.</p>
        </div>
      }
    >
      <m.form
        className="auth-form"
        onSubmit={handleSubmit(onSubmit)}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div className="field-block">
          <Input label="Email" type="email" placeholder="name@company.com" {...register('email')} />
          {errors.email ? <p className="auth-error">{errors.email.message}</p> : null}
        </div>

        <div className="field-block">
          <Input label="Password" type="password" placeholder="Enter your password" {...register('password')} />
          {errors.password ? <p className="auth-error">{errors.password.message}</p> : null}
        </div>

        {submitError ? <p className="auth-error">{submitError}</p> : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>
              <Spinner className="h-4 w-4" />
              Signing in...
            </span>
          ) : (
            'Continue'
          )}
        </Button>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem' }}>
          <Link to={APP_ROUTES.FORGOT_PASSWORD} className="auth-link">
            Forgot password?
          </Link>
          <Link to={APP_ROUTES.REGISTER} className="auth-link">
            Create account
          </Link>
        </div>
      </m.form>
    </AuthSplitLayout>
  )
}
