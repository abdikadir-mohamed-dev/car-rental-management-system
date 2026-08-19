import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { BOOKING_STATUS } from '../../utils/constants'

function BookingCard({ booking }) {
  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED: return 'badge-success'
      case BOOKING_STATUS.PENDING: return 'badge-warning'
      case BOOKING_STATUS.CANCELLED: return 'badge-danger'
      case BOOKING_STATUS.COMPLETED: return 'badge-info'
      default: return 'badge-gray'
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{booking.vehicle?.name || 'Vehicle'}</h3>
          <p className="text-sm text-slate-500">Booking #{booking._id?.slice(-8)}</p>
        </div>
        <span className={`badge capitalize ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Pickup</span>
          <span className="font-medium">{formatDate(booking.pickupDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Dropoff</span>
          <span className="font-medium">{formatDate(booking.dropoffDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Total</span>
          <span className="font-bold text-primary">{formatCurrency(booking.totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

export default BookingCard
