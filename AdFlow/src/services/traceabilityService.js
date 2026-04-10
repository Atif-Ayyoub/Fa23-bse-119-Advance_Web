import { supabase } from '../lib/supabase/client'

export async function createNotification(userId, title, message, type, link) {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    message,
    type,
    link,
  })

  if (error) throw error
}

export async function logAudit(actorId, actionType, targetType, targetId, oldValue, newValue) {
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

export async function recordStatusChange(adId, previousStatus, newStatus, changedBy, note) {
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

export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, message, type, is_read, link, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function fetchAuditLogs(filters = {}) {
  let query = supabase
    .from('audit_logs')
    .select('id, actor_id, action_type, target_type, target_id, old_value, new_value, created_at')
    .order('created_at', { ascending: false })
    .limit(filters.limit ?? 25)

  if (filters.actionType) query = query.eq('action_type', filters.actionType)
  if (filters.targetType) query = query.eq('target_type', filters.targetType)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function fetchStatusHistory(adId) {
  const { data, error } = await supabase
    .from('ad_status_history')
    .select('id, ad_id, previous_status, new_status, changed_by, note, changed_at')
    .eq('ad_id', adId)
    .order('changed_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function fetchRecentStatusHistory(limit = 20) {
  const { data, error } = await supabase
    .from('ad_status_history')
    .select('id, ad_id, previous_status, new_status, changed_by, note, changed_at')
    .order('changed_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}
