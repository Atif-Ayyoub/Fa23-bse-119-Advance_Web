import { supabase } from '../lib/supabase/client'
import { normalizeMediaUrl } from '../lib/utils/media'

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function makeAdSlug(title) {
  const base = slugify(title) || 'draft-ad'
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
  return `${base}-${suffix}`
}

export async function fetchLookupOptions() {
  const [packagesRes, categoriesRes, citiesRes] = await Promise.all([
    supabase.from('packages').select('id, name, duration_days, price, badge, is_featured, homepage_visibility').order('weight', { ascending: false }),
    supabase.from('categories').select('id, name, slug').eq('is_active', true).order('name', { ascending: true }),
    supabase.from('cities').select('id, name, slug').eq('is_active', true).order('name', { ascending: true }),
  ])

  if (packagesRes.error) throw packagesRes.error
  if (categoriesRes.error) throw categoriesRes.error
  if (citiesRes.error) throw citiesRes.error

  return {
    packages: packagesRes.data ?? [],
    categories: categoriesRes.data ?? [],
    cities: citiesRes.data ?? [],
  }
}

export async function fetchSellerContactPreview(userId) {
  const { data, error } = await supabase
    .from('seller_profiles')
    .select('display_name, business_name, phone, is_verified')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchOwnAds(userId) {
  const { data, error } = await supabase
    .from('ads')
    .select('id, title, slug, status, package_id, publish_at, expire_at, updated_at, created_at, rejection_reason')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function fetchAdById(adId, userId) {
  const { data, error } = await supabase
    .from('ads')
    .select('id, user_id, title, description, category_id, city_id, package_id, status, moderation_notes, rejection_reason, updated_at')
    .eq('id', adId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const mediaRes = await supabase
    .from('ad_media')
    .select('id, source_type, original_url, thumbnail_url, validation_status')
    .eq('ad_id', adId)
    .order('id', { ascending: true })

  if (mediaRes.error) throw mediaRes.error

  return {
    ...data,
    media: mediaRes.data ?? [],
  }
}

export async function fetchOwnNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, message, type, is_read, link, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) throw error
  return data ?? []
}

export async function createDraft({ userId, payload }) {
  const title = payload.title?.trim() || 'Untitled Draft'

  const insertPayload = {
    user_id: userId,
    title,
    slug: makeAdSlug(title),
    description: payload.description?.trim() || 'Draft description pending.',
    category_id: payload.categoryId ? Number(payload.categoryId) : null,
    city_id: payload.cityId ? Number(payload.cityId) : null,
    package_id: payload.packageId ? Number(payload.packageId) : null,
    status: 'draft',
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('ads').insert(insertPayload).select('id').single()
  if (error) throw error
  return data
}

export async function updateDraft({ adId, userId, payload, mediaUrls = [] }) {
  const updatePayload = {
    title: payload.title?.trim() || 'Untitled Draft',
    description: payload.description?.trim() || 'Draft description pending.',
    category_id: payload.categoryId ? Number(payload.categoryId) : null,
    city_id: payload.cityId ? Number(payload.cityId) : null,
    package_id: payload.packageId ? Number(payload.packageId) : null,
    updated_at: new Date().toISOString(),
  }

  const updateRes = await supabase
    .from('ads')
    .update(updatePayload)
    .eq('id', adId)
    .eq('user_id', userId)
    .select('id')
    .single()

  if (updateRes.error) throw updateRes.error

  const deleteRes = await supabase.from('ad_media').delete().eq('ad_id', adId)
  if (deleteRes.error) throw deleteRes.error

  const normalizedMedia = mediaUrls
    .map((item) => normalizeMediaUrl(item))
    .filter((item) => item.originalUrl)
    .map((item) => ({
      ad_id: adId,
      source_type: item.sourceType,
      original_url: item.originalUrl,
      thumbnail_url: item.thumbnailUrl,
      validation_status: item.valid ? 'valid' : 'invalid',
    }))

  if (normalizedMedia.length > 0) {
    const mediaRes = await supabase.from('ad_media').insert(normalizedMedia)
    if (mediaRes.error) throw mediaRes.error
  }

  return updateRes.data
}

export async function submitAdForModeration({ adId, userId }) {
  const nowIso = new Date().toISOString()

  const { data, error } = await supabase
    .from('ads')
    .update({
      status: 'submitted',
      updated_at: nowIso,
    })
    .eq('id', adId)
    .eq('user_id', userId)
    .in('status', ['draft', 'rejected', 'payment_pending'])
    .select('id, status')
    .single()

  if (error) throw error

  const historyRes = await supabase.from('ad_status_history').insert({
    ad_id: adId,
    previous_status: 'draft',
    new_status: 'submitted',
    changed_by: userId,
    note: 'Submitted by client for moderation review.',
    changed_at: nowIso,
  })

  if (historyRes.error) throw historyRes.error

  return data
}
