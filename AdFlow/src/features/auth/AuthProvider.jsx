import { useEffect, useState } from 'react'
import {
  getCurrentSession,
  getCurrentUserProfile,
  registerWithProfile,
  sendPasswordResetEmail,
  signInWithPassword,
  signOut,
} from '../../services/authService'
import { supabase } from '../../lib/supabase/client'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const currentSession = await getCurrentSession()
        if (!active) return

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user?.id) {
          const currentProfile = await getCurrentUserProfile(currentSession.user.id)
          if (active) setProfile(currentProfile)
        } else if (active) {
          setProfile(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (nextSession?.user?.id) {
        const nextProfile = await getCurrentUserProfile(nextSession.user.id)
        if (active) setProfile(nextProfile)
      } else if (active) {
        setProfile(null)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function login(payload) {
    const data = await signInWithPassword(payload)
    const nextProfile = await getCurrentUserProfile(data.user?.id)
    setProfile(nextProfile)
    return data
  }

  async function register(payload) {
    const data = await registerWithProfile(payload)
    const createdProfile = await getCurrentUserProfile(data.user?.id)
    setProfile(createdProfile)
    return data
  }

  async function logout() {
    await signOut()
    setProfile(null)
  }

  async function forgotPassword(email) {
    await sendPasswordResetEmail(email)
  }

  async function refreshProfile() {
    const nextProfile = await getCurrentUserProfile(user?.id)
    setProfile(nextProfile)
    return nextProfile
  }

  const value = {
    session,
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    forgotPassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
