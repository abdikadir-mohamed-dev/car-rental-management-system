import { useEffect } from 'react'
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
} from 'lucide-react'
import { fetchUser } from '../../redux/slices/userSlice'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import { formatCurrency } from '../../utils/formatCurrency'
import { BOOKING_STATUS } from '../../utils/constants'

function CustomerDashboard() {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user || {})
  const { bookings = [] } = useSelector((state) => state.bookings || {})
  const { vehicles = [] } = useSelector((state) => state.vehicles || {})

  useEffect(() => {
    dispatch(fetchUser())
    dispatch(fetchBookings({ limit: 5 }))
    dispatch(fetchVehicles({}))
  }, [dispatch])

  const stats = {
    totalBookings: Array.isArray(bookings) ? bookings.length : 0,
    activeBookings: Array.isArray(bookings)
      ? bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length
      : 0,
    totalSpent: Array.isArray(bookings)
      ? bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
      : 0,
  }

  const recentBookings = Array.isArray(bookings) ? bookings.slice(0, 3) : []
  const featuredVehicles = Array.isArray(vehicles) ? vehicles.slice(0, 3) : []

  const getStatusBadge = (status) => {
    const map = {
      [BOOKING_STATUS.CONFIRMED]: 'badge-success',
      [BOOKING_STATUS.PENDING]: 'badge-warning',
      [BOOKING_STATUS.CANCELLED]: 'badge-danger',
      [BOOKING_STATUS.COMPLETED]: 'badge-info',
    }
    return map[status] || 'badge-gray'
  }

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Active Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{stats.activeBookings}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Spent</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalSpent)}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Recent Bookings</h2>
          <Link
            to="/customer/bookings"
            className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No bookings yet</p>
            <Link to="/customer/vehicles" className="btn-primary text-sm">
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
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
                      {booking.pickupDate} - {booking.dropoffDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:text-right gap-4">
                  <div>
                    <p className="font-bold text-primary">{formatCurrency(booking.totalAmount)}</p>
                    <span className={`badge capitalize ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <Link
                key={vehicle._id}
                to={`/customer/vehicles/${vehicle._id}`}
                className="card overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="w-full h-40 bg-slate-200 flex items-center justify-center">
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                    {vehicle.name}
                  </p>
                  <p className="text-sm text-slate-500 capitalize">{vehicle.type}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-bold text-primary">{formatCurrency(vehicle.pricePerDay)}</p>
                    <span className="text-xs text-slate-500">per day</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard
