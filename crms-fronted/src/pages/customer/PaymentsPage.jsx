import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPayments } from '../../redux/slices/paymentSlice'
import { Link } from 'react-router-dom'
import { CreditCard, Filter, Download, Printer, ChevronDown, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import { PAYMENT_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'

function PaymentsPage() {
  const dispatch = useDispatch()
  const { payments = [], loading } = useSelector((state) => state.payments)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchPayments({}))
  }, [dispatch])

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true
    return p.status === filter
  })

  const stats = {
    pending: payments.filter((p) => p.status === PAYMENT_STATUS.PENDING).length,
    completed: payments.filter((p) => p.status === PAYMENT_STATUS.COMPLETED).length,
    failed: payments.filter((p) => p.status === PAYMENT_STATUS.FAILED).length,
    refunded: payments.filter((p) => p.status === PAYMENT_STATUS.REFUNDED).length,
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Payments & Receipts</h1>
        <p className="text-slate-600 mt-1">View all your transactions and receipts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-xl font-bold text-slate-900">{stats.pending}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Completed</p>
            <p className="text-xl font-bold text-slate-900">{stats.completed}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Failed</p>
            <p className="text-xl font-bold text-slate-900">{stats.failed}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Refunded</p>
            <p className="text-xl font-bold text-slate-900">{stats.refunded}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-slate-400" />
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {['all', PAYMENT_STATUS.PENDING, PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.REFUNDED].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === status ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="card p-12 text-center">
          <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No payments found</h3>
          <p className="text-slate-500">You don't have any payments matching the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900">Transaction #{payment._id?.slice(-8)}</p>
                    <StatusBadge status={payment.status} type={payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'danger' : payment.status === 'refunded' ? 'info' : 'warning'} />
                  </div>
                  <p className="text-sm text-slate-500">Booking: #{payment.bookingId?.slice(-8) || payment.booking?._id?.slice(-8)}</p>
                  <p className="text-sm text-slate-500">{formatDateUtil(payment.createdAt)}</p>
                </div>
                <div className="flex items-center justify-between sm:text-right gap-4">
                  <div>
                    <p className="font-bold text-primary text-lg">{formatCurrency(payment.amount || 0)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg" title="Print Receipt">
                      <Printer className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg" title="Download Receipt">
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PaymentsPage
