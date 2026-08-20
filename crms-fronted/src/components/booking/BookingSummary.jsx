import { Car, Calendar, MapPin, Users } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import StatusBadge from '../common/StatusBadge'

function BookingSummary({ booking, compact = false }) {
  if (!booking) return null

  const vehicle = booking.vehicle || {}
  const totalDays = booking.pickupDate && booking.dropoffDate
    ? Math.ceil((new Date(booking.dropoffDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24))
    : 0

  if (compact) {
    return (
      <div className="card p-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {vehicle.image ? (
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Car className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">{vehicle.name || 'Vehicle'}</p>
            <p className="text-sm text-slate-500">{formatDateUtil(booking.pickupDate)} - {formatDateUtil(booking.dropoffDate)}</p>
            <div className="flex items-center justify-between mt-2">
              <StatusBadge status={booking.status} type={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : booking.status === 'cancelled' ? 'danger' : 'info'} />
              <p className="font-bold text-primary text-sm">{formatCurrency(booking.totalAmount || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {vehicle.image && (
        <div className="aspect-video bg-slate-200">
          <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{vehicle.name || 'Vehicle'}</h3>
            <p className="text-sm text-slate-500 capitalize">{vehicle.type} - {vehicle.brand} {vehicle.model}</p>
          </div>
          <StatusBadge status={booking.status} type={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : booking.status === 'cancelled' ? 'danger' : 'info'} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Pickup</p>
              <p className="font-medium">{formatDateUtil(booking.pickupDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Return</p>
              <p className="font-medium">{formatDateUtil(booking.dropoffDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Pickup</p>
              <p className="font-medium">{booking.pickupLocation || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Return</p>
              <p className="font-medium">{booking.dropoffLocation || '-'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div>
            <p className="text-xs text-slate-500">Total Amount</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(booking.totalAmount || 0)}</p>
            {totalDays > 0 && (
              <p className="text-xs text-slate-500">{totalDays} day{totalDays !== 1 ? 's' : ''} x {formatCurrency(vehicle.pricePerDay || 0)}/day</p>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500">Ref: #{booking._id?.slice(-8)}</p>
      </div>
    </div>
  )
}

export default BookingSummary
