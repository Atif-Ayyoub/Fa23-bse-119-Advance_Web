import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AuthSplitLayout } from '../../components/layout/AuthSplitLayout'
import { Button, Input, Spinner } from '../../components/ui'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { forgotPasswordSchema } from '../../lib/validators/authSchema'

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values) {
    setSubmitError('')
    setSubmitted(false)
    setIsSubmitting(true)

    try {
      await forgotPassword(values.email)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message ?? 'Unable to send reset email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthSplitLayout
      eyebrow="Password Reset"
      title="Recover your account"
      description="Enter your account email and we will send reset instructions."
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

        {submitError ? <p className="auth-error">{submitError}</p> : null}
        {submitted ? <p className="auth-success">Reset instructions sent. Check your inbox and spam folder.</p> : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>
              <Spinner className="h-4 w-4" />
              Sending link...
            </span>
          ) : (
            'Send reset link'
          )}
        </Button>

        <p className="auth-note">
          Back to{' '}
          <Link to={APP_ROUTES.LOGIN} className="auth-link">
            Sign in
          </Link>
        </p>
      </m.form>
    </AuthSplitLayout>
  )
}
