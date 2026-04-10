import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package2 } from 'lucide-react'
import { Badge, Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { fetchMarketplaceLookups } from '../../services/publishingService'

export function PackagesPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadPackages() {
      try {
        const lookups = await fetchMarketplaceLookups()
        if (active) setPackages(lookups.packages)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPackages()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading title="Packages" subtitle="Choose a listing tier with duration, visibility, and featured placement options." />
      {packages.length === 0 ? (
        <Card>
          <EmptyState title="No packages found" description="Add packages in the admin console to enable client selection." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    <Package2 size={14} />
                    Package Tier
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">{pkg.name}</h3>
                </div>
                {pkg.badge ? <Badge>{pkg.badge}</Badge> : null}
              </div>
              <p className="text-sm text-slate-600">Duration {pkg.duration_days} days · Weight {pkg.weight}</p>
              <p className="text-3xl font-semibold text-slate-900">${Number(pkg.price).toFixed(2)}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                {pkg.homepage_visibility ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Homepage visibility</span> : null}
                {pkg.is_featured ? <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">Featured eligible</span> : null}
              </div>
              <Link to="/register" className="inline-flex font-semibold text-brand-700 hover:text-brand-600">
                Create account to buy this package
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
