import { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Card, EmptyState, Input, Modal, SectionHeading, Spinner, StatusPill } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { fetchAdminPaymentQueue, isDuplicateTransactionRef, rejectPayment, verifyPayment } from '../../services/paymentService'

export function AdminPaymentsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [targetPaymentId, setTargetPaymentId] = useState(null)
  const [checkingRef, setCheckingRef] = useState('')
  const [duplicateCheckResult, setDuplicateCheckResult] = useState('')

  const loadQueue = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminPaymentQueue()
      setItems(data)
    } catch (error) {
      setMessage(error.message ?? 'Unable to load payment queue.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  async function handleVerify(paymentId) {
    if (!user?.id) return
    setMessage('')

    try {
      await verifyPayment(paymentId, user.id)
      setMessage('Payment verified and ad moved to payment_verified.')
      await loadQueue()
    } catch (error) {
      setMessage(error.message ?? 'Verification failed.')
    }
  }

  function openReject(paymentId) {
    setTargetPaymentId(paymentId)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  async function handleReject() {
    if (!targetPaymentId || !user?.id) return

    try {
      await rejectPayment(targetPaymentId, rejectReason || 'Payment proof did not pass verification.', user.id)
      setMessage('Payment rejected and client notified.')
      setRejectModalOpen(false)
      setTargetPaymentId(null)
      await loadQueue()
    } catch (error) {
      setMessage(error.message ?? 'Rejection failed.')
    }
  }

  async function handleDuplicateCheck() {
    if (!checkingRef.trim()) {
      setDuplicateCheckResult('Enter a transaction reference first.')
      return
    }

    try {
      const duplicate = await isDuplicateTransactionRef(checkingRef)
      setDuplicateCheckResult(duplicate ? 'Duplicate transaction reference detected.' : 'No duplicate found.')
    } catch (error) {
      setDuplicateCheckResult(error.message ?? 'Duplicate check failed.')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Admin Payments"
        subtitle="Finance-style verification queue with duplicate reference checks and payment controls."
      />

      {message ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{message}</div>
      ) : null}

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Duplicate Transaction Prevention</h3>
        <div className="flex flex-wrap items-end gap-2">
          <Input label="Transaction Reference" placeholder="TRX-1234" value={checkingRef} onChange={(event) => setCheckingRef(event.target.value)} />
          <Button onClick={handleDuplicateCheck}>Check Duplicate</Button>
        </div>
        {duplicateCheckResult ? <p className="text-sm font-medium text-slate-700">{duplicateCheckResult}</p> : null}
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Verification Queue</h3>

        {loading ? (
          <div className="grid min-h-[35vh] place-items-center">
            <Spinner className="h-6 w-6 text-brand-600" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Queue clear" description="No pending payments are awaiting verification." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Ad</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Reference</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Sender</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-slate-700">#{item.ad_id}</td>
                    <td className="px-3 py-2 text-slate-700">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{item.transaction_ref}</span>
                        {item.duplicateReference ? <Badge className="border-rose-200 bg-rose-50 text-rose-700">Duplicate</Badge> : null}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-700">{item.sender_name}</td>
                    <td className="px-3 py-2 text-slate-700">${Number(item.amount).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <StatusPill status="payment_submitted" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="inline-flex gap-2">
                        <Button onClick={() => handleVerify(item.id)}>Verify</Button>
                        <Button variant="secondary" onClick={() => openReject(item.id)}>
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Payment">
        <div className="space-y-3">
          <Input
            label="Rejection Reason"
            placeholder="Screenshot mismatch, invalid sender details, etc."
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject}>Confirm Rejection</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
