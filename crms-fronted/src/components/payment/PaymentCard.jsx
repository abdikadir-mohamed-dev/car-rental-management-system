import { formatDate } from '../../utils/formatDate'
import { formatCurrency } from '../../utils/formatCurrency'
import { PAYMENT_STATUS } from '../../utils/constants'

function PaymentCard({ payment }) {
  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED: return 'badge-success'
      case PAYMENT_STATUS.PENDING: return 'badge-warning'
      case PAYMENT_STATUS.FAILED: return 'badge-danger'
      case PAYMENT_STATUS.REFUNDED: return 'badge-gray'
      default: return 'badge-gray'
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Payment #{payment._id?.slice(-8)}</h3>
          <p className="text-sm text-slate-500">{formatDate(payment.createdAt)}</p>
        </div>
        <span className={`badge capitalize ${getStatusColor(payment.status)}`}>
          {payment.status}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Method</span>
          <span className="font-medium capitalize">{payment.method || 'Card'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Amount</span>
          <span className="font-bold text-primary">{formatCurrency(payment.amount)}</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentCard
