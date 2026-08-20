import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import { fetchUser } from '../../redux/slices/userSlice'
import { Link } from 'react-router-dom'
import { Car, Calendar, MapPin, CreditCard, FileText, Clock, XCircle, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import { BOOKING_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import BookingSummary from '../../components/booking/BookingSummary'

function UpcomingRentalsPage() {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user || {})
  const { bookings = [], loading } = useSelector((state) => state.bookings || {})
  const { vehicles = [] } = useSelector((state) => state.vehicles || {})

  useEffect(() => {
    dispatch(fetchUser())
    dispatch(fetchBookings({ status: BOOKING_STATUS.CONFIRMED }))
    dispatch(fetchVehicles({}))
  }, [dispatch])

  const upcomingBookings = bookings.filter(
    (b) => b.status === BOOKING_STATUS.CONFIRMED && new Date(b.pickupDate) > new Date()
  )

  const activeBookings = bookings.filter(
    (b) => b.status === BOOKING_STATUS.CONFIRMED && new Date(b.pickupDate) <= new Date() && new Date(b.dropoffDate) >= new Date()
  )

  const stats = {
    upcoming: upcomingBookings.length,
    active: activeBookings.length,
    total: bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length,
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upcoming Rentals</h1>
        <p className="text-slate-600 mt-1">View and manage your upcoming and active rentals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Upcoming</p>
              <p className="text-2xl font-bold text-slate-900">{stats.upcoming}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Now</p>
              <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Confirmed</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {(upcomingBookings.length === 0 && activeBookings.length === 0) ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming rentals</h3>
          <p className="text-slate-500 mb-6">You don't have any upcoming or active rentals at the moment.</p>
          <Link to="/customer/vehicles" className="btn-primary">Browse Vehicles</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingBookings.map((booking) => (
            <BookingSummary key={booking._id} booking={booking} />
          ))}
          {activeBookings.map((booking) => (
            <BookingSummary key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}

export default UpcomingRentalsPage
