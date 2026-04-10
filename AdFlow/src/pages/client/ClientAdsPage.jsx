import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusTimeline } from '../../components/cards/StatusTimeline'
import { Button, Card, EmptyState, SectionHeading, Spinner, StatusPill } from '../../components/ui'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { fetchOwnAds, submitAdForModeration } from '../../services/adService'

export function ClientAdsPage() {
  const { user } = useAuth()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState('')

  const loadAds = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)

    try {
      const data = await fetchOwnAds(user.id)
      setAds(data)
    } catch (error) {
      setActionMessage(error.message ?? 'Unable to fetch ads.')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadAds()
  }, [loadAds])

  async function handleSubmit(adId) {
    if (!user?.id) return

    try {
      await submitAdForModeration({ adId, userId: user.id })
      setActionMessage('Ad submitted to moderation queue.')
      await loadAds()
    } catch (error) {
      setActionMessage(error.message ?? 'Submit failed.')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading title="My Ads" subtitle="Create drafts, edit listings, and submit for moderation." />

      {actionMessage ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {actionMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="grid min-h-[40vh] place-items-center">
          <Spinner className="h-6 w-6 text-brand-600" />
        </div>
      ) : ads.length === 0 ? (
        <Card>
          <EmptyState
            title="No ads created yet"
            description="Start with a draft and submit it for moderation when ready."
            action={
              <Link to={APP_ROUTES.CLIENT_ADS_NEW}>
                <Button>Create First Draft</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{ad.title}</h3>
                  <p className="text-xs text-slate-500">Updated: {new Date(ad.updated_at).toLocaleString()}</p>
                </div>
                <StatusPill status={ad.status} />
              </div>

              <StatusTimeline currentStatus={ad.status} />

              <div className="flex flex-wrap gap-2">
                <Link to={`${APP_ROUTES.CLIENT_ADS_NEW}?adId=${ad.id}`}>
                  <Button variant="secondary">Edit Draft</Button>
                </Link>

                {['draft', 'rejected', 'payment_pending'].includes(ad.status) ? (
                  <Button onClick={() => handleSubmit(ad.id)}>Submit For Review</Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
