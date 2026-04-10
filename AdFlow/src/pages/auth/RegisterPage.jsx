import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'framer-motion'
import { useMemo, useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthSplitLayout } from '../../components/layout/AuthSplitLayout'
import { Button, Input, Spinner } from '../../components/ui'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { registerSchema } from '../../lib/validators/authSchema'

function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1

  if (score <= 1) return { label: 'Weak', tone: 'weak' }
  if (score <= 3) return { label: 'Medium', tone: 'medium' }
  return { label: 'Strong', tone: 'strong' }
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef(null)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')
  const strength = useMemo(() => getPasswordStrength(passwordValue ?? ''), [passwordValue])

  function startCooldown(seconds) {
    const safeSeconds = Math.max(1, Number(seconds) || 60)

    if (cooldownRef.current) {
      clearInterval(cooldownRef.current)
      cooldownRef.current = null
    }

    setCooldown(safeSeconds)
    cooldownRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownRef.current)
          cooldownRef.current = null
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  async function onSubmit(values) {
    // Prevent submission while cooldown active
    if (cooldown > 0) return

    setSubmitError('')
    setIsSubmitting(true)

    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      navigate(APP_ROUTES.CLIENT_DASHBOARD, { replace: true })
    } catch (error) {
      const message = String(error?.message ?? '').toLowerCase()
      if (error?.retryAfterSeconds || message.includes('too many signup attempts')) {
        startCooldown(error?.retryAfterSeconds ?? 60)
      }

      setSubmitError(error.message ?? 'Unable to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current)
        cooldownRef.current = null
      }
    }
  }, [])

  return (
    <AuthSplitLayout
      eyebrow="Create Account"
      title="Start your AdFlow workspace"
      description="Sign up once and get role-aware onboarding with a client profile initialized automatically."
      altPanel={
        <div className="card">
          <p className="auth-note">Your profile and seller shell are created after sign-up.</p>
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
          <Input label="Full name" placeholder="Atif Khan" {...register('fullName')} />
          {errors.fullName ? <p className="auth-error">{errors.fullName.message}</p> : null}
        </div>

        <div className="field-block">
          <Input label="Email" type="email" placeholder="name@company.com" {...register('email')} />
          {errors.email ? <p className="auth-error">{errors.email.message}</p> : null}
        </div>

        <div className="field-block">
          <Input label="Password" type="password" placeholder="Create a strong password" {...register('password')} />
          {errors.password ? <p className="auth-error">{errors.password.message}</p> : null}
          <div className="password-meter">
            <div className={`password-meter-fill ${strength.tone}`} />
          </div>
          <p className="auth-note">Password strength: {strength.label}</p>
        </div>

        <div className="field-block">
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? <p className="auth-error">{errors.confirmPassword.message}</p> : null}
        </div>

        {submitError ? <p className="auth-error">{submitError}</p> : null}

        <Button type="submit" disabled={isSubmitting || cooldown > 0}>
          {isSubmitting ? (
            <span>
              <Spinner className="h-4 w-4" />
              Creating account...
            </span>
          ) : cooldown > 0 ? (
            `Try again in ${cooldown}s`
          ) : (
            'Create account'
          )}
        </Button>

        <p className="auth-note">
          Already have an account?{' '}
          <Link to={APP_ROUTES.LOGIN} className="auth-link">
            Sign in
          </Link>
        </p>
      </m.form>
    </AuthSplitLayout>
  )
}
