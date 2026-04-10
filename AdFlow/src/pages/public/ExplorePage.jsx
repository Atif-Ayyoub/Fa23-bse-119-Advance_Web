import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Grid2X2, ListFilter, Search, SlidersHorizontal } from 'lucide-react'
import { Card, Drawer, EmptyState, Input, SectionHeading, Spinner, StatusPill } from '../../components/ui'
import { fetchMarketplaceLookups, fetchPublicAds } from '../../services/publishingService'

export function ExplorePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [cities, setCities] = useState([])
  const [query, setQuery] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [citySlug, setCitySlug] = useState('')
  const [sortBy, setSortBy] = useState('rank')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const pageSize = 9

  useEffect(() => {
    let active = true

    async function loadPublicFeed() {
      try {
        const [feed, lookups] = await Promise.all([fetchPublicAds(), fetchMarketplaceLookups()])
        if (active) {
          setItems(feed)
          setCategories(lookups.categories)
          setCities(lookups.cities)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPublicFeed()

    return () => {
      active = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items
      .filter((item) => {
        if (!normalizedQuery) return true
        return [item.title, item.description, item.package_name].some((value) => value?.toLowerCase().includes(normalizedQuery))
      })
      .filter((item) => (categorySlug ? categories.find((category) => category.slug === categorySlug)?.id === item.category_id : true))
      .filter((item) => (citySlug ? cities.find((city) => city.slug === citySlug)?.id === item.city_id : true))
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.publish_at).getTime() - new Date(a.publish_at).getTime()
        if (sortBy === 'price') return Number(b.package_price ?? 0) - Number(a.package_price ?? 0)
        return b.rank_score - a.rank_score
      })
  }, [categorySlug, categories, citySlug, cities, items, query, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:px-6">
        <SectionHeading title="Explore Listings" subtitle="Discover live ads with premium filters and ranking." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse space-y-3">
              <div className="h-44 rounded-xl bg-slate-200" />
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-5/6 rounded bg-slate-200" />
            </Card>
          ))}
        </div>
        <div className="grid place-items-center py-4">
          <Spinner className="h-6 w-6 text-brand-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          title="Explore Listings"
          subtitle="Public feed filtered by publish and expiry windows, ranked by package, freshness, and placement."
        />
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="hidden grid-cols-4 gap-3 lg:grid">
        <Input label="Search" placeholder="Keyword search" value={query} onChange={(event) => setQuery(event.target.value)} />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">City</span>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" value={citySlug} onChange={(event) => setCitySlug(event.target.value)}>
            <option value="">All cities</option>
            {cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Sort</span>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="rank">Top rank</option>
            <option value="newest">Newest</option>
            <option value="price">Package price</option>
          </select>
        </label>
      </div>

      <Drawer isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Search</span>
            <input className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Keyword search" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">City</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" value={citySlug} onChange={(event) => setCitySlug(event.target.value)}>
              <option value="">All cities</option>
              {cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Sort</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="rank">Top rank</option>
              <option value="newest">Newest</option>
              <option value="price">Package price</option>
            </select>
          </label>
        </div>
      </Drawer>

      {filteredItems.length === 0 ? (
        <Card>
          <EmptyState title="No live ads" description="Try a different keyword, category, or city filter." />
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 text-sm text-slate-600">
            <p>{filteredItems.length} live ads found</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <Grid2X2 size={14} /> Active only
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden p-0 transition">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                ) : (
                  <div className="grid h-44 place-items-center bg-slate-100 text-sm font-semibold text-slate-500">No thumbnail</div>
                )}

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <StatusPill status="published" />
                  </div>
                  <p className="text-xs text-slate-500">Package: {item.package_name} | Rank: {item.rank_score}</p>
                  <p className="line-clamp-3 text-sm text-slate-600">{item.description}</p>
                  <Link to={`/ads/${item.slug}`} className="inline-flex text-sm font-semibold text-brand-700 hover:text-brand-600">
                    View details
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              <ListFilter size={16} /> Previous
            </button>
            <p className="text-sm text-slate-600">Page {page} of {pageCount}</p>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(value + 1, pageCount))}
              disabled={page === pageCount}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Next <Search size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
