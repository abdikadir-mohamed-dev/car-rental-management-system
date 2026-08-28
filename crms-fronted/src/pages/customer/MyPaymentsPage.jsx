import { useState, useEffect } from 'react'
import { CreditCard, TrendingDown, Clock, RefreshCw } from 'lucide-react'
import { getPayments } from '../../services/paymentService'
import { mapPayment } from '../../utils/apiMappers'

function MyPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true)
        const data = await getPayments()
        setPayments((data || []).map(mapPayment))
      } catch (err) {
        setError(err.message || 'Failed to load payments')
      } finally {
        setLoading(false)
      }
    }
    loadPayments()
  }, [])

  const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const thisMonth = payments.filter(p => {
    const date = new Date(p.date)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && p.status === 'completed'
  }).reduce((sum, p) => sum + p.amount, 0)
  const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const refunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Payments</h1>
      <p className="text-slate-600 mb-6">Your payment history and summaries</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900">KES {totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-slate-900">KES {thisMonth.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-900">KES {pending.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Refunded</p>
              <p className="text-2xl font-bold text-slate-900">KES {refunded.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Booking</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-sm font-medium text-slate-900">{payment.id}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{payment.vehicle}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{payment.date}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{payment.method}</td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-900">KES {payment.amount.toLocaleString()}</td>
                  <td className="py-4 px-4">
                     <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium capitalize ${
                      payment.status === 'completed' ? 'bg-emerald-100 text-success' :
                      payment.status === 'pending' ? 'bg-amber-100 text-warning' :
                      payment.status === 'refunded' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-danger'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyPaymentsPage
