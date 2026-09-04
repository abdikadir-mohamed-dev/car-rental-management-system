import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../common/Modal'
import { createPayment } from '../../services/paymentService'
import { formatCurrency } from '../../utils/formatCurrency'

/*
 * Lets a customer retry payment for a booking whose last payment
 * attempt failed, without restarting the whole booking flow. Reuses
 * POST /api/payments/ — the backend only blocks a new payment when a
 * *completed* one already exists for the booking, so a fresh attempt
 * after a failure is already accepted server-side.
 */
function PaymentRetryModal({ isOpen, onClose, booking, onSuccess }) {
  const [method, setMethod] = useState('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!booking) return null

  const bookingId = booking._id || booking.id
  const amount = booking.totalAmount || 0

  const handleRetry = async () => {
    if (method === 'mpesa' && !phoneNumber.trim()) {
      toast.error('Please enter your M-Pesa phone number')
      return
    }

    setSubmitting(true)

    try {
      await createPayment({
        bookingId,
        amount,
        method,
        ...(method === 'mpesa' ? { phoneNumber: phoneNumber.trim() } : {}),
      })

      toast.success(
        method === 'mpesa'
          ? 'M-Pesa prompt sent to your phone. Enter your PIN to complete the payment.'
          : 'Cash payment recorded as pending.'
      )

      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Failed to retry payment'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Retry Payment"
      footer={
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={submitting}>
            Cancel
          </button>
          <button onClick={handleRetry} className="btn-primary flex-1" disabled={submitting}>
            {submitting ? 'Processing...' : 'Retry Payment'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Your previous payment attempt for this booking did not go through.
          Amount due: <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
        </p>

        <div>
          <label className="label">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('mpesa')}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                method === 'mpesa'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              M-Pesa
            </button>
            <button
              type="button"
              onClick={() => setMethod('cash')}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                method === 'cash'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Cash
            </button>
          </div>
        </div>

        {method === 'mpesa' && (
          <div>
            <label className="label">M-Pesa Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0712345678"
              className="input"
            />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default PaymentRetryModal
