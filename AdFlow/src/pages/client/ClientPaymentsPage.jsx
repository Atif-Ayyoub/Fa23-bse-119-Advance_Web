import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, EmptyState, Input, SectionHeading, Spinner, StatusPill } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { paymentProofSchema } from '../../lib/validators/paymentSchema'
import { fetchOwnAds } from '../../services/adService'
import { fetchOwnPayments, submitPaymentProof } from '../../services/paymentService'

function PaymentStatusTimeline({ adStatus }) {
  const flow = ['payment_pending', 'payment_submitted', 'payment_verified']
  const currentIndex = flow.indexOf(adStatus)

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {flow.map((step, index) => {
        const done = currentIndex >= index
        return (
          <div
            key={step}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
              done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            {step.replaceAll('_', ' ')}
          </div>
        )
      })}
    </div>
  )
}

export function ClientPaymentsPage() {
  const { user } = useAuth()
  const [ads, setAds] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentProofSchema),
    defaultValues: {
      adId: '',
      amount: '',
      method: '',
      transactionRef: '',
      senderName: '',
      screenshotUrl: '',
    },
  })

  const loadData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)

    try {
      const [adsData, paymentsData] = await Promise.all([fetchOwnAds(user.id), fetchOwnPayments(user.id)])
      setAds(adsData)
      setPayments(paymentsData)
    } catch (error) {
      setMessage(error.message ?? 'Unable to load payment data.')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const payableAds = useMemo(() => {
    return ads.filter((item) => ['payment_pending', 'rejected', 'payment_submitted'].includes(item.status))
  }, [ads])

  async function onSubmit(values) {
    if (!user?.id) return
    setSubmitting(true)
    setMessage('')

    try {
      await submitPaymentProof(values.adId, values, user.id)
      setMessage('Payment proof submitted successfully.')
      reset({ adId: '', amount: '', method: '', transactionRef: '', senderName: '', screenshotUrl: '' })
      await loadData()
    } catch (error) {
      setMessage(error.message ?? 'Payment submission failed.')
    } finally {
      setSubmitting(false)
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
        title="Client Payments"
        subtitle="Submit payment proof for payment-pending ads and track verification progress."
      />

      {message ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{message}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Payment Submission Form</h3>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Ad</span>
              <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" {...register('adId')}>
                <option value="">Select ad</option>
                {payableAds.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.status.replaceAll('_', ' ')})
                  </option>
                ))}
              </select>
            </label>
            {errors.adId ? <p className="text-xs font-medium text-rose-600">{errors.adId.message}</p> : null}

            <Input label="Amount" type="number" step="0.01" placeholder="125.00" {...register('amount')} />
            {errors.amount ? <p className="text-xs font-medium text-rose-600">{errors.amount.message}</p> : null}

            <Input label="Method" placeholder="Bank transfer / JazzCash / Easypaisa" {...register('method')} />
            {errors.method ? <p className="text-xs font-medium text-rose-600">{errors.method.message}</p> : null}

            <Input label="Transaction Reference" placeholder="TRX-12345678" {...register('transactionRef')} />
            {errors.transactionRef ? <p className="text-xs font-medium text-rose-600">{errors.transactionRef.message}</p> : null}

            <Input label="Sender Name" placeholder="Atif Khan" {...register('senderName')} />
            {errors.senderName ? <p className="text-xs font-medium text-rose-600">{errors.senderName.message}</p> : null}

            <Input label="Screenshot URL (optional)" placeholder="https://..." {...register('screenshotUrl')} />
            {errors.screenshotUrl ? <p className="text-xs font-medium text-rose-600">{errors.screenshotUrl.message}</p> : null}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Payment Proof'}
            </Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Payment Status Timeline</h3>
          {payableAds.length === 0 ? (
            <EmptyState title="No payable ads" description="Ads become payable after moderation approval." />
          ) : (
            <div className="space-y-3">
              {payableAds.slice(0, 4).map((ad) => (
                <div key={ad.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{ad.title}</p>
                    <StatusPill status={ad.status} />
                  </div>
                  <PaymentStatusTimeline adStatus={ad.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Recent Payment Records</h3>
        {payments.length === 0 ? (
          <EmptyState title="No payment records" description="Submitted payment proofs will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Reference</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Method</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-slate-700">{item.transaction_ref}</td>
                    <td className="px-3 py-2 text-slate-700">${Number(item.amount).toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-700">{item.method}</td>
                    <td className="px-3 py-2">
                      <StatusPill
                        status={
                          item.status === 'pending'
                            ? 'payment_submitted'
                            : item.status === 'verified'
                              ? 'payment_verified'
                              : item.status
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
