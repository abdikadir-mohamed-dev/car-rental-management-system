import { useState, useEffect } from 'react'
import { Users, Car, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react'
import { formatCurrencyKES } from '../../utils/formatCurrency'
import { BOOKING_STATUS } from '../../utils/constants'

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    recentUsers: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockStats = {
      totalUsers: 1240,
      totalVehicles: 85,
      totalBookings: 342,
      totalRevenue: 45250,
      recentBookings: [
        { _id: 'BK001', vehicle: { name: 'Toyota RAV4' }, user: { name: 'John Doe' }, totalAmount: 275 },
        { _id: 'BK002', vehicle: { name: 'Honda Accord' }, user: { name: 'Mary Wanjiku' }, totalAmount: 510 },
        { _id: 'BK003', vehicle: { name: 'BMW 3 Series' }, user: { name: 'Peter Mwangi' }, totalAmount: 340 },
        { _id: 'BK004', vehicle: { name: 'Mercedes C-Class' }, user: { name: 'Ali Hassan' }, totalAmount: 420 },
        { _id: 'BK005', vehicle: { name: 'Toyota RAV4' }, user: { name: 'James Kamau' }, totalAmount: 310 },
      ],
      recentUsers: [
        { _id: 'U001', name: 'John Doe', role: 'customer' },
        { _id: 'U002', name: 'Mary Wanjiku', role: 'customer' },
        { _id: 'U003', name: 'Peter Mwangi', role: 'driver' },
        { _id: 'U004', name: 'Ali Hassan', role: 'customer' },
        { _id: 'U005', name: 'James Kamau', role: 'staff' },
      ],
    }

    setTimeout(() => {
      setStats(mockStats)
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalUsers || 0}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Vehicles</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalVehicles || 0}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalBookings || 0}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrencyKES(stats.totalRevenue || 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recent Bookings
          </h3>
          <div className="space-y-3">
            {stats.recentBookings?.length > 0 ? (
              stats.recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{booking.vehicle?.name || 'Vehicle'}</p>
                    <p className="text-xs text-slate-500">{booking.user?.name || 'Customer'}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{formatCurrencyKES(booking.totalAmount)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent bookings</p>
            )}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Users
          </h3>
          <div className="space-y-3">
            {stats.recentUsers?.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
