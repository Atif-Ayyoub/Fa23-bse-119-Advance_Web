import { useEffect, useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import { Button, Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { staggerContainer, staggerItem } from '../../animations/variants'
import { fetchMarketplaceLookups, fetchPublicAds } from '../../services/publishingService'

export function HomePage() {
  const [ads, setAds] = useState([])
  const [packages, setPackages] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadHomeData() {
      try {
        const [feed, lookups] = await Promise.all([fetchPublicAds(), fetchMarketplaceLookups()])
        if (!active) return
        setAds(feed)
        setPackages(lookups.packages)
        setQuestions(lookups.questions)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadHomeData()

    return () => {
      active = false
    }
  }, [])

  const featuredAds = useMemo(() => ads.filter((item) => item.featured).slice(0, 5), [ads])
  const recentAds = useMemo(() => ads.slice(0, 6), [ads])
  const trustBadges = [
    { icon: ShieldCheck, label: 'Moderated workflow' },
    { icon: BadgeCheck, label: 'Verified payments' },
    { icon: Sparkles, label: 'Premium placement' },
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <m.div variants={staggerContainer} initial="hidden" animate="visible" className="hero-grid">
          <div>
            <m.p variants={staggerItem} className="hero-kicker">
              Premium moderated ads marketplace
            </m.p>
            <m.h1 variants={staggerItem} className="hero-title">
              Discover high-trust listings with policy-first publishing and role-aware workflows.
            </m.h1>
            <m.p variants={staggerItem} className="hero-description">
              AdFlow Pro combines curated moderation, payment verification, scheduling, analytics, and premium placement into one polished marketplace.
            </m.p>
            <m.div variants={staggerItem} className="hero-actions">
              <Link to={APP_ROUTES.EXPLORE}>
                <Button variant="secondary">
                  Explore Ads <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to={APP_ROUTES.PACKAGES}>
                <Button className="btn--ghost" style={{ color: '#fff', borderColor: 'rgba(148,163,184,0.65)' }}>
                  View Packages
                </Button>
              </Link>
            </m.div>
            <m.div variants={staggerItem} className="hero-badges">
              {trustBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div key={badge.label} className="hero-badge">
                    <Icon size={14} />
                    {badge.label}
                  </div>
                )
              })}
            </m.div>
          </div>

          <div className="hero-pulse">
            <p className="hero-pulse-title">Live pulse</p>
            <div className="hero-pulse-grid">
              <div className="hero-pulse-item">
                <p>Featured ads</p>
                <p className="hero-pulse-value">{featuredAds.length}</p>
              </div>
              <div className="hero-pulse-item">
                <p>Recent live</p>
                <p className="hero-pulse-value">{recentAds.length}</p>
              </div>
              <div className="hero-pulse-item hero-pulse-item--wide">
                <p>Top package preview</p>
                <p className="hero-pulse-value" style={{ fontSize: '1.15rem' }}>{packages[0]?.name ?? 'Packages loading'}</p>
              </div>
            </div>
          </div>
        </m.div>
      </section>

      {loading ? (
        <div className="grid min-h-[20vh] place-items-center">
          <Spinner className="h-6 w-6 text-brand-600" />
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <SectionHeading title="Featured Ads" subtitle="Spotlight placements and premium listings" />
            {featuredAds.length === 0 ? (
              <Card>
                <EmptyState title="No featured ads yet" description="Featured content will appear after payment verification and admin placement." />
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {featuredAds.map((ad) => (
                  <Card key={ad.id} className="overflow-hidden p-0">
                    {ad.thumbnail_url ? (
                      <img src={ad.thumbnail_url} alt={ad.title} className="h-44 w-full object-cover" />
                    ) : (
                      <div className="grid h-44 place-items-center bg-slate-100 text-sm font-semibold text-slate-500">No thumbnail</div>
                    )}
                    <div className="space-y-2 p-4">
                      <p className="line-clamp-2 text-base font-semibold text-slate-900">{ad.title}</p>
                      <p className="text-xs text-slate-500">Rank score {ad.rank_score}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <SectionHeading title="Recent Ads" subtitle="Fresh listings with active public visibility" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentAds.map((ad) => (
                <Card key={ad.id} className="group overflow-hidden p-0">
                  {ad.thumbnail_url ? (
                    <img src={ad.thumbnail_url} alt={ad.title} className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="grid h-48 place-items-center bg-slate-100 text-sm font-semibold text-slate-500">No thumbnail</div>
                  )}
                  <div className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-2 font-semibold text-slate-900">{ad.title}</p>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">Live</span>
                    </div>
                    <p className="line-clamp-3 text-sm text-slate-600">{ad.description}</p>
                    <Link to={`/ads/${ad.slug}`} className="inline-flex text-sm font-semibold text-brand-700 hover:text-brand-600">
                      View details
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="home-grid-2">
            <Card className="space-y-4">
              <SectionHeading title="Packages Preview" subtitle="Premium durations and visibility tiers" />
              <div className="grid gap-3 md:grid-cols-2">
                {packages.slice(0, 4).map((pkg) => (
                  <div key={pkg.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{pkg.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{pkg.duration_days} days · ${Number(pkg.price).toFixed(2)}</p>
                    {pkg.badge ? <p className="mt-2 text-xs font-semibold text-brand-700">{pkg.badge}</p> : null}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <SectionHeading title="Learning Question Widget" subtitle="Helpful answers for browsing and publishing" />
              <div className="space-y-3">
                {questions.length === 0 ? (
                  <EmptyState title="Questions loading" description="FAQ-style learning content will appear here once seeded." />
                ) : (
                  questions.map((q) => (
                    <details key={q.id} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{q.question}</summary>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{q.answer}</p>
                    </details>
                  ))
                )}
              </div>
            </Card>
          </section>

          <section className="cta-strip">
            <div>
              <div>
                <p className="hero-kicker" style={{ color: '#dbeafe' }}>Ready to publish</p>
                <h2 className="text-2xl font-semibold">Create your ad draft and move through the moderation pipeline.</h2>
              </div>
              <Link to={APP_ROUTES.REGISTER}>
                <Button variant="secondary">Start Now</Button>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
