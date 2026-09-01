import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPayments } from '../../redux/slices/paymentSlice'
import {
  CreditCard,
  Filter,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import { PAYMENT_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import { getReceipt } from '../../services/paymentService'

function PaymentsPage() {
  const dispatch = useDispatch()

  const {
    payments = [],
    loading,
    error,
  } = useSelector((state) => state.payments)

  const [filter, setFilter] = useState('all')
  const [receipt, setReceipt] = useState(null)
  const [receiptLoading, setReceiptLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchPayments({}))
  }, [dispatch])

  const safeId = (value) => {
    if (value === null || value === undefined) return 'N/A'

    if (typeof value === 'object') {
      return value._id || value.id || 'N/A'
    }

    return String(value)
  }

  const shortId = (value) => {
    const id = safeId(value)
    return id === 'N/A' ? id : String(id).slice(-8)
  }

  const getPaymentStatusType = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return 'success'
      case PAYMENT_STATUS.FAILED:
        return 'danger'
      case PAYMENT_STATUS.REFUNDED:
        return 'info'
      case PAYMENT_STATUS.PENDING:
      default:
        return 'warning'
    }
  }

  const loadReceipt = async (paymentId) => {
    try {
      setReceiptLoading(true)

      const data = await getReceipt(paymentId)

      setReceipt(data)
    } catch (err) {
      console.error('Failed to load receipt:', err)
      alert(
        err.response?.data?.message ||
        'Receipt is only available for completed payments.'
      )
    } finally {
      setReceiptLoading(false)
    }
  }

  const handlePrintReceipt = () => {
    if (!receipt) return

    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Please allow pop-ups to print the receipt.')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt ${receipt.receiptNumber || ''}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #1e293b;
              max-width: 700px;
              margin: auto;
            }

            h1, h2, h3 {
              margin-bottom: 8px;
            }

            .center {
              text-align: center;
            }

            .row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }

            .total {
              font-size: 20px;
              font-weight: bold;
              border-top: 1px solid #ddd;
              padding-top: 12px;
            }

            hr {
              border: none;
              border-top: 1px solid #ddd;
              margin: 20px 0;
            }

            .muted {
              color: #64748b;
            }
          </style>
        </head>

        <body>

          <div class="center">
            <h1>${receipt.business?.name || 'DriveGo'}</h1>
            <p class="muted">
              ${receipt.business?.address || 'Nairobi, Kenya'}
            </p>
            <p class="muted">
              ${receipt.business?.phone || ''}
              ${receipt.business?.email ? ` | ${receipt.business.email}` : ''}
            </p>
          </div>

          <hr />

          <h2>Payment Receipt</h2>

          <div class="row">
            <span>Receipt Number</span>
            <strong>${receipt.receiptNumber || 'N/A'}</strong>
          </div>

          <div class="row">
            <span>Transaction ID</span>
            <strong>${receipt.transactionId || 'N/A'}</strong>
          </div>

          <div class="row">
            <span>M-Pesa Receipt</span>
            <strong>${receipt.mpesaReceiptNumber || 'N/A'}</strong>
          </div>

          <div class="row">
            <span>Date</span>
            <strong>${receipt.date || 'N/A'}</strong>
          </div>

          <div class="row">
            <span>Payment Method</span>
            <strong>${receipt.method || 'M-Pesa'}</strong>
          </div>

          <div class="row">
            <span>Status</span>
            <strong>${receipt.status || 'Completed'}</strong>
          </div>

          <hr />

          <h3>Customer</h3>

          <p>${receipt.customer?.name || 'N/A'}</p>
          <p>${receipt.customer?.email || 'N/A'}</p>
          <p>${receipt.customer?.phone || 'N/A'}</p>

          <hr />

          <h3>Booking</h3>

          <p>
            Booking #${shortId(receipt.booking?.id)}
          </p>

          <p>
            Vehicle: ${receipt.booking?.vehicle || 'N/A'}
          </p>

          <p>
            Pickup: ${receipt.booking?.pickupDate || 'N/A'}
          </p>

          <p>
            Return: ${receipt.booking?.returnDate || 'N/A'}
          </p>

          <hr />

          <div class="row total">
            <span>Total Paid</span>
            <span>
              KES ${Number(receipt.amount || 0).toLocaleString()}
            </span>
          </div>

          <br />

          <div class="center">
            <p>Thank you for choosing DriveGo!</p>
          </div>

        </body>
      </html>
    `)

    printWindow.document.close()

    setTimeout(() => {
      printWindow.print()
    }, 300)
  }

  const handleDownloadReceipt = async (paymentId) => {
    try {
      setReceiptLoading(true)

      const data = await getReceipt(paymentId)

      setReceipt(data)

      setTimeout(() => {
        handlePrintReceipt()
      }, 100)
    } catch (err) {
      console.error('Failed to download receipt:', err)

      alert(
        err.response?.data?.message ||
        'Receipt is only available for completed payments.'
      )
    } finally {
      setReceiptLoading(false)
    }
  }

  const filteredPayments = payments.filter((payment) => {
    if (filter === 'all') return true

    return payment.status === filter
  })

  const stats = {
    pending: payments.filter(
      (p) => p.status === PAYMENT_STATUS.PENDING
    ).length,

    completed: payments.filter(
      (p) => p.status === PAYMENT_STATUS.COMPLETED
    ).length,

    failed: payments.filter(
      (p) => p.status === PAYMENT_STATUS.FAILED
    ).length,

    refunded: payments.filter(
      (p) => p.status === PAYMENT_STATUS.REFUNDED
    ).length,
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Payments & Receipts
        </h1>

        <p className="text-slate-600 mt-1">
          View all your transactions and receipts
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* PAYMENT STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Pending */}
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Pending
            </p>

            <p className="text-xl font-bold text-slate-900">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Completed
            </p>

            <p className="text-xl font-bold text-slate-900">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Failed */}
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Failed
            </p>

            <p className="text-xl font-bold text-slate-900">
              {stats.failed}
            </p>
          </div>
        </div>

        {/* Refunded */}
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Refunded
            </p>

            <p className="text-xl font-bold text-slate-900">
              {stats.refunded}
            </p>
          </div>
        </div>

      </div>

      {/* FILTER */}
      <div className="flex items-center gap-3">

        <Filter className="w-5 h-5 text-slate-400" />

        <div className="flex flex-wrap items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">

          {[
            'all',
            PAYMENT_STATUS.PENDING,
            PAYMENT_STATUS.COMPLETED,
            PAYMENT_STATUS.FAILED,
            PAYMENT_STATUS.REFUNDED,
          ].map((status) => (

            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'all'
                ? 'All'
                : status}
            </button>

          ))}

        </div>
      </div>

      {/* NO PAYMENTS */}
      {filteredPayments.length === 0 ? (

        <div className="card p-12 text-center">

          <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No payments found
          </h3>

          <p className="text-slate-500">
            You don't have any payments matching the selected filter.
          </p>

        </div>

      ) : (

        /* PAYMENTS */
        <div className="space-y-4">

          {filteredPayments.map((payment) => {

            const paymentId = safeId(payment._id)

            const bookingId =
              payment.bookingId ??
              payment.booking?._id ??
              payment.booking?.id

            const vehicleName =
              payment.booking?.vehicle?.name ||
              payment.vehicle ||
              'Vehicle Rental'

            return (
              <div
                key={paymentId}
                className="card p-6"
              >

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  {/* LEFT */}
                  <div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">

                      <p className="font-medium text-slate-900">
                        Transaction #{shortId(payment._id)}
                      </p>

                      <StatusBadge
                        status={payment.status}
                        type={getPaymentStatusType(payment.status)}
                      />

                    </div>

                    <p className="text-sm text-slate-500">
                      Booking: #{shortId(bookingId)}
                    </p>

                    <p className="text-sm text-slate-500">
                      Vehicle: {vehicleName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {payment.createdAt
                        ? formatDateUtil(payment.createdAt)
                        : payment.date
                          ? formatDateUtil(payment.date)
                          : 'N/A'}
                    </p>

                    <p className="text-sm text-slate-500 capitalize">
                      Method: {payment.method || 'M-Pesa'}
                    </p>

                    {payment.mpesaReceiptNumber && (
                      <p className="text-sm text-slate-500">
                        M-Pesa Receipt: {payment.mpesaReceiptNumber}
                      </p>
                    )}

                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center justify-between lg:justify-end gap-5">

                    <div className="lg:text-right">

                      <p className="font-bold text-primary text-lg">
                        {formatCurrency(payment.amount || 0)}
                      </p>

                      <p className="text-xs text-slate-500">
                        {payment.status === 'completed'
                          ? 'Payment completed'
                          : payment.status === 'pending'
                            ? 'Awaiting payment'
                            : payment.status === 'failed'
                              ? 'Payment failed'
                              : payment.status === 'refunded'
                                ? 'Payment refunded'
                                : ''}
                      </p>

                    </div>

                    {/* RECEIPT BUTTONS */}
                    <div className="flex gap-2">

                      <button
                        onClick={() => loadReceipt(paymentId)}
                        disabled={
                          payment.status !== PAYMENT_STATUS.COMPLETED ||
                          receiptLoading
                        }
                        className={`p-2 rounded-lg ${
                          payment.status === PAYMENT_STATUS.COMPLETED
                            ? 'hover:bg-slate-100'
                            : 'opacity-40 cursor-not-allowed'
                        }`}
                        title="View Receipt"
                      >
                        <Printer className="w-4 h-4 text-slate-600" />
                      </button>

                      <button
                        onClick={() =>
                          handleDownloadReceipt(paymentId)
                        }
                        disabled={
                          payment.status !== PAYMENT_STATUS.COMPLETED ||
                          receiptLoading
                        }
                        className={`p-2 rounded-lg ${
                          payment.status === PAYMENT_STATUS.COMPLETED
                            ? 'hover:bg-slate-100'
                            : 'opacity-40 cursor-not-allowed'
                        }`}
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )
          })}

        </div>
      )}

      {/* RECEIPT MODAL */}
      {receipt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="p-6">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold text-slate-900">
                  Payment Receipt
                </h2>

                <button
                  onClick={() => setReceipt(null)}
                  className="text-slate-500 hover:text-slate-900 text-xl"
                >
                  ×
                </button>

              </div>

              <div className="text-center border-b border-slate-200 pb-5">

                <h3 className="text-xl font-bold text-slate-900">
                  {receipt.business?.name || 'DriveGo'}
                </h3>

                <p className="text-sm text-slate-500">
                  {receipt.business?.address || 'Nairobi, Kenya'}
                </p>

              </div>

              <div className="py-5 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Receipt Number
                  </span>

                  <span className="font-medium">
                    {receipt.receiptNumber || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Transaction ID
                  </span>

                  <span className="font-medium">
                    {receipt.transactionId || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    M-Pesa Receipt
                  </span>

                  <span className="font-medium">
                    {receipt.mpesaReceiptNumber || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Date
                  </span>

                  <span className="font-medium">
                    {receipt.date || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Method
                  </span>

                  <span className="font-medium capitalize">
                    {receipt.method || 'M-Pesa'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Status
                  </span>

                  <span className="font-medium text-emerald-600 capitalize">
                    {receipt.status || 'completed'}
                  </span>
                </div>

              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-between">

                <span className="font-semibold">
                  Total Paid
                </span>

                <span className="text-xl font-bold text-primary">
                  {formatCurrency(receipt.amount || 0)}
                </span>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={handlePrintReceipt}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>

                <button
                  onClick={handlePrintReceipt}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default PaymentsPage