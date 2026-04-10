import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, EmptyState, SectionHeading, Spinner } from '../../components/ui'
import { fetchAnalyticsSummary } from '../../services/analyticsService'

export function AdminAnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadAnalytics() {
      try {
        const summary = await fetchAnalyticsSummary()
        if (active) setData(summary)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAnalytics()

    return () => {
      active = false
    }
  }, [])

  const revenueByPackage = useMemo(() => {
    if (!data?.revenueByPackage) return []
    return Object.entries(data.revenueByPackage).map(([name, value]) => ({ name, value: Number(value.toFixed?.(2) ?? value) }))
  }, [data])

  const monthlyRevenue = useMemo(() => {
    if (!data?.monthlyRevenue) return []
    return Object.entries(data.monthlyRevenue).map(([name, value]) => ({ name, value: Number(value.toFixed?.(2) ?? value) }))
  }, [data])

  const byCategory = useMemo(() => {
    if (!data?.byCategory) return []
    return Object.entries(data.byCategory).map(([name, value]) => ({ name, value }))
  }, [data])

  const byCity = useMemo(() => {
    if (!data?.byCity) return []
    return Object.entries(data.byCity).map(([name, value]) => ({ name, value }))
  }, [data])

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading title="Analytics Dashboard" subtitle="Listings, revenue, moderation, taxonomy, and operations overview." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Total Ads</p><p className="mt-1 text-3xl font-semibold">{data?.listings.totalAds ?? 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Active Ads</p><p className="mt-1 text-3xl font-semibold">{data?.listings.activeAds ?? 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Pending Reviews</p><p className="mt-1 text-3xl font-semibold">{data?.listings.pendingReviews ?? 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Expired Ads</p><p className="mt-1 text-3xl font-semibold">{data?.listings.expiredAds ?? 0}</p></Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-[380px]">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Revenue by Package</h3>
          {revenueByPackage.length === 0 ? (
            <EmptyState title="No revenue data" description="Package revenue will appear once payments are verified." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPackage}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#1f6feb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="h-[380px]">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Verification Revenue Split</h3>
          <div className="flex h-full items-center justify-center">
            {revenueByPackage.length === 0 ? (
              <EmptyState title="No revenue breakdown" description="Verified payment totals will appear here." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueByPackage} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                    {revenueByPackage.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={['#1f6feb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-[360px]">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Monthly Revenue</h3>
          {monthlyRevenue.length === 0 ? (
            <EmptyState title="No monthly data" description="Monthly revenue will appear as verified payments accumulate." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Taxonomy Distribution</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-[260px] rounded-2xl border border-slate-200 p-3">
              <p className="mb-2 text-sm font-semibold text-slate-800">By Category</p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={byCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1458c8" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[260px] rounded-2xl border border-slate-200 p-3">
              <p className="mb-2 text-sm font-semibold text-slate-800">By City</p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={byCity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0f766e" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Operations & Health Logs</h3>
        {data?.operations.dbHeartbeatLogs?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Source</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Response ms</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.operations.dbHeartbeatLogs.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-slate-700">{item.source}</td>
                    <td className="px-3 py-2 text-slate-700">{item.status}</td>
                    <td className="px-3 py-2 text-slate-700">{item.response_ms ?? 'n/a'}</td>
                    <td className="px-3 py-2 text-slate-700">{new Date(item.checked_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No health logs" description="System heartbeat logs will be displayed here." />
        )}
      </Card>
    </div>
  )
}
