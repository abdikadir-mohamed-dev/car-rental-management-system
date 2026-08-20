import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { Link } from 'react-router-dom'
import { Car, Filter, ChevronDown } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import { BOOKING_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'

function BookingHistoryPage() {
  const dispatch = useDispatch()
  const { bookings = [], loading } = useSelector((state) => state.bookings || {})
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchBookings({}))
  }, [dispatch])

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return b.status === BOOKING_STATUS.COMPLETED || b.status === BOOKING_STATUS.CANCELLED
    return b.status === filter
  })

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Booking History</h1>
        <p className="text-slate-600 mt-1">View your completed and cancelled bookings</p>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-slate-400" />
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
          {['all', BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No booking history</h3>
          <p className="text-slate-500 mb-6">You don't have any completed or cancelled bookings yet.</p>
          <Link to="/customer/vehicles" className="btn-primary">Browse Vehicles</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {booking.vehicle?.image ? (
                      <img src={booking.vehicle.image} alt={booking.vehicle.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Car className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{booking.vehicle?.name || 'Vehicle'}</p>
                    <p className="text-sm text-slate-500">Ref: #{booking._id?.slice(-8)}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span>{formatDateUtil(booking.pickupDate)}</span>
                      <span>to</span>
                      <span>{formatDateUtil(booking.dropoffDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:text-right gap-4">
                  <div>
                    <p className="font-bold text-primary">{formatCurrency(booking.totalAmount || 0)}</p>
                    <StatusBadge status={booking.status} type={booking.status === 'completed' ? 'info' : 'danger'} />
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/customer/bookings/${booking._id}`} className="btn-secondary text-sm">View</Link>
                    <Link to={`/customer/reviews?booking=${booking._id}`} className="btn-primary text-sm">Review</Link>
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

export default BookingHistoryPage
