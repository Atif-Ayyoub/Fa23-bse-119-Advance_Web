import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { fetchMarketplaceLookups, fetchPublicAds } from '../../services/publishingService'

export function CityPage() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState(null)
  const [ads, setAds] = useState([])

  useEffect(() => {
    let active = true

    async function loadCity() {
      try {
        const [lookups, feed] = await Promise.all([fetchMarketplaceLookups(), fetchPublicAds()])
        if (!active) return
        const nextCity = lookups.cities.find((item) => item.slug === slug) ?? null
        setCity(nextCity)
        setAds(feed.filter((item) => item.city_id === nextCity?.id))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCity()

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading title={city?.name ?? 'City'} subtitle={`Browse active ads in the ${slug} city view.`} />
      {ads.length === 0 ? (
        <Card>
          <EmptyState title="No listings in this city" description="Active ads will appear here when they match the city filter." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden p-0">
              {ad.thumbnail_url ? <img src={ad.thumbnail_url} alt={ad.title} className="h-44 w-full object-cover" /> : null}
              <div className="space-y-2 p-4">
                <p className="text-lg font-semibold text-slate-900">{ad.title}</p>
                <p className="line-clamp-3 text-sm text-slate-600">{ad.description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
