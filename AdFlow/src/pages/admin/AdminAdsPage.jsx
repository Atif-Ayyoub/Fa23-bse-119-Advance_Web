import { useCallback, useEffect, useState } from 'react'
import { Button, Card, EmptyState, Input, SectionHeading, Spinner, StatusPill } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { fetchAdminPublishableAds, publishAd, updateAdminPlacement } from '../../services/publishingService'

export function AdminAdsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [scheduleMap, setScheduleMap] = useState({})
  const [placementMap, setPlacementMap] = useState({})

  const loadAds = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminPublishableAds()
      setItems(data)

      const placementDefaults = {}
      for (const ad of data) {
        placementDefaults[ad.id] = {
          featured: Boolean(ad.featured),
          adminBoost: Number(ad.admin_boost ?? 0),
        }
      }
      setPlacementMap(placementDefaults)
    } catch (error) {
      setMessage(error.message ?? 'Unable to load publish queue.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAds()
  }, [loadAds])

  async function handlePublishNow(adId) {
    if (!user?.id) return
    setMessage('')

    try {
      await publishAd(adId, user.id)
      setMessage('Ad published successfully.')
      await loadAds()
    } catch (error) {
      setMessage(error.message ?? 'Publish failed.')
    }
  }

  async function handleSchedule(adId) {
    if (!user?.id) return
    const scheduleAt = scheduleMap[adId]

    if (!scheduleAt) {
      setMessage('Select a schedule datetime first.')
      return
    }

    try {
      await publishAd(adId, user.id, scheduleAt)
      setMessage('Ad scheduled successfully.')
      await loadAds()
    } catch (error) {
      setMessage(error.message ?? 'Scheduling failed.')
    }
  }

  async function handlePlacementSave(adId) {
    if (!user?.id) return

    try {
      await updateAdminPlacement(adId, placementMap[adId], user.id)
      setMessage('Placement controls saved.')
      await loadAds()
    } catch (error) {
      setMessage(error.message ?? 'Could not save placement changes.')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Admin Ads"
        subtitle="Publish now or schedule later with featured placement and rank control knobs."
      />

      {message ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{message}</div>
      ) : null}

      {loading ? (
        <div className="grid min-h-[60vh] place-items-center">
          <Spinner className="h-6 w-6 text-brand-600" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState title="No publishable ads" description="Ads become publishable after payment verification." />
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((ad) => (
            <Card key={ad.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{ad.title}</h3>
                  <p className="text-xs text-slate-500">
                    Package: {ad.package_name} | Weight: {ad.package_weight} | Rank Score: {ad.rank_score}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2">
                  {ad.seller_verified ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Verified Seller
                    </span>
                  ) : null}
                  <StatusPill status={ad.status} />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">Publish Controls</p>
                  <Button onClick={() => handlePublishNow(ad.id)} disabled={ad.status !== 'payment_verified'}>
                    Publish Now
                  </Button>

                  <Input
                    label="Schedule Datetime"
                    type="datetime-local"
                    value={scheduleMap[ad.id] ?? ''}
                    onChange={(event) =>
                      setScheduleMap((value) => ({
                        ...value,
                        [ad.id]: event.target.value,
                      }))
                    }
                  />
                  <Button variant="secondary" onClick={() => handleSchedule(ad.id)} disabled={ad.status !== 'payment_verified'}>
                    Schedule Later
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">Featured and Boost</p>
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(placementMap[ad.id]?.featured)}
                      onChange={(event) =>
                        setPlacementMap((value) => ({
                          ...value,
                          [ad.id]: {
                            ...value[ad.id],
                            featured: event.target.checked,
                          },
                        }))
                      }
                    />
                    Featured listing
                  </label>
                  <Input
                    label="Admin Boost"
                    type="number"
                    value={placementMap[ad.id]?.adminBoost ?? 0}
                    onChange={(event) =>
                      setPlacementMap((value) => ({
                        ...value,
                        [ad.id]: {
                          ...value[ad.id],
                          adminBoost: Number(event.target.value),
                        },
                      }))
                    }
                  />
                  <Button variant="ghost" onClick={() => handlePlacementSave(ad.id)}>
                    Save Placement
                  </Button>
                </div>

                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">Schedule Snapshot</p>
                  <p className="text-xs text-slate-600">Publish At: {ad.publish_at ? new Date(ad.publish_at).toLocaleString() : 'Not set'}</p>
                  <p className="text-xs text-slate-600">Expire At: {ad.expire_at ? new Date(ad.expire_at).toLocaleString() : 'Not set'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
