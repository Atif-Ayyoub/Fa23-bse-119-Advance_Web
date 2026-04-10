import { useEffect, useState } from 'react'
import { Flag, Share2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Card, EmptyState, SectionHeading, Spinner, StatusPill, Badge, Button } from '../../components/ui'
import { fetchPublicAdBySlug, fetchPublicAds } from '../../services/publishingService'

export function AdDetailsPage() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [relatedAds, setRelatedAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadDetails() {
      try {
        const [data, feed] = await Promise.all([fetchPublicAdBySlug(slug), fetchPublicAds()])
        if (active) {
          setItem(data)
          setRelatedAds(
            (feed ?? [])
              .filter((ad) => ad.slug !== slug)
              .filter((ad) => ad.category_id === data?.category_id || ad.city_id === data?.city_id)
              .slice(0, 3),
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDetails()

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      {!item ? (
        <Card>
          <EmptyState title="Ad not available" description="This ad is not published or has expired." />
        </Card>
      ) : (
        <>
          <SectionHeading title={item.title} subtitle={`Package: ${item.package_name} | Rank: ${item.rank_score}`} />
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex flex-wrap items-center gap-2">
                <StatusPill status="published" />
                {item.featured ? <Badge>Featured</Badge> : null}
              </div>
              <p className="text-xs text-slate-500">
                Live until: {item.expire_at ? new Date(item.expire_at).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-3">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="h-80 w-full rounded-2xl object-cover" />
                ) : (
                  <div className="grid h-80 place-items-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">No gallery image</div>
                )}
                <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => window.navigator.share?.({ title: item.title, url: window.location.href })}>
                    <Share2 size={16} className="mr-2" /> Share
                  </Button>
                  <Button variant="ghost" onClick={() => window.location.assign(`mailto:reports@adflowpro.example?subject=Report%20${encodeURIComponent(item.slug)}`)}>
                    <Flag size={16} className="mr-2" /> Report
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Card className="space-y-2 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-900">Seller Summary</p>
                  <p className="text-sm text-slate-600">{item.seller_name}</p>
                  {item.seller_business ? <p className="text-sm text-slate-600">{item.seller_business}</p> : null}
                  {item.seller_phone ? <p className="text-sm text-slate-600">{item.seller_phone}</p> : null}
                  {item.seller_verified ? <Badge>Verified Seller</Badge> : null}
                </Card>

                <Card className="space-y-2 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-900">Package Badge</p>
                  <Badge>{item.package_name}</Badge>
                  <p className="text-sm text-slate-600">Rank score {item.rank_score}</p>
                </Card>
              </div>
            </div>
          </Card>

          <Card className="space-y-3">
            <p className="text-lg font-semibold text-slate-900">Related Ads</p>
            {relatedAds.length === 0 ? (
              <EmptyState title="No related ads" description="Related listings are shown when more public ads share a category or city." />
            ) : (
              <div className="grid gap-3 md:grid-cols-3">
                {relatedAds.map((ad) => (
                  <div key={ad.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {ad.thumbnail_url ? <img src={ad.thumbnail_url} alt={ad.title} className="h-28 w-full object-cover" /> : null}
                    <div className="space-y-1 p-3">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">{ad.title}</p>
                      <p className="text-xs text-slate-500">Rank {ad.rank_score}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
