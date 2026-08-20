import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Car,
  Calendar,
  CreditCard,
  User,
  Search,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react'
import { fetchUser } from '../../redux/slices/userSlice'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import { BOOKING_STATUS, PAYMENT_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import BookingSummary from '../../components/booking/BookingSummary'
import Loader from '../../components/common/Loader'

function CustomerDashboard() {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user || {})
  const { bookings = [] } = useSelector((state) => state.bookings || {})
  const { vehicles = [] } = useSelector((state) => state.vehicles || {})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dispatch(fetchUser()),
      dispatch(fetchBookings({})),
      dispatch(fetchVehicles({})),
    ]).finally(() => setLoading(false))
  }, [dispatch])

  const now = new Date()
  const totalBookings = Array.isArray(bookings) ? bookings.length : 0
  const upcomingBookings = Array.isArray(bookings)
    ? bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED && new Date(b.pickupDate) > now)
    : []
  const activeRentals = Array.isArray(bookings)
    ? bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED && new Date(b.pickupDate) <= now && new Date(b.dropoffDate) >= now)
    : []
  const totalSpent = Array.isArray(bookings)
    ? bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    : 0

  const featuredVehicles = Array.isArray(vehicles) ? vehicles.slice(0, 3) : []

  if (loading) return <Loader />

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {profile?.name || 'Customer'}!
        </h1>
        <p className="text-slate-600 mt-1">Here's your rental overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/customer/vehicles" className="card p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Browse Cars</p>
              <p className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                Find a ride
              </p>
            </div>
          </div>
        </Link>
        <Link to="/customer/bookings" className="card p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-slate-600">My Bookings</p>
              <p className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                View trips
              </p>
            </div>
          </div>
        </Link>
        <Link to="/customer/payments" className="card p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Payments</p>
              <p className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                History
              </p>
            </div>
          </div>
        </Link>
        <Link to="/customer/profile" className="card p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Profile</p>
              <p className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                Settings
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{totalBookings}</p>
            </div>
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Upcoming</p>
              <p className="text-2xl font-bold text-slate-900">{upcomingBookings.length}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Rental</p>
              <p className="text-2xl font-bold text-slate-900">{activeRentals.length}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Upcoming Booking</h2>
              <Link to="/customer/bookings/upcoming" className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No upcoming bookings</p>
                <Link to="/customer/vehicles" className="btn-primary text-sm">
                  Browse Vehicles
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 1).map((booking) => (
                  <BookingSummary key={booking._id} booking={booking} />
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Active Rental</h2>
              <Link to="/customer/bookings/active" className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {activeRentals.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No active rentals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRentals.slice(0, 1).map((booking) => (
                  <BookingSummary key={booking._id} booking={booking} />
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Recent Booking History</h2>
              <Link to="/customer/booking-history" className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No booking history yet</p>
                <Link to="/customer/vehicles" className="btn-primary text-sm">
                  Browse Cars
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{booking.vehicle?.name || 'Vehicle'}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatDateUtil(booking.pickupDate)} - {formatDateUtil(booking.dropoffDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:text-right gap-4">
                      <div>
                        <p className="font-bold text-primary">{formatCurrency(booking.totalAmount || 0)}</p>
                        <StatusBadge status={booking.status} type={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : booking.status === 'cancelled' ? 'danger' : 'info'} />
                      </div>
                      <Link to={`/customer/bookings/${booking._id}`} className="text-primary hover:text-primary-hover text-sm font-medium">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Featured Vehicles</h2>
              <Link
                to="/customer/vehicles"
                className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {featuredVehicles.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No vehicles available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {featuredVehicles.map((vehicle) => (
                  <Link
                    key={vehicle._id}
                    to={`/customer/vehicles/${vehicle._id}`}
                    className="block card overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {vehicle.image ? (
                          <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Car className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 group-hover:text-primary transition-colors truncate">
                          {vehicle.name}
                        </p>
                        <p className="text-sm text-slate-500 capitalize">{vehicle.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs text-slate-500">4.8</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-sm">{formatCurrency(vehicle.pricePerDay)}</p>
                        <p className="text-xs text-slate-500">/day</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
