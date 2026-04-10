import { useCallback, useEffect, useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { Button, Card, Drawer, EmptyState, Input, SectionHeading, Spinner, StatusPill, Textarea } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import {
  fetchModerationHistory,
  fetchModerationQueue,
  flagDuplicateAd,
  reviewAdContent,
  saveModerationNote,
} from '../../services/moderationService'

export function ModeratorQueuePage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    categoryId: '',
    cityId: '',
    suspiciousOnly: false,
    duplicateOnly: false,
    submittedOnly: true,
  })
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState([])

  const loadQueue = useCallback(async () => {
    setLoading(true)

    try {
      const data = await fetchModerationQueue(filters)
      setItems(data)
      if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id)
      }
    } catch (error) {
      setFeedback(error.message ?? 'Unable to load moderation queue.')
    } finally {
      setLoading(false)
    }
  }, [filters, selectedId])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  const selectedAd = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId])

  async function handleReview(action) {
    if (!selectedAd || !user?.id) return

    setActionLoading(true)
    setFeedback('')

    try {
      await reviewAdContent(selectedAd.id, action, note, user.id)
      setFeedback(action === 'approve' ? 'Ad approved and moved to payment pending.' : 'Ad rejected with note.')
      setNote('')
      await loadQueue()
    } catch (error) {
      setFeedback(error.message ?? 'Moderation action failed.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDuplicateFlag() {
    if (!selectedAd || !user?.id) return

    try {
      await flagDuplicateAd(selectedAd.id, user.id)
      setFeedback('Duplicate suspicion logged.')
    } catch (error) {
      setFeedback(error.message ?? 'Could not flag duplicate.')
    }
  }

  async function handleSaveNote() {
    if (!selectedAd || !user?.id) return

    try {
      await saveModerationNote(selectedAd.id, note, user.id)
      setFeedback('Internal moderation note saved.')
      await loadQueue()
    } catch (error) {
      setFeedback(error.message ?? 'Could not save note.')
    }
  }

  async function openHistory() {
    if (!selectedAd) return
    const data = await fetchModerationHistory(selectedAd.id)
    setHistoryItems(data)
    setHistoryOpen(true)
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Moderation Review Queue"
        subtitle="Validate content quality, policy compliance, and media URLs."
      />

      {feedback ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {feedback}
        </div>
      ) : null}

      <Card className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-1">
          <p className="text-sm font-semibold text-slate-800">Queue Filters</p>

          <Input
            label="Category ID"
            placeholder="e.g. 2"
            value={filters.categoryId}
            onChange={(event) => setFilters((value) => ({ ...value, categoryId: event.target.value }))}
          />

          <Input
            label="City ID"
            placeholder="e.g. 5"
            value={filters.cityId}
            onChange={(event) => setFilters((value) => ({ ...value, cityId: event.target.value }))}
          />

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={filters.suspiciousOnly}
              onChange={(event) => setFilters((value) => ({ ...value, suspiciousOnly: event.target.checked }))}
            />
            Suspicious media only
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={filters.duplicateOnly}
              onChange={(event) => setFilters((value) => ({ ...value, duplicateOnly: event.target.checked }))}
            />
            Duplicate candidates
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={filters.submittedOnly}
              onChange={(event) => setFilters((value) => ({ ...value, submittedOnly: event.target.checked }))}
            />
            Newest submitted only
          </label>

          {loading ? (
            <div className="grid min-h-[20vh] place-items-center">
              <Spinner className="h-5 w-5 text-brand-600" />
            </div>
          ) : items.length === 0 ? (
            <EmptyState title="Queue empty" description="No submitted ads matched the selected filters." />
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-xl border p-3 text-left ${
                    selectedId === item.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <StatusPill status={item.status} />
                    <span className="text-xs text-slate-500">#{item.id}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 xl:col-span-2">
          {!selectedAd ? (
            <EmptyState title="No ad selected" description="Select an ad from the queue to review content and media." />
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedAd.title}</h3>
                  <p className="text-xs text-slate-500">Slug: {selectedAd.slug}</p>
                </div>
                <StatusPill status={selectedAd.status} />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-800">Thumbnail Preview Panel</p>
                {selectedAd.media.length === 0 ? (
                  <EmptyState title="No media attached" description="Ask client to provide valid media URLs." />
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {selectedAd.media.map((item) => (
                      <m.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <div className="h-24 bg-slate-200">
                          {item.thumbnail_url ? (
                            <img src={item.thumbnail_url} alt="Media" className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full place-items-center text-xs font-semibold text-slate-500">
                              {item.source_type}
                            </div>
                          )}
                        </div>
                        <div className="px-2 py-1.5 text-[11px] text-slate-600">
                          {item.validation_status} - {item.source_type}
                        </div>
                      </m.div>
                    ))}
                  </div>
                )}
              </div>

              <Textarea
                label="Moderation Notes"
                placeholder="Add policy notes, rejection reason, or internal context..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleReview('approve')} disabled={actionLoading}>
                  Approve To Payment Pending
                </Button>
                <Button variant="secondary" onClick={() => handleReview('reject')} disabled={actionLoading}>
                  Reject With Reason
                </Button>
                <Button variant="ghost" onClick={handleDuplicateFlag}>
                  Flag Duplicate
                </Button>
                <Button variant="ghost" onClick={handleSaveNote}>
                  Save Internal Note
                </Button>
                <Button variant="ghost" onClick={openHistory}>
                  Moderation History
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <Drawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} title="Moderation History">
        {historyItems.length === 0 ? (
          <EmptyState title="No history" description="This ad does not have status history entries yet." />
        ) : (
          <div className="space-y-2">
            {historyItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {item.previous_status || 'unknown'} {'->'} {item.new_status}
                </p>
                <p className="mt-1 text-sm text-slate-700">{item.note || 'No note provided.'}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(item.changed_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  )
}
