import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PackageCard } from '../../components/cards/PackageCard'
import { StatusTimeline } from '../../components/cards/StatusTimeline'
import { Button, Card, EmptyState, Input, SectionHeading, Spinner, Textarea } from '../../components/ui'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { adDraftSchema, adSubmitSchema } from '../../lib/validators/adSchema'
import { normalizeMediaUrl } from '../../lib/utils/media'
import {
  createDraft,
  fetchAdById,
  fetchLookupOptions,
  fetchSellerContactPreview,
  submitAdForModeration,
  updateDraft,
} from '../../services/adService'

const STEPS = ['Basics', 'Location & Package', 'Media & Review']

export function ClientAdCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const adIdParam = searchParams.get('adId')
  const [adId, setAdId] = useState(adIdParam ? Number(adIdParam) : null)
  const [currentStep, setCurrentStep] = useState(0)
  const [lookup, setLookup] = useState({ packages: [], categories: [], cities: [] })
  const [sellerPreview, setSellerPreview] = useState(null)
  const [mediaText, setMediaText] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [autosaveMessage, setAutosaveMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(adDraftSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      cityId: '',
      packageId: '',
      mediaUrls: [],
    },
  })

  const watchedStatus = watch()

  const normalizedMedia = useMemo(() => {
    return mediaText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((url) => normalizeMediaUrl(url))
  }, [mediaText])

  const progress = ((currentStep + 1) / STEPS.length) * 100

  useEffect(() => {
    let active = true

    async function boot() {
      if (!user?.id) return

      try {
        const [lookupData, sellerData] = await Promise.all([
          fetchLookupOptions(),
          fetchSellerContactPreview(user.id),
        ])

        if (!active) return

        setLookup(lookupData)
        setSellerPreview(sellerData)

        if (adIdParam) {
          const ad = await fetchAdById(Number(adIdParam), user.id)
          if (ad && active) {
            reset({
              title: ad.title ?? '',
              description: ad.description ?? '',
              categoryId: ad.category_id ?? '',
              cityId: ad.city_id ?? '',
              packageId: ad.package_id ?? '',
              mediaUrls: ad.media?.map((item) => item.original_url) ?? [],
            })
            setMediaText((ad.media ?? []).map((item) => item.original_url).join('\n'))
          }
        }
      } catch (error) {
        setToastMessage(error.message ?? 'Unable to load form data.')
      } finally {
        if (active) setLoading(false)
      }
    }

    boot()

    return () => {
      active = false
    }
  }, [adIdParam, reset, user?.id])

  useEffect(() => {
    if (!adId || !isDirty || !user?.id) return

    const timeout = setTimeout(async () => {
      try {
        setSaving(true)
        await updateDraft({
          adId,
          userId: user.id,
          payload: getValues(),
          mediaUrls: mediaText
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
        })
        setAutosaveMessage(`Autosaved at ${new Date().toLocaleTimeString()}`)
      } catch {
        setAutosaveMessage('Autosave failed. Please save draft manually.')
      } finally {
        setSaving(false)
      }
    }, 1300)

    return () => clearTimeout(timeout)
  }, [adId, getValues, isDirty, mediaText, user?.id, watchedStatus])

  async function handleDraftSave() {
    if (!user?.id) return

    setSaving(true)
    setToastMessage('')

    try {
      const payload = getValues()
      const mediaUrls = mediaText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      if (!adId) {
        const created = await createDraft({ userId: user.id, payload })
        setAdId(created.id)
        navigate(`${APP_ROUTES.CLIENT_ADS_NEW}?adId=${created.id}`, { replace: true })
        await updateDraft({ adId: created.id, userId: user.id, payload, mediaUrls })
      } else {
        await updateDraft({ adId, userId: user.id, payload, mediaUrls })
      }

      setToastMessage('Draft saved successfully.')
    } catch (error) {
      setToastMessage(error.message ?? 'Unable to save draft.')
    } finally {
      setSaving(false)
    }
  }

  async function onSubmit(values) {
    if (!user?.id) return

    setSubmitLoading(true)
    setToastMessage('')

    try {
      const mediaUrls = mediaText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      adSubmitSchema.parse({ ...values, mediaUrls })

      let workingAdId = adId

      if (!workingAdId) {
        const created = await createDraft({ userId: user.id, payload: values })
        workingAdId = created.id
      }

      await updateDraft({
        adId: workingAdId,
        userId: user.id,
        payload: values,
        mediaUrls,
      })

      await submitAdForModeration({ adId: workingAdId, userId: user.id })
      setToastMessage('Ad submitted for moderation review.')

      setTimeout(() => {
        navigate(APP_ROUTES.CLIENT_ADS)
      }, 260)
    } catch (error) {
      setToastMessage(error.message ?? 'Unable to submit ad.')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title={adId ? 'Edit Ad Draft' : 'Create New Ad'}
        subtitle="Multi-step submission flow with autosave, package selection, and media validation."
      />

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">Step {currentStep + 1} of 3: {STEPS[currentStep]}</p>
          <p className="text-xs text-slate-500">{autosaveMessage || (saving ? 'Saving...' : 'Autosave idle')}</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <m.div className="h-full bg-brand-600" animate={{ width: `${progress}%` }} transition={{ duration: 0.28 }} />
        </div>
      </Card>

      {toastMessage ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {toastMessage}
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 0 ? (
          <Card className="space-y-4">
            <Input label="Title" placeholder="Luxury apartment near city center" {...register('title')} />
            {errors.title ? <p className="text-xs font-medium text-rose-600">{errors.title.message}</p> : null}

            <Textarea
              label="Description"
              placeholder="Describe your ad with key details, value proposition, and trust signals."
              {...register('description')}
            />
            {errors.description ? (
              <p className="text-xs font-medium text-rose-600">{errors.description.message}</p>
            ) : null}
          </Card>
        ) : null}

        {currentStep === 1 ? (
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="space-y-4 lg:col-span-3">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Category</span>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                  {...register('categoryId')}
                >
                  <option value="">Select category</option>
                  {lookup.categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              {errors.categoryId ? <p className="text-xs font-medium text-rose-600">{errors.categoryId.message}</p> : null}

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">City</span>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                  {...register('cityId')}
                >
                  <option value="">Select city</option>
                  {lookup.cities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              {errors.cityId ? <p className="text-xs font-medium text-rose-600">{errors.cityId.message}</p> : null}

              <Card className="border-slate-200 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Seller Contact Preview</p>
                {sellerPreview ? (
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>Name: {sellerPreview.display_name}</p>
                    <p>Business: {sellerPreview.business_name || 'Not set'}</p>
                    <p>Phone: {sellerPreview.phone || 'Not set'}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Seller profile shell created. Add details in profile settings later.</p>
                )}
              </Card>
            </Card>

            <div className="space-y-3 lg:col-span-2">
              <p className="text-sm font-semibold text-slate-800">Package Selection</p>
              {lookup.packages.length === 0 ? (
                <EmptyState
                  title="No packages yet"
                  description="Create packages from admin panel to enable package selection."
                />
              ) : (
                <div className="space-y-3">
                  {lookup.packages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      item={pkg}
                      selected={Number(watch('packageId')) === pkg.id}
                      onSelect={(id) => setValue('packageId', String(id), { shouldDirty: true, shouldValidate: true })}
                    />
                  ))}
                </div>
              )}
              {errors.packageId ? <p className="text-xs font-medium text-rose-600">{errors.packageId.message}</p> : null}
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-3">
              <Textarea
                label="Media URLs"
                placeholder={['https://youtu.be/abc123', 'https://images.unsplash.com/photo-xyz'].join('\n')}
                value={mediaText}
                onChange={(event) => setMediaText(event.target.value)}
              />
              <p className="text-xs text-slate-500">Add one URL per line. Invalid URLs are flagged before submission.</p>

              {normalizedMedia.some((item) => !item.valid) ? (
                <p className="text-xs font-medium text-rose-600">
                  Some media URLs are invalid. They will be marked invalid and should be fixed for better moderation outcomes.
                </p>
              ) : null}
            </Card>

            <Card className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">Thumbnail Preview Grid</p>
              {normalizedMedia.length === 0 ? (
                <EmptyState title="No media yet" description="Add media URLs to preview thumbnails and source types." />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {normalizedMedia.map((item) => (
                    <div key={item.originalUrl} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <div className="h-24 bg-slate-200">
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt="Media preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-xs font-semibold text-slate-500">{item.sourceType}</div>
                        )}
                      </div>
                      <div className="px-2 py-1.5 text-[11px] text-slate-600">
                        {item.valid ? 'Valid' : 'Invalid'} - {item.sourceType}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="lg:col-span-2">
              <StatusTimeline currentStatus="draft" />
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentStep((value) => Math.max(value - 1, 0))}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep((value) => Math.min(value + 1, STEPS.length - 1))}
              disabled={currentStep === STEPS.length - 1}
            >
              Next
            </Button>
          </div>

          <div className="inline-flex gap-2">
            <Button type="button" variant="secondary" onClick={handleDraftSave} disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Saving Draft
                </span>
              ) : (
                'Save Draft'
              )}
            </Button>

            <Button type="submit" disabled={submitLoading}>
              {submitLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Submitting
                </span>
              ) : (
                'Submit For Review'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
