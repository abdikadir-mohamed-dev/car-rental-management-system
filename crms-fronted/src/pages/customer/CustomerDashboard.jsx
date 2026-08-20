import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../../redux/slices/userSlice'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { Link } from 'react-router-dom'
import { Car, Calendar, CreditCard } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function CustomerDashboard() {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user)
  const { bookings } = useSelector((state) => state.bookings)

  const stats = {
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalSpent: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  }

  useEffect(() => {
    dispatch(fetchUser())
    dispatch(fetchBookings({ limit: 5 }))
  }, [dispatch])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.name || 'Customer'}!</h1>
        <p className="text-slate-600 mt-1">Here's your rental overview</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <Car className="w-6 h-6 text-success" />
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
          <Link to="/customer/bookings" className="text-primary hover:text-primary-hover font-medium text-sm">
            View All
          </Link>
        </div>
        {bookings.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{booking.vehicle?.name || 'Vehicle'}</p>
                  <p className="text-sm text-slate-500">{booking.pickupDate} - {booking.dropoffDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(booking.totalAmount)}</p>
                  <p className="text-sm text-slate-500 capitalize">{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard
