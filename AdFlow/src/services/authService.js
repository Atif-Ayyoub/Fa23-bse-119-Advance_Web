import { ROLES } from '../constants/roles'
import { isSupabaseConfigured, supabase } from '../lib/supabase/client'

function extractRetryAfterSeconds(rawMessage) {
  const message = String(rawMessage ?? '').toLowerCase()

  const secondsMatch = message.match(/(\d+)\s*(second|seconds|sec|secs|s)\b/)
  if (secondsMatch) return Number(secondsMatch[1])

  const minutesMatch = message.match(/(\d+)\s*(minute|minutes|min|mins|m)\b/)
  if (minutesMatch) return Number(minutesMatch[1]) * 60

  return null
}

function createFriendlyError(message, retryAfterSeconds) {
  const err = new Error(message)
  if (typeof retryAfterSeconds === 'number' && retryAfterSeconds > 0) {
    err.retryAfterSeconds = retryAfterSeconds
  }
  return err
}

function isSignInRateLimitError(error) {
  const code = String(error?.code ?? '').toLowerCase()
  const message = String(error?.message ?? '').toLowerCase()

  if (error?.status === 429) return true
  if (code === 'over_request_rate_limit' || code === 'over_rate_limit') return true
  return message.includes('too many requests') || message.includes('rate limit')
}

function isSignUpEmailRateLimitError(error) {
  const code = String(error?.code ?? '').toLowerCase()
  const message = String(error?.message ?? '').toLowerCase()

  if (code === 'over_email_send_rate_limit') return true
  if (error?.status === 429 && message.includes('email')) return true
  return message.includes('email rate limit exceeded') || (message.includes('email') && message.includes('rate limit'))
}

function inferDisplayName(fullName, email) {
  if (fullName?.trim()) return fullName.trim()
  const candidate = email?.split('@')[0] ?? 'seller'
  return candidate.slice(0, 80)
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getCurrentUserProfile(userId) {
  if (!isSupabaseConfigured) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const targetId = userId ?? user?.id
  if (!targetId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, status, created_at')
    .eq('id', targetId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function signInWithPassword({ email, password }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before signing in.')
  }

  const maxAttempts = 3
  const baseDelay = 200

  function isLockStolenError(err) {
    const msg = String(err?.message ?? '').toLowerCase()
    return msg.includes('released because another request stole it') || msg.includes('stole it') || msg.includes('lock:')
  }

  async function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms))
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error) return data

    // transient lock error from Supabase internals; retry with backoff
    if (isLockStolenError(error) && attempt < maxAttempts) {
      // exponential backoff
      await sleep(baseDelay * attempt)
      // retry
      continue
    }

    const message = String(error.message ?? '').toLowerCase()

    if (message.includes('invalid login credentials') || error.code === 'invalid_credentials') {
      throw new Error('Invalid email or password.')
    }

    if (isSignInRateLimitError(error)) {
      const retryAfterSeconds = extractRetryAfterSeconds(error.message) ?? 60
      throw createFriendlyError(
        `Too many sign-in attempts. Please wait ${retryAfterSeconds} seconds and try again.`,
        retryAfterSeconds
      )
    }

    // fallback: throw original error
    throw error
  }
}

export async function signOut() {
  if (!isSupabaseConfigured) return

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function sendPasswordResetEmail(email) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before requesting a password reset.')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${'/login'}`,
  })

  if (error) throw error
}

export async function registerWithProfile({ fullName, email, password }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before registering.')
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    if (isSignUpEmailRateLimitError(signUpError)) {
      const retryAfterSeconds = extractRetryAfterSeconds(signUpError.message) ?? 60
      throw createFriendlyError(
        `Too many signup attempts in a short time. Please wait ${retryAfterSeconds} seconds and try again.`,
        retryAfterSeconds
      )
    }

    throw signUpError
  }

  const authUser = signUpData.user
  if (!authUser) {
    throw new Error('Signup completed but no user object was returned by Supabase.')
  }

  const profilePayload = {
    id: authUser.id,
    full_name: fullName,
    email,
    role: ROLES.CLIENT,
    status: 'active',
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'id', ignoreDuplicates: false })

  if (profileError) throw profileError

  const sellerPayload = {
    user_id: authUser.id,
    display_name: inferDisplayName(fullName, email),
  }

  const { error: sellerError } = await supabase
    .from('seller_profiles')
    .upsert(sellerPayload, { onConflict: 'user_id', ignoreDuplicates: false })

  if (sellerError) throw sellerError

  return signUpData
}
