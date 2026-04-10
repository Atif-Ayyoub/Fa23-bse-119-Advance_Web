import { supabase } from '../lib/supabase/client'

export async function fetchAnalyticsSummary() {
  const [adsRes, paymentsRes, healthRes, packageRes, categoryRes, cityRes] = await Promise.all([
    supabase.from('ads').select('id, status, package_id, category_id, city_id, featured, admin_boost, publish_at, expire_at'),
    supabase.from('payments').select('id, amount, status, verified_at, created_at, ad_id, method'),
    supabase.from('system_health_logs').select('id, source, response_ms, checked_at, status').order('checked_at', { ascending: false }).limit(10),
    supabase.from('packages').select('id, name, weight, price, duration_days'),
    supabase.from('categories').select('id, name, slug'),
    supabase.from('cities').select('id, name, slug'),
  ])

  if (adsRes.error) throw adsRes.error
  if (paymentsRes.error) throw paymentsRes.error
  if (healthRes.error) throw healthRes.error
  if (packageRes.error) throw packageRes.error
  if (categoryRes.error) throw categoryRes.error
  if (cityRes.error) throw cityRes.error

  const ads = adsRes.data ?? []
  const payments = paymentsRes.data ?? []
  const packageMap = new Map((packageRes.data ?? []).map((item) => [item.id, item]))

  const listings = {
    totalAds: ads.length,
    activeAds: ads.filter((item) => item.status === 'published').length,
    pendingReviews: ads.filter((item) => ['submitted', 'under_review'].includes(item.status)).length,
    expiredAds: ads.filter((item) => item.status === 'expired').length,
  }

  const revenueByPackage = ads.reduce((acc, ad) => {
    const pkg = packageMap.get(ad.package_id)
    const key = pkg?.name ?? 'Unknown'
    acc[key] = (acc[key] ?? 0) + Number(pkg?.price ?? 0)
    return acc
  }, {})

  const verifiedPaymentsTotal = payments.filter((item) => item.status === 'verified').reduce((sum, item) => sum + Number(item.amount ?? 0), 0)
  const monthlyRevenue = payments
    .filter((item) => item.status === 'verified')
    .reduce((acc, item) => {
      const month = new Date(item.verified_at ?? item.created_at).toLocaleString('en-US', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] ?? 0) + Number(item.amount ?? 0)
      return acc
    }, {})

  const moderation = {
    approvalRate: payments.length ? Math.round((payments.filter((item) => item.status === 'verified').length / payments.length) * 100) : 0,
    rejectionRate: payments.length ? Math.round((payments.filter((item) => item.status === 'rejected').length / payments.length) * 100) : 0,
    flaggedAdsCount: ads.filter((item) => item.status === 'rejected').length,
  }

  const byCategory = ads.reduce((acc, ad) => {
    const category = (categoryRes.data ?? []).find((item) => item.id === ad.category_id)?.name ?? 'Uncategorized'
    acc[category] = (acc[category] ?? 0) + 1
    return acc
  }, {})

  const byCity = ads.reduce((acc, ad) => {
    const city = (cityRes.data ?? []).find((item) => item.id === ad.city_id)?.name ?? 'Unassigned'
    acc[city] = (acc[city] ?? 0) + 1
    return acc
  }, {})

  const operations = {
    scheduledJobSuccessCount: ads.filter((item) => item.status === 'published' && item.expire_at).length,
    dbHeartbeatLogs: healthRes.data ?? [],
    failedValidations: ads.filter((item) => item.status === 'rejected').length,
  }

  return {
    listings,
    revenueByPackage,
    verifiedPaymentsTotal,
    monthlyRevenue,
    moderation,
    byCategory,
    byCity,
    operations,
  }
}
