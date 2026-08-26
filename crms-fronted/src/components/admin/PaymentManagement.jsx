import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Eye, RefreshCw, Search } from 'lucide-react'
import { PAYMENT_STATUS } from '../../utils/constants'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getPayments, refundPayment } from '../../services/adminService'

function PaymentManagement() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [refundId, setRefundId] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const loadPayments = async () => {
    setLoading(true)
    try {
      const response = await getPayments()
      setPayments(response.data.payments || response.data)
    } catch {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPayments()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED: return 'badge-success'
      case PAYMENT_STATUS.PENDING: return 'badge-warning'
      case PAYMENT_STATUS.FAILED: return 'badge-danger'
      case PAYMENT_STATUS.REFUNDED: return 'badge-gray'
      default: return 'badge-gray'
    }
  }

  const handleRefundClick = (id) => {
    setRefundId(id)
    setConfirmOpen(true)
  }

  const handleRefundConfirm = async () => {
    setConfirmOpen(false)
    if (refundId) {
      try {
        await refundPayment(refundId)
        setPayments(payments.map(p => (p.id || p._id) === refundId ? { ...p, status: PAYMENT_STATUS.REFUNDED } : p))
        toast.success('Payment refunded')
      } catch {
        toast.error('Failed to refund payment')
      }
      setRefundId(null)
    }
  }

  const handleRefundCancel = () => {
    setConfirmOpen(false)
    setRefundId(null)
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.id && payment.id.toString().toLowerCase().includes(search.toLowerCase())) || (payment._id && payment._id.toString().toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = !statusFilter || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-48">
          <option value="">All Statuses</option>
          {Object.values(PAYMENT_STATUS).map((status) => (
            <option key={status} value={status} className="capitalize">{status}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Method</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id || payment._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">#{payment.id || payment._id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">KES {payment.amount?.toLocaleString()}</td>
                  <td className="py-3 px-4 capitalize text-slate-600">{payment.method || 'Card'}</td>
                  <td className="py-3 px-4">
                    <span className={`badge capitalize ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedPayment(payment)} className="p-2 text-primary hover:bg-primary-light rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === PAYMENT_STATUS.COMPLETED && (
                        <button onClick={() => handleRefundClick(payment.id || payment._id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <p className="text-center text-slate-500 py-8">No payments found.</p>
          )}
        </div>
      )}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Payment Details</h2>
            </div>
            <div className="p-6 space-y-3">
              <div><span className="text-slate-600">Payment ID:</span> <span className="font-medium text-slate-900">{selectedPayment.id || selectedPayment._id}</span></div>
               <div><span className="text-slate-600">Amount:</span> <span className="font-medium text-slate-900">KES {selectedPayment.amount?.toLocaleString()}</span></div>
              <div><span className="text-slate-600">Method:</span> <span className="font-medium text-slate-900 capitalize">{selectedPayment.method}</span></div>
              <div><span className="text-slate-600">Status:</span> <span className="font-medium text-slate-900 capitalize">{selectedPayment.status}</span></div>
              <div><span className="text-slate-600">Date:</span> <span className="font-medium text-slate-900">{selectedPayment.createdAt}</span></div>
            </div>
            <div className="p-6 border-t border-slate-200">
              <button onClick={() => setSelectedPayment(null)} className="btn-secondary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Refund Payment"
        message="Are you sure you want to refund this payment? This action cannot be undone."
        onConfirm={handleRefundConfirm}
        onCancel={handleRefundCancel}
        confirmText="Yes, Refund"
      />
    </div>
  )
}

export default PaymentManagement
