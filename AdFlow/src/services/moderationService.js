import { supabase } from '../lib/supabase/client'

export async function fetchModerationQueue(filters = {}) {
  let query = supabase
    .from('ads')
    .select('id, title, slug, status, category_id, city_id, created_at, updated_at, moderation_notes, rejection_reason')
    .in('status', ['submitted', 'under_review'])
    .order('updated_at', { ascending: false })

  if (filters.categoryId) {
    query = query.eq('category_id', Number(filters.categoryId))
  }

  if (filters.cityId) {
    query = query.eq('city_id', Number(filters.cityId))
  }

  const { data, error } = await query
  if (error) throw error

  const ads = data ?? []

  const withMedia = await Promise.all(
    ads.map(async (ad) => {
      const mediaRes = await supabase
        .from('ad_media')
        .select('id, source_type, original_url, thumbnail_url, validation_status')
        .eq('ad_id', ad.id)

      if (mediaRes.error) throw mediaRes.error

      return {
        ...ad,
        media: mediaRes.data ?? [],
      }
    }),
  )

  if (filters.suspiciousOnly) {
    return withMedia.filter((ad) => ad.media.some((item) => item.validation_status === 'invalid'))
  }

  if (filters.duplicateOnly) {
    const counts = withMedia.reduce((acc, ad) => {
      const key = ad.title.trim().toLowerCase()
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})

    return withMedia.filter((ad) => counts[ad.title.trim().toLowerCase()] > 1)
  }

  if (filters.submittedOnly) {
    return withMedia.filter((ad) => ad.status === 'submitted')
  }

  return withMedia
}

export async function saveModerationNote(adId, note, actorId) {
  const updateRes = await supabase
    .from('ads')
    .update({
      moderation_notes: note,
      updated_at: new Date().toISOString(),
    })
    .eq('id', adId)

  if (updateRes.error) throw updateRes.error

  await createAuditLog({
    actorId,
    actionType: 'moderation_note_added',
    targetType: 'ad',
    targetId: adId,
    oldValue: null,
    newValue: { note },
  })
}

export async function appendStatusHistory({ adId, previousStatus, newStatus, changedBy, note }) {
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

export async function createAuditLog({ actorId, actionType, targetType, targetId, oldValue, newValue }) {
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

export async function reviewAdContent(adId, action, note, actorId) {
  const nextStatus = action === 'approve' ? 'payment_pending' : 'rejected'

  const currentRes = await supabase.from('ads').select('status, moderation_notes, rejection_reason').eq('id', adId).single()
  if (currentRes.error) throw currentRes.error

  const oldStatus = currentRes.data.status

  const { error: updateError } = await supabase
    .from('ads')
    .update({
      status: nextStatus,
      moderation_notes: note || currentRes.data.moderation_notes,
      rejection_reason: action === 'reject' ? note : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', adId)

  if (updateError) throw updateError

  await appendStatusHistory({
    adId,
    previousStatus: oldStatus,
    newStatus: nextStatus,
    changedBy: actorId,
    note,
  })

  await createAuditLog({
    actorId,
    actionType: action === 'approve' ? 'moderation_approved' : 'moderation_rejected',
    targetType: 'ad',
    targetId: adId,
    oldValue: { status: oldStatus },
    newValue: { status: nextStatus, note },
  })
}

export async function flagDuplicateAd(adId, actorId) {
  await createAuditLog({
    actorId,
    actionType: 'duplicate_flagged',
    targetType: 'ad',
    targetId: adId,
    oldValue: null,
    newValue: { flagged: true },
  })
}

export async function fetchModerationHistory(adId) {
  const { data, error } = await supabase
    .from('ad_status_history')
    .select('id, previous_status, new_status, note, changed_at, changed_by')
    .eq('ad_id', adId)
    .order('changed_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
