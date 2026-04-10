#!/usr/bin/env node
/* global process */
// Create demo users and profiles in Supabase using a service role key.
// Usage (macOS / Linux):
//   SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_KEY=your_service_key node scripts/create_demo_users.js
// Usage (Windows PowerShell):
//   $env:SUPABASE_URL='https://xyz.supabase.co'; $env:SUPABASE_SERVICE_KEY='your_service_key'; node scripts/create_demo_users.js

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.')
  console.error('Set them and re-run the script.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

async function createUserAndProfile({ email, password, fullName, role }) {
  try {
    console.log(`Creating user ${email} ...`)

    // Create auth user (service key required)
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (createError) {
      // If user already exists, try to look it up
      console.error('Create user error:', createError.message)
      const { data: lookup, error: lookupErr } = await supabase.admin.getUserByEmail(email)
      if (lookupErr) {
        throw lookupErr
      }
      createData.user = lookup.user
    }

    const user = createData?.user
    if (!user) throw new Error('Failed to create or find user for ' + email)

    // Upsert profile row
    const profile = {
      id: user.id,
      full_name: fullName,
      email,
      role,
      status: 'active',
    }

    const { error: profileError } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' })
    if (profileError) throw profileError

    console.log(`Created profile for ${email} (id: ${user.id})`)
    return { id: user.id, email }
  } catch (err) {
    console.error('Error creating user/profile for', email, err.message ?? err)
    return null
  }
}

async function main() {
  console.log('Starting demo user creation...')

  const demos = [
    { email: 'demo@gmail.com', password: 'Demo.123', fullName: 'Demo User', role: 'client' },
    { email: 'admin@gmail.com', password: 'Admin.123', fullName: 'Demo Admin', role: 'admin' },
  ]

  for (const d of demos) {
    await createUserAndProfile(d)
  }

  console.log('Done. Verify users in Supabase Dashboard -> Authentication and profiles table.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
