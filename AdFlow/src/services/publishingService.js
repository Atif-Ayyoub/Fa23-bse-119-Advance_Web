import { isSupabaseConfigured, supabase } from '../lib/supabase/client'

export function calculateExpireAt(packageDuration, publishAt) {
  const base = new Date(publishAt)
  const duration = Number(packageDuration ?? 0)
  if (Number.isNaN(base.getTime()) || duration <= 0) {
    throw new Error('Invalid publish time or package duration.')
  }

  const expireAt = new Date(base)
  expireAt.setDate(expireAt.getDate() + duration)
  return expireAt.toISOString()
}

export function getFreshnessPoints(publishAt) {
  const now = Date.now()
  const published = new Date(publishAt).getTime()
  if (Number.isNaN(published)) return 0

  const ageHours = Math.max(0, (now - published) / (1000 * 60 * 60))
  const score = 30 - ageHours * 0.35
  return Math.max(0, Math.round(score))
}

export function computeRankScore(ad) {
  const featuredPoints = ad.featured ? 50 : 0
  const packageWeightPoints = Number(ad.packageWeight ?? 0) * 10
  const freshnessPoints = getFreshnessPoints(ad.publish_at)
  const adminBoostPoints = Number(ad.admin_boost ?? 0)
  const verifiedSellerPoints = ad.verifiedSeller ? 20 : 0

  return featuredPoints + packageWeightPoints + freshnessPoints + adminBoostPoints + verifiedSellerPoints
}

async function appendStatusHistory({ adId, previousStatus, newStatus, changedBy, note }) {
  const { error } = await supabase.from('ad_status_history').insert({
    ad_id: adId,
    previous_status: previousStatus,
    new_status: newStatus,
    changed_by: changedBy,
    note,
    changed_at: new Date().toISOString(),
  })

  if (error) throw error
}

async function createAuditLog({ actorId, actionType, targetType, targetId, oldValue, newValue }) {
  const { error } = await supabase.from('audit_logs').insert({
    actor_id: actorId,
    action_type: actionType,
    target_type: targetType,
    target_id: String(targetId),
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
    created_at: new Date().toISOString(),
  })

  if (error) throw error
}

export async function fetchAdminPublishableAds() {
  const { data, error } = await supabase
    .from('ads')
    .select('id, user_id, title, slug, status, package_id, featured, admin_boost, publish_at, expire_at, updated_at')
    .in('status', ['payment_verified', 'scheduled', 'published'])
    .order('updated_at', { ascending: false })

  if (error) throw error

  const packageIds = [...new Set((data ?? []).map((item) => item.package_id).filter(Boolean))]
  const userIds = [...new Set((data ?? []).map((item) => item.user_id).filter(Boolean))]

  const packageRes = packageIds.length
    ? await supabase.from('packages').select('id, name, duration_days, weight').in('id', packageIds)
    : { data: [], error: null }
  if (packageRes.error) throw packageRes.error

  const sellerRes = userIds.length
    ? await supabase.from('seller_profiles').select('user_id, is_verified').in('user_id', userIds)
    : { data: [], error: null }
  if (sellerRes.error) throw sellerRes.error

  const packageMap = new Map((packageRes.data ?? []).map((item) => [item.id, item]))
  const sellerMap = new Map((sellerRes.data ?? []).map((item) => [item.user_id, item]))

  return (data ?? []).map((ad) => {
    const pkg = packageMap.get(ad.package_id)
    const seller = sellerMap.get(ad.user_id)
    const rankScore = computeRankScore({
      ...ad,
      packageWeight: pkg?.weight ?? 0,
      verifiedSeller: Boolean(seller?.is_verified),
    })

    return {
      ...ad,
      package_name: pkg?.name ?? 'Unknown',
      package_duration_days: pkg?.duration_days ?? 0,
      package_weight: pkg?.weight ?? 0,
      seller_verified: Boolean(seller?.is_verified),
      rank_score: rankScore,
    }
  })
}

export async function publishAd(adId, actorId, publishAt = null) {
  const adRes = await supabase
    .from('ads')
    .select('id, status, package_id, featured, admin_boost')
    .eq('id', adId)
    .single()
  if (adRes.error) throw adRes.error

  if (adRes.data.status !== 'payment_verified') {
    throw new Error('Ad must be payment verified before publishing.')
  }

  const packageRes = await supabase
    .from('packages')
    .select('id, duration_days')
    .eq('id', adRes.data.package_id)
    .single()
  if (packageRes.error) throw packageRes.error

  const publishAtIso = publishAt ? new Date(publishAt).toISOString() : new Date().toISOString()
  const now = Date.now()
  const publishDate = new Date(publishAtIso)
  const isScheduled = publishDate.getTime() > now
  const nextStatus = isScheduled ? 'scheduled' : 'published'
  const expireAt = calculateExpireAt(packageRes.data.duration_days, publishAtIso)

  const updateRes = await supabase
    .from('ads')
    .update({
      status: nextStatus,
      publish_at: publishAtIso,
      expire_at: expireAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', adId)
  if (updateRes.error) throw updateRes.error

  await appendStatusHistory({
    adId,
    previousStatus: adRes.data.status,
    newStatus: nextStatus,
    changedBy: actorId,
    note: isScheduled ? 'Scheduled by admin.' : 'Published by admin.',
  })

  await createAuditLog({
    actorId,
    actionType: isScheduled ? 'ad_scheduled' : 'ad_published',
    targetType: 'ad',
    targetId: adId,
    oldValue: { status: adRes.data.status },
    newValue: { status: nextStatus, publishAt: publishAtIso, expireAt },
  })
}

export async function updateAdminPlacement(adId, payload, actorId) {
  const adRes = await supabase.from('ads').select('featured, admin_boost').eq('id', adId).single()
  if (adRes.error) throw adRes.error

  const updateRes = await supabase
    .from('ads')
    .update({
      featured: Boolean(payload.featured),
      admin_boost: Number(payload.adminBoost ?? 0),
      updated_at: new Date().toISOString(),
    })
    .eq('id', adId)
  if (updateRes.error) throw updateRes.error

  await createAuditLog({
    actorId,
    actionType: 'ad_placement_updated',
    targetType: 'ad',
    targetId: adId,
    oldValue: adRes.data,
    newValue: { featured: Boolean(payload.featured), admin_boost: Number(payload.adminBoost ?? 0) },
  })
}

export async function applyPublicationWindow() {
  const nowIso = new Date().toISOString()

  const scheduledRes = await supabase
    .from('ads')
    .update({ status: 'published', updated_at: nowIso })
    .eq('status', 'scheduled')
    .lte('publish_at', nowIso)
    .select('id')
  if (scheduledRes.error) throw scheduledRes.error

  const expiryRes = await supabase
    .from('ads')
    .update({ status: 'expired', updated_at: nowIso })
    .eq('status', 'published')
    .lte('expire_at', nowIso)
    .select('id')
  if (expiryRes.error) throw expiryRes.error

  return {
    publishedNow: scheduledRes.data?.length ?? 0,
    expiredNow: expiryRes.data?.length ?? 0,
  }
}

export async function fetchPublicAds() {
  if (!isSupabaseConfigured) return []

  try {
    await applyPublicationWindow()
  } catch {
    // Public/anon users may not have update permissions; public visibility still uses strict filters below.
  }

  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('ads')
    .select('id, user_id, title, slug, description, package_id, city_id, category_id, featured, admin_boost, publish_at, expire_at, status')
    .eq('status', 'published')
    .lte('publish_at', nowIso)
    .gt('expire_at', nowIso)

  if (error) throw error

  const adRows = data ?? []
  const packageIds = [...new Set(adRows.map((item) => item.package_id).filter(Boolean))]
  const userIds = [...new Set(adRows.map((item) => item.user_id).filter(Boolean))]

  const [packageRes, sellerRes, mediaRes] = await Promise.all([
    packageIds.length ? supabase.from('packages').select('id, name, weight').in('id', packageIds) : Promise.resolve({ data: [], error: null }),
    userIds.length
      ? supabase.from('seller_profiles').select('user_id, display_name, business_name, phone, is_verified').in('user_id', userIds)
      : Promise.resolve({ data: [], error: null }),
    adRows.length ? supabase.from('ad_media').select('ad_id, thumbnail_url, original_url').in('ad_id', adRows.map((item) => item.id)) : Promise.resolve({ data: [], error: null }),
  ])

  if (packageRes.error) throw packageRes.error
  if (sellerRes.error) throw sellerRes.error
  if (mediaRes.error) throw mediaRes.error

  const packageMap = new Map((packageRes.data ?? []).map((item) => [item.id, item]))
  const sellerMap = new Map((sellerRes.data ?? []).map((item) => [item.user_id, item]))
  const mediaMap = new Map()
  for (const media of mediaRes.data ?? []) {
    if (!mediaMap.has(media.ad_id)) {
      mediaMap.set(media.ad_id, media.thumbnail_url || media.original_url || null)
    }
  }

  const enriched = adRows.map((ad) => {
    const pkg = packageMap.get(ad.package_id)
    const seller = sellerMap.get(ad.user_id)
    const rank_score = computeRankScore({
      ...ad,
      packageWeight: pkg?.weight ?? 0,
      verifiedSeller: Boolean(seller?.is_verified),
    })

    return {
      ...ad,
      rank_score,
      package_name: pkg?.name ?? 'Unknown',
      thumbnail_url: mediaMap.get(ad.id),
      seller_name: seller?.display_name ?? 'Seller',
      seller_business: seller?.business_name ?? '',
      seller_phone: seller?.phone ?? '',
      seller_verified: Boolean(seller?.is_verified),
    }
  })

  return enriched.sort((a, b) => b.rank_score - a.rank_score)
}

export async function fetchPublicAdBySlug(slug) {
  const ads = await fetchPublicAds()
  return ads.find((item) => item.slug === slug) ?? null
}

export async function fetchMarketplaceLookups() {
  if (!isSupabaseConfigured) {
    return {
      packages: [],
      categories: [],
      cities: [],
      questions: [],
    }
  }

  const [packagesRes, categoriesRes, citiesRes, questionsRes] = await Promise.all([
    supabase.from('packages').select('id, name, duration_days, weight, homepage_visibility, is_featured, refresh_days, price, badge').order('weight', { ascending: false }),
    supabase.from('categories').select('id, name, slug, is_active').eq('is_active', true).order('name', { ascending: true }),
    supabase.from('cities').select('id, name, slug, is_active').eq('is_active', true).order('name', { ascending: true }),
    supabase.from('learning_questions').select('id, question, answer, topic, difficulty, is_active').eq('is_active', true).order('id', { ascending: true }).limit(6),
  ])

  if (packagesRes.error) throw packagesRes.error
  if (categoriesRes.error) throw categoriesRes.error
  if (citiesRes.error) throw citiesRes.error
  if (questionsRes.error) throw questionsRes.error

  return {
    packages: packagesRes.data ?? [],
    categories: categoriesRes.data ?? [],
    cities: citiesRes.data ?? [],
    questions: questionsRes.data ?? [],
  }
}

