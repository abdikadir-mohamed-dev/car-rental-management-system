import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Eye,
  RefreshCw,
  Search,
  CheckCircle,
  Banknote,
  XCircle,
} from 'lucide-react'

import { PAYMENT_STATUS } from '../../utils/constants'
import ConfirmDialog from '../../components/common/ConfirmDialog'

import {
  getPayments,
  refundPayment,
  confirmPayment,
} from '../../services/adminService'

import { mapPayment } from '../../utils/apiMappers'


function PaymentManagement() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [selectedPayment, setSelectedPayment] = useState(null)

  // Refund
  const [refundId, setRefundId] = useState(null)
  const [refundConfirmOpen, setRefundConfirmOpen] = useState(false)
  const [refunding, setRefunding] = useState(false)

  // Cash confirmation
  const [cashPaymentId, setCashPaymentId] = useState(null)
  const [cashConfirmOpen, setCashConfirmOpen] = useState(false)
  const [confirmingCash, setConfirmingCash] = useState(false)


  // ============================================================
  // LOAD PAYMENTS
  // ============================================================

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getPayments()

      const list = Array.isArray(data)
        ? data
        : data?.payments || []

      const mappedPayments = list.map((payment) => {
        const mapped = mapPayment(payment)

        const paymentId =
          mapped?.id ??
          payment?.id ??
          payment?._id ??
          payment?.payment_id

        const customer =
          mapped?.customer ||
          mapped?.user ||
          payment?.customer ||
          payment?.user ||
          null

        return {
          ...mapped,

          id: paymentId,
          _id: String(paymentId ?? ''),

          customer,
          user: customer,

          bookingId:
            mapped?.bookingId ??
            payment?.bookingId ??
            payment?.booking_id ??
            payment?.booking?.id ??
            payment?.booking?._id,

          amount:
            mapped?.amount ??
            payment?.amount ??
            0,

          method:
            mapped?.method ??
            payment?.method ??
            '',

          status:
            mapped?.status ??
            payment?.status ??
            PAYMENT_STATUS.PENDING,

          transactionId:
            mapped?.transactionId ??
            payment?.transactionId ??
            payment?.transaction_id,

          mpesaReceiptNumber:
            mapped?.mpesaReceiptNumber ??
            payment?.mpesaReceiptNumber ??
            payment?.mpesa_receipt_number,

          date:
            mapped?.date ??
            payment?.date ??
            payment?.createdAt ??
            payment?.created_at,

          createdAt:
            mapped?.createdAt ??
            payment?.createdAt ??
            payment?.created_at,
        }
      })

      setPayments(mappedPayments)
    } catch (err) {
      console.error('Failed to load payments:', err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load payments'

      setError(message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadPayments()
  }, [])


  // ============================================================
  // HELPERS
  // ============================================================

  const getPaymentId = (payment) => {
    return (
      payment?.id ??
      payment?._id ??
      payment?.payment_id
    )
  }


  const getCustomerName = (payment) => {
    return (
      payment?.user?.name ||
      payment?.customer?.name ||
      payment?.customerName ||
      'N/A'
    )
  }


  const getCustomerEmail = (payment) => {
    return (
      payment?.user?.email ||
      payment?.customer?.email ||
      'N/A'
    )
  }


  const getCustomerPhone = (payment) => {
    return (
      payment?.user?.phone ||
      payment?.customer?.phone ||
      'N/A'
    )
  }


  const getBookingId = (payment) => {
    return (
      payment?.bookingId ??
      payment?.booking_id ??
      payment?.booking?.id ??
      payment?.booking?._id ??
      'N/A'
    )
  }


  const formatBookingId = (payment) => {
    const bookingId = getBookingId(payment)

    if (
      !bookingId ||
      bookingId === 'N/A'
    ) {
      return 'N/A'
    }

    const value = String(bookingId)

    if (value.startsWith('BKG-')) {
      return value
    }

    return `BKG-${value.padStart(4, '0')}`
  }


  const getPaymentMethod = (payment) => {
    return String(
      payment?.method || ''
    ).toLowerCase()
  }


  const isCashPayment = (payment) => {
    return getPaymentMethod(payment) === 'cash'
  }


  const isMpesaPayment = (payment) => {
    return getPaymentMethod(payment) === 'mpesa'
  }


  const isPendingCashPayment = (payment) => {
    return (
      isCashPayment(payment) &&
      payment?.status === PAYMENT_STATUS.PENDING
    )
  }


  const formatAmount = (amount) => {
    return `KES ${Number(
      amount || 0
    ).toLocaleString()}`
  }


  const formatPaymentId = (payment) => {
    const id = getPaymentId(payment)

    if (
      id === undefined ||
      id === null ||
      id === ''
    ) {
      return 'N/A'
    }

    const value = String(id)

    return value.length > 8
      ? value.slice(-8)
      : value
  }


  const formatDate = (date) => {
    if (!date) {
      return 'N/A'
    }

    try {
      return new Date(date).toLocaleString()
    } catch {
      return String(date)
    }
  }


  // ============================================================
  // STATUS COLOR
  // ============================================================

  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return 'badge-success'

      case PAYMENT_STATUS.PENDING:
        return 'badge-warning'

      case PAYMENT_STATUS.FAILED:
        return 'badge-danger'

      case PAYMENT_STATUS.REFUNDED:
        return 'badge-gray'

      default:
        return 'badge-gray'
    }
  }


  // ============================================================
  // REFUND
  // ============================================================

  const handleRefundClick = (payment) => {
    const paymentId = getPaymentId(payment)

    if (!paymentId) {
      toast.error('Invalid payment ID')
      return
    }

    setRefundId(paymentId)
    setRefundConfirmOpen(true)
  }


  const handleRefundConfirm = async () => {
    setRefundConfirmOpen(false)

    if (!refundId) {
      return
    }

    try {
      setRefunding(true)

      await refundPayment(refundId)

      toast.success(
        'Payment refunded successfully'
      )

      setRefundId(null)

      // Reload from backend so UI matches database.
      await loadPayments()
    } catch (err) {
      console.error(
        'Refund failed:',
        err
      )

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to refund payment'

      toast.error(message)
    } finally {
      setRefunding(false)
    }
  }


  const handleRefundCancel = () => {
    setRefundConfirmOpen(false)
    setRefundId(null)
  }


  // ============================================================
  // CASH CONFIRMATION
  // ============================================================

  const handleCashConfirmClick = (payment) => {
    const paymentId = getPaymentId(payment)

    if (!paymentId) {
      toast.error('Invalid payment ID')
      return
    }

    if (!isCashPayment(payment)) {
      toast.error(
        'Only cash payments can be confirmed manually'
      )
      return
    }

    if (
      payment.status !==
      PAYMENT_STATUS.PENDING
    ) {
      toast.error(
        'This cash payment is not pending'
      )
      return
    }

    setCashPaymentId(paymentId)
    setCashConfirmOpen(true)
  }


  const handleCashConfirm = async () => {
    setCashConfirmOpen(false)

    if (!cashPaymentId) {
      return
    }

    try {
      setConfirmingCash(true)

      await confirmPayment(
        cashPaymentId
      )

      toast.success(
        'Cash payment confirmed successfully'
      )

      setCashPaymentId(null)

      // Reload from backend so the
      // completed status is guaranteed to
      // match the database.
      await loadPayments()

      setSelectedPayment(null)
    } catch (err) {
      console.error(
        'Cash payment confirmation failed:',
        err
      )

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to confirm cash payment'

      toast.error(message)
    } finally {
      setConfirmingCash(false)
    }
  }


  const handleCashConfirmCancel = () => {
    setCashConfirmOpen(false)
    setCashPaymentId(null)
  }


  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredPayments = payments.filter(
    (payment) => {
      const searchLower =
        search.toLowerCase().trim()

      const paymentId =
        String(
          getPaymentId(payment) || ''
        ).toLowerCase()

      const customerName =
        getCustomerName(payment)
          .toLowerCase()

      const bookingId =
        String(
          getBookingId(payment)
        ).toLowerCase()

      const method =
        getPaymentMethod(payment)

      const matchesSearch =
        !searchLower ||
        paymentId.includes(searchLower) ||
        customerName.includes(searchLower) ||
        bookingId.includes(searchLower) ||
        method.includes(searchLower)

      const matchesStatus =
        !statusFilter ||
        payment.status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    }
  )


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={loadPayments}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}


      {/* ======================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">

        <div className="relative flex-1">

          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by payment ID, booking, customer, or method..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="input pl-10"
          />

        </div>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="input sm:w-48"
        >

          <option value="">
            All Statuses
          </option>

          {Object.values(
            PAYMENT_STATUS
          ).map((status) => (
            <option
              key={status}
              value={status}
              className="capitalize"
            >
              {status}
            </option>
          ))}

        </select>


        <button
          onClick={loadPayments}
          disabled={loading}
          className="btn-secondary flex items-center justify-center gap-2"
          title="Refresh payments"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              loading
                ? 'animate-spin'
                : ''
            }`}
          />

          Refresh
        </button>

      </div>


      {/* ======================================================
          PAYMENT SUMMARY
      ====================================================== */}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <div className="card p-4">
            <p className="text-sm text-slate-500">
              Total Payments
            </p>

            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {payments.length}
            </p>
          </div>


          <div className="card p-4">
            <p className="text-sm text-slate-500">
              Pending Cash
            </p>

            <p className="text-2xl font-semibold text-amber-600 mt-1">
              {
                payments.filter(
                  isPendingCashPayment
                ).length
              }
            </p>
          </div>


          <div className="card p-4">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="text-2xl font-semibold text-green-600 mt-1">
              {
                payments.filter(
                  (payment) =>
                    payment.status ===
                    PAYMENT_STATUS.COMPLETED
                ).length
              }
            </p>
          </div>

        </div>
      )}


      {/* ======================================================
          PAYMENT TABLE
      ====================================================== */}

      {loading ? (

        <div className="flex items-center justify-center min-h-[200px]">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200">

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  ID
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Booking
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Customer
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Amount
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Method
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Status
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredPayments.map(
                (payment) => {

                  const paymentId =
                    getPaymentId(payment)

                  const pendingCash =
                    isPendingCashPayment(
                      payment
                    )

                  return (

                    <tr
                      key={String(
                        paymentId
                      )}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      {/* Payment ID */}

                      <td className="py-3 px-4 text-slate-900">
                        #{formatPaymentId(payment)}
                      </td>


                      {/* Booking */}

                      <td className="py-3 px-4 text-slate-600">
                        {formatBookingId(
                          payment
                        )}
                      </td>


                      {/* Customer */}

                      <td className="py-3 px-4 text-slate-600">
                        {getCustomerName(
                          payment
                        )}
                      </td>


                      {/* Amount */}

                      <td className="py-3 px-4 font-medium text-slate-900">
                        {formatAmount(
                          payment.amount
                        )}
                      </td>


                      {/* Method */}

                      <td className="py-3 px-4 capitalize text-slate-600">

                        <div className="flex items-center gap-2">

                          {isCashPayment(
                            payment
                          ) && (
                            <Banknote className="w-4 h-4 text-amber-600" />
                          )}

                          {isMpesaPayment(
                            payment
                          ) && (
                            <span className="text-xs font-semibold text-green-600">
                              M-PESA
                            </span>
                          )}

                          <span>
                            {payment.method ||
                              'N/A'}
                          </span>

                        </div>

                      </td>


                      {/* Status */}

                      <td className="py-3 px-4">

                        <span
                          className={`badge capitalize ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>

                      </td>


                      {/* Actions */}

                      <td className="py-3 px-4">

                        <div className="flex gap-2">

                          {/* View */}

                          <button
                            onClick={() =>
                              setSelectedPayment(
                                payment
                              )
                            }
                            className="p-2 text-primary hover:bg-primary-light rounded-lg"
                            title="View payment"
                          >
                            <Eye className="w-4 h-4" />
                          </button>


                          {/* Confirm Cash */}

                          {pendingCash && (
                            <button
                              onClick={() =>
                                handleCashConfirmClick(
                                  payment
                                )
                              }
                              disabled={
                                confirmingCash
                              }
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                              title="Confirm cash payment"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}


                          {/* Refund */}

                          {payment.status ===
                            PAYMENT_STATUS.COMPLETED && (
                            <button
                              onClick={() =>
                                handleRefundClick(
                                  payment
                                )
                              }
                              disabled={
                                refunding
                              }
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                              title="Refund payment"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  )
                }
              )}

            </tbody>

          </table>


          {/* Empty state */}

          {filteredPayments.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No payments found.
            </div>
          )}

        </div>

      )}


      {/* ======================================================
          PAYMENT DETAILS MODAL
      ====================================================== */}

      {selectedPayment && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            {/* Header */}

            <div className="p-6 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold text-slate-900">
                  Payment Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {formatBookingId(
                    selectedPayment
                  )}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="text-slate-400 hover:text-slate-600"
                title="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>

            </div>


            {/* Details */}

            <div className="p-6 space-y-4">

              <div>
                <span className="text-slate-600">
                  Payment ID:
                </span>{' '}

                <span className="font-medium text-slate-900">
                  {getPaymentId(
                    selectedPayment
                  )}
                </span>
              </div>


              <div>
                <span className="text-slate-600">
                  Booking:
                </span>{' '}

                <span className="font-medium text-slate-900">
                  {formatBookingId(
                    selectedPayment
                  )}
                </span>
              </div>


              <div>
                <span className="text-slate-600">
                  Customer:
                </span>{' '}

                <span className="font-medium text-slate-900">
                  {getCustomerName(
                    selectedPayment
                  )}
                </span>
              </div>


              <div>
                <span className="text-slate-600">
                  Phone:
                </span>{' '}

                <span className="font-medium text-slate-900">
                  {getCustomerPhone(
                    selectedPayment
                  )}
                </span>
              </div>


              <div>
                <span className="text-slate-600">
                  Amount:
                </span>{' '}

                <span className="font-medium text-slate-900">
                  {formatAmount(
                    selectedPayment.amount
                  )}
                </span>
              </div>


              <div>
                <span className="text-slate-600">
                  Method:
                </span>{' '}

                <span className="font-medium text-slate-900 capitalize">
                  {selectedPayment.method ||
                    'N/A'}
                </span>
              </div>


              <div>
                <span className="text-slate-600">
                  Status:
                </span>{' '}

                <span
                  className={`badge capitalize ml-2 ${getStatusColor(
                    selectedPayment.status
                  )}`}
                >
                  {selectedPayment.status ||
                    'N/A'}
                </span>
              </div>


              {/* M-Pesa transaction */}

              {selectedPayment.transactionId && (
                <div>
                  <span className="text-slate-600">
                    Transaction:
                  </span>{' '}

                  <span className="font-medium text-slate-900 break-all">
                    {
                      selectedPayment.transactionId
                    }
                  </span>
                </div>
              )}


              {selectedPayment.mpesaReceiptNumber && (
                <div>
                  <span className="text-slate-600">
                    M-Pesa Receipt:
                  </span>{' '}

                  <span className="font-medium text-slate-900">
                    {
                      selectedPayment.mpesaReceiptNumber
                    }
                  </span>
                </div>
              )}


              <div>
                <span className="text-slate-600">
                  Date:
                </span>{' '}

                <span className="font-medium text-slate-900">
                  {formatDate(
                    selectedPayment.date ||
                    selectedPayment.createdAt
                  )}
                </span>
              </div>


              {/* Pending cash */}

              {isPendingCashPayment(
                selectedPayment
              ) && (

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">

                  <div className="flex items-start gap-3">

                    <Banknote className="w-5 h-5 text-amber-600 mt-0.5" />

                    <div>

                      <p className="font-medium text-amber-900">
                        Cash payment pending
                      </p>

                      <p className="text-sm text-amber-700 mt-1">
                        The customer is expected to pay{' '}
                        <strong>
                          {formatAmount(
                            selectedPayment.amount
                          )}
                        </strong>{' '}
                        in cash during vehicle
                        check-out.
                      </p>

                    </div>

                  </div>

                </div>

              )}


              {/* Completed cash */}

              {isCashPayment(
                selectedPayment
              ) &&
                selectedPayment.status ===
                  PAYMENT_STATUS.COMPLETED && (

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">

                  <div className="flex items-start gap-3">

                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />

                    <div>

                      <p className="font-medium text-green-900">
                        Cash payment confirmed
                      </p>

                      <p className="text-sm text-green-700 mt-1">
                        The cash payment has been
                        received and confirmed.
                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>


            {/* Footer */}

            <div className="p-6 border-t border-slate-200 flex gap-3">

              {/* Confirm cash */}

              {isPendingCashPayment(
                selectedPayment
              ) && (

                <button
                  onClick={() =>
                    handleCashConfirmClick(
                      selectedPayment
                    )
                  }
                  disabled={confirmingCash}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />

                  {confirmingCash
                    ? 'Confirming...'
                    : 'Confirm Cash'}
                </button>

              )}


              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="btn-secondary flex-1"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          REFUND CONFIRMATION
      ====================================================== */}

      <ConfirmDialog
        isOpen={refundConfirmOpen}
        title="Refund Payment"
        message="Are you sure you want to refund this payment? This action cannot be undone."
        onConfirm={handleRefundConfirm}
        onCancel={handleRefundCancel}
        confirmText="Yes, Refund"
      />


      {/* ======================================================
          CASH CONFIRMATION
      ====================================================== */}

      <ConfirmDialog
        isOpen={cashConfirmOpen}
        title="Confirm Cash Payment"
        message="Confirm that the customer has paid the full cash amount for this booking. This will mark the cash payment as completed."
        onConfirm={handleCashConfirm}
        onCancel={handleCashConfirmCancel}
        confirmText="Yes, Confirm Cash"
      />

    </div>
  )
}

export default PaymentManagement