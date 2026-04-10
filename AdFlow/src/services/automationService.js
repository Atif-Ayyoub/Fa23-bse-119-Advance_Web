import { createNotification, logAudit, recordStatusChange } from './traceabilityService'
import { supabase } from '../lib/supabase/client'
import { calculateExpireAt } from './publishingService'

export async function publishScheduledAds() {
  const nowIso = new Date().toISOString()

  const { data: dueAds, error: dueError } = await supabase
    .from('ads')
    .select('id, user_id, status, package_id, publish_at')
    .eq('status', 'scheduled')
    .lte('publish_at', nowIso)

  if (dueError) throw dueError

  const publishedIds = []

  for (const ad of dueAds ?? []) {
    const { data: packageRow, error: packageError } = await supabase
      .from('packages')
      .select('duration_days')
      .eq('id', ad.package_id)
      .single()

    if (packageError) throw packageError

    const expireAt = calculateExpireAt(packageRow.duration_days, ad.publish_at)

    const { error: updateError } = await supabase
      .from('ads')
      .update({ status: 'published', expire_at: expireAt, updated_at: nowIso })
      .eq('id', ad.id)

    if (updateError) throw updateError

    await recordStatusChange(ad.id, 'scheduled', 'published', null, 'Published automatically by scheduler.')
    await logAudit(null, 'ad_published_by_scheduler', 'ad', ad.id, { status: 'scheduled' }, { status: 'published', expireAt })

    await createNotification(
      ad.user_id,
      'Ad Published',
      'Your scheduled ad has been published and is now visible publicly.',
      'ad_published',
      `/ads/${ad.id}`,
    )

    publishedIds.push(ad.id)
  }

  return { publishedCount: publishedIds.length, publishedIds }
}

export async function expireAds() {
  const nowIso = new Date().toISOString()

  const { data: dueAds, error: dueError } = await supabase
    .from('ads')
    .select('id, user_id, status')
    .eq('status', 'published')
    .lte('expire_at', nowIso)

  if (dueError) throw dueError

  const expiredIds = []

  for (const ad of dueAds ?? []) {
    const { error: updateError } = await supabase
      .from('ads')
      .update({ status: 'expired', updated_at: nowIso })
      .eq('id', ad.id)

    if (updateError) throw updateError

    await recordStatusChange(ad.id, ad.status, 'expired', null, 'Expired automatically by scheduler.')
    await logAudit(null, 'ad_expired_by_scheduler', 'ad', ad.id, { status: ad.status }, { status: 'expired' })

    await createNotification(
      ad.user_id,
      'Ad Expired',
      'Your ad has expired and is no longer visible in the public marketplace.',
      'ad_expired',
      '/client/ads',
    )

    expiredIds.push(ad.id)
  }

  return { expiredCount: expiredIds.length, expiredIds }
}

export async function notifyExpiringSoonAds(windowHours = 48) {
  const nowIso = new Date().toISOString()
  const thresholdIso = new Date(Date.now() + windowHours * 60 * 60 * 1000).toISOString()

  const { data: dueAds, error } = await supabase
    .from('ads')
    .select('id, user_id, title, expire_at')
    .eq('status', 'published')
    .gt('expire_at', nowIso)
    .lte('expire_at', thresholdIso)

  if (error) throw error

  for (const ad of dueAds ?? []) {
    await createNotification(
      ad.user_id,
      'Ad Expiring Soon',
      `Your ad "${ad.title}" expires on ${new Date(ad.expire_at).toLocaleString()}.`,
      'ad_expiring_soon',
      '/client/ads',
    )
  }

  return { notifiedCount: dueAds?.length ?? 0 }
}

export async function recordDatabaseHeartbeat(source = 'scheduler', responseMs = null, status = 'ok') {
  const { data, error } = await supabase
    .from('system_health_logs')
    .insert({
      source,
      response_ms: responseMs,
      status,
      checked_at: new Date().toISOString(),
    })
    .select('id, source, response_ms, status, checked_at')
    .single()

  if (error) throw error

  return data
}

export async function getSystemHealthLogs() {
  const { data, error } = await supabase
    .from('system_health_logs')
    .select('id, source, response_ms, checked_at, status')
    .order('checked_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data ?? []
}

export async function runAutomationCycle() {
  const started = Date.now()
  const published = await publishScheduledAds()
  const expired = await expireAds()
  const expiringSoon = await notifyExpiringSoonAds(48)
  const responseMs = Date.now() - started
  const heartbeat = await recordDatabaseHeartbeat('automation_cycle', responseMs, 'ok')

  return {
    ...published,
    ...expired,
    ...expiringSoon,
    heartbeat,
    responseMs,
  }
}
