import { supabase } from '../lib/supabase/client'

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

async function createNotification({ userId, title, message, type, link }) {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    message,
    type,
    link,
  })

  if (error) throw error
}

export async function isDuplicateTransactionRef(reference) {
  const normalizedRef = String(reference ?? '').trim()
  if (!normalizedRef) return false

  const { data, error } = await supabase
    .from('payments')
    .select('id')
    .eq('transaction_ref', normalizedRef)
    .limit(1)

  if (error) throw error
  return (data ?? []).length > 0
}

export async function fetchOwnPayments(clientUserId) {
  const adsRes = await supabase.from('ads').select('id').eq('user_id', clientUserId)
  if (adsRes.error) throw adsRes.error

  const adIds = (adsRes.data ?? []).map((item) => item.id)
  if (adIds.length === 0) return []

  const { data, error } = await supabase
    .from('payments')
    .select('id, ad_id, amount, method, transaction_ref, sender_name, screenshot_url, status, created_at, verified_at')
    .in('ad_id', adIds)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function fetchAdminPaymentQueue() {
  const { data, error } = await supabase
    .from('payments')
    .select('id, ad_id, amount, method, transaction_ref, sender_name, screenshot_url, status, created_at, verified_at, verified_by')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error

  const refs = new Map()
  for (const item of data ?? []) {
    const key = String(item.transaction_ref ?? '').trim().toLowerCase()
    if (!key) continue
    refs.set(key, (refs.get(key) ?? 0) + 1)
  }

  return (data ?? []).map((item) => {
    const key = String(item.transaction_ref ?? '').trim().toLowerCase()
    return {
      ...item,
      duplicateReference: key ? (refs.get(key) ?? 0) > 1 : false,
    }
  })
}

export async function submitPaymentProof(adId, payload, clientUserId) {
  const adRes = await supabase.from('ads').select('id, user_id, status').eq('id', adId).single()
  if (adRes.error) throw adRes.error

  if (adRes.data.user_id !== clientUserId) {
    throw new Error('You can only submit payment for your own ad.')
  }

  if (!['payment_pending', 'rejected', 'payment_submitted'].includes(adRes.data.status)) {
    throw new Error('This ad is not ready for payment submission.')
  }

  const duplicate = await isDuplicateTransactionRef(payload.transactionRef)
  if (duplicate) {
    throw new Error('Duplicate transaction reference detected. Please verify and try again.')
  }

  const insertRes = await supabase
    .from('payments')
    .insert({
      ad_id: adId,
      amount: Number(payload.amount),
      method: payload.method,
      transaction_ref: payload.transactionRef.trim(),
      sender_name: payload.senderName.trim(),
      screenshot_url: payload.screenshotUrl?.trim() || null,
      status: 'pending',
    })
    .select('id, status')
    .single()

  if (insertRes.error) throw insertRes.error

  const updateRes = await supabase
    .from('ads')
    .update({ status: 'payment_submitted', updated_at: new Date().toISOString() })
    .eq('id', adId)
    .single()

  if (updateRes.error) throw updateRes.error

  await appendStatusHistory({
    adId,
    previousStatus: adRes.data.status,
    newStatus: 'payment_submitted',
    changedBy: clientUserId,
    note: 'Client submitted payment proof.',
  })

  await createNotification({
    userId: clientUserId,
    title: 'Payment Submitted',
    message: 'Your payment proof was submitted and is awaiting admin verification.',
    type: 'payment_submitted',
    link: '/client/payments',
  })

  return insertRes.data
}

export async function verifyPayment(paymentId, actorId, remark = '') {
  const paymentRes = await supabase
    .from('payments')
    .select('id, ad_id, status, transaction_ref')
    .eq('id', paymentId)
    .single()

  if (paymentRes.error) throw paymentRes.error

  const adRes = await supabase.from('ads').select('id, user_id, status').eq('id', paymentRes.data.ad_id).single()
  if (adRes.error) throw adRes.error

  const nowIso = new Date().toISOString()
  const updatePaymentRes = await supabase
    .from('payments')
    .update({
      status: 'verified',
      verified_by: actorId,
      verified_at: nowIso,
    })
    .eq('id', paymentId)

  if (updatePaymentRes.error) throw updatePaymentRes.error

  const updateAdRes = await supabase
    .from('ads')
    .update({ status: 'payment_verified', updated_at: nowIso })
    .eq('id', paymentRes.data.ad_id)

  if (updateAdRes.error) throw updateAdRes.error

  await appendStatusHistory({
    adId: paymentRes.data.ad_id,
    previousStatus: adRes.data.status,
    newStatus: 'payment_verified',
    changedBy: actorId,
    note: remark || 'Payment verified by admin.',
  })

  await createAuditLog({
    actorId,
    actionType: 'payment_verified',
    targetType: 'payment',
    targetId: paymentId,
    oldValue: { status: paymentRes.data.status },
    newValue: { status: 'verified', remark },
  })

  await createNotification({
    userId: adRes.data.user_id,
    title: 'Payment Verified',
    message: 'Your payment was verified. Your ad is now eligible for publishing.',
    type: 'payment_verified',
    link: '/client/payments',
  })
}

export async function rejectPayment(paymentId, reason, actorId) {
  const paymentRes = await supabase
    .from('payments')
    .select('id, ad_id, status')
    .eq('id', paymentId)
    .single()

  if (paymentRes.error) throw paymentRes.error

  const adRes = await supabase.from('ads').select('id, user_id, status').eq('id', paymentRes.data.ad_id).single()
  if (adRes.error) throw adRes.error

  const nowIso = new Date().toISOString()
  const updatePaymentRes = await supabase
    .from('payments')
    .update({
      status: 'rejected',
      verified_by: actorId,
      verified_at: nowIso,
    })
    .eq('id', paymentId)

  if (updatePaymentRes.error) throw updatePaymentRes.error

  const updateAdRes = await supabase
    .from('ads')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      updated_at: nowIso,
    })
    .eq('id', paymentRes.data.ad_id)

  if (updateAdRes.error) throw updateAdRes.error

  await appendStatusHistory({
    adId: paymentRes.data.ad_id,
    previousStatus: adRes.data.status,
    newStatus: 'rejected',
    changedBy: actorId,
    note: reason,
  })

  await createAuditLog({
    actorId,
    actionType: 'payment_rejected',
    targetType: 'payment',
    targetId: paymentId,
    oldValue: { status: paymentRes.data.status },
    newValue: { status: 'rejected', reason },
  })

  await createNotification({
    userId: adRes.data.user_id,
    title: 'Payment Rejected',
    message: `Your payment was rejected: ${reason}`,
    type: 'payment_rejected',
    link: '/client/payments',
  })
}
